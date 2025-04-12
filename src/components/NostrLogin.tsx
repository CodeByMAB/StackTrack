import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useColorMode } from '@chakra-ui/react';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import NDK from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';

interface NostrLoginProps {
  onLogin: (pubkey: string, profile: any) => void;
}

interface NostrLoginRef {
  openModal: () => void;
}

interface NostrProfile {
  name?: string;
  picture?: string;
  about?: string;
}

const NostrLogin = forwardRef<NostrLoginRef, NostrLoginProps>(({ onLogin }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const initialRef = useRef<HTMLInputElement>(null);
  const ndkRef = useRef<NDK | null>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setPrivateKey('');
      setError('');
      onOpen();
    }
  }));

  const initializeNDK = async () => {
    if (!ndkRef.current) {
      console.log('Initializing new NDK instance...');
      ndkRef.current = new NDK({
        explicitRelayUrls: [
          'wss://relay.damus.io',
          'wss://nostr.wine',
          'wss://nos.lol',
          'wss://relay.nostr.band',
          'wss://relay.snort.social'
        ]
      });
      
      try {
        console.log('Attempting to connect to NDK relays...');
        await ndkRef.current.connect();
        
        // Wait for relays to connect
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        const connectedRelays = Array.from(ndkRef.current.pool.relays.values())
          .filter(relay => relay.status === 1).length;
        
        console.log(`Connected to ${connectedRelays} relays`);
        
        if (connectedRelays === 0) {
          throw new Error('Failed to connect to any Nostr relays');
        }
      } catch (err) {
        console.error('Failed to connect to NDK:', err);
        throw new Error('Failed to connect to Nostr relays. Please try again later.');
      }
    }
    return ndkRef.current;
  };

  const handleLogin = async () => {
    if (!privateKey) {
      setError('Please enter your private key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Validate and decode the nsec key
      if (!privateKey.startsWith('nsec1')) {
        throw new Error('Invalid private key format. Please enter a valid nsec1 key.');
      }

      const decoded = nip19.decode(privateKey);
      if (decoded.type !== 'nsec') {
        throw new Error('Invalid private key format. Please enter a valid nsec1 key.');
      }

      console.log('Private key decoded successfully');

      // Initialize NDK
      const ndk = await initializeNDK();
      console.log('NDK instance ready');

      // Get the user's public key from the private key
      const user = ndk.getUser({ hexpubkey: decoded.data });
      const pubkey = user.pubkey;

      if (!pubkey) {
        throw new Error('Invalid private key');
      }

      console.log('Attempting to fetch profile for pubkey:', pubkey);

      // Create a default profile
      let profile: NostrProfile = {
        name: 'Bitcoin User',
        about: 'A Nostr user passionate about Bitcoin'
      };

      try {
        // Try to fetch the profile
        const fetchedProfile = await user.fetchProfile();
        if (fetchedProfile) {
          console.log('Profile fetched successfully:', fetchedProfile);
          profile = fetchedProfile;
        }
      } catch (err) {
        console.log('Profile fetch failed, using default profile');
      }

      console.log('Final profile to store:', profile);
      
      // Store the pubkey and profile in localStorage
      localStorage.setItem('nostr_pubkey', pubkey);
      localStorage.setItem('nostr_profile', JSON.stringify(profile));

      // Call the onLogin callback with both pubkey and profile
      onLogin(pubkey, profile);
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please check your private key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        bg={colorMode === 'light' ? 'white' : '#051323'}
        color={colorMode === 'light' ? 'gray.800' : 'white'}
      >
        <ModalHeader>Login with Nostr</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text mb={4}>
            Enter your private key (nsec) to login. Your key is stored locally and never sent to our servers.
          </Text>
          <Input
            ref={initialRef}
            placeholder="nsec1..."
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            type="password"
            autoComplete="off"
          />
          {error && (
            <Text color="red.500" mt={2}>
              {error}
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleLogin}
            isLoading={isLoading}
            loadingText="Logging in..."
          >
            Login
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

NostrLogin.displayName = 'NostrLogin';

export default NostrLogin; 