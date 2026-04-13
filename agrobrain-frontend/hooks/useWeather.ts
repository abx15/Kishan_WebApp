import { useState, useEffect } from 'react';
import { WeatherData, Location } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { apiGet } from '@/lib/api';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
}

export const useWeather = (location?: Location): UseWeatherReturn => => {
  const { 
    weatherData, 
    weatherLoading, 
    weatherError,
    setWeatherData, 
    setWeatherLoading, 
    setWeatherError,
    settings 
  } = useAppStore();
  
  const [refreshInterval, setRefreshInterval] = useState(settings.refreshInterval);

  const fetchWeatherData = async (): Promise<void> => {
    if (!location) return;

    setWeatherLoading({ isLoading: true, message: 'Fetching weather data...' });
    setWeatherError({ hasError: false });

    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate the API call
      const response = await apiGet<WeatherData>(`/weather?lat=${location.latitude}&lon=${location.longitude}`);
      
      if (response.success && response.data) {
        setWeatherData(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch weather data');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch weather data';
      setWeatherError({ hasError: true, message: errorMessage });
    } finally {
      setWeatherLoading({ isLoading: false });
    }
  };

  const refetch = async (): Promise<void> => {
    await fetchWeatherData();
  };

  // Fetch weather data when location changes
  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  // Set up auto-refresh
  useEffect(() => {
    if (!location || !settings.autoRefresh) return;

    const interval = setInterval(() => {
      fetchWeatherData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [location, refreshInterval, settings.autoRefresh]);

  return {
    weatherData,
    isLoading: weatherLoading.isLoading,
    error: weatherError.message || null,
    refetch,
    refreshInterval,
    setRefreshInterval,
  };
};

// Mock weather data generator (for development)
export const generateMockWeatherData = (location: Location): WeatherData => {
  const current = {
    temperature: 25 + Math.random() * 10,
    humidity: 60 + Math.random() * 30,
    windSpeed: 5 + Math.random() * 15,
    windDirection: Math.random() * 360,
    pressure: 1000 + Math.random() * 50,
    visibility: 8 + Math.random() * 4,
    uvIndex: Math.random() * 11,
    condition: ['sunny', 'partly-cloudy', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
    icon: 'sun',
    lastUpdated: new Date().toISOString(),
  };

  const forecast: any[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      maxTemp: current.temperature + Math.random() * 5,
      minTemp: current.temperature - Math.random() * 5,
      condition: current.condition,
      icon: current.icon,
      humidity: current.humidity + (Math.random() - 0.5) * 20,
      windSpeed: current.windSpeed + (Math.random() - 0.5) * 5,
      precipitationChance: Math.random() * 100,
      precipitationAmount: Math.random() * 10,
    });
  }

  const alerts = Math.random() > 0.7 ? [{
    id: '1',
    title: 'Heavy Rain Warning',
    description: 'Heavy rain expected in the next 24 hours',
    severity: 'moderate' as const,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    areas: [location.city],
  }] : [];

  return {
    location,
    current,
    forecast,
    alerts,
  };
};
