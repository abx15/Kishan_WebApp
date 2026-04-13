"""
Training script for Crop Recommendation Model.

This script trains an XGBoost classifier on the Crop Recommendation Dataset
and saves the trained model, scaler, and label encoder for use in production.
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import xgboost as xgb
import joblib

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def load_dataset(csv_path: str = "Crop_Recommendation_Dataset.csv") -> pd.DataFrame:
    """
    Load the crop recommendation dataset.
    
    Args:
        csv_path: Path to the CSV file
        
    Returns:
        Loaded DataFrame
    """
    try:
        # Try to download from a public source if file doesn't exist
        if not os.path.exists(csv_path):
            logger.info("Dataset not found locally. You can download it from:")
            logger.info("https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset")
            logger.info("Or use the provided sample data generator")
            raise FileNotFoundError(f"Dataset file {csv_path} not found")
        
        df = pd.read_csv(csv_path)
        logger.info(f"Dataset loaded successfully. Shape: {df.shape}")
        return df
        
    except Exception as e:
        logger.error(f"Failed to load dataset: {str(e)}")
        raise


def generate_sample_dataset(csv_path: str = "Crop_Recommendation_Dataset.csv") -> pd.DataFrame:
    """
    Generate a sample crop recommendation dataset for testing.
    
    Args:
        csv_path: Path to save the generated dataset
        
    Returns:
        Generated DataFrame
    """
    logger.info("Generating sample crop recommendation dataset...")
    
    # Define crop types and their typical requirements
    crop_data = {
        'Rice': {'N': (80, 120), 'P': (30, 60), 'K': (30, 60), 'ph': (5.5, 7.0), 'temp': (22, 32), 'humidity': (70, 90), 'rainfall': (150, 300)},
        'Wheat': {'N': (70, 110), 'P': (25, 50), 'K': (25, 50), 'ph': (6.0, 7.5), 'temp': (15, 25), 'humidity': (50, 70), 'rainfall': (50, 150)},
        'Maize': {'N': (90, 130), 'P': (35, 65), 'K': (35, 65), 'ph': (5.8, 7.2), 'temp': (18, 30), 'humidity': (60, 80), 'rainfall': (80, 200)},
        'Cotton': {'N': (60, 100), 'P': (20, 45), 'K': (20, 45), 'ph': (6.0, 8.0), 'temp': (20, 32), 'humidity': (40, 60), 'rainfall': (50, 120)},
        'Sugarcane': {'N': (100, 150), 'P': (40, 70), 'K': (40, 70), 'ph': (6.0, 7.5), 'temp': (20, 30), 'humidity': (65, 85), 'rainfall': (120, 250)},
        'Pulses': {'N': (20, 50), 'P': (20, 40), 'K': (20, 40), 'ph': (6.0, 7.0), 'temp': (18, 28), 'humidity': (45, 65), 'rainfall': (40, 100)},
        'Millets': {'N': (40, 80), 'P': (15, 35), 'K': (15, 35), 'ph': (6.5, 8.0), 'temp': (25, 35), 'humidity': (30, 50), 'rainfall': (30, 80)},
        'Barley': {'N': (50, 90), 'P': (20, 40), 'K': (20, 40), 'ph': (6.5, 8.0), 'temp': (12, 22), 'humidity': (40, 60), 'rainfall': (30, 100)},
        'Groundnut': {'N': (40, 80), 'P': (25, 50), 'K': (25, 50), 'ph': (5.5, 7.0), 'temp': (22, 32), 'humidity': (50, 70), 'rainfall': (80, 150)},
        'Soybean': {'N': (30, 70), 'P': (20, 45), 'K': (20, 45), 'ph': (6.0, 7.5), 'temp': (20, 30), 'humidity': (55, 75), 'rainfall': (70, 140)},
        'Mustard': {'N': (60, 100), 'P': (25, 50), 'K': (25, 50), 'ph': (6.0, 7.5), 'temp': (15, 25), 'humidity': (40, 60), 'rainfall': (40, 100)},
        'Tomato': {'N': (80, 120), 'P': (30, 60), 'K': (30, 60), 'ph': (6.0, 7.0), 'temp': (18, 28), 'humidity': (60, 80), 'rainfall': (60, 120)},
        'Potato': {'N': (100, 150), 'P': (40, 70), 'K': (40, 70), 'ph': (5.0, 6.5), 'temp': (15, 25), 'humidity': (70, 90), 'rainfall': (80, 150)},
        'Onion': {'N': (70, 110), 'P': (25, 50), 'K': (25, 50), 'ph': (6.0, 7.0), 'temp': (15, 25), 'humidity': (60, 80), 'rainfall': (50, 100)},
        'Garlic': {'N': (60, 100), 'P': (20, 45), 'K': (20, 45), 'ph': (6.0, 7.5), 'temp': (12, 22), 'humidity': (50, 70), 'rainfall': (40, 80)},
        'Cabbage': {'N': (90, 130), 'P': (35, 65), 'K': (35, 65), 'ph': (6.0, 7.0), 'temp': (15, 25), 'humidity': (65, 85), 'rainfall': (70, 140)},
        'Cauliflower': {'N': (80, 120), 'P': (30, 60), 'K': (30, 60), 'ph': (6.0, 7.0), 'temp': (15, 25), 'humidity': (60, 80), 'rainfall': (60, 120)},
        'Chilli': {'N': (70, 110), 'P': (25, 50), 'K': (25, 50), 'ph': (6.0, 7.5), 'temp': (20, 30), 'humidity': (55, 75), 'rainfall': (80, 150)},
        'Brinjal': {'N': (80, 120), 'P': (30, 60), 'K': (30, 60), 'ph': (6.0, 7.0), 'temp': (22, 32), 'humidity': (65, 85), 'rainfall': (100, 180)},
        'Peas': {'N': (40, 80), 'P': (20, 40), 'K': (20, 40), 'ph': (6.0, 7.0), 'temp': (12, 20), 'humidity': (50, 70), 'rainfall': (40, 80)},
        'Lentil': {'N': (30, 60), 'P': (15, 35), 'K': (15, 35), 'ph': (6.0, 7.5), 'temp': (18, 25), 'humidity': (45, 65), 'rainfall': (35, 70)},
        'Gram': {'N': (25, 55), 'P': (15, 30), 'K': (15, 30), 'ph': (6.5, 8.0), 'temp': (20, 30), 'humidity': (40, 60), 'rainfall': (30, 60)}
    }
    
    data = []
    samples_per_crop = 100
    
    for crop, params in crop_data.items():
        for _ in range(samples_per_crop):
            row = {
                'N': np.random.uniform(params['N'][0], params['N'][1]),
                'P': np.random.uniform(params['P'][0], params['P'][1]),
                'K': np.random.uniform(params['K'][0], params['K'][1]),
                'ph': np.random.uniform(params['ph'][0], params['ph'][1]),
                'temperature': np.random.uniform(params['temp'][0], params['temp'][1]),
                'humidity': np.random.uniform(params['humidity'][0], params['humidity'][1]),
                'rainfall': np.random.uniform(params['rainfall'][0], params['rainfall'][1]),
                'label': crop
            }
            data.append(row)
    
    df = pd.DataFrame(data)
    df.to_csv(csv_path, index=False)
    logger.info(f"Sample dataset generated with {len(df)} samples and saved to {csv_path}")
    return df


def preprocess_data(df: pd.DataFrame) -> tuple:
    """
    Preprocess the dataset for training.
    
    Args:
        df: Input DataFrame
        
    Returns:
        Tuple of (X, y, scaler, label_encoder)
    """
    # Separate features and target
    feature_columns = ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall']
    X = df[feature_columns].copy()
    y = df['label'].copy()
    
    # Initialize and fit label encoder
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Initialize and fit scaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    logger.info(f"Data preprocessing completed")
    logger.info(f"Features: {feature_columns}")
    logger.info(f"Number of classes: {len(label_encoder.classes_)}")
    logger.info(f"Classes: {list(label_encoder.classes_)}")
    
    return X_scaled, y_encoded, scaler, label_encoder


def train_model(X_train, y_train, X_test, y_test) -> tuple:
    """
    Train XGBoost classifier.
    
    Args:
        X_train, y_train: Training data
        X_test, y_test: Test data
        
    Returns:
        Tuple of (model, accuracy, classification_report)
    """
    # Initialize XGBoost classifier
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1,
        objective='multi:softprob',
        eval_metric='mlogloss'
    )
    
    # Train the model
    logger.info("Training XGBoost model...")
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    
    logger.info(f"Model training completed")
    logger.info(f"Test Accuracy: {accuracy:.4f}")
    
    return model, accuracy, report


def save_models(model, scaler, label_encoder, model_info: Dict[str, Any], 
                model_dir: str = "app/ml/models"):
    """
    Save trained models and metadata.
    
    Args:
        model: Trained XGBoost model
        scaler: Fitted scaler
        label_encoder: Fitted label encoder
        model_info: Model metadata
        model_dir: Directory to save models
    """
    # Create directory if it doesn't exist
    os.makedirs(model_dir, exist_ok=True)
    
    # Save models
    joblib.dump(model, os.path.join(model_dir, "crop_model.pkl"))
    joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))
    joblib.dump(label_encoder, os.path.join(model_dir, "label_encoder.pkl"))
    
    # Save model info
    with open(os.path.join(model_dir, "model_info.json"), 'w') as f:
        json.dump(model_info, f, indent=2)
    
    logger.info(f"Models saved to {model_dir}")
    logger.info(f"- crop_model.pkl")
    logger.info(f"- scaler.pkl")
    logger.info(f"- label_encoder.pkl")
    logger.info(f"- model_info.json")


def main():
    """Main training pipeline."""
    logger.info("Starting Crop Recommendation Model Training")
    
    # Configuration
    csv_path = "Crop_Recommendation_Dataset.csv"
    model_dir = "app/ml/models"
    
    try:
        # Load or generate dataset
        try:
            df = load_dataset(csv_path)
        except FileNotFoundError:
            logger.info("Generating sample dataset for demonstration...")
            df = generate_sample_dataset(csv_path)
        
        # Preprocess data
        X_scaled, y_encoded, scaler, label_encoder = preprocess_data(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
        )
        
        logger.info(f"Train set size: {X_train.shape[0]}")
        logger.info(f"Test set size: {X_test.shape[0]}")
        
        # Train model
        model, accuracy, report = train_model(X_train, y_train, X_test, y_test)
        
        # Prepare model info
        model_info = {
            'version': '1.0.0',
            'accuracy': round(accuracy, 4),
            'trained_on': datetime.now().isoformat(),
            'features': ['N', 'P', 'K', 'ph', 'temperature', 'humidity', 'rainfall'],
            'classes': list(label_encoder.classes_),
            'num_classes': len(label_encoder.classes_),
            'model_type': 'XGBoostClassifier',
            'hyperparameters': {
                'n_estimators': 200,
                'max_depth': 6,
                'learning_rate': 0.1,
                'random_state': 42
            },
            'dataset_info': {
                'total_samples': len(df),
                'train_samples': len(X_train),
                'test_samples': len(X_test),
                'test_accuracy': round(accuracy, 4)
            }
        }
        
        # Save models
        save_models(model, scaler, label_encoder, model_info, model_dir)
        
        # Print final results
        logger.info("=" * 50)
        logger.info("TRAINING COMPLETED SUCCESSFULLY")
        logger.info("=" * 50)
        logger.info(f"Model Accuracy: {accuracy:.4f}")
        logger.info(f"Number of Crop Classes: {len(label_encoder.classes_)}")
        logger.info(f"Models saved in: {model_dir}")
        logger.info("=" * 50)
        
        return model_info
        
    except Exception as e:
        logger.error(f"Training failed: {str(e)}")
        raise


if __name__ == "__main__":
    main()
