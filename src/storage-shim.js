/*
 * VOLT // DRAFT — shared storage via Supabase (enables LIVE SYNC).
 *
 * The app reads/writes its whole state through window.storage and polls a few
 * times a second. Backing that with Supabase means a spin / bid / draw on ONE
 * device is seen by ALL devices. Without a shared backend, each device only
 * talked to its own browser storage (which is why spins didn't propagate).
 *
 * Passwords are still hardcoded in App.jsx — they don't need this. This is
 * purely so the live auction state is shared.
 *
 * ── SETUP (no coding) ───────────────────────────────────────────────
 *  1. Create a free project at supabase.com.
 *  2. SQL Editor -> paste SUPABASE_SETUP.sql -> Run.
 *  3. Settings -> API -> copy your Project URL and the anon (publishable) key.
 *  4. Paste both on the two lines marked PASTE below.
 *  5. Commit this file. Vercel redeploys automatically.
 * ────────────────────────────────────────────────────────────────────
 */
 
const SUPABASE_URL = "https://pjkamesdrvoezmfnbori.supabase.co";   // e.g. https://abcdxyz.supabase.co
const SUPABASE_KEY = "sb_publishable_aJiXP2972u06y5R8diVT-Q_z4DIYxXO";      // anon / publishable key
 
const TABLE = "volt_store";
const configured = SUPABASE_URL.startsWith("http") && !SUPABASE_KEY.startsWith("PASTE");
const base = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
 
// localStorage fallback (used only until you paste the keys above)
const LS = (k) => `volt:${k}`;
const localGet = (k) => { try { const r = localStorage.getItem(LS(k)); return r == null ? null : { value: r }; } catch { return null; } };
const localSet = (k, v) => { try { localStorage.setItem(LS(k), v); } catch (e) { console.error(e); } };
 
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      if (!configured) return localGet(key);
      try {
        const url = `${SUPABASE_URL}/rest/v1/${TABLE}?key=eq.${encodeURIComponent(key)}&select=value`;
        const res = await fetch(url, { headers: { ...base, Accept: "application/json" } });
        if (!res.ok) { console.error("supabase get", res.status); return null; }
        const rows = await res.json();
        return rows.length ? { value: rows[0].value } : null;
      } catch (e) { console.error("supabase get failed", e); return null; }
    },
 
    async set(key, value) {
      if (!configured) return localSet(key, value);
      try {
        const url = `${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=key`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            ...base,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
        });
        if (!res.ok) console.error("supabase set", res.status, await res.text());
      } catch (e) { console.error("supabase set failed", e); }
    },
  };
}
