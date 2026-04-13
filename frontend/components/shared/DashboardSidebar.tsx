'use client';

import { Sprout, LayoutDashboard, Cloud, Droplets, MessageCircle, Mic, Settings, LogOut, TrendingUp, Bell } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Cloud, label: 'Weather', href: '/weather' },
  { icon: Sprout, label: 'Crop Advice', href: '/recommend' },
  { icon: MessageCircle, label: 'AI Chat', href: '/chat' },
  { icon: Mic, label: 'Voice Assistant', href: '/voice' },
  { icon: TrendingUp, label: 'Market Prices', href: '/market' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    router.push('/login');
  };

  return (
    <div className="w-72 h-screen flex flex-col bg-white border-r border-[#006b2c]/10 sticky top-0 overflow-y-auto z-40">
      <div className="p-8 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-[#006b2c] to-[#00873a] rounded-xl shadow-lg shadow-green-900/10">
          <Sprout className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-[#1e1c12]">AgroBrain <span className="text-[#006b2c]">AI</span></span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-green-50 text-[#006b2c]" 
                  : "text-[#6e7b6c] hover:bg-gray-50 hover:text-[#1e1c12]"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-sidebar"
                  className="absolute left-0 w-1 y-2 h-6 bg-[#006b2c] rounded-full"
                />
              )}
              <item.icon className={cn("h-5 w-5", isActive ? "text-[#006b2c]" : "text-[#bdcaba] group-hover:text-[#6e7b6c]")} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#fff9eb] rounded-2xl p-4 mb-4 border border-orange-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-[#006b2c]">
            K
          </div>
          <div>
            <p className="text-xs font-bold text-[#1e1c12]">Premium Farmer</p>
            <p className="text-[10px] text-[#6e7b6c]">Active until May 2026</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-semibold text-sm group"
        >
          <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-600" />
          Logout
        </button>
      </div>
    </div>
  );
}
