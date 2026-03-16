#!/usr/bin/env node
/**
 * Post-build script: generates dist/seo-inline.js
 * A tiny synchronous script injected into index.html <head> that sets
 * document.title, meta description, canonical and hreflang based on URL path.
 * Covers all 152 services × 54 areas × 2 languages — zero extra HTML files.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// ─── Service slug → display name (Swedish) ───
const SERVICES = {
  'snickare':'Snickare','elektriker':'Elektriker','vvs':'VVS','malare':'Målare',
  'tradgard':'Trädgård','stad':'Städ','markarbeten':'Markarbeten','montering':'Montering',
  'flytt':'Flytt','tekniska-installationer':'Tekniska installationer',
  'koksmontering':'Köksmontering','mobelmontering':'Möbelmontering',
  'badrumsrenovering':'Badrumsrenovering','koksrenovering':'Köksrenovering',
  'altanbygge':'Altanbygge','fasadmalning':'Fasadmålning','inomhusmalning':'Inomhusmålning',
  'golvlaggning':'Golvläggning','elinstallation':'Elinstallation','rivning':'Rivning',
  'totalrenovering':'Totalrenovering','renovering':'Renovering','hantverkare':'Hantverkare',
  'byggfirma':'Byggfirma','byggtjanster':'Byggtjänster','husrenovering':'Husrenovering',
  'villarenovering':'Villarenovering','lagenhetsrenovering':'Lägenhetsrenovering',
  'ombyggnad':'Ombyggnad','utbyggnad':'Utbyggnad','tillbyggnad':'Tillbyggnad',
  'fonsterbyte':'Fönsterbyte','dorrbyte':'Dörrbyte','fasadrenovering':'Fasadrenovering',
  'trapprenovering':'Trapprenovering','taklaggning':'Takläggning','takbyte':'Takbyte',
  'takrenovering':'Takrenovering','verandarenovering':'Verandarenovering',
  'entrerenoverning':'Entrérenoverning','vardagsrumsrenovering':'Vardagsrumsrenovering',
  'sovrumsrenovering':'Sovrumsrenovering','kontorsbygge':'Kontorsbygge',
  'bostadsanpassning':'Bostadsanpassning','platsbyggt':'Platsbyggt',
  'kok':'Kök','koksbyte':'Köksbyte','ikea-koksmontage':'IKEA-köksmontage',
  'koksinstallation':'Köksinstallation','koksdesign':'Köksdesign','nytt-kok':'Nytt kök',
  'koksluckor':'Köksluckor','bankskiva':'Bänkskiva','platsbyggt-kok':'Platsbyggt kök',
  'koksplanering':'Köksplanering','vitvaruinstallation-kok':'Vitvaruinstallation kök',
  'diskbanksbyte':'Diskbänksbyte','koksbelysning':'Köksbelysning','koksflakt':'Köksfläkt',
  'stankskydd':'Stänkskydd','badrum':'Badrum','badrumskakel':'Badrumskakel',
  'plattsattning':'Plattsättning','tatskikt':'Tätskikt','wc-renovering':'WC-renovering',
  'duschrum':'Duschrum','duschvagg':'Duschvägg','badrumsinredning':'Badrumsinredning',
  'tvattrum':'Tvättrum','badrumsgolv':'Badrumsgolv',
  'elarbeten':'Elarbeten','elreparation':'Elreparation','laddbox':'Laddbox',
  'laddboxinstallation':'Laddboxinstallation','sakringsbyte':'Säkringsbyte',
  'belysning':'Belysning','elcentral':'Elcentral','eljour':'Eljour',
  'lampmontering':'Lampmontering','spotlights':'Spotlights','elbesiktning':'Elbesiktning',
  'jordfelsbrytare':'Jordfelsbrytare',
  'vvs-arbeten':'VVS-arbeten','rorjour':'Rörjour','rorarbeten':'Rörarbeten',
  'varmepump':'Värmepump','vattenlas':'Vattenlås','avlopp':'Avlopp',
  'golvvarme':'Golvvärme','vattenbatteri':'Vattenbatteri','blandarbyte':'Blandarbyte',
  'radiatorbyte':'Radiatorbyte',
  'malning':'Målning','tapetsering':'Tapetsering','spackling':'Spackling',
  'lackering':'Lackering','fonstermalning':'Fönstermålning','takmalning':'Takmålning',
  'trappmalning':'Trappmålning','snickerimlaning':'Snickerimålning',
  'golvslipning':'Golvslipning','parkettlaggning':'Parkettläggning',
  'laminatgolv':'Laminatgolv','vinylgolv':'Vinylgolv','klinkergolv':'Klinkergolv',
  'epoxigolv':'Epoxigolv','golvbyte':'Golvbyte',
  'tradgardsanlaggning':'Trädgårdsanläggning','tradgardsskotsel':'Trädgårdsskötsel',
  'grasklippning':'Gräsklippning','hackklippning':'Häckklippning',
  'tradbeskaring':'Trädbeskärning','tradgardsdesign':'Trädgårdsdesign',
  'stenlaggning-tradgard':'Stenläggning trädgård','buskrojning':'Buskröjning',
  'dranering':'Dränering','schaktning':'Schaktning','plattlaggning':'Plattläggning',
  'stenlaggning':'Stenläggning','asfaltering':'Asfaltering','murverk':'Murverk',
  'uppfart':'Uppfart','garageuppfart':'Garageuppfart',
  'hemstad':'Hemstäd','flyttstad':'Flyttstäd','byggstad':'Byggstäd',
  'fonsterputs':'Fönsterputs','storstadning':'Storstädning','kontorsstad':'Kontorsstäd',
  'dodsbo':'Dödsbo','trappstad':'Trappstäd',
  'garderobsmontering':'Garderobsmontering','tv-montering':'TV-montering',
  'persiennmontering':'Persiennmontering','hyllmontering':'Hyllmontering',
  'ikeamontering':'IKEA-montering','dorrmontering':'Dörrmontering',
  'flytthjalp':'Flytthjälp','packhjalp':'Packhjälp','kontorsflytt':'Kontorsflytt',
  'magasinering':'Magasinering','pianoflytt':'Pianoflytt',
  'larm':'Larm','smarthome':'Smart Home','natverksinstallation':'Nätverksinstallation',
  'kameraovervakning':'Kameraövervakning','solceller':'Solceller','porttelefon':'Porttelefon',
  'rivning-badrum':'Rivning badrum','rivning-kok':'Rivning kök','bortforsling':'Bortforsling',
  'montera-tv-pa-vagg':'Montera TV på vägg','installera-akustikpanel':'Installera akustikpanel',
  'platsbyggd-garderob':'Platsbyggd garderob','platsbyggd-bokhylla':'Platsbyggd bokhylla',
  'montera-spotlights':'Montera spotlights','installera-laddbox-hemma':'Installera laddbox hemma',
  'bygga-altan':'Bygga altan','montera-koksflakt':'Montera köksfläkt',
  'installera-golvvarme':'Installera golvvärme','bygga-bastu':'Bygga bastu',
  'montera-markis':'Montera markis','installera-varmepump':'Installera värmepump',
  'renovera-trapp':'Renovera trapp','bygga-carport':'Bygga carport',
  'montera-takfonster':'Montera takfönster','bygga-utekok':'Bygga utekök',
  'bygga-friggebod':'Bygga friggebod','montera-persienner':'Montera persienner',
  'installera-solceller-hem':'Installera solceller hem','bygga-plank':'Bygga plank',
  'dorrlas':'Dörrlås',
};

// ─── Area slug → display name ───
const AREAS = {
  'stockholm':'Stockholm','bromma':'Bromma','hagersten':'Hägersten',
  'kungsholmen':'Kungsholmen','sodermalm':'Södermalm','vasastan':'Vasastan',
  'ostermalm':'Östermalm','danderyd':'Danderyd','ekero':'Ekerö',
  'haninge':'Haninge','huddinge':'Huddinge','jarfalla':'Järfälla',
  'jarna':'Järna','lidingo':'Lidingö','marsta':'Märsta',
  'nacka':'Nacka','norrtalje':'Norrtälje','nykvarn':'Nykvarn',
  'nynashamn':'Nynäshamn','salem':'Salem','sigtuna':'Sigtuna',
  'sollentuna':'Sollentuna','solna':'Solna','sundbyberg':'Sundbyberg',
  'sodertalje':'Södertälje','tyreso':'Tyresö','taby':'Täby',
  'upplands-vasby':'Upplands Väsby','upplands-bro':'Upplands-Bro',
  'vallentuna':'Vallentuna','vaxholm':'Vaxholm','varmdo':'Värmdö',
  'akersberga':'Åkersberga','botkyrka':'Botkyrka',
  'uppsala':'Uppsala','knivsta':'Knivsta','enkoping':'Enköping',
  'tierp':'Tierp','osthammar':'Östhammar','storvreta':'Storvreta',
  'bjorklinge':'Björklinge','balinge':'Bälinge','vattholma':'Vattholma',
  'alsike':'Alsike','granby':'Gränby','savja':'Sävja',
  'eriksberg':'Eriksberg','gottsunda':'Gottsunda','sunnersta':'Sunnersta',
  'skyttorp':'Skyttorp','lovstalot':'Lövstalöt','gamla-uppsala':'Gamla Uppsala',
  'ultuna':'Ultuna',
};

// ─── sv→en slug mapping for hreflang ───
const SV_TO_EN_SERVICE = {
  'snickare':'carpenter','elektriker':'electrician','vvs':'plumbing','malare':'painter',
  'tradgard':'garden','stad':'cleaning','markarbeten':'groundwork','montering':'assembly',
  'flytt':'moving','tekniska-installationer':'technical-installations',
  'koksmontering':'kitchen-installation','mobelmontering':'furniture-assembly',
  'badrumsrenovering':'bathroom-renovation','koksrenovering':'kitchen-renovation',
  'altanbygge':'deck-building','fasadmalning':'exterior-painting',
  'inomhusmalning':'interior-painting','golvlaggning':'flooring-installation',
  'elinstallation':'electrical-installation','rivning':'demolition',
};

// Build the inline script content
const inlineScript = `(function(){
var S=${JSON.stringify(SERVICES)};
var A=${JSON.stringify(AREAS)};
var E=${JSON.stringify(SV_TO_EN_SERVICE)};
var p=location.pathname.replace(/\\/$/,'');
var m,svc,area,lang='sv',enSvc;

// Swedish: /tjanster/{service}/{area}
if((m=p.match(/^\\/tjanster\\/([^\\/]+)\\/([^\\/]+)$/))&&S[m[1]]&&A[m[2]]){
  svc=S[m[1]];area=A[m[2]];lang='sv';enSvc=E[m[1]]||m[1];
}
// English: /en/services/{service}/{area}
else if((m=p.match(/^\\/en\\/services\\/([^\\/]+)\\/([^\\/]+)$/))&&(S[m[1]]||Object.values(E).indexOf(m[1])>-1)&&A[m[2]]){
  var sk=m[1];
  // reverse lookup en→sv
  for(var k in E){if(E[k]===sk){sk=k;break;}}
  svc=S[sk]||sk;area=A[m[2]];lang='en';enSvc=E[sk]||sk;
}
// Swedish hub: /tjanster/{service}
else if((m=p.match(/^\\/tjanster\\/([^\\/]+)$/))&&S[m[1]]){
  svc=S[m[1]];lang='sv';enSvc=E[m[1]]||m[1];
}
// English hub: /en/services/{service}
else if((m=p.match(/^\\/en\\/services\\/([^\\/]+)$/))){ 
  var sk2=m[1];
  for(var k2 in E){if(E[k2]===sk2){sk2=k2;break;}}
  if(S[sk2]){svc=S[sk2];lang='en';enSvc=E[sk2]||sk2;}
}

if(!svc)return;

var B='https://fixco.se';
var h=document.head;
function meta(n,c){var e=document.createElement('meta');e.name=n;e.content=c;h.appendChild(e);}
function link(r,hr,hl){var e=document.createElement('link');e.rel=r;e.href=hr;if(hl)e.hreflang=hl;h.appendChild(e);}

if(area){
  // Local page
  var svPath='/tjanster/'+Object.keys(S).find(function(k){return S[k]===svc;})+'/'+Object.keys(A).find(function(k){return A[k]===area;});
  var enPath='/en/services/'+(enSvc)+'/'+Object.keys(A).find(function(k){return A[k]===area;});
  
  if(lang==='sv'){
    document.title=svc+' i '+area+' | Fixco \\u2605 5/5';
    meta('description','Professionell '+svc.toLowerCase()+' i '+area+'. Fixco erbjuder snabb start inom 5 dagar, ROT/RUT-avdrag och nöjd-kund-garanti. Begär kostnadsfri offert idag!');
    link('canonical',B+svPath);
    link('alternate',B+svPath,'sv');
    link('alternate',B+enPath,'en');
    link('alternate',B+svPath,'x-default');
  } else {
    document.title=svc+' in '+area+' | Fixco \\u2605 5/5';
    meta('description','Professional '+svc.toLowerCase()+' in '+area+'. Fixco offers quick start within 5 days, ROT/RUT tax deduction and satisfaction guarantee. Request a free quote today!');
    link('canonical',B+enPath);
    link('alternate',B+svPath,'sv');
    link('alternate',B+enPath,'en');
    link('alternate',B+svPath,'x-default');
  }
} else {
  // Hub page (no area)
  var svSlug=Object.keys(S).find(function(k){return S[k]===svc;});
  if(lang==='sv'){
    document.title=svc+' | Fixco \\u2605 Tjänster i Stockholm & Uppsala';
    meta('description','Boka '+svc.toLowerCase()+' hos Fixco. Vi erbjuder professionella tjänster i Stockholm & Uppsala med ROT/RUT-avdrag. Snabb start och nöjd-kund-garanti.');
    link('canonical',B+'/tjanster/'+svSlug);
  } else {
    document.title=svc+' | Fixco \\u2605 Services in Stockholm & Uppsala';
    meta('description','Book '+svc.toLowerCase()+' with Fixco. Professional services in Stockholm & Uppsala with ROT/RUT tax deduction. Quick start and satisfaction guarantee.');
    link('canonical',B+'/en/services/'+(enSvc));
  }
}
})();`;

// Write to dist/seo-inline.js
writeFileSync(join(DIST, 'seo-inline.js'), inlineScript, 'utf-8');
console.log(`✅ Generated dist/seo-inline.js (${inlineScript.length} bytes)`);

// Now inject <script src="/seo-inline.js"></script> into dist/index.html
const indexPath = join(DIST, 'index.html');
let html = readFileSync(indexPath, 'utf-8');

if (!html.includes('seo-inline.js')) {
  // Insert before the closing </head> but after meta tags
  html = html.replace('</head>', '    <script src="/seo-inline.js"></script>\n  </head>');
  writeFileSync(indexPath, html, 'utf-8');
  console.log('✅ Injected seo-inline.js into dist/index.html');
}

console.log('🎯 SEO inline script ready — covers all service×area combinations');
