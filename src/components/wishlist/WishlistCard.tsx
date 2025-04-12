import { Box, Heading, Text, Badge, Image, Flex, useColorMode, Icon } from '@chakra-ui/react';
import { FaBitcoin } from 'react-icons/fa';
import { WishlistItem } from '../../types/models';

interface WishlistCardProps {
  item: WishlistItem;
  onClick?: () => void;
}

export const WishlistCard = ({ item, onClick }: WishlistCardProps) => {
  const { colorMode } = useColorMode();
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: item.currency,
  }).format(item.price);
  
  // Format sats
  const formattedSats = item.satsEquivalent 
    ? new Intl.NumberFormat().format(item.satsEquivalent)
    : null;
  
  // Priority badge colors
  const priorityColors = {
    low: { bg: 'green.500', text: 'white' },
    medium: { bg: 'yellow.500', text: 'black' },
    high: { bg: 'red.500', text: 'white' },
  };
  
  return (
    <Box
      p={4}
      borderRadius="lg"
      boxShadow="md"
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      border="1px solid"
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
    >
      {item.imageUrl && (
        <Box mb={3} borderRadius="md" overflow="hidden" h="140px">
          <Image 
            src={item.imageUrl} 
            alt={item.name} 
            w="full" 
            h="full" 
            objectFit="cover" 
          />
        </Box>
      )}
      
      <Flex justify="space-between" mb={2}>
        <Heading as="h3" size="md" noOfLines={1}>
          {item.name}
        </Heading>
        <Badge 
          bg={priorityColors[item.priority].bg} 
          color={priorityColors[item.priority].text}
        >
          {item.priority}
        </Badge>
      </Flex>
      
      {item.description && (
        <Text 
          color={colorMode === 'light' ? 'gray.600' : 'gray.300'} 
          fontSize="sm" 
          mb={3}
          noOfLines={2}
        >
          {item.description}
        </Text>
      )}
      
      <Flex mt={3} justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="md">
          {formattedPrice}
        </Text>
        
        {formattedSats && (
          <Flex 
            align="center" 
            bg={colorMode === 'light' ? 'orange.50' : 'orange.900'} 
            color={colorMode === 'light' ? 'orange.600' : 'orange.200'}
            p={1}
            pl={2}
            pr={2}
            borderRadius="md"
            fontSize="sm"
          >
            <Icon as={FaBitcoin} mr={1} color="orange.500" />
            {formattedSats} sats
          </Flex>
        )}
      </Flex>
    </Box>
  );
};