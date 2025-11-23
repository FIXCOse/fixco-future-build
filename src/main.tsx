import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useTheme } from './theme/useTheme'

// Import i18n dev guard to ensure SV/EN keys match
import '@/i18n/index'

// Initialize GSAP with all free plugins
import { initGSAP } from '@/lib/gsap'
initGSAP();

function BootTheme() {
  React.useEffect(() => { 
    useTheme.getState().init(); 
  }, []);
  return null;
}

console.log("Main.tsx loaded, about to render App component");

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BootTheme />
    <App />
  </React.StrictMode>
);
