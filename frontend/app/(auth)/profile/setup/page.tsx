'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Check,
  Leaf,
  User,
  Home,
  Map
} from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

interface ProfileSetupData {
  name: string;
  language: 'hi' | 'en';
  farmArea: number;
  soilType: string;
  primaryCrops: string[];
  irrigationType: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  location: {
    lat: number;
    lng: number;
  };
}

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, setUser, language, setLanguage } = useAppStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  
  const [formData, setFormData] = useState<ProfileSetupData>({
    name: user?.name || '',
    language: user?.language || 'hi',
    farmArea: user?.farmProfile?.totalAreaAcres || 0,
    soilType: user?.farmProfile?.soilType || '',
    primaryCrops: user?.farmProfile?.primaryCrops || [],
    irrigationType: user?.farmProfile?.irrigationType || '',
    village: user?.defaultLocation?.village || '',
    district: user?.defaultLocation?.district || '',
    state: user?.defaultLocation?.state || '',
    pincode: user?.defaultLocation?.pincode || '',
    location: {
      lat: user?.defaultLocation?.lat || 0,
      lng: user?.defaultLocation?.lng || 0
    }
  });

  const soilTypes = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Loamy'];
  const cropOptions = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits'];
  const irrigationTypes = ['Canal', 'Drip', 'Sprinkler', 'Rainfed'];

  // Handle language change
  const handleLanguageChange = (newLanguage: 'hi' | 'en') => {
    setFormData(prev => ({ ...prev, language: newLanguage }));
    setLanguage(newLanguage);
  };

  // Handle crop selection
  const handleCropToggle = (crop: string) => {
    setFormData(prev => ({
      ...prev,
      primaryCrops: prev.primaryCrops.includes(crop)
        ? prev.primaryCrops.filter(c => c !== crop)
        : [...prev.primaryCrops, crop]
    }));
  };

  // Detect location using GPS
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setError('');

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Mock reverse geocoding (in real app, use Google Maps API or similar)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLocation = {
        village: 'Demo Village',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226001'
      };

      setFormData(prev => ({
        ...prev,
        location: { lat: latitude, lng: longitude },
        ...mockLocation
      }));

      toast.success('Location detected successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to detect location. Please enter manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          setError('Please enter your name');
          return false;
        }
        return true;
      
      case 2:
        if (formData.farmArea <= 0) {
          setError('Please enter a valid farm area');
          return false;
        }
        if (!formData.soilType) {
          setError('Please select soil type');
          return false;
        }
        if (formData.primaryCrops.length === 0) {
          setError('Please select at least one primary crop');
          return false;
        }
        if (!formData.irrigationType) {
          setError('Please select irrigation type');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.village.trim()) {
          setError('Please enter your village name');
          return false;
        }
        if (!formData.district.trim()) {
          setError('Please enter your district');
          return false;
        }
        if (!formData.state.trim()) {
          setError('Please enter your state');
          return false;
        }
        if (!formData.pincode.trim() || formData.pincode.length !== 6) {
          setError('Please enter a valid 6-digit pincode');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (!validateStep()) return;
    
    setError('');
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit profile setup
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setError('');

    try {
      // Update user profile
      const updatedUser = {
        ...user!,
        name: formData.name,
        language: formData.language,
        farmProfile: {
          totalAreaAcres: formData.farmArea,
          soilType: formData.soilType,
          primaryCrops: formData.primaryCrops,
          irrigationType: formData.irrigationType,
          hasSoilSensor: false
        },
        defaultLocation: {
          lat: formData.location.lat,
          lng: formData.location.lng,
          village: formData.village,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      // In real implementation, call API
      // const response = await authAPI.updateProfile(updatedUser);
      
      setUser(updatedUser);
      toast.success('Profile setup completed successfully!');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Skip profile setup
  const handleSkip = () => {
    router.push('/dashboard');
  };

  // Generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/login')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Complete Your Profile</h1>
            </div>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Farm Details</span>
            <span>Location</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          {getInitials(formData.name) || 'NA'}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Tell us about yourself
                      </h2>
                      <p className="text-gray-600">
                        Help us personalize your experience
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700 font-medium mb-3 block">
                        Preferred Language *
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant={formData.language === 'hi' ? 'default' : 'outline'}
                          onClick={() => handleLanguageChange('hi')}
                          className={`py-3 text-lg ${
                            formData.language === 'hi'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'border-green-600 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          ????
                        </Button>
                        <Button
                          type="button"
                          variant={formData.language === 'en' ? 'default' : 'outline'}
                          onClick={() => handleLanguageChange('en')}
                          className={`py-3 text-lg ${
                            formData.language === 'en'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'border-green-600 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          English
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Farm Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home className="w-10 h-10 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Farm Information
                      </h2>
                      <p className="text-gray-600">
                        Tell us about your farming practices
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="farmArea" className="text-gray-700 font-medium">
                        Total Farm Area (acres) *
                      </Label>
                      <Input
                        id="farmArea"
                        type="number"
                        placeholder="Enter farm area in acres"
                        value={formData.farmArea || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, farmArea: parseFloat(e.target.value) || 0 }))}
                        className="mt-2"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700 font-medium mb-3 block">
                        Soil Type *
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {soilTypes.map((soil) => (
                          <Button
                            key={soil}
                            type="button"
                            variant={formData.soilType === soil ? 'default' : 'outline'}
                            onClick={() => setFormData(prev => ({ ...prev, soilType: soil }))}
                            className={`py-2 ${
                              formData.soilType === soil
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'border-green-600 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {soil}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-700 font-medium mb-3 block">
                        Primary Crops * (select all that apply)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {cropOptions.map((crop) => (
                          <Button
                            key={crop}
                            type="button"
                            variant={formData.primaryCrops.includes(crop) ? 'default' : 'outline'}
                            onClick={() => handleCropToggle(crop)}
                            className={`py-2 ${
                              formData.primaryCrops.includes(crop)
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'border-green-600 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {crop}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-700 font-medium mb-3 block">
                        Irrigation Type *
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {irrigationTypes.map((type) => (
                          <Button
                            key={type}
                            type="button"
                            variant={formData.irrigationType === type ? 'default' : 'outline'}
                            onClick={() => setFormData(prev => ({ ...prev, irrigationType: type }))}
                            className={`py-2 ${
                              formData.irrigationType === type
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'border-green-600 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Location */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Farm Location
                      </h2>
                      <p className="text-gray-600">
                        Help us provide location-specific recommendations
                      </p>
                    </div>

                    <div>
                      <Button
                        onClick={handleDetectLocation}
                        disabled={isDetectingLocation}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                      >
                        {isDetectingLocation ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Detecting location...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Detect My Location
                          </div>
                        )}
                      </Button>
                    </div>

                    <div className="text-center text-gray-500 text-sm">
                      or enter manually below
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="village" className="text-gray-700 font-medium">
                          Village *
                        </Label>
                        <Input
                          id="village"
                          type="text"
                          placeholder="Enter village name"
                          value={formData.village}
                          onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="district" className="text-gray-700 font-medium">
                          District *
                        </Label>
                        <Input
                          id="district"
                          type="text"
                          placeholder="Enter district"
                          value={formData.district}
                          onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state" className="text-gray-700 font-medium">
                          State *
                        </Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="Enter state"
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pincode" className="text-gray-700 font-medium">
                          Pincode *
                        </Label>
                        <Input
                          id="pincode"
                          type="text"
                          placeholder="6-digit pincode"
                          value={formData.pincode}
                          onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                          className="mt-2"
                          maxLength={6}
                        />
                      </div>
                    </div>

                    {/* Map Preview (placeholder) */}
                    {(formData.location.lat !== 0 || formData.location.lng !== 0) && (
                      <div className="mt-6">
                        <Label className="text-gray-700 font-medium mb-3 block">
                          Location Preview
                        </Label>
                        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <Map className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">
                              {formData.village}, {formData.district}
                            </p>
                            <p className="text-xs">
                              {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === 3 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Setting up...
                        </div>
                      ) : (
                        <>
                          Complete Setup
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
