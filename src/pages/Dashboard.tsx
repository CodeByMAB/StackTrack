import { Box, Container, VStack, Heading, Text, useColorMode, Button, Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure, useToast, HStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WishlistDashboard } from '../components/wishlist/WishlistDashboard';
import { ItemFormModal } from '../components/wishlist/ItemFormModal';
import { BitcoinPrice } from '../components/BitcoinPrice';
import { NostrProfile, WishlistItem } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import { mockWishlistItems } from '../components/wishlist/MockData';

const Dashboard = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
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
    // Check if user is logged in
    const storedPubkey = localStorage.getItem('nostr_pubkey');
    const storedProfile = localStorage.getItem('nostr_profile');
    
    if (!storedPubkey) {
      // Redirect to home if not logged in
      navigate('/');
      return;
    }

    setPubkey(storedPubkey);

    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
      } catch (e) {
        console.error('Failed to parse stored profile:', e);
      }
    }
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
        currency: itemData.currency as 'USD' || 'USD',
        satsEquivalent: itemData.satsEquivalent,
        priority: itemData.priority as 'low' | 'medium' | 'high' || 'medium',
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
                Welcome back, {profile?.name || 'stacker'}!
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
                  <Text>
                    Manage your profile, notifications, and privacy preferences. 
                    This feature is coming soon!
                  </Text>
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