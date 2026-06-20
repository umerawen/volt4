/*
 * Storage shim for running VOLT // DRAFT outside the Claude artifact environment.
 *
 * Inside Claude, window.storage is provided by Anthropic and syncs live across
 * every connected client (that's what makes the auction real-time and multiplayer).
 *
 * Outside Claude there's no shared backend, so this shim backs the same API with
 * localStorage. The app runs and persists in ONE browser, but multiple people /
 * tabs will NOT see each other's auction in real time. For true multi-client sync
 * you'd point these methods at your own backend (e.g. a small KV store + websockets).
 */
if (typeof window !== "undefined" && !window.storage) {
  const KEY = (k) => `volt:${k}`;
  window.storage = {
    async get(key) {
      try {
        const raw = localStorage.getItem(KEY(key));
        return raw == null ? null : { value: raw };
      } catch {
        return null;
      }
    },
    async set(key, value) {
      try {
        localStorage.setItem(KEY(key), value);
      } catch (e) {
        console.error("storage.set failed", e);
      }
    },
  };
}
