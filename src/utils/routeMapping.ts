/**
 * Single source of truth for route mapping between Swedish and English
 */

export const svToEnRoutes: Record<string, string> = {
  '/': '/en',
  '/tjanster': '/en/services',
  '/tjanster/el': '/en/services/el',
  '/tjanster/vvs': '/en/services/vvs',
  '/tjanster/snickeri': '/en/services/snickeri',
  '/tjanster/montering': '/en/services/montering',
  '/tjanster/tradgard': '/en/services/tradgard',
  '/tjanster/stadning': '/en/services/stadning',
  '/tjanster/markarbeten': '/en/services/markarbeten',
  '/tjanster/tekniska-installationer': '/en/services/tekniska-installationer',
  '/tjanster/flytt': '/en/services/flytt',
  '/kontakt': '/en/contact',
  '/om-oss': '/en/about',
  '/referenser': '/en/references',
  '/smart-hem': '/en/smart-home',
  '/boka-hembesok': '/en/book-visit',
  '/rot-info': '/en/rot',
  '/rot': '/en/rot',
  '/rut': '/en/rut',
  '/faq': '/en/faq',
  '/terms': '/en/terms',
  '/privacy': '/en/privacy',
  '/cookies': '/en/cookies',
  '/ansvar-forsakring': '/en/insurance',
  '/ai': '/en/ai'
};

export const enToSvRoutes: Record<string, string> = Object.fromEntries(
  Object.entries(svToEnRoutes).map(([sv, en]) => [en, sv])
);

/**
 * Convert any path to the target language
 */
export const convertPath = (currentPath: string, targetLang: 'sv' | 'en'): string => {
  // Extract base path without query params and hash
  const [path] = currentPath.split('?');
  const cleanPath = path.split('#')[0];
  
  // Preserve query params and hash
  const search = currentPath.includes('?') ? '?' + currentPath.split('?')[1].split('#')[0] : '';
  const hash = currentPath.includes('#') ? '#' + currentPath.split('#').pop() : '';

  let targetPath: string;

  if (targetLang === 'en') {
    // Swedish to English
    targetPath = svToEnRoutes[cleanPath] || cleanPath.replace(/^\//, '/en/');
  } else {
    // English to Swedish
    targetPath = enToSvRoutes[cleanPath] || cleanPath.replace(/^\/en\/?/, '/') || '/';
  }

  return `${targetPath}${search}${hash}`;
};

/**
 * Get current language from pathname
 */
export const getLanguageFromPath = (pathname: string): 'sv' | 'en' => {
  return pathname.startsWith('/en') ? 'en' : 'sv';
};
