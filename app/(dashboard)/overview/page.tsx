'use client';

import { useSession } from 'next-auth/react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiTarget,
  FiPlus,
  FiPieChart,
  FiBarChart,
  FiCreditCard,
  FiDollarSign,
} from 'react-icons/fi';
import { BiWallet } from 'react-icons/bi';

export default function OverviewPage() {
  const { data: session } = useSession();

  const stats = [
    {
      title: 'Total Balance',
      value: '$12,450.32',
      change: '+12.5%',
      trend: 'up',
      icon: BiWallet,
      color: 'bg-green-500',
    },
    {
      title: 'Monthly Income',
      value: '$4,230.00',
      change: '+8.2%',
      trend: 'up',
      icon: FiTrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Monthly Expenses',
      value: '$2,180.50',
      change: '-3.1%',
      trend: 'down',
      icon: FiTrendingDown,
      color: 'bg-red-500',
    },
    {
      title: 'Savings Goal',
      value: '68%',
      change: '+15.3%',
      trend: 'up',
      icon: FiTarget,
      color: 'bg-purple-500',
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: 'Grocery Shopping',
      amount: -85.5,
      date: '2025-09-19',
      category: 'Food',
    },
    {
      id: 2,
      description: 'Salary Deposit',
      amount: 4230.0,
      date: '2025-09-18',
      category: 'Income',
    },
    {
      id: 3,
      description: 'Netflix Subscription',
      amount: -15.99,
      date: '2025-09-17',
      category: 'Entertainment',
    },
    {
      id: 4,
      description: 'Gas Station',
      amount: -45.2,
      date: '2025-09-16',
      category: 'Transportation',
    },
    {
      id: 5,
      description: 'Coffee Shop',
      amount: -12.5,
      date: '2025-09-15',
      category: 'Food',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-primary-muted-foreground mt-2">
            Here&apos;s your financial overview for today,{' '}
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <Button className="bg-gradient-to-r from-primary-button to-primary-button-hover">
          <FiPlus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-primary-card border-primary-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-primary-foreground mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Chart */}
        <Card className="bg-primary-card border-primary-border">
          <CardHeader>
            <CardTitle className="flex items-center text-primary-foreground">
              <FiPieChart className="w-5 h-5 mr-2" />
              Spending Categories
            </CardTitle>
            <CardDescription>
              Your spending breakdown for this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-primary-muted-foreground">
              <div className="text-center">
                <FiBarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-primary-card border-primary-border">
          <CardHeader>
            <CardTitle className="flex items-center text-primary-foreground">
              <FiCreditCard className="w-5 h-5 mr-2" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-primary-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      <FiDollarSign
                        className={`w-4 h-4 ${
                          transaction.amount > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-primary-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-primary-muted-foreground">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
