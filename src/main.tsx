import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx loaded, about to render App component");

// Initialize i18n asynchronously to prevent blocking
import('./lib/i18n').then(() => {
  console.log("i18n loaded successfully");
}).catch((error) => {
  console.error("i18n failed to load:", error);
});

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
