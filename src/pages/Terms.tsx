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

const Terms = () => {
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
          TERMS OF SERVICE
        </Heading>

        <Text
          color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
          fontSize={{ base: "md", sm: "lg" }}
        >
          Effective Date: April 12, 2025
        </Text>

        <Box
          color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
          fontSize={{ base: "md", sm: "lg", md: "xl" }}
          lineHeight="tall"
        >
          <Heading as="h2" size="lg" mb={3} mt={6}>
            Use of Service
          </Heading>
          <Text mb={4}>
            By using StackTrack, you agree to:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              Use it for lawful purposes.
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              Not exploit, reverse engineer, or harm the service.
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              Respect the decentralized ethos this app promotes.
            </ListItem>
          </List>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            Disclaimer
          </Heading>
          <Text mb={4}>
            StackTrack is provided "as is" without warranties of any kind. We are not responsible for:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              Accuracy of Bitcoin price data
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              Availability or stability of APIs
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckIcon} color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'} />
              Outcomes of your financial decisions
            </ListItem>
          </List>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            No Financial Advice
          </Heading>
          <Text mb={4}>
            This is a wishlist tracker, not financial advice, a bank, a brokerage, or a Bitcoin wallet.
          </Text>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            Bitcoin Wallets (Future Feature)
          </Heading>
          <Text mb={4}>
            We may add support for Bitcoin wallets in the future. StackTrack will never custody funds or private keys. You are solely responsible for your wallet security.
          </Text>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            External Links
          </Heading>
          <Text mb={4}>
            We are not responsible for the content or behavior of linked third-party sites.
          </Text>

          <Heading as="h2" size="lg" mb={3} mt={6}>
            Changes
          </Heading>
          <Text mb={4}>
            We may update these terms occasionally. Updates will be posted here. Your continued use of StackTrack means you agree to those updates.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Terms; 