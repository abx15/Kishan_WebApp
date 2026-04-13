'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/store/useAppStore';
import { recommendAPI } from '@/lib/api';

interface DailyTipsCardProps {
  className?: string;
}

export function DailyTipsCard({ className }: DailyTipsCardProps) {
  const language = useLanguage();

  const { data: response, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['dailyTips', language],
    queryFn: () => recommendAPI.getDailyTips(),
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
  });

  const tips = response?.success ? response.data : [];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !response?.success) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            {language === 'hi' ? 'Truti' : 'Error'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {language === 'hi' ? 'Tips prapt karne mein samasya' : 'Failed to fetch daily tips.'}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="w-full">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            {language === 'hi' ? 'Aaj ki Kheti ki Tip' : "Today's Farming Tip"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips && tips.length > 0 ? (
            <div className="space-y-3">
              {tips.map((tip: any, idx: number) => (
                <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 leading-relaxed font-medium">
                    {language === 'hi' ? tip.tip_hi : tip.tip_en}
                  </p>
                  <div className="mt-1">
                    <span className="text-[10px] uppercase bg-green-200 text-green-800 px-1.5 py-0.5 rounded font-bold">
                      {tip.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              {language === 'hi' ? 'Koi tip uplabdh nahi hai' : 'No tips available for today'}
            </div>
          )}
          
          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {language === 'hi' ? 'AI Dwara Janit' : 'AI Generated Content'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
