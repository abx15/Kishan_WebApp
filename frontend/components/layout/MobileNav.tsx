'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  Cloud, 
  Sprout, 
  MessageCircle, 
  Mic, 
  User, 
  Settings,
  LogOut,
  Menu,
  Leaf,
  X
} from 'lucide-react';
import { useUser, useSidebarOpen } from '@/store/useAppStore';
import { useAppStore } from '@/store/useAppStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Weather', href: '/dashboard/weather', icon: Cloud },
  { name: 'Recommendations', href: '/dashboard/recommend', icon: Sprout },
  { name: 'Chat Assistant', href: '/dashboard/chat', icon: MessageCircle },
  { name: 'Voice Assistant', href: '/dashboard/voice', icon: Mic },
];

const secondaryNavigation = [
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const user = useUser();
  const [open, setOpen] = useState(false);

  const handleNavClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    useAppStore.getState().clearUser();
    useAppStore.getState().clearToken();
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Mobile menu button */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">AgroBrain</span>
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full w-full flex-col bg-white">
              {/* Logo */}
              <div className="flex h-16 items-center px-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">AgroBrain</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleNavClick}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                          isActive
                            ? 'bg-green-100 text-green-800'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        )}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="space-y-1">
                    {secondaryNavigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleNavClick}
                          className={cn(
                            'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                            isActive
                              ? 'bg-green-100 text-green-800'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          )}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </nav>

              {/* User Section */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || 'Guest User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.phone || 'Not logged in'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
