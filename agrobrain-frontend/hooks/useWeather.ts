import { useQuery } from '@tanstack/react-query';
import { WeatherData, Location, ForecastDay, WeatherAlert } from '@/types';
import { apiGet } from '@/lib/api';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useWeather = (location?: Location): UseWeatherReturn => {
  const {
    data: weatherData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['weather', location?.lat, location?.lng],
    queryFn: async (): Promise<WeatherData> => {
      if (!location) {
        throw new Error('Location is required');
      }

      // In a real app, this would call your backend API
      const response = await apiGet<WeatherData>(`/weather?lat=${location.lat}&lon=${location.lng}`);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch weather data');
      }
    },
    enabled: !!location,
    staleTime: 10 * 60 * 1000, // 10 minutes (match Redis TTL)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    weatherData: weatherData || null,
    isLoading,
    error: error?.message || null,
    refetch: () => refetch(),
  };
};

// Mock weather data generator (for development)
export const generateMockWeatherData = (location: Location): WeatherData => {
  const current = {
    tempC: 25 + Math.random() * 10,
    feelsLikeC: 23 + Math.random() * 10,
    humidityPct: 60 + Math.random() * 30,
    windSpeedKmh: 5 + Math.random() * 15,
    condition: ['sunny', 'partly-cloudy', 'cloudy', 'rain'][Math.floor(Math.random() * 4)],
    description: 'Partly cloudy with light winds',
    iconCode: '01d',
    uvIndex: Math.random() * 11,
  };

  const forecast: ForecastDay[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      tempMaxC: current.tempC + Math.random() * 5,
      tempMinC: current.tempC - Math.random() * 5,
      humidityPct: current.humidityPct + (Math.random() - 0.5) * 20,
      rainProbabilityPct: Math.random() * 100,
      condition: current.condition,
      farmingAdvisory: 'Good conditions for field work',
    });
  }

  const alerts: WeatherAlert[] = Math.random() > 0.7 ? [{
    type: 'rain',
    severity: 'moderate' as const,
    messageHi: ' heavy rain expected',
    messageEn: 'Heavy rain expected in the next 24 hours',
  }] : [];

  return {
    current,
    forecast,
    alerts,
    locationName: `${location.village || location.district || 'Unknown'}, ${location.state || 'Unknown'}`,
    cached: false,
  };
};
