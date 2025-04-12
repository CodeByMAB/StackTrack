import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  useColorMode,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import { WishlistGrid } from './WishlistGrid';
import { WishlistItem } from '../../types/models';
import { mockWishlistItems } from './MockData';

interface WishlistDashboardProps {
  items?: WishlistItem[];
  onAddItem?: () => void;
  onEditItem?: (item: WishlistItem) => void;
}

export const WishlistDashboard = ({ items = mockWishlistItems, onAddItem, onEditItem }: WishlistDashboardProps) => {
  const { colorMode } = useColorMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>(items);
  
  // Update filtered items when items prop changes
  useEffect(() => {
    if (searchQuery) {
      // Apply current search filter to new items
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery) || 
        item.description?.toLowerCase().includes(searchQuery)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchQuery]);
  
  // Filter and sort items
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredItems(mockWishlistItems);
      return;
    }
    
    const filtered = mockWishlistItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description?.toLowerCase().includes(query)
    );
    
    setFilteredItems(filtered);
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = e.target.value;
    setSortBy(sortOption);
    
    // Sort the items
    const sorted = [...filteredItems].sort((a, b) => {
      switch (sortOption) {
        case 'priceLowToHigh':
          return a.price - b.price;
        case 'priceHighToLow':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
        default:
          return b.createdAt - a.createdAt;
      }
    });
    
    setFilteredItems(sorted);
  };
  
  return (
    <Box width="100%">
      <Flex 
        justify="space-between" 
        align={{ base: 'start', md: 'center' }} 
        direction={{ base: 'column', md: 'row' }}
        mb={6}
        gap={4}
      >
        <Box>
          <Heading as="h2" size="lg" mb={1}>My Wishlist</Heading>
          <Text color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
            Track and plan your future bitcoin purchases
          </Text>
        </Box>
        
        <Button 
          leftIcon={<FaPlus />} 
          colorScheme="yellow" 
          onClick={onAddItem}
          size={{ base: 'md', md: 'lg' }}
          borderRadius="md"
        >
          Add New Item
        </Button>
      </Flex>
      
      {/* Filter and Sort Controls */}
      <Flex 
        mb={6} 
        direction={{ base: 'column', md: 'row' }} 
        align={{ base: 'stretch', md: 'center' }}
        gap={4}
      >
        <InputGroup maxW={{ base: '100%', md: '400px' }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color={colorMode === 'light' ? 'gray.400' : 'gray.500'} />
          </InputLeftElement>
          <Input 
            placeholder="Search wishlist..." 
            value={searchQuery}
            onChange={handleSearch}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
          />
        </InputGroup>
        
        <HStack spacing={2} ml={{ base: 0, md: 'auto' }}>
          <Icon as={FaSortAmountDown} color={colorMode === 'light' ? 'gray.500' : 'gray.400'} />
          <Select 
            value={sortBy} 
            onChange={handleSortChange}
            maxW="200px"
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
          >
            <option value="createdAt">Latest Added</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="name">Name</option>
          </Select>
        </HStack>
      </Flex>
      
      {/* Wishlist Grid */}
      <WishlistGrid 
        items={filteredItems} 
        onItemClick={onEditItem}
      />
    </Box>
  );
};