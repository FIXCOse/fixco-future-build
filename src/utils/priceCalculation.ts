import { PriceMode } from '@/stores/priceStore';

export interface ServicePricing {
  id: string;
  title: string;
  basePrice: number;      // pris (inkl moms)
  priceUnit: 'kr/h' | 'kr' | 'från';
  eligible: { rot: boolean; rut: boolean };
  laborShare?: number;    // default 1.0 om hela priset är arbetstid
  fixedPrice?: boolean;   // om priset inte ska påverkas av avdrag
}

// ROT/RUT: 30% av arbetskostnad INKLUSIVE moms enligt Skatteverket
// OBS: ROT-satsen sänktes till 30% från 2026-01-01
const ROT_RATE = 0.30; // 30% rabatt på arbetskostnad (inkl moms)
const RUT_RATE = 0.30; // 30% rabatt på arbetskostnad (inkl moms)

export function calcDisplayPrice(service: ServicePricing, mode: PriceMode) {
  const base = service.basePrice;
  const laborShare = service.laborShare ?? 1.0;
  const laborCost = base * laborShare;
  const materialCost = base - laborCost;

  // Fixed price services or all mode - return base price
  if (service.fixedPrice || mode === 'all') {
    return {
      amount: base,
      display: `${base.toLocaleString('sv-SE')} ${service.priceUnit}`,
      mode: 'all' as const,
      eligible: true,
      savings: 0,
      savingsPercent: 0,
      badge: null
    };
  }

  // ROT calculation
  if (mode === 'rot' && service.eligible.rot) {
    const discountedLaborCost = laborCost * (1 - ROT_RATE);
    const finalPrice = materialCost + discountedLaborCost;
    const savings = base - finalPrice;
    const savingsPercent = Math.round((savings / base) * 100);

    return {
      amount: finalPrice,
      display: `${Math.round(finalPrice).toLocaleString('sv-SE')} ${service.priceUnit}`,
      originalAmount: base,
      originalDisplay: `${base.toLocaleString('sv-SE')} ${service.priceUnit}`,
      mode: 'rot' as const,
      eligible: true,
      savings,
      savingsPercent,
      badge: 'ROT'
    };
  }

  // RUT calculation
  if (mode === 'rut' && service.eligible.rut) {
    const discountedLaborCost = laborCost * (1 - RUT_RATE);
    const finalPrice = materialCost + discountedLaborCost;
    const savings = base - finalPrice;
    const savingsPercent = Math.round((savings / base) * 100);

    return {
      amount: finalPrice,
      display: `${Math.round(finalPrice).toLocaleString('sv-SE')} ${service.priceUnit}`,
      originalAmount: base,
      originalDisplay: `${base.toLocaleString('sv-SE')} ${service.priceUnit}`,
      mode: 'rut' as const,
      eligible: true,
      savings,
      savingsPercent,
      badge: 'RUT'
    };
  }

  // Not eligible for selected mode - return price with eligible=false
  return {
    amount: base,
    display: `${base.toLocaleString('sv-SE')} ${service.priceUnit}`,
    mode: 'all' as const,
    eligible: false,
    savings: 0,
    savingsPercent: 0,
    badge: null
  };
}

export function isEligibleForMode(service: ServicePricing, mode: PriceMode): boolean {
  if (mode === 'all') return true;
  if (mode === 'rot') return service.eligible.rot;
  if (mode === 'rut') return service.eligible.rut;
  return false;
}