'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MessageCircle, 
  Star, 
  Clock, 
  CheckCircle, 
  Video, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Search,
  Filter,
  Calendar,
  Award,
  BookOpen,
  Users,
  TrendingUp,
  Mic,
  Send,
  Paperclip,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const experts = [
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'Crop Disease Specialist',
    experience: '15 Years',
    rating: 4.9,
    consultations: 2340,
    availability: 'Available Now',
    languages: ['English', 'Hindi', 'Punjabi'],
    price: '500/session',
    image: 'expert1',
    verified: true,
    responseTime: '5 min'
  },
  {
    name: 'Dr. Priya Sharma',
    specialty: 'Soil Health Expert',
    experience: '12 Years',
    rating: 4.8,
    consultations: 1890,
    availability: 'Available in 30 min',
    languages: ['English', 'Hindi'],
    price: '400/session',
    image: 'expert2',
    verified: true,
    responseTime: '15 min'
  },
  {
    name: 'Dr. Amit Verma',
    specialty: 'Irrigation & Water Management',
    experience: '18 Years',
    rating: 4.9,
    consultations: 3100,
    availability: 'Available Tomorrow',
    languages: ['English', 'Hindi', 'Gujarati'],
    price: '600/session',
    image: 'expert3',
    verified: true,
    responseTime: '30 min'
  },
  {
    name: 'Dr. Sunita Reddy',
    specialty: 'Organic Farming Consultant',
    experience: '10 Years',
    rating: 4.7,
    consultations: 1560,
    availability: 'Available Now',
    languages: ['English', 'Telugu', 'Hindi'],
    price: '350/session',
    image: 'expert4',
    verified: true,
    responseTime: '10 min'
  }
];

const categories = [
  { name: 'Crop Diseases', count: 12, icon: 'bug', color: 'red' },
  { name: 'Soil Health', count: 8, icon: 'leaf', color: 'green' },
  { name: 'Irrigation', count: 6, icon: 'droplets', color: 'blue' },
  { name: 'Pest Control', count: 9, icon: 'shield', color: 'orange' },
  { name: 'Organic Farming', count: 7, icon: 'sprout', color: 'emerald' },
  { name: 'Market Analysis', count: 5, icon: 'trending', color: 'purple' }
];

const recentQueries = [
  {
    id: 1,
    farmer: 'Gurpreet Singh',
    topic: 'Wheat yellow rust treatment',
    expert: 'Dr. Rajesh Kumar',
    status: 'Resolved',
    time: '2 hours ago',
    rating: 5
  },
  {
    id: 2,
    farmer: 'Ramesh Kumar',
    topic: 'Soil pH optimization',
    expert: 'Dr. Priya Sharma',
    status: 'In Progress',
    time: '5 hours ago',
    rating: null
  },
  {
    id: 3,
    farmer: 'Lakshmi Devi',
    topic: 'Organic pest control',
    expert: 'Dr. Sunita Reddy',
    status: 'Resolved',
    time: '1 day ago',
    rating: 4
  }
];

