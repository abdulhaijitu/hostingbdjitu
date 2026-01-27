import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./lib/registerServiceWorker";
import { setupGlobalErrorHandlers } from "./lib/errorLogger";

// Setup global error handlers for uncaught errors
setupGlobalErrorHandlers();

// Register service worker for offline support
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
