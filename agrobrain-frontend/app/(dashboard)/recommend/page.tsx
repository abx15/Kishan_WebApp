'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SoilForm } from '@/components/recommend/SoilForm';
import { CropRecommendationResults } from '@/components/recommend/CropRecommendationResults';
import { IrrigationSchedule } from '@/components/recommend/IrrigationSchedule';
import { DailyTips } from '@/components/recommend/DailyTips';
import { useLanguage } from '@/store/useAppStore';
import { useMutation } from '@tanstack/react-query';
import { SoilInput, RecommendationResponse } from '@/types';
import { apiPost } from '@/lib/api';
import { 
  Sprout, 
  Droplets, 
  FlaskConical,
  Loader2,
  TrendingUp
} from 'lucide-react';

export default function RecommendationsPage() {
  const language = useLanguage();
  const [soilData, setSoilData] = useState<SoilInput | null>(null);
  const [recommendationResults, setRecommendationResults] = useState<RecommendationResponse | null>(null);

  // Mutation for soil analysis
  const soilAnalysisMutation = useMutation({
    mutationFn: async (data: SoilInput): Promise<RecommendationResponse> => {
      const response = await apiPost<RecommendationResponse>('/recommend/crops', data);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get recommendations');
      }
    },
    onSuccess: (data) => {
      setRecommendationResults(data);
      setSoilData(null); // Clear form after successful submission
    },
    onError: (error: Error) => {
      console.error('Soil analysis failed:', error);
    }
  });

  const handleSoilSubmit = (data: SoilInput) => {
    setSoilData(data);
    soilAnalysisMutation.mutate(data);
  };

  const handleNewAnalysis = () => {
    setRecommendationResults(null);
    setSoilData(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'hi' ? 'fasal salah' : 'Crop Recommendations'}
        </h1>
        <p className="text-gray-600 mt-1">
          {language === 'hi' 
            ? 'AI-powered farming advice based on your soil conditions'
            : 'AI-powered farming advice based on your soil conditions'
          }
        </p>
      </div>

      <Tabs defaultValue="crops" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crops" className="flex items-center space-x-2">
            <Sprout className="w-4 h-4" />
            <span>{language === 'hi' ? 'fasal' : 'Crop'}</span>
          </TabsTrigger>
          <TabsTrigger value="irrigation" className="flex items-center space-x-2">
            <Droplets className="w-4 h-4" />
            <span>{language === 'hi' ? 'sinchai' : 'Irrigation'}</span>
          </TabsTrigger>
          <TabsTrigger value="fertilizer" className="flex items-center space-x-2">
            <FlaskConical className="w-4 h-4" />
            <span>{language === 'hi' ? 'khad' : 'Fertilizer'}</span>
          </TabsTrigger>
        </TabsList>

        {/* CROP RECOMMENDATION TAB */}
        <TabsContent value="crops" className="space-y-6">
          {soilAnalysisMutation.isPending && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-8 text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {language === 'hi' ? 'aapki dharti ka vishleshan ho raha hai...' : 'Analyzing your soil...'}
                </h3>
                <p className="text-blue-700 text-sm">
                  {language === 'hi' 
                    ? 'AI behtar farming recommendations dekh rahi hai'
                    : 'AI is finding the best farming recommendations for you'
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {!recommendationResults && !soilAnalysisMutation.isPending && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Soil Input Form */}
              <div>
                <SoilForm onSubmit={handleSoilSubmit} isLoading={soilAnalysisMutation.isPending} />
              </div>

              {/* Right: Previous Results or Empty State */}
              <div>
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === 'hi' ? 'apki dharti ka wait karein' : 'Enter Your Soil Data'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {language === 'hi'
                        ? 'dakshin panel mein apni dharti ki jaankari bharein aur AI recommendations prapt karein'
                        : 'Fill in your soil information in the left panel and get AI recommendations'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {recommendationResults && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === 'hi' ? 'AI recommendations' : 'AI Recommendations'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {language === 'hi' 
                      ? 'aapki dharti ke anusaar top crops'
                      : 'Top crops based on your soil conditions'
                    }
                  </p>
                </div>
                <Button variant="outline" onClick={handleNewAnalysis}>
                  {language === 'hi' ? 'naya analysis' : 'New Analysis'}
                </Button>
              </div>

              <CropRecommendationResults results={recommendationResults} />
            </div>
          )}
        </TabsContent>

        {/* IRRIGATION TAB */}
        <TabsContent value="irrigation" className="space-y-6">
          <IrrigationSchedule />
        </TabsContent>

        {/* FERTILIZER TAB */}
        <TabsContent value="fertilizer" className="space-y-6">
          <DailyTips />
        </TabsContent>
      </Tabs>
    </div>
  );
}
