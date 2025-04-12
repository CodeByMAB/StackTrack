import { Box, Text } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Support from './pages/Support'
import Dashboard from './pages/Dashboard'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import { useEffect, useState } from 'react'
import { SecurityService } from './services/SecurityService'
import { AuthProvider } from './contexts/AuthContext'

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Function to check authentication
    const checkAuth = () => {
      // Use SecurityService to check authentication
      const isAuth = SecurityService.isAuthenticated();
      setIsLoggedIn(isAuth);
      setIsLoading(false);
      
      // If authenticated, refresh the auth timestamp
      if (isAuth) {
        SecurityService.refreshAuthentication();
      }
    };
    
    // Initial check
    checkAuth();
    
    // Set up interval to periodically check auth status (every minute)
    const authCheckInterval = setInterval(checkAuth, 60000);
    
    // Listen for storage events (in case another tab logs out)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'nostr_auth_timestamp' || event.key === 'nostr_pubkey') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      clearInterval(authCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh" 
        width="100vw"
        bg={theme.config.initialColorMode === 'light' ? 'gray.50' : '#051323'}
      >
        <Box
          p={8}
          borderRadius="lg"
          boxShadow="md"
          bg={theme.config.initialColorMode === 'light' ? 'white' : 'gray.800'}
          textAlign="center"
        >
          <Text fontSize="xl" fontWeight="medium" color={theme.config.initialColorMode === 'light' ? 'gray.600' : 'white'} mb={4}>
            Loading...
          </Text>
        </Box>
      </Box>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function App() {
  // Check if privacy mode is enabled on app initialization
  useEffect(() => {
    if (SecurityService.isPrivacyModeEnabled()) {
      document.body.classList.add('privacy-mode');
    } else {
      document.body.classList.remove('privacy-mode');
    }
  }, []);
  
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <AuthProvider>
          <Box 
            minHeight="100vh"
            width="100%"
            display="flex" 
            flexDirection="column"
            bg={theme.config.initialColorMode === 'light' ? 'gray.50' : '#051323'}
            overflow="hidden"
            position="relative"
          >
            <Navbar />
            <Box 
              flex="1" 
              width="100%"
              display="flex" 
              flexDirection="column"
              overflow="auto"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/support" element={<Support />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App
