'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WeatherData } from '@/types';
import { useLanguage } from '@/store/useAppStore';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  RefreshCw
} from 'lucide-react';

interface CurrentWeatherHeroProps {
  weatherData: WeatherData;
  locationName: string;
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export function CurrentWeatherHero({ 
  weatherData, 
  locationName, 
  lastUpdated, 
  onRefresh, 
  isLoading 
}: CurrentWeatherHeroProps) {
  const language = useLanguage();
  const { current } = weatherData;

  const getWeatherGradient = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return 'bg-gradient-to-br from-yellow-50 to-orange-50';
      case 'rain':
      case 'rainy':
        return 'bg-gradient-to-br from-blue-50 to-slate-100';
      case 'cloudy':
      case 'partly-cloudy':
        return 'bg-gradient-to-br from-gray-50 to-slate-50';
      default:
        return 'bg-gradient-to-br from-gray-50 to-blue-50';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-12 h-12 text-yellow-500" />;
      case 'rain':
      case 'rainy':
        return <CloudRain className="w-12 h-12 text-blue-500" />;
      case 'cloudy':
      case 'partly-cloudy':
        return <Cloud className="w-12 h-12 text-gray-500" />;
      default:
        return <Cloud className="w-12 h-12 text-gray-500" />;
    }
  };

  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return null;
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return language === 'hi' ? 'abhi' : 'Just now';
    if (minutes < 60) return `${minutes} ${language === 'hi' ? 'minute' : 'minutes'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${language === 'hi' ? 'ghante' : 'hours'} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} ${language === 'hi' ? 'din' : 'days'} ago`;
  };

  return (
    <Card className={`${getWeatherGradient(current.condition)} border-0 shadow-lg`}>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {locationName}
            </h2>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span>{getTimeSinceUpdate()}</span>
              {weatherData.cached && (
                <Badge variant="outline" className="text-green-600 border-green-600 bg-white/50">
                  {language === 'hi' ? 'cache se' : 'Cached'}
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="bg-white/80 hover:bg-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {language === 'hi' ? 'refresh' : 'Refresh'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Temperature and Condition */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-7xl font-bold text-gray-900 leading-none">
                {Math.round(current.tempC)}°
              </div>
              <div className="text-lg text-gray-700 mt-2">
                {current.condition}
              </div>
            </div>
            <div className="hidden md:block">
              {getWeatherIcon(current.condition)}
            </div>
          </div>

          {/* Right Side - Weather Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-xs text-gray-600">
                    {language === 'hi' ? 'mehsus' : 'Feels like'}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {Math.round(current.feelsLikeC)}°C
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-600">
                    {language === 'hi' ? 'nami' : 'Humidity'}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {Math.round(current.humidityPct)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-xs text-gray-600">
                    {language === 'hi' ? 'hawa' : 'Wind'}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {Math.round(current.windSpeedKmh)} km/h
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-xs text-gray-600">
                    {language === 'hi' ? 'UV index' : 'UV Index'}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {Math.round(current.uvIndex)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Description */}
        <div className="mt-6 p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-700">
            {current.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
