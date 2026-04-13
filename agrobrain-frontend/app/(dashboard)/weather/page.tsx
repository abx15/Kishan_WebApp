'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
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
  RefreshCw,
  AlertTriangle,
  Leaf,
  TrendingUp
} from 'lucide-react';
import { CurrentWeatherHero } from '@/components/weather/CurrentWeatherHero';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeeklyForecastTable } from '@/components/weather/WeeklyForecastTable';
import { AlertsPanel } from '@/components/weather/AlertsPanel';
import { FarmingAdvisory } from '@/components/weather/FarmingAdvisory';
import { WeatherHistoryChart } from '@/components/weather/WeatherHistoryChart';

export default function WeatherPage() {
  const language = useLanguage();
  const { location, getCurrentLocation, isLoading: locationLoading } = useLocation();
  const { weatherData, isLoading: weatherLoading, error: weatherError, refetch } = useWeather(location || undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Get user location on mount
    if (!location && !locationLoading) {
      getCurrentLocation();
    }
  }, [location, locationLoading, getCurrentLocation]);

  useEffect(() => {
    if (weatherData) {
      setLastUpdated(new Date());
    }
  }, [weatherData]);

  const handleRefresh = () => {
    refetch();
    setLastUpdated(new Date());
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

  if (locationLoading || (!location && !weatherLoading)) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (weatherError || !weatherData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              {language === 'hi' ? 'mausam data nahi mil paaya' : 'Unable to fetch weather data'}
            </h2>
            <p className="text-red-700 mb-4">
              {weatherError || (language === 'hi' ? 'krupya apni sthiti check karein' : 'Please check your location and try again')}
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'phir se koshish karein' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'hi' ? 'mausam' : 'Weather'}
          </h1>
          <p className="text-gray-600 mt-1">
            {weatherData.locationName} · {getTimeSinceUpdate()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {weatherData.cached && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              {language === 'hi' ? 'cache se' : 'Cached'}
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={weatherLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${weatherLoading ? 'animate-spin' : ''}`} />
            {language === 'hi' ? 'refresh' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Weather Hero Card */}
          <CurrentWeatherHero 
            weatherData={weatherData} 
            locationName={weatherData.locationName}
            lastUpdated={lastUpdated}
            onRefresh={handleRefresh}
            isLoading={weatherLoading}
          />

          {/* Hourly Forecast */}
          <HourlyForecast forecast={weatherData.forecast.slice(0, 8)} />

          {/* 7-Day Forecast Table */}
          <WeeklyForecastTable forecast={weatherData.forecast} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Alerts Panel */}
          <AlertsPanel alerts={weatherData.alerts} />

          {/* Farming Advisory */}
          <FarmingAdvisory weatherData={weatherData} />

          {/* Weather History Chart */}
          <WeatherHistoryChart />
        </div>
      </div>
    </div>
  );
}
