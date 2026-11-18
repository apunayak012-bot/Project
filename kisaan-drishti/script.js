// ===========================================
// Kisaan Drishti - script.js
// ===========================================

// ---------- Static knowledge base ----------
const CROPS = {
  Rice:      { soil:["Alluvial","Clay"],  season:"Kharif", rain:[1000,2000], temp:[22,32], yield:22, price:2200, cost:30000, water:"High",   area:"River plains, deltas" },
  Wheat:     { soil:["Alluvial","Loamy"], season:"Rabi",   rain:[400,900],   temp:[12,25], yield:18, price:2300, cost:22000, water:"Medium", area:"Indo-Gangetic plains" },
  Cotton:    { soil:["Black"],            season:"Kharif", rain:[600,1100],  temp:[21,32], yield:8,  price:6500, cost:28000, water:"Medium", area:"Deccan plateau" },
  Maize:     { soil:["Loamy","Red"],      season:"Kharif", rain:[500,1000],  temp:[18,30], yield:20, price:2000, cost:20000, water:"Medium", area:"Peninsular India" },
  Groundnut: { soil:["Sandy","Red"],      season:"Kharif", rain:[500,1000],  temp:[22,32], yield:10, price:5800, cost:24000, water:"Low",    area:"Gujarat, Andhra Pradesh" },
  Soybean:   { soil:["Black","Loamy"],    season:"Kharif", rain:[600,1000],  temp:[20,30], yield:9,  price:4600, cost:18000, water:"Medium", area:"Central India" },
  Chickpea:  { soil:["Black","Loamy"],    season:"Rabi",   rain:[400,700],   temp:[15,28], yield:7,  price:5400, cost:16000, water:"Low",    area:"Madhya Pradesh, Maharashtra" },
  Mustard:   { soil:["Alluvial","Sandy"], season:"Rabi",   rain:[300,700],   temp:[10,25], yield:6,  price:5600, cost:14000, water:"Low",    area:"Rajasthan, Haryana" },
  Sugarcane: { soil:["Black","Alluvial"], season:"Kharif", rain:[1000,1800], temp:[24,34], yield:350,price:350,  cost:60000, water:"High",   area:"Maharashtra, Uttar Pradesh" },
  Watermelon:{ soil:["Sandy","Loamy"],    season:"Zaid",   rain:[300,600],   temp:[24,36], yield:60, price:1200, cost:25000, water:"Medium", area:"River beds, sandy tracts" },
  Cucumber:  { soil:["Loamy","Sandy"],    season:"Zaid",   rain:[300,700],   temp:[22,35], yield:50, price:1500, cost:20000, water:"Medium", area:"Peri-urban belts" },
  Tomato:    { soil:["Loamy","Red"],      season:"Rabi",   rain:[400,900],   temp:[18,30], yield:90, price:1100, cost:45000, water:"Medium", area:"Karnataka, Maharashtra" }
};
// yield in quintal/acre, price in Rs/quintal, cost in Rs/acre (illustrative values)

const TREATMENTS = {
  "Brown Spot":      "Spray Mancozeb (2.5 g/L), improve drainage, use balanced potassium.",
  "Leaf Blight":     "Remove infected leaves, spray copper oxychloride, avoid overhead irrigation.",
  "Powdery Mildew":  "Spray wettable sulphur or neem oil; improve air circulation.",
  "Leaf Rust":       "Apply propiconazole fungicide; use resistant varieties next season.",
  "Healthy":         "No disease found. Continue regular monitoring."
};

// ---------- Helpers ----------
const cropImg = n => `images/crops/${n.toLowerCase()}.png`;
const $ = id => document.getElementById(id);
function safe(fn, fallback){ try { return fn(); } catch(e){ return fallback; } }

// Fill crop dropdown
Object.keys(CROPS).forEach(c => $("irrCrop").add(new Option(c, c)));

