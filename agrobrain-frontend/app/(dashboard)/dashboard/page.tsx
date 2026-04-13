'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { CropRecommendCard } from '@/components/dashboard/CropRecommendCard';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { DailyTipsCard } from '@/components/dashboard/DailyTipsCard';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { useUser } from '@/store/useAppStore';
import { 
  Cloud, 
  Sprout, 
  AlertTriangle, 
  TrendingUp,
  MapPin,
  RefreshCw,
  Calendar,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations();
  const user = useUser();
  const { location, getCurrentLocation, isLoading: locationLoading } = useLocation();
  const { weatherData, isLoading: weatherLoading, error: weatherError, refetch } = useWeather(location);
  
  const [stats, setStats] = useState({
    totalQueries: 0,
    weatherQueries: 0,
    cropRecommendations: 0,
    chatSessions: 0,
  });

  useEffect(() => {
    // Get user location on mount
    if (!location && !locationLoading) {
      getCurrentLocation();
    }

    // Load dashboard stats
    setStats({
      totalQueries: 1234,
      weatherQueries: 567,
      cropRecommendations: 89,
      chatSessions: 234,
    });
  }, [location, locationLoading, getCurrentLocation]);

  const quickActions = [
    {
      title: 'Check Weather',
      description: 'View current weather and forecast',
      icon: Cloud,
      href: '/dashboard/weather',
      color: 'text-blue-600',
    },
    {
      title: 'Get Crop Advice',
      description: 'AI-powered crop recommendations',
      icon: Sprout,
      href: '/dashboard/recommend',
      color: 'text-green-600',
    },
    {
      title: 'Chat Assistant',
      description: 'Ask agricultural questions',
      icon: Users,
      href: '/dashboard/chat',
      color: 'text-purple-600',
    },
    {
      title: 'Voice Commands',
      description: 'Control with voice',
      icon: MapPin,
      href: '/dashboard/voice',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening on your farm today
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          {location && (
            <Badge variant="outline" className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {location.city}
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={weatherLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${weatherLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQueries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather Checks</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weatherQueries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crop Recommendations</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cropRecommendations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chatSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Weather and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeatherCard 
            weatherData={weatherData} 
            isLoading={weatherLoading} 
            error={weatherError}
          />
        </div>
        <div className="space-y-4">
          <AlertBanner />
          <DailyTipsCard />
        </div>
      </div>

      {/* Crop Recommendations */}
      <CropRecommendCard />

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interactions with AgroBrain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '2 hours ago', action: 'Checked weather forecast', icon: Cloud },
              { time: '5 hours ago', action: 'Got crop recommendations', icon: Sprout },
              { time: '1 day ago', action: 'Asked about pest control', icon: Users },
              { time: '2 days ago', action: 'Used voice command', icon: MapPin },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <activity.icon className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
