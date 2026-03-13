/**
 * Vite Plugin: Pre-render static HTML for all local service pages
 * Generates unique <head> tags (title, description, canonical, hreflang, JSON-LD)
 * so Googlebot sees unique SEO content without running JavaScript.
 * 
 * ~16,000 files: 151 services × 53 areas × 2 languages
 */
import type { Plugin } from 'vite';

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

// Top 4 highest-traffic expanded slugs only (minimal set for build speed)
// Remaining 125+ slugs work via SPA routing + sitemap indexing
const TOP_EXPANDED_SERVICES = EXPANDED_SERVICES.filter(s => [
  'totalrenovering','renovering','hantverkare','badrum',
].includes(s.slug));

const ALL_SERVICES = [...BASE_SERVICES, ...TOP_EXPANDED_SERVICES];

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

const ALL_AREAS = [...STOCKHOLM_AREAS, ...UPPSALA_AREAS];

// ─── Title templates (base 20 services get specific titles) ───
const SV_TITLES: Record<string, string> = {
  'snickare': 'Snickare {area} ★ Kök, garderob & altan · ROT 30% · Fri offert',
  'vvs': 'VVS {area} ★ Byte & reparation · ROT 30% · Svar 24h',
  'elektriker': 'Elektriker {area} ★ Certifierade · Laddbox & el · ROT 30%',
  'malare': 'Målare {area} ★ Fasad & invändigt · Fasta priser · ROT 30%',
  'stad': 'Städfirma {area} ★ Flytt, hem & byggstäd · RUT 30% · Boka idag',
  'flytt': 'Flytthjälp {area} ★ Pack & bärhjälp · RUT 30% · Snabb bokning',
  'markarbeten': 'Markarbeten {area} ★ Schakt, dränering & plattor · ROT 30%',
  'montering': 'Monteringshjälp {area} ★ IKEA, kök & möbler · ROT 30%',
  'tradgard': 'Trädgårdshjälp {area} ★ Träd, häck & anläggning · ROT 30%',
  'tekniska-installationer': 'Teknisk installation {area} ★ Laddbox & smarta hem · ROT 30%',
  'koksmontering': 'Köksmontering {area} ★ IKEA-kök & platsbyggt · ROT 30% · Fri offert',
  'mobelmontering': 'Möbelmontering {area} ★ IKEA, garderober & hyllsystem · RUT 30%',
  'badrumsrenovering': 'Badrumsrenovering {area} ★ Totalrenovering, kakel & VVS · ROT 30%',
  'koksrenovering': 'Köksrenovering {area} ★ Nytt kök, bänkskivor & vitvaror · ROT 30%',
  'altanbygge': 'Altanbygge {area} ★ Trädäck, inglasning & räcken · ROT 30%',
  'fasadmalning': 'Fasadmålning {area} ★ Utvändig målning & puts · ROT 30%',
  'inomhusmalning': 'Inomhusmålning {area} ★ Tapetsering & spackling · ROT 30%',
  'golvlaggning': 'Golvläggning {area} ★ Parkett, vinyl & klinker · ROT 30%',
  'elinstallation': 'Elinstallation {area} ★ Uttag, belysning & laddbox · ROT 30%',
  'rivning': 'Rivning {area} ★ Badrum, kök & innerväggar · ROT 30% · Fri offert',
};

