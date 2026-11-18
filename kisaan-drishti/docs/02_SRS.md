# 02 – Software Requirements Specification (SRS)

## 1. Introduction
Purpose: define the functional and non-functional requirements of Kisaan Drishti.
Product: browser-based web application (HTML/CSS/JS) with optional Python model training.

## 2. User Classes
Farmer (main), Agriculture Officer (views alerts), Admin (maintains crop data).

## 3. Functional Requirements
### FR1 – Disease Detection
- FR1.1 System shall provide an **Upload Image** button for a leaf photo.
- FR1.2 System shall classify the image with a pre-trained model (TensorFlow / Teachable Machine / PlantVillage).
- FR1.3 System shall show disease name, confidence and treatment suggestion.
- FR1.4 User may report a detected disease to the community.

### FR2 – Weather Alerts
- FR2.1 System shall fetch current weather via OpenWeatherMap or WeatherAPI.
- FR2.2 System shall raise alerts for heat, frost, strong wind, heavy rain, high humidity.

### FR3 – Crop Recommendation
- FR3.1 Form inputs: Soil Type, Season, Rainfall, Temperature (+ land area).
- FR3.2 System shall return top-3 suitable crops with match %.
- FR3.3 System shall estimate yield, revenue, cost and profit.

### FR4 – Farm Health Score
Health Score = Soil + Weather + Disease + Irrigation (total 100).
Example from brief: Soil 25 + Weather 20 + Disease 15 + Irrigation 20 = **80/100 → GOOD**.
Status bands: ≥ 75 GOOD, 50–74 AVERAGE, < 50 POOR.

### FR5 – Community Disease Alert
- Report fields: Farmer ID, Village, Disease, Date.
- If reports of a disease > 10, show: “Brown Spot detected in 12 farms. Risk Level: High.”

### FR6 – CropFit Analytics
- Show best area, time (season), weather and profit for each crop; filter by season.

### FR7 – Smart Irrigation
- Compare soil moisture with crop water need and weather; output Irrigate / Skip.

## 4. Non-Functional Requirements
| ID | Requirement |
|---|---|
| NFR1 | Responsive on mobile (≥ 360 px) and desktop |
| NFR2 | Page load < 3 s on 4G; works offline in demo mode |
| NFR3 | No API keys committed to public repos |
| NFR4 | User input escaped to prevent XSS |
| NFR5 | Dark mode, readable fonts, large touch targets |
| NFR6 | Browsers: latest Chrome, Edge, Firefox, Safari |

## 5. External Interfaces
OpenWeatherMap REST API · TensorFlow.js / Teachable Machine model · Browser localStorage (prototype storage).

## 6. Constraints
Free API rate limits; model accuracy depends on training data and photo quality.
