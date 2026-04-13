'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings2, 
  Map, 
  Bell, 
  Shield, 
  Languages, 
  Database, 
  Smartphone, 
  ArrowLeft,
  ChevronRight,
  Camera,
  Trash2,
  Lock,
  Zap,
  Sprout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import DashboardSidebar from '@/components/shared/DashboardSidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'farming', label: 'Farm Config', icon: Map },
    { id: 'language', label: 'Language', icon: Languages },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

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
             <h1 className="text-xl font-bold">Lab Settings</h1>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="rounded-xl border-gray-100 font-bold">Discard Changes</Button>
             <Button className="bg-[#006b2c] text-white hover:bg-[#00873a] px-8 rounded-xl font-bold shadow-lg shadow-green-900/10">Save Configuration</Button>
          </div>
        </header>

        <div className="p-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-72 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm",
                    activeTab === tab.id 
                      ? "bg-[#006b2c] text-white shadow-xl shadow-green-900/10" 
                      : "text-[#6e7b6c] hover:bg-white/50"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
              
              <div className="pt-10">
                 <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                    <Zap className="h-6 w-6 text-orange-600 mb-3" />
                    <p className="text-xs font-black text-orange-800 uppercase tracking-widest mb-2">Beta Access</p>
                    <p className="text-[10px] font-bold text-orange-700 leading-relaxed mb-4">
                      You are currently testing the Satellite V4 mapping protocol.
                    </p>
                    <button className="text-[10px] font-black underline text-orange-900">LEARN MORE</button>
                 </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-10">
              {activeTab === 'profile' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-10"
                >
                  <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 shadow-3xl shadow-green-900/5 border border-white/20">
                    <div className="flex flex-col sm:flex-row gap-10 items-center">
                       <div className="relative">
                          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-green-100 to-green-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                             <User className="h-16 w-16 text-[#006b2c]/20" />
                          </div>
                          <button className="absolute -bottom-2 -right-2 p-3 bg-[#006b2c] text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                             <Camera className="h-4 w-4" />
                          </button>
                       </div>
                       <div className="flex-1 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-xs font-black text-[#bdcaba] uppercase tracking-widest ml-1">Full Name</Label>
                                <Input defaultValue="Kishan Kumar" className="h-14 rounded-2xl bg-white/50 border-gray-100 font-bold" />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-xs font-black text-[#bdcaba] uppercase tracking-widest ml-1">Mobile Number</Label>
                                <Input defaultValue="+91 98765 43210" disabled className="h-14 rounded-2xl bg-gray-50 border-gray-100 font-bold opacity-60 cursor-not-allowed" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <Label className="text-xs font-black text-[#bdcaba] uppercase tracking-widest ml-1">Email Address</Label>
                             <Input defaultValue="kishan.kumar@farmer-link.in" className="h-14 rounded-2xl bg-white/50 border-gray-100 font-bold" />
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="border-0 shadow-sm bg-white p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                              <Trash2 className="h-6 w-6" />
                           </div>
                           <div>
                              <p className="font-bold">Delete Account</p>
                              <p className="text-xs text-[#bdcaba] font-bold uppercase">Irreversible Action</p>
                           </div>
                        </div>
                        <Button variant="outline" className="w-full h-12 border-red-100 text-red-500 hover:bg-red-50 rounded-xl font-bold">Permanently Remove Data</Button>
                     </Card>

                     <Card className="border-0 shadow-sm bg-white p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                              <Lock className="h-6 w-6" />
                           </div>
                           <div>
                              <p className="font-bold">Privacy Controls</p>
                              <p className="text-xs text-[#bdcaba] font-bold uppercase">Data Sharing: Off</p>
                           </div>
                        </div>
                        <Button variant="outline" className="w-full h-12 border-blue-100 text-blue-600 hover:bg-blue-50 rounded-xl font-bold">Manage Permissions</Button>
                     </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === 'farming' && (
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="space-y-8"
                >
                   <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-10 shadow-3xl shadow-green-900/5 border border-white/20">
                      <h3 className="text-2xl font-bold mb-8">Field Configuration</h3>
                      <div className="space-y-8">
                         {[
                           { label: 'Automatic Satellite Scans', desc: 'Allow system to scan fields via Sentinel-2 every 48h.', active: true },
                           { label: 'Ground Sensor Sync', desc: 'Sync data from soil moisture IoT probes automatically.', active: true },
                           { label: 'Public Market Listing', desc: 'Show your yield estimates to nearby verified buyers.', active: false },
                         ].map((config, i) => (
                           <div key={i} className="flex items-center justify-between p-6 bg-white/50 rounded-[2rem] border border-[#006b2c]/5">
                              <div className="max-w-md">
                                 <p className="font-bold text-[#1e1c12]">{config.label}</p>
                                 <p className="text-xs text-[#6e7b6c] font-medium leading-relaxed mt-1">{config.desc}</p>
                              </div>
                              <Switch 
                                checked={config.active}
                                className="data-[state=checked]:bg-[#006b2c]"
                              />
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
