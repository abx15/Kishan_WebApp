'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { CropRecommendCard } from '@/components/dashboard/CropRecommendCard';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { DailyTipsCard } from '@/components/dashboard/DailyTipsCard';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { useUser, useLanguage } from '@/store/useAppStore';
import { 
  Cloud, 
  Sprout, 
  MessageCircle, 
  Mic,
  MapPin,
  RefreshCw,
  TrendingUp,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const user = useUser();
  const language = useLanguage();
  const { location, getCurrentLocation, isLoading: locationLoading } = useLocation();
  const { weatherData, isLoading: weatherLoading, error: weatherError, refetch } = useWeather(location || undefined);
  
  const [stats] = useState({
    totalQueries: 1234,
    weatherQueries: 567,
    cropRecommendations: 89,
    chatSessions: 234,
  });

  useEffect(() => {
    // Get user location on mount
    if (!location && !locationLoading) {
      getCurrentLocation();
    }
  }, [location, locationLoading, getCurrentLocation]);

  const quickActions = [
    {
      title: language === 'hi' ? 'ð Get Crop Advice' : 'ð Get Crop Advice',
      description: language === 'hi' ? 'AI-powered crop recommendations' : 'AI-powered crop recommendations',
      href: '/dashboard/recommend',
    },
    {
      title: language === 'hi' ? 'ð§ Irrigation Plan' : 'ð§ Irrigation Plan',
      description: language === 'hi' ? 'Smart irrigation scheduling' : 'Smart irrigation scheduling',
      href: '/dashboard/recommend#irrigation',
    },
    {
      title: language === 'hi' ? 'ð¬ Ask AI' : 'ð¬ Ask AI',
      description: language === 'hi' ? 'Chat with agricultural assistant' : 'Chat with agricultural assistant',
      href: '/dashboard/chat',
    },
    {
      title: language === 'hi' ? 'ð Voice Query' : 'ð Voice Query',
      description: language === 'hi' ? 'Use voice commands' : 'Use voice commands',
      href: '/dashboard/voice',
    },
  ];

  // ROW 1 — Location + Quick Weather (full width)
  const renderLocationBar = () => (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">📍</div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {location ? `${location.village || location.district || 'Unknown'}, ${location.state || 'Unknown'}` : 'Loading location...'}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'hi' ? 'aapaki sthiti' : 'Your location'}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            {language === 'hi' ? 'badlein' : 'Change'}
          </Button>
        </div>
        
        {weatherData && (
          <div className="mt-4 flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">
                {weatherData.current.condition.toLowerCase().includes('sunny') ? '☀️' : 
                 weatherData.current.condition.toLowerCase().includes('rain') ? '🌧️' : '☁️'}
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.round(weatherData.current.tempC)}°C</div>
                <div className="text-sm text-gray-600">{weatherData.current.description}</div>
              </div>
            </div>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span>💧</span>
                <span>{Math.round(weatherData.current.humidityPct)}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>💨</span>
                <span>{Math.round(weatherData.current.windSpeedKmh)} km/h</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // ROW 2 — 3 stat cards
  const renderStatCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Weather Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="w-5 h-5 mr-2 text-blue-600" />
            {language === 'hi' ? 'aaj ka mausam' : "Today's Weather"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weatherData ? (
            <div className="space-y-4">
              <div className="text-4xl font-bold text-center">
                {Math.round(weatherData.current.tempC)}°C
              </div>
              <div className="text-center">
                <div className="text-lg">{weatherData.current.condition}</div>
                <div className="text-sm text-gray-600">{weatherData.current.description}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-gray-600">Feels like</div>
                  <div className="font-semibold">{Math.round(weatherData.current.feelsLikeC)}°C</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Humidity</div>
                  <div className="font-semibold">{Math.round(weatherData.current.humidityPct)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">UV Index</div>
                  <div className="font-semibold">{Math.round(weatherData.current.uvIndex)}</div>
                </div>
              </div>
              <Link href="/dashboard/weather">
                <Button variant="outline" className="w-full">
                  {language === 'hi' ? 'purna bhavishyavani →' : 'Full Forecast →'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {weatherLoading ? 'Loading weather...' : 'Weather data unavailable'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Crop Recommendation Card */}
      <CropRecommendCard />

      {/* Daily AI Tip Card */}
      <DailyTipsCard />
    </div>
  );

  // ROW 3 — Alerts Banner (conditional)
  const renderAlertsBanner = () => <AlertBanner />;

  // ROW 4 — Quick Actions (2x2 grid)
  const renderQuickActions = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {language === 'hi' ? 'tej kriyaen' : 'Quick Actions'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">{action.title.split(' ')[0]}</div>
                <div className="font-medium text-sm">{action.title.split(' ').slice(1).join(' ')}</div>
                <div className="text-xs text-gray-600 mt-1">{action.description}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );

  // ROW 5 — 7-Day Forecast (horizontal scroll)
  const render7DayForecast = () => {
    if (!weatherData?.forecast) return null;

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'hi' ? '7 din ki bhavishyavani' : '7-Day Forecast'}
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-7 lg:overflow-x-hidden">
          {weatherData.forecast.map((day, index) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
            
            return (
              <Card key={index} className="flex-shrink-0 w-32 lg:flex-shrink lg:w-auto">
                <CardContent className="p-4 text-center">
                  <div className="font-medium text-sm mb-2">{dayName}</div>
                  <div className="text-2xl mb-2">
                    {day.condition.toLowerCase().includes('sunny') ? '☀️' : 
                     day.condition.toLowerCase().includes('rain') ? '🌧️' : '☁️'}
                  </div>
                  <div className="text-sm font-semibold">{Math.round(day.tempMaxC)}°</div>
                  <div className="text-xs text-gray-600">{Math.round(day.tempMinC)}°</div>
                  <div className="text-xs text-blue-600 mt-1">{Math.round(day.rainProbabilityPct)}%</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ROW 1 — Location + Quick Weather */}
      {renderLocationBar()}
      
      {/* ROW 2 — 3 stat cards */}
      {renderStatCards()}
      
      {/* ROW 3 — Alerts Banner */}
      {renderAlertsBanner()}
      
      {/* ROW 4 — Quick Actions */}
      {renderQuickActions()}
      
      {/* ROW 5 — 7-Day Forecast */}
      {render7DayForecast()}
    </div>
  );
}
