import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import i18n dev guard to ensure SV/EN keys match
import '@/i18n/index'

console.log("Main.tsx loaded, about to render App component");

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
