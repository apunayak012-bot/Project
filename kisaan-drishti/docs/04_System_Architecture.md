# 04 – System Architecture & Design

```
 Farmer (browser)
   │
   ├─ Upload leaf image ──► TensorFlow.js model (Teachable Machine / PlantVillage) ──► disease + treatment
   ├─ City / moisture ───► OpenWeatherMap API ──► alerts + irrigation advice
   ├─ Soil, season, rain, temp ► rule-based recommender ──► crops + yield + profit
   ├─ Four scores ───────► Health Score calculator ──► x/100 + status
   └─ Disease reports ───► Community store (localStorage → Firebase) ──► alerts
```

## Layers
1. **Presentation** – `index.html`, `style.css`
2. **Logic** – `script.js` (recommender, scoring, alert rules)
3. **AI** – pre-trained MobileNetV2 / Teachable Machine model
4. **Data** – `data/*.csv`, browser localStorage (prototype)
5. **External** – OpenWeatherMap API

## Data-flow summary
Input → validation → module logic → result card → (optional) community report → alert banner.

## Future architecture
Node/Express or Firebase backend, MongoDB/Firestore database, push notifications (SMS/WhatsApp), IoT soil sensors.
