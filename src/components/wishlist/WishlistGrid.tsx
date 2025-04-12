import { SimpleGrid, Text, Box, Flex, Center, Spinner, useColorMode } from '@chakra-ui/react';
import { WishlistCard } from './WishlistCard';
import { WishlistItem, Category } from '../../types/models';
import { mockCategories } from './MockData';

interface WishlistGridProps {
  items: WishlistItem[];
  isLoading?: boolean;
  onItemClick?: (item: WishlistItem) => void;
  categories?: Category[];
}

export const WishlistGrid = ({ items, isLoading = false, onItemClick, categories = mockCategories }: WishlistGridProps) => {
  const { colorMode } = useColorMode();

  if (isLoading) {
    return (
      <Center p={8}>
        <Spinner size="xl" thickness="4px" color="yellow.500" />
      </Center>
    );
  }

  if (!items.length) {
    return (
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        p={8} 
        bg={colorMode === 'light' ? 'gray.50' : 'gray.700'} 
        borderRadius="lg"
        minH="200px"
      >
        <Text 
          fontSize="lg" 
          fontWeight="medium" 
          color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
          textAlign="center"
        >
          No items in your wishlist yet. Add your first item to get started!
        </Text>
      </Flex>
    );
  }

  return (
    <SimpleGrid 
      columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
      spacing={6}
      w="full"
    >
      {items.map(item => (
        <WishlistCard 
          key={item.id} 
          item={item} 
          categories={categories}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        />
      ))}
    </SimpleGrid>
  );
};