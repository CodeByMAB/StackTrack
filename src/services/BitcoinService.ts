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

      let priceData: BitcoinPrice | null = null;

      // Try multiple APIs in order until one works
      const apis = [
        {
          name: 'Block',
          url: 'https://pricing.bitcoin.block.xyz/current-price',
          parser: (data: any) => data.USD
        },
        {
          name: 'CoinGecko',
          url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
          parser: (data: any) => data.bitcoin?.usd
        },
        {
          name: 'Coinbase',
          url: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
          parser: (data: any) => parseFloat(data.data?.amount)
        },
        {
          name: 'Blockchain.info',
          url: 'https://blockchain.info/ticker',
          parser: (data: any) => data.USD?.last
        }
      ];

      for (const api of apis) {
        try {
          console.log(`Trying ${api.name} API...`);
          const response = await fetch(api.url);

          if (!response.ok) {
            console.warn(`${api.name} API returned status ${response.status}`);
            continue;
          }

          const data = await response.json();
          const price = api.parser(data);

          if (typeof price === 'number' && price > 0) {
            priceData = {
              usd: price,
              timestamp: Date.now()
            };
            console.log(`Successfully fetched Bitcoin price from ${api.name}: $${price}`);
            break;
          }
        } catch (apiError) {
          console.warn(`${api.name} API failed:`, apiError);
          continue;
        }
      }

      if (priceData) {
        // Cache the data
        localStorage.setItem(BITCOIN_PRICE_KEY, JSON.stringify(priceData));
        return priceData;
      }

      throw new Error('All Bitcoin price APIs failed');
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);

      // Return cached data if available, even if expired
      const cachedData = localStorage.getItem(BITCOIN_PRICE_KEY);
      if (cachedData) {
        console.log('Using expired cache data');
        return JSON.parse(cachedData) as BitcoinPrice;
      }

      // If all else fails, return a fallback price
      console.warn('Using fallback Bitcoin price');
      return {
        usd: 95000, // Updated fallback price (closer to current BTC price)
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