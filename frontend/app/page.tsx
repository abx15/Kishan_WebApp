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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">AgroBrain AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button onClick={() => router.push('/login')}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Smart Farming with
            <span className="text-green-600"> AI Power</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get weather predictions, crop recommendations, and farming advice in your language. 
            Designed specifically for Indian farmers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/login')}
              className="text-lg px-8 py-3"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Farm Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From weather forecasts to crop advice, we've got you covered with AI-powered tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <feature.icon className={`h-12 w-12 ${feature.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Weather Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Real-time Weather Data
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get hyperlocal weather predictions specific to your farm location. 
                Plan your irrigation and farming activities with confidence.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Thermometer className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <div className="font-semibold">Temperature</div>
                    <div className="text-sm text-gray-600">Real-time data</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="font-semibold">Humidity</div>
                    <div className="text-sm text-gray-600">Precise readings</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wind className="h-8 w-8 text-gray-500 mr-3" />
                  <div>
                    <div className="font-semibold">Wind Speed</div>
                    <div className="text-sm text-gray-600">Updated hourly</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Sun className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="font-semibold">UV Index</div>
                    <div className="text-sm text-gray-600">Sun protection</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">Sun</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">32°C</div>
                <div className="text-lg text-gray-600 mb-4">Partly Cloudy</div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">Humidity</div>
                    <div>65%</div>
                  </div>
                  <div>
                    <div className="font-semibold">Wind</div>
                    <div>12 km/h</div>
                  </div>
                  <div>
                    <div className="font-semibold">UV</div>
                    <div>7 (High)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers using AI to increase their yield and reduce costs.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => router.push('/login')}
            className="text-lg px-8 py-3"
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Sprout className="h-8 w-8 text-green-400 mr-3" />
                <h3 className="text-xl font-bold">AgroBrain AI</h3>
              </div>
              <p className="text-gray-400">
                Smart farming solution for Indian farmers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Weather Forecast</li>
                <li>Crop Advice</li>
                <li>AI Assistant</li>
                <li>Voice Commands</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgroBrain AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
