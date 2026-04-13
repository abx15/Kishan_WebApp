'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherAlert } from '@/types';
import { useLanguage } from '@/store/useAppStore';
import { 
  AlertTriangle, 
  CloudRain, 
  Wind,
  Sun,
  CheckCircle
} from 'lucide-react';

interface AlertsPanelProps {
  alerts: WeatherAlert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const language = useLanguage();

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

  const getAlertTitle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rain':
        return language === 'hi' ? 'baarish warning' : 'Rain Warning';
      case 'storm':
        return language === 'hi' ? 'toofan warning' : 'Storm Warning';
      case 'wind':
        return language === 'hi' ? 'hawa warning' : 'Wind Warning';
      case 'heat':
        return language === 'hi' ? 'garmi warning' : 'Heat Warning';
      case 'cold':
        return language === 'hi' ? 'sardi warning' : 'Cold Warning';
      default:
        return language === 'hi' ? 'mausam alert' : 'Weather Alert';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            {language === 'hi' ? 'sab theek' : 'All Clear'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 text-sm">
            {language === 'hi' ? 'aaj koi mausam jokhim nahi hai' : 'No weather risks today'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
          {language === 'hi' ? 'sakriam alerts' : 'Active Alerts'}
          <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
            {alerts.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">
                    {getAlertTitle(alert.type)}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-current bg-opacity-20`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {language === 'hi' ? alert.messageHi : alert.messageEn}
                </p>
                <div className="mt-2 text-xs opacity-75">
                  {language === 'hi' ? 'kisanon ke liye mahatvapurn' : 'Important for farmers'}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-xs text-gray-500 text-center pt-2">
          {language === 'hi' ? 'alerts time ke saath update hote rahege' : 'Alerts will be updated as conditions change'}
        </div>
      </CardContent>
    </Card>
  );
}
