import { Box, Flex, HStack, Button, Text, useColorMode, IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { useRef } from 'react';
import Logo from './Logo';
import NostrLoginEnhanced from './NostrLoginEnhanced';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();
  const { isLoggedIn, profile, logout } = useAuth();
  const loginRef = useRef<{ openModal: () => void }>(null);
  
  // Handle logout
  const handleLogout = () => {
    logout();
  };


  const LoggedInNavItems = () => {
    // Only show relevant nav items based on current route
    const isDashboard = location.pathname === '/dashboard';
    
    return (
      <>
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
      <NostrLoginEnhanced ref={loginRef} onLogin={() => {
        // The login is now handled by the AuthContext inside NostrLoginEnhanced
        // This callback is kept for backward compatibility
      }} />
    </>
  );

  const LoggedInMobileMenu = () => {
    // Only show relevant nav items based on current route
    const isDashboard = location.pathname === '/dashboard';
    
    return (
      <MenuList bg={colorMode === 'light' ? 'white' : '#051323'}>
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
        <Flex align="center" gap={2} flexShrink={0}>
          <Logo />
          <Link to="/">
            <Text
              color={colorMode === 'light' ? 'gray.800' : 'white'}
              fontSize={{ base: "md", md: "xl" }}
              fontWeight="semibold"
              letterSpacing="tight"
              _hover={{
                color: colorMode === 'light' ? 'orange.500' : 'orange.300'
              }}
            >
              StackTrack
            </Text>
          </Link>
        </Flex>

        {/* Desktop Navigation */}
        <HStack 
          spacing={{ base: 0, sm: 1, md: 4, lg: 6 }} 
          display={{ base: 'none', md: 'flex' }}
          flex="1"
          justify="flex-end"
          ml={{ base: 0, md: 8 }}
        >
          {isLoggedIn ? (
            <>
              <LoggedInNavItems />
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  p={0}
                  _hover={{ bg: 'transparent' }}
                >
                  <Avatar
                    size="sm"
                    src={profile?.picture}
                    name={profile?.name || 'User'}
                    bg={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'}
                  />
                </MenuButton>
                <MenuList bg={colorMode === 'light' ? 'white' : '#051323'}>
                  <MenuItem 
                    color={colorMode === 'light' ? 'gray.700' : 'white'}
                    bg={colorMode === 'light' ? 'white' : '#051323'}
                    _hover={{
                      bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <LoggedOutNavItems />
              <Button
                size="lg"
                colorScheme="yellow"
                bg="yellow.500"
                color="black"
                _hover={{
                  bg: "yellow.400",
                  transform: "translateY(-2px)",
                  boxShadow: "lg"
                }}
                _active={{
                  bg: "yellow.600"
                }}
                onClick={() => loginRef.current?.openModal()}
              >
                Login with Nostr
              </Button>
            </>
          )}
        </HStack>

        {/* Mobile Navigation */}
        <Box 
          display={{ base: 'block', md: 'none' }}
          flexShrink={0}
        >
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Open menu"
              icon={
                isLoggedIn ? (
                  <Avatar
                    size="sm"
                    src={profile?.picture}
                    name={profile?.name || 'User'}
                    bg={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'}
                  />
                ) : (
                  <HamburgerIcon />
                )
              }
              variant="ghost"
              color={colorMode === 'light' ? 'gray.700' : 'white'}
              size="sm"
            />
            {isLoggedIn ? <LoggedInMobileMenu /> : <LoggedOutMobileMenu />}
          </Menu>
        </Box>

        <ThemeToggle />
      </Flex>
    </Box>
  );
};

export default Navbar; 