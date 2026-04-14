#!/usr/bin/env python3
"""
Crop Recommendation Model Training Script
Trains a machine learning model using Crop_recommendation.csv data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train_crop_model():
    print("Starting crop recommendation model training...")
    
    # Load the dataset
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'Crop_recommendation.csv')
    print(f"Loading data from: {data_path}")
    
    try:
        df = pd.read_csv(data_path)
        print(f"Dataset loaded successfully! Shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        print(f"Target crops: {df['label'].unique()}")
        print(f"Number of crop types: {df['label'].nunique()}")
        
        # Prepare features and target
        X = df.drop('label', axis=1)
        y = df['label']
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set size: {X_train.shape[0]}")
        print(f"Test set size: {X_test.shape[0]}")
        
        # Train Random Forest model
        print("Training Random Forest model...")
        model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2
        )
        
        model.fit(X_train, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Calculate accuracy
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        
        # Print detailed classification report
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': X.columns,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nFeature Importance:")
        print(feature_importance)
        
        # Save the model
        model_dir = os.path.join(os.path.dirname(__file__), 'models')
        os.makedirs(model_dir, exist_ok=True)
        
        model_path = os.path.join(model_dir, 'crop_recommendation_model.pkl')
        joblib.dump(model, model_path)
        print(f"\nModel saved successfully at: {model_path}")
        
        # Save feature columns for prediction
        feature_columns_path = os.path.join(model_dir, 'feature_columns.pkl')
        joblib.dump(X.columns.tolist(), feature_columns_path)
        print(f"Feature columns saved at: {feature_columns_path}")
        
        # Test with a sample prediction
        print("\nTesting with sample data...")
        sample_data = X_test.iloc[0:1]
        prediction = model.predict(sample_data)
        prediction_proba = model.predict_proba(sample_data)
        
        print(f"Sample input: {sample_data.iloc[0].to_dict()}")
        print(f"Predicted crop: {prediction[0]}")
        
        # Get top 3 predictions with probabilities
        crop_classes = model.classes_
        proba_dict = dict(zip(crop_classes, prediction_proba[0]))
        top_3_crops = sorted(proba_dict.items(), key=lambda x: x[1], reverse=True)[:3]
        
        print("Top 3 crop recommendations:")
        for i, (crop, prob) in enumerate(top_3_crops, 1):
            print(f"{i}. {crop}: {prob:.4f} ({prob*100:.2f}%)")
        
        return model, accuracy
        
    except Exception as e:
        print(f"Error during training: {str(e)}")
        return None, None

if __name__ == "__main__":
    model, accuracy = train_crop_model()
    if model is not None:
        print(f"\nTraining completed successfully! Model accuracy: {accuracy:.4f}")
    else:
        print("\nTraining failed!")
