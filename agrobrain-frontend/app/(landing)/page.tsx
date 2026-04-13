'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Sprout, 
  MessageCircle, 
  Mic,
  MapPin,
  Smartphone,
  Users,
  Shield,
  TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const t = useTranslations();

  const features = [
    {
      icon: Cloud,
      title: 'Real-time Weather',
      description: 'Get accurate weather forecasts and alerts for your location',
      color: 'text-blue-600'
    },
    {
      icon: Sprout,
      title: 'Smart Crop Recommendations',
      description: 'AI-powered suggestions based on soil analysis and weather patterns',
      color: 'text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Agricultural Chat Assistant',
      description: 'Get expert advice on farming, pests, and crop management',
      color: 'text-purple-600'
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Control the app with voice commands in your preferred language',
      color: 'text-orange-600'
    },
    {
      icon: MapPin,
      title: 'Location-based Services',
      description: 'Personalized recommendations based on your farm location',
      color: 'text-red-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access all features on any device, anywhere',
      color: 'text-indigo-600'
    }
  ];

  const stats = [
    { label: 'Farmers Helped', value: '10,000+', icon: Users },
    { label: 'Crop Recommendations', value: '50,000+', icon: Sprout },
    { label: 'Weather Alerts', value: '100,000+', icon: Cloud },
    { label: 'Accuracy Rate', value: '95%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
              AI-Powered Agricultural Assistant
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="agro-gradient-text">AgroBrain</span>
              <br />
              Smart Farming Solutions
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your farming with AI-powered weather forecasts, 
              crop recommendations, and expert agricultural guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="agro-gradient hover:opacity-90"
                onClick={() => router.push('/login')}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/dashboard')}
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and insights 
              you need to optimize your agricultural practices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 agro-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AgroBrain 
            to increase their yield and optimize their farming practices.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => router.push('/login')}
            className="bg-white text-green-700 hover:bg-gray-100"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 agro-gradient-text">AgroBrain</h3>
              <p className="text-gray-400">
                Smart farming solutions for modern agriculture.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Testimonials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgroBrain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
