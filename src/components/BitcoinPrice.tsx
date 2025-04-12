import { Box, Flex, Text, Skeleton, useColorMode, Icon, Link } from '@chakra-ui/react';
import { FaBitcoin, FaExternalLinkAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { BitcoinPrice as BitcoinPriceType } from '../types/models';

// Cache duration in milliseconds (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;

// Local storage key for bitcoin price data
const BITCOIN_PRICE_KEY = 'stacktrack_bitcoin_price';

// Block Bitcoin Price API URL
const BLOCK_BITCOIN_PRICE_API_URL = 'https://pricing.bitcoin.block.xyz/current-price';

export const BitcoinPrice = () => {
  const { colorMode } = useColorMode();
  const [priceData, setPriceData] = useState<BitcoinPriceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have cached data
        const cachedData = localStorage.getItem(BITCOIN_PRICE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData) as BitcoinPriceType;
          
          // Load the cached data regardless of age
          setPriceData(parsed);
          
          // If the cache is still valid, stop here
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setIsLoading(false);
            return;
          }
        }
        
        // Try to fetch fresh data from Block's Bitcoin Price API
        try {
          console.log('Fetching Bitcoin price from Block API...');
          const response = await fetch(BLOCK_BITCOIN_PRICE_API_URL);
          
          if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
          }
          
          const data = await response.json();
          
          // Check if the response contains the expected data
          // Block API returns data in a format like { USD: 12345.67 }
          if (typeof data.USD !== 'number') {
            throw new Error('Invalid price data received');
          }
          
          // Create a new price data object
          const newPriceData: BitcoinPriceType = {
            usd: data.USD,
            timestamp: Date.now()
          };
          
          // Update state and cache the data
          setPriceData(newPriceData);
          localStorage.setItem(BITCOIN_PRICE_KEY, JSON.stringify(newPriceData));
          console.log('Successfully updated Bitcoin price:', newPriceData.usd);
        } catch (fetchError) {
          console.error('Error fetching latest Bitcoin price:', fetchError);
          
          // If we have no cached data at all, show an error
          if (!priceData && !cachedData) {
            setError('Bitcoin price data currently unavailable');
          } else {
            // Otherwise, just show that we're using cached data
            console.log('Using cached Bitcoin price data');
          }
        }
      } catch (error) {
        console.error('Error handling Bitcoin price:', error);
        if (!priceData) {
          setError('Failed to load Bitcoin price data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();

    // Refresh price every 15 minutes
    const interval = setInterval(fetchPrice, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  if (error && !priceData) {
    return (
      <Box
        p={4}
        borderRadius="lg"
        bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
        boxShadow="sm"
        color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
      >
        <Flex align="center" justify="center">
          <Icon as={FaBitcoin} color="orange.500" boxSize={6} mr={2} />
          <Text fontWeight="medium">Price Unavailable</Text>
        </Flex>
        <Text textAlign="center" fontSize="xs" mt={1} color={colorMode === 'light' ? 'gray.500' : 'gray.400'}>
          Please check your connection and try again later
        </Text>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      borderRadius="lg"
      bg={colorMode === 'light' ? 'orange.50' : 'orange.900'}
      boxShadow="sm"
      color={colorMode === 'light' ? 'orange.800' : 'orange.100'}
    >
      <Flex align="center" justify="center">
        <Icon as={FaBitcoin} color="orange.500" boxSize={6} mr={2} />
        <Text fontWeight="bold" fontSize="lg">Bitcoin Price:</Text>
        <Skeleton isLoaded={!isLoading} ml={2} borderRadius="md" minW="100px">
          <Text fontWeight="bold" fontSize="lg" className="bitcoin-price-value privacy-sensitive">
            {priceData ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(priceData.usd) : 'N/A'}
          </Text>
        </Skeleton>
      </Flex>
      {priceData && (
        <Flex 
          justifyContent="center" 
          alignItems="center" 
          mt={1}
          fontSize="xs"
          color={colorMode === 'light' ? 'gray.500' : 'gray.400'}
        >
          <Text>
            {new Date(priceData.timestamp).toLocaleString()} 
            {Date.now() - priceData.timestamp > CACHE_DURATION && ' (cached)'}
          </Text>
          <Link 
            href="https://block.xyz" 
            isExternal
            display="inline-flex"
            alignItems="center"
            ml={2}
            color={colorMode === 'light' ? 'orange.600' : 'orange.200'}
            _hover={{ textDecoration: 'underline' }}
          >
            via Block <Icon as={FaExternalLinkAlt} boxSize={2} ml={1} />
          </Link>
        </Flex>
      )}
    </Box>
  );
};