import { Box, Flex, HStack, Button, Text, useColorMode, IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar, Tooltip, Heading } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Logo from './Logo';
import NostrLoginEnhanced from './NostrLoginEnhanced';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

const Navbar = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, profile, logout } = useAuth();
  const { userData } = useUser();
  const loginRef = useRef<{ openModal: () => void }>(null);
  
  // Handle logo/text click
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  // Handle add item
  const navbarAddItem = () => {
    if (location.pathname === '/dashboard') {
      // If we're already on the dashboard, open the add item modal
      navigate('/dashboard');
      // Use a small timeout to ensure the dashboard is mounted before triggering the modal
      setTimeout(() => {
        const event = new CustomEvent('openAddItemModal');
        window.dispatchEvent(event);
      }, 100);
    } else {
      // If we're not on the dashboard, navigate there first
      navigate('/dashboard');
      // Use a small timeout to ensure the dashboard is mounted before triggering the modal
      setTimeout(() => {
        const event = new CustomEvent('openAddItemModal');
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const UserAvatar = () => (
    <Tooltip label={profile?.name || 'Bitcoin User'}>
      <Avatar
        size="sm"
        name={profile?.name || 'BU'}
        src={profile?.picture}
        bg={colorMode === 'light' ? 'orange.500' : 'orange.300'}
      />
    </Tooltip>
  );

  const LoggedInNavItems = () => {
    // Only show relevant nav items based on current route
    const isDashboard = location.pathname === '/dashboard';
    
    return (
      <>
        {userData?.stats && (
          <Text
            fontSize="sm"
            color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
            display={{ base: 'none', lg: 'block' }}
          >
            {userData.stats.totalItems} items · {userData.stats.totalValue} sats
          </Text>
        )}
        {isDashboard && (
          <Button
            variant="ghost"
            color={colorMode === 'light' ? 'gray.700' : 'white'}
            leftIcon={<Box as="span" fontSize={{ base: "20px", md: "24px" }}>+</Box>}
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 1, md: 3 }}
            _hover={{
              bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
            }}
            onClick={navbarAddItem}
          >
            Add Item
          </Button>
        )}
        <Button 
          as={Link}
          to="/about"
          variant="ghost" 
          color={colorMode === 'light' ? 'gray.700' : 'white'}
          fontSize={{ base: "sm", md: "md" }}
          px={{ base: 1, md: 3 }}
          _hover={{
            bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
          }}
        >
          About
        </Button>
        <Menu>
          <MenuButton>
            <UserAvatar />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  };

  const LoggedOutNavItems = () => (
    <>
      <Button 
        as={Link}
        to="/about"
        variant="ghost" 
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        fontSize={{ base: "sm", md: "md" }}
        px={{ base: 1, md: 3 }}
        _hover={{
          bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
        }}
      >
        About
      </Button>
      <Button
        colorScheme="orange"
        variant="solid"
        fontSize={{ base: "sm", md: "md" }}
        px={{ base: 4, md: 6 }}
        _hover={{
          bg: colorMode === 'light' ? 'orange.600' : 'orange.400'
        }}
        onClick={() => loginRef.current?.openModal()}
      >
        Login with Nostr
      </Button>
    </>
  );

  const LoggedInMobileMenu = () => {
    // Only show relevant nav items based on current route
    const isDashboard = location.pathname === '/dashboard';
    
    return (
      <MenuList bg={colorMode === 'light' ? 'white' : '#051323'}>
        <MenuItem 
          icon={<UserAvatar />}
          color={colorMode === 'light' ? 'gray.700' : 'white'}
          bg={colorMode === 'light' ? 'white' : '#051323'}
          _hover={{
            bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
          }}
          fontSize="sm"
          px={3}
          isDisabled
        >
          {profile?.name || 'Bitcoin User'}
        </MenuItem>
        {userData?.stats && (
          <MenuItem 
            color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
            bg={colorMode === 'light' ? 'white' : '#051323'}
            fontSize="sm"
            px={3}
            isDisabled
          >
            {userData.stats.totalItems} items · {userData.stats.totalValue} sats
          </MenuItem>
        )}
        {isDashboard && (
          <MenuItem 
            icon={<Box as="span" fontSize="24px">+</Box>}
            color={colorMode === 'light' ? 'gray.700' : 'white'}
            bg={colorMode === 'light' ? 'white' : '#051323'}
            _hover={{
              bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
            }}
            fontSize="sm"
            px={3}
            onClick={navbarAddItem}
          >
            Add Item
          </MenuItem>
        )}
        <MenuItem 
          as={Link}
          to="/about"
          color={colorMode === 'light' ? 'gray.700' : 'white'}
          bg={colorMode === 'light' ? 'white' : '#051323'}
          _hover={{
            bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
          }}
          fontSize="sm"
          px={3}
        >
          About
        </MenuItem>
        <MenuItem 
          color={colorMode === 'light' ? 'gray.700' : 'white'}
          bg={colorMode === 'light' ? 'white' : '#051323'}
          _hover={{
            bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
          }}
          fontSize="sm"
          px={3}
          onClick={logout}
        >
          Logout
        </MenuItem>
      </MenuList>
    );
  };

  const LoggedOutMobileMenu = () => (
    <MenuList bg={colorMode === 'light' ? 'white' : '#051323'}>
      <MenuItem 
        as={Link}
        to="/about"
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        bg={colorMode === 'light' ? 'white' : '#051323'}
        _hover={{
          bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
        }}
        fontSize="sm"
        px={3}
      >
        About
      </MenuItem>
      <MenuItem 
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        bg={colorMode === 'light' ? 'white' : '#051323'}
        _hover={{
          bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
        }}
        fontSize="sm"
        px={3}
        onClick={() => loginRef.current?.openModal()}
      >
        Login with Nostr
      </MenuItem>
    </MenuList>
  );

  return (
    <Box 
      px={0}
      py={4} 
      bg={colorMode === 'light' ? 'white' : '#051323'}
      borderBottom="1px"
      borderColor={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100'}
      w="100%"
      position="relative"
      zIndex="sticky"
    >
      <Flex 
        maxW={{ base: "100%", sm: "95%", md: "90%", lg: "1200px" }}
        mx="auto"
        px={{ base: 4, sm: 6, md: 8 }}
        justify="space-between" 
        align="center"
        gap={4}
      >
        <Box 
          as={Link} 
          to={isLoggedIn ? "/dashboard" : "/"} 
          onClick={handleLogoClick}
          display="flex"
          alignItems="center"
          gap={2}
          _hover={{ textDecoration: 'none' }}
        >
          <Logo />
          <Heading 
            as="h1" 
            size="md" 
            color={colorMode === 'light' ? 'gray.700' : 'white'}
            display={{ base: 'none', md: 'block' }}
          >
            StackTrack
          </Heading>
        </Box>
        <HStack 
          spacing={4} 
          display={{ base: 'none', md: 'flex' }}
          position="absolute"
          right="12%"
        >
          {isLoggedIn ? <LoggedInNavItems /> : <LoggedOutNavItems />}
        </HStack>
        <HStack spacing={2}>
          <ThemeToggle />
          <Box display={{ base: 'block', md: 'none' }}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Menu"
                icon={<HamburgerIcon />}
                variant="ghost"
                color={colorMode === 'light' ? 'gray.700' : 'white'}
              />
              {isLoggedIn ? <LoggedInMobileMenu /> : <LoggedOutMobileMenu />}
            </Menu>
          </Box>
        </HStack>
      </Flex>
      <NostrLoginEnhanced ref={loginRef} onLogin={() => {
        // The login is now handled by the AuthContext inside NostrLoginEnhanced
        // This callback is kept for backward compatibility
      }} />
    </Box>
  );
};

export default Navbar; 