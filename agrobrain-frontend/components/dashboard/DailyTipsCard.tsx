'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf, RefreshCw, Clock } from 'lucide-react';
import { useLanguage } from '@/store/useAppStore';

interface DailyTipsCardProps {
  className?: string;
}

const dailyTips = {
  en: [
    "Apply organic fertilizers in the early morning for better absorption and reduced evaporation.",
    "Check soil moisture before irrigation. Overwatering can lead to root diseases and nutrient leaching.",
    "Rotate crops annually to maintain soil health and reduce pest buildup. Legumes fix nitrogen for next season.",
    "Monitor weather forecasts before applying pesticides. Rain within 24 hours can wash away treatments.",
    "Use drip irrigation for water efficiency. It delivers water directly to roots and reduces weed growth.",
    "Test soil pH every 3 months. Most crops prefer pH between 6.0-7.0 for optimal nutrient availability.",
    "Plant cover crops during off-season to prevent soil erosion and improve soil organic matter.",
    "Store seeds in cool, dry conditions. Proper storage maintains viability for the next planting season."
  ],
  hi: [
    "organic fertilizers, absorption, evaporation, early morning, better results",
    "soil moisture, irrigation, overwatering, root diseases, nutrient leaching",
    "crop rotation, soil health, pest control, legumes, nitrogen fixation",
    "weather forecast, pesticides, rain, 24 hours, treatment effectiveness",
    "drip irrigation, water efficiency, direct watering, weed control",
    "soil pH testing, 3 months, 6.0-7.0, nutrient availability, optimal growth",
    "cover crops, off-season, soil erosion, organic matter, soil health",
    "seed storage, cool dry conditions, viability, next planting season"
  ]
};

export function DailyTipsCard({ className }: DailyTipsCardProps) {
  const [currentTip, setCurrentTip] = useState('');
  const [tipIndex, setTipIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const language = useLanguage();

  useEffect(() => {
    // Load today's tip based on date
    const today = new Date().toDateString();
    const storedTip = localStorage.getItem(`dailyTip-${today}`);
    const storedIndex = localStorage.getItem(`dailyTipIndex-${today}`);
    const storedRefresh = localStorage.getItem(`dailyTipRefresh-${today}`);

    if (storedTip && storedIndex && storedRefresh) {
      setCurrentTip(storedTip);
      setTipIndex(parseInt(storedIndex));
      setLastRefresh(new Date(storedRefresh));
      setIsLoading(false);
    } else {
      // Generate new tip for today
      const randomIndex = Math.floor(Math.random() * dailyTips[language].length);
      const newTip = dailyTips[language][randomIndex];
      
      setCurrentTip(newTip);
      setTipIndex(randomIndex);
      setLastRefresh(new Date());
      
      // Store for today
      localStorage.setItem(`dailyTip-${today}`, newTip);
      localStorage.setItem(`dailyTipIndex-${today}`, randomIndex.toString());
      localStorage.setItem(`dailyTipRefresh-${today}`, new Date().toISOString());
      setIsLoading(false);
    }
  }, [language]);

  const handleRefresh = () => {
    if (lastRefresh) {
      const hoursSinceRefresh = (new Date().getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceRefresh < 24) {
        // Show message that tip can only be refreshed once per day
        return;
      }
    }

    // Get a new tip
    const newIndex = (tipIndex + 1) % dailyTips[language].length;
    const newTip = dailyTips[language][newIndex];
    
    setCurrentTip(newTip);
    setTipIndex(newIndex);
    setLastRefresh(new Date());
    
    // Update storage
    const today = new Date().toDateString();
    localStorage.setItem(`dailyTip-${today}`, newTip);
    localStorage.setItem(`dailyTipIndex-${today}`, newIndex.toString());
    localStorage.setItem(`dailyTipRefresh-${today}`, new Date().toISOString());
  };

  const canRefresh = lastRefresh ? 
    (new Date().getTime() - lastRefresh.getTime()) / (1000 * 60 * 60) >= 24 : 
    false;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
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
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Today's Farming Tip
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={!canRefresh}
            className="text-gray-500 hover:text-gray-700"
            title={canRefresh ? "Get new tip" : "Only one refresh per day"}
          >
            <RefreshCw className={`w-4 h-4 ${!canRefresh ? 'opacity-50' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 leading-relaxed">
              {currentTip}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {lastRefresh && `Updated ${new Date(lastRefresh).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </div>
            <div>
              Tip {tipIndex + 1} of {dailyTips[language].length}
            </div>
          </div>

          {!canRefresh && (
            <div className="text-xs text-gray-500 text-center">
              New tip available tomorrow
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
