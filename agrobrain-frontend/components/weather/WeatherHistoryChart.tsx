'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/store/useAppStore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export function WeatherHistoryChart() {
  const language = useLanguage();

  // Generate mock historical data for the last 7 days
  const generateHistoricalData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic temperature data with some variation
      const baseTemp = 25;
      const variation = Math.sin(i / 3) * 8 + Math.random() * 4;
      const maxTemp = baseTemp + variation + 5;
      const minTemp = baseTemp + variation - 3;
      
      data.push({
        date: date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { 
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
        avgTemp: Math.round((maxTemp + minTemp) / 2)
      });
    }
    
    return data;
  };

  const historicalData = generateHistoricalData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}°C
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          {language === 'hi' ? '7 dinon ka mausam itihaas' : '7-Day Weather History'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicalData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="maxTemp"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
                name={language === 'hi' ? 'max temp' : 'Max Temp'}
              />
              <Line
                type="monotone"
                dataKey="avgTemp"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3 }}
                name={language === 'hi' ? 'avg temp' : 'Avg Temp'}
              />
              <Line
                type="monotone"
                dataKey="minTemp"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name={language === 'hi' ? 'min temp' : 'Min Temp'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">
              {language === 'hi' ? 'max temp' : 'Max Temp'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              {language === 'hi' ? 'avg temp' : 'Avg Temp'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">
              {language === 'hi' ? 'min temp' : 'Min Temp'}
            </span>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          {language === 'hi' 
            ? 'pichle 7 dinon ki temperature trend'
            : 'Temperature trend over the last 7 days'
          }
        </div>
      </CardContent>
    </Card>
  );
}
