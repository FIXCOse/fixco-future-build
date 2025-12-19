// ============================================================
// MASSIV LOKAL SEO DATA - 450+ lokala sidor
// ============================================================

// Stockholm-regionen: 30+ orter
export const STOCKHOLM_AREAS = [
  // Stadsdelar
  "Stockholm", "Bromma", "Hägersten", "Kungsholmen", "Södermalm", "Vasastan", "Östermalm",
  // Förorter & kommuner
  "Danderyd", "Ekerö", "Haninge", "Huddinge", "Järfälla", "Järna", "Lidingö", 
  "Märsta", "Nacka", "Norrtälje", "Nykvarn", "Nynäshamn", "Salem", "Sigtuna",
  "Sollentuna", "Solna", "Sundbyberg", "Södertälje", "Tyresö", "Täby", 
  "Upplands Väsby", "Upplands-Bro", "Vallentuna", "Vaxholm", "Värmdö", "Åkersberga", "Botkyrka"
] as const;

// Uppsala-regionen: 15+ orter
export const UPPSALA_AREAS = [
  "Uppsala", "Knivsta", "Enköping", "Tierp", "Östhammar",
  // Tätorter
  "Storvreta", "Björklinge", "Bälinge", "Vattholma", "Alsike", 
  "Gränby", "Sävja", "Eriksberg", "Gottsunda", "Sunnersta",
  "Skyttorp", "Lövstalöt", "Gamla Uppsala", "Ultuna"
] as const;

export const ALL_AREAS = [...STOCKHOLM_AREAS, ...UPPSALA_AREAS] as const;

export type AreaKey = typeof ALL_AREAS[number];

// Alla tjänster som ska ha lokala sidor
export const LOCAL_SERVICES = [
  { slug: "snickare", name: "Snickare", serviceKey: "snickeri", rotRut: "ROT" },
  { slug: "elektriker", name: "Elektriker", serviceKey: "el", rotRut: "ROT" },
  { slug: "vvs", name: "VVS", serviceKey: "vvs", rotRut: "ROT" },
  { slug: "malare", name: "Målare", serviceKey: "malning", rotRut: "ROT" },
  { slug: "tradgard", name: "Trädgård", serviceKey: "tradgard", rotRut: "ROT" },
  { slug: "stad", name: "Städ", serviceKey: "stadning", rotRut: "RUT" },
  { slug: "markarbeten", name: "Markarbeten", serviceKey: "markarbeten", rotRut: "ROT" },
  { slug: "montering", name: "Montering", serviceKey: "montering", rotRut: "ROT" },
  { slug: "flytt", name: "Flytt", serviceKey: "flytt", rotRut: "RUT" },
  { slug: "tekniska-installationer", name: "Tekniska installationer", serviceKey: "tekniska-installationer", rotRut: "ROT" },
] as const;

export type LocalServiceSlug = typeof LOCAL_SERVICES[number]["slug"];

