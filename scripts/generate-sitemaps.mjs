#!/usr/bin/env node
/**
 * Generate Google-optimized sitemap XML files into /public/.
 * SWEDISH URLS ONLY — no /en/ pages.
 * Split into multiple files (max ~5000 URLs each).
 *
 * Usage: node scripts/generate-sitemaps.mjs
 */
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');
const BASE_URL = 'https://fixco.se';
const TODAY = new Date().toISOString().split('T')[0];

// ─── XML helpers ───
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n';

function urlEntry({ loc, lastmod, changefreq, priority }) {
  let xml = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod || TODAY}</lastmod>\n`;
  if (changefreq) xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += `    <priority>${priority}</priority>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${loc}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />\n`;
  xml += `  </url>\n`;
  return xml;
}

function wrapUrlset(entries) {
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

// ─── Parse blog slugs from TS file ───
function parseBlogSlugs() {
  const tsContent = readFileSync(join(__dirname, '..', 'src', 'data', 'blogSlugs.ts'), 'utf-8');
  const entries = [];
  const re = /\{\s*slug:\s*'([^']+)',\s*title:\s*'[^']*',\s*updatedAt:\s*'([^']+)',\s*category:\s*'[^']*'\s*\}/g;
  let m;
  while ((m = re.exec(tsContent)) !== null) {
    entries.push({ slug: m[1], updatedAt: m[2] });
  }
  return entries;
}

// ─── Generators ───
function generateSitemapIndex(sitemapNames) {
  let xml = XML_HEADER;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const name of sitemapNames) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/${name}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n`;
  }
  xml += `</sitemapindex>\n`;
  return xml;
}

function generateMainSitemap() {
  let entries = '';
  for (const p of MAIN_PAGES) {
    entries += urlEntry({
      loc: `${BASE_URL}${p.path}`,
      changefreq: p.changefreq,
      priority: p.priority,
    });
  }
  return wrapUrlset(entries);
}

function generateServicesSitemap() {
  let entries = '';
  for (const slug of ALL_SERVICE_SLUGS) {
    entries += urlEntry({
      loc: `${BASE_URL}/tjanster/${slug}`,
      changefreq: 'weekly',
      priority: '0.90',
    });
  }
  return wrapUrlset(entries);
}

function generateLocalSitemap(areas, slugs = ALL_SERVICE_SLUGS) {
  let entries = '';
  for (const slug of slugs) {
    for (const area of areas) {
      const priority = HIGH_PRIORITY_AREAS.has(area) ? '0.85' : '0.80';
      entries += urlEntry({
        loc: `${BASE_URL}/tjanster/${slug}/${area}`,
        changefreq: 'weekly',
        priority,
      });
    }
  }
  return wrapUrlset(entries);
}

function generateBlogSitemap(posts) {
  let entries = '';
  for (const p of posts) {
    entries += urlEntry({
      loc: `${BASE_URL}/blogg/${p.slug}`,
      lastmod: p.updatedAt,
      changefreq: 'monthly',
      priority: '0.70',
    });
  }
  return wrapUrlset(entries);
}

// ─── Main ───
console.log('🗺️  Generating Google-optimized sitemaps (Swedish only)...\n');
const blogPosts = parseBlogSlugs();

// Split Stockholm into two files to avoid Google fetch timeouts
const STHLM_SPLIT = 76;
const sthlmSlugs1 = ALL_SERVICE_SLUGS.slice(0, STHLM_SPLIT);
const sthlmSlugs2 = ALL_SERVICE_SLUGS.slice(STHLM_SPLIT);

const sitemapNames = [
  'sitemap-main.xml',
  'sitemap-services.xml',
  'sitemap-local-sthlm-1.xml',
  'sitemap-local-sthlm-2.xml',
  'sitemap-local-uppsala.xml',
  'sitemap-blog.xml',
];

const files = {
  'sitemap.xml': generateSitemapIndex(sitemapNames),
  'sitemap-main.xml': generateMainSitemap(),
  'sitemap-services.xml': generateServicesSitemap(),
  'sitemap-local-sthlm-1.xml': generateLocalSitemap(STOCKHOLM_AREAS, sthlmSlugs1),
  'sitemap-local-sthlm-2.xml': generateLocalSitemap(STOCKHOLM_AREAS, sthlmSlugs2),
  'sitemap-local-uppsala.xml': generateLocalSitemap(UPPSALA_AREAS),
  'sitemap-blog.xml': generateBlogSitemap(blogPosts),
};

for (const [name, content] of Object.entries(files)) {
  const path = join(PUBLIC, name);
  writeFileSync(path, content, 'utf-8');
  const urls = (content.match(/<loc>/g) || []).length;
  console.log(`  ✅ ${name} — ${urls} URLs (${(content.length / 1024).toFixed(1)} KB)`);
}

const totalUrls = Object.values(files).reduce((sum, c) => sum + (c.match(/<loc>/g) || []).length, 0);
console.log(`\n✅ ${Object.keys(files).length} sitemap-filer skrivna till public/ (totalt ${totalUrls} svenska URL:er)\n`);
