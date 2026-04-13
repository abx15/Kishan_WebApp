import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date with locale support
export const formatDate = (date: string | Date, locale: string = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

// Format temperature
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  if (unit === 'F') {
    return `${Math.round(temp * 9/5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

// Format wind speed
export const formatWindSpeed = (speed: number, unit: 'kmh' | 'mph' = 'kmh'): string => {
  if (unit === 'mph') {
    return `${Math.round(speed * 0.621371)} mph`;
  }
  return `${Math.round(speed)} km/h`;
};

// Format humidity
export const formatHumidity = (humidity: number): string => {
  return `${Math.round(humidity)}%`;
};

// Format pressure
export const formatPressure = (pressure: number): string => {
  return `${Math.round(pressure)} hPa`;
};

// Format UV index with color
export const formatUVIndex = (uvIndex: number): { value: string; color: string } => {
  const value = uvIndex.toFixed(1);
  let color = 'text-green-600';
  
  if (uvIndex >= 11) {
    color = 'text-purple-600';
  } else if (uvIndex >= 8) {
    color = 'text-red-600';
  } else if (uvIndex >= 6) {
    color = 'text-orange-600';
  } else if (uvIndex >= 3) {
    color = 'text-yellow-600';
  }
  
  return { value, color };
};

// Get weather condition icon
export const getWeatherIcon = (condition: string): string => {
  const iconMap: Record<string, string> = {
    'sunny': 'sun',
    'clear': 'sun',
    'partly-cloudy': 'cloud-sun',
    'cloudy': 'cloud',
    'overcast': 'cloud',
    'rain': 'cloud-rain',
    'drizzle': 'cloud-drizzle',
    'snow': 'snowflake',
    'sleet': 'cloud-snow',
    'fog': 'cloud-fog',
    'mist': 'cloud-fog',
    'thunderstorm': 'cloud-lightning',
    'windy': 'wind',
  };
  
  return iconMap[condition.toLowerCase()] || 'cloud';
};

// Get weather condition description
export const getWeatherDescription = (condition: string): string => {
  const descriptions: Record<string, string> = {
    'sunny': 'Sunny',
    'clear': 'Clear',
    'partly-cloudy': 'Partly Cloudy',
    'cloudy': 'Cloudy',
    'overcast': 'Overcast',
    'rain': 'Rain',
    'drizzle': 'Drizzle',
    'snow': 'Snow',
    'sleet': 'Sleet',
    'fog': 'Fog',
    'mist': 'Mist',
    'thunderstorm': 'Thunderstorm',
    'windy': 'Windy',
  };
  
  return descriptions[condition.toLowerCase()] || condition;
};

// Calculate precipitation chance
export const getPrecipitationChance = (chance: number): string => {
  return `${Math.round(chance)}%`;
};

// Format time
export const formatTime = (time: string | Date, locale: string = 'en-US'): string => {
  const timeObj = typeof time === 'string' ? new Date(time) : time;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timeObj);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date, locale: string = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateObj, locale);
  }
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic validation)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

// Get crop emoji
export const getCropEmoji = (cropName: string): string => {
  const cropEmojis: Record<string, string> = {
    'wheat': ' wheat',
    'rice': ' rice',
    'corn': ' corn',
    'soybean': ' soybean',
    'cotton': ' cotton',
    'sugarcane': ' sugarcane',
    'potato': ' potato',
    'tomato': ' tomato',
    'onion': ' onion',
    'garlic': ' garlic',
  };
  
  return cropEmojis[cropName.toLowerCase()] || ' seedling';
};

// Get soil texture emoji
export const getSoilTextureEmoji = (texture: string): string => {
  const textureEmojis: Record<string, string> = {
    'sandy': ' beach',
    'clay': ' brick',
    'loamy': ' soil',
    'silty': ' water',
  };
  
  return textureEmojis[texture.toLowerCase()] || ' soil';
};
