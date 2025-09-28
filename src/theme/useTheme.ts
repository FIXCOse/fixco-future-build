import { create } from 'zustand';

export type ThemeId = 'dark' | 'light' | 'ocean';
const STORAGE_KEY = 'fixco_theme';

type ThemeState = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  init: () => void;
};

export const useTheme = create<ThemeState>((set, get) => ({
  theme: 'dark',
  setTheme: (t) => {
    set({ theme: t });
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(STORAGE_KEY, t);
    
    // Update meta theme-color for mobile
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (meta) {
      // Get the computed background color after theme change
      setTimeout(() => {
        const css = getComputedStyle(document.documentElement);
        const bg = css.getPropertyValue('--background').trim();
        meta.content = `hsl(${bg})`;
      }, 0);
    }
  },
  init: () => {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme') as ThemeId | null;
    
    if (urlTheme && ['dark', 'light', 'ocean'].includes(urlTheme)) {
      get().setTheme(urlTheme);
      return;
    }
    
    // Check localStorage, fallback to system preference or default dark
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial: ThemeId = saved ?? (prefersDark ? 'dark' : 'dark'); // default = dark
    get().setTheme(initial);
  }
}));