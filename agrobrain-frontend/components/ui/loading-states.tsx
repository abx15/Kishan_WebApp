'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-green-600 ${sizeClasses[size]} ${className}`} />
  );
};

// Page loading skeleton
export const PageLoadingSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-4 space-y-6"
    >
      {/* Header Skeleton */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 relative">
          <div className="absolute -bottom-8 left-6">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
        </div>
        <CardContent className="pt-12 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-24 mt-4 sm:mt-0" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>

      {/* Content Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Card loading skeleton
export const CardLoadingSkeleton = ({ lines = 3 }: { lines?: number }) => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={`skeleton-${i}`} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
        ))}
      </CardContent>
    </Card>
  );
};

// Weather card loading skeleton
export const WeatherCardLoadingSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="h-6 w-6 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Chat message loading skeleton
export const ChatMessageLoadingSkeleton = ({ isUser = false }: { isUser?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className={`p-3 rounded-2xl ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Dashboard stats loading skeleton
export const DashboardStatsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Recommendation card loading skeleton
export const RecommendationCardLoadingSkeleton = () => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

// List item loading skeleton
export const ListItemLoadingSkeleton = ({ showAvatar = false }: { showAvatar?: boolean }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        {showAvatar && <Skeleton className="w-10 h-10 rounded-full" />}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
};

// Form loading skeleton
export const FormLoadingSkeleton = ({ fields = 4 }: { fields?: number }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={`form-field-${i}`} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex space-x-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

// Full screen loading overlay
export const FullScreenLoading = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </motion.div>
  );
};

// Button loading state
interface ButtonLoadingProps {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

export const ButtonLoading = ({ children, loading, ...props }: ButtonLoadingProps) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        inline-flex items-center justify-center space-x-2
        ${props.className || ''}
        ${loading ? 'opacity-75 cursor-not-allowed' : ''}
      `}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};
