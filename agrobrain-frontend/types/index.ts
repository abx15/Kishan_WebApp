export interface User {
  id: string;
  phone: string;
  name: string;
  language: "hi" | "en";
  avatarUrl?: string;
  defaultLocation: Location;
  farmProfile: FarmProfile;
  isVerified: boolean;
  role: "farmer" | "admin" | "agronomist";
}

export interface Location {
  lat: number;
  lng: number;
  village?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

export interface FarmProfile {
  totalAreaAcres: number;
  soilType: string;
  primaryCrops: string[];
  irrigationType: string;
  hasSoilSensor: boolean;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
  alerts: WeatherAlert[];
  locationName: string;
  cached: boolean;
}

export interface CurrentWeather {
  tempC: number;
  feelsLikeC: number;
  humidityPct: number;
  windSpeedKmh: number;
  condition: string;
  description: string;
  iconCode: string;
  uvIndex: number;
}

export interface ForecastDay {
  date: string;
  tempMaxC: number;
  tempMinC: number;
  humidityPct: number;
  rainProbabilityPct: number;
  condition: string;
  farmingAdvisory: string;
}

export interface WeatherAlert {
  type: string;
  severity: "low" | "moderate" | "high" | "critical";
  messageHi: string;
  messageEn: string;
}

export interface SoilInput {
  nitrogenKgHa: number;
  phosphorusKgHa: number;
  potassiumKgHa: number;
  ph: number;
  moisturePct: number;
  soilType: string;
}

export interface CropResult {
  rank: number;
  crop: string;
  confidencePct: number;
  expectedYieldTonHa: number;
  suitabilityScore: number;
}

export interface RecommendationResponse {
  topCrops: CropResult[];
  aiExplanation: AIExplanation;
  modelVersion: string;
  inferenceTimeMs: number;
  cached: boolean;
}

export interface AIExplanation {
  summaryHi: string;
  summaryEn: string;
  irrigationAdviceHi: string;
  irrigationAdviceEn: string;
  fertilizerPlan: FertilizerPlan;
}

export interface FertilizerPlan {
  basal: string;
  topDress1: string;
  topDress2: string;
  totalCostEstimateInr?: number;
}

export interface ChatMessage {
  msgId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  language?: string;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  totalMessages: number;
  startedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface DashboardStats {
  totalQueries: number;
  weatherQueries: number;
  cropRecommendations: number;
  chatSessions: number;
  activeAlerts: number;
}

export interface AppSettings {
  language: 'en' | 'hi';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  locationServices: boolean;
  voiceCommands: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

export interface VoiceCommand {
  id: string;
  command: string;
  intent: string;
  entities: Record<string, any>;
  confidence: number;
  timestamp: string;
}
