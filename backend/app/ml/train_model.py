"""
AgroBrain AI - Crop Recommendation Model Training
==================================================
Dataset  : Crop Recommendation Dataset (Kaggle)
Model    : XGBoost Classifier
Features : N, P, K, temperature, humidity, ph, rainfall
Target   : crop (22 classes)
Expected : ~99% accuracy
"""

import os
import json
import warnings
from datetime import datetime

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")

# CONFIG
DATA_PATH    = "data/Crop_recommendation.csv"
MODEL_DIR    = "app/ml"
MODEL_PATH   = os.path.join(MODEL_DIR, "crop_model.pkl")
SCALER_PATH  = os.path.join(MODEL_DIR, "scaler.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")
INFO_PATH    = os.path.join(MODEL_DIR, "model_info.json")

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET   = "label"

RANDOM_STATE = 42
TEST_SIZE    = 0.2

XGBOOST_PARAMS = {
    "n_estimators"    : 300,
    "max_depth"       : 6,
    "learning_rate"   : 0.1,
    "subsample"       : 0.8,
    "colsample_bytree": 0.8,
    "use_label_encoder": False,
    "eval_metric"     : "mlogloss",
    "random_state"    : RANDOM_STATE,
    "n_jobs"          : -1,
}


# STEP 1: LOAD DATA
def load_data(path: str) -> pd.DataFrame:
    print(f"\n Loading dataset from: {path}")
    df = pd.read_csv(path)
    print(f"   Shape      : {df.shape}")
    print(f"   Columns    : {list(df.columns)}")
    print(f"   Crops      : {df[TARGET].nunique()} classes")
    print(f"   Null values: {df.isnull().sum().sum()}")
    return df


# STEP 2: PREPROCESS
def preprocess(df: pd.DataFrame):
    print("\n Preprocessing...")

    X = df[FEATURES].copy()
    y = df[TARGET].copy()

    # Label encode target
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    print(f"   Classes    : {list(le.classes_)}")

    # Train/test split (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y_encoded
    )
    print(f"   Train size : {len(X_train)}")
    print(f"   Test size  : {len(X_test)}")

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, scaler, le


# STEP 3: TRAIN MODEL
def train_model(X_train, y_train):
    print("\n Training XGBoost model...")
    print(f"   Params: {XGBOOST_PARAMS}")

    model = XGBClassifier(**XGBOOST_PARAMS)
    model.fit(
        X_train, y_train,
        verbose=False
    )

    print("   Training complete!")
    return model


# STEP 4: EVALUATE
def evaluate_model(model, X_train, X_test, y_train, y_test, le):
    print("\n Evaluating model...")

    # Test accuracy
    y_pred     = model.predict(X_test)
    test_acc   = accuracy_score(y_test, y_pred)
    train_acc  = accuracy_score(y_train, model.predict(X_train))

    print(f"   Train Accuracy : {train_acc * 100:.2f}%")
    print(f"   Test Accuracy  : {test_acc * 100:.2f}%")

    # Cross-validation (5-fold)
    print("\n   Running 5-fold cross-validation...")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    cv_scores = cross_val_score(model, X_test, y_test, cv=cv, scoring="accuracy")
    print(f"   CV Mean  : {cv_scores.mean() * 100:.2f}%")
    print(f"   CV Std   : {cv_scores.std() * 100:.2f}%")

    # Classification report
    print("\n Classification Report:")
    print(classification_report(
        y_test, y_pred,
        target_names=le.classes_
    ))

    # Top feature importances
    fi = pd.Series(
        model.feature_importances_,
        index=FEATURES
    ).sort_values(ascending=False)
    print("\n Feature Importances:")
    for feat, imp in fi.items():
        bar = "" * int(imp * 50)
        print(f"   {feat:12s}: {bar} {imp:.4f}")

    return {
        "test_accuracy"    : round(float(test_acc), 4),
        "train_accuracy"   : round(float(train_acc), 4),
        "cv_mean_accuracy" : round(float(cv_scores.mean()), 4),
        "cv_std"           : round(float(cv_scores.std()), 4),
    }


# STEP 5: SAVE ARTIFACTS
def save_artifacts(model, scaler, le, metrics: dict, df: pd.DataFrame):
    print(f"\n Saving model artifacts to: {MODEL_DIR}/")
    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(model,  MODEL_PATH,   compress=3)
    joblib.dump(scaler, SCALER_PATH,  compress=3)
    joblib.dump(le,     ENCODER_PATH, compress=3)

    model_info = {
        "version"          : "v1.0.0",
        "trained_on"       : datetime.now().isoformat(),
        "dataset_rows"     : int(len(df)),
        "features"         : FEATURES,
        "classes"          : list(le.classes_),
        "num_classes"      : int(le.classes_.shape[0]),
        "test_accuracy"    : metrics["test_accuracy"],
        "train_accuracy"   : metrics["train_accuracy"],
        "cv_mean_accuracy" : metrics["cv_mean_accuracy"],
        "cv_std"           : metrics["cv_std"],
        "xgboost_params"   : XGBOOST_PARAMS,
    }
    with open(INFO_PATH, "w") as f:
        json.dump(model_info, f, indent=2)

    print(f"   crop_model.pkl    saved ({os.path.getsize(MODEL_PATH) // 1024} KB)")
    print(f"   scaler.pkl        saved")
    print(f"   label_encoder.pkl saved")
    print(f"   model_info.json   saved")


# STEP 6: QUICK INFERENCE TEST
def test_inference(model, scaler, le):
    print("\n Quick inference test...")

    # Sample: conditions good for rice
    sample = np.array([[90, 42, 43, 20.8, 82.0, 6.5, 202.9]])
    sample_scaled = scaler.transform(sample)

    proba     = model.predict_proba(sample_scaled)[0]
    top3_idx  = np.argsort(proba)[::-1][:3]

    print("   Input: N=90, P=42, K=43, temp=20.8°C, humidity=82%, pH=6.5, rainfall=202.9mm")
    print("   Top 3 Predictions:")
    for rank, idx in enumerate(top3_idx, 1):
        crop_name = le.classes_[idx]
        conf      = proba[idx] * 100
        print(f"   {rank}. {crop_name:15s}: {conf:.1f}%")


# MAIN
def main():
    print("=" * 55)
    print("  AgroBrain AI - Crop Recommendation Model")
    print("=" * 55)

    # 1. Load
    df = load_data(DATA_PATH)

    # 2. Preprocess
    X_train, X_test, y_train, y_test, scaler, le = preprocess(df)

    # 3. Train
    model = train_model(X_train, y_train)

    # 4. Evaluate
    metrics = evaluate_model(model, X_train, X_test, y_train, y_test, le)

    # 5. Save
    save_artifacts(model, scaler, le, metrics, df)

    # 6. Test
    test_inference(model, scaler, le)

    print("\n" + "=" * 55)
    print(f"  Done! Accuracy: {metrics['test_accuracy'] * 100:.2f}%")
    print("  Artifacts ready for FastAPI integration")
    print("=" * 55)


if __name__ == "__main__":
    main()
