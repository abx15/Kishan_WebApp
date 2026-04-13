'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sprout, TrendingUp, AlertTriangle } from 'lucide-react';

interface CropRecommendationResultsProps {
  recommendations?: any[];
  results?: any;
  loading?: boolean;
  onRetry?: () => void;
}

const CropRecommendationResults: React.FC<CropRecommendationResultsProps> = ({
  recommendations = [],
  results,
  loading = false,
  onRetry
}) => {
  const displayRecommendations = results?.topCrops || recommendations;
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing Your Soil Data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (displayRecommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>No Recommendations Available</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Unable to generate crop recommendations. Please check your soil data and try again.
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <Sprout className="w-5 h-5 text-green-600" />
        <span>Recommended Crops</span>
      </h3>
      
      {displayRecommendations.map((rec, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{rec.crop}</h4>
                  <Badge variant="secondary">
                    {rec.season}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      {Math.round(rec.confidence * 100)}% match
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{rec.reason}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Expected Yield:</span>
                    <span className="ml-2 font-medium">{rec.expectedYield || 'High'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Growing Period:</span>
                    <span className="ml-2 font-medium">{rec.growingPeriod || '90-120 days'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { CropRecommendationResults };
export default CropRecommendationResults;
