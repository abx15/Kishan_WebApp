'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  Leaf, 
  Droplets, 
  Sun, 
  Bug, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  ArrowLeft, 
  Camera, 
  MapPin,
  Calendar,
  Activity,
  Shield,
  Target,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const cropHealth = [
  { 
    field: 'Field A - Wheat', 
    health: 92, 
    status: 'Excellent', 
    area: '2.5 Hectares',
    nextAction: 'Fertilizer in 5 days',
    issues: 0
  },
  { 
    field: 'Field B - Rice', 
    health: 78, 
    status: 'Good', 
    area: '1.8 Hectares',
    nextAction: 'Pest inspection',
    issues: 1
  },
  { 
    field: 'Field C - Cotton', 
    health: 65, 
    status: 'Moderate', 
    area: '3.2 Hectares',
    nextAction: 'Irrigation needed',
    issues: 2
  },
];

const recommendations = [
  {
    type: 'Pest Alert',
    priority: 'High',
    title: 'Aphid Detection in Field B',
    description: 'Early signs of aphid infestation detected. Apply organic pesticide within 48 hours.',
    action: 'View Treatment Options',
    icon: Bug,
    color: 'orange'
  },
  {
    type: 'Nutrient Deficiency',
    priority: 'Medium',
    title: 'Nitrogen Levels Low in Field C',
    description: 'Soil analysis shows nitrogen deficiency. Consider urea application.',
    action: 'Calculate Dosage',
    icon: Leaf,
    color: 'yellow'
  },
  {
    type: 'Growth Optimization',
    priority: 'Low',
    title: 'Optimal Harvest Time Approaching',
    description: 'Field A wheat ready for harvest in 10-12 days based on growth patterns.',
    action: 'Schedule Harvest',
    icon: Target,
    color: 'green'
  }
];

const diseasePredictions = [
  { name: 'Wheat Rust', probability: 'Low', risk: 15, field: 'Field A' },
  { name: 'Rice Blast', probability: 'Medium', risk: 45, field: 'Field B' },
  { name: 'Cotton Wilt', probability: 'Low', risk: 20, field: 'Field C' },
];

