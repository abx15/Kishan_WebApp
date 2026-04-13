'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ForecastDay } from '@/types';
import { useLanguage } from '@/store/useAppStore';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow,
  ChevronDown,
  ChevronUp,
  Droplets
} from 'lucide-react';

interface WeeklyForecastTableProps {
  forecast: ForecastDay[];
}

export function WeeklyForecastTable({ forecast }: WeeklyForecastTableProps) {
  const language = useLanguage();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

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

  const formatDayName = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return language === 'hi' ? 'aaj' : 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return language === 'hi' ? 'kal' : 'Tomorrow';
    } else {
      return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { 
        weekday: 'short' 
      });
    }
  };

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'hi' ? '7 din ki bhavishyavani' : '7-Day Forecast'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  {language === 'hi' ? 'din' : 'Day'}
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  {language === 'hi' ? 'mausam' : 'Condition'}
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  {language === 'hi' ? 'max' : 'Max'}
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  {language === 'hi' ? 'min' : 'Min'}
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">
                  {language === 'hi' ? 'baarish' : 'Rain'}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  {language === 'hi' ? 'salah' : 'Advisory'}
                </th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((day, index) => (
                <tr 
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {formatDayName(day.date)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      {getWeatherIcon(day.condition)}
                      <span className="text-sm text-gray-700">{day.condition}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-gray-900">
                      {Math.round(day.tempMaxC)}°
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-gray-600">
                      {Math.round(day.tempMinC)}°
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Progress 
                        value={day.rainProbabilityPct} 
                        className="w-12 h-2"
                      />
                      <span className="text-sm text-blue-600 font-medium">
                        {Math.round(day.rainProbabilityPct)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 truncate max-w-xs">
                        {day.farmingAdvisory}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        {expandedRow === index ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expanded Advisory */}
        {expandedRow !== null && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">
                  {language === 'hi' ? 'kisan salaah' : 'Farming Advisory'} - {formatDayName(forecast[expandedRow].date)}
                </h4>
                <p className="text-sm text-green-800 leading-relaxed">
                  {forecast[expandedRow].farmingAdvisory}
                </p>
                <div className="mt-3 text-xs text-green-700">
                  <strong>{language === 'hi' ? 'baadish' : 'Recommendation'}:</strong> {forecast[expandedRow].farmingAdvisory}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
