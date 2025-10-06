import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { GoogleGenAI } from '@google/genai';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Transaction from '../../../models/Transaction';
import AIInsights from '../../../models/AIInsights';
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  startOfDay,
  endOfDay,
  addDays,
} from 'date-fns';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'tip' | 'success' | 'info';
  priority: number; // 1-10, higher is more important
  actionable: string;
  category?: string;
}

// Check for existing daily AI insights
async function getDailyInsights(userId: string): Promise<AIInsight[] | null> {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  try {
    const existingInsights = await AIInsights.findOne({
      userId,
      validUntil: { $gte: todayEnd },
    }).sort({ createdAt: -1 });

    if (existingInsights) {
      return existingInsights.insights;
    }

    return null;
  } catch (error) {
    console.error('Error fetching daily insights:', error);
    return null;
  }
}

// Save AI insights to database with daily expiration
async function saveDailyInsights(
  userId: string,
  insights: AIInsight[],
  statisticsData: any
): Promise<void> {
  const tomorrow = addDays(new Date(), 1);
  const validUntil = startOfDay(tomorrow);

  try {
    // Remove any existing insights for today
    await AIInsights.deleteMany({
      userId,
      validUntil: { $gte: startOfDay(new Date()) },
    });

    // Save new insights
    await AIInsights.create({
      userId,
      insights,
      validUntil,
      statisticsSnapshot: statisticsData,
    });
  } catch (error) {
    console.error('Error saving daily insights:', error);
  }
}

interface StatisticsData {
  currentMonth: {
    income: number;
    expenses: number;
    balance: number;
    transactionCount: number;
    avgTransactionAmount: number;
    topCategory: { name: string; amount: number; percentage: number };
  };
  previousMonth: {
    income: number;
    expenses: number;
    balance: number;
  };
  trends: {
    incomeChange: number;
    expenseChange: number;
    balanceChange: number;
  };
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  patterns: {
    frequentTransactionDays: string[];
    averageTransactionSize: number;
    largestExpense: { amount: number; description: string; category: string };
    spendingVelocity: 'high' | 'moderate' | 'low';
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if only statistics are requested (skip AI for faster response)
    const { searchParams } = new URL(request.url);
    const skipAI = searchParams.get('skipAI') === 'true';
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    const checkCacheOnly = searchParams.get('checkCacheOnly') === 'true';

    await connectDB();

    // Get user preferences for currency
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Date ranges
    const currentMonth = new Date();
    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthEnd = endOfMonth(currentMonth);

    const previousMonth = subMonths(currentMonth, 1);
    const previousMonthStart = startOfMonth(previousMonth);
    const previousMonthEnd = endOfMonth(previousMonth);

    // Get current month transactions
    const currentMonthTransactions = await Transaction.find({
      userId: session.user.id,
      date: {
        $gte: currentMonthStart,
        $lte: currentMonthEnd,
      },
    }).sort({ date: -1 });

    // Get previous month transactions for comparison
    const previousMonthTransactions = await Transaction.find({
      userId: session.user.id,
      date: {
        $gte: previousMonthStart,
        $lte: previousMonthEnd,
      },
    });

    // Get last 3 months for trend analysis
    const threeMonthsAgo = subMonths(currentMonth, 3);
    const historicalTransactions = await Transaction.find({
      userId: session.user.id,
      date: {
        $gte: threeMonthsAgo,
        $lte: currentMonthEnd,
      },
    }).sort({ date: -1 });

    // Calculate statistics
    const statisticsData = calculateStatistics(
      currentMonthTransactions,
      previousMonthTransactions,
      historicalTransactions
    );

    // Generate AI insights only if not skipped
    let aiInsights: AIInsight[] = [];
    let insightsFromCache = false;

    if (!skipAI) {
      if (checkCacheOnly) {
        // Only check for cached insights, don't generate new ones
        const cachedInsights = await getDailyInsights(session.user.id);
        if (cachedInsights) {
          aiInsights = cachedInsights;
          insightsFromCache = true;
        }
        // If no cached insights, return empty array (don't generate new ones)
      } else {
        // Normal flow: check cache first, then generate if needed
        const cachedInsights = forceRefresh
          ? null
          : await getDailyInsights(session.user.id);

        if (cachedInsights && !forceRefresh) {
          aiInsights = cachedInsights;
          insightsFromCache = true;
        } else {
          // Check if user has enough transactions for meaningful insights
          const totalTransactions = historicalTransactions.length;
          if (totalTransactions < 5) {
            return NextResponse.json({
              statistics: statisticsData,
              insights: [],
              error: 'insufficient_transactions',
              message:
                'You need at least 5 transactions to generate meaningful AI insights. Please add more transactions first.',
              generatedAt: new Date().toISOString(),
              aiSkipped: false,
              fromCache: false,
            });
          }

          // Generate new insights and save to database
          aiInsights = await generateAIInsights(statisticsData, user.fullName);
          await saveDailyInsights(session.user.id, aiInsights, statisticsData);
          insightsFromCache = false;
        }
      }
    }

    return NextResponse.json({
      statistics: statisticsData,
      insights: aiInsights,
      generatedAt: new Date().toISOString(),
      aiSkipped: skipAI,
      fromCache: insightsFromCache,
    });
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    );
  }
}

