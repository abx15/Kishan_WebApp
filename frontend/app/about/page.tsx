'use client';

import { motion } from 'framer-motion';
import { Sprout, Users, Earth, Target, Zap, Heart, ChevronRight, Award, Mail, Globe, Linkedin, Calendar, MapPin, Star, CheckCircle, ArrowRight, Instagram, Twitter, Facebook, Youtube, Phone, Clock, Leaf, Tractor, Cloud, Sun, Wind, Droplets, BarChart3, TrendingUp, Shield, Smartphone, MessageCircle, Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import PublicNavbar from '@/components/layout/PublicNavbar';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stats = [
  { label: 'Fields Monitored', value: '150K+', icon: Earth },
  { label: 'AI Decisions/Day', value: '1.2M', icon: Zap },
  { label: 'States Reached', value: '22+', icon: MapPin },
  { label: 'Yield Increase', value: '25%', icon: TrendingUp },
  { label: 'Farmer Families', value: '50K+', icon: Users },
  { label: 'Languages Supported', value: '10+', icon: Globe },
];

const timeline = [
  {
    year: '2021',
    title: 'The Vision Begins',
    description: 'Identified the digital divide in Indian agriculture and began research in villages across Punjab, Maharashtra, and Karnataka.',
    image: '🌱',
    achievements: ['Research started', 'Village visits', 'Problem identification']
  },
  {
    year: '2022',
    title: 'Living Laboratory',
    description: 'Spent 18 months building AI models in actual fields, not labs. Developed first prototype with 50 test farmers.',
    image: '🧪',
    achievements: ['First prototype', '50 test farmers', 'ML model development']
  },
  {
    year: '2023',
    title: 'Platform Launch',
    description: 'Officially launched AgroBrain AI with full multilingual support and satellite integration. Reached 10,000 farmers.',
    image: '🚀',
    achievements: ['Platform launch', '10K farmers', 'Multilingual support']
  },
  {
    year: '2024',
    title: 'National Expansion',
    description: 'Expanded to 22+ states, introduced advanced pest detection, and partnered with agricultural universities.',
    image: '📈',
    achievements: ['22+ states', 'Pest detection', 'University partnerships']
  },
  {
    year: '2025',
    title: 'AI Innovation',
    description: 'Launched neural agriculture models and voice command features. Won 10+ global innovation awards.',
    image: '🏆',
    achievements: ['Neural agriculture', 'Voice commands', 'Global awards']
  },
  {
    year: '2026',
    title: 'Future Forward',
    description: 'Currently serving 50,000+ families with 95% prediction accuracy. Planning international expansion.',
    image: '🌍',
    achievements: ['50K+ families', '95% accuracy', 'Global expansion']
  }
];

const values = [
  {
    icon: Heart,
    title: 'Farmer First',
    description: 'Every decision starts with "How does this help the farmer?" We design for the smallest holder farmer.',
    color: 'bg-red-500/10 text-red-600'
  },
  {
    icon: Shield,
    title: 'Data Privacy',
    description: 'Farm data is sacred. We use bank-level encryption and never share individual farm information.',
    color: 'bg-blue-500/10 text-blue-600'
  },
  {
    icon: Leaf,
    title: 'Sustainable Growth',
    description: 'Promoting practices that increase yield while protecting the environment for future generations.',
    color: 'bg-green-500/10 text-green-600'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Building networks where farmers learn from each other and grow together through shared knowledge.',
    color: 'bg-purple-500/10 text-purple-600'
  }
];

const technologies = [
  {
    icon: Satellite,
    title: 'Satellite Imaging',
    description: 'Sub-meter resolution multispectral imaging for precise field monitoring',
    features: ['NDVI analysis', 'Thermal imaging', 'Growth stage detection']
  },
  {
    icon: Cloud,
    title: 'Weather Intelligence',
    description: 'Hyperlocal forecasts using satellite data and ML algorithms',
    features: ['7-day forecasts', 'Rainfall prediction', 'Drought alerts']
  },
  {
    icon: BarChart3,
    title: 'Market Analytics',
    description: 'Real-time price tracking and trend analysis for optimal harvest timing',
    features: ['Price prediction', 'Market trends', 'Profit optimization']
  },
  {
    icon: MessageCircle,
    title: 'Multilingual AI',
    description: 'Natural language processing in 10+ Indian languages',
    features: ['Voice commands', 'Regional dialects', 'Real-time translation']
  }
];

const partners = [
  { name: 'ICAR - Indian Council of Agricultural Research', type: 'Research Partner', logo: '🏛️' },
  { name: 'ISRO - Indian Space Research Organisation', type: 'Satellite Data Partner', logo: '🛰️' },
  { name: 'State Agricultural Universities', type: 'Academic Partners', logo: '🎓' },
  { name: 'Ministry of Agriculture', type: 'Government Partner', logo: '🇮🇳' },
  { name: 'Microsoft AI for Earth', type: 'Technology Partner', logo: '💻' },
  { name: 'Google Cloud', type: 'Infrastructure Partner', logo: '☁️' }
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff9eb] via-white to-[#f4edde]/50 text-[#1e1c12] selection:bg-green-100">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-orange-100/30 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-yellow-100/10 blur-[150px] rounded-full" />
      </div>

      <PublicNavbar />

      {/* Enhanced Hero Section */}
      <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeIn} className="text-center">
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-[#006b2c] border-0 py-3 px-6 rounded-full font-bold mb-8 text-sm">
              🌾 Empowering Indian Farmers Since 2021
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
              Bridging the Gap Between<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006b2c] to-[#00873a]">Tech and the Soil.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#3e4a3d] max-w-4xl mx-auto leading-relaxed mb-16">
              AgroBrain AI was born in the heart of Indian fields. We believe that 
              the future of food security lies in empowering the individual farmer 
              with the same data intelligence used by global scientists.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-20">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#006b2c]/10 to-[#00873a]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6 text-[#006b2c]" />
                </div>
                <div className="text-3xl font-extrabold text-[#006b2c] mb-2">{stat.value}</div>
                <div className="text-xs font-bold text-[#6e7b6c] uppercase tracking-wider text-center">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 py-3 px-6 rounded-full font-bold mb-8">
              🚀 Our Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Living Laboratory Story</h2>
            <p className="text-xl text-[#6e7b6c] max-w-3xl mx-auto">
              From village fields to cutting-edge AI - our journey of transforming Indian agriculture
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#006b2c] via-[#00873a] to-[#006b2c] rounded-full" />
            
            <div className="space-y-16">
              {timeline.map((milestone, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-center ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-full md:w-5/12 ${i % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-0 bg-gradient-to-br from-white to-green-50/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-5xl">{milestone.image}</div>
                          <div>
                            <Badge className="bg-[#006b2c] text-white mb-2">{milestone.year}</Badge>
                            <h3 className="text-2xl font-bold text-[#1e1c12]">{milestone.title}</h3>
                          </div>
                        </div>
                        <p className="text-[#6e7b6c] leading-relaxed mb-6">{milestone.description}</p>
                        <div className="space-y-2">
                          {milestone.achievements.map((achievement, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm text-[#006b2c]">
                              <CheckCircle className="h-4 w-4 flex-shrink-0" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#006b2c] border-4 border-white rounded-full shadow-lg z-10" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-gradient-to-br from-[#f4edde]/50 to-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 py-3 px-6 rounded-full font-bold mb-8">
              👨‍💻 Founder
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet the Visionary</h2>
            <p className="text-xl text-[#6e7b6c] max-w-3xl mx-auto">
              The driving force behind AgroBrain AI's mission to empower every Indian farmer
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#006b2c]/10 to-[#00873a]/20 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <div className="w-full h-full flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#006b2c] to-[#00873a] flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                      AK
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-green-100">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#006b2c]" />
                  <span className="text-sm font-bold">Innovation Leader</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-green-100">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-bold">Farmer First</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-[#1e1c12] mb-4">Arun Kumar Bind</h3>
                <p className="text-xl text-[#006b2c] font-bold mb-6">Founder & CEO - AgroBrain AI</p>
              </div>
              
              <div className="space-y-4 text-lg text-[#3e4a3d] leading-relaxed">
                <p>
                  A passionate technologist and agricultural innovator with a vision to democratize 
                  AI for every Indian farmer. With expertise in machine learning and satellite technology, 
                  Arun pioneered the "Living Laboratory" approach.
                </p>
                <p>
                  His journey began in 2021 when he spent 18 months living in villages across India, 
                  understanding the real challenges farmers face and building solutions that work in the field, not just in labs.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-[#1e1c12]">Connect & Explore</h4>
                <div className="grid grid-cols-1 gap-3">
                  <a href="mailto:arun.builds.tech@gmail.com" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-green-100 hover:border-[#006b2c] hover:shadow-lg transition-all group">
                    <Mail className="h-5 w-5 text-[#006b2c] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-[#1e1c12]">Email</div>
                      <div className="text-sm text-[#6e7b6c]">arun.builds.tech@gmail.com</div>
                    </div>
                  </a>
                  
                  <a href="https://arun15dev.netlify.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-green-100 hover:border-[#006b2c] hover:shadow-lg transition-all group">
                    <Globe className="h-5 w-5 text-[#006b2c] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-[#1e1c12]">Portfolio</div>
                      <div className="text-sm text-[#6e7b6c]">arun15dev.netlify.app</div>
                    </div>
                  </a>
                  
                  <a href="https://www.linkedin.com/in/arun-kumar-a3b047353/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-green-100 hover:border-[#006b2c] hover:shadow-lg transition-all group">
                    <Linkedin className="h-5 w-5 text-[#006b2c] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-[#1e1c12]">LinkedIn</div>
                      <div className="text-sm text-[#6e7b6c]">Connect professionally</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0 py-3 px-6 rounded-full font-bold mb-8">
              🌱 Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Guiding Principles</h2>
            <p className="text-xl text-[#6e7b6c] max-w-3xl mx-auto">
              The core values that drive every decision we make at AgroBrain AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${value.color}`}>
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-[#1e1c12] group-hover:text-[#006b2c] transition-colors">{value.title}</h3>
                    <p className="text-sm text-[#6e7b6c] leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-24 bg-gradient-to-br from-[#f4edde]/50 to-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0 py-3 px-6 rounded-full font-bold mb-8">
              🛠️ Technology Stack
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Cutting-Edge Agricultural AI</h2>
            <p className="text-xl text-[#6e7b6c] max-w-3xl mx-auto">
              Advanced technologies powering precision farming for every Indian field
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technologies.map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 bg-white/70 backdrop-blur shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-3xl overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006b2c]/10 to-[#00873a]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <tech.icon className="h-8 w-8 text-[#006b2c]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-[#1e1c12] group-hover:text-[#006b2c] transition-colors">{tech.title}</h3>
                        <p className="text-[#6e7b6c] leading-relaxed mb-4">{tech.description}</p>
                        <div className="space-y-2">
                          {tech.features.map((feature, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm text-[#006b2c]">
                              <CheckCircle className="h-4 w-4 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-0 py-3 px-6 rounded-full font-bold mb-8">
              🤝 Trusted Partners
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Building Ecosystems</h2>
            <p className="text-xl text-[#6e7b6c] max-w-3xl mx-auto">
              Collaborating with leading organizations to strengthen Indian agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border border-gray-100 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 rounded-2xl p-6 group">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{partner.logo}</div>
                    <div>
                      <h3 className="font-bold text-[#1e1c12] group-hover:text-[#006b2c] transition-colors">{partner.name}</h3>
                      <p className="text-sm text-[#6e7b6c]">{partner.type}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-gradient-to-br from-[#f4edde]/50 to-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0 py-3 px-6 rounded-full font-bold mb-8">
              <span className="text-2xl mr-2">Support</span> 24/7 Assistance
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Need Help? We're Here for You!</h2>
            <p className="text-xl text-[#6e7b6c] max-w-3xl mx-auto">
              Our dedicated support team is available round the clock to help you with any questions or technical issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-[#1e1c12] group-hover:text-blue-600 transition-colors">Email Support</h3>
                    <p className="text-[#6e7b6c] leading-relaxed mb-4">
                      Get detailed assistance and technical support via email. We respond within 24 hours.
                    </p>
                    <a 
                      href="mailto:arun.builds.tech@gmail.com" 
                      className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                    >
                      <span>arun.builds.tech@gmail.com</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-green-50/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-[#1e1c12] group-hover:text-green-600 transition-colors">Phone Support</h3>
                    <p className="text-[#6e7b6c] leading-relaxed mb-4">
                      Immediate assistance for urgent issues. Available in 10+ Indian languages.
                    </p>
                    <div className="inline-flex items-center gap-2 text-green-600 font-bold">
                      <span>1800-AGROAI</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] p-12 md:p-20 overflow-hidden bg-gradient-to-br from-[#006b2c] to-[#00873a] shadow-3xl shadow-green-900/30 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10">
              <Badge className="bg-white/20 text-white border-0 py-3 px-6 rounded-full font-bold mb-8 text-sm">
                🌾 Join the Revolution
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Farm?</h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                Join 50,000+ Indian farmers who are already using AgroBrain AI to increase yields, 
                reduce costs, and build sustainable farming practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => router.push('/register')}
                  className="bg-white text-[#006b2c] hover:bg-green-50 px-12 py-7 h-auto text-xl font-bold rounded-2xl shadow-xl transition-all active:scale-95"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/20 px-12 py-7 h-auto text-xl font-bold rounded-2xl transition-all"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
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
              <p className="text-[#bdcaba] max-w-md leading-relaxed mb-8">
                Empowering the backbone of Bharat with advanced satellite intelligence 
                and neural-networks localized for every field.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { name: 'Facebook', icon: Facebook },
                  { name: 'Twitter', icon: Twitter },
                  { name: 'Instagram', icon: Instagram },
                  { name: 'LinkedIn', icon: Linkedin },
                  { name: 'YouTube', icon: Youtube }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#006b2c] transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#00873a]">Quick Links</h4>
              <nav className="flex flex-col gap-4 text-[#bdcaba]">
                <a href="/" className="hover:text-white transition-colors">Home</a>
                <a href="/about" className="hover:text-white transition-colors">About Us</a>
                <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
                <a href="#" className="hover:text-white transition-colors">Careers</a>
              </nav>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#00873a]">Support</h4>
              <nav className="flex flex-col gap-4 text-[#bdcaba]">
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
                <a href="#" className="hover:text-white transition-colors">API Docs</a>
                <a href="#" className="hover:text-white transition-colors">Community</a>
                <a href="#" className="hover:text-white transition-colors">Status</a>
              </nav>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-white/5 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left text-sm text-[#bdcaba]">
                <p>&copy; 2026 AgroBrain AI. Digital Agriculture for Bharat.</p>
                <p className="text-xs mt-2">Made with ❤️ for Indian farmers</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#bdcaba]">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>1800-AGROAI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>arun.builds.tech@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
