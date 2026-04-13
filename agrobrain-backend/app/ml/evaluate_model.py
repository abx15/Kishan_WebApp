"""
AgroBrain AI - Model Evaluation and Visualization
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
from pathlib import Path
import joblib

# Set style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

MODEL_DIR = Path(__file__).parent
MODEL_PATH = MODEL_DIR / "crop_model.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"
ENCODER_PATH = MODEL_DIR / "label_encoder.pkl"
DATA_PATH = "data/Crop_recommendation.csv"


def load_artifacts():
    """Load trained model artifacts."""
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    
    with open(MODEL_DIR / "model_info.json", "r") as f:
        model_info = json.load(f)
    
    return model, scaler, label_encoder, model_info


def load_test_data():
    """Load and prepare test data."""
    df = pd.read_csv(DATA_PATH)
    
    FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    TARGET = "label"
    
    X = df[FEATURES].copy()
    y = df[TARGET].copy()
    
    # Use same label encoder
    _, _, _, label_encoder = load_artifacts()
    y_encoded = label_encoder.transform(y)
    
    # Scale features
    _, scaler, _, _ = load_artifacts()
    X_scaled = scaler.transform(X)
    
    return X_scaled, y_encoded, label_encoder


def plot_confusion_matrix(y_true, y_pred, classes, save_path=None):
    """Plot confusion matrix."""
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=classes, yticklabels=classes)
    plt.title('Confusion Matrix - Crop Classification')
    plt.xlabel('Predicted Crop')
    plt.ylabel('Actual Crop')
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()


def plot_feature_importance(model, features, save_path=None):
    """Plot feature importance."""
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    plt.figure(figsize=(10, 6))
    plt.title('Feature Importance - Crop Recommendation')
    plt.bar(range(len(features)), importances[indices])
    plt.xticks(range(len(features)), [features[i] for i in indices], rotation=45, ha='right')
    plt.xlabel('Features')
    plt.ylabel('Importance')
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()


def plot_prediction_distribution(model, X_test, y_test, label_encoder, save_path=None):
    """Plot distribution of prediction confidences."""
    # Get prediction probabilities
    y_proba = model.predict_proba(X_test)
    y_pred = model.predict(X_test)
    
    # Calculate confidence scores
    confidences = np.max(y_proba, axis=1)
    
    plt.figure(figsize=(12, 8))
    
    # Plot 1: Confidence distribution
    plt.subplot(2, 2, 1)
    plt.hist(confidences, bins=20, alpha=0.7, color='skyblue', edgecolor='black')
    plt.xlabel('Prediction Confidence')
    plt.ylabel('Frequency')
    plt.title('Distribution of Prediction Confidences')
    plt.grid(True, alpha=0.3)
    
    # Plot 2: Correct vs Incorrect confidence
    plt.subplot(2, 2, 2)
    correct_mask = y_pred == y_test
    correct_conf = confidences[correct_mask]
    incorrect_conf = confidences[~correct_mask]
    
    plt.boxplot([correct_conf, incorrect_conf], labels=['Correct', 'Incorrect'])
    plt.ylabel('Confidence')
    plt.title('Confidence: Correct vs Incorrect Predictions')
    plt.grid(True, alpha=0.3)
    
    # Plot 3: Top crop predictions
    plt.subplot(2, 2, 3)
    crop_counts = pd.Series(y_pred).value_counts().head(10)
    crop_names = [label_encoder.inverse_transform([i])[0] for i in crop_counts.index]
    plt.barh(range(len(crop_names)), crop_counts.values, color='lightgreen')
    plt.yticks(range(len(crop_names)), crop_names)
    plt.xlabel('Count')
    plt.title('Top 10 Predicted Crops')
    plt.gca().invert_yaxis()
    
    # Plot 4: Accuracy by confidence threshold
    plt.subplot(2, 2, 4)
    thresholds = np.arange(0.5, 1.0, 0.05)
    accuracies = []
    samples = []
    
    for threshold in thresholds:
        mask = confidences >= threshold
        if mask.sum() > 0:
            acc = (y_pred[mask] == y_test[mask]).mean()
            accuracies.append(acc)
            samples.append(mask.sum())
        else:
            accuracies.append(0)
            samples.append(0)
    
    ax1 = plt.gca()
    ax1.plot(thresholds, accuracies, 'bo-', label='Accuracy')
    ax1.set_xlabel('Confidence Threshold')
    ax1.set_ylabel('Accuracy', color='b')
    ax1.tick_params(axis='y', labelcolor='b')
    ax1.grid(True, alpha=0.3)
    
    ax2 = ax1.twinx()
    ax2.plot(thresholds, samples, 'ro--', label='Sample Count')
    ax2.set_ylabel('Sample Count', color='r')
    ax2.tick_params(axis='y', labelcolor='r')
    
    plt.title('Accuracy vs Confidence Threshold')
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()


def generate_evaluation_report():
    """Generate comprehensive evaluation report."""
    print("=" * 60)
    print("  AgroBrain AI - Model Evaluation Report")
    print("=" * 60)
    
    # Load artifacts and data
    model, scaler, label_encoder, model_info = load_artifacts()
    X, y, _ = load_test_data()
    
    # Make predictions
    y_pred = model.predict(X)
    y_proba = model.predict_proba(X)
    
    # Calculate metrics
    accuracy = (y_pred == y).mean()
    confidences = np.max(y_proba, axis=1)
    
    print(f"\nModel Performance:")
    print(f"  Overall Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"  Average Confidence: {confidences.mean():.4f}")
    print(f"  Number of Classes: {len(label_encoder.classes_)}")
    print(f"  Model Version: {model_info.get('version', 'unknown')}")
    
    # Classification report
    print(f"\nClassification Report:")
    report = classification_report(y, y_pred, target_names=label_encoder.classes_, 
                                  output_dict=True)
    
    # Print per-class metrics
    print(f"{'Crop':<15} {'Precision':<10} {'Recall':<10} {'F1-Score':<10}")
    print("-" * 50)
    for crop in label_encoder.classes_:
        metrics = report[crop]
        print(f"{crop:<15} {metrics['precision']:<10.3f} {metrics['recall']:<10.3f} {metrics['f1-score']:<10.3f}")
    
    # Feature importance
    print(f"\nFeature Importance:")
    features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    for i in indices:
        print(f"  {features[i]:<12}: {importances[i]:.4f}")
    
    # Confidence analysis
    print(f"\nConfidence Analysis:")
    print(f"  High Confidence (>0.9): {(confidences > 0.9).sum()} samples ({(confidences > 0.9).mean()*100:.1f}%)")
    print(f"  Medium Confidence (0.7-0.9): {((confidences >= 0.7) & (confidences <= 0.9)).sum()} samples ({((confidences >= 0.7) & (confidences <= 0.9)).mean()*100:.1f}%)")
    print(f"  Low Confidence (<0.7): {(confidences < 0.7).sum()} samples ({(confidences < 0.7).mean()*100:.1f}%)")
    
    # Error analysis
    error_mask = y_pred != y
    error_rate = error_mask.mean()
    print(f"\nError Analysis:")
    print(f"  Total Errors: {error_mask.sum()} ({error_rate*100:.2f}%)")
    
    if error_mask.sum() > 0:
        error_confidences = confidences[error_mask]
        print(f"  Average Error Confidence: {error_confidences.mean():.4f}")
        print(f"  Max Error Confidence: {error_confidences.max():.4f}")
    
    print("\n" + "=" * 60)
    print("Evaluation Complete!")
    print("=" * 60)
    
    return {
        'accuracy': accuracy,
        'avg_confidence': confidences.mean(),
        'error_rate': error_rate,
        'classification_report': report,
        'feature_importance': dict(zip(features, importances))
    }


def main():
    """Main evaluation function."""
    # Create output directory
    output_dir = Path("app/ml/evaluation")
    output_dir.mkdir(exist_ok=True)
    
    # Load data and model
    model, scaler, label_encoder, model_info = load_artifacts()
    X, y, _ = load_test_data()
    
    # Make predictions
    y_pred = model.predict(X)
    
    # Generate plots
    print("Generating evaluation plots...")
    
    # Confusion Matrix
    plot_confusion_matrix(y, y_pred, label_encoder.classes_, 
                        save_path=output_dir / "confusion_matrix.png")
    
    # Feature Importance
    features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    plot_feature_importance(model, features, 
                           save_path=output_dir / "feature_importance.png")
    
    # Prediction Distribution
    plot_prediction_distribution(model, X, y, label_encoder,
                                save_path=output_dir / "prediction_analysis.png")
    
    # Generate report
    report = generate_evaluation_report()
    
    # Save report
    with open(output_dir / "evaluation_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\nEvaluation artifacts saved to: {output_dir}")
    print("- confusion_matrix.png")
    print("- feature_importance.png") 
    print("- prediction_analysis.png")
    print("- evaluation_report.json")


if __name__ == "__main__":
    main()
