"""
Crop prediction ML module for AgroBrain AI.

This module contains the CropPredictor class that loads trained ML models
and provides crop recommendations based on soil and weather data.
"""

import hashlib
import json
import logging
from typing import Dict, List, Any, Optional
import joblib
import numpy as np
from sklearn.preprocessing import LabelEncoder

logger = logging.getLogger(__name__)


class CropPredictor:
    """
    ML-based crop recommendation predictor.
    
    Loads trained models at startup and provides predictions with confidence scores.
    """
    
    def __init__(self, model_path: str = "app/ml/models/crop_model.pkl", 
                 scaler_path: str = "app/ml/models/scaler.pkl",
                 encoder_path: str = "app/ml/models/label_encoder.pkl"):
        """
        Initialize the predictor with trained models.
        
        Args:
            model_path: Path to the trained XGBoost model
            scaler_path: Path to the feature scaler
            encoder_path: Path to the label encoder
        """
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.model_info = None
        self.feature_names = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']
        
        try:
            # Load models
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            self.label_encoder = joblib.load(encoder_path)
            
            # Load model info if available
            try:
                with open("app/ml/models/model_info.json", 'r') as f:
                    self.model_info = json.load(f)
            except FileNotFoundError:
                self.model_info = {"version": "unknown", "accuracy": "unknown"}
            
            logger.info(f"CropPredictor initialized successfully")
            logger.info(f"Model version: {self.model_info.get('version', 'unknown')}")
            logger.info(f"Model accuracy: {self.model_info.get('accuracy', 'unknown')}")
            logger.info(f"Feature names: {self.feature_names}")
            logger.info(f"Number of crop classes: {len(self.label_encoder.classes_)}")
            
        except Exception as e:
            logger.error(f"Failed to initialize CropPredictor: {str(e)}")
            raise
    
    def predict(self, soil_data: Dict[str, Any], weather_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Predict top 3 crop recommendations based on soil and weather data.
        
        Args:
            soil_data: Dict containing N, P, K, ph values
            weather_data: Dict containing temperature, humidity, rainfall values
            
        Returns:
            List of top 3 crop recommendations with confidence scores
        """
        if not all([self.model, self.scaler, self.label_encoder]):
            raise RuntimeError("Models not properly loaded")
        
        try:
            # Build feature array in correct order: [N, P, K, ph, temperature, humidity, rainfall]
            features = np.array([[
                soil_data['N'],
                soil_data['P'], 
                soil_data['K'],
                soil_data['ph'],
                weather_data['temperature'],
                weather_data['humidity'],
                weather_data['rainfall']
            ]])
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Get prediction probabilities
            probabilities = self.model.predict_proba(features_scaled)[0]
            
            # Get top 3 predictions
            top_indices = np.argsort(probabilities)[::-1][:3]
            
            results = []
            for rank, idx in enumerate(top_indices, 1):
                crop_name = self.label_encoder.inverse_transform([idx])[0]
                confidence = probabilities[idx] * 100  # Convert to percentage
                suitability_score = min(100, confidence + (rank - 1) * 5)  # Adjusted score
                
                results.append({
                    'rank': rank,
                    'crop': crop_name,
                    'confidence_pct': round(confidence, 2),
                    'suitability_score': round(suitability_score, 2)
                })
            
            logger.info(f"Prediction completed. Top crop: {results[0]['crop']} ({results[0]['confidence_pct']}%)")
            return results
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise
    
    def get_cache_key(self, soil_data: Dict[str, Any], season: str = "") -> str:
        """
        Generate cache key based on soil data and season.
        
        Args:
            soil_data: Dict containing soil N, P, K, ph values
            season: Growing season (kharif, rabi, zaid)
            
        Returns:
            MD5 hash string for caching
        """
        # Round NPK values to nearest 5 to avoid cache fragmentation
        cache_data = {
            'N': round(soil_data.get('N', 0) / 5) * 5,
            'P': round(soil_data.get('P', 0) / 5) * 5,
            'K': round(soil_data.get('K', 0) / 5) * 5,
            'ph': round(soil_data.get('ph', 7), 1),
            'season': season.lower()
        }
        
        # Create hash
        cache_string = json.dumps(cache_data, sort_keys=True)
        hash_hex = hashlib.md5(cache_string.encode()).hexdigest()
        
        return f"reco:{hash_hex}"
    
    def get_model_info(self) -> Dict[str, Any]:
        """
        Get information about the loaded model.
        
        Returns:
            Dict containing model metadata
        """
        if not self.model_info:
            return {"error": "Model info not available"}
        
        return {
            **self.model_info,
            'feature_names': self.feature_names,
            'crop_classes': list(self.label_encoder.classes_),
            'num_classes': len(self.label_encoder.classes_)
        }
    
    def is_healthy(self) -> bool:
        """
        Check if the predictor is properly initialized and ready for predictions.
        
        Returns:
            True if all models are loaded, False otherwise
        """
        return all([self.model is not None, 
                   self.scaler is not None, 
                   self.label_encoder is not None])


# Fallback rule-based predictions when ML model is unavailable
def get_fallback_recommendations(soil_data: Dict[str, Any], weather_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Simple rule-based crop recommendations as fallback.
    
    Args:
        soil_data: Dict containing soil N, P, K, ph values
        weather_data: Dict containing temperature, humidity, rainfall values
        
    Returns:
        List of crop recommendations with basic confidence scores
    """
    ph = soil_data.get('ph', 7)
    temp = weather_data.get('temperature', 25)
    rainfall = weather_data.get('rainfall', 100)
    
    # Simple rule-based mapping
    recommendations = []
    
    if 6.0 <= ph <= 7.5 and 20 <= temp <= 30 and rainfall >= 100:
        recommendations.append({
            'rank': 1,
            'crop': 'Wheat',
            'confidence_pct': 75.0,
            'suitability_score': 75.0
        })
    
    if 5.5 <= ph <= 7.0 and 25 <= temp <= 35 and rainfall >= 150:
        recommendations.append({
            'rank': len(recommendations) + 1,
            'crop': 'Rice',
            'confidence_pct': 70.0,
            'suitability_score': 70.0
        })
    
    if 6.0 <= ph <= 8.0 and 20 <= temp <= 35 and rainfall >= 80:
        recommendations.append({
            'rank': len(recommendations) + 1,
            'crop': 'Maize',
            'confidence_pct': 65.0,
            'suitability_score': 65.0
        })
    
    # Fill up to 3 recommendations
    fallback_crops = ['Cotton', 'Sugarcane', 'Pulses']
    for crop in fallback_crops:
        if len(recommendations) >= 3:
            break
        recommendations.append({
            'rank': len(recommendations) + 1,
            'crop': crop,
            'confidence_pct': 50.0,
            'suitability_score': 50.0
        })
    
    return recommendations[:3]
