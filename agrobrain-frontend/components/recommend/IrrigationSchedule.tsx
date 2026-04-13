'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Calendar, Clock, Sun } from 'lucide-react';

const IrrigationSchedule = () => {
  const schedule = [
    {
      day: 'Monday',
      time: '6:00 AM',
      duration: '2 hours',
      crop: 'Wheat Field A',
      status: 'completed'
    },
    {
      day: 'Wednesday',
      time: '5:30 AM',
      duration: '1.5 hours',
      crop: 'Rice Field B',
      status: 'pending'
    },
    {
      day: 'Friday',
      time: '6:30 AM',
      duration: '2 hours',
      crop: 'Sugarcane Field',
      status: 'pending'
    },
    {
      day: 'Sunday',
      time: '7:00 AM',
      duration: '1 hour',
      crop: 'Vegetable Garden',
      status: 'pending'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          <span>Irrigation Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedule.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                item.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{item.day}</span>
                </div>
                {item.status === 'completed' && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{item.time}</span>
                  <span className="text-gray-500">({item.duration})</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{item.crop}</span>
                </div>
              </div>
              
              {item.status === 'pending' && (
                <Button size="sm" variant="outline" className="mt-3 w-full">
                  Mark Complete
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Next irrigation: Wednesday 5:30 AM</span>
            <Button size="sm" variant="outline">
              Edit Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { IrrigationSchedule };
export default IrrigationSchedule;
