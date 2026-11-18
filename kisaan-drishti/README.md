# 🌾 Kisaan Drishti

**A Vision for Every Farmer, A Better Tomorrow for Agriculture.** – a responsive web app for crop-disease detection, weather alerts, smart irrigation, crop recommendation, yield/profit prediction, farm health scoring, community disease alerts and CropFit analytics. Includes farmer login/registration and a "My Farm Details" form with Save and Reset.

## Tech stack
HTML5, CSS3, JavaScript (frontend) · TensorFlow.js / Teachable Machine (disease model) · OpenWeatherMap API · Python + TensorFlow (optional model training)

## Features
1. Disease detection from leaf image + treatment advice
2. Real-time weather alerts (OpenWeatherMap)
3. Smart irrigation recommendation (soil moisture + weather)
4. Crop recommendation form (soil, season, rainfall, temperature) + yield & profit prediction
5. Farm Health Score (Soil + Weather + Disease + Irrigation = /100)
6. Community disease alert (alert when a disease has > 10 reports)
7. CropFit Analytics (best area, time, weather per crop)

## Run locally
Open `login.html` (or `index.html`) in a browser. Register as a new farmer or log in. Demo logins are stored in the browser only.

## Enable real AI / live weather
Edit `config.js`:
- `OPENWEATHER_API_KEY` – free key from openweathermap.org
- `TM_MODEL_URL` – URL of your Teachable Machine image model (see `docs/08_User_Manual.md`)

## Folder structure
```
kisaan-drishti/
├── index.html  style.css  script.js  config.js
├── images/       logo, hero, dashboard, icons/, crops/ (12 crops), samples/ (5 test leaves)
├── data/         sample datasets (CSV)
├── python/       optional model training script
└── docs/         all requirement & project documents
```

## Notes
Crop yield/price values are illustrative; replace with local data. Community alerts are stored in the browser (localStorage); a backend (Firebase/Node) is the planned upgrade.

## Images
All images in `/images` are original illustrations generated for this project (no copyright issues). Replace `hero.jpg` and `samples/` with real farm/leaf photos for a final demo. Use `samples/` to test disease detection.
