'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { PageLoading } from '../../components/ui/spinner';
import { FiUser, FiShield, FiSettings, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import BackButton from '../../components/ui/back-button';

const settingsOptions = [
  {
    title: 'Personal Information',
    description: 'Manage your personal details, username, and birth date',
    icon: FiUser,
    href: '/settings/personal',
    color: 'text-blue-500',
  },
  {
    title: 'Security',
    description: 'Update your password and manage account security',
    icon: FiShield,
    href: '/settings/security',
    color: 'text-green-500',
  },
  {
    title: 'Preferences',
    description: 'Customize your app experience and theme',
    icon: FiSettings,
    href: '/settings/preferences',
    color: 'text-purple-500',
  },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-primary-bg text-primary-text">
        <PageLoading />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-primary-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header with Back Button */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <BackButton
                label="Back"
                variant="ghost"
                className="text-primary-text hover:text-primary-foreground"
              />
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground mb-2">
              Settings
            </h1>
            <p className="text-primary-text">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Settings Options */}
          <div className="grid gap-4 md:gap-6">
            {settingsOptions.map((option) => (
              <Link
                key={option.href}
                href={option.href}
                className="block group"
              >
                <Card className="bg-primary-card border-primary-border hover:bg-primary-hover transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`${option.color} group-hover:scale-110 transition-transform`}
                        >
                          <option.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-primary-foreground group-hover:text-primary-accent transition-colors">
                            {option.title}
                          </h3>
                          <p className="text-sm text-primary-text">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <FiChevronRight className="w-5 h-5 text-primary-text group-hover:text-primary-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Info */}
          <Card className="bg-primary-card border-primary-border">
            <CardHeader>
              <CardTitle className="text-primary-foreground">
                Account Overview
              </CardTitle>
              <CardDescription>
                Quick overview of your account status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-primary-text">Signed in as:</span>
                <span className="text-primary-foreground font-medium">
                  {session?.user?.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-text">Account created:</span>
                <span className="text-primary-foreground font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
