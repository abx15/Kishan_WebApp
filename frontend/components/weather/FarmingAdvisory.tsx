'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@/types';
import { useLanguage } from '@/store/useAppStore';
import { Leaf, Droplets, Sun, Wind } from 'lucide-react';

interface FarmingAdvisoryProps {
  weatherData: WeatherData;
}

export function FarmingAdvisory({ weatherData }: FarmingAdvisoryProps) {
  const language = useLanguage();
  const { current } = weatherData;
  
  const condition = current.condition.toLowerCase();
  const temp = current.tempC;
  const humidity = current.humidityPct;
  const windSpeed = current.windSpeedKmh;

  const generateAdvisory = () => {
    let advisory = {
      title: '',
      content: '',
      icon: Leaf,
      color: 'green'
    };

    if (condition.includes('rain') || condition.includes('storm')) {
      advisory = {
        title: language === 'hi' ? 'baarish salaah' : 'Rain Advisory',
        content: language === 'hi' 
          ? 'aaj baarish hone ki sambhavna hai. faslon mein paani na jamne dein, drainage check karein. dhan aur gehu ke liye yah mausam accha hai.'
          : 'Rain expected today. Ensure proper drainage in fields to prevent waterlogging. Good for rice and wheat crops.',
        icon: Droplets,
        color: 'blue'
      };
    } else if (temp > 35) {
      advisory = {
        title: language === 'hi' ? 'garmi salaah' : 'Heat Advisory',
        content: language === 'hi'
          ? 'bahut garmi hai. subah ya shaam ke waqt paani dijie. paudon ko dhup se bachaye. paani ki kami se nahi hone dein.'
          : 'Very hot conditions. Water crops in early morning or evening. Provide shade to sensitive plants. Ensure adequate irrigation.',
        icon: Sun,
        color: 'orange'
      };
    } else if (windSpeed > 20) {
      advisory = {
        title: language === 'hi' ? 'hawa salaah' : 'Wind Advisory',
        content: language === 'hi'
          ? 'tez hawa chal rahi hai. lambe paudon ko support dijie. spray ka kaam na karein, viyansrit ho jayega.'
          : 'Strong winds expected. Provide support to tall crops. Avoid spraying pesticides as they will drift away.',
        icon: Wind,
        color: 'purple'
      };
    } else if (humidity > 80) {
      advisory = {
        title: language === 'hi' ? 'nami salaah' : 'Humidity Advisory',
        content: language === 'hi'
          ? 'bahut nami hai. fungal diseases ka jokim hai. paudon ke beech hawa chalne dijie. zarurat par fungicide spray karein.'
          : 'High humidity increases fungal disease risk. Ensure proper air circulation between plants. Monitor for signs of infection.',
        icon: Droplets,
        color: 'teal'
      };
    } else {
      advisory = {
        title: language === 'hi' ? 'aaj ka salaah' : "Today's Advisory",
        content: language === 'hi'
          ? 'mausam bahut accha hai. kheti ka kaam shuru kar sakte hain. beej bopai, khad ghasai, ya spray ka accha samay hai.'
          : 'Excellent weather conditions for farming activities. Good day for sowing, fertilizer application, or pesticide spraying.',
        icon: Leaf,
        color: 'green'
      };
    }

    return advisory;
  };

  const advisory = generateAdvisory();
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    teal: 'bg-teal-50 border-teal-200 text-teal-800'
  };

  return (
    <Card className={colorClasses[advisory.color as keyof typeof colorClasses]}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <advisory.icon className="w-5 h-5 mr-2" />
          {advisory.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">
            {advisory.content}
          </p>
          
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <div className="text-xs font-medium mb-2">
              {language === 'hi' ? 'aaj ka mausam' : 'Current Conditions'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>{language === 'hi' ? 'temp' : 'Temp'}:</span>
                <span className="font-medium">{Math.round(temp)}°C</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'hi' ? 'nami' : 'Humidity'}:</span>
                <span className="font-medium">{Math.round(humidity)}%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'hi' ? 'hawa' : 'Wind'}:</span>
                <span className="font-medium">{Math.round(windSpeed)} km/h</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'hi' ? 'mausam' : 'Condition'}:</span>
                <span className="font-medium">{current.condition}</span>
              </div>
            </div>
          </div>

          <div className="text-xs opacity-75 italic">
            {language === 'hi' 
              ? 'AI dwara vijnit salaah - apni sthiti ke anusaar badla sakte hain'
              : 'AI-generated advisory - may vary based on local conditions'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
