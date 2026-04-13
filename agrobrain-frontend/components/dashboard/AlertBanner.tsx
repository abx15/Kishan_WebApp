'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeatherData } from '@/types';
import { AlertTriangle, CloudRain, Wind, Sun, X } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { useLocation } from '@/hooks/useLocation';

interface AlertBannerProps {
  className?: string;
}

export function AlertBanner({ className }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const { location } = useLocation();
  const { weatherData } = useWeather(location || undefined);

  if (dismissed || !weatherData?.alerts || weatherData.alerts.length === 0) {
    return null;
  }

  const alert = weatherData.alerts[0]; // Show the first/most important alert

  const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rain':
      case 'storm':
        return <CloudRain className="w-5 h-5" />;
      case 'wind':
        return <Wind className="w-5 h-5" />;
      case 'heat':
      case 'sun':
        return <Sun className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const alertColor = getAlertColor(alert.severity);

  return (
    <Card className={`${alertColor} border ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`w-10 h-10 rounded-full bg-current bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold capitalize">
                  {alert.type} Alert
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full bg-current bg-opacity-20`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm opacity-90">
                {alert.messageEn || alert.messageHi}
              </p>
              <div className="mt-2 text-xs opacity-75">
                This alert affects your farming activities. Take appropriate precautions.
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="ml-2 hover:bg-current hover:bg-opacity-10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
