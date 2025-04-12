import { Box, Flex, HStack, Button, Text, useColorMode, IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import NostrLogin from './NostrLogin';
import ThemeToggle from './ThemeToggle';

interface NostrProfile {
  name?: string;
  picture?: string;
  about?: string;
}

const Navbar = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const loginRef = useRef<{ openModal: () => void }>(null);

  const checkLoginStatus = () => {
    const pubkey = localStorage.getItem('nostr_pubkey');
    const storedProfile = localStorage.getItem('nostr_profile');
    if (pubkey) {
      setIsLoggedIn(true);
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch (e) {
          console.error('Failed to parse stored profile:', e);
        }
      }
    } else {
      setIsLoggedIn(false);
      setProfile(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    // Add event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Check login status on mount and when the component updates
  useEffect(() => {
    checkLoginStatus();
  });

  const handleLogin = (pubkey: string, profileData: NostrProfile | null) => {
    setIsLoggedIn(true);
    setProfile(profileData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('nostr_pubkey');
    localStorage.removeItem('nostr_profile');
    setIsLoggedIn(false);
    setProfile(null);
    navigate('/');
  };

  const LoggedInNavItems = () => (
    <>
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
      <Button
        variant="ghost"
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        fontSize={{ base: "sm", md: "md" }}
        px={{ base: 1, md: 3 }}
        _hover={{
          bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
        }}
      >
        Categories
      </Button>
      <Button
        variant="ghost"
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        fontSize={{ base: "sm", md: "md" }}
        px={{ base: 1, md: 3 }}
        _hover={{
          bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
        }}
      >
        Settings
      </Button>
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
      <NostrLogin ref={loginRef} onLogin={handleLogin} />
    </>
  );

  const LoggedInMobileMenu = () => (
    <MenuList bg={colorMode === 'light' ? 'white' : '#051323'}>
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
      <MenuItem 
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        bg={colorMode === 'light' ? 'white' : '#051323'}
        _hover={{
          bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
        }}
        fontSize="sm"
        px={3}
      >
        Categories
      </MenuItem>
      <MenuItem 
        color={colorMode === 'light' ? 'gray.700' : 'white'}
        bg={colorMode === 'light' ? 'white' : '#051323'}
        _hover={{
          bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
        }}
        fontSize="sm"
        px={3}
      >
        Settings
      </MenuItem>
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
        onClick={handleLogout}
      >
        Logout
      </MenuItem>
    </MenuList>
  );

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