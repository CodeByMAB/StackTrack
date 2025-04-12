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

// Nostr login methods
export type NostrLoginMethod = 'nsec' | 'nos2x' | 'alby' | 'nwc';

// Nostr Wallet Connect related types
export interface NWCInfo {
  relays: string[];
  pubkey: string;
  secret: string;
  created_at: number;
  active: boolean;
}

// External API types
export interface ExternalApiProduct {
  title: string;
  description: string;
  price: number;
  currency: string;
  url: string;
  imageUrl: string;
  source: 'amazon' | 'etsy' | 'ebay' | 'zillow' | 'custom';
}

// Zillow property type
export interface ZillowProperty {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  imageUrl: string;
  url: string;
}

// Amazon product type
export interface AmazonProduct {
  title: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  url: string;
  isPrime: boolean;
}

// Etsy product type
export interface EtsyProduct {
  title: string;
  price: number;
  currency: string;
  sellerName: string;
  rating: number;
  imageUrl: string;
  url: string;
  isHandmade: boolean;
}

// Ebay product type
export interface EbayProduct {
  title: string;
  price: number;
  currency: string;
  condition: string;
  imageUrl: string;
  url: string;
  isAuction: boolean;
  endTime?: number;
}