import { apiCall } from './auth';

// API response interfaces
export interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  verifiedAgronomists: number;
  pendingIssues: number;
  cropHealth: string;
  soilMoisture: number;
  weatherCondition: string;
  temperature: number;
  farmersHelped: number;
  consultations: number;
  cropsDiagnosed: number;
  successRate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  avatar?: string;
}

export interface FarmerRequest {
  id: string;
  farmer: string;
  location: string;
  crop: string;
  issue: string;
  priority: string;
  time: string;
  status: string;
}

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    rain: number;
  }>;
}

export interface CropRecommendation {
  crop: string;
  suitability: number;
  season: string;
  expectedYield: string;
  currentMarketPrice?: string;
}

// Admin API functions
export const getAdminStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiCall('/admin/stats', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch admin stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

export const getRecentUsers = async (): Promise<User[]> => {
  try {
    const response = await apiCall('/admin/users', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch recent users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent users:', error);
    throw error;
  }
};

export const getFarmerRequests = async (): Promise<FarmerRequest[]> => {
  try {
    const response = await apiCall('/admin/farmer-requests', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch farmer requests');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching farmer requests:', error);
    throw error;
  }
};

// Farmer API functions
export const getFarmerStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiCall('/farmer/stats', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch farmer stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching farmer stats:', error);
    throw error;
  }
};

export const getFarmerWeatherData = async (): Promise<WeatherData> => {
  try {
    const response = await apiCall('/farmer/weather', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getCropRecommendations = async (): Promise<CropRecommendation[]> => {
  try {
    const response = await apiCall('/farmer/crop-recommendations', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch crop recommendations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching crop recommendations:', error);
    throw error;
  }
};

// Agronomist API functions
export const getAgronomistStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiCall('/agronomist/stats', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch agronomist stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching agronomist stats:', error);
    throw error;
  }
};

export const getConsultations = async (): Promise<any[]> => {
  try {
    const response = await apiCall('/agronomist/consultations', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch consultations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching consultations:', error);
    throw error;
  }
};

export const getAdvisoryTips = async (): Promise<any[]> => {
  try {
    const response = await apiCall('/agronomist/advisory-tips', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch advisory tips');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching advisory tips:', error);
    throw error;
  }
};

// Common API functions
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await apiCall('/auth/profile', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserStatus = async (status: string): Promise<void> => {
  try {
    const response = await apiCall('/user/status', {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      throw new Error('Failed to update user status');
    }
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};
