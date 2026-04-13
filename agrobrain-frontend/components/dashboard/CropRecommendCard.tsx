'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sprout, TrendingUp, AlertCircle } from 'lucide-react';
import { useUser } from '@/store/useAppStore';
import Link from 'next/link';

interface CropRecommendCardProps {
  className?: string;
}

export function CropRecommendCard({ className }: CropRecommendCardProps) {
  const user = useUser();

  // Mock data for demonstration
  const hasSoilData = user?.farmProfile?.soilType;
  const topCrop = hasSoilData ? {
    name: 'Wheat',
    confidence: 92,
    expectedYield: 4.2,
    reason: 'Ideal soil pH and moisture levels for wheat cultivation in your region'
  } : null;

  if (!hasSoilData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sprout className="w-5 h-5 mr-2" />
            Crop Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Soil Data Available
            </h3>
            <p className="text-gray-600 mb-6">
              Enter your soil data to get personalized crop recommendations
            </p>
            <Link href="/dashboard/recommend">
              <Button className="w-full">
                <Sprout className="w-4 h-4 mr-2" />
                Enter Soil Data
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Sprout className="w-5 h-5 mr-2" />
            Top Crop Recommendation
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">
            Based on your soil data
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Top Crop Info */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {topCrop?.name}
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-green-100 text-green-800">
                  {topCrop?.confidence}% Match
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Expected: {topCrop?.expectedYield} tons/ha
                </div>
              </div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Recommendation Reason */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Why this crop?
            </h4>
            <p className="text-sm text-blue-800">
              {topCrop?.reason}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link href="/dashboard/recommend" className="flex-1">
              <Button className="w-full">
                <Sprout className="w-4 h-4 mr-2" />
                Get New Recommendation
              </Button>
            </Link>
            <Button variant="outline" className="flex-1">
              View Details
            </Button>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600 mb-1">Best Season</div>
              <div className="font-semibold">Rabi (Oct-Mar)</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600 mb-1">Water Needs</div>
              <div className="font-semibold">Medium</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
