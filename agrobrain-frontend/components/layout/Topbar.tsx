'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Menu, 
  User,
  Settings,
  LogOut,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { useUser, useLocation, useAppStore } from '@/store/useAppStore';
import { LanguageToggle } from '@/components/shared/LanguageToggle';

export function Topbar() {
  const user = useUser();
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [notifications, setNotifications] = useState(3);

  const handleMenuToggle = () => {
    toggleSidebar();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu toggle and search */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Notifications, user menu */}
        <div className="flex items-center space-x-4">
          {/* Location badge */}
          {location && (
            <Badge variant="outline" className="hidden sm:flex items-center">
              <Globe className="w-3 h-3 mr-1" />
              {location.city}
            </Badge>
          )}

          {/* Language toggle */}
          <LanguageToggle />

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || 'Not logged in'}
              </p>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
