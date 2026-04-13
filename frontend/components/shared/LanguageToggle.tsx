'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const [isHindi, setIsHindi] = useState(false);

  const toggleLanguage = () => {
    setIsHindi(!isHindi);
    // Here you can add language context logic
    // For now, it just toggles the button state
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {isHindi ? 'HI' : 'EN'}
      </span>
    </Button>
  );
};

export { LanguageToggle };
export default LanguageToggle;