const SV_DESCS: Record<string, string> = {
  'snickare': 'Snickare i {area} ★ 5/5 betyg ✓ Köksrenovering, altanbygge & golv ✓ 30% ROT-avdrag ✓ Fast pris. Få offert inom 24h!',
  'elektriker': 'Elektriker {area} ★ 5/5 betyg ✓ Elinstallation, uttag & belysning ✓ Auktoriserad ✓ 30% ROT-avdrag. Boka idag!',
  'vvs': 'VVS-montör {area} ★ 5/5 betyg ✓ Badrum, kök & värmesystem ✓ Auktoriserad ✓ 30% ROT-avdrag. Få offert inom 24h!',
  'malare': 'Målare {area} ★ 5/5 betyg ✓ Invändig & utvändig målning ✓ 30% ROT-avdrag ✓ Garanti på arbetet. Boka målare!',
  'stad': 'Städhjälp {area} ★ 5/5 betyg ✓ Hemstäd, flyttstäd & storstäd ✓ 30% RUT-avdrag ✓ Kvalitetsgaranti. Boka idag!',
  'flytt': 'Flytthjälp {area} ★ 5/5 betyg ✓ Packning, transport & bärhjälp ✓ 30% RUT-avdrag ✓ Försäkrad flytt. Få gratis offert!',
  'montering': 'Monteringshjälp {area} ★ 5/5 betyg ✓ IKEA-möbler, kök & garderober ✓ 30% RUT-avdrag. Ofta start samma dag!',
  'tradgard': 'Trädgårdshjälp {area} ★ 5/5 betyg ✓ Trädfällning, häck & gräsmatta ✓ 30% ROT-avdrag. Boka trädgårdsmästare!',
  'markarbeten': 'Markarbeten {area} ★ 5/5 betyg ✓ Dränering, plattsättning & grävning ✓ 30% ROT-avdrag. Gratis offert inom 24h!',
  'tekniska-installationer': 'Teknisk installation {area} ★ 5/5 betyg ✓ Laddbox, smarta hem & AV ✓ 30% ROT-avdrag. Boka certifierad montör!',
  'koksmontering': 'Köksmontering {area} ★ 5/5 betyg ✓ IKEA-kök, platsbyggt kök & vitvaror ✓ 30% ROT-avdrag. Fri offert!',
  'mobelmontering': 'Möbelmontering {area} ★ 5/5 betyg ✓ IKEA, garderober & hyllsystem ✓ 30% RUT-avdrag. Ofta start samma dag!',
  'badrumsrenovering': 'Badrumsrenovering {area} ★ 5/5 betyg ✓ Totalrenovering, kakel & VVS ✓ 30% ROT-avdrag. Gratis offert!',
  'koksrenovering': 'Köksrenovering {area} ★ 5/5 betyg ✓ Nytt kök, bänkskivor & vitvaror ✓ 30% ROT-avdrag. Gratis offert!',
  'altanbygge': 'Altanbygge {area} ★ 5/5 betyg ✓ Trädäck, inglasning & räcken ✓ 30% ROT-avdrag. Gratis offert inom 24h!',
  'fasadmalning': 'Fasadmålning {area} ★ 5/5 betyg ✓ Utvändig målning & puts ✓ 30% ROT-avdrag ✓ Garanti. Boka målare!',
  'inomhusmalning': 'Inomhusmålning {area} ★ 5/5 betyg ✓ Tapetsering & spackling ✓ 30% ROT-avdrag ✓ Garanti. Boka målare!',
  'golvlaggning': 'Golvläggning {area} ★ 5/5 betyg ✓ Parkett, vinyl & klinker ✓ 30% ROT-avdrag. Gratis offert inom 24h!',
  'elinstallation': 'Elinstallation {area} ★ 5/5 betyg ✓ Uttag, belysning & laddbox ✓ Auktoriserad ✓ 30% ROT-avdrag. Boka idag!',
  'rivning': 'Rivning {area} ★ 5/5 betyg ✓ Badrum, kök & väggrivning ✓ 30% ROT-avdrag. Gratis offert!',
};

const EN_TITLES: Record<string, string> = {
  'snickare': 'Carpenter {area} ★ Kitchen, wardrobe & deck · ROT 30% · Free quote',
  'vvs': 'Plumbing {area} ★ Repair & installation · ROT 30% · Response 24h',
  'elektriker': 'Electrician {area} ★ Certified · EV charger & electrical · ROT 30%',
  'malare': 'Painter {area} ★ Facade & interior · Fixed prices · ROT 30%',
  'stad': 'Cleaning {area} ★ Move-out, home & construction · RUT 30% · Book today',
  'flytt': 'Moving help {area} ★ Packing & carrying · RUT 30% · Quick booking',
  'markarbeten': 'Groundwork {area} ★ Excavation, drainage & paving · ROT 30%',
  'montering': 'Assembly {area} ★ IKEA, kitchen & furniture · ROT 30%',
  'tradgard': 'Gardening {area} ★ Trees, hedges & landscaping · ROT 30%',
  'tekniska-installationer': 'Technical installation {area} ★ EV charger & smart home · ROT 30%',
  'koksmontering': 'Kitchen Assembly {area} ★ IKEA kitchen & custom · ROT 30% · Free quote',
  'mobelmontering': 'Furniture Assembly {area} ★ IKEA, wardrobes & shelving · RUT 30%',
  'badrumsrenovering': 'Bathroom Renovation {area} ★ Full reno, tiles & plumbing · ROT 30%',
  'koksrenovering': 'Kitchen Renovation {area} ★ New kitchen & countertops · ROT 30%',
  'altanbygge': 'Deck Building {area} ★ Wood deck, glazing & railings · ROT 30%',
  'fasadmalning': 'Facade Painting {area} ★ Exterior painting & plaster · ROT 30%',
  'inomhusmalning': 'Interior Painting {area} ★ Wallpapering & plastering · ROT 30%',
  'golvlaggning': 'Floor Installation {area} ★ Parquet, vinyl & tiles · ROT 30%',
  'elinstallation': 'Electrical Installation {area} ★ Outlets, lighting & EV charger · ROT 30%',
  'rivning': 'Demolition {area} ★ Bathroom, kitchen & walls · ROT 30% · Free quote',
};

