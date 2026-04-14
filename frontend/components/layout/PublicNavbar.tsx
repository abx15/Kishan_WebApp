'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sprout, Menu, X, Globe, ChevronDown } from 'lucide-react';
import LanguageToggle from '@/components/shared/LanguageToggle';

export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Features', href: '/#features' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href.startsWith('/#')) {
      return pathname === '/';
    }
    return pathname === href;
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith('/#')) {
      // If we're not on the home page, navigate to home first
      if (pathname !== '/') {
        router.push('/');
        // Then scroll to the section after a short delay
        setTimeout(() => {
          const element = document.querySelector(href.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // If we're already on home page, just scroll
        const element = document.querySelector(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      router.push(href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#006b2c]/10 h-20 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => router.push('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2.5 bg-gradient-to-br from-[#006b2c] to-[#00873a] rounded-xl shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1e1c12]">AgroBrain <span className="text-[#006b2c]">AI</span></span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className={`hover:text-[#006b2c] transition-colors ${
                  isActiveLink(item.href) ? 'text-[#006b2c] font-bold' : 'text-[#1e1c12]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button 
              variant="ghost" 
              onClick={() => router.push('/login')}
              className="hidden sm:inline-flex text-[#1e1c12] hover:bg-green-50"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => router.push('/register')}
              className="bg-gradient-to-br from-[#006b2c] to-[#00873a] hover:opacity-90 text-white rounded-xl shadow-lg shadow-green-900/10"
            >
              Get Started
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <motion.div
            className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#006b2c] to-[#00873a] rounded-xl">
                    <Sprout className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-[#1e1c12]">AgroBrain <span className="text-[#006b2c]">AI</span></span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-2 mb-8">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActiveLink(item.href)
                        ? 'bg-[#006b2c]/10 text-[#006b2c] font-bold'
                        : 'text-[#1e1c12] hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <LanguageToggle />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    router.push('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-[#1e1c12] border-[#006b2c]/20 hover:bg-green-50"
                >
                  Sign In
                </Button>

                <Button 
                  onClick={() => {
                    router.push('/register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-br from-[#006b2c] to-[#00873a] hover:opacity-90 text-white rounded-xl"
                >
                  Get Started
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Support:</span>
                    <a href="mailto:arun.builds.tech@gmail.com" className="text-[#006b2c] hover:underline">
                      arun.builds.tech@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Phone:</span>
                    <span>1800-AGROAI</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
