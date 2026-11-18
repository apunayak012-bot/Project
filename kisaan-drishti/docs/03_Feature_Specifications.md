# 03 – Feature Specifications ("How to Add")

| # | Feature | How it is added | Inputs | Output |
|---|---|---|---|---|
| 1 | Disease Detection | Upload Image button → pre-trained model (TensorFlow, Teachable Machine, PlantVillage) | Leaf image | Disease, confidence, treatment |
| 2 | Weather Alerts | Free API: OpenWeatherMap / WeatherAPI | City | Temp, humidity, wind, rain, alerts |
| 3 | Crop Recommendation | Form: Soil Type, Season, Rainfall, Temperature | Form values | Top-3 crops, yield, profit |
| 4 | Farm Health Score | Weighted sum of four scores | Soil, Weather, Disease, Irrigation scores | x/100 + status |
| 5 | Community Disease Alert | Report table; count > 10 → alert | Farmer ID, Village, Disease, Date | Alert + risk level |
| 6 | CropFit Analytics | Crop knowledge table + chart | Season filter | Best area, time, weather, profit |

## Scoring rule (Feature 4)
Brief example weights (25+20+15+20 = 80) do not reach 100, so the prototype uses maximums **Soil 30, Weather 25, Disease 20, Irrigation 25 = 100**. Adjust in `index.html` slider limits if your mentor wants the original weights.

## Alert risk levels (Feature 5)
- Reports > 10 → **High**
- Reports > 5 → **Medium**
- Otherwise no alert.

## Irrigation targets (Feature 2/7)
Water need High → 60 % moisture, Medium → 45 %, Low → 30 %. Skip irrigation if rain > 5 mm.
