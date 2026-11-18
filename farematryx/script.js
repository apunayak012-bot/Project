// ===========================================
// Farematryx - script.js (corrected)
// ===========================================

// Smooth scroll (ignores bare "#" links that would throw an error)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const id = this.getAttribute("href");
        const target = id.length > 1 ? document.querySelector(id) : null;
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
    });
});

// ===========================================
// Prediction Function
// ===========================================
function predictFare() {
    const val = id => document.getElementById(id).value;

    const airline = val("airline");
    const source = val("source");
    const destination = val("destination");
    const travelClass = val("class");
    const stops = val("stops");
    const duration = parseFloat(val("duration"));
    const days = parseInt(val("days"), 10);

    // Validation
    if (isNaN(duration) || isNaN(days)) {
        alert("Please fill all fields.");
        return;
    }
    if (duration <= 0 || days < 0) {
        alert("Duration must be above 0 and days left cannot be negative.");
        return;
    }
    if (source === destination) {
        alert("Source and destination must be different.");
        return;
    }

    const airlineExtra = { "IndiGo": 1500, "Air India": 2500, "Vistara": 3500, "SpiceJet": 1200, "AirAsia": 1000 };
    const stopsExtra = { "Non Stop": 0, "1 Stop": 900, "2 Stops": 1700 };

    let price = 3500;
    price += airlineExtra[airline] || 0;
    price += stopsExtra[stops] || 0;
    if (travelClass === "Business") price += 8000;
    price += duration * 220;

    if (days < 7) price += 4000;
    else if (days < 15) price += 2500;
    else if (days < 30) price += 1200;
    else price -= 500;

    price = Math.round(price);

    document.getElementById("fare").textContent = "₹ " + price.toLocaleString("en-IN");

    let text, cls;
    if (price < 6500) {
        text = "✅ Book Now (Excellent Price)";
        cls = "book-now";
    } else if (price < 9000) {
        text = "🟡 Good Price. You can Book.";
        cls = "wait";
    } else {
        text = "🔴 Wait for Better Deals.";
        cls = "high-price";
    }

    const rec = document.getElementById("recommendation");
    rec.textContent = text;
    rec.className = cls;

    document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "center" });
}

// ===========================================
// Animated Statistics Counter (keeps K, %, + suffixes)
// ===========================================
document.querySelectorAll(".stat-card h2").forEach(el => {
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = m[2];
    const step = Math.max(1, Math.ceil(target / 100));
    let current = 0;

    (function tick() {
        current = Math.min(target, current + step);
        el.textContent = current + suffix;
        if (current < target) setTimeout(tick, 20);
    })();
});

// ===========================================
// Welcome Message (once per session)
// ===========================================
window.addEventListener("load", () => {
    try {
        if (sessionStorage.getItem("welcomed")) return;
        sessionStorage.setItem("welcomed", "1");
    } catch (e) { /* storage unavailable */ }
    setTimeout(() => alert("✈ Welcome to Farematryx!"), 500);
});

// ===========================================
// Scroll Reveal Animation
// ===========================================
const sections = document.querySelectorAll("section");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.classList.add("reveal");
        observer.observe(section);
    });
}

// ===========================================
// Dark Mode
// ===========================================
const themeBtn = document.getElementById("themeBtn");

function darkMode() {
    const on = document.body.classList.toggle("dark-mode");
    if (themeBtn) themeBtn.textContent = on ? "☀️" : "🌙";
    try { localStorage.setItem("theme", on ? "dark" : "light"); } catch (e) { }
}

if (themeBtn) themeBtn.addEventListener("click", darkMode);

try {
    if (localStorage.getItem("theme") === "dark") darkMode();
} catch (e) { }

// ===========================================
// Back-to-top Button
// ===========================================
const topButton = document.createElement("button");
topButton.innerHTML = "⬆";
topButton.id = "topBtn";
topButton.setAttribute("aria-label", "Back to top");
document.body.appendChild(topButton);

window.addEventListener("scroll", () => {
    topButton.style.display = window.scrollY > 300 ? "block" : "none";
});

topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===========================================
// Button Ripple Effect
// ===========================================
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = e.offsetX + "px";
        ripple.style.top = e.offsetY + "px";
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===========================================
// Console Message
// ===========================================
console.log("================================");
console.log("Farematryx - Smart Flight Fare Analytics");
console.log("Machine Learning Project");
console.log("Developed using HTML CSS JS");
console.log("================================");
