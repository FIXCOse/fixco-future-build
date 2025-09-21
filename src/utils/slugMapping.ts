// Slug mapping for Swedish <-> English navigation
export const svToEnRoutes: Record<string, string> = {
  '/': '/en',
  '/tjanster': '/en/services',
  '/kontakt': '/en/contact',
  '/om-oss': '/en/about',
  '/referenser': '/en/references',
  '/smart-hem': '/en/smart-home',
  '/boka-hembesok': '/en/book-visit',
  '/rot-info': '/en/rot-info',
  '/rut': '/en/rut',
  '/faq': '/en/faq',
  '/terms': '/en/terms',
  '/privacy': '/en/privacy'
};

export const enToSvRoutes: Record<string, string> = Object.fromEntries(
  Object.entries(svToEnRoutes).map(([sv, en]) => [en, sv])
);

export const getAlternateLanguageUrl = (currentPath: string, targetLang: 'sv' | 'en'): string => {
  // Extract base path without query params
  const [path, search, hash] = [
    currentPath.split('?')[0],
    currentPath.includes('?') ? '?' + currentPath.split('?')[1].split('#')[0] : '',
    currentPath.includes('#') ? '#' + currentPath.split('#')[1] : ''
  ];

  let targetPath: string;

  if (targetLang === 'en') {
    // Swedish to English
    targetPath = svToEnRoutes[path] || '/en';
  } else {
    // English to Swedish
    targetPath = enToSvRoutes[path] || '/';
  }

  return `${targetPath}${search}${hash}`;
};

export const getCurrentLanguage = (pathname: string): 'sv' | 'en' => {
  return pathname.startsWith('/en') ? 'en' : 'sv';
};