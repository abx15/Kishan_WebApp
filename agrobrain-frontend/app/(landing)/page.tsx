'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Droplets, 
  Sprout, 
  Beaker, 
  MessageCircle, 
  Bell,
  MapPin,
  TestTube,
  Bot,
  Star,
  Leaf
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function LandingPage() {
  const router = useRouter();
  const t = useTranslations();
  const { scrollY } = useScroll();

  const navbarBackground = useTransform(scrollY, [0, 50], ['transparent', 'rgba(255, 255, 255, 0.95)']);
  const navbarShadow = useTransform(scrollY, [0, 50], ['none', '0 1px 3px rgba(0, 0, 0, 0.1)']);

  const features = [
    {
      icon: Cloud,
      title: 'Real-time Weather',
      description: 'Hyperlocal weather + 7-day forecast',
      emoji: '???'
    },
    {
      icon: Sprout,
      title: 'Crop AI',
      description: 'ML-powered crop recommendations',
      emoji: '???'
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation',
      description: 'Save water with AI scheduling',
      emoji: '???'
    },
    {
      icon: Beaker,
      title: 'Soil Analysis',
      description: 'Fertilizer plan from your soil data',
      emoji: '???'
    },
    {
      icon: MessageCircle,
      title: 'AI Chat',
      description: 'Ask anything in Hindi or English',
      emoji: '???'
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Rain, drought, heatwave warnings',
      emoji: '???'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      icon: MapPin,
      title: 'Share Location',
      description: 'Allow GPS or enter your village',
      emoji: '???'
    },
    {
      step: 2,
      icon: TestTube,
      title: 'Enter Soil Data',
      description: 'N, P, K values or use defaults',
      emoji: '???'
    },
    {
      step: 3,
      icon: Bot,
      title: 'Get AI Advice',
      description: 'Instant recommendations in your language',
      emoji: '???'
    }
  ];

  const testimonials = [
    {
      name: 'Ramesh Kumar',
      location: 'Lucknow',
      content: '???? ??? ????? ?? ??????? ?? ??????? ??, ?? AI ????? ??',
      rating: 5,
      initials: 'RK'
    },
    {
      name: 'Priya Devi',
      location: 'Punjab',
      content: '?????? ?? ???????? ?????, ???? ?????? ?????? ??',
      rating: 5,
      initials: 'PD'
    },
    {
      name: 'Suresh Yadav',
      location: 'MP',
      content: '?????? ?? ????? ????? ?? ???? ??? ?????',
      rating: 4,
      initials: 'SY'
    }
  ];

  const stats = [
    '22+ Crops Supported',
    '99.3% Model Accuracy',
    '< 200ms Response Time',
    'Hindi + English'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-white opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
                ??? Made for Indian Farmers
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-display">
                Smart Farming,<br />
                <span className="agro-gradient-text">Powered by AI</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Get crop recommendations, weather alerts, and AI farming advice in Hindi & English
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
                  onClick={() => router.push('/login')}
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50 rounded-lg"
                  onClick={() => router.push('/how-it-works')}
                >
                  See How It Works
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>10,000+ Farmers</span>
                <span>?</span>
                <span>99% Accuracy</span>
                <span>?</span>
                <span>Hindi Support</span>
              </div>
            </motion.div>
            
            {/* Right - Floating dashboard mockup */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Green glow behind card */}
                <div className="absolute inset-0 bg-green-400 rounded-2xl filter blur-2xl opacity-20 scale-110" />
                
                {/* Dashboard mockup card */}
                <Card className="relative bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
                  <div className="space-y-4">
                    {/* Weather card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Current Weather</p>
                          <p className="text-2xl font-bold text-gray-900">28°C</p>
                          <p className="text-sm text-gray-600">??? Clear</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Lucknow</p>
                          <p className="text-xs text-gray-400">2 min ago</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Crop recommendation card */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Top Recommendation</p>
                          <p className="text-lg font-bold text-gray-900">??? Wheat</p>
                          <p className="text-sm text-green-600 font-semibold">94% match</p>
                        </div>
                        <div className="text-2xl">???</div>
                      </div>
                    </div>
                    
                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Soil Moisture</p>
                        <p className="text-lg font-bold text-gray-900">68%</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Rain Chance</p>
                        <p className="text-lg font-bold text-gray-900">15%</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Everything a Farmer Needs
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-green-200 transition-all duration-300 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{feature.emoji}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Simple. Fast. Accurate.
            </h2>
          </motion.div>
          
          <div className="relative">
            {/* Desktop: horizontal steps */}
            <div className="hidden lg:flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-200 -translate-y-1/2 z-0" />
              
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative z-10 flex flex-col items-center text-center max-w-xs"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 -mt-8">
                    <span className="text-xl">{step.emoji}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Mobile: vertical steps */}
            <div className="lg:hidden space-y-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.split(' ')[0]}
                  {stat.includes('+') && <span className="text-2xl">+</span>}
                </div>
                <div className="text-green-100 text-sm">
                  {stat.split(' ').slice(1).join(' ')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Farmers Trust AgroBrain
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-semibold text-green-600">
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 italic">
                    "{testimonial.content}"
                  </blockquote>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 bg-green-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-display">
              Start Farming Smarter Today
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Free to use. No credit card needed.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-green-700 hover:bg-gray-100 rounded-lg font-semibold"
              onClick={() => router.push('/login')}
            >
              Get Started with Phone Number
            </Button>
            <div className="mt-6 text-green-100 text-sm space-x-4">
              <span>Available in Hindi</span>
              <span>?</span>
              <span>Instant Setup</span>
              <span>?</span>
              <span>Works on any phone</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="w-6 h-6 text-green-500" />
                <span className="text-xl font-bold">AgroBrain AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Smart farming for Indian farmers
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Features</li>
                <li>How It Works</li>
                <li>Pricing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 AgroBrain AI · Made with ??? for Indian Farmers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
