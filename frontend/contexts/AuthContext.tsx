"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { 
  useAuth as useAuthHook, 
  login, 
  register, 
  googleAuth, 
  logout,
  refreshAccessToken,
  updateProfile,
  changePassword
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  googleAuth: (google_token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
  changePassword: (current_password: string, new_password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by making a lightweight API call
          // This could be a /api/v1/auth/me endpoint
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/me`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              // Token is invalid, try to refresh
              const refreshSuccess = await refreshAccessToken();
              if (!refreshSuccess) {
                // Refresh failed, clear auth state
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
              } else {
                // Refresh succeeded, update state
                const newToken = localStorage.getItem('access_token');
                const newUser = localStorage.getItem('user');
                setToken(newToken);
                setUser(newUser ? JSON.parse(newUser) : null);
              }
            }
          } catch (error) {
            // Network error or other issue, assume token is valid for now
            console.error('Token validation failed:', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const authResponse = await login(email, password);
      setUser(authResponse.user);
      setToken(authResponse.access_token);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      await register(userData);
      // Registration doesn't log the user in automatically
      // They need to verify their email first
    } catch (error) {
      throw error;
    }
  };

  const handleGoogleAuth = async (google_token: string) => {
    try {
      const authResponse = await googleAuth(google_token);
      setUser(authResponse.user);
      setToken(authResponse.access_token);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      // Even if logout API fails, clear local state
      setUser(null);
      setToken(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  };

  const handleUpdateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const handleChangePassword = async (current_password: string, new_password: string) => {
    try {
      await changePassword(current_password, new_password);
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const refreshSuccess = await refreshAccessToken();
      if (refreshSuccess) {
        const newToken = localStorage.getItem('access_token');
        const newUser = localStorage.getItem('user');
        setToken(newToken);
        setUser(newUser ? JSON.parse(newUser) : null);
      }
    } catch (error) {
      console.error('User refresh failed:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    googleAuth: handleGoogleAuth,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
