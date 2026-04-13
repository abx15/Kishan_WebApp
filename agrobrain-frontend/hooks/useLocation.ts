import { useState, useEffect } from 'react';
import { Location } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface UseLocationReturn {
  location: Location | null;
  permission: 'granted' | 'denied' | 'prompt';
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  requestLocationPermission: () => Promise<void>;
  setManualLocation: (location: Location) => void;
}

export const useLocation = (): UseLocationReturn => {
  const { 
    location, 
    locationPermission, 
    setLocation, 
    setLocationPermission 
  } = useAppStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current location using browser geolocation
  const getCurrentLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Get location name using reverse geocoding
      const locationData = await reverseGeocode(latitude, longitude);
      
      setLocation(locationData);
      setLocationPermission(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get location';
      setError(errorMessage);
      
      if (err.code === 1) { // Permission denied
        setLocationPermission(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Request location permission
  const requestLocationPermission = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      setLocationPermission(true);
      await getCurrentLocation();
    } catch (err: any) {
      const errorMessage = err.message || 'Permission denied';
      setError(errorMessage);
      setLocationPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Set location manually
  const setManualLocation = (locationData: Location): void => {
    setLocation(locationData);
    setError(null);
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lon: number): Promise<Location> => {
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      return {
        lat,
        lng: lon,
        latitude: lat,
        longitude: lon,
        city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
        state: data.address?.state || data.address?.region || 'Unknown',
      };
    } catch (err) {
      // Fallback to generic location
      return {
        lat,
        lng: lon,
        latitude: lat,
        longitude: lon,
        city: 'Unknown',
        state: 'Unknown',
      };
    }
  };

  // Check location permission on mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state === 'granted');
      });
    }
  }, []);

  return {
    location,
    permission: locationPermission ? 'granted' : 'denied',
    isLoading,
    error,
    getCurrentLocation,
    requestLocationPermission,
    setManualLocation,
  };
};
