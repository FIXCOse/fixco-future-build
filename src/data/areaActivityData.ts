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
