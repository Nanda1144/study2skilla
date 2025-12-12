
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { getCurrentUser, loginUser, logoutUser, registerUser, updateUserProfile } from '../services/storage';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (profile: UserProfile, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (profile: UserProfile) => void;
  loading: boolean;
  loginGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check storage on mount async
    const initAuth = async () => {
      try {
        const storedUser = await getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (profile: UserProfile, password: string) => {
    setLoading(true);
    try {
      const newUser = await registerUser(profile, password);
      // Automatically login after register (handled by service returning user and setting session)
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateUser = async (profile: UserProfile) => {
    // Optimistic update
    setUser(profile);
    // Persist async
    await updateUserProfile(profile);
  };

  const loginGuest = async () => {
     const guestUser: UserProfile = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: 'guest@demo.com',
      domain: 'Full Stack Development',
      university: 'Demo University',
      year: '1st Year',
      skills: ['React', 'TypeScript'],
      bio: 'Just exploring.',
      role: 'guest',
      status: 'active',
      gamification: { xp: 0, level: 1, badges: [], streakDays: 0, studyHoursTotal: 0 }
    };
    // Manually set session for guest
    localStorage.setItem('study2skills_session', JSON.stringify(guestUser));
    setUser(guestUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, loginGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
