// ============================================================
// AKTIVITETSDATA PER ORT - För UX-signaler
// ============================================================

import type { AreaKey } from './localServiceData';

export interface AreaActivity {
  recentProjects: number;
  activeWorkers: number;
  avgRating: number;
  responseTimeHours: number;
  reviewCount: number;
}

// Generera realistisk aktivitetsdata baserat på ortens storlek
const generateActivityData = (population: number, area: string): AreaActivity => {
  // Större orter = mer aktivitet
  const sizeFactor = Math.min(population / 100000, 1);
  
  // Base values med viss variation
  const baseProjects = 15 + Math.floor(sizeFactor * 25);
  const baseWorkers = 5 + Math.floor(sizeFactor * 10);
  const baseReviews = 50 + Math.floor(sizeFactor * 200);
  
  // Lägg till lite slumpmässig variation
  const hash = area.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variation = (hash % 10) / 10;
  
  return {
    recentProjects: Math.floor(baseProjects + variation * 10),
    activeWorkers: Math.floor(baseWorkers + variation * 5),
    avgRating: 4.7 + (variation * 0.3), // 4.7-5.0
    responseTimeHours: 2,
    reviewCount: Math.floor(baseReviews + variation * 50),
  };
};

// Population data (approximated)
const areaPopulations: Record<string, number> = {
  "Stockholm": 984000,
  "Uppsala": 248000,
  "Södermalm": 130000,
  "Huddinge": 118000,
  "Nacka": 109000,
  "Södertälje": 103000,
  "Haninge": 98000,
  "Botkyrka": 96000,
  "Solna": 87000,
  "Järfälla": 83000,
  "Bromma": 78000,
  "Sollentuna": 76000,
  "Östermalm": 76000,
  "Vasastan": 75000,
  "Täby": 75000,
  "Kungsholmen": 72000,
  "Norrtälje": 65000,
  "Sundbyberg": 54000,
  "Sigtuna": 52000,
  "Lidingö": 50000,
  "Upplands Väsby": 49000,
  "Tyresö": 49000,
  "Enköping": 48000,
  "Värmdö": 47000,
  "Vallentuna": 36000,
  "Danderyd": 34000,
  "Upplands-Bro": 32000,
  "Åkersberga": 32000,
  "Ekerö": 30000,
  "Nynäshamn": 30000,
  "Märsta": 28000,
  "Tierp": 22000,
  "Östhammar": 22000,
  "Knivsta": 21000,
  "Salem": 18000,
  "Sävja": 12000,
  "Vaxholm": 12000,
  "Nykvarn": 12000,
  "Gottsunda": 10000,
  "Storvreta": 9000,
  "Eriksberg": 8000,
  "Järna": 8000,
  "Bälinge": 6000,
  "Gränby": 5000,
  "Alsike": 4500,
  "Sunnersta": 4000,
  "Björklinge": 3500,
  "Ultuna": 3000,
  "Gamla Uppsala": 2500,
  "Hägersten": 95000,
  "Vattholma": 800,
  "Skyttorp": 600,
  "Lövstalöt": 500,
};

// Cache för aktivitetsdata
const activityCache: Record<string, AreaActivity> = {};

export const getAreaActivity = (area: AreaKey): AreaActivity => {
  if (activityCache[area]) {
    return activityCache[area];
  }
  
  const population = areaPopulations[area] || 10000;
  const activity = generateActivityData(population, area);
  activityCache[area] = activity;
  
  return activity;
};

// Generera review-text baserat på ort och tjänst
export const getAreaReview = (area: string, serviceName: string): string => {
  const reviews = [
    `Fantastisk ${serviceName?.toLowerCase()} i ${area}! Professionella och punktliga. Rekommenderas starkt.`,
    `Bästa hantverkarna vi anlitat i ${area}. Snyggt jobb och bra kommunikation hela vägen.`,
    `Mycket nöjd med arbetet som utfördes i vårt hem i ${area}. Kommer definitivt anlita igen.`,
    `Pålitliga och duktiga! Fixade allt på utsatt tid här i ${area}. Toppbetyg!`,
    `Utmärkt service från start till mål. Rekommenderar till alla i ${area}-området.`,
  ];
  
  const hash = (area + serviceName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return reviews[hash % reviews.length];
};

// Utökad namnlista med internationell mix
const extendedFirstNames = [
  'Emma', 'Erik', 'Anna', 'Johan', 'Sofia', 'Lars', 'Maria', 'Anders', 'Karin', 'Peter',
  'Ali', 'Fatima', 'Chen', 'Mei', 'Mohammed', 'Amira', 'Pawel', 'Ewa', 'Yusuf', 'Zeynep',
  'Gustav', 'Lena', 'Oscar', 'Elin', 'Viktor', 'Klara', 'David', 'Sara', 'Nils', 'Eva',
  'Raj', 'Priya', 'Marco', 'Elena', 'Andreas', 'Hanna', 'Mikael', 'Linda', 'Jakob', 'Maja',
  'Hassan', 'Leila', 'Henrik', 'Camilla', 'Joakim', 'Rebecka', 'Alexander', 'Ida'
];

const extendedLastInitials = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'V', 'W', 'Z'];

