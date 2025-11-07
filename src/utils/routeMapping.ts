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
  
  // Service+City pages (20 mappings)
  '/tjanster/elmontor-uppsala': '/en/services/electrician-uppsala',
  '/tjanster/elmontor-stockholm': '/en/services/electrician-stockholm',
  '/tjanster/vvs-uppsala': '/en/services/plumber-uppsala',
  '/tjanster/vvs-stockholm': '/en/services/plumber-stockholm',
  '/tjanster/snickare-uppsala': '/en/services/carpenter-uppsala',
  '/tjanster/snickare-stockholm': '/en/services/carpenter-stockholm',
  '/tjanster/maleri-uppsala': '/en/services/painter-uppsala',
  '/tjanster/maleri-stockholm': '/en/services/painter-stockholm',
  '/tjanster/montering-uppsala': '/en/services/assembly-uppsala',
  '/tjanster/montering-stockholm': '/en/services/assembly-stockholm',
  '/tjanster/tradgard-uppsala': '/en/services/gardening-uppsala',
  '/tjanster/tradgard-stockholm': '/en/services/gardening-stockholm',
  '/tjanster/stad-uppsala': '/en/services/cleaning-uppsala',
  '/tjanster/stad-stockholm': '/en/services/cleaning-stockholm',
  '/tjanster/markarbeten-uppsala': '/en/services/groundwork-uppsala',
  '/tjanster/markarbeten-stockholm': '/en/services/groundwork-stockholm',
  '/tjanster/tekniska-installationer-uppsala': '/en/services/technical-installations-uppsala',
  '/tjanster/tekniska-installationer-stockholm': '/en/services/technical-installations-stockholm',
  '/tjanster/flytt-uppsala': '/en/services/moving-uppsala',
  '/tjanster/flytt-stockholm': '/en/services/moving-stockholm',
  
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
  '/ai': '/en/ai',
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
