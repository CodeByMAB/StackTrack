import { Box } from '@chakra-ui/react'
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

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Use SecurityService to check authentication
    setIsLoggedIn(SecurityService.isAuthenticated())
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return null // Or a loading spinner
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
        <Box 
          minH="100vh" 
          display="flex" 
          flexDirection="column"
          bg={theme.config.initialColorMode === 'light' ? 'gray.50' : '#051323'}
        >
          <Navbar />
          <Box flex="1">
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
      </Router>
    </ChakraProvider>
  )
}

export default App
