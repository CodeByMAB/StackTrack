/**
 * IndexedDB Service
 * Provides a more robust offline-first storage solution than localStorage
 * with better security, larger storage limits, and structured data support
 */

// Database configuration
const DB_NAME = 'StackTrackDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  WISHLIST: 'wishlist',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  BITCOIN_PRICES: 'bitcoinPrices'
};

/**
 * Initialize the database
 * @returns A promise that resolves when the database is ready
 */
const initDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Open the database
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    // Handle database upgrade (called when DB is created or version changes)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      
      // Wishlist items store with index on category
      if (!db.objectStoreNames.contains(STORES.WISHLIST)) {
        const wishlistStore = db.createObjectStore(STORES.WISHLIST, { keyPath: 'id' });
        wishlistStore.createIndex('by_category', 'category', { unique: false });
        wishlistStore.createIndex('by_priority', 'priority', { unique: false });
        wishlistStore.createIndex('by_created', 'createdAt', { unique: false });
      }
      
      // Categories store
      if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
        db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
      }
      
      // Settings store (using key/value pairs)
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
      
      // Bitcoin price history store
      if (!db.objectStoreNames.contains(STORES.BITCOIN_PRICES)) {
        const priceStore = db.createObjectStore(STORES.BITCOIN_PRICES, { keyPath: 'timestamp' });
        priceStore.createIndex('by_date', 'date', { unique: false });
      }
    };
    
    // Handle success
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    // Handle errors
    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

/**
 * Get a transaction and object store
 * @param storeName The name of the object store
 * @param mode The transaction mode (readonly or readwrite)
 * @returns A promise that resolves to the object store
 */
const getStore = async (
  storeName: string, 
  mode: IDBTransactionMode = 'readonly'
): Promise<IDBObjectStore> => {
  const db = await initDatabase();
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
};

/**
 * IndexedDBService provides methods to work with IndexedDB
 */
export const IndexedDBService = {
  /**
   * Get all items from a store
   * @param storeName The name of the object store
   * @returns A promise that resolves to all items in the store
   */
  getAll: async <T>(storeName: string): Promise<T[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await getStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result as T[]);
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Get an item by its ID
   * @param storeName The name of the object store
   * @param id The ID of the item to get
   * @returns A promise that resolves to the item, or undefined if not found
   */
  getById: async <T>(storeName: string, id: string | number): Promise<T | undefined> => {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await getStore(storeName);
        const request = store.get(id);
        
        request.onsuccess = () => {
          resolve(request.result as T);
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Add or update an item
   * @param storeName The name of the object store
   * @param item The item to add or update
   * @returns A promise that resolves when the operation is complete
   */
  put: async <T>(storeName: string, item: T): Promise<T> => {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await getStore(storeName, 'readwrite');
        const request = store.put(item);
        
        request.onsuccess = () => {
          resolve(item);
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Delete an item by its ID
   * @param storeName The name of the object store
   * @param id The ID of the item to delete
   * @returns A promise that resolves when the operation is complete
   */
  delete: async (storeName: string, id: string | number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await getStore(storeName, 'readwrite');
        const request = store.delete(id);
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Clear all items from a store
   * @param storeName The name of the object store
   * @returns A promise that resolves when the operation is complete
   */
  clear: async (storeName: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await getStore(storeName, 'readwrite');
        const request = store.clear();
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Get items by an index
   * @param storeName The name of the object store
   * @param indexName The name of the index
   * @param value The value to search for
   * @returns A promise that resolves to the matching items
   */
  getByIndex: async <T>(
    storeName: string, 
    indexName: string, 
    value: string | number
  ): Promise<T[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const store = await getStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);
        
        request.onsuccess = () => {
          resolve(request.result as T[]);
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Store names constants
   */
  stores: STORES,
  
  /**
   * Export all data from IndexedDB (useful for backups)
   * @returns A promise that resolves to an object containing all data
   */
  exportData: async (): Promise<Record<string, any[]>> => {
    const data: Record<string, any[]> = {};
    
    for (const storeName of Object.values(STORES)) {
      data[storeName] = await IndexedDBService.getAll(storeName);
    }
    
    return data;
  },
  
  /**
   * Import data into IndexedDB (useful for restoring backups)
   * @param data The data to import
   * @returns A promise that resolves when the operation is complete
   */
  importData: async (data: Record<string, any[]>): Promise<void> => {
    for (const [storeName, items] of Object.entries(data)) {
      // Clear existing data
      await IndexedDBService.clear(storeName);
      
      // Add new data
      const store = await getStore(storeName, 'readwrite');
      for (const item of items) {
        store.add(item);
      }
    }
  }
};