// ===========================================
// FEATURE 1: Disease Detection
// ===========================================
let tmModel = null;
async function loadModel(){
  if (!CONFIG.TM_MODEL_URL || typeof tmImage === "undefined") return null;
  if (!tmModel) tmModel = await tmImage.load(CONFIG.TM_MODEL_URL + "model.json", CONFIG.TM_MODEL_URL + "metadata.json");
  return tmModel;
}
// Load TensorFlow + Teachable Machine only if a model URL is configured
if (CONFIG.TM_MODEL_URL){
  ["https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js",
   "https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"]
   .reduce((p,src)=>p.then(()=>new Promise(r=>{const s=document.createElement("script");s.src=src;s.onload=r;s.onerror=r;document.head.appendChild(s);})), Promise.resolve());
}

async function analyse(src, knownLabel){
  const img = $("leafPreview");
  img.hidden = false;
  img.src = src;
  await new Promise(r => { img.onload = r; img.onerror = r; });
  $("diseaseResult").textContent = "Analysing…";

  let label, conf;
  const model = await safe(loadModel, null);
  if (model){
    const preds = await model.predict(img);
    preds.sort((a,b)=>b.probability-a.probability);
    label = preds[0].className; conf = preds[0].probability;
  } else if (knownLabel){
    label = knownLabel; conf = 0.9;   // demo mode: sample images have a known label
  } else {
    // DEMO mode: picks a plausible result from image pixels (replace with real model)
    const names = Object.keys(TREATMENTS);
    let sum = 0;
    try{
      const c = document.createElement("canvas"); c.width = c.height = 16;
      const ctx = c.getContext("2d"); ctx.drawImage(img,0,0,16,16);
      const d = ctx.getImageData(0,0,16,16).data;
      for (let i=0;i<d.length;i+=4) sum += d[i] + d[i+1]*2 + d[i+2];
    }catch(e){ sum = 7; }
    label = names[sum % names.length]; conf = 0.7 + (sum % 25)/100;
  }
  const tip = TREATMENTS[label] || "Consult your local agriculture officer.";
  $("diseaseResult").innerHTML =
    `<b>Result:</b> ${label}<br><b>Confidence:</b> ${(conf*100).toFixed(1)}%<br><b>Treatment:</b> ${tip}` +
    (CONFIG.TM_MODEL_URL ? "" : `<br><small>(Demo mode – set TM_MODEL_URL in config.js)</small>`) +
    (label !== "Healthy" ? `<br><button class="btn" style="margin-top:10px" onclick="reportFromDetection('${label}')">Report to community</button>` : "");
}
$("leafInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) analyse(URL.createObjectURL(file), null);
});
document.querySelectorAll(".samples img").forEach(im =>
  im.addEventListener("click", () => analyse(im.getAttribute("src"), im.dataset.label)));

function reportFromDetection(label){
  const f = $("dFarmer").value.trim(), v = $("dVillage").value.trim();
  if (!f || !v){ alert("Enter Farmer ID and Village first."); return; }
  saveReport({farmer:f, village:v, disease:label, date:new Date().toISOString().slice(0,10)});
  alert("Reported. Nearby farmers will be alerted.");
}

