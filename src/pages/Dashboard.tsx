import { Box, Container, VStack, Heading, Text, useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NostrProfile {
  name?: string;
  picture?: string;
  about?: string;
}

const Dashboard = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<NostrProfile | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const pubkey = localStorage.getItem('nostr_pubkey');
    const storedProfile = localStorage.getItem('nostr_profile');
    
    console.log('Stored profile data:', storedProfile);
    
    if (!pubkey) {
      // Redirect to home if not logged in
      navigate('/');
      return;
    }

    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        console.log('Parsed profile:', parsedProfile);
        setProfile(parsedProfile);
      } catch (e) {
        console.error('Failed to parse stored profile:', e);
      }
    }
  }, [navigate]);

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Container 
        maxW={{ base: "95%", sm: "85%", md: "80%", lg: "1200px" }}
        px={{ base: 4, sm: 6, md: 8 }}
        py={{ base: 8, sm: 12, md: 16, lg: 20 }}
      >
        <VStack spacing={{ base: 4, sm: 5, md: 6 }} align="stretch">
          <Box>
            <Heading
              as="h1"
              size={{ base: "2xl", sm: "3xl", md: "4xl" }}
              color={colorMode === 'light' ? 'gray.800' : 'white'}
              fontWeight="bold"
              letterSpacing="tight"
              lineHeight="shorter"
              mb={2}
            >
              Welcome back, {profile?.name || 'user'}!
            </Heading>
            <Text
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}
              maxW="2xl"
            >
              Track your Bitcoin stack and monitor your sats over time.
            </Text>
          </Box>

          {/* Dashboard content will go here */}
          <Box
            mt={8}
            p={6}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="lg"
            boxShadow="sm"
          >
            <Text color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.700'}>
              Your dashboard is ready. More features coming soon!
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 