// Genererar slug för URL
export const generateAreaSlug = (area: string): string => {
  return area
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Area metadata (befolkning, typ, etc)
export const getAreaMetadata = (area: AreaKey): { population: string; type: string; region: "Stockholm" | "Uppsala" } => {
  const stockholmAreas = STOCKHOLM_AREAS as readonly string[];
  const region = stockholmAreas.includes(area) ? "Stockholm" : "Uppsala";
  
  // Ungefärlig befolkningsdata
  const populationMap: Record<string, string> = {
    "Stockholm": "975 000",
    "Uppsala": "177 000",
    "Sollentuna": "75 000",
    "Huddinge": "115 000",
    "Nacka": "105 000",
    "Täby": "72 000",
    "Södertälje": "100 000",
    "Haninge": "95 000",
    "Järfälla": "80 000",
    "Botkyrka": "95 000",
    "Sundbyberg": "53 000",
    "Solna": "85 000",
    "Danderyd": "33 000",
    "Lidingö": "48 000",
    "Tyresö": "48 000",
    "Vallentuna": "35 000",
    "Värmdö": "45 000",
    "Sigtuna": "50 000",
    "Norrtälje": "63 000",
    "Nynäshamn": "29 000",
    "Knivsta": "20 000",
    "Enköping": "45 000",
  };

  return {
    population: populationMap[area] || "20 000+",
    type: ["Stockholm", "Uppsala", "Sollentuna", "Huddinge", "Nacka", "Täby", "Södertälje"].includes(area) ? "stad" : "kommun",
    region
  };
};

// ============================================================
// CONTENT GENERATOR - Lärorikt innehåll med hög ortnamn-upprepning
// ============================================================

export interface LocalServiceContent {
  h1: string;
  title: string;
  description: string;
  intro: string;
  localSection: {
    title: string;
    content: string;
  };
  ctaSection: {
    title: string;
    content: string;
  };
  servicesSection: {
    title: string;
    items: string[];
  };
  rotRutSection: {
    title: string;
    content: string;
  };
  faqs: Array<{ q: string; a: string }>;
  quickFacts: string[];
}

export const generateLocalContent = (serviceSlug: LocalServiceSlug, area: AreaKey): LocalServiceContent => {
  const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug)!;
  const serviceName = service.name.toLowerCase();
  const serviceNameCapital = service.name;
  const rotRut = service.rotRut;
  const metadata = getAreaMetadata(area);
  
  return {
    h1: `${serviceNameCapital} ${area}`,
    
    title: `${serviceNameCapital} ${area} – Professionella hantverkare i ${area} | ${rotRut} 50%`,
    
    description: `Söker du ${serviceName} i ${area}? Fixco erbjuder erfarna ${serviceName} i ${area} för alla typer av jobb. Snabb start, bra priser och ${rotRut}-avdrag i ${area}. Ring oss idag!`,
    
    intro: `Letar du efter en pålitlig **${serviceName} i ${area}**? Hos Fixco hjälper vi dig att hitta den bästa ${serviceName} i ${area} för ditt projekt. Våra ${serviceName} i ${area} har lång erfarenhet och levererar alltid kvalitetsarbete. Vi täcker hela ${area} ${metadata.type} med omnejd och kan ofta starta inom 24-48 timmar.

${area} är en ${metadata.type} i ${metadata.region}s län med cirka ${metadata.population} invånare. Vi på Fixco har hjälpt hundratals kunder i ${area} med ${serviceName}-tjänster och vet exakt vilka utmaningar som finns i området. Oavsett om du bor i en villa, lägenhet eller radhus i ${area} kan vi hjälpa dig.`,
    
    localSection: {
      title: `Din lokala ${serviceName} i ${area} nära mig`,
      content: `Våra ${serviceName} i ${area} har erfarenhet av att hjälpa alla sorters kunder. Oavsett om du behöver hjälp med ett stort eller litet projekt i ${area} kan du vara säker på att hitta rätt ${serviceName} i ${area}. 

**${serviceNameCapital} i ${area} hos Fixco:**
- Utför arbetet enligt dina önskemål i ${area}
- Jobbar med material av hög kvalitet i ${area}
- Ger dig fast pris och ${rotRut}-avdrag i ${area}
- Har lokalkännedom om ${area} och omgivande områden
- Kan ofta starta redan inom 1-3 arbetsdagar i ${area}

Vi förstår att det kan vara svårt att hitta en bra ${serviceName} i ${area}. Därför gör vi det enkelt för dig – du beskriver ditt projekt, vi matchar dig med rätt ${serviceName} i ${area}, och du får ett fast pris med ${rotRut}-avdrag direkt.`
    },
    
    ctaSection: {
      title: `Kontakta våra ${serviceName} i ${area} för offert`,
      content: `Genom Fixco kan du få offert på ${serviceName} i ${area} och många andra orter i ${metadata.region}s län. Vi prioriterar att alla ska ha möjligheten att förbättra sitt hem i ${area}. 

När du anlitar ${serviceName} i ${area} via Fixco kan du utnyttja ${rotRut}-avdraget på 50% av arbetskostnaden. Det betyder att ett jobb som kostar 20 000 kr i arbetskostnad bara kostar dig 10 000 kr efter avdrag!

**Kontakta oss för att hitta ${serviceName} i ${area}!**`
    },

    servicesSection: {
      title: `${serviceNameCapital} i ${area} kan hjälpa till med`,
      items: getServiceItems(serviceSlug, area)
    },

    rotRutSection: {
      title: `${serviceNameCapital} med ${rotRut}-avdrag i ${area}`,
      content: `När du anlitar ${serviceName} i ${area} via Fixco kan du få ${rotRut}-avdrag på 50% av arbetskostnaden. ${rotRut}-avdraget gäller för ${rotRut === 'ROT' ? 'reparation, underhåll, om- och tillbyggnad' : 'hushållsnära tjänster'} i din bostad i ${area}.

**Så fungerar ${rotRut}-avdrag i ${area}:**
1. Du beställer ${serviceName} i ${area} via Fixco
2. Vi utför arbetet i din bostad i ${area}
3. Du betalar bara halva arbetskostnaden (50% ${rotRut})
4. Vi ansöker om avdraget åt dig hos Skatteverket

**Exempel på ${rotRut}-avdrag för ${serviceName} i ${area}:**
- Arbetskostnad: 30 000 kr
- ${rotRut}-avdrag (50%): -15 000 kr
- **Du betalar: 15 000 kr**

Maxtaket för ${rotRut}-avdrag är ${rotRut === 'ROT' ? '50 000 kr' : '75 000 kr'} per person och år. Har du inte utnyttjat ditt ${rotRut}-avdrag i år är det perfekt tillfälle att anlita ${serviceName} i ${area}!`
    },

    faqs: [
      {
        q: `Vad kostar ${serviceName} i timmen i ${area}?`,
        a: `Timpriset för ${serviceName} i ${area} varierar beroende på arbetets art och komplexitet. Generellt ligger timpriset på 450-650 kr/timme före ${rotRut}-avdrag. Efter ${rotRut}-avdrag (50%) betalar du alltså 225-325 kr/timme för ${serviceName} i ${area}. Kontakta oss för exakt pris på ditt projekt i ${area}.`
      },
      {
        q: `Hur snabbt kan ${serviceName} komma till ${area}?`,
        a: `Våra ${serviceName} i ${area} kan ofta komma inom 24-48 timmar för mindre uppdrag. För större projekt i ${area} bokar vi in ett startdatum som passar dig, vanligtvis inom 1-2 veckor. Vid akuta ärenden i ${area} försöker vi alltid hitta en snabb lösning.`
      },
      {
        q: `Får jag ${rotRut}-avdrag för ${serviceName} i ${area}?`,
        a: `Ja! Du får 50% ${rotRut}-avdrag på arbetskostnaden när du anlitar ${serviceName} i ${area} för arbeten i din bostad. Detta gäller för privatpersoner som äger eller hyr sin bostad i ${area}. Vi hanterar all administration med Skatteverket åt dig.`
      },
      {
        q: `Vilka områden i ${area} täcker ni?`,
        a: `Vi täcker hela ${area} ${metadata.type} och alla närliggande områden. Oavsett var i ${area} du bor kan vi hjälpa dig med ${serviceName}. Vi har lokalkännedom om ${area} och vet hur man tar sig fram snabbt och effektivt.`
      },
      {
        q: `Är era ${serviceName} i ${area} certifierade?`,
        a: `Ja, alla våra ${serviceName} i ${area} är certifierade och har relevant utbildning för sina arbetsuppgifter. ${getCertificationText(serviceSlug)} Vi ställer höga krav på alla hantverkare som arbetar för Fixco i ${area}.`
      },
      {
        q: `Hur bokar jag ${serviceName} i ${area}?`,
        a: `Det är enkelt att boka ${serviceName} i ${area}! Du kan antingen ringa oss, fylla i vårt offertformulär eller använda vår bokningsguide online. Beskriv ditt projekt i ${area} så kontaktar vi dig med ett fast pris inom 24 timmar.`
      }
    ],

    quickFacts: [
      `${area} ligger i ${metadata.region}s län`,
      `Cirka ${metadata.population} invånare i ${area}`,
      `Fixco erbjuder ${serviceName} i hela ${area}`,
      `50% ${rotRut}-avdrag på ${serviceName} i ${area}`,
      `Start inom 24-48 timmar i ${area}`,
      `Fasta priser för ${serviceName} i ${area}`,
      `Lokala hantverkare med kännedom om ${area}`
    ]
  };
};

