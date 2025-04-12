import { Box, Flex, HStack, Button, Text, useColorMode, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = () => {
  const { colorMode } = useColorMode();
  // TODO: Replace with actual auth state
  const isLoggedIn = false;

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
      <Button
        variant="solid"
        colorScheme="orange"
        fontSize={{ base: "sm", md: "md" }}
        px={{ base: 3, md: 4 }}
        _hover={{
          transform: "translateY(-1px)",
          boxShadow: "sm"
        }}
      >
        Login with Nostr
      </Button>
    </>
  );

  const LoggedInMobileMenu = () => (
    <MenuList 
      bg={colorMode === 'light' ? 'white' : '#051323'}
      minW="150px"
      maxW="90vw"
      zIndex="popover"
    >
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
    </MenuList>
  );

  const LoggedOutMobileMenu = () => (
    <MenuList 
      bg={colorMode === 'light' ? 'white' : '#051323'}
      minW="150px"
      maxW="90vw"
      zIndex="popover"
    >
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
        justify="flex-start" 
        align="center"
      >
        <Flex align="center" gap={2} cursor="pointer">
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
        <HStack spacing={{ base: 0, sm: 1, md: 4, lg: 6 }} display={{ base: 'none', md: 'flex' }} ml={{ base: "200px", lg: "300px" }}>
          {isLoggedIn ? <LoggedInNavItems /> : <LoggedOutNavItems />}
        </HStack>

        {/* Mobile Navigation */}
        <Box 
          display={{ base: 'block', md: 'none' }}
          ml="auto"
          position="relative"
          zIndex="popover"
        >
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              color={colorMode === 'light' ? 'gray.700' : 'white'}
              size="sm"
            />
            {isLoggedIn ? <LoggedInMobileMenu /> : <LoggedOutMobileMenu />}
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar; 