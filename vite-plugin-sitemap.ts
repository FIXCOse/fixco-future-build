/**
 * Vite Plugin: Auto-generate sitemap.xml with all 8000+ URLs
 * Generates sitemap index + sub-sitemaps at build time & serves in dev
 */
import type { Plugin } from 'vite';

const BASE_URL = 'https://fixco.se';

// Dynamic lastmod: vary by category to signal freshness to crawlers
const TODAY = new Date().toISOString().split('T')[0];
const CATEGORY_LASTMOD: Record<string, string> = {
  // High-priority categories get recent dates
  'snickare': TODAY,
  'elektriker': TODAY,
  'vvs': TODAY,
  'malare': TODAY,
  'badrumsrenovering': TODAY,
  'koksrenovering': TODAY,
  'totalrenovering': TODAY,
  'renovering': TODAY,
  'hantverkare': TODAY,
  'byggfirma': TODAY,
  'stad': '2026-03-10',
  'flytt': '2026-03-10',
  'tradgard': '2026-03-08',
  'markarbeten': '2026-03-08',
  'montering': '2026-03-06',
  'tekniska-installationer': '2026-03-06',
};
const DEFAULT_LASTMOD = '2026-03-01';

function getLastmod(slug?: string): string {
  if (!slug) return TODAY;
  return CATEGORY_LASTMOD[slug] || DEFAULT_LASTMOD;
}

// ─── All 151 service slugs (20 base + 131 expanded) ───
const ALL_SERVICE_SLUGS = [
  // Base (20)
  'snickare','elektriker','vvs','malare','tradgard','stad','markarbeten','montering','flytt','tekniska-installationer',
  'koksmontering','mobelmontering','badrumsrenovering','koksrenovering','altanbygge','fasadmalning','inomhusmalning','golvlaggning','elinstallation','rivning',
  // Expanded: Snickeri & Bygg (25)
  'totalrenovering','renovering','hantverkare','byggfirma','byggtjanster','husrenovering','villarenovering','lagenhetsrenovering','ombyggnad','utbyggnad','tillbyggnad','fonsterbyte','dorrbyte','fasadrenovering','trapprenovering','taklaggning','takbyte','takrenovering','verandarenovering','entrerenoverning','vardagsrumsrenovering','sovrumsrenovering','kontorsbygge','bostadsanpassning','platsbyggt',
  // Expanded: Kök (15)
  'kok','koksbyte','ikea-koksmontage','koksinstallation','koksdesign','nytt-kok','koksluckor','bankskiva','platsbyggt-kok','koksplanering','vitvaruinstallation-kok','diskbanksbyte','koksbelysning','koksflakt','stankskydd',
  // Expanded: Badrum (10)
  'badrum','badrumskakel','plattsattning','tatskikt','wc-renovering','duschrum','duschvagg','badrumsinredning','tvattrum','badrumsgolv',
  // Expanded: El (12)
  'elarbeten','elreparation','laddbox','laddboxinstallation','sakringsbyte','belysning','elcentral','eljour','lampmontering','spotlights','elbesiktning','jordfelsbrytare',
  // Expanded: VVS (10)
  'vvs-arbeten','rorjour','rorarbeten','varmepump','vattenlas','avlopp','golvvarme','vattenbatteri','blandarbyte','radiatorbyte',
  // Expanded: Målning (8)
  'malning','tapetsering','spackling','lackering','fonstermalning','takmalning','trappmalning','snickerimlaning',
  // Expanded: Golv (7)
  'golvslipning','parkettlaggning','laminatgolv','vinylgolv','klinkergolv','epoxigolv','golvbyte',
  // Expanded: Trädgård (8)
  'tradgardsanlaggning','tradgardsskotsel','grasklippning','hackklippning','tradbeskaring','tradgardsdesign','stenlaggning-tradgard','buskrojning',
  // Expanded: Markarbeten (8)
  'dranering','schaktning','plattlaggning','stenlaggning','asfaltering','murverk','uppfart','garageuppfart',
  // Expanded: Städ (8)
  'hemstad','flyttstad','byggstad','fonsterputs','storstadning','kontorsstad','dodsbo','trappstad',
  // Expanded: Montering (6)
  'garderobsmontering','tv-montering','persiennmontering','hyllmontering','ikeamontering','dorrmontering',
  // Expanded: Flytt (5)
  'flytthjalp','packhjalp','kontorsflytt','magasinering','pianoflytt',
  // Expanded: Teknik (6)
  'larm','smarthome','natverksinstallation','kameraovervakning','solceller','porttelefon',
  // Expanded: Rivning (3)
  'rivning-badrum','rivning-kok','bortforsling',
];

