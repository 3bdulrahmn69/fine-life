'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent } from '../../components/ui/card';
import { PageLoading } from '../../components/ui/spinner';
import { FiUser, FiShield, FiSettings, FiX } from 'react-icons/fi';
import Link from 'next/link';
import BackButton from '../../components/ui/back-button';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <PageLoading text="Loading settings..." />;
  }

  if (!session) {
    return <PageLoading text="Redirecting to login..." />;
  }

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: FiUser,
      href: '/settings/personal',
      color: 'text-blue-500',
    },
    {
      id: 'security',
      label: 'Security',
      icon: FiShield,
      href: '/settings/security',
      color: 'text-green-500',
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: FiSettings,
      href: '/settings/preferences',
      color: 'text-purple-500',
    },
  ];
  const currentTab = pathname.split('/').pop() || 'personal';

  return (
    <div className="min-h-screen bg-primary-background">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-primary-card border-primary-border">
              <CardContent className="p-6">
                {/* Back Button */}
                <div className="mb-4 pb-4 border-b border-primary-border">
                  <BackButton
                    href="/settings"
                    label="Back to Settings"
                    variant="ghost"
                    className="text-primary-text hover:text-primary-foreground w-full justify-start"
                  />
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;

                    return (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        replace
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-primary-button text-primary-button-foreground'
                            : 'text-primary-text hover:bg-primary-button/10 hover:text-primary-foreground'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${tab.color}`} />
                        <span className="font-medium">{tab.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  messageType === 'success'
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p>{message}</p>
                  <button
                    onClick={() => setMessage('')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
