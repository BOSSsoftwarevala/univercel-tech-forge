import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applySecurityHeaders } from "./middleware/security-headers";
import { initSecretsManager } from "./lib/security/secrets-manager";

// Apply security headers (CSP, X-Frame-Options, etc.) as early as possible
applySecurityHeaders();

// Validate environment configuration at startup
initSecretsManager();
// =============================
// Chunk-load recovery (logic only)
// =============================
// Vite emits `vite:preloadError` when a dynamic import chunk fails to load.
// This commonly happens after deploys when the browser cache holds an older HTML
// that references chunk hashes that no longer exist.
//
// We hard-reload once with a cache-busting query param to recover from a blank screen.
const RELOAD_FLAG_KEY = "__sv_chunk_reload__";

const hardReloadWithBust = () => {
  try {
    if (sessionStorage.getItem(RELOAD_FLAG_KEY) === "1") return;
    sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
    const url = new URL(window.location.href);
    url.searchParams.set("v", Date.now().toString());
    window.location.replace(url.toString());
  } catch {
    // If sessionStorage is blocked, fall back to a normal reload.
    window.location.reload();
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.addEventListener("vite:preloadError", (event: any) => {
  // Prevent the default Vite handler from spamming the console
  event?.preventDefault?.();
  hardReloadWithBust();
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = (event as PromiseRejectionEvent).reason;
  const message = reason instanceof Error ? reason.message : String(reason);
  if (message.includes("Failed to fetch dynamically imported module") || message.includes("ChunkLoadError")) {
    event.preventDefault?.();
    hardReloadWithBust();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
