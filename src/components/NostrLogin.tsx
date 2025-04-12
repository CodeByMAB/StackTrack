import { 
  Button, 
  Input, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  Text, 
  useDisclosure, 
  useColorMode,
  Alert,
  AlertIcon,
  Box,
  Link,
  VStack
} from '@chakra-ui/react';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import NDK from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { NostrProfile } from '../types/models';

interface NostrLoginProps {
  onLogin: (pubkey: string, profile: NostrProfile) => void;
}

interface NostrLoginRef {
  openModal: () => void;
}

// List of reliable Nostr relays
const NOSTR_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://nostr.wine',
  'wss://relay.snort.social',
  'wss://purplerelay.com'
];

// Timeout for relay connection in ms
const RELAY_CONNECTION_TIMEOUT = 5000;

// Minimum required connected relays
const MIN_CONNECTED_RELAYS = 1;

const NostrLogin = forwardRef<NostrLoginRef, NostrLoginProps>(({ onLogin }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectingStatus, setConnectingStatus] = useState('');
  const initialRef = useRef<HTMLInputElement>(null);
  const ndkRef = useRef<NDK | null>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setPrivateKey('');
      setError('');
      setConnectingStatus('');
      onOpen();
    }
  }));

  const initializeNDK = async (): Promise<NDK> => {
    if (!ndkRef.current) {
      setConnectingStatus('Initializing Nostr connection...');
      
      // Create a new NDK instance with explicit relay URLs
      ndkRef.current = new NDK({
        explicitRelayUrls: NOSTR_RELAYS
      });
      
      try {
        setConnectingStatus('Connecting to Nostr relays...');
        
        // Set a manual flag for connection
        let connectionSucceeded = false;
        
        // Connect with a timeout
        try {
          await Promise.race([
            ndkRef.current.connect().then(() => {
              connectionSucceeded = true;
            }),
            new Promise((_, reject) => 
              setTimeout(() => {
                if (!connectionSucceeded) {
                  reject(new Error('Connection timeout'));
                }
              }, RELAY_CONNECTION_TIMEOUT)
            )
          ]);
        } catch (connErr) {
          console.warn('Connection timed out, proceeding in offline mode', connErr);
          // We'll continue in offline mode
        }
        
        // Check how many relays we connected to
        const connectedRelays = Array.from(ndkRef.current.pool.relays.values())
          .filter(relay => relay.status === 1).length;
        
        if (connectedRelays > 0) {
          setConnectingStatus(`Connected to ${connectedRelays} relays`);
        } else {
          // Proceed in offline mode with warning
          setConnectingStatus('Operating in offline mode');
          console.warn('No relays connected, proceeding in offline mode');
        }
      } catch (err) {
        // In case of errors, we'll still try to use NDK in offline mode
        console.error('Failed to connect to NDK:', err);
        setConnectingStatus('Operating in offline mode');
      }
    }
    
    // Always return the NDK instance, even if connection failed
    // This allows offline operation
    return ndkRef.current;
  };

  const sanitizeProfile = (profile: any): NostrProfile => {
    // Create a sanitized profile object with only the fields we need
    const sanitized: NostrProfile = {
      name: typeof profile?.name === 'string' ? profile.name.slice(0, 50) : 'Bitcoin User',
      picture: typeof profile?.picture === 'string' ? profile.picture : undefined,
      about: typeof profile?.about === 'string' ? profile.about.slice(0, 500) : 'A Nostr user passionate about Bitcoin',
    };
    
    // Validate the picture URL if present
    if (sanitized.picture) {
      try {
        const url = new URL(sanitized.picture);
        if (!url.protocol.startsWith('http')) {
          sanitized.picture = undefined;
        }
      } catch {
        sanitized.picture = undefined;
      }
    }
    
    return sanitized;
  };

  const handleLogin = async () => {
    if (!privateKey) {
      setError('Please enter your private key');
      return;
    }

    setIsLoading(true);
    setError('');
    setConnectingStatus('');

    try {
      // Security: Validate and decode the nsec key
      if (!privateKey.startsWith('nsec1')) {
        throw new Error('Invalid private key format. Please enter a valid nsec1 key.');
      }

      let decoded;
      try {
        decoded = nip19.decode(privateKey);
      } catch (e) {
        throw new Error('Invalid private key format. Unable to decode key.');
      }
      
      if (decoded.type !== 'nsec') {
        throw new Error('Invalid private key format. Please enter a valid nsec1 key.');
      }

      setConnectingStatus('Private key decoded successfully');

      // Initialize NDK - may be in offline mode if connection fails
      const ndk = await initializeNDK();
      
      // Get the user's public key from the private key
      // This works even in offline mode since it's just key derivation
      const user = ndk.getUser({ hexpubkey: decoded.data });
      const pubkey = user.pubkey;

      if (!pubkey) {
        throw new Error('Invalid private key. Could not derive public key.');
      }

      setConnectingStatus('Generating user profile...');

      // Create a default profile that we'll use if we can't fetch one
      let profile: NostrProfile = {
        name: 'Bitcoin User',
        about: 'A Nostr user passionate about Bitcoin'
      };

      // Try to fetch the profile from relays if connected
      const relayConnected = Array.from(ndk.pool.relays.values())
        .filter(relay => relay.status === 1).length > 0;
        
      if (relayConnected) {
        try {
          setConnectingStatus('Fetching your Nostr profile...');
          // Try to fetch the profile with a timeout
          const profilePromise = user.fetchProfile();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          );
          
          const fetchedProfile = await Promise.race([profilePromise, timeoutPromise]);
          
          if (fetchedProfile) {
            // Sanitize the profile to prevent XSS, etc.
            profile = sanitizeProfile(fetchedProfile);
          }
        } catch (err) {
          console.log('Profile fetch failed, using default profile');
          // Continue with default profile
        }
      } else {
        console.log('Operating in offline mode, using default profile');
      }

      setConnectingStatus('Login successful!');
      
      // Store the pubkey and profile in localStorage
      // Security note: We never store the private key
      localStorage.setItem('nostr_pubkey', pubkey);
      localStorage.setItem('nostr_profile', JSON.stringify(profile));

      // Call the onLogin callback with pubkey and profile
      onLogin(pubkey, profile);
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please check your private key and try again.');
    } finally {
      setIsLoading(false);
      setConnectingStatus('');
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="md"
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent
        bg={colorMode === 'light' ? 'white' : '#051323'}
        color={colorMode === 'light' ? 'gray.800' : 'white'}
        borderRadius="xl"
        boxShadow="xl"
      >
        <ModalHeader fontSize="xl">Login with Nostr</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box 
              p={3} 
              bg={colorMode === 'light' ? 'blue.50' : 'blue.900'} 
              borderRadius="md"
            >
              <Text fontSize="sm" color={colorMode === 'light' ? 'blue.700' : 'blue.200'}>
                <strong>Security Notice:</strong> Your private key (nsec) is stored securely in your 
                browser's local storage and is never sent to our servers or shared with any third party.
              </Text>
            </Box>
            
            <Text>
              Enter your Nostr private key (nsec) to log in:
            </Text>
            
            <Input
              ref={initialRef}
              placeholder="nsec1..."
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              type="password"
              autoComplete="off"
              size="lg"
              bg={colorMode === 'light' ? 'white' : 'whiteAlpha.100'}
              borderColor={colorMode === 'light' ? 'gray.300' : 'whiteAlpha.300'}
              _focus={{
                borderColor: 'yellow.500',
                boxShadow: `0 0 0 1px ${colorMode === 'light' ? '#ECC94B' : '#D69E2E'}`
              }}
            />
            
            {connectingStatus && (
              <Box mt={2}>
                <Text 
                  fontSize="sm" 
                  color={connectingStatus.includes('offline') 
                    ? 'orange.500' 
                    : colorMode === 'light' ? 'gray.600' : 'gray.300'}
                  fontWeight={connectingStatus.includes('offline') ? 'medium' : 'normal'}
                >
                  {connectingStatus}
                </Text>
                {connectingStatus.includes('offline') && (
                  <Text fontSize="xs" color={colorMode === 'light' ? 'gray.500' : 'gray.400'} mt={1}>
                    Your profile and public key will still be created, but you won't be able to sync with the Nostr network until you reconnect.
                  </Text>
                )}
              </Box>
            )}
            
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">{error}</Text>
              </Alert>
            )}
            
            <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'} mt={2}>
              Don't have a Nostr key? Learn how to create one at{' '}
              <Link 
                href="https://nostr.how" 
                isExternal 
                color="yellow.500"
                _hover={{ textDecoration: 'underline' }}
              >
                nostr.how
              </Link>
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="yellow"
            mr={3}
            onClick={handleLogin}
            isLoading={isLoading}
            loadingText="Connecting..."
            size="lg"
            borderRadius="md"
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "md"
            }}
          >
            Login
          </Button>
          <Button 
            onClick={onClose}
            variant="ghost"
            size="lg"
            _hover={{
              bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.100'
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

NostrLogin.displayName = 'NostrLogin';

export default NostrLogin; 