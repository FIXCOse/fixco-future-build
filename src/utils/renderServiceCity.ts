/**
 * Central function to render service+city pages in Swedish or English
 * WITHOUT external translation APIs - uses local term dictionaries
 */

import { serviceCityData, ServiceKey, ServiceCityItem } from '@/data/serviceCityData';
import { SERVICE_TERMS, CITY_TERMS, COMMON_TERMS, PHRASE_MAP, SERVICE_SLUG_MAP } from '@/lib/i18n/serviceTerms';

type Lang = 'sv' | 'en';

/**
 * Simple local term replacement for English
 */
function localReplace(input: string): string {
  let result = input;
  
  // First, replace phrases (longer matches first)
  Object.entries(PHRASE_MAP).forEach(([sv, en]) => {
    const regex = new RegExp(sv.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, en);
  });
  
  // Then replace individual terms
  Object.entries(COMMON_TERMS).forEach(([sv, en]) => {
    const regex = new RegExp(`\\b${sv.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, en);
  });
  
  return result;
}

/**
 * Get English slug from Swedish service slug and city
 */
export function getEnglishSlug(serviceSlug: string, city: string): string {
  const enService = SERVICE_SLUG_MAP[serviceSlug as keyof typeof SERVICE_SLUG_MAP] || serviceSlug;
  return `${enService}-${city.toLowerCase()}`;
}

/**
 * Get Swedish slug from English slug
 */
export function getSwedishSlug(enSlug: string): string | null {
  const [enService, city] = enSlug.split('-');
  const svSlugEntry = Object.entries(SERVICE_SLUG_MAP).find(([_, en]) => en === enService);
  
  if (!svSlugEntry) return null;
  
  return `${svSlugEntry[0]}-${city}`;
}

/**
 * Render service+city data in specified language
 */
export function renderServiceCity(
  serviceSlug: string,
  city: 'Uppsala' | 'Stockholm',
  lang: Lang
): {
  h1: string;
  title: string;
  description: string;
  priceHint?: string;
  faqs: Array<{ q: string; a: string }>;
  cases: Array<{ title: string; desc: string }>;
  howItWorks?: Array<{ step: number; title: string; desc: string }>;
  priceExamples?: Array<{ job: string; price: string; duration: string }>;
  quickFacts?: Array<string>;
  didYouKnow?: Array<string>;
  slug: string;
  altSlug: string;
  serviceKey: ServiceKey;
} | null {
  // Map service slug to ServiceKey
  const serviceKeyMap: Record<string, ServiceKey> = {
    'el': 'Elmontör',
    'vvs': 'VVS',
    'snickeri': 'Snickare',
    'maleri': 'Måleri',
    'stadning': 'Städ',
    'markarbeten': 'Markarbeten',
    'flytt': 'Flytt',
    'montering': 'Montering',
    'tradgard': 'Trädgård',
    'tekniska-installationer': 'Tekniska installationer'
  };

  const serviceKey = serviceKeyMap[serviceSlug];
  if (!serviceKey) return null;

  // Find Swedish data (single source of truth)
  const item = serviceCityData.find(
    s => s.service === serviceKey && s.city === city
  );

  if (!item) return null;

  // Translate service and city names
  const serviceName = SERVICE_TERMS[lang][serviceKey];
  const cityName = CITY_TERMS[lang][city];

  // Build localized data
  if (lang === 'sv') {
    // Swedish - use as-is
    return {
      h1: item.h1,
      title: item.title,
      description: item.description,
      priceHint: item.priceHint,
      faqs: item.faqs,
      cases: item.cases,
      howItWorks: item.howItWorks,
      priceExamples: item.priceExamples,
      quickFacts: item.quickFacts,
      didYouKnow: item.didYouKnow,
      slug: item.slug,
      altSlug: `/en/services/${getEnglishSlug(serviceSlug, city)}`,
      serviceKey: item.service
    };
  } else {
    // English - use local term replacement
    return {
      h1: `${serviceName} in ${cityName}`,
      title: localReplace(item.title),
      description: localReplace(item.description),
      priceHint: item.priceHint ? localReplace(item.priceHint) : undefined,
      faqs: item.faqs.map(faq => ({
        q: localReplace(faq.q),
        a: localReplace(faq.a)
      })),
      cases: item.cases.map(c => ({
        title: localReplace(c.title),
        desc: localReplace(c.desc)
      })),
      howItWorks: item.howItWorks?.map(step => ({
        step: step.step,
        title: localReplace(step.title),
        desc: localReplace(step.desc)
      })),
      priceExamples: item.priceExamples?.map(ex => ({
        job: localReplace(ex.job),
        price: ex.price,
        duration: localReplace(ex.duration)
      })),
      quickFacts: item.quickFacts?.map(fact => localReplace(fact)),
      didYouKnow: item.didYouKnow?.map(fact => localReplace(fact)),
      slug: getEnglishSlug(serviceSlug, city),
      altSlug: `/tjanster/${item.slug}`,
      serviceKey: item.service
    };
  }
}
