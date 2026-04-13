import axios from 'axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  WeatherData, 
  RecommendationResponse, 
  ChatSession, 
  ChatMessage,
  User,
  SoilInput
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      // Show toast for server error
      console.error('Server error, try again');
    } else if (!error.response) {
      // Network error
      console.error('Check your internet connection');
    }
    return Promise.reject(error);
  }
);

// Generic API wrapper functions
export const apiGet = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get(url);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};

export const apiPost = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post(url, data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};

export const apiPut = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const response = await api.put(url, data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};

export const apiDelete = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await api.delete(url);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};

// Weather API
export const weatherAPI = {
  getCurrent: (lat: number, lng: number): Promise<ApiResponse<WeatherData>> =>
    apiGet<WeatherData>(`/weather/current?lat=${lat}&lng=${lng}`),
    
  getForecast: (lat: number, lng: number, days: number = 7): Promise<ApiResponse<WeatherData>> =>
    apiGet<WeatherData>(`/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`),
    
  getAlerts: (lat: number, lng: number): Promise<ApiResponse<WeatherData['alerts']>> =>
    apiGet<WeatherData['alerts']>(`/weather/alerts?lat=${lat}&lng=${lng}`),
};

// Recommendation API
export const recommendAPI = {
  getCropRec: (soilData: SoilInput): Promise<ApiResponse<RecommendationResponse>> =>
    apiPost<RecommendationResponse>('/recommend/crops', soilData),
    
  getIrrigation: (lat: number, lng: number): Promise<ApiResponse<string>> =>
    apiGet<string>(`/recommend/irrigation?lat=${lat}&lng=${lng}`),
    
  getDailyTips: (lat: number, lng: number): Promise<ApiResponse<string[]>> =>
    apiGet<string[]>(`/recommend/tips?lat=${lat}&lng=${lng}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (message: string, sessionId?: string): Promise<ApiResponse<ChatMessage>> =>
    apiPost<ChatMessage>('/chat/message', { message, sessionId }),
    
  getSessions: (): Promise<ApiResponse<ChatSession[]>> =>
    apiGet<ChatSession[]>('/chat/sessions'),
    
  getSession: (sessionId: string): Promise<ApiResponse<ChatSession>> =>
    apiGet<ChatSession>(`/chat/sessions/${sessionId}`),
};

// Auth API
export const authAPI = {
  verifyOTP: (phone: string, otp: string, idToken: string): Promise<ApiResponse<{ user: User; token: string }>> =>
    apiPost<{ user: User; token: string }>('/auth/verify-otp', { phone, otp, idToken }),
    
  refresh: (): Promise<ApiResponse<{ token: string }>> =>
    apiPost<{ token: string }>('/auth/refresh'),
    
  logout: (): Promise<ApiResponse<null>> =>
    apiPost<null>('/auth/logout'),
    
  getProfile: (): Promise<ApiResponse<User>> =>
    apiGet<User>('/auth/profile'),
    
  updateProfile: (userData: Partial<User>): Promise<ApiResponse<User>> =>
    apiPut<User>('/auth/profile', userData),
};

// File upload helper
export const apiUpload = async <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
};
