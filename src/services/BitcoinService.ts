import { BitcoinPrice } from '../types/models';

// Bitcoin has 100,000,000 satoshis
const SATS_PER_BITCOIN = 100000000;

// Cache duration in milliseconds (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;

// Local storage key for bitcoin price data
const BITCOIN_PRICE_KEY = 'stacktrack_bitcoin_price';

/**
 * Service for Bitcoin price conversions and API interactions
 * Using Block Bitcoin Price API: https://pricing.bitcoin.block.xyz/current-price
 */
export const BitcoinService = {
  /**
   * Get the current Bitcoin price in USD
   * Uses Block Bitcoin Price API with caching
   */
  async getBitcoinPrice(): Promise<BitcoinPrice> {
    try {
      // Check if we have cached data
      const cachedData = localStorage.getItem(BITCOIN_PRICE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData) as BitcoinPrice;

        // If the cache is still valid, use it
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          return parsed;
        }
      }

      // Fetch fresh data from Block Bitcoin Price API
      const response = await fetch('https://pricing.bitcoin.block.xyz/current-price');
      const data = await response.json();

      const priceData: BitcoinPrice = {
        usd: data.USD, // Block API uses uppercase USD
        timestamp: Date.now()
      };

      // Cache the data
      localStorage.setItem(BITCOIN_PRICE_KEY, JSON.stringify(priceData));

      return priceData;
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);

      // Return cached data if available, even if expired
      const cachedData = localStorage.getItem(BITCOIN_PRICE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData) as BitcoinPrice;
      }

      // If all else fails, return a fallback price
      return {
        usd: 61000, // Fallback price
        timestamp: Date.now()
      };
    }
  },
  
  /**
   * Convert USD to satoshis
   */
  async usdToSats(usdAmount: number): Promise<number> {
    try {
      const price = await this.getBitcoinPrice();
      return Math.round((usdAmount / price.usd) * SATS_PER_BITCOIN);
    } catch (error) {
      console.error('Error converting USD to sats:', error);
      throw new Error('Failed to convert USD to sats');
    }
  },
  
  /**
   * Convert satoshis to USD
   */
  async satsToUsd(sats: number): Promise<number> {
    try {
      const price = await this.getBitcoinPrice();
      return (sats / SATS_PER_BITCOIN) * price.usd;
    } catch (error) {
      console.error('Error converting sats to USD:', error);
      throw new Error('Failed to convert sats to USD');
    }
  },
  
  /**
   * Format satoshis with proper separators
   */
  formatSats(sats: number): string {
    return new Intl.NumberFormat().format(sats);
  },
  
  /**
   * Format USD value
   */
  formatUsd(usd: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(usd);
  }
};