'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Cloud, 
  Droplets, 
  Sprout, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Smartphone,
  ChevronRight,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageToggle from '@/components/shared/LanguageToggle';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Cloud,
      title: 'Hyperlocal Weather',
      description: 'Satellite-driven precision forecasts for your specific farm coordinates.',
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: Sprout,
      title: 'Crop Intelligence',
      description: 'AI-powered soil analysis and customized variety recommendations.',
      color: 'bg-green-500/10 text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Multilingual Expert AI',
      description: 'Get instant advice in Hindi, English, and 8+ regional languages.',
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Market Predictor',
      description: 'Maximize profit with real-time crop price trends and future estimates.',
      color: 'bg-orange-500/10 text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fff9eb] text-[#1e1c12] selection:bg-green-100">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-orange-100/30 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-[#006b2c]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#006b2c] to-[#00873a] rounded-xl shadow-lg shadow-green-900/20">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#1e1c12]">AgroBrain <span className="text-[#006b2c]">AI</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#features" className="hover:text-[#006b2c] transition-colors">Features</a>
              <a href="/about" className="hover:text-[#006b2c] transition-colors">About Us</a>
              <a href="/contact" className="hover:text-[#006b2c] transition-colors">Support</a>
            </div>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button 
                variant="ghost" 
                onClick={() => router.push('/login')}
                className="hidden sm:inline-flex text-[#1e1c12] hover:bg-green-50"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/register')}
                className="bg-gradient-to-br from-[#006b2c] to-[#00873a] hover:opacity-90 text-white px-6 rounded-xl shadow-lg shadow-green-900/10 transition-all active:scale-95"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-20 pb-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div 
              {...fadeIn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/50 border border-green-200/50 text-[#006b2c] text-sm font-semibold mb-8"
            >
              <Badge variant="outline" className="border-[#006b2c]/20 bg-white mr-1">New</Badge>
              Empowering 50,000+ Indian Farmers
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
            >
              The Science of Soil,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006b2c] to-[#00873a]">The Power of AI.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl text-[#3e4a3d] max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Transform your farming with satellite data, soil intelligence, and 
              real-time expert advice. Localized for every Indian farmer.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <Button 
                size="lg"
                onClick={() => router.push('/register')}
                className="h-16 px-10 text-lg bg-[#006b2c] hover:bg-[#00873a] text-white rounded-2xl shadow-2xl shadow-green-900/20 group"
              >
                Launch Dashboard
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg border-2 border-[#006b2c]/20 hover:bg-green-50 rounded-2xl group text-[#006b2c]"
              >
                <div className="p-2 bg-green-100 rounded-full mr-3 group-hover:scale-110 transition-transform">
                  <Play className="h-4 w-4 fill-[#006b2c]" />
                </div>
                Watch Video
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-[#f4edde]/50 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Precision Tools for Modern Farming</h2>
              <div className="w-20 h-1.5 bg-[#006b2c] mx-auto rounded-full" />
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Card className="h-full border-0 bg-white/50 backdrop-blur shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden group">
                    <CardContent className="p-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                        <feature.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#006b2c] transition-colors">{feature.title}</h3>
                      <p className="text-sm text-[#3e4a3d] leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Social Proof Stats */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Registered Farmers', value: '50,000+' },
                { label: 'Prediction Accuracy', value: '95%' },
                { label: 'Indian Languages', value: '10+' },
                { label: 'Response Time', value: '< 2s' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-extrabold text-[#006b2c] mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-[#6e7b6c] uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-[3rem] p-12 md:p-20 overflow-hidden bg-gradient-to-br from-[#006b2c] to-[#00873a] shadow-3xl shadow-green-900/30 text-center">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start Your Digital Farm Today</h2>
                <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
                  Join thousands of farmers across India who are optimizing their yield and reducing costs with AgroBrain.
                </p>
                <Button 
                  size="lg"
                  onClick={() => router.push('/register')}
                  className="bg-white text-[#006b2c] hover:bg-green-50 px-12 py-7 h-auto text-xl font-bold rounded-2xl shadow-xl transition-all active:scale-95"
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e1c12] text-white pt-20 pb-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#006b2c] rounded-lg">
                  <Sprout className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight">AgroBrain AI</span>
              </div>
              <p className="text-[#bdcaba] max-w-md leading-relaxed">
                Empowering the backbone of Bharat with advanced satellite intelligence 
                and neural-networks localized for every field.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#00873a]">Resources</h4>
              <nav className="flex flex-col gap-4 text-[#bdcaba]">
                <a href="#" className="hover:text-white transition-colors">Weather Predictions</a>
                <a href="#" className="hover:text-white transition-colors">Crop Intelligence</a>
                <a href="#" className="hover:text-white transition-colors">Market Prices</a>
                <a href="#" className="hover:text-white transition-colors">Expert Advice</a>
              </nav>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#00873a]">Company</h4>
              <nav className="flex flex-col gap-4 text-[#bdcaba]">
                <a href="/about" className="hover:text-white transition-colors">Our Story</a>
                <a href="/contact" className="hover:text-white transition-colors">Contact Support</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              </nav>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-10 text-center text-sm text-gray-500">
            <p>&copy; 2026 AgroBrain AI. Digital Agriculture for Bharat.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
