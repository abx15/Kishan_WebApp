'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastDay } from '@/types';
import { useLanguage } from '@/store/useAppStore';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow
} from 'lucide-react';

interface HourlyForecastProps {
  forecast: ForecastDay[];
}

export function HourlyForecast({ forecast }: HourlyForecastProps) {
  const language = useLanguage();

  // Generate hourly data from daily forecast (mock implementation)
  const hourlyData = Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() + i);
    
    // Use the first day's forecast as base and vary the temperature
    const baseTemp = forecast[0]?.tempMaxC || 25;
    const tempVariation = Math.sin(i / 4 * Math.PI) * 5; // Temperature variation throughout the day
    const temp = baseTemp + tempVariation - (i > 6 ? 3 : 0); // Cooler in early morning
    
    return {
      hour: date.getHours(),
      temp: Math.round(temp),
      condition: i < 4 ? 'partly-cloudy' : i < 6 ? 'sunny' : 'cloudy',
      precipitationChance: Math.max(0, 30 - i * 5 + Math.random() * 20)
    };
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'rain':
      case 'rainy':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="w-5 h-5 text-gray-400" />;
      case 'cloudy':
      case 'partly-cloudy':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour} ${period}`;
  };

  const isCurrentHour = (hour: number) => {
    return hour === new Date().getHours();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'hi' ? 'aghantik bhavishyavani' : 'Hourly Forecast'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {hourlyData.map((hour, index) => (
            <div
              key={index}
              className={`flex-shrink-0 text-center p-3 rounded-lg transition-colors ${
                isCurrentHour(hour.hour)
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs font-medium text-gray-600 mb-2">
                {formatHour(hour.hour)}
              </div>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(hour.condition)}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {hour.temp}°
              </div>
              {hour.precipitationChance > 10 && (
                <div className="text-xs text-blue-600 mt-1">
                  {Math.round(hour.precipitationChance)}%
                </div>
              )}
              {isCurrentHour(hour.hour) && (
                <div className="text-xs text-green-700 font-medium mt-2">
                  {language === 'hi' ? 'abhi' : 'Now'}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
