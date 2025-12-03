# Credit Card Fraud Detection Project

A machine learning-based web application for detecting fraudulent credit card transactions.

## Project Structure

```
fraud_detection_project/
├── backend/              # Flask web application
│   ├── app.py           # Main Flask application
│   ├── static/          # CSS and JavaScript files
│   └── templates/       # HTML templates
├── model/               # ML model files and training script
│   ├── training.py      # Model training script
│   ├── fraud_model.pkl  # Trained model
│   ├── scaler.pkl       # Feature scaler
│   └── feature_names.pkl # Feature names
├── data/                # Dataset
│   └── creditcard.csv   # Credit card transaction data
├── venv/                # Python virtual environment
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Setup Instructions

1. **Create and activate virtual environment** (if not already done):
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the model** (if model files don't exist):
   ```bash
   python model/training.py
   ```

4. **Run the Flask application**:
   ```bash
   python backend/app.py
   ```

5. **Access the web interface**:
   Open your browser and navigate to `http://localhost:5000`

## Features

- **Web Interface**: User-friendly HTML form for transaction input
- **Real-time Prediction**: Instant fraud detection analysis
- **Probability Score**: Shows the probability of fraud
- **Sample Data**: Load sample transaction data for testing

## API Endpoints

- `GET /` - Home page with transaction form
- `POST /predict` - Predict fraud for a transaction
  - Request body: JSON with transaction features (Time, V1-V28, Amount)
  - Response: JSON with prediction and probability

## Model Information

The model uses:
- **Feature Scaling**: StandardScaler
- **Dimensionality Reduction**: PCA (95% variance)
- **Class Balancing**: Undersampling
- **Algorithms**: Logistic Regression, Decision Tree, SVM (best model selected)

## Requirements

- Python 3.8+
- Flask 2.3.3
- scikit-learn 1.3.0
- pandas 2.0.3
- numpy 1.24.3
- joblib 1.3.2

## Notes

- The dataset should be placed in the `data/` folder
- Model files are saved in the `model/` folder after training
- All paths are relative, making the project portable

## Deployment to Render

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create a new Web Service on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: fraud-detection-api (or your choice)
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn backend.app:app --bind 0.0.0.0:$PORT`
     - **Python Version**: 3.10.0

3. **Important**: Make sure all model files (`.pkl` files in `model/` folder) are committed to Git, as they're needed for the application to run.

4. **Environment Variables** (optional):
   - `FLASK_ENV=production` (automatically set by Render)
   - `PORT` (automatically set by Render)

5. **Deploy**: Click "Create Web Service" and wait for deployment to complete.

The application will be available at: `https://your-app-name.onrender.com`

