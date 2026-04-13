'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherData } from '@/types';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface WeatherCardProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

export function WeatherCard({ weatherData, isLoading, error }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rain':
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'cloudy':
      case 'partly-cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Weather Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {error || 'Unable to fetch weather data'}
            </p>
            <p className="text-sm text-gray-500">
              Please check your location and try again
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current, locationName } = weatherData;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Cloud className="w-5 h-5 mr-2" />
              Today's Weather
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {locationName}
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <ExternalLink className="w-4 h-4 mr-1" />
            Full Forecast
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Weather */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getWeatherIcon(current.condition)}
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {Math.round(current.tempC)}°C
                </div>
                <div className="text-sm text-gray-600">
                  {current.description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Feels like
              </div>
              <div className="text-lg font-semibold">
                {Math.round(current.feelsLikeC)}°C
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Humidity</div>
              <div className="text-sm font-semibold">{Math.round(current.humidityPct)}%</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Wind className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Wind</div>
              <div className="text-sm font-semibold">{Math.round(current.windSpeedKmh)} km/h</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Gauge className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">UV Index</div>
              <div className="text-sm font-semibold">{Math.round(current.uvIndex)}</div>
            </div>
          </div>

          {/* Farming Advisory */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <div className="text-sm font-medium text-green-800">
                  Farming Advisory
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {current.condition.toLowerCase().includes('rain') 
                    ? 'Good day for applying fertilizer. Rain will help absorption.'
                    : 'Optimal conditions for field work. Low humidity and moderate winds.'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
