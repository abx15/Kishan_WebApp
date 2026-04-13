'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Sprout, 
  MessageCircle, 
  MapPin, 
  Sun, 
  Droplets, 
  Wind, 
  Thermometer, 
  TrendingUp,
  Bell,
  Search,
  ChevronRight,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { motion } from 'framer-motion';

const soilData = [
  { name: 'Jan', moisture: 45, nutrients: 60 },
  { name: 'Feb', moisture: 42, nutrients: 58 },
  { name: 'Mar', moisture: 38, nutrients: 65 },
  { name: 'Apr', moisture: 35, nutrients: 70 },
  { name: 'May', moisture: 30, nutrients: 72 },
  { name: 'Jun', moisture: 55, nutrients: 68 },
];

const cropPrices = [
  { crop: 'Wheat', price: '₹2,450', trend: 'up' },
  { crop: 'Rice', price: '₹2,100', trend: 'up' },
  { crop: 'Cotton', price: '₹6,800', trend: 'down' },
  { crop: 'Corn', price: '₹1,950', trend: 'up' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [userPhone, setUserPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const phone = localStorage.getItem('userPhone');
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    setUserPhone(phone || 'Farmer');
    setTimeout(() => setLoading(false), 800);
  }, [router]);

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

  return (
    <div className="min-h-screen bg-[#fff9eb] flex selection:bg-green-100">
      <DashboardSidebar />
      
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 bg-white/50 backdrop-blur-xl border-b border-[#006b2c]/10 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-6 max-w-xl w-full">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search soil data, tips, or market trends..." 
                className="w-full h-12 bg-white/50 border border-gray-100 rounded-2xl pl-12 pr-4 focus:ring-2 focus:ring-[#006b2c]/20 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-3 bg-white rounded-2xl border border-gray-100 relative group transition-all hover:bg-green-50">
              <Bell className="h-5 w-5 text-[#6e7b6c] group-hover:text-[#006b2c]" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#1e1c12]">Kishan Kumar</p>
                <p className="text-xs text-[#6e7b6c]">Punjab, IN</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 border-2 border-white overflow-hidden shadow-sm hover:scale-105 transition-transform">
                <img src="https://ui-avatars.com/api/?name=Kishan+Kumar&background=006b2c&color=fff" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1e1c12] tracking-tight mb-2">My Lab Overview</h1>
              <p className="text-[#3e4a3d] font-medium text-lg leading-relaxed">
                Welcome back! Your soil health is looking <span className="text-[#006b2c] font-bold">Stable</span> today.
              </p>
            </div>
            <div className="flex gap-4">
              <Button className="h-12 bg-white border border-gray-100 text-[#006b2c] hover:bg-green-50 px-6 rounded-2xl font-bold shadow-sm">
                Download Report
              </Button>
              <Button className="h-12 bg-[#006b2c] text-white hover:bg-[#00873a] px-8 rounded-2xl font-bold shadow-lg shadow-green-900/10">
                New Analysis
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Thermometer, label: 'Temperature', value: '32°C', sub: 'High: 35°C', color: 'bg-orange-500/10 text-orange-600' },
              { icon: Droplets, label: 'Soil Moisture', value: '54%', sub: 'Healthy Range', color: 'bg-blue-500/10 text-blue-600' },
              { icon: Sprout, label: 'Crop Health', value: 'Prime', sub: 'No Pests Detected', color: 'bg-green-500/10 text-green-600' },
              { icon: Sun, label: 'UV Index', value: '6.4', sub: 'Moderate Exposure', color: 'bg-yellow-500/10 text-yellow-600' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#006b2c]/10 overflow-hidden group"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", stat.color)}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <p className="text-sm font-bold text-[#6e7b6c] uppercase tracking-wider mb-2">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-extrabold text-[#1e1c12]">{stat.value}</h3>
                  <p className="text-xs font-bold text-green-600 mb-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-0.5" /> 2%</p>
                </div>
                <p className="text-xs font-medium text-[#bdcaba] mt-2">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts & Market Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Soil Intelligence Chart */}
            <Card className="lg:col-span-2 border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10">
              <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Soil Intelligence</CardTitle>
                  <p className="text-sm text-[#6e7b6c] font-medium mt-1">Real-time nutrient and moisture tracking</p>
                </div>
                <Badge className="bg-green-100 text-[#006b2c] border-0 py-2 px-4 rounded-xl font-bold">Satellite Enabled</Badge>
              </CardHeader>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={soilData}>
                    <defs>
                      <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="nutrientGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#bdcaba', fontSize: 12, fontWeight: 600}} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#bdcaba', fontSize: 12, fontWeight: 600}} 
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="moisture" 
                      stroke="#3b82f6" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#moistureGradient)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="nutrients" 
                      stroke="#16a34a" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#nutrientGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Market Prices & Tips */}
            <div className="space-y-10">
              <Card className="border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Market Prices</h3>
                  <button className="text-[#006b2c] font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="space-y-6">
                  {cropPrices.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#fff9eb] rounded-xl flex items-center justify-center font-bold text-[#1e1c12]">
                          {item.crop[0]}
                        </div>
                        <div>
                          <p className="font-bold text-[#1e1c12]">{item.crop}</p>
                          <p className="text-xs text-[#bdcaba]">Per Quintal</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-[#1e1c12]">{item.price}</p>
                        <p className={cn("text-xs font-bold flex items-center justify-end", item.trend === 'up' ? 'text-green-600' : 'text-red-500')}>
                          {item.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {item.trend === 'up' ? '+1.2%' : '-0.5%'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Lab Tips */}
              <div className="relative rounded-[3rem] p-8 overflow-hidden bg-gradient-to-br from-[#006b2c] to-[#00873a] shadow-2xl shadow-green-900/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full" />
                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Lab Analysis
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                  "Soil nitrogen levels are increasing slightly. Consider delaying the next fertilizer application by 4 days to balance moisture absorption."
                </p>
                <Button className="w-full h-12 bg-white text-[#006b2c] hover:bg-green-50 rounded-2xl font-bold transition-all">
                  Chat with Expert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
