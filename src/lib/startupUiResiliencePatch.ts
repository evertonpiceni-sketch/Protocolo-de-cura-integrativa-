// Startup resilience: never let optional, lazy-loaded welcome/tip UI block the app shell.
// The welcome experience remains available inside Natural Sereno; this only prevents
// automatic optional overlays from suspending the whole application on startup.

const TODAY_KEY = 'cura_integrada_last_tip_date';
const WELCOME_KEY = 'cura_integrada_welcome_seen_v1';

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

try {
  // App.tsx renders optional lazy modals inside the top-level Suspense. If one of
  // those chunks stalls, fallback={null} makes the entire app appear blank.
  // Mark only the automatic startup overlays as already handled; no profile,
  // journey, payment or therapeutic data is changed.
  localStorage.setItem(WELCOME_KEY, 'true');
  localStorage.setItem(TODAY_KEY, localDateKey());
} catch {
  // Storage may be unavailable in private/restricted contexts. The app must still boot.
}
