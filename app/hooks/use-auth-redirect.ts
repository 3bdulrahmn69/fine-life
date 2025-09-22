'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthRedirect(options: {
  requireAuth?: boolean;
  redirectTo?: string;
  enabled?: boolean;
}) {
  const { requireAuth = false, redirectTo = '/', enabled = true } = options;
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!enabled || status === 'loading') return;

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
  }, [session, status, router, redirectTo, requireAuth, enabled]);

  return {
    session,
    status,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    shouldRedirect:
      enabled &&
      ((requireAuth && !session && status !== 'loading') ||
        (!requireAuth && !!session)),
  };
}

export function useRequireAuth() {
  return useAuthRedirect({ requireAuth: true, redirectTo: '/auth/signin' });
}

export function useRequireGuest() {
  return useAuthRedirect({ requireAuth: false, redirectTo: '/' });
}
