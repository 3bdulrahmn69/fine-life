'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  FiCreditCard,
  FiDollarSign,
  FiPieChart,
} from 'react-icons/fi';
import { BiWallet } from 'react-icons/bi';
import { useTransactionData } from '../../hooks/useTransactionData';
import { formatCurrency } from '../../lib/currency';
import { format } from 'date-fns';
import SpendingCategories from '../../components/ui/spending-categories';
import TransactionModal from '../../components/ui/transaction-modal';

export default function OverviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { stats, recentTransactions, allTransactions, refetch } =
    useTransactionData();
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Calculate stats with real data
  const currentStats = [
    {
      title: 'Monthly Balance',
      value: stats ? formatCurrency(stats.balance) : '$0.00',
      change: stats && stats.balance >= 0 ? '+100%' : '0%',
      trend: stats && stats.balance >= 0 ? 'up' : 'down',
      icon: BiWallet,
      color: stats && stats.balance >= 0 ? 'bg-green-500' : 'bg-red-500',
    },
    {
      title: 'Monthly Income',
      value: stats ? formatCurrency(stats.totalIncome) : '$0.00',
      change: '+0%', // TODO: Calculate change from previous month
      trend: 'up',
      icon: FiTrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Monthly Expenses',
      value: stats ? formatCurrency(stats.totalExpenses) : '$0.00',
      change: '0%', // TODO: Calculate change from previous month
      trend: 'down',
      icon: FiTrendingDown,
      color: 'bg-red-500',
    },
    {
      title: 'Transactions',
      value: stats ? stats.transactionCount.toString() : '0',
      change: '+0%',
      trend: 'up',
      icon: FiTarget,
      color: 'bg-purple-500',
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

        <Button
          onClick={() => setShowTransactionModal(true)}
          className="bg-gradient-to-r from-primary-button to-primary-button-hover"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, index) => (
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
            <SpendingCategories
              transactions={allTransactions}
              currency="USD"
              period="month"
            />
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
                  key={transaction._id}
                  className="flex items-center justify-between p-3 bg-primary-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'income'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <FiDollarSign
                        className={`w-4 h-4 ${
                          transaction.type === 'income'
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
                        {transaction.category} •{' '}
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push('/transactions')}
            >
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
