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
  timeout: 15000, // Increased default timeout to 15s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please wait before trying again.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Please try again.');
    } else if (!error.response) {
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
    api.post('/recommend/crop', soilData, { timeout: 45000 }) // 45s timeout for AI + ML
      .then(res => ({ success: true as const, data: res.data }))
      .catch(err => ({ success: false as const, error: err.response?.data?.message || err.message })),
    
  getIrrigation: (lat: number, lng: number, soil: any, crop: string): Promise<ApiResponse<any>> =>
    apiPost<any>('/recommend/irrigation', { lat, lng, soil, crop }),
    
  getDailyTips: (): Promise<ApiResponse<any>> =>
    apiGet<any>('/recommend/daily-tips'),
    
  getHistory: (limit: number = 1): Promise<ApiResponse<any>> =>
    apiGet<any>(`/recommend/history?limit=${limit}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (message: string, sessionId?: string, context?: any): Promise<ApiResponse<any>> =>
    api.post('/chat/message', { message, sessionId, context }, { timeout: 45000 })
      .then(res => ({ success: true as const, data: res.data }))
      .catch(err => ({ success: false as const, error: err.response?.data?.message || err.message })),
    
  getSessions: (): Promise<ApiResponse<ChatSession[]>> =>
    apiGet<ChatSession[]>('/chat/sessions'),
    
  getSession: (sessionId: string): Promise<ApiResponse<ChatSession>> =>
    apiGet<ChatSession>(`/chat/sessions/${sessionId}`),
};

// Auth API
export const authAPI = {
  verifyOTP: (phone: string, otpToken: string): Promise<ApiResponse<any>> =>
    apiPost<any>('/auth/verify-otp', { phone, otp_token: otpToken }),
    
  refresh: (refreshToken: string): Promise<ApiResponse<any>> =>
    apiPost<any>('/auth/refresh', { refresh_token: refreshToken }),
    
  logout: (): Promise<ApiResponse<null>> =>
    apiPost<null>('/auth/logout'),
    
  getProfile: (): Promise<ApiResponse<User>> =>
    apiGet<User>('/auth/me'),
    
  updateProfile: (userData: Partial<User>): Promise<ApiResponse<User>> =>
    api.patch<User>('/auth/profile', userData)
      .then(res => ({ success: true as const, data: res.data }))
      .catch(err => ({ success: false as const, error: err.response?.data?.message || err.message })),
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
