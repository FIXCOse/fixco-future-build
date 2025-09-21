import { useLocation } from 'react-router-dom';
import { useCopy } from './CopyProvider';

const pathMap = {
  sv: {
    '/': '/',
    '/tjanster': '/tjanster',
    '/kontakt': '/kontakt',
    '/om-oss': '/om-oss',
    '/referenser': '/referenser',
    '/smart-hem': '/smart-hem',
  },
  en: {
    '/': '/en',
    '/tjanster': '/en/services',
    '/kontakt': '/en/contact',
    '/om-oss': '/en/about',
    '/referenser': '/en/references',
    '/smart-hem': '/en/smart-home',
  },
};

export function useLocalePath() {
  const { locale } = useCopy();
  const location = useLocation();
  const pathname = location.pathname.replace(/\/$/, '') || '/';

  const toEN = () => {
    // Find current Swedish path and map to English
    const svEntry = Object.entries(pathMap.sv).find(([, v]) => v === pathname);
    if (svEntry) {
      const enPath = Object.entries(pathMap.en).find(([k]) => k === svEntry[0]);
      return enPath ? enPath[1] : '/en';
    }
    return '/en';
  };

  const toSV = () => {
    // Find current English path and map to Swedish
    const enEntry = Object.entries(pathMap.en).find(([, v]) => v === pathname);
    if (enEntry) {
      return enEntry[0];
    }
    // If already on Swedish path, return as is
    if (pathname.startsWith('/en')) {
      return '/';
    }
    return pathname;
  };

  return { toEN, toSV };
}