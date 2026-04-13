"""
Pydantic schemas for crop recommendation API.

This module defines the data models for request/response validation
in the recommendation service endpoints.
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, validator
from enum import Enum


class SeasonEnum(str, Enum):
    """Enumeration for growing seasons in India."""
    KHARIF = "kharif"
    RABI = "rabi"
    ZAID = "zaid"


class LanguageEnum(str, Enum):
    """Enumeration for supported languages."""
    HINDI = "hi"
    ENGLISH = "en"


class SoilTypeEnum(str, Enum):
    """Enumeration for soil types common in India."""
    CLAY = "clay"
    LOAMY = "loamy"
    SANDY = "sandy"
    SILT = "silt"
    PEATY = "peaty"
    CHALKY = "chalky"
    BLACK = "black"
    RED = "red"
    ALLUVIAL = "alluvial"


class SoilInput(BaseModel):
    """Soil input data for crop recommendation."""
    nitrogen_kg_ha: float = Field(..., ge=0, le=500, description="Nitrogen content in kg per hectare")
    phosphorus_kg_ha: float = Field(..., ge=0, le=200, description="Phosphorus content in kg per hectare")
    potassium_kg_ha: float = Field(..., ge=0, le=200, description="Potassium content in kg per hectare")
    ph: float = Field(..., ge=4.0, le=9.0, description="Soil pH level (4-9)")
    moisture_pct: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    organic_matter_pct: Optional[float] = Field(None, ge=0, le=10, description="Organic matter percentage")
    soil_type: Optional[SoilTypeEnum] = Field(None, description="Soil type classification")
    
    @validator('nitrogen_kg_ha', 'phosphorus_kg_ha', 'potassium_kg_ha')
    def round_npk_values(cls, v):
        """Round NPK values to reduce cache fragmentation."""
        return round(v / 5) * 5
    
    @validator('ph')
    def round_ph_value(cls, v):
        """Round pH to 1 decimal place."""
        return round(v, 1)


class RecommendationRequest(BaseModel):
    """Request model for crop recommendation."""
    soil: SoilInput = Field(..., description="Soil analysis data")
    season: SeasonEnum = Field(..., description="Growing season")
    area_acres: float = Field(..., gt=0, le=1000, description="Farm area in acres")
    lat: float = Field(..., ge=6.0, le=38.0, description="Latitude in India (6-38)")
    lng: float = Field(..., ge=68.0, le=97.0, description="Longitude in India (68-97)")
    language: LanguageEnum = Field(LanguageEnum.ENGLISH, description="Response language")
    
    @validator('area_acres')
    def round_area(cls, v):
        """Round area to 2 decimal places."""
        return round(v, 2)


class CropResult(BaseModel):
    """Individual crop recommendation result."""
    rank: int = Field(..., ge=1, le=3, description="Recommendation rank (1-3)")
    crop: str = Field(..., description="Crop name")
    confidence_pct: float = Field(..., ge=0, le=100, description="Confidence percentage")
    expected_yield_ton_ha: Optional[float] = Field(None, ge=0, description="Expected yield in tons per hectare")
    suitability_score: float = Field(..., ge=0, le=100, description="Overall suitability score")


class FertilizerPlan(BaseModel):
    """Fertilizer application plan."""
    basal: Dict[str, Any] = Field(..., description="Basal fertilizer application details")
    top_dress_1: Dict[str, Any] = Field(..., description="First top dressing details")
    top_dress_2: Optional[Dict[str, Any]] = Field(None, description="Second top dressing details")
    total_cost_estimate_inr: Optional[float] = Field(None, ge=0, description="Total estimated cost in INR")


class AIExplanation(BaseModel):
    """AI-generated explanation for crop recommendation."""
    summary_hi: Optional[str] = Field(None, description="Summary in Hindi")
    summary_en: str = Field(..., description="Summary in English")
    irrigation_advice_hi: Optional[str] = Field(None, description="Irrigation advice in Hindi")
    irrigation_advice_en: str = Field(..., description="Irrigation advice in English")
    fertilizer_plan: FertilizerPlan = Field(..., description="Fertilizer application plan")
    key_benefits: Optional[List[str]] = Field(None, description="Key benefits of recommended crop")
    risk_factors: Optional[List[str]] = Field(None, description="Potential risk factors")


class RecommendationResponse(BaseModel):
    """Response model for crop recommendation."""
    top_crops: List[CropResult] = Field(..., min_items=1, max_items=3, description="Top 3 crop recommendations")
    ai_explanation: AIExplanation = Field(..., description="AI-generated explanation")
    model_version: str = Field(..., description="ML model version used")
    inference_time_ms: float = Field(..., ge=0, description="Inference time in milliseconds")
    cached: bool = Field(..., description="Whether result was retrieved from cache")
    request_id: Optional[str] = Field(None, description="Unique request identifier")
    timestamp: Optional[str] = Field(None, description="Response timestamp")


class IrrigationRequest(BaseModel):
    """Request model for irrigation suggestion."""
    soil: SoilInput = Field(..., description="Soil analysis data")
    crop: str = Field(..., description="Crop name")
    lat: float = Field(..., ge=6.0, le=38.0, description="Latitude in India")
    lng: float = Field(..., ge=68.0, le=97.0, description="Longitude in India")
    season: Optional[SeasonEnum] = Field(None, description="Growing season")
    area_acres: Optional[float] = Field(None, gt=0, le=1000, description="Farm area in acres")


class IrrigationSchedule(BaseModel):
    """Irrigation schedule details."""
    frequency: str = Field(..., description="Irrigation frequency (e.g., 'every 2 days')")
    duration_hours: float = Field(..., ge=0, description="Duration per irrigation in hours")
    best_time: str = Field(..., description="Best time of day for irrigation")
    weekly_schedule: List[str] = Field(..., description="Weekly irrigation schedule")
    water_saving_tip_hi: Optional[str] = Field(None, description="Water saving tip in Hindi")
    water_saving_tip_en: str = Field(..., description="Water saving tip in English")
    estimated_water_cubic_meters: Optional[float] = Field(None, ge=0, description="Estimated water usage per irrigation")


class IrrigationResponse(BaseModel):
    """Response model for irrigation suggestion."""
    irrigation_schedule: IrrigationSchedule = Field(..., description="Irrigation schedule details")
    crop_specific_needs: Dict[str, Any] = Field(..., description="Crop-specific water requirements")
    weather_adjusted: bool = Field(..., description="Whether schedule was adjusted for weather")
    cached: bool = Field(..., description="Whether result was retrieved from cache")
    inference_time_ms: float = Field(..., ge=0, description="Inference time in milliseconds")


class DailyTipCategory(str, Enum):
    """Categories for daily farming tips."""
    IRRIGATION = "irrigation"
    FERTILIZER = "fertilizer"
    PEST_CONTROL = "pest_control"
    WEATHER = "weather"
    HARVESTING = "harvesting"
    SOIL_HEALTH = "soil_health"
    GENERAL = "general"


class DailyTip(BaseModel):
    """Daily farming tip."""
    tip_hi: Optional[str] = Field(None, description="Tip in Hindi")
    tip_en: str = Field(..., description="Tip in English")
    category: DailyTipCategory = Field(..., description="Tip category")
    priority: Literal["low", "medium", "high"] = Field(..., description="Tip priority")
    actionable: bool = Field(True, description="Whether tip is actionable")
    valid_until: Optional[str] = Field(None, description="Tip validity period")


class DailyTipsResponse(BaseModel):
    """Response model for daily tips."""
    tips: List[DailyTip] = Field(..., min_items=1, max_items=5, description="Daily farming tips")
    user_location: Optional[str] = Field(None, description="User's location context")
    weather_context: Optional[Dict[str, Any]] = Field(None, description="Current weather context")
    cached: bool = Field(..., description="Whether tips were retrieved from cache")
    generated_at: str = Field(..., description="Generation timestamp")


class RecommendationHistory(BaseModel):
    """Historical recommendation record."""
    id: str = Field(..., description="Recommendation ID")
    user_id: str = Field(..., description="User ID")
    created_at: str = Field(..., description="Creation timestamp")
    soil_data: SoilInput = Field(..., description="Soil data used")
    season: SeasonEnum = Field(..., description="Season")
    location: Dict[str, float] = Field(..., description="Location coordinates")
    top_crop: str = Field(..., description="Top recommended crop")
    confidence: float = Field(..., description="Confidence percentage")
    feedback: Optional[Dict[str, Any]] = Field(None, description="User feedback if any")
    was_helpful: Optional[bool] = Field(None, description="Whether recommendation was helpful")


class FeedbackRequest(BaseModel):
    """Request model for recommendation feedback."""
    was_helpful: bool = Field(..., description="Whether recommendation was helpful")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1-5")
    comment: Optional[str] = Field(None, max_length=500, description="Optional comment")
    implemented_crop: Optional[str] = Field(None, description="Crop actually implemented")
    actual_yield: Optional[float] = Field(None, ge=0, description="Actual yield achieved")


class FeedbackResponse(BaseModel):
    """Response model for feedback submission."""
    success: bool = Field(..., description="Feedback submission status")
    message: str = Field(..., description="Response message")
    feedback_id: Optional[str] = Field(None, description="Feedback record ID")


class RecommendationHistoryResponse(BaseModel):
    """Response model for recommendation history."""
    recommendations: List[RecommendationHistory] = Field(..., description="Historical recommendations")
    total_count: int = Field(..., description="Total number of recommendations")
    has_more: bool = Field(..., description="Whether more records exist")
    limit: int = Field(..., description="Records limit used")
