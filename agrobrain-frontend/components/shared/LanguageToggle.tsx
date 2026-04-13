'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const LanguageToggle = () => {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const currentLocale = pathname.startsWith('/hi') ? 'hi' : 'en';
    const newLocale = currentLocale === 'hi' ? 'en' : 'hi';
    
    // Get the current path without locale
    const pathWithoutLocale = pathname.replace(/^\/(en|hi)/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  const currentLocale = pathname.startsWith('/hi') ? 'hi' : 'en';
  const isHindi = currentLocale === 'hi';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm">
        {isHindi ? 'EN' : 'HI'}
      </span>
    </Button>
  );
};

export { LanguageToggle };
export default LanguageToggle;
