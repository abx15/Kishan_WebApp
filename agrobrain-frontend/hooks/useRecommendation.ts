import { useState, useCallback } from 'react';
import { SoilData, CropRecommendation } from '@/types';
import { apiPost } from '@/lib/api';

interface UseRecommendationReturn {
  recommendations: CropRecommendation[];
  isLoading: boolean;
  error: string | null;
  getRecommendations: (soilData: SoilData) => Promise<CropRecommendation[]>;
  clearRecommendations: () => void;
}

export const useRecommendation = (): UseRecommendationReturn => {
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(async (soilData: SoilData): Promise<CropRecommendation[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiPost<CropRecommendation[]>('/recommendations', soilData);
      
      if (response.success && response.data) {
        setRecommendations(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get recommendations');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get recommendations';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setError(null);
  }, []);

  return {
    recommendations,
    isLoading,
    error,
    getRecommendations,
    clearRecommendations,
  };
};

// Mock recommendation generator (for development)
export const generateMockRecommendations = (soilData: SoilData): CropRecommendation[] => {
  const crops = [
    'Wheat', 'Rice', 'Corn', 'Soybean', 'Cotton', 'Sugarcane', 
    'Potato', 'Tomato', 'Onion', 'Garlic', 'Barley', 'Millet'
  ];

  const recommendations: CropRecommendation[] = [];

  // Generate 3-5 recommendations based on soil data
  const numRecommendations = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numRecommendations; i++) {
    const crop = crops[Math.floor(Math.random() * crops.length)];
    const confidence = 70 + Math.random() * 25; // 70-95% confidence
    
    recommendations.push({
      crop,
      confidence,
      reasons: generateReasons(soilData, crop),
      plantingSeason: ['Spring', 'Summer', 'Winter', 'Monsoon'][Math.floor(Math.random() * 4)],
      harvestTime: `${60 + Math.floor(Math.random() * 90)} days`,
      expectedYield: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 kg/ha
      waterRequirement: Math.floor(Math.random() * 500) + 200, // 200-700 mm
      fertilizerRecommendation: {
        nitrogen: Math.floor(Math.random() * 100) + 50,
        phosphorus: Math.floor(Math.random() * 80) + 30,
        potassium: Math.floor(Math.random() * 60) + 20,
        applicationMethod: ['Broadcast', 'Banding', 'Fertigation'][Math.floor(Math.random() * 3)],
        timing: ['At planting', 'Split application', 'Top dressing'][Math.floor(Math.random() * 3)],
        quantity: Math.floor(Math.random() * 200) + 100,
        unit: 'kg/ha',
      },
    });
  }

  // Sort by confidence
  recommendations.sort((a, b) => b.confidence - a.confidence);

  return recommendations;
};

const generateReasons = (soilData: SoilData, crop: string): string[] => {
  const reasons: string[] = [];

  // pH-based reasons
  if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
    reasons.push('Optimal pH range for nutrient availability');
  } else if (soilData.ph < 6.0) {
    reasons.push('Consider lime application to improve pH');
  } else {
    reasons.push('High pH may limit nutrient availability');
  }

  // Nutrient-based reasons
  if (soilData.nitrogen > 50) {
    reasons.push('Good nitrogen content supports growth');
  } else {
    reasons.push('Nitrogen supplementation recommended');
  }

  if (soilData.phosphorus > 30) {
    reasons.push('Adequate phosphorus for root development');
  } else {
    reasons.push('Phosphorus addition beneficial');
  }

  // Texture-based reasons
  if (soilData.texture === 'loamy') {
    reasons.push('Loamy soil provides good drainage and moisture retention');
  } else if (soilData.texture === 'sandy') {
    reasons.push('Sandy soil requires frequent irrigation');
  } else if (soilData.texture === 'clay') {
    reasons.push('Clay soil retains moisture well');
  }

  // Organic matter
  if (soilData.organicMatter > 3) {
    reasons.push('High organic matter improves soil fertility');
  }

  // Moisture
  if (soilData.moisture > 60) {
    reasons.push('Good moisture content supports crop growth');
  }

  return reasons.slice(0, 3); // Return top 3 reasons
};
