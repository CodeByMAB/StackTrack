import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN_EXPIRY } from '../services/SecurityService';

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
  login: (pubkey: string, profile: NostrProfile, loginMethod?: string) => void;
  logout: () => void;
  checkAuthStatus: () => void;
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

  // Function to check auth status
  const checkAuthStatus = useCallback(() => {
    const storedPubkey = localStorage.getItem('nostr_pubkey');
    const storedProfile = localStorage.getItem('nostr_profile');
    const authTimestamp = localStorage.getItem('nostr_auth_timestamp');
    
    // Check for valid authentication
    const isAuth = storedPubkey && authTimestamp && 
      parseInt(authTimestamp, 10) + AUTH_TOKEN_EXPIRY > Date.now();
    
    if (isAuth && storedPubkey) {
      setPubkey(storedPubkey);
      setIsLoggedIn(true);
      
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          setProfile(parsedProfile);
        } catch (e) {
          console.error('Failed to parse stored profile:', e);
          setProfile(null);
        }
      }
    } else {
      // Clear potentially invalid data
      localStorage.removeItem('nostr_pubkey');
      localStorage.removeItem('nostr_profile');
      localStorage.removeItem('nostr_auth_timestamp');
      localStorage.removeItem('nostr_login_method');
      setPubkey(null);
      setProfile(null);
      setIsLoggedIn(false);
    }
    
    setIsLoading(false);
  }, []);

  // Check login status on mount and handle storage events
  useEffect(() => {
    // Initial check
    checkAuthStatus();
    
    // Listen for storage events (in case another tab logs in/out)
    const handleStorageChange = (event: StorageEvent) => {
      if (['nostr_pubkey', 'nostr_profile', 'nostr_auth_timestamp', 'nostr_login_method'].includes(event.key || '')) {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up interval to periodically check auth status
    const authCheckInterval = setInterval(checkAuthStatus, 60000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(authCheckInterval);
    };
  }, [checkAuthStatus]);

  // Login function
  const login = useCallback((newPubkey: string, newProfile: NostrProfile, loginMethod?: string) => {
    // Sanitize and validate pubkey
    if (!newPubkey || typeof newPubkey !== 'string') {
      console.error('Invalid pubkey format');
      return;
    }

    // Store authentication data
    localStorage.setItem('nostr_pubkey', newPubkey);
    localStorage.setItem('nostr_profile', JSON.stringify(newProfile));
    localStorage.setItem('nostr_auth_timestamp', Date.now().toString());
    if (loginMethod) {
      localStorage.setItem('nostr_login_method', loginMethod);
    }
    
    // Update state
    setPubkey(newPubkey);
    setProfile(newProfile);
    setIsLoggedIn(true);
    
    // Navigate to dashboard
    navigate('/dashboard');
  }, [navigate]);

  // Logout function
  const logout = useCallback(() => {
    // Clear stored data
    localStorage.removeItem('nostr_pubkey');
    localStorage.removeItem('nostr_profile');
    localStorage.removeItem('nostr_auth_timestamp');
    localStorage.removeItem('nostr_login_method');
    
    // Update state
    setPubkey(null);
    setProfile(null);
    setIsLoggedIn(false);
    
    // Navigate to homepage
    navigate('/');
  }, [navigate]);

  // Construct the context value
  const value = {
    isLoggedIn,
    isLoading,
    pubkey,
    profile,
    login,
    logout,
    checkAuthStatus
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