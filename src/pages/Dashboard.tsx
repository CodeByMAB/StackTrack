import { Box, Container, VStack, Heading, Text, useColorMode, Button, Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure, useToast, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WishlistDashboard } from '../components/wishlist/WishlistDashboard';
import { ItemFormModal } from '../components/wishlist/ItemFormModal';
import { BitcoinPrice } from '../components/BitcoinPrice';
import { WishlistItem } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import { mockWishlistItems } from '../components/wishlist/MockData';
import { SecurityService } from '../services/SecurityService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const toast = useToast();
  const { profile, pubkey } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  /***************************************************************************
   * ⚠️⚠️⚠️ PRODUCTION CHANGE NEEDED ⚠️⚠️⚠️
   * 
   * For production:
   * 1. Use IndexedDB instead of localStorage for better offline support
   * 2. Remove references to mockWishlistItems
   * 3. Consider implementing a proper sync mechanism with backend if needed
   * 
   * See the IndexedDBService for proper implementation
   ***************************************************************************/
  
  // Initialize wishlist items from localStorage or use mock data as fallback
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    const savedItems = localStorage.getItem('wishlist_items');
    return savedItems ? JSON.parse(savedItems) : mockWishlistItems;
  });
  const [selectedItem, setSelectedItem] = useState<WishlistItem | undefined>(undefined);
  
  // Modal controls
  const { 
    isOpen: isItemModalOpen, 
    onOpen: onItemModalOpen, 
    onClose: onItemModalClose 
  } = useDisclosure();

  useEffect(() => {
    // Check if user is authenticated using SecurityService
    if (!SecurityService.isAuthenticated()) {
      // Redirect to home if not authenticated
      navigate('/');
      return;
    }
    
    // Refresh the authentication timer
    SecurityService.refreshAuthentication();
    
    // Set up interval to periodically refresh authentication
    const refreshInterval = setInterval(() => {
      if (SecurityService.isAuthenticated()) {
        SecurityService.refreshAuthentication();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [navigate]);

  // Handle adding an item
  const handleAddItem = () => {
    setSelectedItem(undefined); // No item selected means adding new
    onItemModalOpen();
  };

  // Handle editing an item
  const handleEditItem = (item: WishlistItem) => {
    setSelectedItem(item);
    onItemModalOpen();
  };
  
  // Handle deleting an item
  const handleDeleteItem = (itemId: string) => {
    const updatedItems = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedItems);
    
    toast({
      title: "Item deleted",
      description: "The item has been removed from your wishlist.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Save to localStorage whenever wishlist items change
  useEffect(() => {
    localStorage.setItem('wishlist_items', JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  
  // Handle logout
  const { logout } = useAuth();
  
  const handleLogout = () => {
    SecurityService.clearAuthData();
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle saving an item (new or edited)
  const handleSaveItem = (itemData: Partial<WishlistItem>) => {
    if (selectedItem) {
      // Editing existing item
      const updatedItems = wishlistItems.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...itemData, updatedAt: Date.now() } 
          : item
      );
      setWishlistItems(updatedItems);
      
      toast({
        title: "Item updated",
        description: `${itemData.name} has been updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Adding new item
      const timestamp = Date.now();
      const newItem: WishlistItem = {
        id: uuidv4(),
        name: itemData.name || 'Unnamed Item',
        description: itemData.description,
        price: itemData.price || 0,
        currency: (itemData.currency && ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'].includes(itemData.currency as string)) 
          ? (itemData.currency as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY') 
          : 'USD',
        satsEquivalent: typeof itemData.satsEquivalent === 'number' ? itemData.satsEquivalent : undefined,
        priority: (itemData.priority && ['low', 'medium', 'high'].includes(itemData.priority as string))
          ? (itemData.priority as 'low' | 'medium' | 'high')
          : 'medium',
        category: itemData.category,
        url: itemData.url,
        imageUrl: itemData.imageUrl,
        createdAt: timestamp,
        updatedAt: timestamp,
        notes: itemData.notes
      };
      
      setWishlistItems([newItem, ...wishlistItems]);
      
      toast({
        title: "Item added",
        description: `${newItem.name} has been added to your wishlist.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Container 
        maxW={{ base: "95%", sm: "90%", md: "85%", lg: "1200px" }}
        px={{ base: 4, sm: 6, md: 8 }}
        py={{ base: 6, sm: 8, md: 10 }}
      >
        <VStack spacing={{ base: 4, sm: 5, md: 6 }} align="stretch">
          <Box 
            display={{ base: 'block', sm: 'flex' }}
            justifyContent="space-between"
            alignItems="flex-start"
            width="full"
            gap={4}>
            <Box flex="1">
              <Heading
                as="h1"
                size={{ base: "xl", sm: "2xl", md: "3xl" }}
                color={colorMode === 'light' ? 'gray.800' : 'white'}
                fontWeight="bold"
                letterSpacing="tight"
                lineHeight="shorter"
                mb={2}
              >
                Welcome back, {profile?.name || (profile?.['nip05'] ? profile['nip05'].split('@')[0] : null) || pubkey?.substring(0, 8) || 'stacker'}!
              </Heading>
              <Text
                fontSize={{ base: "md", sm: "lg" }}
                color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}
                maxW="2xl"
              >
                Track your Bitcoin stack and plan your future purchases.
              </Text>
            </Box>
            
            <Box w={{ base: 'full', sm: '250px' }} mt={{ base: 4, sm: 0 }}>
              <BitcoinPrice />
            </Box>
          </Box>

          {/* Tabs for different sections */}
          <Tabs 
            variant="enclosed" 
            colorScheme="yellow" 
            mt={4} 
            index={activeTab}
            onChange={(index) => setActiveTab(index)}
          >
            <TabList>
              <Tab _selected={{ color: 'yellow.600', borderBottomColor: 'yellow.500' }}>
                Wishlist
              </Tab>
              <Tab _selected={{ color: 'yellow.600', borderBottomColor: 'yellow.500' }}>
                Sats Tracker
              </Tab>
              <Tab _selected={{ color: 'yellow.600', borderBottomColor: 'yellow.500' }}>
                Settings
              </Tab>
            </TabList>

            <TabPanels>
              {/* Wishlist Tab */}
              <TabPanel px={0} pb={0}>
                <WishlistDashboard 
                  items={wishlistItems}
                  onAddItem={handleAddItem} 
                  onEditItem={handleEditItem} 
                />
              </TabPanel>

              {/* Sats Tracker Tab */}
              <TabPanel>
                <Box 
                  bg={colorMode === 'light' ? 'white' : 'gray.800'} 
                  p={6} 
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Heading as="h3" size="lg" mb={4}>Sats Tracker</Heading>
                  <Text>
                    Track your Bitcoin savings over time. This feature is coming soon!
                  </Text>
                </Box>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel>
                <Box 
                  bg={colorMode === 'light' ? 'white' : 'gray.800'} 
                  p={6} 
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Heading as="h3" size="lg" mb={4}>User Settings</Heading>
                  <VStack spacing={4} align="stretch">
                    <Text>
                      Manage your profile, notifications, and privacy preferences.
                    </Text>
                    
                    <Box mt={4}>
                      <Heading as="h4" size="md" mb={3}>Account</Heading>
                      <Flex direction="column" gap={2} className="account-details">
                        <Text fontSize="sm">
                          Logged in as: <Text as="span" fontWeight="bold">{profile?.name || profile?.['display_name'] || 'Bitcoin User'}</Text>
                        </Text>
                        <Text fontSize="sm">
                          Public Key: <Text as="span" fontWeight="medium" color="gray.500" maxW="300px" isTruncated className="pubkey privacy-sensitive">{pubkey}</Text>
                        </Text>
                      </Flex>
                      
                      <Button 
                        mt={4}
                        colorScheme="red"
                        variant="outline"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </Box>
                    
                    <Box mt={4}>
                      <Heading as="h4" size="md" mb={3}>Privacy</Heading>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => SecurityService.enablePrivacyMode(!SecurityService.isPrivacyModeEnabled())}
                      >
                        {SecurityService.isPrivacyModeEnabled() ? 'Disable' : 'Enable'} Privacy Mode
                      </Button>
                      <Text fontSize="xs" mt={2} color="gray.500">
                        Privacy mode hides sensitive information on the dashboard.
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
      
      {/* Item Form Modal for adding/editing items */}
      <ItemFormModal 
        isOpen={isItemModalOpen} 
        onClose={onItemModalClose} 
        item={selectedItem} 
        onSave={handleSaveItem} 
        onDelete={handleDeleteItem}
      />
    </Box>
  );
};

export default Dashboard; 