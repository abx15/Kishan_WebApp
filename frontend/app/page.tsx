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
  Play,
  Users,
  MapPin,
  Award,
  BookOpen,
  Zap,
  Leaf,
  Sun,
  Wind,
  Heart,
  CheckCircle,
  Star,
  ArrowRight,
  Globe,
  BarChart3,
  Clock,
  Target,
  Lightbulb,
  Crop,
  Tractor,
  Satellite,
  Database,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNavbar from '@/components/layout/PublicNavbar';

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

  const detailedFeatures = [
    {
      icon: Satellite,
      title: 'Satellite Monitoring',
      description: 'Real-time crop health monitoring using NDVI and thermal imaging from space.',
      benefits: ['Early disease detection', 'Growth stage tracking', 'Yield prediction'],
      color: 'bg-indigo-500/10 text-indigo-600'
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation',
      description: 'AI-powered water management based on soil moisture and weather patterns.',
      benefits: ['30% water savings', 'Optimal irrigation timing', 'Drought prevention'],
      color: 'bg-cyan-500/10 text-cyan-600'
    },
    {
      icon: Shield,
      title: 'Pest & Disease Alert',
      description: 'Early warning system for pest outbreaks and disease spread in your region.',
      benefits: ['Preventive recommendations', 'Organic treatment options', 'Chemical usage optimization'],
      color: 'bg-red-500/10 text-red-600'
    },
    {
      icon: BarChart3,
      title: 'Farm Analytics',
      description: 'Comprehensive dashboard with insights on farm performance and profitability.',
      benefits: ['Cost analysis', 'Profit tracking', 'Resource optimization'],
      color: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      icon: Users,
      title: 'Community Connect',
      description: 'Connect with farmers in your region and share best practices.',
      benefits: ['Local knowledge sharing', 'Bulk purchasing discounts', 'Cooperative farming'],
      color: 'bg-pink-500/10 text-pink-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Complete functionality optimized for smartphones and basic connectivity.',
      benefits: ['Offline mode support', 'Low data usage', 'Voice commands in regional languages'],
      color: 'bg-violet-500/10 text-violet-600'
    }
  ];

  const testimonials = [
    {
      name: 'Ramesh Kumar',
      location: 'Punjab',
      crop: 'Wheat & Rice',
      content: 'AgroBrain AI helped me increase my wheat yield by 23% while reducing water usage. The weather predictions are incredibly accurate for my specific location.',
      rating: 5,
      avatar: '👨‍🌾'
    },
    {
      name: 'Sunita Devi',
      location: 'Bihar',
      crop: 'Maize & Pulses',
      content: 'The multilingual support is amazing! I get all my farming advice in Hindi. The market predictor helped me time my harvest perfectly.',
      rating: 5,
      avatar: '👩‍🌾'
    },
    {
      name: 'Mohan Reddy',
      location: 'Andhra Pradesh',
      crop: 'Cotton & Chilli',
      content: 'Pest alerts saved my entire cotton crop this season. The AI suggested organic solutions that worked better than chemicals.',
      rating: 5,
      avatar: '👨‍🌾'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Register Your Farm',
      description: 'Sign up in 2 minutes and mark your farm boundaries on the map.',
      icon: MapPin,
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      step: 2,
      title: 'Connect Your Data',
      description: 'Input your crop details, soil type, and farming preferences.',
      icon: Database,
      color: 'bg-green-500/10 text-green-600'
    },
    {
      step: 3,
      title: 'Get AI Insights',
      description: 'Receive personalized recommendations and real-time alerts.',
      icon: Lightbulb,
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      step: 4,
      title: 'Optimize & Grow',
      description: 'Implement suggestions and track your farm\'s performance.',
      icon: TrendingUp,
      color: 'bg-orange-500/10 text-orange-600'
    }
  ];

  const faqs = [
    {
      question: 'How accurate are the weather predictions?',
      answer: 'Our AI combines satellite data, local weather stations, and machine learning to achieve 95% accuracy for 7-day forecasts in your specific farm location.'
    },
    {
      question: 'Is my farm data secure and private?',
      answer: 'Yes, we use bank-level encryption and never share your individual farm data. All insights are anonymized and aggregated for research purposes only.'
    },
    {
      question: 'What languages are supported?',
      answer: 'Currently we support Hindi, English, Punjabi, Gujarati, Marathi, Tamil, Telugu, Malayalam, Bengali, and Kannada with more coming soon.'
    },
    {
      question: 'Do I need expensive equipment?',
      answer: 'No! AgroBrain AI works with just a basic smartphone. We use satellite imagery and weather data, so no special sensors are required.'
    },
    {
      question: 'How much does it cost?',
      answer: 'Basic features are free for all farmers. Premium features like detailed analytics and expert consultations start at just ₹299/month.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fff9eb] text-[#1e1c12] selection:bg-green-100">
      {/* Enhanced Background with Agricultural Images */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Gradient Overlays */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-orange-100/30 blur-[100px] rounded-full" />
        
        {/* Agricultural Background Images */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-green-600/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-20 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-600/15 to-transparent rounded-full blur-3xl" />
        </div>
        
        {/* Floating Agricultural Elements */}
        <div className="absolute top-20 right-10 opacity-10">
          <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center">
            <Sprout className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <div className="absolute bottom-40 left-20 opacity-10">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Cloud className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <div className="absolute top-1/2 right-1/3 opacity-10">
          <div className="w-28 h-28 bg-orange-500/20 rounded-full flex items-center justify-center">
            <Sun className="w-14 h-14 text-orange-600" />
          </div>
        </div>
      </div>

      <PublicNavbar />

      {/* Enhanced Hero Section with Background Images */}
      <main>
        <section className="relative pt-20 pb-32 px-6 lg:px-8 overflow-hidden">
          {/* Hero Background Images */}
          <div className="absolute inset-0 opacity-8">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-50/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-t from-orange-50/50 to-transparent" />
            
            {/* Agricultural Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iIzAwNmIyYyIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPgo=')] opacity-20" />
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div 
              {...fadeIn}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-100/80 to-emerald-100/80 border border-green-200/50 text-[#006b2c] text-sm font-semibold mb-8 backdrop-blur-sm"
            >
              <Badge variant="outline" className="border-[#006b2c]/20 bg-white mr-2">New</Badge>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Empowering 50,000+ Indian Farmers
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#006b2c]/20 to-[#00873a]/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-[#006b2c]" />
                </div>
              </div>
              The Science of Soil,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006b2c] to-[#00873a]">The Power of AI.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl text-[#3e4a3d] max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Satellite className="w-5 h-5 text-[#006b2c]" />
                  <span>Satellite Data</span>
                </div>
                <span className="text-[#006b2c]">•</span>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <span>Soil Intelligence</span>
                </div>
                <span className="text-[#006b2c]">•</span>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <span>Expert Advice</span>
                </div>
              </div>
              Transform your farming with advanced AI technology and real-time insights. 
              Localized for every Indian farmer's unique needs.
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
                className="h-16 px-10 text-lg bg-gradient-to-br from-[#006b2c] to-[#00873a] hover:opacity-90 text-white rounded-2xl shadow-2xl shadow-green-900/20 group transition-all hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Tractor className="w-5 h-5" />
                  Launch Dashboard
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg border-2 border-[#006b2c]/20 hover:bg-green-50 rounded-2xl group text-[#006b2c] transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full group-hover:scale-110 transition-transform">
                    <Play className="h-4 w-4 fill-[#006b2c]" />
                  </div>
                  <span>Watch Demo</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Features Section with Background Images */}
        <section id="features" className="py-24 bg-gradient-to-br from-[#f4edde]/50 via-white to-green-50/30 px-6 lg:px-8 relative overflow-hidden">
          {/* Features Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-green-600/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-green-200/50 text-[#006b2c] text-sm font-semibold mb-6 backdrop-blur-sm"
              >
                <Zap className="w-4 h-4" />
                Advanced Features
              </motion.div>
              <h2 className="text-4xl font-bold mb-4">Precision Tools for Modern Farming</h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#006b2c] to-[#00873a] mx-auto rounded-full" />
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
                  <Card className="h-full border-0 bg-gradient-to-br from-white/70 to-green-50/30 backdrop-blur shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden group">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color} shadow-lg`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#006b2c] transition-colors">{feature.title}</h3>
                      <p className="text-sm text-[#3e4a3d] leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-green-100/50">
                        <div className="flex items-center gap-2 text-xs text-[#006b2c] font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>AI Powered</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Stats Section with Background */}
        <section className="py-20 bg-gradient-to-br from-white via-green-50/20 to-white relative overflow-hidden">
          {/* Stats Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA2YjJjIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDZiMmMiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4K')]" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-[#006b2c] text-sm font-bold mb-6">
                <Award className="w-4 h-4" />
                Trusted by Indian Farmers
              </div>
              <h2 className="text-4xl font-bold mb-4">Real Impact Across India</h2>
              <p className="text-lg text-[#6e7b6c] max-w-2xl mx-auto">Transforming agriculture with AI-powered solutions</p>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {[
                { label: 'Registered Farmers', value: '50,000+', icon: Users },
                { label: 'Prediction Accuracy', value: '95%', icon: Target },
                { label: 'Indian Languages', value: '10+', icon: Globe },
                { label: 'Response Time', value: '< 2s', icon: Clock }
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-[#006b2c]" />
                  </div>
                  <div className="text-4xl font-extrabold text-[#006b2c] mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-[#6e7b6c] uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced How It Works Section */}
        <section className="py-24 bg-gradient-to-br from-[#f4edde]/50 via-white to-blue-50/20 px-6 lg:px-8 relative overflow-hidden">
          {/* How It Works Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-green-600/20 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-bold mb-6">
                <Target className="w-4 h-4" />
                How It Works
              </div>
              <h2 className="text-4xl font-bold mb-4">Get Started in 4 Simple Steps</h2>
              <p className="text-lg text-[#6e7b6c] max-w-2xl mx-auto">Transform your farming experience with AI-powered insights</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#006b2c] text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                      {step.step}
                    </div>
                    {i < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-[#006b2c] to-transparent" />
                    )}
                  </div>
                  <Card className="mt-8 border-0 bg-white/70 backdrop-blur shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl">
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                        <step.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-[#6e7b6c] leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Detailed Features Section */}
        <section className="py-24 bg-gradient-to-br from-white via-green-50/30 to-white px-6 lg:px-8 relative overflow-hidden">
          {/* Detailed Features Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMyIgZmlsbD0iIzAwNmIyYyIgZmlsbC1vcGFjaXR5PSIwLjA4Ii8+Cjwvc3ZnPgo=')]" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-bold mb-6">
                <BarChart3 className="w-4 h-4" />
                Advanced Features
              </div>
              <h2 className="text-4xl font-bold mb-4">Complete Farm Management Solution</h2>
              <p className="text-lg text-[#6e7b6c] max-w-2xl mx-auto">Everything you need to optimize your farming operation in one platform</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {detailedFeatures.map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full border-0 bg-gradient-to-br from-white to-green-50/30 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden group">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#006b2c] transition-colors">{feature.title}</h3>
                      <p className="text-sm text-[#6e7b6c] leading-relaxed mb-4">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm text-[#006b2c]">
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-[#f4edde]/50 via-orange-50/30 to-white px-6 lg:px-8 relative overflow-hidden">
          {/* Testimonials Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-orange-600/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-yellow-600/20 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 text-sm font-bold mb-6">
                <Heart className="w-4 h-4" />
                Success Stories
              </div>
              <h2 className="text-4xl font-bold mb-4">Real Farmers, Real Results</h2>
              <p className="text-lg text-[#6e7b6c] max-w-2xl mx-auto">Hear from farmers who have transformed their agriculture with AgroBrain AI</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full border-0 bg-white/80 backdrop-blur shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        <div className="text-4xl mr-4">{testimonial.avatar}</div>
                        <div>
                          <h4 className="font-bold text-lg">{testimonial.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-[#6e7b6c]">
                            <MapPin className="h-3 w-3" />
                            <span>{testimonial.location}</span>
                          </div>
                          <div className="text-xs text-[#006b2c] font-medium">{testimonial.crop}</div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-[#3e4a3d] leading-relaxed italic">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="py-24 bg-gradient-to-br from-white via-blue-50/20 to-white px-6 lg:px-8 relative overflow-hidden">
          {/* FAQ Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-sm font-bold mb-6">
                <MessageCircle className="w-4 h-4" />
                FAQs
              </div>
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-[#6e7b6c]">Everything you need to know about AgroBrain AI</p>
            </motion.div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="border-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 hover:from-green-50/70 hover:to-emerald-50/70 transition-all duration-300 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#006b2c] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-[#006b2c]">{faq.question}</h3>
                          <p className="text-sm text-[#6e7b6c] leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Success Metrics Section */}
        <section className="py-20 bg-gradient-to-br from-[#006b2c] via-[#00873a] to-[#006b2c] text-white px-6 lg:px-8 relative overflow-hidden">
          {/* Success Metrics Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDEwTDQwIDIwTDQwIDQwTDMwIDUwTDEwIDQwTDEwIDIwTDMwIDEwWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPgo=')]" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-bold mb-6 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4" />
                Proven Results
              </div>
              <h2 className="text-4xl font-bold mb-4">Real Impact, Real Results</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">Measurable improvements in farming outcomes across India</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Yield Increase', 
                  value: '23%', 
                  description: 'Average crop yield improvement for registered farmers',
                  icon: TrendingUp 
                },
                { 
                  title: 'Water Savings', 
                  value: '30%', 
                  description: 'Reduction in water usage through smart irrigation',
                  icon: Droplets 
                },
                { 
                  title: 'Cost Reduction', 
                  value: '18%', 
                  description: 'Lower farming costs with optimized resource usage',
                  icon: BarChart3 
                }
              ].map((metric, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <Card className="h-full border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-3xl">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
                        <metric.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-green-100">
                        {metric.value}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">{metric.title}</h3>
                      <p className="text-sm text-white/70 leading-relaxed">{metric.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Banner */}
        <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
          {/* CTA Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white to-blue-50/50" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-green-600/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
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

      {/* Enhanced Footer */}
      <footer className="bg-[#1e1c12] text-white pt-20 pb-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#006b2c] rounded-lg">
                  <Sprout className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight">AgroBrain AI</span>
              </div>
              <p className="text-[#bdcaba] max-w-md leading-relaxed mb-8">
                Empowering the backbone of Bharat with advanced satellite intelligence 
                and neural-networks localized for every field.
              </p>
              
              {/* Newsletter Signup */}
              <div className="mb-8">
                <h4 className="font-bold text-lg mb-4 text-white">Stay Updated</h4>
                <p className="text-sm text-[#bdcaba] mb-4">Get farming tips and platform updates</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00873a] transition-colors"
                  />
                  <Button className="bg-[#006b2c] hover:bg-[#00873a] text-white px-4 py-2 rounded-lg transition-colors">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { name: 'Facebook', icon: 'f' },
                  { name: 'Twitter', icon: 't' },
                  { name: 'Instagram', icon: 'i' },
                  { name: 'WhatsApp', icon: 'w' }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#006b2c] transition-colors"
                    aria-label={social.name}
                  >
                    <span className="text-sm font-bold">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#00873a]">Products</h4>
              <nav className="flex flex-col gap-4 text-[#bdcaba]">
                <a href="#" className="hover:text-white transition-colors">Weather Predictions</a>
                <a href="#" className="hover:text-white transition-colors">Crop Intelligence</a>
                <a href="#" className="hover:text-white transition-colors">Market Prices</a>
                <a href="#" className="hover:text-white transition-colors">Soil Analysis</a>
                <a href="#" className="hover:text-white transition-colors">Pest Alerts</a>
                <a href="#" className="hover:text-white transition-colors">Irrigation Planning</a>
              </nav>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#00873a]">Resources</h4>
              <nav className="flex flex-col gap-4 text-[#bdcaba]">
                <a href="#" className="hover:text-white transition-colors">Farm Blog</a>
                <a href="#" className="hover:text-white transition-colors">Video Tutorials</a>
                <a href="#" className="hover:text-white transition-colors">Success Stories</a>
                <a href="#" className="hover:text-white transition-colors">Research Papers</a>
                <a href="#" className="hover:text-white transition-colors">API Documentation</a>
                <a href="#" className="hover:text-white transition-colors">Mobile Apps</a>
              </nav>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#00873a]">Company</h4>
              <nav className="flex flex-col gap-4 text-[#bdcaba]">
                <a href="/about" className="hover:text-white transition-colors">Our Story</a>
                <a href="#" className="hover:text-white transition-colors">Mission & Values</a>
                <a href="/contact" className="hover:text-white transition-colors">Contact Support</a>
                <a href="#" className="hover:text-white transition-colors">Careers</a>
                <a href="#" className="hover:text-white transition-colors">Press Kit</a>
                <a href="#" className="hover:text-white transition-colors">Partners</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              </nav>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-white/5 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left text-sm text-[#bdcaba]">
                <p>&copy; 2026 AgroBrain AI. Digital Agriculture for Bharat.</p>
                <p className="text-xs mt-2">Made with <Heart className="inline h-3 w-3 text-red-400 fill-red-400" /> for Indian farmers</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#bdcaba]">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Get App</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>arun.builds.tech@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
