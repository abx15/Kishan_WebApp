import { User } from '@/types';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Auth response interface
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request interface
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'farmer' | 'agronomist' | 'admin';
  language: 'hi' | 'en';
}

// Google auth request interface
export interface GoogleAuthRequest {
  google_token: string;
}

// Token management
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (access_token: string, refresh_token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// User management
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// API helper with authentication
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAccessToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401) {
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      // Retry the original request with new token
      const newToken = getAccessToken();
      if (newToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return fetch(`${API_BASE_URL}${endpoint}`, config);
      }
    }
    // If refresh failed, clear tokens and redirect to login
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  }

  return response;
};

// Authentication functions
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    // Handle different error response formats
    const errorMessage = error.detail || error.message || error.error || 'Login failed';
    throw new Error(errorMessage);
  }

  const data: AuthResponse = await response.json();
  setTokens(data.access_token, data.refresh_token);
  setCurrentUser(data.user);
  return data;
};

export const register = async (userData: RegisterRequest): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    // Handle different error response formats
    const errorMessage = error.detail || error.message || error.error || 'Registration failed';
    throw new Error(errorMessage);
  }

  return response.json();
};

export const googleAuth = async (google_token: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ google_token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Google authentication failed');
  }

  const data: AuthResponse = await response.json();
  setTokens(data.access_token, data.refresh_token);
  setCurrentUser(data.user);
  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiCall('/auth/logout', { method: 'POST' });
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API call failed:', error);
  } finally {
    clearTokens();
  }
};

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data: AuthResponse = await response.json();
    setTokens(data.access_token, data.refresh_token);
    setCurrentUser(data.user);
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send reset email');
  }
};

export const resetPassword = async (token: string, new_password: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset password');
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Email verification failed');
  }
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await apiCall('/api/v1/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  const updatedUser: User = await response.json();
  setCurrentUser(updatedUser);
  return updatedUser;
};

export const changePassword = async (current_password: string, new_password: string): Promise<void> => {
  const response = await apiCall('/api/v1/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password, new_password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to change password');
  }
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/auth/check-username?username=${username}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check username');
  }

  const data = await response.json();
  return data.available;
};

export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/auth/check-email?email=${email}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check email');
  }

  const data = await response.json();
  return data.available;
};

// Auth context hook
export const useAuth = () => {
  const user = getCurrentUser();
  const token = getAccessToken();
  
  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    register,
    googleAuth,
    logout,
    refreshAccessToken,
  };
};
