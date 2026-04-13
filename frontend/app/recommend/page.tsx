'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  MapPin, 
  Droplets, 
  Thermometer, 
  ChevronRight, 
  ArrowLeft, 
  Search, 
  ArrowUpRight, 
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const cropOptions = [
  { 
    name: 'Wheat (HD 2967)', 
    match: '98%', 
    type: 'Cereal', 
    duration: '140 Days', 
    yield: '2.5t/acre',
    desc: 'Perfectly suited for current soil nitrogen levels and projected winter temperatures.',
    status: 'Optimal',
    color: 'bg-green-100 text-green-700'
  },
  { 
    name: 'Mustard (Pusa 25)', 
    match: '85%', 
    type: 'Oilseed', 
    duration: '110 Days', 
    yield: '0.8t/acre',
    desc: 'Good secondary option if water availability is limited in late December.',
    status: 'Good',
    color: 'bg-yellow-100 text-yellow-700'
  },
  { 
    name: 'Chickpea (HC 5)', 
    match: '72%', 
    type: 'Pulse', 
    duration: '130 Days', 
    yield: '1.2t/acre',
    desc: 'Requires slightly higher phosphorus than current levels. Supplementation needed.',
    status: 'Maintenance Required',
    color: 'bg-orange-100 text-orange-700'
  }
];

export default function RecommendPage() {
  const router = useRouter();
  const [selectedCrop, setSelectedCrop] = useState(null);

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
             <h1 className="text-xl font-bold">Crop Recommendation Hub</h1>
          </div>
          <div className="flex items-center gap-4">
             <Badge className="bg-[#006b2c]/10 text-[#006b2c] border-0 py-1.5 px-4 rounded-lg font-bold flex gap-2">
               <Sparkles className="h-4 w-4" />
               AI Powered
             </Badge>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
               <h2 className="text-4xl font-extrabold text-[#1e1c12] tracking-tight mb-2">October Rabi Planning</h2>
               <p className="text-[#6e7b6c] font-medium text-lg">
                 Analyzing your soil mapping from <span className="text-[#1e1c12] font-bold">Sector 4B</span>
               </p>
            </div>
            <div className="p-4 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-xs font-bold text-[#6e7b6c]">System: Online</span>
               </div>
               <div className="h-8 w-px bg-gray-100" />
               <p className="text-xs font-bold text-[#1e1c12]">Last Scan: 2 Hours Ago</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Options */}
            <div className="lg:col-span-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {cropOptions.map((crop, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ y: -5 }}
                     onClick={() => setSelectedCrop(crop)}
                     className={cn(
                       "relative bg-white/70 backdrop-blur-xl border-2 rounded-[2.5rem] p-8 cursor-pointer transition-all overflow-hidden group",
                       selectedCrop?.name === crop.name ? "border-[#006b2c] shadow-2xl shadow-green-900/10" : "border-transparent shadow-sm hover:shadow-xl"
                     )}
                   >
                     {selectedCrop?.name === crop.name && (
                       <div className="absolute top-0 right-0 p-4">
                         <CheckCircle2 className="h-6 w-6 text-[#006b2c]" />
                       </div>
                     )}

                     <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", crop.color)}>
                        <Sprout className="h-7 w-7" />
                     </div>
                     
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-[#1e1c12]">{crop.name}</h3>
                        <Badge className="bg-white border text-[#006b2c] font-bold">{crop.match} Match</Badge>
                     </div>

                     <p className="text-sm text-[#6e7b6c] font-medium leading-relaxed mb-8">
                       {crop.desc}
                     </p>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50/50 p-3 rounded-xl">
                           <p className="text-[10px] font-bold text-[#bdcaba] uppercase mb-1">Estimated Yield</p>
                           <p className="text-sm font-bold text-[#1e1c12]">{crop.yield}</p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-xl">
                           <p className="text-[10px] font-bold text-[#bdcaba] uppercase mb-1">Growth Period</p>
                           <p className="text-sm font-bold text-[#1e1c12]">{crop.duration}</p>
                        </div>
                     </div>
                   </motion.div>
                 ))}
              </div>
            </div>

            {/* Analysis Deep Dive */}
            <Card className="lg:col-span-12 border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 mt-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                  <div>
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                      <Target className="h-6 w-6 text-[#006b2c]" />
                      Soil Compatibility Matrix
                    </h3>
                    <div className="space-y-8">
                      {[
                        { label: 'Nitrogen (N)', val: 85, status: 'High' },
                        { label: 'Phosphorus (P)', val: 42, status: 'Moderate' },
                        { label: 'Potassium (K)', val: 68, status: 'Stable' },
                        { label: 'Soil pH', val: 7.2, status: 'Neutral' },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-[#1e1c12]">{item.label}</span>
                            <span className="text-xs font-bold text-[#6e7b6c]">{item.status}</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${i === 3 ? (item.val/14)*100 : item.val}%` }}
                               transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                               className="h-full bg-gradient-to-r from-[#006b2c] to-[#00873a] rounded-full" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                     <div className="bg-[#fff9eb] border border-orange-100 rounded-[2.5rem] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                          <AlertTriangle className="h-24 w-24 text-orange-600" />
                        </div>
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-700">
                           <Info className="h-5 w-5" />
                           Agronomist Insight
                        </h4>
                        <p className="text-[#3e4a3d] leading-relaxed font-medium mb-8">
                          "While Wheat HD 2967 is your best match, the current Phosphorus levels (42%) are 
                          on the lower threshold. We recommend applying 25kg/acre of DAP during 
                          sowing to ensure strong radical development in the first 20 days."
                        </p>
                        <Button className="w-full h-14 bg-[#006b2c] text-white hover:bg-[#00873a] rounded-2xl font-bold shadow-xl shadow-green-900/10 transition-all active:scale-95">
                           Generate Application Plan
                        </Button>
                     </div>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Target(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
