# 08 – User Manual & Setup

## Quick start
Open `index.html` in a browser (demo mode).

## Use the features
1. **Disease:** tap *Upload Image*, choose a leaf photo, read the result, optionally *Report to community* (enter Farmer ID + Village first).
2. **Weather/Irrigation:** type city, moisture %, crop → *Check Weather*.
3. **Crops:** fill soil, season, rainfall, temperature, acres → *Recommend*.
4. **Health:** move sliders (auto-filled after a weather check).
5. **Alerts:** submit reports; alert shows when a disease has > 10 reports.
6. **CropFit:** filter by season to compare profit.

## Enable the real disease model (Teachable Machine)
1. Go to teachablemachine.withgoogle.com → Image Project.
2. Create classes (e.g. Brown Spot, Leaf Blight, Powdery Mildew, Leaf Rust, Healthy) and upload PlantVillage images.
3. Train → Export → *Upload my model* → copy the shareable link.
4. Paste it into `config.js` as `TM_MODEL_URL` (keep the trailing `/`).
5. Class names must match keys in `TREATMENTS` in `script.js` to show treatments.

## Enable live weather
Create a free OpenWeatherMap account, copy the API key into `config.js`.
Do not publish your key in a public repository.

## Deploy
Push the folder to GitHub → Settings → Pages → deploy from `main`.

## Sample images
`images/samples/` has five test leaves (healthy, brown spot, leaf blight, powdery mildew, leaf rust). Click them in the Disease section to try the detector without your own photo.
