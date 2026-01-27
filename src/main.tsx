import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./lib/registerServiceWorker";
import { setupGlobalErrorHandlers } from "./lib/errorLogger";
import { deferNonCritical, preloadImages } from "./lib/performanceOptimizations";

// Setup global error handlers for uncaught errors
setupGlobalErrorHandlers();

// Render app immediately
createRoot(document.getElementById("root")!).render(<App />);

// Defer non-critical operations
deferNonCritical(() => {
  // Register service worker for offline support
  registerServiceWorker();
  
  // Preload critical images after initial render
  preloadImages([
    '/favicon.png',
    '/og-image.png',
  ]).catch(() => {
    // Silently fail - images will load on demand
  });
});
