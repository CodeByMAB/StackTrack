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
  Button,
  Input,
  Textarea,
  Link,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { CheckIcon, ChatIcon, ViewIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import ThemeToggle from '../components/ThemeToggle';

const Support = () => {
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
      <VStack spacing={{ base: 8, sm: 10, md: 12 }} align="start">
        {/* Quick Help Section */}
        <Box w="full">
          <Heading
            as="h2"
            size={{ base: "xl", sm: "2xl" }}
            color={colorMode === 'light' ? 'gray.800' : 'white'}
            mb={4}
          >
            💬 Quick Help
          </Heading>
          <Text
            color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
            fontSize={{ base: "lg", sm: "xl" }}
            mb={6}
          >
            Get answers fast.
          </Text>

          <VStack align="start" spacing={4}>
            <Heading as="h3" size="md" color={colorMode === 'light' ? 'gray.700' : 'whiteAlpha.900'}>
              🔍 FAQ
            </Heading>
            <List spacing={4}>
              <ListItem>
                <Heading as="h4" size="sm" color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}>
                  What is StackTrack?
                </Heading>
                <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>
                  StackTrack is a wishlist tracker that helps you convert your dreams into Bitcoin savings.
                </Text>
              </ListItem>
              <ListItem>
                <Heading as="h4" size="sm" color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}>
                  How do I log in with NOSTR?
                </Heading>
                <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>
                  Click the "Login with Nostr" button and follow the prompts to connect your NOSTR identity.
                </Text>
              </ListItem>
              <ListItem>
                <Heading as="h4" size="sm" color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}>
                  Where is my data stored?
                </Heading>
                <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>
                  Your data is stored locally in your browser or optionally encrypted via your NOSTR identity.
                </Text>
              </ListItem>
              <ListItem>
                <Heading as="h4" size="sm" color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}>
                  Can I use StackTrack offline?
                </Heading>
                <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>
                  Yes, StackTrack works offline. Your wishlist data is stored locally.
                </Text>
              </ListItem>
              <ListItem>
                <Heading as="h4" size="sm" color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}>
                  What if Bitcoin price isn't updating?
                </Heading>
                <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>
                  Check your internet connection. If the issue persists, try refreshing the page.
                </Text>
              </ListItem>
            </List>
          </VStack>
        </Box>

        {/* Contact Support Section */}
        <Box w="full">
          <Heading
            as="h2"
            size={{ base: "xl", sm: "2xl" }}
            color={colorMode === 'light' ? 'gray.800' : 'white'}
            mb={4}
          >
            📬 Contact Support
          </Heading>
          <Text
            color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
            fontSize={{ base: "lg", sm: "xl" }}
            mb={6}
          >
            Still need help? We've got your back.
          </Text>

          <VStack spacing={4} align="stretch" maxW="600px">
            <Input
              placeholder="Name (optional)"
              size="lg"
              bg={colorMode === 'light' ? 'white' : 'whiteAlpha.100'}
            />
            <Textarea
              placeholder="Description of Issue"
              size="lg"
              rows={6}
              bg={colorMode === 'light' ? 'white' : 'whiteAlpha.100'}
            />
            <Button
              size="lg"
              colorScheme="orange"
              rightIcon={<ExternalLinkIcon />}
              w="full"
            >
              Send Report
            </Button>
          </VStack>
        </Box>

        {/* Community Section */}
        <Box w="full">
          <Heading
            as="h2"
            size={{ base: "xl", sm: "2xl" }}
            color={colorMode === 'light' ? 'gray.800' : 'white'}
            mb={4}
          >
            ⚡ Community + Contributions
          </Heading>
          <Text
            color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
            fontSize={{ base: "lg", sm: "xl" }}
            mb={6}
          >
            Built by Bitcoiners, for Bitcoiners.
          </Text>

          <VStack spacing={4} align="start">
            <Link
              href="https://github.com/CodeByMAB/StackTrack"
              isExternal
              color={colorMode === 'light' ? 'orange.500' : 'orange.300'}
              _hover={{ textDecoration: 'underline' }}
            >
              <HStack>
                <Icon as={ExternalLinkIcon} />
                <Text>🧑‍💻 Contribute on GitHub</Text>
              </HStack>
            </Link>
            <Link
              href="https://primal.net/p/nprofile1qqspdwr8vkrurhw7vzerkfeq2yf2f40seeaaqs20vark6hh2z5p27ds2xh4kj"
              isExternal
              color={colorMode === 'light' ? 'orange.500' : 'orange.300'}
              _hover={{ textDecoration: 'underline' }}
            >
              <HStack>
                <Icon as={ChatIcon} />
                <Text>💬 Chat with us on NOSTR</Text>
              </HStack>
            </Link>
            <HStack spacing={4}>
              <Link
                href="/privacy"
                color={colorMode === 'light' ? 'orange.500' : 'orange.300'}
                _hover={{ textDecoration: 'underline' }}
              >
                <HStack>
                  <Icon as={ViewIcon} />
                  <Text>📜 View Privacy & Terms</Text>
                </HStack>
              </Link>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Support; 