// ─── All 53 area slugs (34 Stockholm + 19 Uppsala) ───
const STOCKHOLM_AREA_SLUGS = [
  'stockholm','bromma','hagersten','kungsholmen','sodermalm','vasastan','ostermalm',
  'danderyd','ekero','haninge','huddinge','jarfalla','jarna','lidingo',
  'marsta','nacka','norrtalje','nykvarn','nynashamn','salem','sigtuna',
  'sollentuna','solna','sundbyberg','sodertalje','tyreso','taby',
  'upplands-vasby','upplands-bro','vallentuna','vaxholm','varmdo','akersberga','botkyrka',
];

const UPPSALA_AREA_SLUGS = [
  'uppsala','knivsta','enkoping','tierp','osthammar',
  'storvreta','bjorklinge','balinge','vattholma','alsike',
  'granby','savja','eriksberg','gottsunda','sunnersta',
  'skyttorp','lovstalot','gamla-uppsala','ultuna',
];

const ALL_AREA_SLUGS = [...STOCKHOLM_AREA_SLUGS, ...UPPSALA_AREA_SLUGS];

// Priority: main cities get higher priority
const HIGH_PRIORITY_AREAS = new Set(['stockholm', 'uppsala', 'solna', 'sundbyberg', 'nacka', 'danderyd', 'taby', 'lidingo']);

// ─── Main pages with hreflang ───
const MAIN_PAGES: Array<{ sv: string; en: string; priority: string; changefreq: string }> = [
  { sv: '/', en: '/en/', priority: '1.00', changefreq: 'daily' },
  { sv: '/tjanster', en: '/en/services', priority: '0.95', changefreq: 'weekly' },
  { sv: '/kontakt', en: '/en/contact', priority: '0.85', changefreq: 'monthly' },
  { sv: '/om-oss', en: '/en/about', priority: '0.80', changefreq: 'monthly' },
  { sv: '/karriar', en: '/en/careers', priority: '0.75', changefreq: 'monthly' },
  { sv: '/referenser', en: '/en/references', priority: '0.80', changefreq: 'weekly' },
  { sv: '/smart-hem', en: '/en/smart-home', priority: '0.80', changefreq: 'monthly' },
  { sv: '/ai', en: '/en/ai', priority: '0.75', changefreq: 'monthly' },
  { sv: '/boka-hembesok', en: '/en/book-visit', priority: '0.85', changefreq: 'monthly' },
  { sv: '/rot-info', en: '/en/rot-info', priority: '0.70', changefreq: 'monthly' },
  { sv: '/rut', en: '/en/rut', priority: '0.70', changefreq: 'monthly' },
  { sv: '/faq', en: '/en/faq', priority: '0.70', changefreq: 'monthly' },
  { sv: '/terms', en: '/en/terms', priority: '0.30', changefreq: 'yearly' },
  { sv: '/privacy', en: '/en/privacy', priority: '0.30', changefreq: 'yearly' },
];

