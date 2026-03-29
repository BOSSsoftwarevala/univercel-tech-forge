import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Emergency diagnostics + safety: if the app ever becomes "dead" (no clicks),
// we want to know whether JS is running and whether pointer events reach document.
// (No UI changes; logs can be removed once confirmed stable.)
if (typeof window !== "undefined") {
  try {
    // Ensure root containers can always receive pointer events.
    document.documentElement.style.pointerEvents = "auto";
    document.body.style.pointerEvents = "auto";

    // Remove inert if it was accidentally applied globally.
    document.documentElement.removeAttribute("inert");
    document.body.removeAttribute("inert");
    document.getElementById("root")?.removeAttribute("inert");

    // Global click probe (capture) – proves events are reaching JS.
    document.addEventListener(
      "pointerdown",
      (e) => {
        const t = e.target as HTMLElement | null;
        console.log("[GLOBAL_CLICK_PROBE] pointerdown", {
          tag: t?.tagName?.toLowerCase?.(),
          id: t?.id,
          class: typeof t?.className === "string" ? t.className.split(" ").slice(0, 3).join(" ") : undefined,
          x: (e as PointerEvent).clientX,
          y: (e as PointerEvent).clientY,
        });
      },
      true
    );

    window.addEventListener("error", (ev) => {
      console.error("[GLOBAL_ERROR]", ev.error || ev.message);
    });
    window.addEventListener("unhandledrejection", (ev) => {
      console.error("[GLOBAL_UNHANDLED_REJECTION]", (ev as PromiseRejectionEvent).reason);
    });
  } catch {
    // never block boot
  }
 }

createRoot(document.getElementById("root")!).render(<App />);
