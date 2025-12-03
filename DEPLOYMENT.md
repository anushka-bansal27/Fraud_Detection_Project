# Deployment Checklist for Render

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] No linter errors
- [x] All imports are correct
- [x] No hardcoded paths (all relative)
- [x] CORS enabled for production
- [x] Debug mode controlled by environment variable

### ✅ Required Files
- [x] `Procfile` - for Render deployment
- [x] `render.yaml` - optional Render configuration
- [x] `requirements.txt` - all dependencies listed
- [x] `.gitignore` - excludes unnecessary files but keeps model files

### ✅ Model Files (Must be in Git)
- [x] `model/fraud_model.pkl`
- [x] `model/scaler.pkl`
- [x] `model/feature_names.pkl`
- [x] `model/pca.pkl`

### ✅ Configuration
- [x] Port configuration uses `$PORT` environment variable
- [x] Host set to `0.0.0.0` for production
- [x] Debug mode disabled in production
- [x] Error handling in place

## Render Deployment Steps

1. **Verify Model Files are Committed**:
   ```bash
   git status
   # Make sure model/*.pkl files are listed (not ignored)
   ```

2. **Commit All Changes**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Create Render Web Service**:
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - **Name**: fraud-detection-api
     - **Environment**: Python 3
     - **Region**: Choose closest to you
     - **Branch**: main
     - **Root Directory**: (leave empty)
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn backend.app:app --bind 0.0.0.0:$PORT`
     - **Python Version**: 3.10.0 or 3.11.0

4. **Environment Variables** (Auto-set by Render):
   - `PORT` - automatically set
   - `FLASK_ENV` - set to `production` (optional, handled in code)

5. **Deploy**: Click "Create Web Service"

## Post-Deployment

1. Check build logs for any errors
2. Test the application at: `https://your-app-name.onrender.com`
3. Test the prediction endpoint
4. Monitor logs for any runtime errors

## Troubleshooting

- **Build fails**: Check Python version compatibility
- **Model not found**: Ensure `.pkl` files are committed to Git
- **Port errors**: Verify `$PORT` is used in start command
- **CORS errors**: Already enabled in code
- **Slow responses**: Normal for free tier (spins down after inactivity)

## Notes

- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Model files are ~50KB total, should commit fine to Git
- All paths are relative, so deployment should work on any platform

