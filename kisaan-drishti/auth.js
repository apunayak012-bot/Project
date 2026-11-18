// ===========================================
// Kisaan Drishti - auth.js
// Demo login: accounts are stored in this browser (localStorage).
// For production, replace with a real backend (Firebase / Node + database).
// ===========================================
const KD = (() => {
  const USERS = "kd_users", SESSION = "kd_session";
  const get = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

  async function hash(text) {
    const salted = "kisaan-drishti::" + text;
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salted));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (e) {}
    let h = 5381; for (let i = 0; i < salted.length; i++) h = ((h << 5) + h + salted.charCodeAt(i)) >>> 0;
    return "f" + h.toString(16);
  }
  const norm = id => String(id).trim().toLowerCase();

  async function register({ name, id, village, password }) {
    const users = get(USERS, {});
    const key = norm(id);
    if (users[key]) return { ok: false, msg: "This mobile/email is already registered. Please log in." };
    const farmerId = "F" + (100 + Object.keys(users).length + 1 + Math.floor(Math.random() * 800));
    users[key] = { name: name.trim(), id: id.trim(), village: village.trim(), farmerId, pass: await hash(password) };
    if (!set(USERS, users)) return { ok: false, msg: "Browser storage is blocked. Please enable it and retry." };
    set(SESSION, key);
    return { ok: true };
  }
  async function login(id, password) {
    const users = get(USERS, {});
    const u = users[norm(id)];
    if (!u || u.pass !== await hash(password)) return { ok: false, msg: "Wrong mobile/email or password." };
    set(SESSION, norm(id));
    return { ok: true };
  }
  function current() {
    const key = get(SESSION, null);
    if (!key) return null;
    const u = get(USERS, {})[key];
    return u ? Object.assign({ key }, u) : null;
  }
  function logout() { try { localStorage.removeItem(SESSION); } catch (e) {} location.href = "login.html"; }
  // Per-user farm profile
  const profileKey = () => { const u = current(); return u ? "kd_profile_" + u.key : null; };
  const loadProfile = () => { const k = profileKey(); return k ? get(k, null) : null; };
  const saveProfile = p => { const k = profileKey(); return k ? set(k, p) : false; };
  const clearProfile = () => { const k = profileKey(); if (k) try { localStorage.removeItem(k); } catch (e) {} };

  return { register, login, current, logout, loadProfile, saveProfile, clearProfile };
})();
