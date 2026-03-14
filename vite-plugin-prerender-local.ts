/**
 * Vite Plugin: Pre-render static HTML for all local service pages + blog posts
 * Generates unique <head> tags (title, description, canonical, hreflang, JSON-LD)
 * so Googlebot sees unique SEO content without running JavaScript.
 */
import type { Plugin } from 'vite';
import { ALL_BLOG_SLUGS } from './src/data/blogSlugs';

const BASE_URL = 'https://fixco.se';

// ─── Service definitions (mirrored from localServiceData.ts for build-time use) ───
const BASE_SERVICES = [
  { slug: 'snickare', name: 'Snickare', rotRut: 'ROT' },
  { slug: 'elektriker', name: 'Elektriker', rotRut: 'ROT' },
  { slug: 'vvs', name: 'VVS', rotRut: 'ROT' },
  { slug: 'malare', name: 'Målare', rotRut: 'ROT' },
  { slug: 'tradgard', name: 'Trädgård', rotRut: 'ROT' },
  { slug: 'stad', name: 'Städ', rotRut: 'RUT' },
  { slug: 'markarbeten', name: 'Markarbeten', rotRut: 'ROT' },
  { slug: 'montering', name: 'Montering', rotRut: 'ROT' },
  { slug: 'flytt', name: 'Flytt', rotRut: 'RUT' },
  { slug: 'tekniska-installationer', name: 'Tekniska installationer', rotRut: 'ROT' },
  { slug: 'koksmontering', name: 'Köksmontering', rotRut: 'ROT' },
  { slug: 'mobelmontering', name: 'Möbelmontering', rotRut: 'RUT' },
  { slug: 'badrumsrenovering', name: 'Badrumsrenovering', rotRut: 'ROT' },
  { slug: 'koksrenovering', name: 'Köksrenovering', rotRut: 'ROT' },
  { slug: 'altanbygge', name: 'Altanbygge', rotRut: 'ROT' },
  { slug: 'fasadmalning', name: 'Fasadmålning', rotRut: 'ROT' },
  { slug: 'inomhusmalning', name: 'Inomhusmålning', rotRut: 'ROT' },
  { slug: 'golvlaggning', name: 'Golvläggning', rotRut: 'ROT' },
  { slug: 'elinstallation', name: 'Elinstallation', rotRut: 'ROT' },
  { slug: 'rivning', name: 'Rivning', rotRut: 'ROT' },
] as const;

