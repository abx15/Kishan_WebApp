'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  onComplete,
  size = 'md',
  duration = 2000
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.5
      }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      onAnimationComplete={() => {
        setTimeout(() => {
          onComplete?.();
        }, duration);
      }}
    >
      <motion.div
        className={`${sizeClasses[size]} bg-green-500 rounded-full flex items-center justify-center shadow-lg`}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360, 360]
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            delay: 0.2
          }}
        >
          <Check 
            className={`${iconSizes[size]} text-white`}
            strokeWidth={3}
          />
        </motion.div>
      </motion.div>
      
      {/* Ripple effect */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} bg-green-400 rounded-full opacity-30`}
        animate={{
          scale: [1, 2, 2.5],
          opacity: [0.3, 0.1, 0]
        }}
        transition={{
          duration: 1,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
};

// Form submission success wrapper
export const FormSuccessWrapper: React.FC<{
  isSuccess: boolean;
  children: React.ReactNode;
  successMessage?: string;
}> = ({ isSuccess, children, successMessage = "Success!" }) => {
  return (
    <div className="relative">
      {children}
      <SuccessAnimation 
        show={isSuccess}
        size="md"
        duration={1500}
      />
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
        >
          {successMessage}
        </motion.div>
      )}
    </div>
  );
};
