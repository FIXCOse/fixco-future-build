// Slug mapping for Swedish <-> English navigation
// Base static routes
export const svToEnRoutes: Record<string, string> = {
  '/': '/en',
  '/tjanster': '/en/services',
  '/tjanster/el': '/en/services/el',
  '/tjanster/vvs': '/en/services/vvs', 
  '/tjanster/snickeri': '/en/services/snickeri',
  '/tjanster/malare': '/en/services/malare',
  '/tjanster/montering': '/en/services/montering',
  '/tjanster/tradgard': '/en/services/tradgard',
  '/tjanster/stadning': '/en/services/stadning',
  '/tjanster/markarbeten': '/en/services/markarbeten',
  '/tjanster/tekniska-installationer': '/en/services/tekniska-installationer',
  '/tjanster/flytt': '/en/services/flytt',
  '/kontakt': '/en/contact',
  '/om-oss': '/en/about',
  '/karriar': '/en/careers',
  '/referenser': '/en/references',
  '/smart-hem': '/en/smart-home',
  '/ai': '/en/ai',
  '/tjanster/dorrlas': '/en/services/door-locks',
  '/tjanster/koksrenovering': '/en/services/kitchen-renovation',
  '/tjanster/badrumsrenovering': '/en/services/bathroom-renovation',
  '/tjanster/altanbygge': '/en/services/deck-building',
  '/tjanster/golvlaggning': '/en/services/flooring-installation',
  '/tjanster/fasadmalning': '/en/services/exterior-painting',
  '/tjanster/inomhusmalning': '/en/services/interior-painting',
  '/tjanster/elinstallation': '/en/services/electrical-installation',
  '/tjanster/koksmontering': '/en/services/kitchen-installation',
  '/tjanster/mobelmontering': '/en/services/furniture-assembly',
  '/boka-hembesok': '/en/book-visit',
  '/rot-info': '/en/rot-info',
  '/rut': '/en/rut',
  '/faq': '/en/faq',
  '/terms': '/en/terms',
  '/privacy': '/en/privacy',
  // === EXPANDED SEO SLUGS ===
  // Snickeri & Bygg
  '/tjanster/totalrenovering': '/en/services/total-renovation',
  '/tjanster/renovering': '/en/services/renovation',
  '/tjanster/hantverkare': '/en/services/contractor',
  '/tjanster/byggfirma': '/en/services/construction-company',
  '/tjanster/byggtjanster': '/en/services/construction-services',
  '/tjanster/husrenovering': '/en/services/house-renovation',
  '/tjanster/villarenovering': '/en/services/villa-renovation',
  '/tjanster/lagenhetsrenovering': '/en/services/apartment-renovation',
  '/tjanster/ombyggnad': '/en/services/remodeling',
  '/tjanster/utbyggnad': '/en/services/extension',
  '/tjanster/tillbyggnad': '/en/services/addition',
  '/tjanster/fonsterbyte': '/en/services/window-replacement',
  '/tjanster/dorrbyte': '/en/services/door-replacement',
  '/tjanster/fasadrenovering': '/en/services/facade-renovation',
  '/tjanster/trapprenovering': '/en/services/stair-renovation',
  '/tjanster/taklaggning': '/en/services/roofing',
  '/tjanster/takbyte': '/en/services/roof-replacement',
  '/tjanster/takrenovering': '/en/services/roof-renovation',
  '/tjanster/verandarenovering': '/en/services/veranda-renovation',
  '/tjanster/entrerenoverning': '/en/services/entrance-renovation',
  '/tjanster/vardagsrumsrenovering': '/en/services/living-room-renovation',
  '/tjanster/sovrumsrenovering': '/en/services/bedroom-renovation',
  '/tjanster/kontorsbygge': '/en/services/office-construction',
  '/tjanster/bostadsanpassning': '/en/services/home-adaptation',
  '/tjanster/platsbyggt': '/en/services/custom-built',
  // Kök
  '/tjanster/kok': '/en/services/kitchen',
  '/tjanster/koksbyte': '/en/services/kitchen-replacement',
  '/tjanster/ikea-koksmontage': '/en/services/ikea-kitchen-assembly',
  '/tjanster/koksinstallation': '/en/services/kitchen-installation-service',
  '/tjanster/koksdesign': '/en/services/kitchen-design',
  '/tjanster/nytt-kok': '/en/services/new-kitchen',
  '/tjanster/koksluckor': '/en/services/kitchen-cabinet-doors',
  '/tjanster/bankskiva': '/en/services/countertop',
  '/tjanster/platsbyggt-kok': '/en/services/custom-kitchen',
  '/tjanster/koksplanering': '/en/services/kitchen-planning',
  '/tjanster/vitvaruinstallation-kok': '/en/services/kitchen-appliance-installation',
  '/tjanster/diskbanksbyte': '/en/services/sink-replacement',
  '/tjanster/koksbelysning': '/en/services/kitchen-lighting',
  '/tjanster/koksflakt': '/en/services/kitchen-hood',
  '/tjanster/stankskydd': '/en/services/backsplash',
  // Badrum
  '/tjanster/badrum': '/en/services/bathroom',
  '/tjanster/badrumskakel': '/en/services/bathroom-tiles',
  '/tjanster/plattsattning': '/en/services/tiling',
  '/tjanster/tatskikt': '/en/services/waterproofing',
  '/tjanster/wc-renovering': '/en/services/wc-renovation',
  '/tjanster/duschrum': '/en/services/shower-room',
  '/tjanster/duschvagg': '/en/services/shower-screen',
  '/tjanster/badrumsinredning': '/en/services/bathroom-fixtures',
  '/tjanster/tvattrum': '/en/services/laundry-room',
  '/tjanster/badrumsgolv': '/en/services/bathroom-floor',
  // El
  '/tjanster/elarbeten': '/en/services/electrical-work',
  '/tjanster/elreparation': '/en/services/electrical-repair',
  '/tjanster/laddbox': '/en/services/ev-charger',
  '/tjanster/laddboxinstallation': '/en/services/ev-charger-installation',
  '/tjanster/sakringsbyte': '/en/services/fuse-replacement',
  '/tjanster/belysning': '/en/services/lighting',
  '/tjanster/elcentral': '/en/services/electrical-panel',
  '/tjanster/eljour': '/en/services/emergency-electrician',
  '/tjanster/lampmontering': '/en/services/light-fixture-mounting',
  '/tjanster/spotlights': '/en/services/spotlights',
  '/tjanster/elbesiktning': '/en/services/electrical-inspection',
  '/tjanster/jordfelsbrytare': '/en/services/ground-fault-breaker',
  // VVS
  '/tjanster/vvs-arbeten': '/en/services/plumbing-work',
  '/tjanster/rorjour': '/en/services/emergency-plumber',
  '/tjanster/rorarbeten': '/en/services/pipe-work',
  '/tjanster/varmepump': '/en/services/heat-pump',
  '/tjanster/vattenlas': '/en/services/water-leak',
  '/tjanster/avlopp': '/en/services/drainage',
  '/tjanster/golvvarme': '/en/services/underfloor-heating',
  '/tjanster/vattenbatteri': '/en/services/faucet',
  '/tjanster/blandarbyte': '/en/services/mixer-tap-replacement',
  '/tjanster/radiatorbyte': '/en/services/radiator-replacement',
  // Målning
  '/tjanster/malning': '/en/services/painting',
  '/tjanster/tapetsering': '/en/services/wallpapering',
  '/tjanster/spackling': '/en/services/plastering',
  '/tjanster/lackering': '/en/services/lacquering',
  '/tjanster/fonstermalning': '/en/services/window-painting',
  '/tjanster/takmalning': '/en/services/ceiling-painting',
  '/tjanster/trappmalning': '/en/services/stair-painting',
  '/tjanster/snickerimlaning': '/en/services/woodwork-painting',
  // Golv
  '/tjanster/golvslipning': '/en/services/floor-sanding',
  '/tjanster/parkettlaggning': '/en/services/parquet-installation',
  '/tjanster/laminatgolv': '/en/services/laminate-flooring',
  '/tjanster/vinylgolv': '/en/services/vinyl-flooring',
  '/tjanster/klinkergolv': '/en/services/tile-flooring',
  '/tjanster/epoxigolv': '/en/services/epoxy-flooring',
  '/tjanster/golvbyte': '/en/services/floor-replacement',
  // Trädgård
  '/tjanster/tradgardsanlaggning': '/en/services/garden-landscaping',
  '/tjanster/tradgardsskotsel': '/en/services/garden-maintenance',
  '/tjanster/grasklippning': '/en/services/lawn-mowing',
  '/tjanster/hackklippning': '/en/services/hedge-trimming',
  '/tjanster/tradbeskaring': '/en/services/tree-pruning',
  '/tjanster/tradgardsdesign': '/en/services/garden-design',
  '/tjanster/stenlaggning-tradgard': '/en/services/garden-paving',
  '/tjanster/buskrojning': '/en/services/bush-clearing',
  // Markarbeten
  '/tjanster/dranering': '/en/services/drainage-work',
  '/tjanster/schaktning': '/en/services/excavation',
  '/tjanster/plattlaggning': '/en/services/paving',
  '/tjanster/stenlaggning': '/en/services/stone-paving',
  '/tjanster/asfaltering': '/en/services/asphalt-paving',
  '/tjanster/murverk': '/en/services/masonry',
  '/tjanster/uppfart': '/en/services/driveway',
  '/tjanster/garageuppfart': '/en/services/garage-driveway',
  // Städ
  '/tjanster/hemstad': '/en/services/home-cleaning',
  '/tjanster/flyttstad': '/en/services/move-out-cleaning',
  '/tjanster/byggstad': '/en/services/construction-cleaning',
  '/tjanster/fonsterputs': '/en/services/window-cleaning',
  '/tjanster/storstadning': '/en/services/deep-cleaning',
  '/tjanster/kontorsstad': '/en/services/office-cleaning',
  '/tjanster/dodsbo': '/en/services/estate-clearing',
  '/tjanster/trappstad': '/en/services/stairwell-cleaning',
  // Montering
  '/tjanster/garderobsmontering': '/en/services/wardrobe-assembly',
  '/tjanster/tv-montering': '/en/services/tv-mounting',
  '/tjanster/persiennmontering': '/en/services/blind-installation',
  '/tjanster/hyllmontering': '/en/services/shelf-assembly',
  '/tjanster/ikeamontering': '/en/services/ikea-assembly',
  '/tjanster/dorrmontering': '/en/services/door-installation',
  // Flytt
  '/tjanster/flytthjalp': '/en/services/moving-help',
  '/tjanster/packhjalp': '/en/services/packing-help',
  '/tjanster/kontorsflytt': '/en/services/office-moving',
  '/tjanster/magasinering': '/en/services/storage',
  '/tjanster/pianoflytt': '/en/services/piano-moving',
  // Teknik
  '/tjanster/larm': '/en/services/alarm-system',
  '/tjanster/smarthome': '/en/services/smart-home-installation',
  '/tjanster/natverksinstallation': '/en/services/network-installation',
  '/tjanster/kameraovervakning': '/en/services/security-cameras',
  '/tjanster/solceller': '/en/services/solar-panels',
  '/tjanster/porttelefon': '/en/services/intercom',
  // Rivning
  '/tjanster/rivning-badrum': '/en/services/bathroom-demolition',
  '/tjanster/rivning-kok': '/en/services/kitchen-demolition',
  '/tjanster/bortforsling': '/en/services/debris-removal',
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
