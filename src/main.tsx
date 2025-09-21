import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx loaded - before i18n import");

// Import i18n with error handling
try {
  import('./lib/i18n');
  console.log("i18n import successful");
} catch (error) {
  console.error("i18n import failed:", error);
}

console.log("Main.tsx loaded, about to render App component");

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
