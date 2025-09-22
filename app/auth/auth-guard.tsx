'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function AuthGuard({
  children,
  redirectTo = '/',
  requireAuth = false,
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (requireAuth && !session) {
      // Require authentication but user is not logged in
      router.push('/auth/signin');
      return;
    }

    if (!requireAuth && session) {
      // Don't require authentication but user is logged in (auth pages)
      router.push(redirectTo);
      return;
    }
  }, [session, status, router, redirectTo, requireAuth]);

  // Show loading while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-background via-primary-muted to-primary-accent flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary-button border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-primary-text">Loading...</p>
        </div>
      </div>
    );
  }

  // For auth pages (signin/signup), don't render if user is authenticated
  if (!requireAuth && session) {
    return null;
  }

  // For protected pages, don't render if user is not authenticated
  if (requireAuth && !session) {
    return null;
  }

  return <>{children}</>;
}
