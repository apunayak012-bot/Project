# 07 – Test Plan

| ID | Feature | Test | Expected |
|---|---|---|---|
| T1 | Disease | Upload valid leaf JPG | Disease, confidence, treatment shown |
| T2 | Disease | No file chosen | Message “No image analysed yet.” |
| T3 | Weather | Valid city + API key | Live data and alerts |
| T4 | Weather | No key / invalid key | Demo data, no crash |
| T5 | Irrigation | Moisture 20 %, Rice | “Irrigate now” |
| T6 | Irrigation | Rain > 5 mm | “Skip irrigation” |
| T7 | Crop | Black soil, Kharif, 800 mm, 27 °C | Cotton/Soybean ranked high |
| T8 | Crop | Empty fields | Validation alert |
| T9 | Health | Sliders 25/20/15/20 | 80/100 GOOD |
| T10 | Community | 12 Brown Spot reports | High-risk alert |
| T11 | Community | `<script>` in disease field | Rendered as text (no XSS) |
| T12 | CropFit | Filter Rabi | Only Rabi crops listed |
| T13 | UI | Mobile 360 px, dark mode | No horizontal scroll |
