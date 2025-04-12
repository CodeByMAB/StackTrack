import { Box, Button, Container, Heading, Text, VStack, Image, useColorMode } from '@chakra-ui/react';
import ThemeToggle from '../components/ThemeToggle';
import heroImage from '../assets/hero-img.png';
import { useRef } from 'react';
import NostrLogin from '../components/NostrLogin';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { colorMode } = useColorMode();
  const loginRef = useRef<{ openModal: () => void }>(null);
  const navigate = useNavigate();

  return (
    <Box 
      position="relative" 
      h="full"
      minH="calc(100vh - 200px)" // Account for navbar and footer height
    >
      {/* Hero Image Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        bg={colorMode === 'light' ? 'white' : '#051323'}
      >
        <Image
          src={heroImage}
          alt=""
          w="full"
          h="full"
          objectFit="cover"
          opacity={colorMode === 'light' ? 0.9 : 0.7}
          filter="contrast(1.1) saturate(1.2)"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={colorMode === 'light' ? 'whiteAlpha.300' : 'blackAlpha.300'}
          zIndex={1}
          backdropFilter="contrast(1.1) saturate(1.1)"
        />
      </Box>

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
        h="full"
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
          <Heading
            as="h1"
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="bold"
            lineHeight={{ base: 1.2, md: 1.1 }}
            letterSpacing="tight"
            color={colorMode === 'light' ? 'gray.800' : 'white'}
            _dark={{ color: "white" }}
            textShadow={colorMode === 'light' ? 
              '0 2px 10px rgba(0,0,0,0.15), -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' : 
              '0 2px 4px rgba(0,0,0,0.1)'}
          >
            Stack{' '}
            <Text as="span" color="yellow.500">dreams</Text>
            , track value... all in{' '}
            <Text as="span" color="orange.400">sats</Text>
            .
          </Heading>
          
          <Text
            color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'}
            fontSize={{ base: "md", sm: "lg", md: "xl" }}
            mt={{ base: 2, sm: 3, md: 4 }}
            maxW={{ base: "100%", sm: "95%", md: "90%", lg: "600px" }}
            fontWeight={colorMode === 'light' ? "semibold" : "medium"}
            textShadow={colorMode === 'light' ? 
              '0 1px 8px rgba(0,0,0,0.1), -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' : 
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
      
      {/* Add NostrLogin component with ref */}
      <NostrLogin 
        ref={loginRef} 
        onLogin={(pubkey, profile) => {
          // Store the pubkey and profile in localStorage
          localStorage.setItem('nostr_pubkey', pubkey);
          localStorage.setItem('nostr_profile', JSON.stringify(profile));
          // Navigate to dashboard
          navigate('/dashboard');
        }} 
      />
    </Box>
  );
};

export default Home; 