// Expanded services (131 slugs from seoSlugsExpansion.ts)
const EXPANDED_SERVICES = [
  { slug: 'totalrenovering', name: 'Totalrenovering', rotRut: 'ROT' },
  { slug: 'renovering', name: 'Renovering', rotRut: 'ROT' },
  { slug: 'hantverkare', name: 'Hantverkare', rotRut: 'ROT' },
  { slug: 'byggfirma', name: 'Byggfirma', rotRut: 'ROT' },
  { slug: 'byggtjanster', name: 'Byggtjänster', rotRut: 'ROT' },
  { slug: 'husrenovering', name: 'Husrenovering', rotRut: 'ROT' },
  { slug: 'villarenovering', name: 'Villarenovering', rotRut: 'ROT' },
  { slug: 'lagenhetsrenovering', name: 'Lägenhetsrenovering', rotRut: 'ROT' },
  { slug: 'ombyggnad', name: 'Ombyggnad', rotRut: 'ROT' },
  { slug: 'utbyggnad', name: 'Utbyggnad', rotRut: 'ROT' },
  { slug: 'tillbyggnad', name: 'Tillbyggnad', rotRut: 'ROT' },
  { slug: 'fonsterbyte', name: 'Fönsterbyte', rotRut: 'ROT' },
  { slug: 'dorrbyte', name: 'Dörrbyte', rotRut: 'ROT' },
  { slug: 'fasadrenovering', name: 'Fasadrenovering', rotRut: 'ROT' },
  { slug: 'trapprenovering', name: 'Trapprenovering', rotRut: 'ROT' },
  { slug: 'taklaggning', name: 'Takläggning', rotRut: 'ROT' },
  { slug: 'takbyte', name: 'Takbyte', rotRut: 'ROT' },
  { slug: 'takrenovering', name: 'Takrenovering', rotRut: 'ROT' },
  { slug: 'verandarenovering', name: 'Verandarenovering', rotRut: 'ROT' },
  { slug: 'entrerenoverning', name: 'Entrérenoverning', rotRut: 'ROT' },
  { slug: 'vardagsrumsrenovering', name: 'Vardagsrumsrenovering', rotRut: 'ROT' },
  { slug: 'sovrumsrenovering', name: 'Sovrumsrenovering', rotRut: 'ROT' },
  { slug: 'kontorsbygge', name: 'Kontorsbygge', rotRut: 'ROT' },
  { slug: 'bostadsanpassning', name: 'Bostadsanpassning', rotRut: 'ROT' },
  { slug: 'platsbyggt', name: 'Platsbyggt', rotRut: 'ROT' },
  { slug: 'kok', name: 'Kök', rotRut: 'ROT' },
  { slug: 'koksbyte', name: 'Köksbyte', rotRut: 'ROT' },
  { slug: 'ikea-koksmontage', name: 'IKEA-köksmontage', rotRut: 'ROT' },
  { slug: 'koksinstallation', name: 'Köksinstallation', rotRut: 'ROT' },
  { slug: 'koksdesign', name: 'Köksdesign', rotRut: 'ROT' },
  { slug: 'nytt-kok', name: 'Nytt kök', rotRut: 'ROT' },
  { slug: 'koksluckor', name: 'Köksluckor', rotRut: 'ROT' },
  { slug: 'bankskiva', name: 'Bänkskiva', rotRut: 'ROT' },
  { slug: 'platsbyggt-kok', name: 'Platsbyggt kök', rotRut: 'ROT' },
  { slug: 'koksplanering', name: 'Köksplanering', rotRut: 'ROT' },
  { slug: 'vitvaruinstallation-kok', name: 'Vitvaruinstallation kök', rotRut: 'ROT' },
  { slug: 'diskbanksbyte', name: 'Diskbänksbyte', rotRut: 'ROT' },
  { slug: 'koksbelysning', name: 'Köksbelysning', rotRut: 'ROT' },
  { slug: 'koksflakt', name: 'Köksfläkt', rotRut: 'ROT' },
  { slug: 'stankskydd', name: 'Stänkskydd', rotRut: 'ROT' },
  { slug: 'badrum', name: 'Badrum', rotRut: 'ROT' },
  { slug: 'badrumskakel', name: 'Badrumskakel', rotRut: 'ROT' },
  { slug: 'plattsattning', name: 'Plattsättning', rotRut: 'ROT' },
  { slug: 'tatskikt', name: 'Tätskikt', rotRut: 'ROT' },
  { slug: 'wc-renovering', name: 'WC-renovering', rotRut: 'ROT' },
  { slug: 'duschrum', name: 'Duschrum', rotRut: 'ROT' },
  { slug: 'duschvagg', name: 'Duschvägg', rotRut: 'ROT' },
  { slug: 'badrumsinredning', name: 'Badrumsinredning', rotRut: 'ROT' },
  { slug: 'tvattrum', name: 'Tvättrum', rotRut: 'ROT' },
  { slug: 'badrumsgolv', name: 'Badrumsgolv', rotRut: 'ROT' },
  { slug: 'elarbeten', name: 'Elarbeten', rotRut: 'ROT' },
  { slug: 'elreparation', name: 'Elreparation', rotRut: 'ROT' },
  { slug: 'laddbox', name: 'Laddbox', rotRut: 'ROT' },
  { slug: 'laddboxinstallation', name: 'Laddboxinstallation', rotRut: 'ROT' },
  { slug: 'sakringsbyte', name: 'Säkringsbyte', rotRut: 'ROT' },
  { slug: 'belysning', name: 'Belysning', rotRut: 'ROT' },
  { slug: 'elcentral', name: 'Elcentral', rotRut: 'ROT' },
  { slug: 'eljour', name: 'Eljour', rotRut: 'ROT' },
  { slug: 'lampmontering', name: 'Lampmontering', rotRut: 'ROT' },
  { slug: 'spotlights', name: 'Spotlights', rotRut: 'ROT' },
  { slug: 'elbesiktning', name: 'Elbesiktning', rotRut: 'ROT' },
  { slug: 'jordfelsbrytare', name: 'Jordfelsbrytare', rotRut: 'ROT' },
  { slug: 'vvs-arbeten', name: 'VVS-arbeten', rotRut: 'ROT' },
  { slug: 'rorjour', name: 'Rörjour', rotRut: 'ROT' },
  { slug: 'rorarbeten', name: 'Rörarbeten', rotRut: 'ROT' },
  { slug: 'varmepump', name: 'Värmepump', rotRut: 'ROT' },
  { slug: 'vattenlas', name: 'Vattenlås', rotRut: 'ROT' },
  { slug: 'avlopp', name: 'Avlopp', rotRut: 'ROT' },
  { slug: 'golvvarme', name: 'Golvvärme', rotRut: 'ROT' },
  { slug: 'vattenbatteri', name: 'Vattenbatteri', rotRut: 'ROT' },
  { slug: 'blandarbyte', name: 'Blandarbyte', rotRut: 'ROT' },
  { slug: 'radiatorbyte', name: 'Radiatorbyte', rotRut: 'ROT' },
  { slug: 'malning', name: 'Målning', rotRut: 'ROT' },
  { slug: 'tapetsering', name: 'Tapetsering', rotRut: 'ROT' },
  { slug: 'spackling', name: 'Spackling', rotRut: 'ROT' },
  { slug: 'lackering', name: 'Lackering', rotRut: 'ROT' },
  { slug: 'fonstermalning', name: 'Fönstermålning', rotRut: 'ROT' },
  { slug: 'takmalning', name: 'Takmålning', rotRut: 'ROT' },
  { slug: 'trappmalning', name: 'Trappmålning', rotRut: 'ROT' },
  { slug: 'snickerimlaning', name: 'Snickerimålning', rotRut: 'ROT' },
  { slug: 'golvslipning', name: 'Golvslipning', rotRut: 'ROT' },
  { slug: 'parkettlaggning', name: 'Parkettläggning', rotRut: 'ROT' },
  { slug: 'laminatgolv', name: 'Laminatgolv', rotRut: 'ROT' },
  { slug: 'vinylgolv', name: 'Vinylgolv', rotRut: 'ROT' },
  { slug: 'klinkergolv', name: 'Klinkergolv', rotRut: 'ROT' },
  { slug: 'epoxigolv', name: 'Epoxigolv', rotRut: 'ROT' },
  { slug: 'golvbyte', name: 'Golvbyte', rotRut: 'ROT' },
  { slug: 'tradgardsanlaggning', name: 'Trädgårdsanläggning', rotRut: 'ROT' },
  { slug: 'tradgardsskotsel', name: 'Trädgårdsskötsel', rotRut: 'ROT' },
  { slug: 'grasklippning', name: 'Gräsklippning', rotRut: 'ROT' },
  { slug: 'hackklippning', name: 'Häckklippning', rotRut: 'ROT' },
  { slug: 'tradbeskaring', name: 'Trädbeskärning', rotRut: 'ROT' },
  { slug: 'tradgardsdesign', name: 'Trädgårdsdesign', rotRut: 'ROT' },
  { slug: 'stenlaggning-tradgard', name: 'Stenläggning trädgård', rotRut: 'ROT' },
  { slug: 'buskrojning', name: 'Buskröjning', rotRut: 'ROT' },
  { slug: 'dranering', name: 'Dränering', rotRut: 'ROT' },
  { slug: 'schaktning', name: 'Schaktning', rotRut: 'ROT' },
  { slug: 'plattlaggning', name: 'Plattläggning', rotRut: 'ROT' },
  { slug: 'stenlaggning', name: 'Stenläggning', rotRut: 'ROT' },
  { slug: 'asfaltering', name: 'Asfaltering', rotRut: 'ROT' },
  { slug: 'murverk', name: 'Murverk', rotRut: 'ROT' },
  { slug: 'uppfart', name: 'Uppfart', rotRut: 'ROT' },
  { slug: 'garageuppfart', name: 'Garageuppfart', rotRut: 'ROT' },
  { slug: 'hemstad', name: 'Hemstäd', rotRut: 'RUT' },
  { slug: 'flyttstad', name: 'Flyttstäd', rotRut: 'RUT' },
  { slug: 'byggstad', name: 'Byggstäd', rotRut: 'RUT' },
  { slug: 'fonsterputs', name: 'Fönsterputs', rotRut: 'RUT' },
  { slug: 'storstadning', name: 'Storstädning', rotRut: 'RUT' },
  { slug: 'kontorsstad', name: 'Kontorsstäd', rotRut: 'RUT' },
  { slug: 'dodsbo', name: 'Dödsbo', rotRut: 'RUT' },
  { slug: 'trappstad', name: 'Trappstäd', rotRut: 'RUT' },
  { slug: 'garderobsmontering', name: 'Garderobsmontering', rotRut: 'ROT' },
  { slug: 'tv-montering', name: 'TV-montering', rotRut: 'RUT' },
  { slug: 'persiennmontering', name: 'Persiennmontering', rotRut: 'RUT' },
  { slug: 'hyllmontering', name: 'Hyllmontering', rotRut: 'RUT' },
  { slug: 'ikeamontering', name: 'IKEA-montering', rotRut: 'RUT' },
  { slug: 'dorrmontering', name: 'Dörrmontering', rotRut: 'ROT' },
  { slug: 'flytthjalp', name: 'Flytthjälp', rotRut: 'RUT' },
  { slug: 'packhjalp', name: 'Packhjälp', rotRut: 'RUT' },
  { slug: 'kontorsflytt', name: 'Kontorsflytt', rotRut: 'RUT' },
  { slug: 'magasinering', name: 'Magasinering', rotRut: 'RUT' },
  { slug: 'pianoflytt', name: 'Pianoflytt', rotRut: 'RUT' },
  { slug: 'larm', name: 'Larm', rotRut: 'ROT' },
  { slug: 'smarthome', name: 'Smart Home', rotRut: 'ROT' },
  { slug: 'natverksinstallation', name: 'Nätverksinstallation', rotRut: 'ROT' },
  { slug: 'kameraovervakning', name: 'Kameraövervakning', rotRut: 'ROT' },
  { slug: 'solceller', name: 'Solceller', rotRut: 'ROT' },
  { slug: 'porttelefon', name: 'Porttelefon', rotRut: 'ROT' },
  { slug: 'rivning-badrum', name: 'Rivning badrum', rotRut: 'ROT' },
  { slug: 'rivning-kok', name: 'Rivning kök', rotRut: 'ROT' },
  { slug: 'bortforsling', name: 'Bortforsling', rotRut: 'ROT' },
];