export default function CropIntelligencePage() {
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
             <h1 className="text-xl font-bold">Crop Intelligence</h1>
          </div>
          <div className="flex items-center gap-4">
             <Badge className="bg-green-100 text-[#006b2c] border-0 py-1.5 px-4 rounded-lg font-bold">AI-Powered Analysis</Badge>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Main Overview Card */}
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-green-600 to-green-400 p-12 text-white shadow-3xl shadow-green-900/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-2xl border border-white/20">
                  <Sprout className="h-5 w-5" />
                  <span className="font-bold">3 Active Fields Monitored</span>
                </div>
                <h2 className="text-4xl font-black mb-4">Overall Crop Health</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-6xl font-black">78%</div>
                  <div>
                    <p className="text-xl font-bold opacity-90">Good Condition</p>
                    <p className="font-medium opacity-70">7.5 Hectares Total</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Active Issues</p>
                    <p className="text-xl font-bold">3</p>
                  </div>
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Health Score</p>
                    <p className="text-xl font-bold">+5%</p>
                  </div>
                  <div className="px-6 py-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Yield Forecast</p>
                    <p className="text-xl font-bold">+12%</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex justify-center">
                 <Leaf className="w-64 h-64 text-white/20 absolute blur-3xl" />
                 <div className="relative">
                   <Sprout className="w-56 h-56 text-white drop-shadow-2xl animate-pulse duration-[3s]" />
                   <Activity className="w-24 h-24 text-green-200 absolute -top-10 -right-10 animate-bounce" />
                 </div>
              </div>
            </div>
          </div>

          {/* Field Health Grid */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#1e1c12]">Field Health Monitoring</h3>
                <p className="text-[#6e7b6c] font-medium">Real-time crop health analysis across all fields</p>
              </div>
              <Button className="bg-[#006b2c] text-white rounded-xl font-bold flex gap-2">
                <Camera className="h-4 w-4" />
                Scan Field
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cropHealth.map((field, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white/70 backdrop-blur border border-transparent hover:border-[#006b2c]/20 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-[#1e1c12] mb-1">{field.field}</h4>
                      <p className="text-[10px] font-bold text-[#bdcaba] uppercase">{field.area}</p>
                    </div>
                    <Badge className={cn(
                      "border-0 rounded-lg",
                      field.health >= 85 ? "bg-green-100 text-[#006b2c]" :
                      field.health >= 70 ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-600"
                    )}>
                      {field.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-[#6e7b6c]">Health Score</span>
                      <span className="text-2xl font-black text-[#1e1c12]">{field.health}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          field.health >= 85 ? "bg-green-500 w-[85%]" :
                          field.health >= 70 ? "bg-yellow-500 w-[70%]" :
                          "bg-red-500 w-[65%]"
                        )} 
                        style={{ width: `${field.health}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-[#006b2c]" />
                      <p className="text-sm font-bold text-[#6e7b6c]">{field.nextAction}</p>
                    </div>
                    {field.issues > 0 && (
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <p className="text-sm font-bold text-orange-600">{field.issues} issues detected</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Recommendations & Disease Predictions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card className="lg:col-span-2 border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Zap className="h-6 w-6 text-[#006b2c]" />
                AI Recommendations
              </h3>
              <div className="space-y-6">
                {recommendations.map((rec, i) => {
                  const Icon = rec.icon;
                  return (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 5 }}
                      className={cn(
                        "p-6 rounded-3xl border transition-all",
                        rec.priority === 'High' ? "bg-orange-50/50 border-orange-100" :
                        rec.priority === 'Medium' ? "bg-yellow-50/50 border-yellow-100" :
                        "bg-green-50/50 border-green-100"
                      )}
                    >
                      <div className="flex gap-6 items-start">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                          rec.color === 'orange' ? "bg-orange-100" :
                          rec.color === 'yellow' ? "bg-yellow-100" :
                          "bg-green-100"
                        )}>
                          <Icon className={cn(
                            "h-7 w-7",
                            rec.color === 'orange' ? "text-orange-600" :
                            rec.color === 'yellow' ? "text-yellow-600" :
                            "text-green-600"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={cn(
                              "border-0 text-xs",
                              rec.priority === 'High' ? "bg-orange-100 text-orange-600" :
                              rec.priority === 'Medium' ? "bg-yellow-100 text-yellow-600" :
                              "bg-green-100 text-green-600"
                            )}>
                              {rec.priority} Priority
                            </Badge>
                            <span className="text-sm font-bold text-[#6e7b6c]">{rec.type}</span>
                          </div>
                          <h4 className="text-lg font-bold mb-2 text-[#1e1c12]">{rec.title}</h4>
                          <p className="text-[#6e7b6c] leading-relaxed mb-4">{rec.description}</p>
                          <Button variant="outline" className="border-[#006b2c]/20 text-[#006b2c] hover:bg-[#006b2c]/10 rounded-xl font-bold">
                            {rec.action}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            <div className="space-y-10">
              <Card className="border-0 shadow-3xl shadow-green-900/5 bg-white/70 backdrop-blur-2xl rounded-[3rem] p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#006b2c]" />
                  Disease Risk Forecast
                </h3>
                <div className="space-y-5">
                  {diseasePredictions.map((disease, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-[#1e1c12]">{disease.name}</span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-1 rounded-lg",
                          disease.probability === 'Low' ? "bg-green-100 text-green-600" :
                          disease.probability === 'Medium' ? "bg-yellow-100 text-yellow-600" :
                          "bg-red-100 text-red-600"
                        )}>
                          {disease.probability}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            disease.risk <= 20 ? "bg-green-500" :
                            disease.risk <= 50 ? "bg-yellow-500" :
                            "bg-red-500"
                          )} 
                          style={{ width: `${disease.risk}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-[#bdcaba]">{disease.field}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="relative rounded-[2.5rem] p-8 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl shadow-blue-900/20 text-white">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Info className="h-20 w-20" />
                </div>
                <h4 className="text-lg font-bold mb-2">Satellite Scan</h4>
                <p className="text-sm opacity-90 leading-relaxed font-medium mb-6">
                  Last satellite analysis completed 2 hours ago. 
                  Next scan scheduled for tomorrow at 6:00 AM.
                </p>
                <Button className="w-full h-11 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold">
                   View Detailed Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