// ===========================================
// FEATURE 2: Weather Alerts + Smart Irrigation
// ===========================================
async function getWeather(){
  const city = $("city").value.trim();
  if (!city){ alert("Enter a city."); return; }
  let w;
  if (CONFIG.OPENWEATHER_API_KEY){
    try{
      const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${CONFIG.OPENWEATHER_API_KEY}`);
      if (!r.ok) throw new Error("API " + r.status);
      const j = await r.json();
      w = { temp:j.main.temp, humidity:j.main.humidity, wind:j.wind.speed*3.6, rain:(j.rain && j.rain["1h"]) || 0, desc:j.weather[0].description };
    }catch(e){ alert("Weather API failed (" + e.message + "). Showing demo data."); }
  }
  if (!w) w = { temp:33, humidity:48, wind:14, rain:0, desc:"clear sky (demo data)" };

  const alerts = [];
  if (w.temp > 38) alerts.push("🔥 Heat alert: irrigate in early morning/evening.");
  if (w.temp < 8)  alerts.push("❄ Frost risk: cover young plants.");
  if (w.wind > 40) alerts.push("💨 Strong wind: delay spraying.");
  if (w.rain > 5)  alerts.push("🌧 Heavy rain: avoid fertilizer application.");
  if (w.humidity > 85) alerts.push("🦠 High humidity: fungal disease risk.");

  // Irrigation logic
  const crop = CROPS[$("irrCrop").value];
  const moisture = parseFloat($("moisture").value);
  const need = {High:60, Medium:45, Low:30}[crop.water];
  let irr;
  if (w.rain > 5) irr = "💧 Skip irrigation – rain expected/ongoing.";
  else if (moisture < need) irr = `💧 Irrigate now. Moisture ${moisture}% is below the ${need}% target for ${$("irrCrop").value}.`;
  else irr = `✅ No irrigation needed. Moisture ${moisture}% meets the ${need}% target.`;

  window.lastWeatherScore = Math.max(0, 25 - alerts.length * 5);
  window.lastIrrScore = irr.startsWith("💧 Irrigate") ? 10 : 22;

  $("weatherOut").innerHTML =
    `<b>${city}</b>: ${w.temp.toFixed(1)}°C, humidity ${w.humidity}%, wind ${w.wind.toFixed(0)} km/h, rain ${w.rain} mm, ${w.desc}<br>` +
    (alerts.length ? alerts.join("<br>") : "✅ No weather alerts.") + `<br><br>${irr}`;
}

// ===========================================
// FEATURE 3: Crop Recommendation + Yield/Profit
// ===========================================
function recommendCrop(){
  const soil = $("soil").value, season = $("season").value;
  const rain = parseFloat($("rain").value), temp = parseFloat($("temp").value), acres = parseFloat($("acres").value);
  if (isNaN(rain) || isNaN(temp) || isNaN(acres) || acres <= 0){ alert("Please fill all fields correctly."); return; }

  const scored = Object.entries(CROPS).map(([name,c]) => {
    let s = 0;
    if (c.soil.includes(soil)) s += 35;
    if (c.season === season) s += 30;
    if (rain >= c.rain[0] && rain <= c.rain[1]) s += 20; else s += Math.max(0, 20 - Math.abs(rain - (c.rain[0]+c.rain[1])/2)/40);
    if (temp >= c.temp[0] && temp <= c.temp[1]) s += 15; else s += Math.max(0, 15 - Math.abs(temp - (c.temp[0]+c.temp[1])/2));
    return { name, c, score:Math.round(s) };
  }).sort((a,b) => b.score - a.score).slice(0,3);

  $("cropOut").innerHTML = scored.map((r,i) => {
    const revenue = r.c.yield * r.c.price * acres;
    const cost = r.c.cost * acres;
    return `<div class="crop-rec"><img src="${cropImg(r.name)}" alt="${r.name}"><div><b>${i+1}. ${r.name}</b> – match ${r.score}%<br>` +
      `Expected yield: ${(r.c.yield*acres).toFixed(1)} quintal · Revenue ₹${revenue.toLocaleString("en-IN")} · ` +
      `Cost ₹${cost.toLocaleString("en-IN")} · <b>Profit ₹${(revenue-cost).toLocaleString("en-IN")}</b></div></div>`;
  }).join("") + "<small>Yield/price values are illustrative averages; update CROPS in script.js with local data.</small>";
}

// ===========================================
// FEATURE 4: Farm Health Score
// ===========================================
function updateScore(){
  const v = id => parseInt($(id).value, 10);
  $("vSoil").textContent = v("sSoil"); $("vWeather").textContent = v("sWeather");
  $("vDisease").textContent = v("sDisease"); $("vIrr").textContent = v("sIrr");
  const total = v("sSoil") + v("sWeather") + v("sDisease") + v("sIrr");
  $("scoreNum").textContent = total + "/100";
  const b = $("scoreStatus");
  if (total >= 75){ b.textContent = "GOOD"; b.className = "badge good"; }
  else if (total >= 50){ b.textContent = "AVERAGE"; b.className = "badge avg"; }
  else { b.textContent = "POOR"; b.className = "badge poor"; }
}
["sSoil","sWeather","sDisease","sIrr"].forEach(id => $(id).addEventListener("input", updateScore));
// Weather check also feeds the score
const _gw = getWeather;
getWeather = async function(){
  await _gw();
  if (window.lastWeatherScore !== undefined){
    $("sWeather").value = window.lastWeatherScore; $("sIrr").value = window.lastIrrScore; updateScore();
  }
};

// ===========================================
// FEATURE 5: Community Disease Alerts (localStorage)
// ===========================================
const SEED = (() => {
  const a = [];
  for (let i=1;i<=12;i++) a.push({farmer:"F"+(100+i), village:["Rampur","Kheda","Mohan"][i%3], disease:"Brown Spot", date:"2026-10-"+String(10+(i%12)).padStart(2,"0")});
  a.push({farmer:"F140", village:"Rampur", disease:"Leaf Rust", date:"2026-10-20"});
  return a;
})();
function loadReports(){ return safe(() => JSON.parse(localStorage.getItem("reports")) || null, null) || SEED.slice(); }
function saveReport(r){ const list = loadReports(); list.push(r); safe(() => localStorage.setItem("reports", JSON.stringify(list))); renderReports(); }
function resetReports(){ safe(() => localStorage.removeItem("reports")); renderReports(); }
function addReport(){
  const r = { farmer:$("rFarmer").value.trim(), village:$("rVillage").value.trim(), disease:$("rDisease").value.trim(), date:$("rDate").value };
  if (!r.farmer || !r.village || !r.disease || !r.date){ alert("Fill all fields."); return; }
  saveReport(r);
}
function renderReports(){
  const list = loadReports();
  $("reportRows").innerHTML = list.slice(-15).reverse().map(r => `<tr><td>${esc(r.farmer)}</td><td>${esc(r.village)}</td><td>${esc(r.disease)}</td><td>${esc(r.date)}</td></tr>`).join("");
  const counts = {};
  list.forEach(r => { const k = r.disease.toLowerCase(); counts[k] = counts[k] || {n:0, label:r.disease}; counts[k].n++; });
  const T = CONFIG.ALERT_THRESHOLD;
  const html = Object.values(counts).filter(c => c.n > T/2).map(c => {
    const level = c.n > T ? "high" : "medium";
    return c.n > T
      ? `<div class="alert high">🚨 Community Alert: ${esc(c.label)} detected in ${c.n} farms. Risk Level: High</div>`
      : `<div class="alert medium">⚠ ${esc(c.label)} reported in ${c.n} farms. Risk Level: Medium</div>`;
  }).join("");
  $("alertBanner").innerHTML = html || `<div class="alert low">✅ No community alerts.</div>`;
}
function esc(s){ return String(s).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
renderReports();
$("rDate").value = new Date().toISOString().slice(0,10);

// ===========================================
// FEATURE 6: CropFit Analytics
// ===========================================
function renderCropFit(){
  const s = $("fSeason").value;
  const rows = Object.entries(CROPS).filter(([,c]) => s === "All" || c.season === s)
    .map(([n,c]) => ({n,c,profit:(c.yield*c.price - c.cost)})).sort((a,b) => b.profit - a.profit);
  const max = Math.max(...rows.map(r => r.profit), 1);
  $("fitBars").innerHTML = rows.map(r => `<div class="bar-row"><img class="crop-thumb" src="${cropImg(r.n)}" alt=""><span>${r.n}</span><div class="bar" style="width:${Math.max(2, r.profit/max*60)}%"></div><span>₹${r.profit.toLocaleString("en-IN")}</span></div>`).join("");
  $("fitRows").innerHTML = rows.map(r => `<tr><td><img class="crop-thumb" src="${cropImg(r.n)}" alt="">${r.n}</td><td>${r.c.area} (${r.c.soil.join("/")} soil)</td><td>${r.c.season}</td><td>${r.c.temp[0]}–${r.c.temp[1]}°C, ${r.c.rain[0]}–${r.c.rain[1]} mm rain</td><td>₹${r.profit.toLocaleString("en-IN")}</td></tr>`).join("");
}
renderCropFit();

// ===========================================
// UI: scroll reveal, dark mode
// ===========================================
if ("IntersectionObserver" in window){
  const obs = new IntersectionObserver((es,o) => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("visible"); o.unobserve(e.target); } }), {threshold:.1});
  document.querySelectorAll("section").forEach(s => { s.classList.add("reveal"); obs.observe(s); });
}
function darkMode(){
  const on = document.body.classList.toggle("dark-mode");
  $("themeBtn").textContent = on ? "☀️" : "🌙";
  safe(() => localStorage.setItem("theme", on ? "dark" : "light"));
}
$("themeBtn").addEventListener("click", darkMode);
if (safe(() => localStorage.getItem("theme"), null) === "dark") darkMode();

// ===========================================
// MY FARM PROFILE + LOGIN SESSION
// ===========================================
Object.keys(CROPS).forEach(c => $("pCrop").add(new Option(c, c)));
const PROFILE_FIELDS = { pName:"name", pId:"farmerId", pPhone:"phone", pVillage:"village", pCity:"city", pAcres:"acres", pSoil:"soil", pSeason:"season", pCrop:"crop" };
const DEFAULTS = { city:"Pune", acres:"2", soil:"Black", season:"Kharif", rain:"800", temp:"27", moisture:"35" };

function applyProfile(p){
  const set = (id, v) => { if (v) $(id).value = v; };
  set("dFarmer", p.farmerId); set("rFarmer", p.farmerId);
  set("dVillage", p.village); set("rVillage", p.village);
  set("city", p.city || p.village); set("acres", p.acres);
  set("soil", p.soil); set("season", p.season); set("irrCrop", p.crop);
}
function clearLinkedFields(){
  ["dFarmer","dVillage","rFarmer","rVillage","rDisease"].forEach(id => $(id).value = "");
  $("city").value = DEFAULTS.city; $("acres").value = DEFAULTS.acres;
  $("soil").value = DEFAULTS.soil; $("season").value = DEFAULTS.season;
  $("rain").value = DEFAULTS.rain; $("temp").value = DEFAULTS.temp; $("moisture").value = DEFAULTS.moisture;
  $("irrCrop").selectedIndex = 0;
  $("rDate").value = new Date().toISOString().slice(0,10);
  $("leafInput").value = ""; $("leafPreview").hidden = true; $("leafPreview").removeAttribute("src");
  $("diseaseResult").textContent = "No image analysed yet.";
  $("weatherOut").textContent = "Press “Check Weather”.";
  $("cropOut").textContent = "Fill the form and press Recommend.";
  [["sSoil",25],["sWeather",20],["sDisease",15],["sIrr",20]].forEach(([id,v]) => $(id).value = v);
  window.lastWeatherScore = undefined; window.lastIrrScore = undefined;
  updateScore();
}
$("profileForm").addEventListener("submit", e => {
  e.preventDefault();
  const p = {}; Object.entries(PROFILE_FIELDS).forEach(([id,k]) => p[k] = $(id).value.trim());
  const msg = $("profileMsg"); msg.style.color = "#c62828";
  if (!p.name || !p.village){ msg.textContent = "Please enter at least your name and village."; return; }
  if (p.phone && !/^\d{10}$/.test(p.phone)){ msg.textContent = "Mobile must be 10 digits."; return; }
  if (p.acres && (isNaN(p.acres) || +p.acres <= 0)){ msg.textContent = "Land (acres) must be a positive number."; return; }
  KD.saveProfile(p); applyProfile(p);
  msg.style.color = "#2e7d32"; msg.textContent = "✅ Details saved and applied to all tools below.";
});
$("resetProfile").addEventListener("click", () => {
  if (!confirm("Clear all your farm details and results so you can enter new information?")) return;
  $("profileForm").reset();
  KD.clearProfile(); clearLinkedFields();
  $("pName").focus();
  $("profileMsg").style.color = "#2e7d32";
  $("profileMsg").textContent = "🔄 All details cleared. Enter your new information and press Save.";
});
(function initSession(){
  const u = KD.current();
  if (!u){ location.replace("login.html"); return; }
  $("userName").textContent = "👤 " + u.name.split(" ")[0];
  $("logoutBtn").addEventListener("click", KD.logout);
  const p = KD.loadProfile() || { name:u.name, farmerId:u.farmerId, village:u.village, phone:/^\d{10}$/.test(u.id) ? u.id : "" };
  Object.entries(PROFILE_FIELDS).forEach(([id,k]) => { if (p[k]) $(id).value = p[k]; });
  applyProfile(p);
})();