export default function ExpertAdvicePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-[#fff9eb] flex selection:bg-green-100">
      <DashboardSidebar />
      
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-20 bg-white/50 backdrop-blur-xl border-b border-[#006b2c]/10 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button onClick={() => router.back()} className="p-2 hover:bg-green-50 rounded-xl transition-colors">
               <ArrowLeft className="h-5 w-5 text-[#006b2c]" />
             </button>
             <h1 className="text-xl font-bold">Expert Advice</h1>
          </div>
          <div className="flex items-center gap-4">
             <Button className="bg-[#006b2c] text-white rounded-xl font-bold flex gap-2">
               <Video className="h-4 w-4" />
               Start Consultation
             </Button>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Hero Section */}
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-purple-600 to-purple-400 p-12 text-white shadow-3xl shadow-purple-900/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-2xl border border-white/20">
                  <Users className="h-5 w-5" />
                  <span className="font-bold">24 Agriculture Experts Online</span>
                </div>
                <h2 className="text-4xl font-black mb-4">Connect with Agriculture Experts</h2>
                <p className="text-xl font-medium opacity-90 mb-8">
                  Get personalized advice from verified agricultural scientists and experienced farmers
                </p>
                <div className="flex gap-4">
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Avg Response</p>
                    <p className="text-xl font-bold">&lt;10 min</p>
                  </div>
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Success Rate</p>
                    <p className="text-xl font-bold">94%</p>
                  </div>
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Consultations</p>
                    <p className="text-xl font-bold">8.9k+</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex justify-center">
                 <MessageCircle className="w-64 h-64 text-white/20 absolute blur-3xl" />
                 <div className="relative">
                   <User className="w-56 h-56 text-white drop-shadow-2xl animate-pulse duration-[3s]" />
                   <Award className="w-24 h-24 text-purple-200 absolute -top-10 -right-10 animate-bounce" />
                 </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#1e1c12">Expert Categories</h3>
                <p className="text-[#6e7b6c] font-medium">Choose specialists by expertise area</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={cn(
                    "p-6 rounded-2xl text-center border cursor-pointer transition-all",
                    selectedCategory === category.name 
                      ? "bg-[#006b2c]/10 border-[#006b2c] shadow-lg" 
                      : "bg-white border-transparent shadow-sm hover:shadow-xl"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center",
                    category.color === 'red' ? "bg-red-100" :
                    category.color === 'green' ? "bg-green-100" :
                    category.color === 'blue' ? "bg-blue-100" :
                    category.color === 'orange' ? "bg-orange-100" :
                    category.color === 'emerald' ? "bg-emerald-100" :
                    "bg-purple-100"
                  )}>
                    <span className="text-2xl">
                      {category.icon === 'bug' && 'bug'}
                      {category.icon === 'leaf' && 'leaf'}
                      {category.icon === 'droplets' && 'droplets'}
                      {category.icon === 'shield' && 'shield'}
                      {category.icon === 'sprout' && 'sprout'}
                      {category.icon === 'trending' && 'trending'}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#1e1c12] mb-1">{category.name}</h4>
                  <p className="text-[10px] font-bold text-[#bdcaba]">{category.count} Experts</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Experts Grid */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#1e1c12]">Available Experts</h3>
                <p className="text-[#6e7b6c] font-medium">Verified agricultural specialists ready to help</p>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Search experts..." className="h-11 pl-10 pr-4 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#006b2c]/10" />
                </div>
                <Button variant="outline" className="h-11 border-gray-100 rounded-xl font-bold">
                   <Filter className="h-4 w-4 mr-2" />
                   Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {experts.map((expert, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white/70 backdrop-blur border border-transparent hover:border-[#006b2c]/20 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#006b2c] to-green-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {expert.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <Badge className={cn(
                      "border-0 rounded-lg text-xs",
                      expert.availability === 'Available Now' ? "bg-green-100 text-green-600" :
                      "bg-yellow-100 text-yellow-600"
                    )}>
                      {expert.availability === 'Available Now' ? 'Online' : 'Busy'}
                    </Badge>
                  </div>
                  
                  <h4 className="font-bold text-[#1e1c12] mb-1">{expert.name}</h4>
                  <p className="text-sm font-bold text-[#6e7b6c] mb-4">{expert.specialty}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-[#1e1c12]">{expert.rating}</span>
                      <span className="text-[10px] text-[#bdcaba]">({expert.consultations} sessions)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#6e7b6c]" />
                      <span className="text-[10px] font-bold text-[#6e7b6c]">{expert.responseTime} response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#6e7b6c]" />
                      <span className="text-[10px] font-bold text-[#6e7b6c]">{expert.experience}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-6">
                    {expert.languages.slice(0, 2).map((lang, j) => (
                      <span key={j} className="text-[10px] font-bold text-[#bdcaba] bg-gray-100 px-2 py-1 rounded-lg">
                        {lang}
                      </span>
                    ))}
                    {expert.languages.length > 2 && (
                      <span className="text-[10px] font-bold text-[#bdcaba] bg-gray-100 px-2 py-1 rounded-lg">
                        +{expert.languages.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-black text-[#006b2c]">{expert.price}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-[#006b2c]/20 text-[#006b2c] hover:bg-[#006b2c]/10 rounded-lg">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                      <Button size="sm" className="bg-[#006b2c] text-white hover:bg-[#00873a] rounded-lg">
                        <Video className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Queries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card className="lg:col-span-2 border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-[#006b2c]" />
                Recent Consultations
              </h3>
              <div className="space-y-6">
                {recentQueries.map((query, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-[#fff9eb] rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#006b2c]/10 rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-[#006b2c]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1e1c12] mb-1">{query.farmer}</h4>
                        <p className="text-sm font-bold text-[#6e7b6c]">{query.topic}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-bold text-[#bdcaba]">with {query.expert}</span>
                          <span className="text-[10px] font-bold text-[#bdcaba]">{query.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={cn(
                        "border-0 rounded-lg mb-2",
                        query.status === 'Resolved' ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                      )}>
                        {query.status}
                      </Badge>
                      {query.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold">{query.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-10">
              <Card className="border-0 shadow-3xl shadow-green-900/5 bg-gradient-to-br from-green-400 to-green-600 rounded-[3rem] p-8 text-white">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Quick Consultation
                </h3>
                <p className="text-white/80 leading-relaxed font-medium mb-6">
                  Describe your issue and get matched with the best expert instantly
                </p>
                <div className="space-y-4">
                  <textarea 
                    placeholder="Type your agricultural concern..."
                    className="w-full h-24 p-4 bg-white/20 backdrop-blur rounded-xl border border-white/20 placeholder-white/60 text-white outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-lg">
                      <Image className="h-3 w-3 mr-1" />
                      Photo
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-lg">
                      <Paperclip className="h-3 w-3 mr-1" />
                      File
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-lg">
                      <Mic className="h-3 w-3 mr-1" />
                      Voice
                    </Button>
                  </div>
                  <Button className="w-full h-11 bg-white text-green-600 hover:bg-green-50 rounded-xl font-bold">
                    <Send className="h-4 w-4 mr-2" />
                    Get Expert Help
                  </Button>
                </div>
              </Card>

              <Card className="border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-8">
                <h3 className="text-lg font-bold mb-6">Consultation Stats</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Today\'s Sessions', value: '47', change: '+12%' },
                    { label: 'Avg. Duration', value: '18 min', change: '+5%' },
                    { label: 'Satisfaction Rate', value: '96%', change: '+2%' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#6e7b6c]">{stat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1e1c12]">{stat.value}</span>
                        <span className="text-xs font-bold text-green-600">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
