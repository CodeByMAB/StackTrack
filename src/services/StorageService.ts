import { WishlistItem, Category, UserSettings } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

// Local storage keys
const STORAGE_KEYS = {
  WISHLIST_ITEMS: 'stacktrack_wishlist_items',
  CATEGORIES: 'stacktrack_categories',
  USER_SETTINGS: 'stacktrack_user_settings',
  BITCOIN_PRICE: 'stacktrack_bitcoin_price',
};

// Default user settings
const DEFAULT_USER_SETTINGS: UserSettings = {
  defaultCurrency: 'USD',
  theme: 'dark',
  notifications: true,
  privacyMode: false,
  autoConvertSats: true,
};

/**
 * Local storage service for managing offline-first data
 */
export const StorageService = {
  /**
   * Get all wishlist items
   */
  getWishlistItems(): WishlistItem[] {
    try {
      const items = localStorage.getItem(STORAGE_KEYS.WISHLIST_ITEMS);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error getting wishlist items:', error);
      return [];
    }
  },

  /**
   * Save a new wishlist item
   */
  saveWishlistItem(item: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>): WishlistItem {
    try {
      const items = this.getWishlistItems();
      const timestamp = Date.now();
      
      const newItem: WishlistItem = {
        ...item,
        id: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      items.push(newItem);
      localStorage.setItem(STORAGE_KEYS.WISHLIST_ITEMS, JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error('Error saving wishlist item:', error);
      throw new Error('Failed to save wishlist item');
    }
  },

  /**
   * Update an existing wishlist item
   */
  updateWishlistItem(updatedItem: WishlistItem): WishlistItem {
    try {
      const items = this.getWishlistItems();
      const index = items.findIndex(item => item.id === updatedItem.id);
      
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      // Update timestamp
      updatedItem.updatedAt = Date.now();
      
      items[index] = updatedItem;
      localStorage.setItem(STORAGE_KEYS.WISHLIST_ITEMS, JSON.stringify(items));
      return updatedItem;
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      throw new Error('Failed to update wishlist item');
    }
  },

  /**
   * Delete a wishlist item
   */
  deleteWishlistItem(id: string): boolean {
    try {
      const items = this.getWishlistItems();
      const filteredItems = items.filter(item => item.id !== id);
      
      if (filteredItems.length === items.length) {
        return false; // Item not found
      }
      
      localStorage.setItem(STORAGE_KEYS.WISHLIST_ITEMS, JSON.stringify(filteredItems));
      return true;
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      return false;
    }
  },

  /**
   * Get all categories
   */
  getCategories(): Category[] {
    try {
      const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return categories ? JSON.parse(categories) : [];
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  },

  /**
   * Save a new category
   */
  saveCategory(category: Omit<Category, 'id' | 'createdAt'>): Category {
    try {
      const categories = this.getCategories();
      const newCategory: Category = {
        ...category,
        id: uuidv4(),
        createdAt: Date.now(),
      };
      
      categories.push(newCategory);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      return newCategory;
    } catch (error) {
      console.error('Error saving category:', error);
      throw new Error('Failed to save category');
    }
  },

  /**
   * Get user settings
   */
  getUserSettings(): UserSettings {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return settings ? JSON.parse(settings) : DEFAULT_USER_SETTINGS;
    } catch (error) {
      console.error('Error getting user settings:', error);
      return DEFAULT_USER_SETTINGS;
    }
  },

  /**
   * Save user settings
   */
  saveUserSettings(settings: UserSettings): UserSettings {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw new Error('Failed to save user settings');
    }
  },

  /**
   * Clear all app data
   * WARNING: This will delete all user data
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.WISHLIST_ITEMS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.BITCOIN_PRICE);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  },
};