// Expanded slugs disabled in prerender to maximize build speed.
// All expanded slugs still resolve via SPA routing + sitemap indexing.
const TOP_EXPANDED_SERVICES: typeof EXPANDED_SERVICES = [];

// Keep only core, highest-converting base services in prerender.
const CORE_BASE_SERVICES = BASE_SERVICES.filter(s => [
  'snickare','elektriker','vvs','malare','stad',
  'flytt','koksrenovering','badrumsrenovering','altanbygge','golvlaggning',
].includes(s.slug));

const ALL_SERVICES = [...CORE_BASE_SERVICES, ...TOP_EXPANDED_SERVICES];

// ─── Areas ───
const STOCKHOLM_AREAS: Array<[string, string]> = [
  ['Stockholm', 'stockholm'], ['Bromma', 'bromma'], ['Hägersten', 'hagersten'],
  ['Kungsholmen', 'kungsholmen'], ['Södermalm', 'sodermalm'], ['Vasastan', 'vasastan'],
  ['Östermalm', 'ostermalm'], ['Danderyd', 'danderyd'], ['Ekerö', 'ekero'],
  ['Haninge', 'haninge'], ['Huddinge', 'huddinge'], ['Järfälla', 'jarfalla'],
  ['Järna', 'jarna'], ['Lidingö', 'lidingo'], ['Märsta', 'marsta'],
  ['Nacka', 'nacka'], ['Norrtälje', 'norrtalje'], ['Nykvarn', 'nykvarn'],
  ['Nynäshamn', 'nynashamn'], ['Salem', 'salem'], ['Sigtuna', 'sigtuna'],
  ['Sollentuna', 'sollentuna'], ['Solna', 'solna'], ['Sundbyberg', 'sundbyberg'],
  ['Södertälje', 'sodertalje'], ['Tyresö', 'tyreso'], ['Täby', 'taby'],
  ['Upplands Väsby', 'upplands-vasby'], ['Upplands-Bro', 'upplands-bro'],
  ['Vallentuna', 'vallentuna'], ['Vaxholm', 'vaxholm'], ['Värmdö', 'varmdo'],
  ['Åkersberga', 'akersberga'], ['Botkyrka', 'botkyrka'],
];

const UPPSALA_AREAS: Array<[string, string]> = [
  ['Uppsala', 'uppsala'], ['Knivsta', 'knivsta'], ['Enköping', 'enkoping'],
  ['Tierp', 'tierp'], ['Östhammar', 'osthammar'], ['Storvreta', 'storvreta'],
  ['Björklinge', 'bjorklinge'], ['Bälinge', 'balinge'], ['Vattholma', 'vattholma'],
  ['Alsike', 'alsike'], ['Gränby', 'granby'], ['Sävja', 'savja'],
  ['Eriksberg', 'eriksberg'], ['Gottsunda', 'gottsunda'], ['Sunnersta', 'sunnersta'],
  ['Skyttorp', 'skyttorp'], ['Lövstalöt', 'lovstalot'], ['Gamla Uppsala', 'gamla-uppsala'],
  ['Ultuna', 'ultuna'],
];

const PRIORITY_AREA_SLUGS = [
  'stockholm','bromma','kungsholmen','sodermalm','ostermalm',
  'solna','sundbyberg','nacka','huddinge','taby','danderyd',
  'uppsala','knivsta','alsike','enkoping','tierp',
] as const;

const ALL_AREAS = [...STOCKHOLM_AREAS, ...UPPSALA_AREAS].filter(([, slug]) =>
  PRIORITY_AREA_SLUGS.includes(slug as typeof PRIORITY_AREA_SLUGS[number])
);

// ─── Area hierarchy ───
const MAIN_CITIES = ['Stockholm', 'Uppsala'];
const SUB_AREAS_STOCKHOLM = ['Bromma', 'Hägersten', 'Kungsholmen', 'Södermalm', 'Vasastan', 'Östermalm'];
const SUB_AREAS_UPPSALA = ['Storvreta', 'Björklinge', 'Bälinge', 'Vattholma', 'Alsike', 'Gränby', 'Sävja', 'Eriksberg', 'Gottsunda', 'Sunnersta', 'Skyttorp', 'Lövstalöt', 'Gamla Uppsala', 'Ultuna'];
const ALL_SUB_AREAS = [...SUB_AREAS_STOCKHOLM, ...SUB_AREAS_UPPSALA];

function getAreaTier(areaName: string): 'main' | 'large' | 'sub' {
  if (MAIN_CITIES.includes(areaName)) return 'main';
  if (ALL_SUB_AREAS.includes(areaName)) return 'sub';
  return 'large';
}

function getParentCity(areaSlug: string): string {
  const isStockholm = STOCKHOLM_AREAS.some(([, slug]) => slug === areaSlug);
  return isStockholm ? 'Stockholm' : 'Uppsala';
}

function getParentCityByName(areaName: string): string {
  const isStockholm = STOCKHOLM_AREAS.some(([name]) => name === areaName);
  return isStockholm ? 'Stockholm' : 'Uppsala';
}

// ─── 3-tier title/desc templates ───
// Each service has [main, large, sub] variants
type TierTemplates = { main: string; large: string; sub: string };

