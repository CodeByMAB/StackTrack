import { Box, Button, Container, Heading, Text, VStack, useColorMode } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const { colorMode } = useColorMode()

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: "#051323" }} display="flex" flexDirection="column">
      <Navbar />
      <Container
        as="main"
        maxW={{ base: "90%", sm: "85%", md: "80%", lg: "70%", xl: "1200px" }}
        mx="auto"
        px={{ base: 4, sm: 6, md: 8 }}
        py={{ base: 8, sm: 12, md: 16, lg: 20 }}
        centerContent
        flex="1"
        position="relative"
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
            color="gray.900"
            _dark={{ color: "white" }}
          >
            Stack dreams, track value... all in sats.
          </Heading>
          
          <Text
            color={colorMode === 'light' ? 'gray.600' : 'whiteAlpha.900'}
            fontSize={{ base: "md", sm: "lg", md: "xl" }}
            mt={{ base: 2, sm: 3, md: 4 }}
            maxW={{ base: "100%", sm: "95%", md: "90%", lg: "600px" }}
          >
            Wish. Convert. Save in Bitcoin.
          </Text>

          <Button
            size={{ base: "md", md: "lg" }}
            mt={{ base: 6, sm: 7, md: 8 }}
            px={{ base: 6, sm: 7, md: 8 }}
            py={{ base: 5, sm: 5.5, md: 6 }}
            variant="outline"
            borderRadius="full"
            borderWidth="1px"
            color={colorMode === 'light' ? 'gray.800' : 'white'}
            borderColor={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.200'}
            _hover={{
              bg: colorMode === 'light' ? 'gray.50' : 'whiteAlpha.100'
            }}
            w={{ base: "full", sm: "auto" }}
          >
            Login with Nostr
          </Button>
        </VStack>
      </Container>
      <Footer />
    </Box>
  )
}

export default App
