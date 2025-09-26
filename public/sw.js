const CACHE_NAME = 'fine-life-v2';
const DATA_CACHE_NAME = 'fine-life-data-v1';
const OFFLINE_QUEUE_NAME = 'fine-life-offline-queue';

const urlsToCache = [
  '/',
  '/overview',
  '/transactions',
  '/settings',
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/offline',
];

// IndexedDB Setup for offline data
const DB_NAME = 'FineLifeOfflineDB';
const DB_VERSION = 1;
const STORES = {
  TRANSACTIONS: 'transactions',
  OFFLINE_QUEUE: 'offlineQueue',
  SYNC_STATUS: 'syncStatus',
};

// Initialize IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Transactions store
      if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
        const transactionStore = db.createObjectStore(STORES.TRANSACTIONS, {
          keyPath: '_id',
        });
        transactionStore.createIndex('date', 'date');
        transactionStore.createIndex('syncStatus', 'syncStatus');
      }

      // Offline queue store
      if (!db.objectStoreNames.contains(STORES.OFFLINE_QUEUE)) {
        const queueStore = db.createObjectStore(STORES.OFFLINE_QUEUE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        queueStore.createIndex('timestamp', 'timestamp');
        queueStore.createIndex('type', 'type');
      }

      // Sync status store
      if (!db.objectStoreNames.contains(STORES.SYNC_STATUS)) {
        db.createObjectStore(STORES.SYNC_STATUS, { keyPath: 'key' });
      }
    };
  });
}

// Helper functions for IndexedDB operations
async function addToOfflineQueue(action) {
  const db = await initDB();
  const transaction = db.transaction([STORES.OFFLINE_QUEUE], 'readwrite');
  const store = transaction.objectStore(STORES.OFFLINE_QUEUE);

  const queueItem = {
    ...action,
    timestamp: Date.now(),
    attempts: 0,
    maxAttempts: 3,
  };

  return store.add(queueItem);
}

async function getOfflineQueue() {
  const db = await initDB();
  const transaction = db.transaction([STORES.OFFLINE_QUEUE], 'readonly');
  const store = transaction.objectStore(STORES.OFFLINE_QUEUE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removeFromOfflineQueue(id) {
  const db = await initDB();
  const transaction = db.transaction([STORES.OFFLINE_QUEUE], 'readwrite');
  const store = transaction.objectStore(STORES.OFFLINE_QUEUE);
  return store.delete(id);
}

async function updateOfflineTransaction(transaction) {
  const db = await initDB();
  const tx = db.transaction([STORES.TRANSACTIONS], 'readwrite');
  const store = tx.objectStore(STORES.TRANSACTIONS);

  // Mark as pending sync
  transaction.syncStatus = 'pending';
  transaction.lastModified = Date.now();

  return store.put(transaction);
}

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
      initDB(),
    ])
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim clients
      self.clients.claim(),
    ])
  );
});

// Fetch event with offline-first strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle API requests
  if (
    url.pathname.startsWith('/api/transactions') ||
    url.pathname.startsWith('/api/preferences')
  ) {
    event.respondWith(handleTransactionAPI(event.request));
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline');
          }
          throw error;
        });
    })
  );
});

// Handle transaction API requests
async function handleTransactionAPI(request) {
  const url = new URL(request.url);
  const method = request.method;

  try {
    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful GET requests
      if (method === 'GET') {
        const cache = await caches.open(DATA_CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
  } catch (error) {
    console.log('Network request failed, handling offline:', error);
  }

  // Handle offline scenarios
  if (method === 'GET') {
    // Return cached data for GET requests
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline transactions from IndexedDB
    return await getOfflineTransactions();
  }

  // Handle POST/PUT/DELETE requests offline
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    return await handleOfflineTransaction(request);
  }

  // Fallback response
  return new Response(
    JSON.stringify({ error: 'Offline - request will sync when online' }),
    {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Handle offline transaction operations
async function handleOfflineTransaction(request) {
  const url = new URL(request.url);
  const method = request.method;

  try {
    let requestData = {};
    if (request.body) {
      requestData = await request.json();
    }

    const action = {
      type: method.toLowerCase(),
      url: url.pathname,
      data: requestData,
      method: method,
      headers: Object.fromEntries(request.headers.entries()),
    };

    // Add to offline queue for later sync
    await addToOfflineQueue(action);

    // Handle locally based on method
    let response;
    if (method === 'POST') {
      response = await handleOfflineCreate(requestData);
    } else if (method === 'PUT') {
      response = await handleOfflineUpdate(url.pathname, requestData);
    } else if (method === 'DELETE') {
      response = await handleOfflineDelete(url.pathname);
    }

    // Register for background sync
    if (
      'serviceWorker' in self &&
      'sync' in self.ServiceWorkerRegistration.prototype
    ) {
      await self.registration.sync.register('transaction-sync');
    }

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Offline-Mode': 'true',
      },
    });
  } catch (error) {
    console.error('Error handling offline transaction:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to queue offline operation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle offline transaction creation
async function handleOfflineCreate(transactionData) {
  const offlineTransaction = {
    ...transactionData,
    _id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    isOffline: true,
    syncStatus: 'pending',
    createdAt: new Date().toISOString(),
    lastModified: Date.now(),
  };

  await updateOfflineTransaction(offlineTransaction);

  // Notify all clients about the offline transaction
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'OFFLINE_TRANSACTION',
      action: 'create',
      transaction: offlineTransaction,
    });
  });

  return {
    transaction: offlineTransaction,
    offline: true,
    message: 'Transaction created offline - will sync when online',
  };
}

