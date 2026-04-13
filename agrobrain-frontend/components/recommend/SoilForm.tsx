'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SoilInput } from '@/types';
import { useLanguage } from '@/store/useAppStore';
import { 
  Info,
  FlaskConical,
  Droplets,
  Sun,
  Calendar
} from 'lucide-react';

interface SoilFormProps {
  onSubmit: (data: SoilInput) => void;
  isLoading?: boolean;
}

export function SoilForm({ onSubmit, isLoading = false }: SoilFormProps) {
  const language = useLanguage();
  
  const [formData, setFormData] = useState<SoilInput>({
    nitrogenKgHa: 60,
    phosphorusKgHa: 40,
    potassiumKgHa: 30,
    ph: 6.5,
    moisturePct: 60,
    soilType: 'loamy',
  });

  const [season, setSeason] = useState<'kharif' | 'rabi' | 'zaid'>('kharif');
  const [area, setArea] = useState<number>(5);

  const handleSliderChange = (field: keyof SoilInput, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value[0]
    }));
  };

  const handleNumberChange = (field: keyof SoilInput, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      // Add season and area to the data if needed
    });
  };

  const getPhColor = (ph: number) => {
    if (ph < 5.5) return 'text-red-600';
    if (ph >= 6 && ph <= 7.5) return 'text-green-600';
    return 'text-orange-600';
  };

  const getPhBgColor = (ph: number) => {
    if (ph < 5.5) return 'bg-red-100';
    if (ph >= 6 && ph <= 7.5) return 'bg-green-100';
    return 'bg-orange-100';
  };

  const getFieldTooltip = (field: string) => {
    const tooltips = {
      nitrogen: language === 'hi' 
        ? 'N: paudon ki bhadhai ke liye zaroori - hari patti ke liye mahatvapurn'
        : 'N: Essential for plant growth - important for leafy vegetables',
      phosphorus: language === 'hi'
        ? 'P: jadon aur phoolon ke liye - phal vaali faslon ke liye zaroori'
        : 'P: Important for roots and flowers - essential for fruit crops',
      potassium: language === 'hi'
        ? 'K: paudon ki himmat ke liye - rog se ladhne ki shakti badhata hai'
        : 'K: For plant strength - increases disease resistance',
      ph: language === 'hi'
        ? 'pH: dharti ki acidity - 6-7.5 sabse accha hai'
        : 'pH: Soil acidity - 6-7.5 is optimal for most crops',
      moisture: language === 'hi'
        ? 'Nami: dharti mein paani ki maatra - beechopatti behtar hai'
        : 'Moisture: Water content in soil - moderate is better'
    };
    return tooltips[field as keyof typeof tooltips] || '';
  };

  const soilTypes = [
    { value: 'sandy', label: language === 'hi' ? 'baalu' : 'Sandy' },
    { value: 'clay', label: language === 'hi' ? 'chikni' : 'Clay' },
    { value: 'loamy', label: language === 'hi' ? 'dordhansi' : 'Loamy' },
    { value: 'silt', label: language === 'hi' ? 'kanke' : 'Silt' },
    { value: 'peat', label: language === 'hi' ? 'daldal' : 'Peat' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FlaskConical className="w-5 h-5 mr-2" />
          {language === 'hi' ? 'apki dharti ki jaankari' : 'Enter Your Soil Data'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nitrogen */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center text-sm font-medium">
              {language === 'hi' ? 'Nitrogen (N) kg/ha' : 'Nitrogen (N) kg/ha'}
              <Info className="w-3 h-3 ml-1 text-gray-400" title={getFieldTooltip('nitrogen')} />
            </Label>
            <span className="text-sm font-semibold">{formData.nitrogenKgHa}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Slider
              value={[formData.nitrogenKgHa]}
              onValueChange={(value) => handleSliderChange('nitrogenKgHa', value)}
              min={0}
              max={140}
              step={1}
              className="flex-1"
            />
            <input
              type="number"
              value={formData.nitrogenKgHa}
              onChange={(e) => handleNumberChange('nitrogenKgHa', e.target.value)}
              min={0}
              max={140}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Phosphorus */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center text-sm font-medium">
              {language === 'hi' ? 'Phosphorus (P) kg/ha' : 'Phosphorus (P) kg/ha'}
              <Info className="w-3 h-3 ml-1 text-gray-400" title={getFieldTooltip('phosphorus')} />
            </Label>
            <span className="text-sm font-semibold">{formData.phosphorusKgHa}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Slider
              value={[formData.phosphorusKgHa]}
              onValueChange={(value) => handleSliderChange('phosphorusKgHa', value)}
              min={5}
              max={145}
              step={1}
              className="flex-1"
            />
            <input
              type="number"
              value={formData.phosphorusKgHa}
              onChange={(e) => handleNumberChange('phosphorusKgHa', e.target.value)}
              min={5}
              max={145}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Potassium */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center text-sm font-medium">
              {language === 'hi' ? 'Potassium (K) kg/ha' : 'Potassium (K) kg/ha'}
              <Info className="w-3 h-3 ml-1 text-gray-400" title={getFieldTooltip('potassium')} />
            </Label>
            <span className="text-sm font-semibold">{formData.potassiumKgHa}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Slider
              value={[formData.potassiumKgHa]}
              onValueChange={(value) => handleSliderChange('potassiumKgHa', value)}
              min={5}
              max={205}
              step={1}
              className="flex-1"
            />
            <input
              type="number"
              value={formData.potassiumKgHa}
              onChange={(e) => handleNumberChange('potassiumKgHa', e.target.value)}
              min={5}
              max={205}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* pH */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center text-sm font-medium">
              {language === 'hi' ? 'pH level' : 'pH level'}
              <Info className="w-3 h-3 ml-1 text-gray-400" title={getFieldTooltip('ph')} />
            </Label>
            <Badge className={`${getPhBgColor(formData.ph)} ${getPhColor(formData.ph)}`}>
              pH {formData.ph}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Slider
              value={[formData.ph]}
              onValueChange={(value) => handleSliderChange('ph', value)}
              min={3.5}
              max={9.9}
              step={0.1}
              className="flex-1"
            />
            <input
              type="number"
              value={formData.ph}
              onChange={(e) => handleNumberChange('ph', e.target.value)}
              min={3.5}
              max={9.9}
              step={0.1}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span className="text-red-600">3.5</span>
            <span className="text-green-600">6.0-7.5</span>
            <span className="text-orange-600">9.9</span>
          </div>
        </div>

        {/* Moisture */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center text-sm font-medium">
              <Droplets className="w-4 h-4 mr-1" />
              {language === 'hi' ? 'nami %' : 'Moisture %'}
              <Info className="w-3 h-3 ml-1 text-gray-400" title={getFieldTooltip('moisture')} />
            </Label>
            <span className="text-sm font-semibold">{formData.moisturePct}%</span>
          </div>
          <div className="flex items-center space-x-3">
            <Slider
              value={[formData.moisturePct]}
              onValueChange={(value) => handleSliderChange('moisturePct', value)}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <input
              type="number"
              value={formData.moisturePct}
              onChange={(e) => handleNumberChange('moisturePct', e.target.value)}
              min={0}
              max={100}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Soil Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === 'hi' ? 'dharti ka prakar' : 'Soil Type'}
          </Label>
          <Select value={formData.soilType} onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {soilTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Season */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Calendar className="w-4 h-4 mr-1 inline" />
            {language === 'hi' ? 'fasal ka season' : 'Crop Season'}
          </Label>
          <div className="flex space-x-2">
            {[
              { value: 'kharif', label: language === 'hi' ? 'Kharif' : 'Kharif' },
              { value: 'rabi', label: language === 'hi' ? 'Rabi' : 'Rabi' },
              { value: 'zaid', label: language === 'hi' ? 'Zaid' : 'Zaid' },
            ].map(s => (
              <Button
                key={s.value}
                variant={season === s.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSeason(s.value as any)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {language === 'hi' ? 'kshetrafal (acres)' : 'Area (acres)'}
          </Label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
            min={0.1}
            step={0.1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={language === 'hi' ? 'kshetrafal darj karein' : 'Enter area in acres'}
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {language === 'hi' ? 'vishleshan ho raha hai...' : 'Analyzing...'}
            </>
          ) : (
            <>
              {language === 'hi' ? 'ð¤ AI recommendation prapt karein' : 'ð¤ Get AI Recommendation'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
