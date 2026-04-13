'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Droplets, 
  Sprout, 
  MessageCircle, 
  MapPin,
  Sun,
  Wind,
  Thermometer,
  TrendingUp,
  Users,
  Shield,
  Smartphone
} from 'lucide-react';
import LanguageToggle from '@/components/shared/LanguageToggle';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Cloud,
      title: 'Weather Forecast',
      description: 'Accurate 7-day weather predictions for your farm location',
      color: 'text-blue-600'
    },
    {
      icon: Sprout,
      title: 'Crop Recommendations',
      description: 'AI-powered suggestions based on your soil and climate',
      color: 'text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description: 'Chat with agricultural expert in Hindi and English',
      color: 'text-purple-600'
    },
    {
      icon: Smartphone,
      title: 'Voice Commands',
      description: 'Use voice to get farming advice hands-free',
      color: 'text-orange-600'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Farmers Using' },
    { number: '95%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'AI Support' },
    { number: '10+', label: 'Indian Languages' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AgroBrain AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button 
                onClick={() => router.push('/login')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 mb-6">
              AI-Powered Farming Solution
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Farming with
              <span className="block text-green-600 agro-gradient-text">AI Power</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get weather predictions, crop recommendations, and farming advice in your language. 
              Designed specifically for Indian farmers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/login')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/login')}
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg text-lg font-medium transition-all"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything Your Farm Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From weather forecasts to crop advice, we've got you covered with AI-powered tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Weather Preview Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1 mb-4">Weather Intelligence</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Real-time Weather Data
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Get hyperlocal weather predictions specific to your farm location. 
                Plan your irrigation and farming activities with confidence.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-red-50 rounded-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <Thermometer className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Temperature</div>
                    <div className="text-sm text-gray-600">Real-time data</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Droplets className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Humidity</div>
                    <div className="text-sm text-gray-600">Precise readings</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <Wind className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Wind Speed</div>
                    <div className="text-sm text-gray-600">Updated hourly</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <Sun className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">UV Index</div>
                    <div className="text-sm text-gray-600">Sun protection</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-green-400 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-center text-white">
                <div className="text-8xl mb-6">Sun</div>
                <div className="text-5xl font-bold mb-2">32°C</div>
                <div className="text-xl mb-6 opacity-90">Partly Cloudy</div>
                <div className="grid grid-cols-3 gap-4 text-sm bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-center">
                    <div className="font-bold">Humidity</div>
                    <div className="text-lg">65%</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">Wind</div>
                    <div className="text-lg">12 km/h</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">UV</div>
                    <div className="text-lg">7 (High)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-white/20 text-white px-4 py-2 mb-4">Get Started Today</Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join thousands of farmers using AI to increase their yield and reduce costs.
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">AgroBrain AI</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Smart farming solution for Indian farmers.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-green-400">Features</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Weather Forecast</li>
                <li className="hover:text-white transition-colors cursor-pointer">Crop Advice</li>
                <li className="hover:text-white transition-colors cursor-pointer">AI Assistant</li>
                <li className="hover:text-white transition-colors cursor-pointer">Voice Commands</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-green-400">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">FAQs</li>
                <li className="hover:text-white transition-colors cursor-pointer">Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-green-400">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 AgroBrain AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