function xmlHeader(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n`;
}

function generateSitemapIndex(): string {
  const sitemaps = [
    `${BASE_URL}/sitemap-main.xml`,
    `${BASE_URL}/sitemap-hubs.xml`,
    `${BASE_URL}/sitemap-local-stockholm.xml`,
    `${BASE_URL}/sitemap-local-uppsala.xml`,
  ];
  let xml = xmlHeader();
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const loc of sitemaps) {
    xml += `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n`;
  }
  xml += `</sitemapindex>\n`;
  return xml;
}

function generateMainSitemap(): string {
  let xml = xmlHeader();
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  
  for (const page of MAIN_PAGES) {
    // Swedish version
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.sv}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${BASE_URL}${page.sv}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.en}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.sv}"/>\n`;
    xml += `  </url>\n`;
    // English version
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.en}</loc>\n`;
    xml += `    <lastmod>${LASTMOD}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.en}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${BASE_URL}${page.sv}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.sv}"/>\n`;
    xml += `  </url>\n`;
  }
  
  xml += `</urlset>\n`;
  return xml;
}

function generateHubsSitemap(): string {
  let xml = xmlHeader();
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  
  for (const slug of ALL_SERVICE_SLUGS) {
    const svLoc = `${BASE_URL}/tjanster/${slug}`;
    const enLoc = `${BASE_URL}/en/services/${slug}`;
    // Swedish version
    xml += `  <url>\n    <loc>${svLoc}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${svLoc}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${svLoc}"/>\n`;
    xml += `  </url>\n`;
    // English version
    xml += `  <url>\n    <loc>${enLoc}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.75</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${svLoc}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${svLoc}"/>\n`;
    xml += `  </url>\n`;
  }
  
  xml += `</urlset>\n`;
  return xml;
}

function generateLocalSitemap(areaSlugs: string[]): string {
  let xml = xmlHeader();
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  
  for (const slug of ALL_SERVICE_SLUGS) {
    for (const area of areaSlugs) {
      const priority = HIGH_PRIORITY_AREAS.has(area) ? '0.75' : '0.65';
      const svLoc = `${BASE_URL}/tjanster/${slug}/${area}`;
      const enLoc = `${BASE_URL}/en/services/${slug}/${area}`;
      // Swedish version
      xml += `  <url>\n    <loc>${svLoc}</loc>\n    <priority>${priority}</priority>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${svLoc}"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${svLoc}"/>\n`;
      xml += `  </url>\n`;
      // English version
      xml += `  <url>\n    <loc>${enLoc}</loc>\n    <priority>${Math.max(parseFloat(priority) - 0.05, 0.60).toFixed(2)}</priority>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${svLoc}"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${svLoc}"/>\n`;
      xml += `  </url>\n`;
    }
  }
  
  xml += `</urlset>\n`;
  return xml;
}

export function sitemapPlugin(): Plugin {
  const sitemapFiles: Record<string, string> = {};

  function buildSitemaps() {
    sitemapFiles['/sitemap.xml'] = generateSitemapIndex();
    sitemapFiles['/sitemap-main.xml'] = generateMainSitemap();
    sitemapFiles['/sitemap-hubs.xml'] = generateHubsSitemap();
    sitemapFiles['/sitemap-local-stockholm.xml'] = generateLocalSitemap(STOCKHOLM_AREA_SLUGS);
    sitemapFiles['/sitemap-local-uppsala.xml'] = generateLocalSitemap(UPPSALA_AREA_SLUGS);
  }

  return {
    name: 'vite-plugin-sitemap',

    // Serve sitemaps during dev
    configureServer(server) {
      buildSitemaps();
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url && sitemapFiles[url]) {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(sitemapFiles[url]);
          return;
        }
        next();
      });
    },

    // Emit sitemap files during build
    generateBundle() {
      buildSitemaps();
      for (const [filename, content] of Object.entries(sitemapFiles)) {
        this.emitFile({
          type: 'asset',
          fileName: filename.slice(1), // remove leading /
          source: content,
        });
      }
    },
  };
}
