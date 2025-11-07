/**
 * Service and city terms for local translation (no external APIs)
 * Single source of truth for Swedish <-> English service/city names
 */

export const SERVICE_TERMS = {
  sv: {
    'Elmontör': 'Elmontör',
    'VVS': 'VVS-montör',
    'Snickare': 'Snickare',
    'Måleri': 'Målare',
    'Städ': 'Städtjänster',
    'Markarbeten': 'Markarbeten',
    'Flytt': 'Flyttjänster',
    'Montering': 'Montering',
    'Trädgård': 'Trädgårdstjänster',
    'Tekniska installationer': 'Tekniska installationer'
  },
  en: {
    'Elmontör': 'Electrician',
    'VVS': 'Plumber',
    'Snickare': 'Carpenter',
    'Måleri': 'Painter',
    'Städ': 'Cleaning Services',
    'Montering': 'Assembly Services',
    'Trädgård': 'Gardening Services',
    'Markarbeten': 'Groundwork',
    'Tekniska installationer': 'Technical Installations',
    'Flytt': 'Moving Services'
  }
} as const;

export const CITY_TERMS = {
  sv: {
    'Uppsala': 'Uppsala',
    'Stockholm': 'Stockholm'
  },
  en: {
    'Uppsala': 'Uppsala',
    'Stockholm': 'Stockholm'
  }
} as const;

/**
 * Slug mapping for service keys
 */
export const SERVICE_SLUG_MAP = {
  'el': 'electrician',
  'vvs': 'plumber',
  'snickeri': 'carpenter',
  'maleri': 'painter',
  'stadning': 'cleaning',
  'montering': 'assembly',
  'tradgard': 'gardening',
  'markarbeten': 'groundwork',
  'tekniska-installationer': 'technical-installations',
  'flytt': 'moving'
} as const;

/**
 * Common construction and service terms for local replacement
 */
export const COMMON_TERMS: Record<string, string> = {
  'ROT-avdrag': 'ROT deduction',
  'RUT-avdrag': 'RUT deduction',
  'offert': 'quote',
  'kostnadsfri': 'free',
  'boka': 'book',
  'timpris': 'hourly rate',
  'fast pris': 'fixed price',
  'garanti': 'warranty',
  'besiktning': 'inspection',
  'auktoriserad': 'authorized',
  'certifierad': 'certified',
  'snabb hjälp': 'quick assistance',
  'akut': 'emergency',
  'läcka': 'leak',
  'felsökning': 'troubleshooting',
  'installation': 'installation',
  'renovering': 'renovation',
  'byte': 'replacement',
  'reparation': 'repair',
  'montering': 'installation',
  'kontakta oss': 'contact us',
  'ring oss': 'call us',
  'begär offert': 'request quote',
  'prisexempel': 'price examples',
  'vanliga frågor': 'frequently asked questions',
  'hur det fungerar': 'how it works',
  'våra tjänster': 'our services',
  'populära tjänster': 'popular services',
  'tidigare uppdrag': 'previous projects',
  'kundcase': 'customer cases',
  'arbete': 'labor',
  'material': 'materials',
  'arbetskostnad': 'labor cost',
  'timmar': 'hours',
  'dagar': 'days',
  'veckor': 'weeks',
  'inom': 'within',
  'från': 'from',
  'upp till': 'up to',
  'inkl': 'incl',
  'exkl': 'excl',
  'moms': 'VAT',
  'kr': 'kr',
  'per': 'per'
};

/**
 * Prepositions and common phrases
 */
export const PHRASE_MAP: Record<string, string> = {
  ' i Uppsala': ' in Uppsala',
  ' i Stockholm': ' in Stockholm',
  'Vi på Fixco': 'We at Fixco',
  'Fixco erbjuder': 'Fixco offers',
  'Kontakta oss': 'Contact us',
  'Ring oss': 'Call us',
  'Start inom': 'Start within',
  'Vi täcker': 'We cover',
  'hela': 'all of',
  'kommun': 'municipality',
  'områden': 'areas',
  'stadsdelar': 'districts',
  'Du betalar ingen resekostnad': 'You pay no travel fee',
  'Resekostnad': 'Travel fee',
  'för uppdrag': 'for assignments',
  'Se alla våra tjänster': 'See all our services',
  'Visa alla tjänster': 'Show all services',
  'Se priser': 'See prices',
  'Utforska vårt utbud': 'Explore our range',
  'Vanligaste uppdragen': 'Most common assignments',
  'Behörigheter och certifieringar': 'Qualifications and certifications',
  'Populära': 'Popular',
  'tjänster': 'services',
  'tidigare': 'previous',
  'uppdrag': 'projects',
  'Prisexempel för': 'Price examples for',
  'Alla priser inkluderar': 'All prices include',
  'Exakta priser får du i din offert': 'Exact prices will be provided in your quote',
  'Så här fungerar det': 'How it works',
  'Vanliga frågor': 'Frequently asked questions',
  'Relaterade tjänster': 'Related services',
  'Utforska andra tjänster': 'Explore other services',
  'i området': 'in the area',
  'Tillbaka till tjänster': 'Back to services'
};
