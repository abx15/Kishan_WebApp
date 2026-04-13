'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Download, 
  ArrowUpRight,
  ChevronRight,
  ShoppingCart,
  PieChart,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip as ReTooltip, 
  ResponsiveContainer 
} from 'recharts';

const priceHistory = [
  { name: 'Mon', price: 2100 },
  { name: 'Tue', price: 2150 },
  { name: 'Wed', price: 2280 },
  { name: 'Thu', price: 2200 },
  { name: 'Fri', price: 2350 },
  { name: 'Sat', price: 2450 },
  { name: 'Sun', price: 2420 },
];

const markets = [
  { name: 'Khanna Mandi', distance: '12km', trend: '+₹150', status: 'Active' },
  { name: 'Ludhiana Central', distance: '24km', trend: '+₹120', status: 'Wait Time: 4h' },
  { name: 'Sirhind Market', distance: '45km', trend: '+₹80', status: 'Active' },
];

const commodities = [
  { name: 'Wheat (Ludhiana)', current: '₹2,450', diff: '+2.4%', trend: 'up', vol: '12k Tons' },
  { name: 'Basmati Rice', current: '₹4,800', diff: '-1.2%', trend: 'down', vol: '5k Tons' },
  { name: 'Sugarcane', current: '₹380', diff: '+0.5%', trend: 'up', vol: '45k Tons' },
  { name: 'Cotton (Short)', current: '₹6,200', diff: '+4.8%', trend: 'up', vol: '2k Tons' },
];

export default function MarketPage() {
  const router = useRouter();

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
             <h1 className="text-xl font-bold">Market Intelligence</h1>
          </div>
          <div className="flex items-center gap-4">
             <Button className="h-11 bg-[#006b2c] text-white hover:bg-[#00873a] px-6 rounded-xl font-bold flex gap-2">
               <ShoppingCart className="h-4 w-4" />
               Trade Now
             </Button>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Market Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Price Trend Chart */}
            <Card className="lg:col-span-2 border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-[#006b2c]" />
                    Wheat (Local) Price Trend
                  </h3>
                  <p className="text-sm text-[#6e7b6c] font-medium">Ludhiana Central Mandi - 7 Day Accuracy: 98.4%</p>
                </div>
                <div className="flex gap-2">
                   <Badge className="bg-green-50 text-[#006b2c] border-0 px-4 py-2 rounded-xl font-bold">Bullish Market</Badge>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#bdcaba', fontSize: 12, fontWeight: 700}}
                    />
                    <YAxis 
                      hide
                    />
                    <ReTooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold'}}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#16a34a" 
                      strokeWidth={5} 
                      dot={{ r: 6, fill: '#16a34a', strokeWidth: 0 }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Local Mandis */}
            <div className="space-y-8">
               <Card className="border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-8">
                  <h3 className="text-xl font-bold mb-6">Nearby Mandis</h3>
                  <div className="space-y-6">
                    {markets.map((market, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-green-50/50 p-2 rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 bg-[#fff9eb] rounded-xl flex items-center justify-center font-bold text-[#1e1c12]", i === 0 && "bg-green-100")}>
                            <MapPin className="h-5 w-5 text-[#006b2c]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1e1c12]">{market.name}</p>
                            <p className="text-[10px] font-bold text-[#bdcaba] uppercase">{market.distance} Away</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-[#006b2c]">{market.trend}</p>
                          <p className="text-[10px] font-bold text-[#6e7b6c]">{market.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </Card>

               <div className="relative rounded-[2.5rem] p-8 overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl shadow-orange-900/20 text-white">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <BarChart3 className="h-20 w-20" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Sell Recommendation</h4>
                  <p className="text-sm opacity-90 leading-relaxed font-medium mb-6">
                    "Prices are at a 3-month peak. Selling 60% of current inventory now is recommended 
                    before the expected supply influx next Tuesday."
                  </p>
                  <Button className="w-full h-11 bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-bold">
                     Set Price Alert
                  </Button>
               </div>
            </div>
          </div>

          {/* Commodity Grid */}
          <div>
            <div className="flex justify-between items-end mb-8">
               <div>
                  <h3 className="text-2xl font-bold text-[#1e1c12]">Global Commodities</h3>
                  <p className="text-[#6e7b6c] font-medium">Tracking Bharat vs International prices</p>
               </div>
               <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Filter crops..." className="h-11 pl-10 pr-4 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#006b2c]/10" />
                  </div>
                  <Button variant="outline" className="h-11 border-gray-100 rounded-xl font-bold">
                     <Download className="h-4 w-4 mr-2" />
                     Export Data
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {commodities.map((item, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ scale: 1.02 }}
                   className="bg-white/70 backdrop-blur border border-transparent hover:border-[#006b2c]/20 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all"
                 >
                   <div className="flex justify-between items-start mb-6">
                      <h4 className="font-bold text-[#1e1c12]">{item.name}</h4>
                      <Badge className={cn("border-0 rounded-lg", item.trend === 'up' ? "bg-green-100 text-[#006b2c]" : "bg-red-100 text-red-600")}>
                        {item.diff}
                      </Badge>
                   </div>
                   <div className="flex items-end gap-3 mb-8">
                      <p className="text-3xl font-black text-[#1e1c12]">{item.current}</p>
                      <span className="text-xs font-bold text-[#bdcaba] mb-1">/ Quintal</span>
                   </div>
                   
                   <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                     <div>
                        <p className="text-[10px] font-bold text-[#bdcaba] uppercase mb-1">Mandi Volume</p>
                        <p className="text-sm font-bold text-[#6e7b6c]">{item.vol}</p>
                     </div>
                     <ChevronRight className="h-5 w-5 text-[#bdcaba]" />
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
