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
import { useUserPreferences } from '../../hooks/useUserPreferences';

export default function OverviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { preferences } = useUserPreferences();
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
    <>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-2">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-primary-muted-foreground text-sm sm:text-base leading-relaxed">
              Here&apos;s your financial overview for{' '}
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>

          <Button
            onClick={() => setShowTransactionModal(true)}
            className="bg-gradient-to-r from-primary-button to-primary-button-hover w-full sm:w-auto mt-4 sm:mt-0"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>{' '}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-primary-card border-primary-border hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-muted-foreground mb-2">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      {stat.trend === 'up' ? (
                        <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === 'up'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center ml-4 flex-shrink-0`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Spending Chart */}
          <Card className="bg-primary-card border-primary-border overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-primary-foreground text-xl">
                <FiPieChart className="w-5 h-5 mr-3" />
                Spending Categories
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Your spending breakdown for this month
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <SpendingCategories
                transactions={allTransactions}
                currency={preferences.currency}
                period="month"
              />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-primary-card border-primary-border flex flex-col min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-6 flex-shrink-0">
              <CardTitle className="flex items-center text-primary-foreground text-xl">
                <FiCreditCard className="w-5 h-5 mr-3" />
                Recent Transactions
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Your latest financial activity
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
              {/* Transactions Container - Scrollable */}
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-border scrollbar-track-transparent">
                <div className="space-y-4 pr-1">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-primary-muted/30 rounded-lg gap-3 hover:bg-primary-muted/40 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              transaction.type === 'income'
                                ? 'bg-green-100'
                                : 'bg-red-100'
                            }`}
                          >
                            <FiDollarSign
                              className={`w-5 h-5 ${
                                transaction.type === 'income'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-primary-foreground text-sm sm:text-base truncate">
                              {transaction.description}
                            </p>
                            <p className="text-xs sm:text-sm text-primary-muted-foreground">
                              <span className="capitalize">
                                {transaction.category}
                              </span>{' '}
                              •{' '}
                              {format(
                                new Date(transaction.date),
                                'MMM dd, yyyy'
                              )}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-semibold text-sm sm:text-base self-end sm:self-center ${
                            transaction.type === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(
                            transaction.amount,
                            preferences.currency
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-primary-muted-foreground">
                      <FiCreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No transactions yet</p>
                      <p className="text-xs mt-1">
                        Add your first transaction to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Button - Always at bottom */}
              <div className="flex-shrink-0 pt-4 sm:pt-6 border-t border-primary-border/50 mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/transactions')}
                >
                  View All Transactions
                </Button>
              </div>
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
          currency={preferences.currency}
        />
      </div>
    </>
  );
}