// Hjälpfunktion för att hämta tjänster per kategori
function getServiceItems(serviceSlug: LocalServiceSlug, area: string): string[] {
  const serviceItems: Record<LocalServiceSlug, string[]> = {
    "snickare": [
      `Köksrenovering i ${area}`,
      `Bygga altan och trädäck i ${area}`,
      `Inredningssnickeri i ${area}`,
      `Fönster- och dörrbyte i ${area}`,
      `Golvläggning i ${area}`,
      `Badrumsrenovering i ${area}`,
      `Bygga om vind/källare i ${area}`,
      `Fasadrenovering i ${area}`,
      `Montering av kök och garderober i ${area}`,
      `Tillbyggnader och utbyggnader i ${area}`
    ],
    "elektriker": [
      `Elinstallation i ${area}`,
      `Felsökning av el i ${area}`,
      `Byte av elcentral i ${area}`,
      `Installation av belysning i ${area}`,
      `Jordfelsbrytare installation i ${area}`,
      `Laddbox för elbil i ${area}`,
      `Smart hem installation i ${area}`,
      `Elbesiktning i ${area}`,
      `Byte av uttag och strömbrytare i ${area}`,
      `Utomhusbelysning i ${area}`
    ],
    "vvs": [
      `VVS-installation i ${area}`,
      `Byte av blandare i ${area}`,
      `Värmepump installation i ${area}`,
      `Avloppsrensning i ${area}`,
      `Badrumsrenovering VVS i ${area}`,
      `Golvvärme installation i ${area}`,
      `Vattenläcka akut i ${area}`,
      `Byte av toalettstol i ${area}`,
      `Radiatorinstallation i ${area}`,
      `Varmvattenberedare i ${area}`
    ],
    "malare": [
      `Invändig målning i ${area}`,
      `Fasadmålning i ${area}`,
      `Tapetsering i ${area}`,
      `Lackning av snickerier i ${area}`,
      `Målning av tak i ${area}`,
      `Målning av kök i ${area}`,
      `Renovering av träfasad i ${area}`,
      `Spackling och slipning i ${area}`,
      `Färgsättning och rådgivning i ${area}`,
      `Målning av fönster och dörrar i ${area}`
    ],
    "tradgard": [
      `Gräsklippning i ${area}`,
      `Häckklippning i ${area}`,
      `Trädfällning i ${area}`,
      `Anlägga trädgård i ${area}`,
      `Stenläggning i ${area}`,
      `Plantering i ${area}`,
      `Ogräsrensning i ${area}`,
      `Beskärning av buskar och träd i ${area}`,
      `Trädgårdsdesign i ${area}`,
      `Snöröjning i ${area}`
    ],
    "stad": [
      `Hemstädning i ${area}`,
      `Kontorsstädning i ${area}`,
      `Flyttstädning i ${area}`,
      `Fönsterputs i ${area}`,
      `Storstädning i ${area}`,
      `Trappstädning i ${area}`,
      `Byggstädning i ${area}`,
      `Regelbunden städning i ${area}`,
      `Djuprengöring i ${area}`,
      `Städning efter renovering i ${area}`
    ],
    "markarbeten": [
      `Schaktning i ${area}`,
      `Dränering i ${area}`,
      `Anlägga uppfart i ${area}`,
      `Grundläggning i ${area}`,
      `Murar och stödmurar i ${area}`,
      `Planering av tomt i ${area}`,
      `VA-arbeten i ${area}`,
      `Stenläggning och plattsättning i ${area}`,
      `Grävarbeten i ${area}`,
      `Pool- och dammanläggning i ${area}`
    ],
    "montering": [
      `Möbelmontering i ${area}`,
      `IKEA-montering i ${area}`,
      `Köksmontering i ${area}`,
      `Garderobsmontering i ${area}`,
      `TV-montering i ${area}`,
      `Lampmontering i ${area}`,
      `Badrumsmöbler i ${area}`,
      `Kontorsmöbler i ${area}`,
      `Utomhusmöbler i ${area}`,
      `Barnmöbler och leksaker i ${area}`
    ],
    "flytt": [
      `Flytthjälp i ${area}`,
      `Kontorsflytt i ${area}`,
      `Magasinering i ${area}`,
      `Packhjälp i ${area}`,
      `Pianoflytt i ${area}`,
      `Bohagsflytt i ${area}`,
      `Studentflytt i ${area}`,
      `Företagsflytt i ${area}`,
      `Dödsbo och tömning i ${area}`,
      `Flytt av tunga saker i ${area}`
    ],
    "tekniska-installationer": [
      `Smart hem installation i ${area}`,
      `Larminstallation i ${area}`,
      `Kameraövervakning i ${area}`,
      `Motoriserade persienner i ${area}`,
      `Ljudsystem i ${area}`,
      `Nätverksinstallation i ${area}`,
      `Hemautomation i ${area}`,
      `Solceller installation i ${area}`,
      `Ventilationsinstallation i ${area}`,
      `Portautomatik i ${area}`
    ]
  };

  return serviceItems[serviceSlug] || [];
}

