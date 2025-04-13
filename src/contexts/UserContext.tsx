import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { NostrProfile } from './AuthContext';

interface ExtendedUserData {
  preferences?: {
    notifications?: boolean;
    privacyMode?: boolean;
    currency?: string;
  };
  stats?: {
    totalItems?: number;
    totalValue?: number;
    lastActive?: string;
  };
}

interface UserContextType {
  userData: ExtendedUserData | null;
  profile: NostrProfile | null; // Mirror of auth profile
  updatePreferences: (preferences: Partial<ExtendedUserData['preferences']>) => void;
  updateStats: (stats: Partial<ExtendedUserData['stats']>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { profile: authProfile, isLoggedIn } = useAuth();
  const [userData, setUserData] = useState<ExtendedUserData | null>(null);

  // Load user data from localStorage when auth state changes
  useEffect(() => {
    if (isLoggedIn) {
      const storedUserData = localStorage.getItem('stacktrack_user_data');
      if (storedUserData) {
        try {
          const parsed = JSON.parse(storedUserData);
          setUserData(parsed);
        } catch (e) {
          console.error('Failed to parse stored user data:', e);
          setUserData(null);
        }
      } else {
        // Initialize with default values
        const defaultUserData: ExtendedUserData = {
          preferences: {
            notifications: true,
            privacyMode: false,
            currency: 'USD'
          },
          stats: {
            totalItems: 0,
            totalValue: 0,
            lastActive: new Date().toISOString()
          }
        };
        setUserData(defaultUserData);
        localStorage.setItem('stacktrack_user_data', JSON.stringify(defaultUserData));
      }
    } else {
      setUserData(null);
    }
  }, [isLoggedIn]);

  const updatePreferences = (preferences: Partial<ExtendedUserData['preferences']>) => {
    setUserData(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...preferences
        }
      };
      localStorage.setItem('stacktrack_user_data', JSON.stringify(updated));
      return updated;
    });
  };

  const updateStats = (stats: Partial<ExtendedUserData['stats']>) => {
    setUserData(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        stats: {
          ...prev.stats,
          ...stats,
          lastActive: new Date().toISOString()
        }
      };
      localStorage.setItem('stacktrack_user_data', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{
      userData,
      profile: authProfile, // Mirror the auth profile
      updatePreferences,
      updateStats
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
