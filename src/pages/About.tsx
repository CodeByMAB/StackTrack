import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorMode,
  Link,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaGithub, FaCode } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';

function About() {
  const { colorMode } = useColorMode();

  return (
    <Container 
      maxW={{ base: "95%", sm: "85%", md: "80%", lg: "1200px" }} 
      py={{ base: 8, sm: 12, md: 16, lg: 20 }}
    >
      <VStack spacing={12} align="stretch">
        {/* Mission Statement */}
        <Box textAlign="center">
          <Heading
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            lineHeight={1.2}
            mb={4}
            color={colorMode === 'light' ? 'orange.500' : 'orange.300'}
          >
            StackTrack is a wishlist for the Bitcoin era — denominated in sats, built for sovereignty.
          </Heading>
          <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
            Bitcoin is the unit. Dreams are the goal. Stack and track both.
          </Text>
        </Box>

        {/* What Is StackTrack? */}
        <Box>
          <Heading size="xl" mb={4}>What Is StackTrack?</Heading>
          <Text fontSize="lg" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
            StackTrack is a progressive web application (PWA) that helps you track your wishlist items — like homes, cars, and gear — 
            priced in satoshis rather than fiat. No ads. No data harvesting. Just you and your goals.
          </Text>
        </Box>

        {/* Built for Bitcoiners */}
        <Box>
          <Heading size="xl" mb={6}>Built for Bitcoiners</Heading>
          <List spacing={4}>
            <ListItem>
              <HStack>
                <ListIcon as={MdCheckCircle} color="orange.400" />
                <Text fontSize="lg">Runs offline-first</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <ListIcon as={MdCheckCircle} color="orange.400" />
                <Text fontSize="lg">NOSTR-based login</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <ListIcon as={MdCheckCircle} color="orange.400" />
                <Text fontSize="lg">Fiat-to-sats conversions via Block or UTXOracle</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <ListIcon as={MdCheckCircle} color="orange.400" />
                <Text fontSize="lg">Future wallet support with Nostr Wallet Connect or Alby</Text>
              </HStack>
            </ListItem>
          </List>
        </Box>

        {/* The StackTrack Team */}
        <Box>
          <Heading size="xl" mb={4}>The StackTrack Team</Heading>
          <Text fontSize="lg" mb={6} color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
            Built by open-source minds & AI teammates.
          </Text>
          <VStack align="start" spacing={4}>
            <Text fontSize="lg">
              <strong>Founder:</strong> MA₿
            </Text>
            <Text fontSize="lg">
              <strong>AI Allies:</strong>
            </Text>
            <List spacing={2} pl={4}>
              <ListItem>Navi (design, code, vibes)</ListItem>
              <ListItem>Claude (writing/code)</ListItem>
              <ListItem>Cursor (IDE integration)</ListItem>
            </List>
          </VStack>
        </Box>

        {/* Open Source & Philosophy */}
        <Box>
          <Heading size="xl" mb={4}>Open Source & Philosophy</Heading>
          <Text fontSize="lg" mb={6} color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
            Code is open. The vision is clear. Join us.
          </Text>
          <VStack align="start" spacing={4}>
            <Link
              href="https://github.com/CodeByMAB/StackTrack"
              isExternal
              color={colorMode === 'light' ? 'orange.500' : 'orange.300'}
              _hover={{ textDecoration: 'underline' }}
            >
              <HStack>
                <Icon as={FaGithub} />
                <Text>View on GitHub</Text>
              </HStack>
            </Link>
            <Link
              href="https://primal.net/p/nprofile1qqspdwr8vkrurhw7vzerkfeq2yf2f40seeaaqs20vark6hh2z5p27ds2xh4kj"
              isExternal
              color={colorMode === 'light' ? 'orange.500' : 'orange.300'}
              _hover={{ textDecoration: 'underline' }}
            >
              <HStack>
                <Icon as={FaCode} />
                <Text>Connect on NOSTR</Text>
              </HStack>
            </Link>
          </VStack>
          <Box mt={6}>
            <Text fontSize="lg" fontStyle="italic" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
              "Track your dreams. One sat at a time."
            </Text>
          </Box>
        </Box>

        {/* Credits */}
        <Box>
          <Heading size="md" mb={4}>Credits</Heading>
          <Text fontSize="md" color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
            Built with Chakra UI, Block API, UTXOracle, and other amazing open-source tools.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}

export default About; 