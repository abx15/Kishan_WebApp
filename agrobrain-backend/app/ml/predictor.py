"""
AgroBrain AI - Crop Predictor (Runtime Inference)
Used inside FastAPI app - model loaded ONCE at startup.
"""

import json
import hashlib
import numpy as np
import joblib
from pathlib import Path
from loguru import logger

MODEL_DIR    = Path(__file__).parent
MODEL_PATH   = MODEL_DIR / "crop_model.pkl"
SCALER_PATH  = MODEL_DIR / "scaler.pkl"
ENCODER_PATH = MODEL_DIR / "label_encoder.pkl"
INFO_PATH    = MODEL_DIR / "model_info.json"

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Expected yield lookup (ton/ha) - approximate values
YIELD_LOOKUP = {
    "rice"       : 4.2, "maize"      : 3.8, "chickpea"   : 1.2,
    "kidneybeans": 1.5, "pigeonpeas" : 1.0, "mothbeans"  : 0.8,
    "mungbean"   : 1.1, "blackgram"  : 1.0, "lentil"     : 1.3,
    "pomegranate": 12.0,"banana"     : 40.0,"mango"      : 10.0,
    "grapes"     : 15.0,"watermelon" : 25.0,"muskmelon"  : 18.0,
    "apple"      : 12.0,"orange"     : 14.0,"papaya"     : 35.0,
    "coconut"    : 8.0, "cotton"     : 2.0, "jute"       : 2.5,
    "coffee"     : 1.8,
}


class CropPredictor:
    """
    Loads XGBoost crop recommendation model once at startup.
    Provides async-compatible predict() method for FastAPI.
    """

    def __init__(self):
        self.model         = None
        self.scaler        = None
        self.label_encoder = None
        self.model_info    = {}
        self._loaded       = False

    def load(self):
        """Call once at FastAPI startup via lifespan."""
        try:
            self.model         = joblib.load(MODEL_PATH)
            self.scaler        = joblib.load(SCALER_PATH)
            self.label_encoder = joblib.load(ENCODER_PATH)

            with open(INFO_PATH, "r") as f:
                self.model_info = json.load(f)

            self._loaded = True
            logger.info(
                f"CropPredictor loaded | "
                f"version={self.model_info.get('version')} | "
                f"accuracy={self.model_info.get('test_accuracy')}"
            )
        except Exception as e:
            logger.error(f"CropPredictor load failed: {e}")
            raise RuntimeError(f"ML model load failed: {e}")

    def predict(
        self,
        N: float,
        P: float,
        K: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float,
        top_n: int = 3,
    ) -> list[dict]:
        """
        Predict top N crops for given soil + weather conditions.

        Returns:
            list of dicts:
            [
              { rank, crop, confidence_pct, expected_yield_ton_ha, suitability_score },
              ...
            ]
        """
        if not self._loaded:
            raise RuntimeError("Model not loaded. Call load() first.")

        # Build feature array
        features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])

        # Scale
        features_scaled = self.scaler.transform(features)

        # Predict probabilities
        probabilities = self.model.predict_proba(features_scaled)[0]

        # Get top N indices
        top_indices = np.argsort(probabilities)[::-1][:top_n]

        results = []
        for rank, idx in enumerate(top_indices, start=1):
            crop_name = self.label_encoder.classes_[idx]
            confidence = float(probabilities[idx])
            results.append({
                "rank"                 : rank,
                "crop"                 : crop_name,
                "confidence_pct"       : round(confidence * 100, 2),
                "expected_yield_ton_ha": YIELD_LOOKUP.get(crop_name, 2.0),
                "suitability_score"    : round(confidence, 4),
            })

        logger.debug(
            f"Prediction | top_crop={results[0]['crop']} | "
            f"confidence={results[0]['confidence_pct']}%"
        )
        return results

    def get_cache_key(
        self,
        N: float, P: float, K: float,
        ph: float, season: str
    ) -> str:
        """
        Generate Redis cache key for soil+season combo.
        Round to nearest 5 to avoid cache fragmentation.
        """
        N_r  = round(N  / 5) * 5
        P_r  = round(P  / 5) * 5
        K_r  = round(K  / 5) * 5
        ph_r = round(ph, 1)

        raw = f"{N_r}:{P_r}:{K_r}:{ph_r}:{season}"
        h   = hashlib.md5(raw.encode()).hexdigest()[:12]
        return f"reco:{h}"

    @property
    def version(self) -> str:
        return self.model_info.get("version", "unknown")

    @property
    def accuracy(self) -> float:
        return self.model_info.get("test_accuracy", 0.0)


# Singleton instance - import this in FastAPI app
crop_predictor = CropPredictor()
