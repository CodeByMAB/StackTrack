import { Box, Button, Container, Heading, Text, VStack, Image, useColorMode, Link } from '@chakra-ui/react';
import ThemeToggle from '../components/ThemeToggle';
import heroImage from '../assets/hero-img.png';
import stacktrackLogo from '../assets/stacktrack-logo.png';
import { useRef, useEffect } from 'react';
import NostrLoginEnhanced from '../components/NostrLoginEnhanced';
import { useNavigate } from 'react-router-dom';
import { SecurityService } from '../services/SecurityService';

const Home = () => {
  const { colorMode } = useColorMode();
  const loginRef = useRef<{ openModal: () => void }>(null);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const pubkey = localStorage.getItem('nostr_pubkey');
    if (pubkey) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Handle logo/StackTrack click
  const handleLogoClick = () => {
    const pubkey = localStorage.getItem('nostr_pubkey');
    if (pubkey) {
      navigate('/dashboard');
    }
  };

  return (
    <Box 
      position="relative" 
      minH="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Hero Image Background */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        width="100vw"
        height="100vh"
        zIndex={0}
        bg={colorMode === 'light' ? 'white' : '#051323'}
        overflow="hidden"
      >
        <Image
          src={heroImage}
          alt=""
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center"
          opacity={colorMode === 'light' ? 0.9 : 0.7}
          filter="contrast(1.1) saturate(1.2)"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          width="100vw"
          height="100vh"
          bg={colorMode === 'light' ? 'whiteAlpha.300' : 'blackAlpha.300'}
          zIndex={1}
          backdropFilter="contrast(1.1) saturate(1.1)"
        />
      </Box>

      {/* Main Content Wrapper */}
      <Box 
        position="relative" 
        zIndex={2}
        flex="1"
        display="flex"
        flexDirection="column"
        minH="calc(100vh - 200px)" // Account for footer height
      >
        {/* Content */}
        <Container
          as="main"
          maxW={{ base: "90%", sm: "85%", md: "80%", lg: "70%", xl: "1200px" }}
          mx="auto"
          px={{ base: 4, sm: 6, md: 8 }}
          py={{ base: 8, sm: 12, md: 16, lg: 20 }}
          centerContent
          position="relative"
          zIndex={2}
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box position="absolute" top={4} right={4}>
            <ThemeToggle />
          </Box>
          <VStack
            spacing={{ base: 6, md: 8, lg: 10 }}
            align="center"
            textAlign="center"
            w="full"
            maxW={{ base: "100%", md: "90%", lg: "80%" }}
            mx="auto"
          >
            <Image
              src={stacktrackLogo}
              alt="StackTrack Logo"
              width={{ base: "240px", md: "300px", lg: "360px" }}
              height="auto"
              mb={{ base: 4, md: 6 }}
              filter={colorMode === 'light' 
                ? 'drop-shadow(0 0 15px rgba(255,255,255,0.8)) drop-shadow(0 0 25px rgba(255,255,255,0.4))' 
                : 'brightness(1) drop-shadow(0 0 15px rgba(0,0,0,0.5)) drop-shadow(0 0 25px rgba(0,0,0,0.3))'
              }
              borderRadius="25px"
              sx={{
                '-webkit-mask-image': 'radial-gradient(circle at center, black 85%, transparent 100%)',
                'mask-image': 'radial-gradient(circle at center, black 85%, transparent 100%)'
              }}
            />
            
            <Link 
              onClick={handleLogoClick}
              _hover={{ textDecoration: 'none' }}
              cursor={localStorage.getItem('nostr_pubkey') ? 'pointer' : 'default'}
            >
              <Heading
                as="h1"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="bold"
                lineHeight={{ base: 1.2, md: 1.1 }}
                letterSpacing="tight"
                color={colorMode === 'light' ? 'gray.800' : 'white'}
                _dark={{ color: "white" }}
                textShadow={colorMode === 'light' ? 
                  '0 2px 10px rgba(0,0,0,0.15), -0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff, 0.5px 0.5px 0 #fff' : 
                  '0 2px 4px rgba(0,0,0,0.1)'}
              >
                Stack{' '}
                <Text as="span" color="yellow.500">dreams</Text>
                , track value... all in{' '}
                <Text as="span" color="orange.400">sats</Text>
                .
              </Heading>
            </Link>
            
            <Text
              color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'}
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              mt={{ base: 2, sm: 3, md: 4 }}
              maxW={{ base: "100%", sm: "95%", md: "90%", lg: "600px" }}
              fontWeight={colorMode === 'light' ? "semibold" : "medium"}
              textShadow={colorMode === 'light' ? 
                '0 1px 8px rgba(0,0,0,0.1), -0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff, 0.5px 0.5px 0 #fff' : 
                '0 1px 2px rgba(0,0,0,0.05)'}
            >
              Wish. Convert. Save in Bitcoin.
            </Text>

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
              mb={8}
            >
              Login with Nostr
            </Button>
          </VStack>
        </Container>
      </Box>
      
      {/* Add NostrLoginEnhanced component with ref */}
      <NostrLoginEnhanced 
        ref={loginRef} 
        onLogin={(pubkey, profile) => {
          // Store the pubkey and profile
          localStorage.setItem('nostr_pubkey', pubkey);
          localStorage.setItem('nostr_profile', JSON.stringify(profile));
          
          // Set the auth timestamp using SecurityService
          localStorage.setItem('nostr_auth_timestamp', Date.now().toString());
          
          // Navigate to dashboard
          navigate('/dashboard');
          
          // Refresh the authentication timer
          SecurityService.refreshAuthentication();
        }} 
      />

      {/* Footer is now handled by App.tsx */}
    </Box>
  );
};

export default Home; 