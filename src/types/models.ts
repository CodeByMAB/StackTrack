// User profile from NOSTR
export interface NostrProfile {
  name?: string;
  picture?: string;
  about?: string;
  [key: string]: string | undefined;
}

// Wishlist item model
export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY'; // Add more as needed
  satsEquivalent?: number; // Calculated based on price and conversion rate
  priority: 'low' | 'medium' | 'high';
  category?: string;
  url?: string;
  imageUrl?: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  targetDate?: number; // Optional target date for purchase
  notes?: string;
}

// Category model for organizing wishlist items
export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: number;
}

// Bitcoin price data model
export interface BitcoinPrice {
  usd: number;
  timestamp: number;
  // Add more currencies as needed
}

// User settings model
export interface UserSettings {
  defaultCurrency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  privacyMode: boolean; // When true, sensitive information is hidden by default
  autoConvertSats: boolean; // Auto-convert prices to sats
  lastSyncTimestamp?: number;
}

// Generic response for API calls
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}