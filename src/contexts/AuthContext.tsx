import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the NostrProfile interface
export interface NostrProfile {
  name?: string;
  picture?: string;
  about?: string;
  [key: string]: string | undefined; // Allow for other profile properties
}

// Define the shape of our auth context
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  pubkey: string | null;
  profile: NostrProfile | null;
  login: (pubkey: string, profile: NostrProfile) => void;
  logout: () => void;
}

// Create the context with a default empty value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and provides the auth context
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const storedPubkey = localStorage.getItem('nostr_pubkey');
    const storedProfile = localStorage.getItem('nostr_profile');
    
    if (storedPubkey) {
      setPubkey(storedPubkey);
      setIsLoggedIn(true);
      
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch (e) {
          console.error('Failed to parse stored profile:', e);
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = (newPubkey: string, newProfile: NostrProfile) => {
    // Sanitize and validate pubkey
    if (!newPubkey || typeof newPubkey !== 'string') {
      console.error('Invalid pubkey format');
      return;
    }

    // Store authentication data
    localStorage.setItem('nostr_pubkey', newPubkey);
    localStorage.setItem('nostr_profile', JSON.stringify(newProfile));
    
    // Update state
    setPubkey(newPubkey);
    setProfile(newProfile);
    setIsLoggedIn(true);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  // Logout function
  const logout = () => {
    // Clear stored data
    localStorage.removeItem('nostr_pubkey');
    localStorage.removeItem('nostr_profile');
    
    // Update state
    setPubkey(null);
    setProfile(null);
    setIsLoggedIn(false);
    
    // Navigate to homepage
    navigate('/');
  };

  // Construct the context value
  const value = {
    isLoggedIn,
    isLoading,
    pubkey,
    profile,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}