'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Droplets, Sun, Wind } from 'lucide-react';

const DailyTips = () => {
  const tips = [
    {
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      title: "Irrigation Alert",
      description: "Best time to water your crops is early morning (6-8 AM)",
      priority: "high"
    },
    {
      icon: <Sun className="w-5 h-5 text-yellow-500" />,
      title: "Weather Tip",
      description: "Expected temperature rise tomorrow. Consider shade for sensitive crops",
      priority: "medium"
    },
    {
      icon: <Wind className="w-5 h-5 text-gray-500" />,
      title: "Pest Control",
      description: "High humidity detected. Monitor for fungal infections",
      priority: "medium"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span>Daily Farming Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 mt-0.5">
              {tip.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{tip.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
            </div>
            {tip.priority === 'high' && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                High
              </span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export { DailyTips };
export default DailyTips;