// Recensionsmallar (20+)
const reviewTemplates = [
  `Fantastisk {service} i {area}! Professionella och punktliga.`,
  `Bästa hantverkarna vi anlitat i {area}. Snyggt jobb!`,
  `Mycket nöjd med arbetet i vårt hem i {area}. Kommer anlita igen!`,
  `Pålitliga och duktiga! Fixade allt på utsatt tid här i {area}.`,
  `Utmärkt service från start till mål. Rekommenderar varmt!`,
  `Helt fantastiskt bemötande! Proffsigt utfört jobb i {area}.`,
  `Snabba, effektiva och städade efter sig. Perfekt för oss!`,
  `ROT-avdraget ordnades smidigt. Supernöjd kund i {area}!`,
  `Bra pris och kvalitet. Gjorde precis som vi önskade.`,
  `Otroligt nöjd! Skulle anlita igen utan tvekan.`,
  `Proffsigt team som levererade i tid. Stort tack!`,
  `Överträffade våra förväntningar. Rekommenderas starkt!`,
  `Snygg finish och bra kommunikation hela vägen.`,
  `Kanon service och hjälpsamma hantverkare i {area}!`,
  `Allt gick smidigt från offert till färdigt resultat.`,
  `Toppen från början till slut. Vänliga och professionella.`,
  `Bästa beslutet vi gjort! Fantastiskt resultat i {area}.`,
  `Prisvärt och kvalitativt arbete. Rekommenderar gärna!`,
  `Punktliga och noggranna. Kommer definitivt tillbaka!`,
  `Super nöjd med {service}. Fixade allt på en dag!`,
];

// Interface för recensionsdata
export interface TestimonialData {
  quote: string;
  name: string;
  location: string;
  rating: number;
}

// Generera FLERA unika recensioner per ort och tjänst
export const getAreaReviews = (area: string, serviceName: string, count: number = 15): TestimonialData[] => {
  const results: TestimonialData[] = [];
  
  for (let i = 0; i < count; i++) {
    // Unik hash per index som kombinerar area + service + index
    const hash = (area + serviceName + i.toString()).split('').reduce((acc, char, idx) => 
      acc + char.charCodeAt(0) * (idx + 1), 0
    );
    
    const template = reviewTemplates[(hash * 3) % reviewTemplates.length]
      .replace('{service}', serviceName?.toLowerCase() || 'service')
      .replace('{area}', area);
    
    const firstName = extendedFirstNames[hash % extendedFirstNames.length];
    const lastInitial = extendedLastInitials[(hash * 7) % extendedLastInitials.length];
    
    results.push({
      quote: template,
      name: `${firstName} ${lastInitial}.`,
      location: area,
      rating: [4, 5, 5, 5, 5][(hash * 11) % 5] // 80% 5-stjärnor, 20% 4-stjärnor
    });
  }
  
  return results;
};

// Generera reviewer-namn
export const getRandomReviewer = (area: string): string => {
  const firstNames = ['Anna', 'Erik', 'Maria', 'Johan', 'Sofia', 'Lars', 'Emma', 'Anders', 'Karin', 'Peter'];
  const lastInitials = ['A', 'B', 'E', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'S'];
  
  const hash = area.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const firstName = firstNames[hash % firstNames.length];
  const lastInitial = lastInitials[(hash * 7) % lastInitials.length];
  
  return `${firstName} ${lastInitial}.`;
};

// Generera HowTo-steg för tjänst
export const getHowToSteps = (serviceName: string, area: string) => [
  {
    title: "Beskriv ditt projekt",
    description: `Berätta vad du behöver hjälp med. Ju mer detaljer, desto bättre offert kan vi ge dig för ${serviceName?.toLowerCase()} i ${area}.`,
    icon: "FileText"
  },
  {
    title: "Få gratis offert",
    description: `Vi återkommer inom 24 timmar med en kostnadsfri offert för din ${serviceName?.toLowerCase()} i ${area}.`,
    icon: "Clock"
  },
  {
    title: "Boka tid som passar",
    description: `Välj en tid som passar dig. Vi kan ofta börja inom 24-48 timmar i ${area}.`,
    icon: "Calendar"
  },
  {
    title: "Jobbet utförs",
    description: `Våra certifierade ${serviceName?.toLowerCase()} utför arbetet professionellt med garanti.`,
    icon: "CheckCircle"
  }
];