function calculateStatistics(
  currentTransactions: any[],
  previousTransactions: any[],
  historicalTransactions: any[]
): StatisticsData {
  // Current month calculations
  const currentIncome = currentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentExpenses = currentTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = currentIncome - currentExpenses;

  // Previous month calculations
  const previousIncome = previousTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousExpenses = previousTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousBalance = previousIncome - previousExpenses;

  // Category analysis (current month only)
  const categoryTotals: { [key: string]: { amount: number; count: number } } =
    {};
  currentTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = { amount: 0, count: 0 };
      }
      categoryTotals[t.category].amount += t.amount;
      categoryTotals[t.category].count += 1;
    });

  const categories = Object.entries(categoryTotals)
    .map(([name, data]) => ({
      name,
      amount: data.amount,
      percentage:
        currentExpenses > 0 ? (data.amount / currentExpenses) * 100 : 0,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categories[0] || {
    name: 'None',
    amount: 0,
    percentage: 0,
  };

  // Patterns analysis
  const expenseTransactions = currentTransactions.filter(
    (t) => t.type === 'expense'
  );
  const avgTransactionAmount =
    expenseTransactions.length > 0
      ? expenseTransactions.reduce((sum, t) => sum + t.amount, 0) /
        expenseTransactions.length
      : 0;

  const largestExpense = expenseTransactions.reduce(
    (max, t) => (t.amount > max.amount ? t : max),
    { amount: 0, description: '', category: '' }
  );

  // Calculate spending velocity based on transaction frequency and amounts
  const dailyTransactionCount = currentTransactions.length / 30;
  const spendingVelocity: 'high' | 'moderate' | 'low' =
    dailyTransactionCount > 3
      ? 'high'
      : dailyTransactionCount > 1
      ? 'moderate'
      : 'low';

  // Frequent transaction days
  const transactionDays: { [key: string]: number } = {};
  currentTransactions.forEach((t) => {
    const dayOfWeek = format(new Date(t.date), 'EEEE');
    transactionDays[dayOfWeek] = (transactionDays[dayOfWeek] || 0) + 1;
  });

  const frequentTransactionDays = Object.entries(transactionDays)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([day]) => day);

  return {
    currentMonth: {
      income: currentIncome,
      expenses: currentExpenses,
      balance: currentBalance,
      transactionCount: currentTransactions.length,
      avgTransactionAmount,
      topCategory: {
        name: topCategory.name,
        amount: topCategory.amount,
        percentage: topCategory.percentage,
      },
    },
    previousMonth: {
      income: previousIncome,
      expenses: previousExpenses,
      balance: previousBalance,
    },
    trends: {
      incomeChange:
        previousIncome > 0
          ? ((currentIncome - previousIncome) / previousIncome) * 100
          : 0,
      expenseChange:
        previousExpenses > 0
          ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
          : 0,
      balanceChange: currentBalance - previousBalance,
    },
    categories,
    patterns: {
      frequentTransactionDays,
      averageTransactionSize: avgTransactionAmount,
      largestExpense,
      spendingVelocity,
    },
  };
}

async function generateAIInsights(
  data: StatisticsData,
  userName: string
): Promise<AIInsight[]> {
  try {
    const prompt = `
You are a professional financial advisor analyzing ${userName}'s spending patterns. Generate personalized financial insights based on this data:

CURRENT MONTH FINANCIAL DATA:
- Income: $${data.currentMonth.income}
- Expenses: $${data.currentMonth.expenses}  
- Net Balance: $${data.currentMonth.balance}
- Transaction Count: ${data.currentMonth.transactionCount}
- Average Transaction: $${data.currentMonth.avgTransactionAmount}
- Top Spending Category: ${data.currentMonth.topCategory.name} ($${
      data.currentMonth.topCategory.amount
    }, ${data.currentMonth.topCategory.percentage.toFixed(1)}%)

TRENDS (vs Previous Month):
- Income Change: ${data.trends.incomeChange.toFixed(1)}%
- Expense Change: ${data.trends.expenseChange.toFixed(1)}%
- Balance Change: $${data.trends.balanceChange}

SPENDING PATTERNS:
- Spending Velocity: ${data.patterns.spendingVelocity}
- Most Active Days: ${data.patterns.frequentTransactionDays.join(', ')}
- Largest Expense: $${data.patterns.largestExpense.amount} (${
      data.patterns.largestExpense.description
    })

TOP SPENDING CATEGORIES:
${data.categories
  .slice(0, 5)
  .map((cat) => `- ${cat.name}: $${cat.amount} (${cat.percentage.toFixed(1)}%)`)
  .join('\n')}

Generate exactly 3-5 actionable financial insights. Each insight should be:
1. Specific to the user's actual data
2. Actionable with clear next steps
3. Categorized as: warning, tip, success, or info

Return your response in this exact JSON format:
{
  "insights": [
    {
      "id": "unique-id",
      "title": "Short descriptive title",
      "description": "Detailed explanation of the insight",
      "type": "warning|tip|success|info",
      "priority": 1-10,
      "actionable": "Specific actionable recommendation",
      "category": "relevant category if applicable"
    }
  ]
}

Focus on:
- Spending efficiency and optimization
- Budget allocation suggestions
- Savings opportunities
- Spending pattern improvements
- Income vs expense balance
- Category-specific advice

Be encouraging but realistic. Provide specific, actionable advice.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });
    const text = response.text;

    // Parse the AI response
    try {
      if (!text) {
        throw new Error('No response text received from AI');
      }

      // Clean the response - remove markdown code blocks if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const aiResponse = JSON.parse(cleanedText);
      return aiResponse.insights || [];
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to rule-based insights
      return generateFallbackInsights(data);
    }
  } catch (error) {
    console.error('AI generation error:', error);
    // Fallback to rule-based insights
    return generateFallbackInsights(data);
  }
}

function generateFallbackInsights(data: StatisticsData): AIInsight[] {
  const insights: AIInsight[] = [];

  // High spending alert
  if (data.currentMonth.expenses > data.currentMonth.income * 0.9) {
    insights.push({
      id: 'high-spending-warning',
      title: 'High Spending Alert',
      description: `Your expenses (${(
        (data.currentMonth.expenses / data.currentMonth.income) *
        100
      ).toFixed(1)}% of income) are consuming most of your income this month.`,
      type: 'warning',
      priority: 9,
      actionable: `Try to reduce spending in ${data.currentMonth.topCategory.name} category by 20% to improve your financial balance.`,
      category: data.currentMonth.topCategory.name,
    });
  }

  // Savings success
  if (data.currentMonth.balance > data.currentMonth.income * 0.2) {
    insights.push({
      id: 'excellent-savings',
      title: 'Excellent Savings Rate!',
      description: `You're saving over 20% of your income this month. This puts you ahead of most people financially.`,
      type: 'success',
      priority: 8,
      actionable:
        'Consider investing these savings in a diversified portfolio or building an emergency fund.',
    });
  }

  // Category concentration
  if (data.currentMonth.topCategory.percentage > 40) {
    insights.push({
      id: 'category-concentration',
      title: 'Spending Concentration Risk',
      description: `${data.currentMonth.topCategory.percentage.toFixed(
        1
      )}% of your expenses are in ${
        data.currentMonth.topCategory.name
      }. This concentration might indicate an imbalance.`,
      type: 'info',
      priority: 6,
      actionable: `Review your ${data.currentMonth.topCategory.name} expenses and see if any can be optimized or reduced.`,
      category: data.currentMonth.topCategory.name,
    });
  }

  // Positive trend
  if (data.trends.balanceChange > 0) {
    insights.push({
      id: 'improving-trend',
      title: 'Financial Improvement Trend',
      description: `Your net balance improved by $${Math.abs(
        data.trends.balanceChange
      )} compared to last month.`,
      type: 'success',
      priority: 7,
      actionable:
        'Keep up this positive trend by maintaining current spending habits and look for additional income opportunities.',
    });
  }

  // High transaction frequency
  if (data.patterns.spendingVelocity === 'high') {
    insights.push({
      id: 'frequent-transactions',
      title: 'High Transaction Frequency',
      description: `You made ${data.currentMonth.transactionCount} transactions this month. Frequent small purchases might indicate impulse spending.`,
      type: 'tip',
      priority: 5,
      actionable:
        'Try the 24-hour rule: wait a day before making non-essential purchases to reduce impulse spending.',
    });
  }

  return insights.slice(0, 5); // Limit to 5 insights
}
