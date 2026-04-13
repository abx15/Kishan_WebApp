'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Sprout, 
  MessageCircle, 
  Mic,
  MapPin,
  RefreshCw,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  TrendingUp
} from 'lucide-react';
import LanguageToggle from '@/components/shared/LanguageToggle';

export default function DashboardPage() {
  const router = useRouter();
  const [userPhone, setUserPhone] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const phone = localStorage.getItem('userPhone');
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    setUserPhone(phone || 'Farmer');
    
    // Simulate loading weather data
    const loadWeatherData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWeatherData({
          current: {
            tempC: 32,
            feelsLikeC: 36,
            humidityPct: 65,
            windSpeedKmh: 12,
            condition: 'Partly Cloudy',
            description: 'Partly cloudy with moderate humidity',
            uvIndex: 7
          },
          forecast: [
            { day: 'Mon', tempMax: 34, tempMin: 26, condition: 'Sunny', rainChance: 10 },
            { day: 'Tue', tempMax: 33, tempMin: 25, condition: 'Cloudy', rainChance: 30 },
            { day: 'Wed', tempMax: 31, tempMin: 24, condition: 'Rainy', rainChance: 80 },
            { day: 'Thu', tempMax: 32, tempMin: 25, condition: 'Partly Cloudy', rainChance: 20 },
            { day: 'Fri', tempMax: 35, tempMin: 27, condition: 'Sunny', rainChance: 5 },
            { day: 'Sat', tempMax: 34, tempMin: 26, condition: 'Partly Cloudy', rainChance: 15 },
            { day: 'Sun', tempMax: 33, tempMin: 25, condition: 'Cloudy', rainChance: 25 }
          ],
          alerts: [
            {
              type: 'moderate',
              message: 'Heavy rain expected on Wednesday. Plan irrigation accordingly.',
              icon: 'droplets'
            }
          ]
        });
      } catch (error) {
        console.error('Failed to load weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    router.push('/login');
  };

  const quickActions = [
    {
      title: 'Get Crop Advice',
      description: 'AI-powered crop recommendations',
      icon: Sprout,
      href: '/recommend',
      color: 'text-green-600'
    },
    {
      title: 'Weather Forecast',
      description: '7-day weather prediction',
      icon: Cloud,
      href: '/weather',
      color: 'text-blue-600'
    },
    {
      title: 'Ask AI Assistant',
      description: 'Chat with agricultural expert',
      icon: MessageCircle,
      href: '/chat',
      color: 'text-purple-600'
    },
    {
      title: 'Voice Query',
      description: 'Use voice commands',
      icon: Mic,
      href: '/voice',
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgroBrain AI</h1>
                <p className="text-sm text-gray-600">Welcome back, Farmer!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userPhone}</p>
                <p className="text-xs text-gray-600">Premium Member</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather Overview */}
        {weatherData && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="h-5 w-5 mr-2 text-blue-600" />
                  Today's Weather
                </CardTitle>
                <CardDescription>
                  Current conditions at your farm location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Sun className="h-12 w-12 text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold">{weatherData.current.tempC}°C</div>
                    <div className="text-sm text-gray-600">{weatherData.current.condition}</div>
                  </div>
                  <div className="text-center">
                    <Thermometer className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold">Feels Like</div>
                    <div className="text-2xl font-bold">{weatherData.current.feelsLikeC}°C</div>
                  </div>
                  <div className="text-center">
                    <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold">Humidity</div>
                    <div className="text-2xl font-bold">{weatherData.current.humidityPct}%</div>
                  </div>
                  <div className="text-center">
                    <Wind className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <div className="text-lg font-semibold">Wind Speed</div>
                    <div className="text-2xl font-bold">{weatherData.current.windSpeedKmh} km/h</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Weather Alerts */}
        {weatherData?.alerts?.length > 0 && (
          <div className="mb-8">
            {weatherData.alerts.map((alert, index) => (
              <Card key={index} className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-yellow-800">Weather Alert</p>
                      <p className="text-sm text-yellow-700">{alert.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <action.icon className={`h-12 w-12 ${action.color} mx-auto mb-4`} />
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Open
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 7-Day Forecast */}
        {weatherData && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7-Day Forecast</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="font-medium text-gray-900 mb-2">{day.day}</div>
                      <div className="text-2xl mb-2">
                        {day.condition === 'Sunny' && 'Sun'}
                        {day.condition === 'Cloudy' && 'Cloud'}
                        {day.condition === 'Rainy' && 'Droplets'}
                        {day.condition === 'Partly Cloudy' && 'Cloud'}
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold">{day.tempMax}°</div>
                        <div className="text-gray-600">{day.tempMin}°</div>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">{day.rainChance}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
