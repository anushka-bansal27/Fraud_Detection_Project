# Simple Credit Card Fraud Detection API - Beginner Friendly

import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__, static_folder='static', template_folder='templates')
# Enable CORS for all routes (needed for production deployment)
CORS(app)


# -----------------------------
# Load model and preprocessing
# -----------------------------

# Get the project root directory (parent of backend)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'model')

MODEL_PATH = os.path.join(MODEL_DIR, 'fraud_model.pkl')
SCALER_PATH = os.path.join(MODEL_DIR, 'scaler.pkl')
FEATURES_PATH = os.path.join(MODEL_DIR, 'feature_names.pkl')
PCA_PATH = os.path.join(MODEL_DIR, 'pca.pkl')

# Load all preprocessing components and model
print("Loading model and preprocessing components...")
print(f"Model directory: {MODEL_DIR}")
print(f"Checking files...")

# Check if files exist
if not os.path.exists(MODEL_PATH):
    print(f"❌ ERROR: Model file not found at {MODEL_PATH}")
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
if not os.path.exists(SCALER_PATH):
    print(f"❌ ERROR: Scaler file not found at {SCALER_PATH}")
    raise FileNotFoundError(f"Scaler file not found: {SCALER_PATH}")
if not os.path.exists(FEATURES_PATH):
    print(f"❌ ERROR: Features file not found at {FEATURES_PATH}")
    raise FileNotFoundError(f"Features file not found: {FEATURES_PATH}")

try:
    print("Loading model...")
    model = joblib.load(MODEL_PATH)
    print("Loading scaler...")
    scaler = joblib.load(SCALER_PATH)
    print("Loading feature names...")
    feature_names = joblib.load(FEATURES_PATH)
    
    # Load PCA if it exists (it should)
    if os.path.exists(PCA_PATH):
        print("Loading PCA...")
        pca = joblib.load(PCA_PATH)
    else:
        pca = None
        print("⚠️  Warning: PCA file not found. Predictions may be inaccurate.")
    
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    import traceback
    traceback.print_exc()
    raise

# -----------------------------
# Helper function: preprocess
# -----------------------------
def preprocess_input(data):
    """
    Convert input dict to DataFrame with correct feature order,
    then apply scaling and PCA transformation.
    """
    df = pd.DataFrame([data])[feature_names]  # keep correct column order
    scaled = scaler.transform(df)
    
    # Apply PCA if available
    if pca is not None:
        return pca.transform(scaled)
    else:
        return scaled

# -----------------------------
# Routes
# -----------------------------
@app.route('/')
def home():
    return render_template('index.html')  # Make sure index.html is inside backend/templates/


@app.route('/predict', methods=['POST'])
def predict():
    """
    Accept JSON data for a single transaction and return prediction
    Example JSON:
    {
        "Time": 0,
        "V1": -1.36,
        "V2": -0.07,
        ...
        "V28": 0.13,
        "Amount": 149.62
    }
    """
    data = request.get_json()

    # Check if all features exist
    for f in feature_names:
        if f not in data:
            return jsonify({'error': f'Missing feature: {f}'}), 400

    try:
        # Preprocess and predict
        processed = preprocess_input(data)

        # Get main prediction
        prediction = model.predict(processed)[0]

        # Get fraud probability - handle different model types
        probability = 0.0
        
        # Try predict_proba first (works for LogisticRegression, DecisionTree, etc.)
        if hasattr(model, 'predict_proba'):
            try:
                probability = model.predict_proba(processed)[0][1]
            except:
                pass
        
        # If predict_proba didn't work, try decision_function for SVM
        if probability == 0.0 and hasattr(model, 'decision_function'):
            try:
                # decision_function returns distance from decision boundary
                # Convert to probability-like score using sigmoid
                decision_score = model.decision_function(processed)[0]
                # Normalize to 0-1 range using sigmoid
                import numpy as np
                probability = 1 / (1 + np.exp(-decision_score))
                # Clamp to [0, 1]
                probability = max(0.0, min(1.0, probability))
            except:
                # If decision_function also fails, use prediction as probability
                probability = float(prediction)
        
        # Fallback: if prediction is 1 (fraud), set probability to 0.8, else 0.2
        if probability == 0.0:
            probability = 0.8 if prediction == 1 else 0.2

        label = "Fraud" if prediction == 1 else "Legitimate"

        return jsonify({
            'prediction': label,
            'probability': float(probability)
        }), 200

    except Exception as e:
        import traceback
        print(f"Error in prediction: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# -----------------------------
# Run server
# -----------------------------
if __name__ == '__main__':
    # Get port from environment variable (for Render/Heroku) or use default 5000
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print("🚀 Credit Card Fraud Detection API is running...")
    print(f"📍 Server will be available at: http://127.0.0.1:{port}")
    print(f"📍 Or: http://localhost:{port}")
    app.run(debug=debug, host='0.0.0.0', port=port)
