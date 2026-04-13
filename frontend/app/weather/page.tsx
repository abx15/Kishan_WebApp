'use client';

import { motion } from 'framer-motion';
import { Cloud, Sun, Droplets, Wind, Thermometer, MapPin, Search, Calendar, ChevronRight, Sprout, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { useRouter } from 'next/navigation';

const forecast = [
  { day: 'Mon', date: 'Oct 14', high: 34, low: 26, condition: 'Sunny', rain: '5%', humidity: '45%' },
  { day: 'Tue', date: 'Oct 15', high: 33, low: 25, condition: 'Partly Cloudy', rain: '15%', humidity: '50%' },
  { day: 'Wed', date: 'Oct 16', high: 30, low: 24, condition: 'Showers', rain: '85%', humidity: '78%' },
  { day: 'Thu', date: 'Oct 17', high: 31, low: 25, condition: 'Cloudy', rain: '40%', humidity: '65%' },
  { day: 'Fri', date: 'Oct 18', high: 33, low: 26, condition: 'Sunny', rain: '5%', humidity: '48%' },
  { day: 'Sat', date: 'Oct 19', high: 34, low: 27, condition: 'Clear', rain: '0%', humidity: '42%' },
  { day: 'Sun', date: 'Oct 20', high: 35, low: 27, condition: 'Clear', rain: '0%', humidity: '40%' },
];

export default function WeatherPage() {
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
             <h1 className="text-xl font-bold">Weather Intelligence</h1>
          </div>
          <div className="flex items-center gap-4">
             <Badge className="bg-blue-100 text-blue-600 border-0 py-1.5 px-4 rounded-lg font-bold">Real-time Satellite</Badge>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Main Hero Card */}
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 to-blue-400 p-12 text-white shadow-3xl shadow-blue-900/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-2xl border border-white/20">
                  <MapPin className="h-5 w-5" />
                  <span className="font-bold">Ludhiana, Punjab, IN</span>
                </div>
                <div className="flex items-center gap-8 mb-8">
                  <h2 className="text-8xl font-black">32°</h2>
                  <div>
                    <p className="text-2xl font-bold opacity-90">Partly Cloudy</p>
                    <p className="font-medium opacity-70">Feels like 36°C</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Humidity</p>
                    <p className="text-xl font-bold">65%</p>
                  </div>
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Wind</p>
                    <p className="text-xl font-bold">12km/h</p>
                  </div>
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">UV Index</p>
                    <p className="text-xl font-bold">6 High</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex justify-center">
                 <Cloud className="w-64 h-64 text-white/20 absolute blur-3xl" />
                 <div className="relative">
                   <Cloud className="w-56 h-56 text-white drop-shadow-2xl animate-bounce duration-[3s]" />
                   <Sun className="w-24 h-24 text-yellow-300 absolute -top-10 -right-10 animate-pulse" />
                 </div>
              </div>
            </div>
          </div>

          {/* Forecast Grid */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#1e1c12]">7-Day Agriculture Forecast</h3>
                <p className="text-[#6e7b6c] font-medium">Precision tracking for irrigation planning</p>
              </div>
              <Button variant="outline" className="rounded-xl border-gray-200 font-bold">
                <Calendar className="mr-2 h-4 w-4" />
                Monthly View
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
               {forecast.map((day, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -5 }}
                   className={cn(
                     "p-6 rounded-[2rem] text-center border transition-all",
                     day.condition === 'Showers' 
                      ? "bg-blue-50 border-blue-100 shadow-lg shadow-blue-100/50" 
                      : "bg-white border-transparent shadow-sm hover:shadow-xl"
                   )}
                 >
                   <p className="font-bold text-[#6e7b6c] mb-1">{day.day}</p>
                   <p className="text-[10px] font-bold text-[#bdcaba] mb-4 uppercase">{day.date}</p>
                   
                   <div className="flex justify-center mb-6">
                     {day.condition === 'Sunny' && <Sun className="h-10 w-10 text-yellow-500" />}
                     {day.condition === 'Partly Cloudy' && <div className="relative"><Cloud className="h-10 w-10 text-gray-400" /><Sun className="h-5 w-5 text-yellow-400 absolute -top-2 -right-2" /></div>}
                     {day.condition === 'Showers' && <Droplets className="h-10 w-10 text-blue-500" />}
                     {day.condition === 'Cloudy' && <Cloud className="h-10 w-10 text-gray-500" />}
                     {day.condition === 'Clear' && <Sun className="h-10 w-10 text-yellow-500" />}
                   </div>

                   <div className="space-y-1 mb-6">
                     <p className="text-xl font-bold text-[#1e1c12]">{day.high}°</p>
                     <p className="text-sm font-bold text-[#bdcaba]">{day.low}°</p>
                   </div>

                   <div className="pt-4 border-t border-gray-100 space-y-2">
                     <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[#bdcaba]">RAIN</span>
                        <span className="text-blue-500">{day.rain}</span>
                     </div>
                     <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[#bdcaba]">HUM</span>
                        <span className="text-[#6e7b6c]">{day.humidity}</span>
                     </div>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* AI Insights & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card className="lg:col-span-2 border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Sprout className="h-6 w-6 text-[#006b2c]" />
                Irrigation Recommendation
              </h3>
              <div className="bg-green-50/50 rounded-3xl p-8 border border-green-100">
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <Droplets className="h-8 w-8 text-[#006b2c]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Delay Irrigation for 48 Hours</h4>
                    <p className="text-[#6e7b6c] leading-relaxed">
                      Heavy rainfall (85% probability) is expected on **Wednesday, Oct 16**. 
                      Current soil moisture is at 54%, which is sufficient until then. 
                      Irrigating now will lead to waterlogging and nutrient runoff.
                    </p>
                    <div className="flex gap-4 mt-6">
                      <Button className="bg-[#006b2c] text-white rounded-xl font-bold">Mark as Seen</Button>
                      <Button variant="ghost" className="text-[#006b2c] font-bold">View Detail Analysis</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-10">
              <Card className="border-0 shadow-3xl shadow-green-900/5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-[3rem] p-8 text-white">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Heat Alert
                </h3>
                <p className="text-white/80 leading-relaxed mb-6 font-medium">
                  Temperature expected to cross 35°C on weekend. Consider applying 
                  mulch to preserve root moisture.
                </p>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white w-[85%] h-full rounded-full" />
                </div>
                <p className="text-[10px] font-bold mt-2 opacity-60">HEAT SEVERITY: HIGH (85%)</p>
              </Card>

              <Card className="border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-8">
                 <h3 className="text-lg font-bold mb-6">Historical Comparison</h3>
                 <div className="space-y-5">
                   {[
                     { label: 'Rainfall vs Last Oct', value: '+12%', color: 'text-green-600' },
                     { label: 'Avg Temp vs Last Oct', value: '-2°C', color: 'text-blue-600' },
                     { label: 'Cloud Cover Change', value: '+18%', color: 'text-orange-600' },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center">
                       <span className="text-sm font-bold text-[#6e7b6c]">{item.label}</span>
                       <span className={cn("font-extrabold flex items-center", item.color)}>
                         <ArrowUpRight className="h-3 w-3 mr-1" />
                         {item.value}
                       </span>
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
