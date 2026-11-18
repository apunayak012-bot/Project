# 05 – Data Design

## Prototype storage (localStorage key `reports`)
| Field | Type | Example |
|---|---|---|
| farmer_id | string | F101 |
| village | string | Rampur |
| disease | string | Brown Spot |
| date | YYYY-MM-DD | 2026-10-12 |

## Planned tables (production)
- **Farmer**(farmer_id PK, name, phone, village, language)
- **Farm**(farm_id PK, farmer_id FK, area_acres, soil_type, lat, lon)
- **DiseaseReport**(report_id PK, farm_id FK, disease, confidence, image_url, date)
- **CropKnowledge**(crop PK, soil, season, rain_min, rain_max, temp_min, temp_max, yield, price, cost)
- **HealthScore**(farm_id FK, date, soil, weather, disease, irrigation, total)

Sample CSVs are in `/data`.
