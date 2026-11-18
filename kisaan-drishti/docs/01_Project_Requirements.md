# 01 – Project Requirements (Business Requirements Document)

**Project:** Smart AI Farming and Its Management (Kisaan Drishti)

## 1. Problem Statement
Traditional farming faces unpredictable weather, pest attacks, water wastage and low crop yield because of a lack of real-time data and expert guidance. Small and medium farmers decide by experience rather than data, which leads to losses.

## 2. Aim
Use AI to give data-driven solutions for crop monitoring, disease detection, irrigation management and yield prediction, making farming more efficient and profitable.

## 3. Objectives
1. Monitor crop health using AI and image analysis.
2. Detect plant diseases from leaf images and suggest treatments.
3. Provide real-time weather alerts for planning farm activities.
4. Recommend smart irrigation from soil moisture and weather.
5. Suggest suitable crops from soil and climate data.
6. Predict crop yield and profit from historical and real-time data.
7. Send community disease alerts when diseases are found in nearby farms.

## 4. Stakeholders
| Stakeholder | Interest |
|---|---|
| Small/medium farmers | Primary users; better decisions, lower losses |
| Agriculture officers | Monitor outbreaks, give advice |
| Project team / evaluators | Deliver and assess the project |

## 5. Scope
**In scope:** the six features in `02_SRS.md`, web app, demo + live-API modes.
**Out of scope (future):** mobile app, IoT sensor hardware, payments, marketplace, multilingual voice assistant.

## 6. Success Criteria
- Disease model accuracy ≥ 85 % on PlantVillage validation set.
- Weather and irrigation advice produced in < 3 s.
- Crop recommendation returns top-3 crops with profit estimate.
- Community alert triggers when reports for a disease exceed 10.

## 7. Assumptions & Constraints
- Free-tier APIs only (OpenWeatherMap, WeatherAPI).
- Users have a smartphone/browser and internet.
- Crop price/yield data are illustrative until local data is supplied.
