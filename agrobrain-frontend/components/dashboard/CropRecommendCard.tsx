'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sprout, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { useUser, useLanguage } from '@/store/useAppStore';
import { recommendAPI } from '@/lib/api';
import Link from 'next/link';

interface CropRecommendCardProps {
  className?: string;
}

export function CropRecommendCard({ className }: CropRecommendCardProps) {
  const user = useUser();
  const language = useLanguage();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['cropRecommendationLatest'],
    queryFn: () => recommendAPI.getHistory(1),
    enabled: !!user,
  });

  const latestRec = response?.success && response.data.recommendations?.length > 0 
    ? response.data.recommendations[0] 
    : null;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestRec) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sprout className="w-5 h-5 mr-2 text-green-600" />
            {language === 'hi' ? 'Fasal ki Salah' : 'Crop Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {language === 'hi' ? 'Koi purana data nahi' : 'No Recent Recommendations'}
            </h3>
            <p className="text-xs text-gray-500 mb-4 px-4">
              {language === 'hi' ? 'Apni mitti ka data bharein' : 'Enter your soil details to get AI-powered crop advice'}
            </p>
            <Link href="/dashboard/recommend">
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                {language === 'hi' ? 'Nayi Salah Payein' : 'Get Started'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Sprout className="w-4 h-4 mr-2 text-green-600" />
            {language === 'hi' ? 'Prashasta Fasal' : 'Top Recommended Crop'}
          </CardTitle>
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-green-700 border-green-200 bg-green-50">
            {latestRec.confidence}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {latestRec.top_crop}
              </h3>
              <div className="flex items-center text-[10px] text-gray-500 mt-0.5">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(latestRec.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="p-2 bg-green-50 rounded-full">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase mb-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Quick Summary
            </div>
            <p className="text-xs text-gray-700 line-clamp-2 italic">
              "Best suited for {latestRec.soil_data.soil_type} soil in {latestRec.season} season."
            </p>
          </div>

          <div className="flex space-x-2">
            <Link href="/dashboard/recommend" className="flex-1">
              <Button size="sm" variant="outline" className="w-full text-xs">
                {language === 'hi' ? 'Fir se dekhein' : 'New Analysis'}
              </Button>
            </Link>
            <Link href={`/dashboard/recommend/history/${latestRec.id}`} className="flex-1">
              <Button size="sm" className="w-full text-xs bg-green-600 hover:bg-green-700">
                {language === 'hi' ? 'Vistrit dekhein' : 'View Details'}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
