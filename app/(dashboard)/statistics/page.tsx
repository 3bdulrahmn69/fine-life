'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart,
  FiPieChart,
  FiTarget,
  FiDollarSign,
  FiCalendar,
  FiInfo,
  FiCpu,
  FiZap,
} from 'react-icons/fi';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { formatCurrency } from '../../lib/currency';
import PageHeader from '../../components/ui/page-header';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string; // Changed to string to identify the icon type
  description?: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'tip' | 'success' | 'info';
  priority: number;
  actionable: string;
  category?: string;
}

export default function StatisticsPage() {
  const { data: session } = useSession();
  const { preferences } = useUserPreferences();

  // Helper function to render icons based on string identifier
  const renderIcon = (iconType: string, className = 'w-6 h-6') => {
    switch (iconType) {
      case 'trending-up':
        return <FiTrendingUp className={className} />;
      case 'trending-down':
        return <FiTrendingDown className={className} />;
      case 'dollar-sign':
        return <FiDollarSign className={className} />;
      case 'bar-chart':
        return <FiBarChart className={className} />;
      case 'pie-chart':
        return <FiPieChart className={className} />;
      case 'calendar':
        return <FiCalendar className={className} />;
      default:
        return <FiBarChart className={className} />;
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [statisticsData, setStatisticsData] = useState<StatCard[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [hasLoadedInsights, setHasLoadedInsights] = useState(false);
  const [hasLoadedStatistics, setHasLoadedStatistics] = useState(false);
  const [insufficientTransactions, setInsufficientTransactions] =
    useState(false);
  const [insufficientTransactionsMessage, setInsufficientTransactionsMessage] =
    useState('');

  // Load cached statistics from localStorage on mount
  useEffect(() => {
    if (!session?.user?.id) return;

    const cachedStats = localStorage.getItem(`statistics_${session.user.id}`);
    if (cachedStats) {
      try {
        const { data, timestamp } = JSON.parse(cachedStats);
        // Use cached data if it's less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setStatisticsData(data);
          setHasLoadedStatistics(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing cached statistics:', error);
      }
    }

    // Load fresh data if no cache or cache expired
    if (!hasLoadedStatistics) {
      loadStatistics();
    }
  }, [session?.user?.id]);

  // Automatically check for cached AI insights when session is available
  useEffect(() => {
    if (!session?.user?.id || hasLoadedInsights) return;

    // Try to load AI insights from database cache automatically
    checkForCachedInsights();
  }, [session?.user?.id, hasLoadedInsights]);

  const loadStatistics = async () => {
    // Don't load if already loaded (cached)
    if (hasLoadedStatistics && statisticsData.length > 0) {
      return;
    }

    try {
      setIsLoading(true);

      // Use skipAI parameter for faster statistics-only loading
      const response = await fetch('/api/statistics/ai-insights?skipAI=true');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();

      // Convert backend data to UI format (only statistics, not AI insights)
      if (data && data.statistics) {
        const stats = convertBackendDataToUI(data.statistics);
        setStatisticsData(stats);
        setHasLoadedStatistics(true);

        // Cache statistics in localStorage for 5 minutes
        if (session?.user?.id) {
          const cacheData = {
            data: stats,
            timestamp: Date.now(),
          };
          localStorage.setItem(
            `statistics_${session.user.id}`,
            JSON.stringify(cacheData)
          );
        }
      } else {
        console.error('Invalid data structure received:', data);
        setStatisticsData([]);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      setStatisticsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for cached AI insights automatically (don't generate new ones)
  const checkForCachedInsights = async () => {
    try {
      setLoadingInsights(true);

      // Only check for existing cached insights, don't generate new ones
      const response = await fetch(
        '/api/statistics/ai-insights?checkCacheOnly=true'
      );
      if (!response.ok) {
        throw new Error('Failed to check for cached insights');
      }

      const data = await response.json();

      // Only set insights if they exist in cache
      if (data.insights && data.insights.length > 0) {
        setAiInsights(data.insights);
        setHasLoadedInsights(true);
      }
      // If no cached insights, hasLoadedInsights remains false
      // and the "Get AI Insights" button will be shown
    } catch (error) {
      console.error('Error checking for cached insights:', error);
      // On error, don't set insights, let user click the button
    } finally {
      setLoadingInsights(false);
    }
  };

  // Load AI insights manually when user clicks the button
  const loadAIInsights = async (forceRefresh = false) => {
    // Don't fetch if already loaded (cached) unless forcing refresh
    if (!forceRefresh && hasLoadedInsights && aiInsights.length > 0) {
      return;
    }

    try {
      setLoadingInsights(true);

      // Don't skip AI for this call - we want the full insights
      // Add forceRefresh parameter to bypass daily cache if needed
      const url = forceRefresh
        ? '/api/statistics/ai-insights?forceRefresh=true'
        : '/api/statistics/ai-insights';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch AI insights');
      }

      const data = await response.json();

      // Check for insufficient transactions error
      if (data.error === 'insufficient_transactions') {
        setInsufficientTransactions(true);
        setInsufficientTransactionsMessage(data.message);
        setAiInsights([]);
        setHasLoadedInsights(false);
      } else {
        setAiInsights(data.insights || []);
        setHasLoadedInsights(true);
        setInsufficientTransactions(false);
        setInsufficientTransactionsMessage('');
      }
    } catch (error) {
      console.error('Error loading AI insights:', error);
      setAiInsights([]);
      setInsufficientTransactions(false);
    } finally {
      setLoadingInsights(false);
    }
  };

  const convertBackendDataToUI = (backendStats: any): StatCard[] => {
    if (
      !backendStats ||
      !backendStats.currentMonth ||
      !backendStats.trends ||
      !preferences
    ) {
      return [];
    }

    // Ensure all required properties exist with safe defaults
    const currentMonth = backendStats.currentMonth || {};
    const trends = backendStats.trends || {};
    const topCategory = currentMonth.topCategory || {
      name: 'N/A',
      amount: 0,
      percentage: 0,
    };

    return [
      {
        title: 'Monthly Income',
        value: formatCurrency(currentMonth.income || 0, preferences.currency),
        change: `${(trends.incomeChange || 0) >= 0 ? '+' : ''}${(
          trends.incomeChange || 0
        ).toFixed(1)}%`,
        changeType: (trends.incomeChange || 0) >= 0 ? 'positive' : 'negative',
        icon: 'trending-up',
        description: 'Compared to last month',
      },
      {
        title: 'Monthly Expenses',
        value: formatCurrency(currentMonth.expenses || 0, preferences.currency),
        change: `${(trends.expenseChange || 0) >= 0 ? '+' : ''}${(
          trends.expenseChange || 0
        ).toFixed(1)}%`,
        changeType: (trends.expenseChange || 0) <= 0 ? 'positive' : 'negative',
        icon: 'trending-down',
        description: 'Compared to last month',
      },
      {
        title: 'Net Balance',
        value: formatCurrency(
          Math.abs(currentMonth.balance || 0),
          preferences.currency
        ),
        change: `${(trends.balanceChange || 0) >= 0 ? '+' : ''}${formatCurrency(
          Math.abs(trends.balanceChange || 0),
          preferences.currency
        )}`,
        changeType: (trends.balanceChange || 0) >= 0 ? 'positive' : 'negative',
        icon: 'dollar-sign',
        description: 'Monthly net change',
      },
      {
        title: 'Average Transaction',
        value: formatCurrency(
          currentMonth.avgTransactionAmount || 0,
          preferences.currency
        ),
        change: `${currentMonth.transactionCount || 0} transactions`,
        changeType: 'neutral',
        icon: 'bar-chart',
        description: 'This month',
      },
      {
        title: 'Top Spending Category',
        value: topCategory.name || 'N/A',
        change: formatCurrency(topCategory.amount || 0, preferences.currency),
        changeType: 'neutral',
        icon: 'pie-chart',
        description: `${(topCategory.percentage || 0).toFixed(1)}% of expenses`,
      },
      {
        title: 'Total Transactions',
        value: (currentMonth.transactionCount || 0).toString(),
        change: `This month only`,
        changeType: 'neutral',
        icon: 'calendar',
        description: 'Current month activity',
      },
    ];
  };

  // No longer needed - using AI backend

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-primary-muted-foreground">
          Please sign in to view your statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<FiBarChart className="w-5 h-5 text-primary-accent" />}
        title="Financial Statistics"
        subtitle="AI-powered insights into your financial patterns"
      />{' '}
      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-primary-card rounded-xl p-6 border border-primary-border animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-6 h-6 bg-primary-muted-foreground/20 rounded"></div>
                  <div className="w-12 h-12 bg-primary-muted-foreground/20 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-primary-muted-foreground/20 rounded"></div>
                  <div className="w-32 h-6 bg-primary-muted-foreground/20 rounded"></div>
                  <div className="w-20 h-3 bg-primary-muted-foreground/20 rounded"></div>
                </div>
              </div>
            ))
          : statisticsData.map((stat, index) => (
              <div
                key={index}
                className="bg-primary-card rounded-xl p-6 border border-primary-border hover:border-primary-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-primary-muted-foreground">
                    {stat.title}
                  </h3>
                  <div className="p-3 rounded-full bg-primary-accent/10 text-primary-accent">
                    {renderIcon(stat.icon)}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary-foreground">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === 'positive'
                          ? 'text-green-500'
                          : stat.changeType === 'negative'
                          ? 'text-red-500'
                          : 'text-primary-muted-foreground'
                      }`}
                    >
                      {stat.change}
                    </span>
                    {stat.changeType !== 'neutral' && (
                      <div
                        className={`${
                          stat.changeType === 'positive'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {stat.changeType === 'positive' ? (
                          <FiTrendingUp className="w-4 h-4" />
                        ) : (
                          <FiTrendingDown className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                  {stat.description && (
                    <p className="text-xs text-primary-muted-foreground">
                      {stat.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
      </div>
      {/* AI Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiCpu className="w-5 h-5 text-primary-accent" />
            <h2 className="text-xl font-semibold text-primary-foreground">
              AI Financial Insights
            </h2>
          </div>

          {!hasLoadedInsights && !loadingInsights && (
            <button
              onClick={() => loadAIInsights()}
              disabled={loadingInsights}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiZap className="w-4 h-4" />
              <span>Get AI Insights</span>
            </button>
          )}

          {hasLoadedInsights && !loadingInsights && (
            <button
              onClick={() => {
                setHasLoadedInsights(false);
                setAiInsights([]);
                loadAIInsights(true); // Force refresh to generate new insights
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-card border border-primary-border text-primary-foreground rounded-lg hover:bg-primary-card/80 transition-colors"
            >
              <FiZap className="w-4 h-4" />
              <span>Generate New Insights</span>
            </button>
          )}
        </div>

        {aiInsights.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`bg-primary-card rounded-xl p-6 border-l-4 ${
                  insight.type === 'warning'
                    ? 'border-l-red-500 bg-red-500/5'
                    : insight.type === 'success'
                    ? 'border-l-green-500 bg-green-500/5'
                    : insight.type === 'tip'
                    ? 'border-l-blue-500 bg-blue-500/5'
                    : 'border-l-primary-accent bg-primary-accent/5'
                } border-r border-t border-b border-primary-border`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      insight.type === 'warning'
                        ? 'bg-red-500/10 text-red-500'
                        : insight.type === 'success'
                        ? 'bg-green-500/10 text-green-500'
                        : insight.type === 'tip'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-primary-accent/10 text-primary-accent'
                    }`}
                  >
                    {insight.type === 'warning' ? (
                      <FiTarget className="w-5 h-5" />
                    ) : insight.type === 'success' ? (
                      <FiTrendingUp className="w-5 h-5" />
                    ) : insight.type === 'tip' ? (
                      <FiZap className="w-5 h-5" />
                    ) : (
                      <FiInfo className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-primary-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    {insight.actionable && (
                      <div className="flex items-start space-x-2 p-3 bg-primary-card/50 rounded-lg">
                        <FiZap className="w-4 h-4 text-primary-accent mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-primary-foreground">
                          <strong>Actionable tip:</strong> {insight.actionable}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : loadingInsights ? (
          <div className="text-center py-12">
            <div className="bg-primary-card/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-accent"></div>
            </div>
            <h3 className="text-lg font-medium text-primary-foreground mb-2">
              Generating AI Insights...
            </h3>
            <p className="text-primary-muted-foreground">
              Our AI is analyzing your financial data to provide personalized
              insights.
            </p>
          </div>
        ) : insufficientTransactions ? (
          <div className="text-center py-12">
            <div className="bg-red-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiTarget className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-primary-foreground mb-2">
              Not Enough Transaction Data
            </h3>
            <p className="text-primary-muted-foreground mb-4">
              {insufficientTransactionsMessage}
            </p>
            <button
              onClick={() => (window.location.href = '/transactions')}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 transition-colors mx-auto"
            >
              <FiTarget className="w-4 h-4" />
              <span>Add Transactions</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-primary-card/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiCpu className="w-8 h-8 text-primary-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-primary-foreground mb-2">
              Ready for AI Insights
            </h3>
            <p className="text-primary-muted-foreground mb-4">
              Click "Get AI Insights" to receive personalized financial
              recommendations based on your transaction history.
            </p>
            <button
              onClick={() => loadAIInsights()}
              disabled={loadingInsights}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-accent text-white rounded-lg hover:bg-primary-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
            >
              <FiZap className="w-4 h-4" />
              <span>Get AI Insights</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
