import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  useColorMode,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import ThemeToggle from '../components/ThemeToggle';

const Privacy = () => {
  const { colorMode } = useColorMode();

  return (
    <Container 
      maxW={{ base: "95%", sm: "85%", md: "80%", lg: "1200px" }}
      px={{ base: 4, sm: 6, md: 8 }}
      py={{ base: 8, sm: 12, md: 16 }}
    >
      <Box position="absolute" top={4} right={4}>
        <ThemeToggle />
      </Box>
      <VStack spacing={{ base: 4, sm: 5, md: 6 }} align="start">
        <Heading
          as="h1"
          size={{ base: "2xl", sm: "3xl", md: "4xl" }}
          color={colorMode === 'light' ? 'gray.800' : 'white'}
          lineHeight={{ base: 1.3, md: 1.2 }}
          maxW={{ base: "100%", md: "80%" }}
        >
          PRIVACY POLICY
        </Heading>

        <Text
          color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
          fontSize={{ base: "md", sm: "lg" }}
        >
          Effective Date: April 12, 2025
        </Text>

        <Text
          color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
          fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
          fontWeight="medium"
          mt={4}
        >
          StackTrack respects your sovereignty, your time, and your data.
        </Text>

        <Box
          color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
          fontSize={{ base: "md", sm: "lg", md: "xl" }}
          lineHeight="tall"
        >
          <Heading as="h2" size="lg" mb={3} mt={6}>
            Data Collection
          </Heading>
          <Text mb={4}>
            We collect no personal data by default.
          </Text>
          <List spacing={2} mb={4}>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              No names.
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              No emails.
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              No trackers.
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              No surveillance.
            </ListItem>
          </List>
          <Text mb={4}>
            Your wishlist data is stored locally in your browser or optionally encrypted via your NOSTR identity.
          </Text>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            Login & Authentication
          </Heading>
          <Text mb={4}>
            StackTrack uses NOSTR for login. Your NOSTR public key is used to identify your session but is never stored or logged by us.
          </Text>
          <Text mb={4}>
            In the future, we may support email/password login and Bitcoin wallet integration using Nostr Wallet Connect or Alby Wallet.
          </Text>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            Price Data
          </Heading>
          <Text mb={4}>
            Bitcoin prices are fetched using the Block Bitcoin Treasury API and cached on your device. We do not collect or analyze this request data.
          </Text>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            Analytics & Tracking
          </Heading>
          <Text mb={4}>
            We do not use Google Analytics, cookies, session replays, or any other tracking software. This app is built for users, not surveillance capitalists.
          </Text>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            Third-Party Services
          </Heading>
          <Text mb={4}>
            We may link to third-party sites (e.g., Amazon, Etsy, Zillow). These platforms have their own privacy policies.
          </Text>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            Jurisdiction
          </Heading>
          <Text mb={4}>
            This policy is governed under the laws of the United States of America.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Privacy; 