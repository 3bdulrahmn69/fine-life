'use client';

import { useState, useEffect } from 'react';

interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useOfflineStatus() {
  const [state, setState] = useState<OfflineState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
  });

  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({
        isOnline: true,
        wasOffline: prev.wasOffline || !prev.isOnline,
      }));
    };

    const handleOffline = () => {
      setState((prev) => ({
        isOnline: false,
        wasOffline: true,
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return state;
}

export function useServiceWorker() {
  const [isSupported, setIsSupported] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setIsSupported(true);

      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
      });
    }
  }, []);

  const sendMessage = (message: any) => {
    if (registration?.active) {
      registration.active.postMessage(message);
    }
  };

  const triggerSync = async (tag: string = 'transaction-sync') => {
    if (registration && 'sync' in registration) {
      try {
        await (registration.sync as any).register(tag);
        return true;
      } catch (error) {
        console.error('Background sync registration failed:', error);
        // Fallback to messaging
        sendMessage({ type: 'SYNC_TRANSACTIONS' });
        return false;
      }
    } else {
      sendMessage({ type: 'SYNC_TRANSACTIONS' });
      return false;
    }
  };

  return {
    isSupported,
    registration,
    sendMessage,
    triggerSync,
  };
}

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(0);
  const { registration } = useServiceWorker();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      switch (type) {
        case 'OFFLINE_TRANSACTION':
          setPendingCount((prev) => prev + 1);
          break;
        case 'SYNC_COMPLETE':
          setPendingCount(0);
          break;
        case 'QUEUE_COUNT':
          setPendingCount(data?.count || 0);
          break;
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);

      // Request current queue count
      if (registration?.active) {
        registration.active.postMessage({ type: 'GET_QUEUE_COUNT' });
      }
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, [registration]);

  return { pendingCount };
}
