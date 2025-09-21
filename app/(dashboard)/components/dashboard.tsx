'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { BiHeart } from 'react-icons/bi';
import Link from 'next/link';

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Get current tab from pathname
  const getCurrentTab = () => {
    if (pathname === '/transactions') return 'transactions';
    if (pathname === '/budget') return 'budget';
    if (pathname === '/goals') return 'goals';
    return 'overview';
  };

  const activeTab = getCurrentTab();

  return (
    <div className="min-h-screen bg-primary-background">
      {/* Header */}
      <header className="bg-primary-card border-b border-primary-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-button to-primary-button-hover rounded-lg flex items-center justify-center">
                  <BiHeart className="w-5 h-5 text-primary-button-foreground" />
                </div>
                <span className="text-xl font-bold text-primary-foreground">
                  Fine Life
                </span>
              </div>

              <nav className="hidden md:flex space-x-6">
                <Link href="/">
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-primary-muted text-primary-foreground'
                        : 'text-primary-muted-foreground hover:text-primary-foreground'
                    }`}
                  >
                    Overview
                  </button>
                </Link>
                <Link href="/transactions">
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'transactions'
                        ? 'bg-primary-muted text-primary-foreground'
                        : 'text-primary-muted-foreground hover:text-primary-foreground'
                    }`}
                  >
                    Transactions
                  </button>
                </Link>
                <Link href="/budget">
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'budget'
                        ? 'bg-primary-muted text-primary-foreground'
                        : 'text-primary-muted-foreground hover:text-primary-foreground'
                    }`}
                  >
                    Budget
                  </button>
                </Link>
                <Link href="/goals">
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'goals'
                        ? 'bg-primary-muted text-primary-foreground'
                        : 'text-primary-muted-foreground hover:text-primary-foreground'
                    }`}
                  >
                    Goals
                  </button>
                </Link>
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-muted rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-primary-muted-foreground" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-primary-foreground">
                      {session?.user?.name || 'User'}
                    </p>
                  </div>
                </div>

                <Link href="/settings" className="flex items-center">
                  <Button variant="ghost" size="sm">
                    <FiSettings className="w-4 h-4" />
                  </Button>
                </Link>

                <Button variant="destructive" size="sm" onClick={handleSignOut}>
                  <FiLogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