const EN_DESCS: Record<string, string> = {
  'snickare': 'Carpenter in {area} ★ 5/5 rating ✓ Kitchen renovation, deck & flooring ✓ 30% ROT deduction ✓ Fixed price. Get quote within 24h!',
  'elektriker': 'Electrician {area} ★ 5/5 rating ✓ Electrical installation & lighting ✓ Certified ✓ 30% ROT deduction. Book today!',
  'vvs': 'Plumber {area} ★ 5/5 rating ✓ Bathroom, kitchen & heating ✓ Certified ✓ 30% ROT deduction. Get quote within 24h!',
  'malare': 'Painter {area} ★ 5/5 rating ✓ Interior & exterior painting ✓ 30% ROT deduction ✓ Work guarantee. Book painter!',
  'stad': 'Cleaning {area} ★ 5/5 rating ✓ Home, move-out & deep cleaning ✓ 30% RUT deduction ✓ Quality guarantee. Book today!',
  'flytt': 'Moving help {area} ★ 5/5 rating ✓ Packing, transport & carrying ✓ 30% RUT deduction ✓ Insured moving. Free quote!',
  'montering': 'Assembly {area} ★ 5/5 rating ✓ IKEA furniture, kitchen & wardrobes ✓ 30% RUT deduction. Often same-day start!',
  'tradgard': 'Gardening {area} ★ 5/5 rating ✓ Tree felling, hedges & lawn ✓ 30% ROT deduction. Book gardener!',
  'markarbeten': 'Groundwork {area} ★ 5/5 rating ✓ Drainage, paving & excavation ✓ 30% ROT deduction. Free quote within 24h!',
  'tekniska-installationer': 'Technical installation {area} ★ 5/5 rating ✓ EV charger, smart home & AV ✓ 30% ROT deduction. Book certified installer!',
  'koksmontering': 'Kitchen assembly {area} ★ 5/5 rating ✓ IKEA kitchen, custom kitchen & appliances ✓ 30% ROT deduction. Free quote!',
  'mobelmontering': 'Furniture assembly {area} ★ 5/5 rating ✓ IKEA, wardrobes & shelving ✓ 30% RUT deduction. Often same-day!',
  'badrumsrenovering': 'Bathroom renovation {area} ★ 5/5 rating ✓ Full renovation, tiles & plumbing ✓ 30% ROT deduction. Free quote!',
  'koksrenovering': 'Kitchen renovation {area} ★ 5/5 rating ✓ New kitchen, countertops & appliances ✓ 30% ROT deduction. Free quote!',
  'altanbygge': 'Deck building {area} ★ 5/5 rating ✓ Wood deck, glazing & railings ✓ 30% ROT deduction. Free quote within 24h!',
  'fasadmalning': 'Facade painting {area} ★ 5/5 rating ✓ Exterior painting & plaster ✓ 30% ROT deduction ✓ Work guarantee!',
  'inomhusmalning': 'Interior painting {area} ★ 5/5 rating ✓ Wallpapering & plastering ✓ 30% ROT deduction ✓ Work guarantee!',
  'golvlaggning': 'Floor installation {area} ★ 5/5 rating ✓ Parquet, vinyl & tiles ✓ 30% ROT deduction. Free quote within 24h!',
  'elinstallation': 'Electrical installation {area} ★ 5/5 rating ✓ Outlets, lighting & EV charger ✓ 30% ROT deduction. Book today!',
  'rivning': 'Demolition {area} ★ 5/5 rating ✓ Bathroom, kitchen & wall demolition ✓ 30% ROT deduction. Free quote!',
};

// ─── Helpers ───
function getTitle(slug: string, areaName: string, locale: 'sv' | 'en'): string {
  const templates = locale === 'sv' ? SV_TITLES : EN_TITLES;
  if (templates[slug]) {
    return templates[slug].replace(/\{area\}/g, areaName);
  }
  // Fallback for expanded services
  const svc = ALL_SERVICES.find(s => s.slug === slug);
  const name = svc?.name || slug;
  return locale === 'sv'
    ? `${name} ${areaName} ★ Professionella hantverkare · ${svc?.rotRut || 'ROT'} 30% · Fri offert`
    : `${name} ${areaName} ★ Professional contractors · ${svc?.rotRut || 'ROT'} 30% · Free quote`;
}

function getDescription(slug: string, areaName: string, locale: 'sv' | 'en'): string {
  const templates = locale === 'sv' ? SV_DESCS : EN_DESCS;
  if (templates[slug]) {
    return templates[slug].replace(/\{area\}/g, areaName);
  }
  const svc = ALL_SERVICES.find(s => s.slug === slug);
  const name = svc?.name || slug;
  const rr = svc?.rotRut || 'ROT';
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

      console.log(`[prerender-local] Generated ${count} static HTML files`);
    },
  };
}
