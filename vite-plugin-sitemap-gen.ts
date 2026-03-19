/**
 * Vite plugin that generates Google-optimized sitemap XML files into /public/ during buildStart.
 * SWEDISH URLS ONLY — no /en/ pages.
 * Split into multiple files (max ~5000 URLs each).
 */
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import type { Plugin } from 'vite';

const BASE_URL = 'https://fixco.se';

// ─── XML helpers ───
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n';

function urlEntry(loc: string, opts: { lastmod: string; changefreq?: string; priority: string }) {
  let xml = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${opts.lastmod}</lastmod>\n`;
  if (opts.changefreq) xml += `    <changefreq>${opts.changefreq}</changefreq>\n`;
  xml += `    <priority>${opts.priority}</priority>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${loc}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />\n`;
  xml += `  </url>\n`;
  return xml;
}

function wrapUrlset(entries: string) {
  return XML_HEADER +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    entries +
    `</urlset>\n`;
}

// ─── 151 service slugs ───
const ALL_SERVICE_SLUGS = [
  'snickare','elektriker','vvs','malare','tradgard','stad','markarbeten','montering','flytt','tekniska-installationer',
  'koksmontering','mobelmontering','badrumsrenovering','koksrenovering','altanbygge','fasadmalning','inomhusmalning','golvlaggning','elinstallation','rivning',
  'totalrenovering','renovering','hantverkare','byggfirma','byggtjanster','husrenovering','villarenovering','lagenhetsrenovering','ombyggnad','utbyggnad','tillbyggnad','fonsterbyte','dorrbyte','fasadrenovering','trapprenovering','taklaggning','takbyte','takrenovering','verandarenovering','entrerenoverning','vardagsrumsrenovering','sovrumsrenovering','kontorsbygge','bostadsanpassning','platsbyggt',
  'kok','koksbyte','ikea-koksmontage','koksinstallation','koksdesign','nytt-kok','koksluckor','bankskiva','platsbyggt-kok','koksplanering','vitvaruinstallation-kok','diskbanksbyte','koksbelysning','koksflakt','stankskydd',
  'badrum','badrumskakel','plattsattning','tatskikt','wc-renovering','duschrum','duschvagg','badrumsinredning','tvattrum','badrumsgolv',
  'elarbeten','elreparation','laddbox','laddboxinstallation','sakringsbyte','belysning','elcentral','eljour','lampmontering','spotlights','elbesiktning','jordfelsbrytare',
  'vvs-arbeten','rorjour','rorarbeten','varmepump','vattenlas','avlopp','golvvarme','vattenbatteri','blandarbyte','radiatorbyte',
  'malning','tapetsering','spackling','lackering','fonstermalning','takmalning','trappmalning','snickerimlaning',
  'golvslipning','parkettlaggning','laminatgolv','vinylgolv','klinkergolv','epoxigolv','golvbyte',
  'tradgardsanlaggning','tradgardsskotsel','grasklippning','hackklippning','tradbeskaring','tradgardsdesign','stenlaggning-tradgard','buskrojning',
  'dranering','schaktning','plattlaggning','stenlaggning','asfaltering','murverk','uppfart','garageuppfart',
  'hemstad','flyttstad','byggstad','fonsterputs','storstadning','kontorsstad','dodsbo','trappstad',
  'garderobsmontering','tv-montering','persiennmontering','hyllmontering','ikeamontering','dorrmontering',
  'flytthjalp','packhjalp','kontorsflytt','magasinering','pianoflytt',
  'larm','smarthome','natverksinstallation','kameraovervakning','solceller','porttelefon',
  'rivning-badrum','rivning-kok','bortforsling',
  'montera-tv-pa-vagg','installera-akustikpanel','platsbyggd-garderob','platsbyggd-bokhylla','montera-spotlights','installera-laddbox-hemma','bygga-altan','montera-koksflakt','installera-golvvarme','bygga-bastu','montera-markis','installera-varmepump','renovera-trapp','bygga-carport','montera-takfonster','bygga-utekök','bygga-friggebod','montera-persienner','installera-solceller-hem','bygga-plank',
];

// ─── Area slugs ───
const STOCKHOLM_AREAS = [
  'stockholm','bromma','hagersten','kungsholmen','sodermalm','vasastan','ostermalm',
  'danderyd','ekero','haninge','huddinge','jarfalla','jarna','lidingo',
  'marsta','nacka','norrtalje','nykvarn','nynashamn','salem','sigtuna',
  'sollentuna','solna','sundbyberg','sodertalje','tyreso','taby',
  'upplands-vasby','upplands-bro','vallentuna','vaxholm','varmdo','akersberga','botkyrka',
];
const UPPSALA_AREAS = [
  'uppsala','knivsta','enkoping','tierp','osthammar',
  'storvreta','bjorklinge','balinge','vattholma','alsike',
  'granby','savja','eriksberg','gottsunda','sunnersta',
  'skyttorp','lovstalot','gamla-uppsala','ultuna',
];
const HIGH_PRIORITY_AREAS = new Set(['stockholm','uppsala','solna','sundbyberg','nacka','danderyd','taby','lidingo']);

// ─── Main pages (Swedish only) ───
const MAIN_PAGES = [
  { path: '/', priority: '1.00', changefreq: 'daily' },
  { path: '/tjanster', priority: '0.95', changefreq: 'weekly' },
  { path: '/kontakt', priority: '0.85', changefreq: 'monthly' },
  { path: '/om-oss', priority: '0.80', changefreq: 'monthly' },
  { path: '/karriar', priority: '0.75', changefreq: 'monthly' },
  { path: '/referenser', priority: '0.80', changefreq: 'weekly' },
  { path: '/smart-hem', priority: '0.80', changefreq: 'monthly' },
  { path: '/ai', priority: '0.75', changefreq: 'monthly' },
  { path: '/boka-hembesok', priority: '0.85', changefreq: 'monthly' },
  { path: '/rot-info', priority: '0.70', changefreq: 'monthly' },
  { path: '/rut', priority: '0.70', changefreq: 'monthly' },
  { path: '/faq', priority: '0.70', changefreq: 'monthly' },
  { path: '/terms', priority: '0.30', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.30', changefreq: 'yearly' },
];

// ─── Parse blog slugs ───
function parseBlogSlugs(root: string) {
  const tsContent = readFileSync(join(root, 'src', 'data', 'blogSlugs.ts'), 'utf-8');
  const entries: Array<{ slug: string; updatedAt: string }> = [];
  const re = /\{\s*slug:\s*'([^']+)',\s*title:\s*'[^']*',\s*updatedAt:\s*'([^']+)',\s*category:\s*'[^']*'\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tsContent)) !== null) {
    entries.push({ slug: m[1], updatedAt: m[2] });
  }
  return entries;
}

// ─── Plugin export ───
export function sitemapGeneratorPlugin(): Plugin {
  return {
    name: 'generate-sitemaps',
    buildStart() {
      const root = process.cwd();
      const publicDir = join(root, 'public');
      const today = new Date().toISOString().split('T')[0];
      const blogPosts = parseBlogSlugs(root);

      // Main pages
      let mainEntries = '';
      for (const p of MAIN_PAGES) {
        mainEntries += urlEntry(`${BASE_URL}${p.path}`, { lastmod: today, changefreq: p.changefreq, priority: p.priority });
      }

      // Services hub pages
      let servicesEntries = '';
      for (const slug of ALL_SERVICE_SLUGS) {
        servicesEntries += urlEntry(`${BASE_URL}/tjanster/${slug}`, { lastmod: today, changefreq: 'weekly', priority: '0.90' });
      }

      // Local Stockholm pages — split into two files to avoid Google fetch timeouts
      const STHLM_SPLIT = 76;
      const sthlmSlugs1 = ALL_SERVICE_SLUGS.slice(0, STHLM_SPLIT);
      const sthlmSlugs2 = ALL_SERVICE_SLUGS.slice(STHLM_SPLIT);

      let sthlmEntries1 = '';
      for (const slug of sthlmSlugs1) {
        for (const area of STOCKHOLM_AREAS) {
          const priority = HIGH_PRIORITY_AREAS.has(area) ? '0.85' : '0.80';
          sthlmEntries1 += urlEntry(`${BASE_URL}/tjanster/${slug}/${area}`, { lastmod: today, changefreq: 'weekly', priority });
        }
      }

      let sthlmEntries2 = '';
      for (const slug of sthlmSlugs2) {
        for (const area of STOCKHOLM_AREAS) {
          const priority = HIGH_PRIORITY_AREAS.has(area) ? '0.85' : '0.80';
          sthlmEntries2 += urlEntry(`${BASE_URL}/tjanster/${slug}/${area}`, { lastmod: today, changefreq: 'weekly', priority });
        }
      }

      // Local Uppsala pages
      let uppsalaEntries = '';
      for (const slug of ALL_SERVICE_SLUGS) {
        for (const area of UPPSALA_AREAS) {
          const priority = HIGH_PRIORITY_AREAS.has(area) ? '0.85' : '0.80';
          uppsalaEntries += urlEntry(`${BASE_URL}/tjanster/${slug}/${area}`, { lastmod: today, changefreq: 'weekly', priority });
        }
      }

      // Blog
      let blogEntries = '';
      for (const p of blogPosts) {
        blogEntries += urlEntry(`${BASE_URL}/blogg/${p.slug}`, { lastmod: p.updatedAt, changefreq: 'monthly', priority: '0.70' });
      }

      const sitemapNames = ['sitemap-main.xml', 'sitemap-services.xml', 'sitemap-local-sthlm-1.xml', 'sitemap-local-sthlm-2.xml', 'sitemap-local-uppsala.xml', 'sitemap-blog.xml'];

      // Sitemap index
      let indexXml = XML_HEADER + `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      for (const name of sitemapNames) {
        indexXml += `  <sitemap>\n    <loc>${BASE_URL}/${name}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
      }
      indexXml += `</sitemapindex>\n`;

      const files: Record<string, string> = {
        'sitemap.xml': indexXml,
        'sitemap-main.xml': wrapUrlset(mainEntries),
        'sitemap-services.xml': wrapUrlset(servicesEntries),
        'sitemap-local-sthlm-1.xml': wrapUrlset(sthlmEntries1),
        'sitemap-local-sthlm-2.xml': wrapUrlset(sthlmEntries2),
        'sitemap-local-uppsala.xml': wrapUrlset(uppsalaEntries),
        'sitemap-blog.xml': wrapUrlset(blogEntries),
      };

      for (const [name, content] of Object.entries(files)) {
        const filePath = join(publicDir, name);
        writeFileSync(filePath, content, 'utf-8');
        const urls = (content.match(/<loc>/g) || []).length;
        console.log(`  ✅ sitemap: ${name} — ${urls} URLs (${(content.length / 1024).toFixed(1)} KB)`);
      }
      console.log(`✅ All ${Object.keys(files).length} sitemap files written (Swedish only)`);
    },
  };
}
