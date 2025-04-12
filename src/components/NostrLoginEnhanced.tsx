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
  VStack,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Icon,
  Divider
} from '@chakra-ui/react';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import NDK from '@nostr-dev-kit/ndk';
import { nip19, getPublicKey, generatePrivateKey } from 'nostr-tools';
import { NostrProfile, NostrLoginMethod } from '../types/models';
import { useAuth } from '../contexts/AuthContext';
import { FaBolt, FaKey, FaPlug, FaUserCircle } from 'react-icons/fa';

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

const NostrLoginEnhanced = forwardRef<NostrLoginRef, NostrLoginProps>(({ onLogin }, ref) => {
  const { login } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [activeTab, setActiveTab] = useState<NostrLoginMethod>('nsec');
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

  // Handle login with private key (nsec)
  const handleNsecLogin = async () => {
    if (!privateKey) {
      // For development only - you can uncomment this line to use a test key
      // setPrivateKey("nsec1vl029mgpspedva04g90vltkh6fvh240zqtv9k0t9af8935ke9laq5nstk2");
      setError('Please enter your private key');
      return;
    }

    setIsLoading(true);
    setError('');
    setConnectingStatus('');

    try {
      // Validate nsec format
      if (!privateKey.startsWith('nsec1')) {
        throw new Error('Invalid private key format. Please enter a valid nsec1 key.');
      }

      // Step 1: Decode the nsec to get the raw hex private key
      let decodedData;
      try {
        const decoded = nip19.decode(privateKey);
        if (decoded.type !== 'nsec') {
          throw new Error('Invalid private key format. Please enter a valid nsec1 key.');
        }
        decodedData = decoded.data;
        setConnectingStatus('Private key decoded successfully');
      } catch (e) {
        console.error('Error decoding nsec:', e);
        throw new Error('Invalid private key format. Unable to decode key.');
      }
      
      // Step 2: Derive the public key from the private key
      try {
        // Use the direct nostr-tools function to get the public key
        const pubkeyHex = getPublicKey(decodedData);
        
        if (!pubkeyHex) {
          throw new Error('Could not derive public key from private key.');
        }
        
        setConnectingStatus('Public key derived successfully');
        
        // Step 3: Create a basic profile
        const profile: NostrProfile = {
          name: 'Bitcoin User',
          about: 'A Nostr user passionate about Bitcoin'
        };
        
        // Step 4: Store authentication data
        localStorage.setItem('nostr_pubkey', pubkeyHex);
        localStorage.setItem('nostr_profile', JSON.stringify(profile));
        localStorage.setItem('nostr_auth_timestamp', Date.now().toString());
        localStorage.setItem('nostr_login_method', 'nsec');
        
        setConnectingStatus('Login successful!');
        
        // Step 5: Call the auth callbacks
        login(pubkeyHex, profile);
        onLogin(pubkeyHex, profile);
        onClose();
      } catch (err) {
        console.error('Error during key derivation:', err);
        throw new Error('Failed to generate public key from private key. Please check your nsec key.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please check your private key and try again.');
    } finally {
      setIsLoading(false);
      setConnectingStatus('');
    }
  };

  // Handle login with extension (nos2x)
  const handleNos2xLogin = async () => {
    setIsLoading(true);
    setError('');
    setConnectingStatus('Checking for nos2x extension...');

    try {
      // Check if nos2x extension is available
      if (!(window as any).nostr) {
        throw new Error('nos2x extension not found. Please install it from https://github.com/fiatjaf/nos2x');
      }
      
      try {
        // Get public key from nos2x
        const pubkey = await (window as any).nostr.getPublicKey();
        
        if (!pubkey) {
          throw new Error('Failed to get public key from nos2x');
        }
        
        setConnectingStatus('Public key obtained, fetching profile...');
        
        // Initialize NDK
        const ndk = await initializeNDK();
        
        // Create a default profile
        let profile: NostrProfile = {
          name: 'nos2x User',
          about: 'A Nostr user using nos2x extension'
        };

        // Try to fetch the profile if we're connected to relays
        const relayConnected = Array.from(ndk.pool.relays.values())
          .filter(relay => relay.status === 1).length > 0;
        
        if (relayConnected) {
          try {
            const user = ndk.getUser({ hexpubkey: pubkey });
            const fetchedProfile = await user.fetchProfile();
            
            if (fetchedProfile) {
              profile = sanitizeProfile(fetchedProfile);
            }
          } catch (profileErr) {
            console.log('Failed to fetch profile, using default', profileErr);
          }
        }
        
        // Store the pubkey and profile in localStorage
        localStorage.setItem('nostr_pubkey', pubkey);
        localStorage.setItem('nostr_profile', JSON.stringify(profile));
        localStorage.setItem('nostr_login_method', 'nos2x');
        localStorage.setItem('nostr_auth_timestamp', Date.now().toString());
        
        // Call both the AuthContext login and component-specific onLogin callback
        login(pubkey, profile);
        onLogin(pubkey, profile);
        onClose();
      } catch (err) {
        console.error('nos2x error:', err);
        throw new Error('Error connecting to nos2x. Make sure you have granted permission.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login with nos2x.');
    } finally {
      setIsLoading(false);
      setConnectingStatus('');
    }
  };

  // Handle login with Alby
  const handleAlbyLogin = async () => {
    setIsLoading(true);
    setError('');
    setConnectingStatus('Checking for Alby extension...');

    try {
      // Check if Alby's webln is available
      if (!(window as any).webln) {
        throw new Error('Alby extension not found. Please install it from https://getalby.com');
      }
      
      try {
        // Initialize webln
        await (window as any).webln.enable();
        
        // Try to get nostr public key from Alby
        const info = await (window as any).webln.getInfo();
        
        if (!info.nostrPubkey) {
          throw new Error('Could not get Nostr public key from Alby. Make sure your Nostr account is connected in Alby settings.');
        }
        
        const pubkey = info.nostrPubkey;
        setConnectingStatus('Public key obtained from Alby, setting up profile...');
        
        // Create a default profile
        const profile: NostrProfile = {
          name: 'Alby User',
          about: 'A Nostr user using Alby extension',
          picture: 'https://getalby.com/alby-icon.png' // Default Alby icon
        };
        
        // Initialize NDK and try to fetch actual profile
        try {
          const ndk = await initializeNDK();
          const relayConnected = Array.from(ndk.pool.relays.values())
            .filter(relay => relay.status === 1).length > 0;
          
          if (relayConnected) {
            const user = ndk.getUser({ hexpubkey: pubkey });
            const fetchedProfile = await user.fetchProfile();
            
            if (fetchedProfile) {
              Object.assign(profile, sanitizeProfile(fetchedProfile));
            }
          }
        } catch (ndkErr) {
          console.log('Failed to get profile from NDK, using default', ndkErr);
        }
        
        // Store the pubkey and profile in localStorage
        localStorage.setItem('nostr_pubkey', pubkey);
        localStorage.setItem('nostr_profile', JSON.stringify(profile));
        localStorage.setItem('nostr_login_method', 'alby');
        localStorage.setItem('nostr_auth_timestamp', Date.now().toString());
        
        // Call both the AuthContext login and component-specific onLogin callback
        login(pubkey, profile);
        onLogin(pubkey, profile);
        onClose();
      } catch (err) {
        console.error('Alby error:', err);
        throw new Error('Error connecting to Alby. Make sure you have granted permission.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login with Alby.');
    } finally {
      setIsLoading(false);
      setConnectingStatus('');
    }
  };

  /***************************************************************************
   * ⚠️⚠️⚠️ PRODUCTION IMPLEMENTATION NEEDED ⚠️⚠️⚠️
   * 
   * Before going live, implement a real NWC login flow:
   * 1. Create proper NWC connection using nostr-tools
   * 2. Handle connection errors gracefully
   * 3. Store connection info securely
   * 4. Add ability to reconnect to existing NWC connections
   * 
   * See https://nwc.getalby.com/v1/demo for implementation examples
   ***************************************************************************/
  
  // Handle login with Nostr Wallet Connect (NWC)
  const handleNWCLogin = async () => {
    setIsLoading(true);
    setError('');
    setConnectingStatus('Nostr Wallet Connect is not yet implemented');

    try {
      // This would be replaced with actual NWC implementation
      setTimeout(() => {
        setError('Nostr Wallet Connect support coming soon!');
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      console.error('NWC login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login with NWC.');
      setIsLoading(false);
    }
  };

  // Handle login based on selected method
  const handleLogin = () => {
    switch (activeTab) {
      case 'nsec':
        handleNsecLogin();
        break;
      case 'nos2x':
        handleNos2xLogin();
        break;
      case 'alby':
        handleAlbyLogin();
        break;
      case 'nwc':
        handleNWCLogin();
        break;
      default:
        handleNsecLogin();
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
                <strong>Security Notice:</strong> Your private key is never sent to our servers or shared with any third party.
              </Text>
            </Box>
            
            {/* Login method tabs */}
            <Tabs isFitted variant="enclosed" onChange={(index) => {
              setActiveTab(['nsec', 'nos2x', 'alby', 'nwc'][index] as NostrLoginMethod);
              setError('');
            }}>
              <TabList mb="1em">
                <Tab><Icon as={FaKey} mr={2} /> Private Key</Tab>
                <Tab><Icon as={FaUserCircle} mr={2} /> nos2x</Tab>
                <Tab><Icon as={FaBolt} mr={2} /> Alby</Tab>
                <Tab><Icon as={FaPlug} mr={2} /> NWC</Tab>
              </TabList>
              <TabPanels>
                {/* nsec private key tab */}
                <TabPanel p={0}>
                  <VStack spacing={3} align="stretch">
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
                    
                    <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
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
                </TabPanel>
                
                {/* nos2x extension tab */}
                <TabPanel p={0}>
                  <VStack spacing={3} align="stretch">
                    <Text>
                      Connect with nos2x browser extension:
                    </Text>
                    
                    <Box 
                      p={4} 
                      border="1px" 
                      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} 
                      borderRadius="md" 
                      textAlign="center"
                    >
                      <Image 
                        src="https://github.com/fiatjaf/nos2x/raw/master/extension/icons/128.png" 
                        alt="nos2x logo"
                        boxSize="80px"
                        mx="auto"
                        mb={3}
                      />
                      <Text>
                        Click the login button below to connect using your nos2x extension.
                      </Text>
                    </Box>
                    
                    <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                      Don't have nos2x? Install it from{' '}
                      <Link 
                        href="https://github.com/fiatjaf/nos2x" 
                        isExternal 
                        color="yellow.500"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        GitHub
                      </Link>
                    </Text>
                  </VStack>
                </TabPanel>
                
                {/* Alby extension tab */}
                <TabPanel p={0}>
                  <VStack spacing={3} align="stretch">
                    <Text>
                      Connect with Alby browser extension:
                    </Text>
                    
                    <Box 
                      p={4} 
                      border="1px" 
                      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} 
                      borderRadius="md" 
                      textAlign="center"
                    >
                      <Image 
                        src="https://getalby.com/assets/alby-logo.svg" 
                        alt="Alby logo"
                        boxSize="80px"
                        mx="auto"
                        mb={3}
                      />
                      <Text>
                        Click the login button below to connect using your Alby extension.
                      </Text>
                    </Box>
                    
                    <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                      Don't have Alby? Install it from{' '}
                      <Link 
                        href="https://getalby.com" 
                        isExternal 
                        color="yellow.500"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        getalby.com
                      </Link>
                    </Text>
                  </VStack>
                </TabPanel>
                
                {/* NWC tab */}
                <TabPanel p={0}>
                  <VStack spacing={3} align="stretch">
                    <Text>
                      Connect with Nostr Wallet Connect:
                    </Text>
                    
                    <Box 
                      p={4} 
                      border="1px" 
                      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} 
                      borderRadius="md" 
                      textAlign="center"
                    >
                      <Icon 
                        as={FaPlug} 
                        boxSize="80px" 
                        color="gray.500" 
                        mx="auto" 
                        mb={3}
                      />
                      <Text>
                        Nostr Wallet Connect support coming soon!
                      </Text>
                    </Box>
                    
                    <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                      Learn more about NWC at{' '}
                      <Link 
                        href="https://nwc.getalby.com" 
                        isExternal 
                        color="yellow.500"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        nwc.getalby.com
                      </Link>
                    </Text>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
            
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
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="yellow"
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

NostrLoginEnhanced.displayName = 'NostrLoginEnhanced';

export default NostrLoginEnhanced;