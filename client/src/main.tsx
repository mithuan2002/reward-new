import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add loaded class to body for FOUC prevention
document.body.classList.add('loaded');

// Optimize for mobile performance
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register service worker for better caching (optional)
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);