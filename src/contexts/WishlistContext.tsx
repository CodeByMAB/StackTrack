import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WishlistItem, Category } from '../types/models';
import { StorageService } from '../services/StorageService';
import { BitcoinService } from '../services/BitcoinService';

interface WishlistContextType {
  items: WishlistItem[];
  categories: Category[];
  isLoading: boolean;
  addItem: (item: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<WishlistItem>;
  updateItem: (item: WishlistItem) => Promise<WishlistItem>;
  deleteItem: (id: string) => Promise<boolean>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<Category>;
  convertUsdToSats: (usd: number) => Promise<number>;
  formatSats: (sats: number) => string;
  formatUsd: (usd: number) => string;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const wishlistItems = StorageService.getWishlistItems();
        const categoryItems = StorageService.getCategories();

        // Update sats equivalents based on current BTC price
        const updatedItems = await Promise.all(
          wishlistItems.map(async (item) => {
            if (item.currency === 'USD' && !item.satsEquivalent) {
              try {
                item.satsEquivalent = await BitcoinService.usdToSats(item.price);
              } catch (error) {
                console.error('Error converting price to sats:', error);
              }
            }
            return item;
          })
        );

        setItems(updatedItems);
        setCategories(categoryItems);
      } catch (error) {
        console.error('Error loading wishlist data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Add a new wishlist item
  const addItem = async (newItem: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WishlistItem> => {
    try {
      // If price is in USD, calculate sats equivalent
      if (newItem.currency === 'USD' && !newItem.satsEquivalent) {
        newItem.satsEquivalent = await BitcoinService.usdToSats(newItem.price);
      }
      
      const item = StorageService.saveWishlistItem(newItem);
      setItems(prev => [...prev, item]);
      return item;
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      throw error;
    }
  };

  // Update an existing wishlist item
  const updateItem = async (updatedItem: WishlistItem): Promise<WishlistItem> => {
    try {
      // If price changed, recalculate sats equivalent
      if (updatedItem.currency === 'USD') {
        const existingItem = items.find(item => item.id === updatedItem.id);
        if (!existingItem || existingItem.price !== updatedItem.price) {
          updatedItem.satsEquivalent = await BitcoinService.usdToSats(updatedItem.price);
        }
      }
      
      const item = StorageService.updateWishlistItem(updatedItem);
      setItems(prev => prev.map(i => i.id === item.id ? item : i));
      return item;
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      throw error;
    }
  };

  // Delete a wishlist item
  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const success = StorageService.deleteWishlistItem(id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      throw error;
    }
  };

  // Add a new category
  const addCategory = async (newCategory: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
    try {
      const category = StorageService.saveCategory(newCategory);
      setCategories(prev => [...prev, category]);
      return category;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  // Helper to convert USD to satoshis
  const convertUsdToSats = async (usd: number): Promise<number> => {
    return BitcoinService.usdToSats(usd);
  };

  // Format satoshis with appropriate separators
  const formatSats = (sats: number): string => {
    return BitcoinService.formatSats(sats);
  };

  // Format USD with appropriate currency symbol
  const formatUsd = (usd: number): string => {
    return BitcoinService.formatUsd(usd);
  };

  const value = {
    items,
    categories,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    convertUsdToSats,
    formatSats,
    formatUsd
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}