const SV_TITLE_TIERS: Record<string, TierTemplates> = {
  'snickare': { main: 'Boka Snickare i {area} ★ Hela {area} län · ROT 30% · Fri offert', large: 'Boka Snickare i {area} ★ Alla byggtjänster · ROT 30% · Fri offert', sub: 'Snickare i {area} · Nära dig i {parent} · ROT 30%' },
  'elektriker': { main: 'Elektriker i {area} ★ Alla eljobb · Certifierade · ROT 30%', large: 'Boka Elektriker i {area} ★ Alla eljobb · Certifierade · ROT 30%', sub: 'Elektriker i {area} · Nära dig i {parent} · Certifierade · ROT 30%' },
  'vvs': { main: 'VVS-montör i {area} ★ Allt inom VVS · ROT 30% · Svar 24h', large: 'Boka VVS i {area} ★ Allt inom VVS · ROT 30% · Svar 24h', sub: 'VVS i {area} · Nära dig i {parent} · ROT 30%' },
  'malare': { main: 'Boka Målare i {area} ★ In- & utvändigt · Fasta priser · ROT 30%', large: 'Boka Målare i {area} ★ In- & utvändigt · Fasta priser · ROT 30%', sub: 'Målare i {area} · Nära dig i {parent} · ROT 30%' },
  'stad': { main: 'Städfirma i {area} ★ Alla typer av städ · RUT 50% · Boka idag', large: 'Boka Städfirma i {area} ★ Alla typer av städ · RUT 50% · Boka idag', sub: 'Städfirma i {area} · Nära dig i {parent} · RUT 50%' },
  'flytt': { main: 'Flytthjälp i {area} ★ Komplett flyttservice · RUT 50% · Fri offert', large: 'Boka Flytthjälp i {area} ★ Komplett flyttservice · RUT 50% · Fri offert', sub: 'Flytthjälp i {area} · Nära dig i {parent} · RUT 50%' },
  'markarbeten': { main: 'Markarbeten i {area} ★ Schakt, dränering & plattor · ROT 30%', large: 'Boka Markarbeten i {area} ★ Alla markjobb · ROT 30% · Fri offert', sub: 'Markarbeten i {area} · Nära dig i {parent} · ROT 30%' },
  'montering': { main: 'Monteringshjälp i {area} ★ IKEA, kök & möbler · ROT 30%', large: 'Boka Monteringshjälp i {area} ★ Alla typer av montering · ROT 30%', sub: 'Monteringshjälp i {area} · Nära dig i {parent} · ROT 30%' },
  'tradgard': { main: 'Trädgårdshjälp i {area} ★ Träd, häck & anläggning · ROT 30%', large: 'Boka Trädgårdshjälp i {area} ★ Alla trädgårdstjänster · ROT 30%', sub: 'Trädgårdshjälp i {area} · Nära dig i {parent} · ROT 30%' },
  'tekniska-installationer': { main: 'Teknisk installation i {area} ★ Laddbox & smarta hem · ROT 30%', large: 'Boka Teknisk installation i {area} ★ Alla installationer · ROT 30%', sub: 'Teknisk installation i {area} · Nära dig i {parent} · ROT 30%' },
  'koksmontering': { main: 'Köksmontering i {area} ★ IKEA-kök & platsbyggt · ROT 30% · Fri offert', large: 'Boka Köksmontering i {area} ★ Alla kök · ROT 30% · Fri offert', sub: 'Köksmontering i {area} · Nära dig i {parent} · ROT 30%' },
  'mobelmontering': { main: 'Möbelmontering i {area} ★ IKEA, garderober & hyllsystem · RUT 50%', large: 'Boka Möbelmontering i {area} ★ Alla möbler · RUT 50%', sub: 'Möbelmontering i {area} · Nära dig i {parent} · RUT 50%' },
  'badrumsrenovering': { main: 'Badrumsrenovering i {area} ★ Totalrenovering · ROT 30% · Fri offert', large: 'Boka Badrumsrenovering i {area} ★ Helhetslösning · ROT 30% · Fri offert', sub: 'Badrumsrenovering i {area} · Nära dig i {parent} · ROT 30%' },
  'koksrenovering': { main: 'Köksrenovering i {area} ★ Helhetslösning · ROT 30% · Fri offert', large: 'Boka Köksrenovering i {area} ★ Helhetslösning · ROT 30% · Fri offert', sub: 'Köksrenovering i {area} · Nära dig i {parent} · ROT 30%' },
  'altanbygge': { main: 'Altanbygge i {area} ★ Skräddarsytt · ROT 30% · Fri offert', large: 'Boka Altanbygge i {area} ★ Skräddarsytt · ROT 30% · Fri offert', sub: 'Altanbygge i {area} · Nära dig i {parent} · ROT 30%' },
  'fasadmalning': { main: 'Fasadmålning i {area} ★ Utvändig målning & puts · ROT 30%', large: 'Boka Fasadmålning i {area} ★ Alla fasadarbeten · ROT 30%', sub: 'Fasadmålning i {area} · Nära dig i {parent} · ROT 30%' },
  'inomhusmalning': { main: 'Inomhusmålning i {area} ★ Tapetsering & spackling · ROT 30%', large: 'Boka Inomhusmålning i {area} ★ Alla invändiga måleriarbeten · ROT 30%', sub: 'Inomhusmålning i {area} · Nära dig i {parent} · ROT 30%' },
  'golvlaggning': { main: 'Golvläggning i {area} ★ Alla golvtyper · ROT 30% · Fri offert', large: 'Boka Golvläggning i {area} ★ Alla golvtyper · ROT 30% · Fri offert', sub: 'Golvläggning i {area} · Nära dig i {parent} · ROT 30%' },
  'elinstallation': { main: 'Elinstallation i {area} ★ Uttag, belysning & laddbox · ROT 30%', large: 'Boka Elinstallation i {area} ★ Alla eljobb · ROT 30%', sub: 'Elinstallation i {area} · Nära dig i {parent} · ROT 30%' },
  'rivning': { main: 'Rivning i {area} ★ Snabbt & prisvärt · ROT 30% · Fri offert', large: 'Boka Rivning i {area} ★ Snabbt & prisvärt · ROT 30% · Fri offert', sub: 'Rivning i {area} · Nära dig i {parent} · ROT 30%' },
};

const EN_TITLE_TIERS: Record<string, TierTemplates> = {
  'snickare': { main: 'Book Carpenter in {area} ★ All of {area} county · ROT 30% · Free quote', large: 'Book Carpenter in {area} ★ All construction services · ROT 30% · Free quote', sub: 'Carpenter in {area} · Near you in {parent} · ROT 30%' },
  'elektriker': { main: 'Electrician in {area} ★ All electrical work · Certified · ROT 30%', large: 'Book Electrician in {area} ★ All electrical work · Certified · ROT 30%', sub: 'Electrician in {area} · Near you in {parent} · Certified · ROT 30%' },
  'vvs': { main: 'Plumber in {area} ★ All plumbing services · ROT 30% · Response 24h', large: 'Book Plumber in {area} ★ All plumbing services · ROT 30% · Response 24h', sub: 'Plumber in {area} · Near you in {parent} · ROT 30%' },
  'malare': { main: 'Book Painter in {area} ★ Interior & exterior · Fixed prices · ROT 30%', large: 'Book Painter in {area} ★ Interior & exterior · Fixed prices · ROT 30%', sub: 'Painter in {area} · Near you in {parent} · ROT 30%' },
  'stad': { main: 'Cleaning in {area} ★ All types of cleaning · RUT 50% · Book today', large: 'Book Cleaning in {area} ★ All types of cleaning · RUT 50% · Book today', sub: 'Cleaning in {area} · Near you in {parent} · RUT 50%' },
  'flytt': { main: 'Moving help in {area} ★ Complete moving service · RUT 50% · Free quote', large: 'Book Moving help in {area} ★ Complete moving service · RUT 50% · Free quote', sub: 'Moving help in {area} · Near you in {parent} · RUT 50%' },
  'markarbeten': { main: 'Groundwork in {area} ★ Excavation, drainage & paving · ROT 30%', large: 'Book Groundwork in {area} ★ All ground services · ROT 30% · Free quote', sub: 'Groundwork in {area} · Near you in {parent} · ROT 30%' },
  'montering': { main: 'Assembly in {area} ★ IKEA, kitchen & furniture · ROT 30%', large: 'Book Assembly in {area} ★ All types of assembly · ROT 30%', sub: 'Assembly in {area} · Near you in {parent} · ROT 30%' },
  'tradgard': { main: 'Gardening in {area} ★ Trees, hedges & landscaping · ROT 30%', large: 'Book Gardening in {area} ★ All garden services · ROT 30%', sub: 'Gardening in {area} · Near you in {parent} · ROT 30%' },
  'tekniska-installationer': { main: 'Technical installation in {area} ★ EV charger & smart home · ROT 30%', large: 'Book Technical installation in {area} ★ All installations · ROT 30%', sub: 'Technical installation in {area} · Near you in {parent} · ROT 30%' },
  'koksmontering': { main: 'Kitchen Assembly in {area} ★ IKEA kitchen & custom · ROT 30% · Free quote', large: 'Book Kitchen Assembly in {area} ★ All kitchens · ROT 30% · Free quote', sub: 'Kitchen Assembly in {area} · Near you in {parent} · ROT 30%' },
  'mobelmontering': { main: 'Furniture Assembly in {area} ★ IKEA, wardrobes & shelving · RUT 50%', large: 'Book Furniture Assembly in {area} ★ All furniture · RUT 50%', sub: 'Furniture Assembly in {area} · Near you in {parent} · RUT 50%' },
  'badrumsrenovering': { main: 'Bathroom Renovation in {area} ★ Full renovation · ROT 30% · Free quote', large: 'Book Bathroom Renovation in {area} ★ Complete solution · ROT 30% · Free quote', sub: 'Bathroom Renovation in {area} · Near you in {parent} · ROT 30%' },
  'koksrenovering': { main: 'Kitchen Renovation in {area} ★ Complete solution · ROT 30% · Free quote', large: 'Book Kitchen Renovation in {area} ★ Complete solution · ROT 30% · Free quote', sub: 'Kitchen Renovation in {area} · Near you in {parent} · ROT 30%' },
  'altanbygge': { main: 'Deck Building in {area} ★ Custom built · ROT 30% · Free quote', large: 'Book Deck Building in {area} ★ Custom built · ROT 30% · Free quote', sub: 'Deck Building in {area} · Near you in {parent} · ROT 30%' },
  'fasadmalning': { main: 'Facade Painting in {area} ★ Exterior painting & plaster · ROT 30%', large: 'Book Facade Painting in {area} ★ All facade work · ROT 30%', sub: 'Facade Painting in {area} · Near you in {parent} · ROT 30%' },
  'inomhusmalning': { main: 'Interior Painting in {area} ★ Wallpapering & plastering · ROT 30%', large: 'Book Interior Painting in {area} ★ All interior painting · ROT 30%', sub: 'Interior Painting in {area} · Near you in {parent} · ROT 30%' },
  'golvlaggning': { main: 'Floor Installation in {area} ★ All floor types · ROT 30% · Free quote', large: 'Book Floor Installation in {area} ★ All floor types · ROT 30% · Free quote', sub: 'Floor Installation in {area} · Near you in {parent} · ROT 30%' },
  'elinstallation': { main: 'Electrical Installation in {area} ★ Outlets, lighting & EV charger · ROT 30%', large: 'Book Electrical Installation in {area} ★ All electrical work · ROT 30%', sub: 'Electrical Installation in {area} · Near you in {parent} · ROT 30%' },
  'rivning': { main: 'Demolition in {area} ★ Fast & affordable · ROT 30% · Free quote', large: 'Book Demolition in {area} ★ Fast & affordable · ROT 30% · Free quote', sub: 'Demolition in {area} · Near you in {parent} · ROT 30%' },
};