// Hjälpfunktion för certifieringstext
function getCertificationText(serviceSlug: LocalServiceSlug): string {
  const certTexts: Record<LocalServiceSlug, string> = {
    "elektriker": "Elektriker har behörighet enligt Elsäkerhetsverket och arbetar enligt gällande föreskrifter.",
    "vvs": "VVS-montörer har Säker Vatteninstallation-certifiering och arbetar enligt branschregler.",
    "snickare": "Snickare har yrkesbevis och lång erfarenhet av alla typer av snickeritjänster.",
    "malare": "Målare är utbildade yrkesmålare med erfarenhet av både invändig och utvändig målning.",
    "tradgard": "Trädgårdsarbetare har relevant utbildning och certifiering för säkert arbete.",
    "stad": "Städpersonal är utbildade och följer höga hygienrutiner.",
    "markarbeten": "Markentreprenörer har behörighet för grävmaskin och är ansvarsförsäkrade.",
    "montering": "Montörer har erfarenhet av alla typer av möbelmontering och är noggranna.",
    "flytt": "Flyttpersonal är utbildade i säker hantering och har god fysik.",
    "tekniska-installationer": "Tekniker har certifiering för respektive system och produkter."
  };
  return certTexts[serviceSlug];
}

// ============================================================
// VALIDERING - Kontrollera att slug-kombination finns
// ============================================================

export const isValidLocalServicePage = (serviceSlug: string, areaSlug: string): boolean => {
  const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug);
  if (!service) return false;
  
  const area = ALL_AREAS.find(a => generateAreaSlug(a) === areaSlug);
  return !!area;
};

export const getAreaFromSlug = (slug: string): AreaKey | undefined => {
  return ALL_AREAS.find(a => generateAreaSlug(a) === slug);
};

export const getServiceFromSlug = (slug: string) => {
  return LOCAL_SERVICES.find(s => s.slug === slug);
};

// ============================================================
// SITEMAP HELPERS - Generera alla URL:er
// ============================================================

export const generateAllLocalServiceUrls = (): string[] => {
  const urls: string[] = [];
  
  for (const service of LOCAL_SERVICES) {
    for (const area of ALL_AREAS) {
      const areaSlug = generateAreaSlug(area);
      urls.push(`/tjanster/${service.slug}/${areaSlug}`);
    }
  }
  
  return urls;
};

// Räknar totalt antal sidor
export const getTotalLocalPages = (): number => {
  return LOCAL_SERVICES.length * ALL_AREAS.length;
};
