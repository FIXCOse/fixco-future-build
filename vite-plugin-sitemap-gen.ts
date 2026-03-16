/**
 * Vite plugin that generates sitemap XML files into /public/ during buildStart.
 * This ensures sitemaps exist BEFORE Vite copies public/ to dist/.
 * Works in Lovable's build environment which runs `vite build` directly.
 */
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import type { Plugin } from 'vite';

const BASE_URL = 'https://fixco.se';

// ─── Lastmod — always today ───
function getLastmod() {
  return TODAY;
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

// ─── Main pages ───
const MAIN_PAGES = [
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

// ─── XML generators ───
function sitemapIndex(today: string) {
  const sitemaps = ['sitemap-main.xml','sitemap-hubs.xml','sitemap-blog.xml'];
  let xml = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const s of sitemaps) {
    xml += `  <sitemap>\n    <loc>${BASE_URL}/${s}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n`;
  }
  xml += `</sitemapindex>\n`;
  return xml;
}

function mainSitemap(today: string) {
  let xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  for (const p of MAIN_PAGES) {
    xml += `  <url>\n    <loc>${BASE_URL}${p.sv}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${BASE_URL}${p.sv}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${p.en}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${p.sv}"/>\n`;
    xml += `  </url>\n`;
    xml += `  <url>\n    <loc>${BASE_URL}${p.en}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${p.en}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${BASE_URL}${p.sv}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${p.sv}"/>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>\n`;
  return xml;
}

function hubsSitemap() {
  const ALL_AREAS = [...STOCKHOLM_AREAS, ...UPPSALA_AREAS];
  let xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  for (const slug of ALL_SERVICE_SLUGS) {
    // Hub page (no area)
    const sv = `${BASE_URL}/tjanster/${slug}`;
    const en = `${BASE_URL}/en/services/${slug}`;
    xml += `  <url>\n    <loc>${sv}</loc>\n    <lastmod>${getLastmod()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${sv}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${sv}"/>\n`;
    xml += `  </url>\n`;
    xml += `  <url>\n    <loc>${en}</loc>\n    <lastmod>${getLastmod(slug)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.75</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n    <xhtml:link rel="alternate" hreflang="sv" href="${sv}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${sv}"/>\n`;
    xml += `  </url>\n`;
    // Local area pages
    for (const area of ALL_AREAS) {
      const priority = HIGH_PRIORITY_AREAS.has(area) ? '0.75' : '0.65';
      const svLocal = `${BASE_URL}/tjanster/${slug}/${area}`;
      const enLocal = `${BASE_URL}/en/services/${slug}/${area}`;
      xml += `  <url>\n    <loc>${svLocal}</loc>\n    <lastmod>${getLastmod(slug)}</lastmod>\n    <priority>${priority}</priority>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${svLocal}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${enLocal}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${svLocal}"/>\n`;
      xml += `  </url>\n`;
      const enPri = Math.max(parseFloat(priority) - 0.05, 0.60).toFixed(2);
      xml += `  <url>\n    <loc>${enLocal}</loc>\n    <lastmod>${getLastmod(slug)}</lastmod>\n    <priority>${enPri}</priority>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enLocal}"/>\n    <xhtml:link rel="alternate" hreflang="sv" href="${svLocal}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${svLocal}"/>\n`;
      xml += `  </url>\n`;
    }
  }
  xml += `</urlset>\n`;
  return xml;
}

function blogSitemap(posts: Array<{ slug: string; updatedAt: string }>) {
  let xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  for (const p of posts) {
    const sv = `${BASE_URL}/blogg/${p.slug}`;
    const en = `${BASE_URL}/en/blog/${p.slug}`;
    xml += `  <url>\n    <loc>${sv}</loc>\n    <lastmod>${p.updatedAt}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="sv" href="${sv}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${sv}"/>\n`;
    xml += `  </url>\n`;
    xml += `  <url>\n    <loc>${en}</loc>\n    <lastmod>${p.updatedAt}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.60</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n    <xhtml:link rel="alternate" hreflang="sv" href="${sv}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${sv}"/>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>\n`;
  return xml;
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

      const files: Record<string, string> = {
        'sitemap.xml': sitemapIndex(today),
        'sitemap-main.xml': mainSitemap(today),
        'sitemap-hubs.xml': hubsSitemap(),
        'sitemap-blog.xml': blogSitemap(blogPosts),
      };

      for (const [name, content] of Object.entries(files)) {
        const filePath = join(publicDir, name);
        writeFileSync(filePath, content, 'utf-8');
        const urls = (content.match(/<loc>/g) || []).length;
        console.log(`  ✅ sitemap: ${name} (${urls} URLs, ${(content.length / 1024).toFixed(0)} KB)`);
      }
      console.log(`✅ All ${Object.keys(files).length} sitemap files written to public/`);
    },
  };
}