const SV_DESC_TIERS: Record<string, TierTemplates> = {
  'snickare': { main: 'Snickare i {area} ★ 5/5 betyg ✓ Alla byggtjänster i hela {area} län ✓ 30% ROT-avdrag ✓ Fast pris. Få offert inom 24h!', large: 'Snickare i {area} ★ 5/5 betyg ✓ Alla byggtjänster ✓ 30% ROT-avdrag ✓ Fast pris. Få offert inom 24h!', sub: 'Snickare i {area} ★ 5/5 betyg ✓ Lokal hantverkare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'elektriker': { main: 'Elektriker i {area} ★ 5/5 betyg ✓ Alla eljobb i hela {area} län ✓ Auktoriserad ✓ 30% ROT-avdrag. Boka idag!', large: 'Elektriker i {area} ★ 5/5 betyg ✓ Alla eljobb ✓ Auktoriserad ✓ 30% ROT-avdrag. Boka idag!', sub: 'Elektriker i {area} ★ 5/5 betyg ✓ Lokal elektriker nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'vvs': { main: 'VVS-montör i {area} ★ 5/5 betyg ✓ Allt inom VVS i hela {area} län ✓ Auktoriserad ✓ 30% ROT-avdrag. Få offert inom 24h!', large: 'VVS-montör i {area} ★ 5/5 betyg ✓ Allt inom VVS ✓ Auktoriserad ✓ 30% ROT-avdrag. Få offert inom 24h!', sub: 'VVS i {area} ★ 5/5 betyg ✓ Lokal VVS-montör nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'malare': { main: 'Målare i {area} ★ 5/5 betyg ✓ In- & utvändig målning i hela {area} län ✓ 30% ROT-avdrag ✓ Garanti. Boka målare!', large: 'Målare i {area} ★ 5/5 betyg ✓ In- & utvändig målning ✓ 30% ROT-avdrag ✓ Garanti. Boka målare!', sub: 'Målare i {area} ★ 5/5 betyg ✓ Lokal målare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'stad': { main: 'Städfirma i {area} ★ 5/5 betyg ✓ Alla typer av städ i hela {area} län ✓ 50% RUT-avdrag ✓ Kvalitetsgaranti. Boka idag!', large: 'Städfirma i {area} ★ 5/5 betyg ✓ Alla typer av städ ✓ 50% RUT-avdrag ✓ Kvalitetsgaranti. Boka idag!', sub: 'Städfirma i {area} ★ 5/5 betyg ✓ Lokal städhjälp nära dig i {parent} ✓ 50% RUT-avdrag. Boka idag!' },
  'flytt': { main: 'Flytthjälp i {area} ★ 5/5 betyg ✓ Komplett flyttservice i hela {area} län ✓ 50% RUT-avdrag ✓ Försäkrad flytt. Fri offert!', large: 'Flytthjälp i {area} ★ 5/5 betyg ✓ Komplett flyttservice ✓ 50% RUT-avdrag ✓ Försäkrad flytt. Fri offert!', sub: 'Flytthjälp i {area} ★ 5/5 betyg ✓ Lokal flyttfirma nära dig i {parent} ✓ 50% RUT-avdrag. Boka idag!' },
  'montering': { main: 'Monteringshjälp i {area} ★ 5/5 betyg ✓ Alla typer av montering ✓ 30% ROT-avdrag. Ofta start samma dag!', large: 'Monteringshjälp i {area} ★ 5/5 betyg ✓ Alla typer av montering ✓ 30% ROT-avdrag. Ofta start samma dag!', sub: 'Monteringshjälp i {area} ★ 5/5 betyg ✓ Lokal montör nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'tradgard': { main: 'Trädgårdshjälp i {area} ★ 5/5 betyg ✓ Alla trädgårdstjänster ✓ 30% ROT-avdrag. Boka trädgårdsmästare!', large: 'Trädgårdshjälp i {area} ★ 5/5 betyg ✓ Alla trädgårdstjänster ✓ 30% ROT-avdrag. Boka trädgårdsmästare!', sub: 'Trädgårdshjälp i {area} ★ 5/5 betyg ✓ Lokal trädgårdsmästare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'markarbeten': { main: 'Markarbeten i {area} ★ 5/5 betyg ✓ Alla markjobb ✓ 30% ROT-avdrag. Gratis offert inom 24h!', large: 'Markarbeten i {area} ★ 5/5 betyg ✓ Alla markjobb ✓ 30% ROT-avdrag. Gratis offert inom 24h!', sub: 'Markarbeten i {area} ★ 5/5 betyg ✓ Lokal markentreprenör nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'tekniska-installationer': { main: 'Teknisk installation i {area} ★ 5/5 betyg ✓ Alla installationer ✓ 30% ROT-avdrag. Boka certifierad montör!', large: 'Teknisk installation i {area} ★ 5/5 betyg ✓ Alla installationer ✓ 30% ROT-avdrag. Boka certifierad montör!', sub: 'Teknisk installation i {area} ★ 5/5 betyg ✓ Lokal montör nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'koksmontering': { main: 'Köksmontering i {area} ★ 5/5 betyg ✓ Alla kök ✓ 30% ROT-avdrag. Fri offert!', large: 'Köksmontering i {area} ★ 5/5 betyg ✓ Alla kök ✓ 30% ROT-avdrag. Fri offert!', sub: 'Köksmontering i {area} ★ 5/5 betyg ✓ Lokal montör nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'mobelmontering': { main: 'Möbelmontering i {area} ★ 5/5 betyg ✓ Alla möbler ✓ 50% RUT-avdrag. Ofta start samma dag!', large: 'Möbelmontering i {area} ★ 5/5 betyg ✓ Alla möbler ✓ 50% RUT-avdrag. Ofta start samma dag!', sub: 'Möbelmontering i {area} ★ 5/5 betyg ✓ Lokal montör nära dig i {parent} ✓ 50% RUT-avdrag. Boka idag!' },
  'badrumsrenovering': { main: 'Badrumsrenovering i {area} ★ 5/5 betyg ✓ Totalrenovering i hela {area} län ✓ 30% ROT-avdrag. Gratis offert!', large: 'Badrumsrenovering i {area} ★ 5/5 betyg ✓ Helhetslösning ✓ 30% ROT-avdrag. Gratis offert!', sub: 'Badrumsrenovering i {area} ★ 5/5 betyg ✓ Lokal hantverkare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'koksrenovering': { main: 'Köksrenovering i {area} ★ 5/5 betyg ✓ Helhetslösning i hela {area} län ✓ 30% ROT-avdrag. Gratis offert!', large: 'Köksrenovering i {area} ★ 5/5 betyg ✓ Helhetslösning ✓ 30% ROT-avdrag. Gratis offert!', sub: 'Köksrenovering i {area} ★ 5/5 betyg ✓ Lokal hantverkare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'altanbygge': { main: 'Altanbygge i {area} ★ 5/5 betyg ✓ Skräddarsytt i hela {area} län ✓ 30% ROT-avdrag. Gratis offert!', large: 'Altanbygge i {area} ★ 5/5 betyg ✓ Skräddarsytt ✓ 30% ROT-avdrag. Gratis offert!', sub: 'Altanbygge i {area} ★ 5/5 betyg ✓ Lokal hantverkare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'fasadmalning': { main: 'Fasadmålning i {area} ★ 5/5 betyg ✓ Alla fasadarbeten ✓ 30% ROT-avdrag ✓ Garanti. Boka målare!', large: 'Fasadmålning i {area} ★ 5/5 betyg ✓ Alla fasadarbeten ✓ 30% ROT-avdrag ✓ Garanti. Boka målare!', sub: 'Fasadmålning i {area} ★ 5/5 betyg ✓ Lokal målare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'inomhusmalning': { main: 'Inomhusmålning i {area} ★ 5/5 betyg ✓ Alla invändiga måleriarbeten ✓ 30% ROT-avdrag ✓ Garanti. Boka målare!', large: 'Inomhusmålning i {area} ★ 5/5 betyg ✓ Alla invändiga måleriarbeten ✓ 30% ROT-avdrag ✓ Garanti. Boka målare!', sub: 'Inomhusmålning i {area} ★ 5/5 betyg ✓ Lokal målare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'golvlaggning': { main: 'Golvläggning i {area} ★ 5/5 betyg ✓ Alla golvtyper ✓ 30% ROT-avdrag. Gratis offert inom 24h!', large: 'Golvläggning i {area} ★ 5/5 betyg ✓ Alla golvtyper ✓ 30% ROT-avdrag. Gratis offert inom 24h!', sub: 'Golvläggning i {area} ★ 5/5 betyg ✓ Lokal golvläggare nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'elinstallation': { main: 'Elinstallation i {area} ★ 5/5 betyg ✓ Alla eljobb ✓ Auktoriserad ✓ 30% ROT-avdrag. Boka idag!', large: 'Elinstallation i {area} ★ 5/5 betyg ✓ Alla eljobb ✓ Auktoriserad ✓ 30% ROT-avdrag. Boka idag!', sub: 'Elinstallation i {area} ★ 5/5 betyg ✓ Lokal elektriker nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
  'rivning': { main: 'Rivning i {area} ★ 5/5 betyg ✓ Snabbt & prisvärt ✓ 30% ROT-avdrag. Gratis offert!', large: 'Rivning i {area} ★ 5/5 betyg ✓ Snabbt & prisvärt ✓ 30% ROT-avdrag. Gratis offert!', sub: 'Rivning i {area} ★ 5/5 betyg ✓ Lokal rivningsfirma nära dig i {parent} ✓ 30% ROT-avdrag. Boka idag!' },
};

const EN_DESC_TIERS: Record<string, TierTemplates> = {
  'snickare': { main: 'Carpenter in {area} ★ 5/5 rating ✓ All construction services across {area} county ✓ 30% ROT deduction ✓ Fixed price. Get quote within 24h!', large: 'Carpenter in {area} ★ 5/5 rating ✓ All construction services ✓ 30% ROT deduction ✓ Fixed price. Get quote within 24h!', sub: 'Carpenter in {area} ★ 5/5 rating ✓ Local contractor near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'elektriker': { main: 'Electrician in {area} ★ 5/5 rating ✓ All electrical work across {area} county ✓ Certified ✓ 30% ROT deduction. Book today!', large: 'Electrician in {area} ★ 5/5 rating ✓ All electrical work ✓ Certified ✓ 30% ROT deduction. Book today!', sub: 'Electrician in {area} ★ 5/5 rating ✓ Local electrician near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'vvs': { main: 'Plumber in {area} ★ 5/5 rating ✓ All plumbing services across {area} county ✓ Certified ✓ 30% ROT deduction. Get quote within 24h!', large: 'Plumber in {area} ★ 5/5 rating ✓ All plumbing services ✓ Certified ✓ 30% ROT deduction. Get quote within 24h!', sub: 'Plumber in {area} ★ 5/5 rating ✓ Local plumber near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'malare': { main: 'Painter in {area} ★ 5/5 rating ✓ Interior & exterior painting across {area} county ✓ 30% ROT deduction ✓ Guarantee. Book painter!', large: 'Painter in {area} ★ 5/5 rating ✓ Interior & exterior painting ✓ 30% ROT deduction ✓ Guarantee. Book painter!', sub: 'Painter in {area} ★ 5/5 rating ✓ Local painter near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'stad': { main: 'Cleaning in {area} ★ 5/5 rating ✓ All types of cleaning across {area} county ✓ 50% RUT deduction ✓ Quality guarantee. Book today!', large: 'Cleaning in {area} ★ 5/5 rating ✓ All types of cleaning ✓ 50% RUT deduction ✓ Quality guarantee. Book today!', sub: 'Cleaning in {area} ★ 5/5 rating ✓ Local cleaning near you in {parent} ✓ 50% RUT deduction. Book today!' },
  'flytt': { main: 'Moving help in {area} ★ 5/5 rating ✓ Complete moving service across {area} county ✓ 50% RUT deduction ✓ Insured. Free quote!', large: 'Moving help in {area} ★ 5/5 rating ✓ Complete moving service ✓ 50% RUT deduction ✓ Insured. Free quote!', sub: 'Moving help in {area} ★ 5/5 rating ✓ Local movers near you in {parent} ✓ 50% RUT deduction. Book today!' },
  'montering': { main: 'Assembly in {area} ★ 5/5 rating ✓ All types of assembly ✓ 30% ROT deduction. Often same-day start!', large: 'Assembly in {area} ★ 5/5 rating ✓ All types of assembly ✓ 30% ROT deduction. Often same-day start!', sub: 'Assembly in {area} ★ 5/5 rating ✓ Local assembler near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'tradgard': { main: 'Gardening in {area} ★ 5/5 rating ✓ All garden services ✓ 30% ROT deduction. Book gardener!', large: 'Gardening in {area} ★ 5/5 rating ✓ All garden services ✓ 30% ROT deduction. Book gardener!', sub: 'Gardening in {area} ★ 5/5 rating ✓ Local gardener near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'markarbeten': { main: 'Groundwork in {area} ★ 5/5 rating ✓ All ground services ✓ 30% ROT deduction. Free quote within 24h!', large: 'Groundwork in {area} ★ 5/5 rating ✓ All ground services ✓ 30% ROT deduction. Free quote within 24h!', sub: 'Groundwork in {area} ★ 5/5 rating ✓ Local contractor near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'tekniska-installationer': { main: 'Technical installation in {area} ★ 5/5 rating ✓ All installations ✓ 30% ROT deduction. Book certified installer!', large: 'Technical installation in {area} ★ 5/5 rating ✓ All installations ✓ 30% ROT deduction. Book certified installer!', sub: 'Technical installation in {area} ★ 5/5 rating ✓ Local installer near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'koksmontering': { main: 'Kitchen assembly in {area} ★ 5/5 rating ✓ All kitchens ✓ 30% ROT deduction. Free quote!', large: 'Kitchen assembly in {area} ★ 5/5 rating ✓ All kitchens ✓ 30% ROT deduction. Free quote!', sub: 'Kitchen assembly in {area} ★ 5/5 rating ✓ Local assembler near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'mobelmontering': { main: 'Furniture assembly in {area} ★ 5/5 rating ✓ All furniture ✓ 50% RUT deduction. Often same-day!', large: 'Furniture assembly in {area} ★ 5/5 rating ✓ All furniture ✓ 50% RUT deduction. Often same-day!', sub: 'Furniture assembly in {area} ★ 5/5 rating ✓ Local assembler near you in {parent} ✓ 50% RUT deduction. Book today!' },
  'badrumsrenovering': { main: 'Bathroom renovation in {area} ★ 5/5 rating ✓ Full renovation across {area} county ✓ 30% ROT deduction. Free quote!', large: 'Bathroom renovation in {area} ★ 5/5 rating ✓ Complete solution ✓ 30% ROT deduction. Free quote!', sub: 'Bathroom renovation in {area} ★ 5/5 rating ✓ Local contractor near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'koksrenovering': { main: 'Kitchen renovation in {area} ★ 5/5 rating ✓ Complete solution across {area} county ✓ 30% ROT deduction. Free quote!', large: 'Kitchen renovation in {area} ★ 5/5 rating ✓ Complete solution ✓ 30% ROT deduction. Free quote!', sub: 'Kitchen renovation in {area} ★ 5/5 rating ✓ Local contractor near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'altanbygge': { main: 'Deck building in {area} ★ 5/5 rating ✓ Custom built across {area} county ✓ 30% ROT deduction. Free quote!', large: 'Deck building in {area} ★ 5/5 rating ✓ Custom built ✓ 30% ROT deduction. Free quote!', sub: 'Deck building in {area} ★ 5/5 rating ✓ Local contractor near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'fasadmalning': { main: 'Facade painting in {area} ★ 5/5 rating ✓ All facade work ✓ 30% ROT deduction ✓ Guarantee. Book painter!', large: 'Facade painting in {area} ★ 5/5 rating ✓ All facade work ✓ 30% ROT deduction ✓ Guarantee. Book painter!', sub: 'Facade painting in {area} ★ 5/5 rating ✓ Local painter near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'inomhusmalning': { main: 'Interior painting in {area} ★ 5/5 rating ✓ All interior painting ✓ 30% ROT deduction ✓ Guarantee. Book painter!', large: 'Interior painting in {area} ★ 5/5 rating ✓ All interior painting ✓ 30% ROT deduction ✓ Guarantee. Book painter!', sub: 'Interior painting in {area} ★ 5/5 rating ✓ Local painter near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'golvlaggning': { main: 'Floor installation in {area} ★ 5/5 rating ✓ All floor types ✓ 30% ROT deduction. Free quote within 24h!', large: 'Floor installation in {area} ★ 5/5 rating ✓ All floor types ✓ 30% ROT deduction. Free quote within 24h!', sub: 'Floor installation in {area} ★ 5/5 rating ✓ Local installer near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'elinstallation': { main: 'Electrical installation in {area} ★ 5/5 rating ✓ All electrical work ✓ Certified ✓ 30% ROT deduction. Book today!', large: 'Electrical installation in {area} ★ 5/5 rating ✓ All electrical work ✓ Certified ✓ 30% ROT deduction. Book today!', sub: 'Electrical installation in {area} ★ 5/5 rating ✓ Local electrician near you in {parent} ✓ 30% ROT deduction. Book today!' },
  'rivning': { main: 'Demolition in {area} ★ 5/5 rating ✓ Fast & affordable ✓ 30% ROT deduction. Free quote!', large: 'Demolition in {area} ★ 5/5 rating ✓ Fast & affordable ✓ 30% ROT deduction. Free quote!', sub: 'Demolition in {area} ★ 5/5 rating ✓ Local demolition near you in {parent} ✓ 30% ROT deduction. Book today!' },
};

// ─── Helpers ───
function getTitle(slug: string, areaName: string, locale: 'sv' | 'en'): string {
  const tiers = locale === 'sv' ? SV_TITLE_TIERS : EN_TITLE_TIERS;
  const tier = getAreaTier(areaName);
  const parent = getParentCityByName(areaName);
  if (tiers[slug]) {
    return tiers[slug][tier].replace(/\{area\}/g, areaName).replace(/\{parent\}/g, parent);
  }
  // Fallback for expanded services
  const svc = ALL_SERVICES.find(s => s.slug === slug);
  const name = svc?.name || slug;
  const rr = svc?.rotRut || 'ROT';
  if (tier === 'sub') {
    return locale === 'sv'
      ? `${name} i ${areaName} · Nära dig i ${parent} · ${rr} 30%`
      : `${name} in ${areaName} · Near you in ${parent} · ${rr} 30%`;
  }
  const prefix = tier === 'main' ? '' : (locale === 'sv' ? 'Boka ' : 'Book ');
  return locale === 'sv'
    ? `${prefix}${name} i ${areaName} ★ Professionella hantverkare · ${rr} 30% · Fri offert`
    : `${prefix}${name} in ${areaName} ★ Professional contractors · ${rr} 30% · Free quote`;
}

function getDescription(slug: string, areaName: string, locale: 'sv' | 'en'): string {
  const tiers = locale === 'sv' ? SV_DESC_TIERS : EN_DESC_TIERS;
  const tier = getAreaTier(areaName);
  const parent = getParentCityByName(areaName);
  if (tiers[slug]) {
    return tiers[slug][tier].replace(/\{area\}/g, areaName).replace(/\{parent\}/g, parent);
  }
  const svc = ALL_SERVICES.find(s => s.slug === slug);
  const name = svc?.name || slug;
  const rr = svc?.rotRut || 'ROT';
  if (tier === 'sub') {
    return locale === 'sv'
      ? `${name} i ${areaName} ★ 5/5 betyg ✓ Lokal hantverkare nära dig i ${parent} ✓ 30% ${rr}-avdrag. Boka idag!`
      : `${name} in ${areaName} ★ 5/5 rating ✓ Local contractor near you in ${parent} ✓ 30% ${rr} deduction. Book today!`;
  }
  return locale === 'sv'
    ? `${name} i ${areaName} ★ 5/5 betyg ✓ Professionella hantverkare ✓ 30% ${rr}-avdrag ✓ Fast pris ✓ Kvalitetsgaranti. Få offert inom 24h!`
    : `${name} in ${areaName} ★ 5/5 rating ✓ Professional contractors ✓ 30% ${rr} deduction ✓ Fixed price ✓ Quality guarantee. Get quote within 24h!`;
}

function getRegion(areaSlug: string): string {
  const isStockholm = STOCKHOLM_AREAS.some(([, slug]) => slug === areaSlug);
  return isStockholm ? 'Stockholm' : 'Uppsala';
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── HTML Generator ───
function generateHtml(
  serviceSlug: string,
  serviceName: string,
  areaSlug: string,
  areaName: string,
  locale: 'sv' | 'en',
  cssLinks: string[],
  jsEntries: string[],
): string {
  const title = escapeHtml(getTitle(serviceSlug, areaName, locale));
  const description = escapeHtml(getDescription(serviceSlug, areaName, locale));
  const region = getRegion(areaSlug);

  const svPath = `/tjanster/${serviceSlug}/${areaSlug}`;
  const enPath = `/en/services/${serviceSlug}/${areaSlug}`;
  const canonical = locale === 'sv' ? `${BASE_URL}${svPath}` : `${BASE_URL}${enPath}`;
  const svUrl = `${BASE_URL}${svPath}`;
  const enUrl = `${BASE_URL}${enPath}`;

  const svc = ALL_SERVICES.find(s => s.slug === serviceSlug);
  const rotRut = svc?.rotRut || 'ROT';

  // JSON-LD: LocalBusiness + BreadcrumbList
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "name": `Fixco ${serviceName} ${areaName}`,
        "description": getDescription(serviceSlug, areaName, locale),
        "url": canonical,
        "telephone": "+46-79-335-02-28",
        "priceRange": "$$",
        "areaServed": { "@type": "City", "name": areaName },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": areaName,
          "addressRegion": region,
          "addressCountry": "SE"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "127",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": locale === 'sv' ? "Hem" : "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": locale === 'sv' ? "Tjänster" : "Services", "item": locale === 'sv' ? `${BASE_URL}/tjanster` : `${BASE_URL}/en/services` },
          { "@type": "ListItem", "position": 3, "name": serviceName, "item": locale === 'sv' ? `${BASE_URL}/tjanster/${serviceSlug}` : `${BASE_URL}/en/services/${serviceSlug}` },
          { "@type": "ListItem", "position": 4, "name": `${serviceName} ${areaName}`, "item": canonical }
        ]
      }
    ]
  });

  const cssTags = cssLinks.map(f => `    <link rel="stylesheet" href="/${f}" />`).join('\n');
  const jsTags = jsEntries.map(f => `    <script type="module" crossorigin src="/${f}"></script>`).join('\n');

  return `<!DOCTYPE html>
<html lang="${locale === 'sv' ? 'sv' : 'en'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="hsl(240, 8%, 7%)" />
    <link rel="icon" type="image/png" href="/assets/fixco-f-icon-large.png" />
    <link rel="apple-touch-icon" href="/assets/fixco-f-icon-large.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;700&family=Playfair+Display:ital,wght@0,400;1,700&family=Outfit:wght@400;500;600;700&display=swap" media="print" onload="this.media='all';this.onload=null;" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="sv" href="${svUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${svUrl}" />
    <meta name="geo.region" content="SE-${region === 'Stockholm' ? 'AB' : 'C'}" />
    <meta name="geo.placename" content="${escapeHtml(areaName)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="Fixco" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${BASE_URL}/assets/hero-construction.jpg" />
    <meta property="og:locale" content="${locale === 'sv' ? 'sv_SE' : 'en_US'}" />
    <script type="application/ld+json">${jsonLd}</script>
${cssTags}
${jsTags}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// ─── Plugin ───
export function prerenderLocalPlugin(): Plugin {
  return {
    name: 'vite-plugin-prerender-local',
    enforce: 'post',

    generateBundle(_options: unknown, bundle: Record<string, unknown>) {
      // Find CSS and JS entry files from the bundle
      const cssFiles: string[] = [];
      const jsEntries: string[] = [];

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith('.css')) {
          cssFiles.push(fileName);
        }
        const c = chunk as Record<string, unknown>;
        if (c.type === 'chunk' && c.isEntry) {
          jsEntries.push(fileName);
        }
      }

      let count = 0;

      for (const svc of ALL_SERVICES) {
        for (const [areaName, areaSlug] of ALL_AREAS) {
          // Swedish version
          const svFileName = `tjanster/${svc.slug}/${areaSlug}/index.html`;
          this.emitFile({
            type: 'asset',
            fileName: svFileName,
            source: generateHtml(svc.slug, svc.name, areaSlug, areaName, 'sv', cssFiles, jsEntries),
          });

          // English version
          const enFileName = `en/services/${svc.slug}/${areaSlug}/index.html`;
          this.emitFile({
            type: 'asset',
            fileName: enFileName,
            source: generateHtml(svc.slug, svc.name, areaSlug, areaName, 'en', cssFiles, jsEntries),
          });

          count += 2;
        }
      }

      // ─── Blog prerendering ───
      for (const post of ALL_BLOG_SLUGS) {
        const blogTitle = escapeHtml(post.title + ' | Fixco');
        const blogCssLinks = cssFiles.map(f => `    <link rel="stylesheet" href="/${f}" />`).join('\n');
        const blogJsTags = jsEntries.map(f => `    <script type="module" crossorigin src="/${f}"></script>`).join('\n');
        
        for (const locale of ['sv', 'en'] as const) {
          const path = locale === 'sv' ? `blogg/${post.slug}` : `en/blog/${post.slug}`;
          const canonical = `${BASE_URL}/${path}`;
          const svUrl = `${BASE_URL}/blogg/${post.slug}`;
          const enUrl = `${BASE_URL}/en/blog/${post.slug}`;
          
          const html = `<!DOCTYPE html>
<html lang="${locale === 'sv' ? 'sv' : 'en'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="hsl(240, 8%, 7%)" />
    <link rel="icon" type="image/png" href="/assets/fixco-f-icon-large.png" />
    <title>${blogTitle}</title>
    <meta name="description" content="${escapeHtml(post.title)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="sv" href="${svUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${svUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${blogTitle}" />
    <meta property="og:site_name" content="Fixco" />
${blogCssLinks}
${blogJsTags}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
          
          this.emitFile({
            type: 'asset',
            fileName: `${path}/index.html`,
            source: html,
          });
          count++;
        }
      }

      console.log(`[prerender-local] Generated ${count} static HTML files (incl. ${ALL_BLOG_SLUGS.length * 2} blog)`);
    },
  };
}