// Handle offline transaction update
async function handleOfflineUpdate(pathname, transactionData) {
  const transactionId = pathname.split('/').pop();

  // Update in IndexedDB
  const updatedTransaction = {
    ...transactionData,
    _id: transactionId,
    syncStatus: 'pending',
    lastModified: Date.now(),
  };

  await updateOfflineTransaction(updatedTransaction);

  // Notify all clients about the offline transaction update
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'OFFLINE_TRANSACTION',
      action: 'update',
      transaction: updatedTransaction,
    });
  });

  return {
    transaction: updatedTransaction,
    offline: true,
    message: 'Transaction updated offline - will sync when online',
  };
}

// Handle offline transaction deletion
async function handleOfflineDelete(pathname) {
  const transactionId = pathname.split('/').pop();

  const db = await initDB();
  const transaction = db.transaction([STORES.TRANSACTIONS], 'readwrite');
  const store = transaction.objectStore(STORES.TRANSACTIONS);

  // Mark as deleted instead of removing
  const existingTx = await new Promise((resolve) => {
    const request = store.get(transactionId);
    request.onsuccess = () => resolve(request.result);
  });

  if (existingTx) {
    existingTx.syncStatus = 'deleted';
    existingTx.lastModified = Date.now();
    await store.put(existingTx);

    // Notify all clients about the offline transaction deletion
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'OFFLINE_TRANSACTION',
        action: 'delete',
        transactionId: transactionId,
      });
    });
  }

  return {
    success: true,
    offline: true,
    message: 'Transaction deleted offline - will sync when online',
  };
}

// Get offline transactions
async function getOfflineTransactions() {
  const db = await initDB();
  const transaction = db.transaction([STORES.TRANSACTIONS], 'readonly');
  const store = transaction.objectStore(STORES.TRANSACTIONS);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const transactions = request.result.filter(
        (tx) => tx.syncStatus !== 'deleted'
      );
      resolve(
        new Response(JSON.stringify({ transactions }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Offline-Data': 'true',
          },
        })
      );
    };
    request.onerror = () => reject(request.error);
  });
}

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'transaction-sync') {
    event.waitUntil(syncOfflineTransactions());
  }
});

// Sync offline transactions when online
async function syncOfflineTransactions() {
  console.log('Starting offline transaction sync...');

  try {
    const queueItems = await getOfflineQueue();

    for (const item of queueItems) {
      try {
        await syncQueueItem(item);
        await removeFromOfflineQueue(item.id);
        console.log('Synced offline action:', item.type);
      } catch (error) {
        console.error('Failed to sync item:', item, error);

        // Increment attempt counter
        item.attempts = (item.attempts || 0) + 1;

        if (item.attempts >= item.maxAttempts) {
          console.log('Max attempts reached, removing from queue:', item);
          await removeFromOfflineQueue(item.id);
        }
      }
    }

    // Notify clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        message: 'Offline transactions synced successfully',
      });
    });
  } catch (error) {
    console.error('Error during sync:', error);
  }
}

// Sync individual queue item
async function syncQueueItem(item) {
  const request = new Request(item.url, {
    method: item.method,
    headers: item.headers,
    body: item.data ? JSON.stringify(item.data) : null,
  });

  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }

  return response;
}

// Message event for communication with main thread
self.addEventListener('message', async (event) => {
  const { type } = event.data || {};

  switch (type) {
    case 'SYNC_TRANSACTIONS':
      event.waitUntil(syncOfflineTransactions());
      break;

    case 'GET_QUEUE_COUNT':
      try {
        const queueItems = await getOfflineQueue();
        event.ports[0]?.postMessage({
          type: 'QUEUE_COUNT',
          data: { count: queueItems.length },
        });
      } catch (error) {
        console.error('Error getting queue count:', error);
      }
      break;
  }
});
