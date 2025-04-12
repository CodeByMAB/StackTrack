import { Box, Container, Flex, HStack, Link, Text, VStack, useColorMode } from '@chakra-ui/react';
import confetti from 'canvas-confetti';

const Footer = () => {
  const { colorMode } = useColorMode();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f7931a', '#ff9500', '#ffd700']  // Bitcoin orange and complementary colors
    });
  };

  return (
    <Box 
      as="footer"
      w="100%"
      bg={colorMode === 'light' ? 'white' : '#051323'}
      borderTop="1px"
      borderColor={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100'}
      py={8}
    >
      <Container maxW={{ base: "100%", sm: "95%", md: "90%", lg: "1200px" }} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={6} align="stretch">
          {/* Links */}
          <Flex 
            justify="center" 
            gap={{ base: 4, md: 8 }}
            flexWrap="wrap"
          >
            <Link 
              color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
              _hover={{ color: colorMode === 'light' ? 'gray.800' : 'white' }}
              fontWeight="medium"
              href="/privacy"
            >
              Privacy
            </Link>
            <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>•</Text>
            <Link 
              color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
              _hover={{ color: colorMode === 'light' ? 'gray.800' : 'white' }}
              fontWeight="medium"
              href="/terms"
            >
              Terms
            </Link>
            <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>•</Text>
            <Link 
              color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
              _hover={{ color: colorMode === 'light' ? 'gray.800' : 'white' }}
              fontWeight="medium"
              href="/support"
            >
              Support
            </Link>
          </Flex>

          {/* Built for Bitcoiners with confetti */}
          <Text 
            textAlign="center" 
            color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
            fontSize="sm"
            cursor="pointer"
            _hover={{ 
              color: colorMode === 'light' ? 'gray.800' : 'white',
              transform: 'translateY(-1px)'
            }}
            transition="all 0.2s"
            onClick={triggerConfetti}
          >
            Built for Bitcoiners
          </Text>

          {/* Version */}
          <Text 
            textAlign="center" 
            color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}
            fontSize="xs"
          >
            Version 1.0.0
          </Text>

          {/* Powered by section */}
          <HStack spacing={2} justify="center" fontSize="xs">
            <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>
              Powered by:
            </Text>
            <Link 
              color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
              _hover={{ color: colorMode === 'light' ? 'gray.800' : 'white' }}
              fontWeight="medium"
              href="https://nostr.com/"
              isExternal
            >
              NOSTR
            </Link>
            <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>•</Text>
            <Link 
              color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
              _hover={{ color: colorMode === 'light' ? 'gray.800' : 'white' }}
              fontWeight="medium"
              href="https://utxo.live/oracle/"
              isExternal
            >
              UTXOracle
            </Link>
            <Text color={colorMode === 'light' ? 'gray.500' : 'whiteAlpha.600'}>•</Text>
            <Link 
              color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.800'}
              _hover={{ color: colorMode === 'light' ? 'gray.800' : 'white' }}
              fontWeight="medium"
              href="https://github.com/block/bitcoin-treasury"
              isExternal
            >
              Block API
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer; 