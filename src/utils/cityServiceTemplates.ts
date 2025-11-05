import { servicesDataNew } from '@/data/servicesDataNew';

/**
 * Generates city-specific service metadata dynamically from main service data.
 * This ensures a Single Source of Truth - when main service data updates,
 * all city pages automatically reflect the changes.
 */
export const generateCityServiceData = (serviceSlug: string, city: string) => {
  const service = servicesDataNew.find(s => s.slug === serviceSlug);
  if (!service) return null;

  const rotRate = service.eligible.rot ? '30%' : service.eligible.rut ? '50%' : '50%';

  return {
    h1: `${service.title} i ${city}`,
    title: `${service.title} i ${city} – ${service.description} | ROT/RUT ${rotRate} avdrag`,
    description: `Professionell ${service.title.toLowerCase()} i ${city}. ${service.description}. Snabb start, ROT/RUT-avdrag. Vi täcker hela ${city}.`,
    priceHint: `Från ${service.basePrice} ${service.priceUnit}`,
    basePrice: service.basePrice,
    priceUnit: service.priceUnit,
    eligible: service.eligible
  };
};
