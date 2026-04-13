import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Location, WeatherData, AppSettings, LoadingState, ErrorState } from '@/types';

interface AppState {
  // User state
  user: User | null;
  accessToken: string | null;
  language: 'hi' | 'en';
  location: Location | null;
  isLocationLoading: boolean;
  locationPermission: boolean;
  isAuthenticated: boolean;
  
  // Weather state
  weatherData: WeatherData | null;
  weatherLoading: LoadingState;
  weatherError: ErrorState;
  
  // UI state
  settings: AppSettings;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Global loading and error states
  globalLoading: LoadingState;
  globalError: ErrorState;
}

interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  logout: () => void;
  
  // Language settings
  setLanguage: (language: 'hi' | 'en') => void;
  
  // Location actions
  setLocation: (location: Location | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationPermission: (permission: boolean) => void;
  
  // Weather actions
  setWeatherData: (weatherData: WeatherData | null) => void;
  setWeatherLoading: (loading: LoadingState) => void;
  setWeatherError: (error: ErrorState) => void;
  
  // UI actions
  setSettings: (settings: Partial<AppSettings>) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Global state actions
  setGlobalLoading: (loading: LoadingState) => void;
  setGlobalError: (error: ErrorState) => void;
  clearGlobalError: () => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      language: 'hi', // Default to Hindi as specified
      location: null,
      isLocationLoading: false,
      locationPermission: false,
      isAuthenticated: false,
      weatherData: null,
      weatherLoading: { isLoading: false },
      weatherError: { hasError: false },
      settings: {
        language: 'hi',
        theme: 'system',
        notifications: true,
        locationServices: true,
        voiceCommands: true,
        autoRefresh: true,
        refreshInterval: 300000, // 5 minutes
      },
      sidebarOpen: true,
      theme: 'system',
      globalLoading: { isLoading: false },
      globalError: { hasError: false },

      // User actions
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setToken: (token) => set({ accessToken: token }),
      clearToken: () => set({ accessToken: null }),
      logout: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      }),
      
      // Language settings (persisted in localStorage)
      setLanguage: (language) => set({ 
        language,
        settings: { ...get().settings, language }
      }),

      // Location actions
      setLocation: (location) => set({ location }),
      setLocationLoading: (loading) => set({ isLocationLoading: loading }),
      setLocationPermission: (permission) => set({ locationPermission: permission }),

      // Weather actions
      setWeatherData: (weatherData) => set({ weatherData }),
      setWeatherLoading: (loading) => set({ weatherLoading: loading }),
      setWeatherError: (error) => set({ weatherError: error }),

      // UI actions
      setSettings: (newSettings) => set((state) => ({ 
        settings: { ...state.settings, ...newSettings } 
      })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ 
        theme,
        settings: { ...get().settings, theme }
      }),

      // Global state actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      setGlobalError: (error) => set({ globalError: error }),
      clearGlobalError: () => set({ globalError: { hasError: false } }),
    }),
    {
      name: 'agrobrain-store',
      partialize: (state) => ({
        accessToken: state.accessToken,
        language: state.language,
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
);

// Selectors for common use cases
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useLocation = () => useAppStore((state) => state.location);
export const useWeatherData = () => useAppStore((state) => state.weatherData);
export const useSettings = () => useAppStore((state) => state.settings);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);
export const useLanguage = () => useAppStore((state) => state.language);
