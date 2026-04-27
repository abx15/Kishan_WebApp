'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Thermometer,
  TrendingUp,
  Cloud,
  MapPin,
  Calendar,
  AlertTriangle,
  Camera,
  Download,
  MessageCircle,
  Leaf,
  BarChart3,
  Activity,
  Wind,
  Eye,
  RefreshCw,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const farmerStats = [
  { icon: Sprout, label: 'Crop Health', value: 'Excellent', sub: 'No pests detected', color: 'bg-green-500/10 text-green-600' },
  { icon: Droplets, label: 'Soil Moisture', value: '68%', sub: 'Optimal range', color: 'bg-blue-500/10 text-blue-600' },
  { icon: Sun, label: 'Weather', value: 'Sunny', sub: 'Perfect for farming', color: 'bg-yellow-500/10 text-yellow-600' },
  { icon: Thermometer, label: 'Temperature', value: '28°C', sub: 'Ideal for crops', color: 'bg-orange-500/10 text-orange-600' },
];

const cropRecommendations = [
  { crop: 'Wheat', suitability: '95%', season: 'Rabi', expectedYield: '4.2 tons/ha' },
  { crop: 'Rice', suitability: '88%', season: 'Kharif', expectedYield: '5.1 tons/ha' },
  { crop: 'Cotton', suitability: '72%', season: 'Kharif', expectedYield: '2.8 tons/ha' },
];

const weatherForecast = [
  { day: 'Today', temp: '28°C', condition: 'Sunny', rain: '0%', icon: Sun },
  { day: 'Tomorrow', temp: '26°C', condition: 'Partly Cloudy', rain: '20%', icon: Cloud },
  { day: 'Wednesday', temp: '27°C', condition: 'Cloudy', rain: '60%', icon: Cloud },
  { day: 'Thursday', temp: '25°C', condition: 'Rainy', rain: '80%', icon: Cloud },
];

function FarmerDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff9eb] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="p-4 bg-gradient-to-br from-[#006b2c] to-[#00873a] rounded-3xl shadow-2xl"
        >
          <Sprout className="h-12 w-12 text-white" />
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Farm Overview', icon: Leaf },
    { id: 'crops', label: 'Crop Advisor', icon: Sprout },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'analysis', label: 'Soil Analysis', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#fff9eb] flex">
      {/* Farmer Sidebar */}
      <div className="w-64 bg-[#006b2c] text-white p-6 border-r border-green-800">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Farmer Portal</h2>
          <p className="text-green-100 text-sm">Smart Farming Assistant</p>
        </div>
        
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                selectedTab === tab.id 
                  ? 'bg-green-700 text-white' 
                  : 'hover:bg-green-800 text-green-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-green-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-green-200">Farmer</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-green-600 text-green-100 hover:bg-green-800"
            onClick={handleLogout}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-green-600 text-green-100 hover:bg-green-800 mt-2"
            onClick={handleLogout}
          >
            <Lock className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#006b2c]">Farmer Dashboard</h1>
            <p className="text-sm text-gray-600">Your smart farming assistant</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Delhi, India</span>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        <div className="flex-1 p-8">
          {selectedTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-2xl font-bold text-[#006b2c] mb-2">
                  Welcome back, {user?.name}! 🌾
                </h2>
                <p className="text-gray-700">
                  Your farm is looking healthy today. Soil moisture is optimal and weather conditions are perfect for farming.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {farmerStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-xs text-green-600 mt-2">{stat.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Weather Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      4-Day Weather Forecast
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Detailed View
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {weatherForecast.map((day, i) => (
                      <div key={i} className="text-center p-4 border border-gray-200 rounded-lg">
                        <day.icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                        <p className="font-semibold text-gray-900 mb-1">{day.day}</p>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{day.temp}</p>
                        <p className="text-sm text-gray-600 mb-2">{day.condition}</p>
                        <div className="flex items-center justify-center gap-1">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600">{day.rain}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'crops' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Crop Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cropRecommendations.map((crop, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Sprout className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{crop.crop}</p>
                            <p className="text-sm text-gray-600">{crop.season} season</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="mb-2 bg-green-100 text-green-700">
                            {crop.suitability} suitable
                          </Badge>
                          <p className="text-sm text-gray-600">Expected: {crop.expectedYield}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'weather' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Detailed Weather Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Cloud className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Advanced weather analysis coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'analysis' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Soil Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Advanced soil analysis tools coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FarmerDashboardPage() {
  return <FarmerDashboardContent />;
}
