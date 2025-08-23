import { PriceMode } from '@/stores/priceStore';
import { ServicePricing } from './priceCalculation';

export interface FormattedPrice {
  display: string;
  amount: number;
  originalAmount?: number;
  originalDisplay?: string;
  badge: string | null;
  eligible: boolean;
  savings?: number;
  savingsPercent?: number;
  mode: PriceMode;
}

/**
 * Central price formatter that consistently shows "inkl. moms" everywhere
 * Handles ROT/RUT pricing and badges consistently across all components
 */
export function formatPrice(
  basePrice: number, 
  priceUnit: string, 
  mode: PriceMode,
  eligible: { rot: boolean; rut: boolean },
  laborShare: number = 1.0,
  fixedPrice: boolean = false
): FormattedPrice {
  
  const ROT_RATE = 0.50;
  const RUT_RATE = 0.50;
  
  // Always show "inkl. moms" suffix
  const formatDisplay = (amount: number, unit: string) => {
    if (unit === 'från') {
      return `från ${amount.toLocaleString('sv-SE')} kr inkl. moms`;
    }
    return `${amount.toLocaleString('sv-SE')} ${unit} inkl. moms`;
  };

  // Base formatting for all mode or fixed prices
  if (mode === 'all' || fixedPrice) {
    return {
      display: formatDisplay(basePrice, priceUnit),
      amount: basePrice,
      badge: null,
      eligible: true,
      mode: 'all',
      savings: 0,
      savingsPercent: 0
    };
  }

  // Calculate labor and material costs
  const laborCost = basePrice * laborShare;
  const materialCost = basePrice - laborCost;

  // ROT calculation
  if (mode === 'rot') {
    if (eligible.rot) {
      const discountedLaborCost = laborCost * (1 - ROT_RATE);
      const finalPrice = materialCost + discountedLaborCost;
      const savings = basePrice - finalPrice;
      const savingsPercent = Math.round((savings / basePrice) * 100);

      return {
        display: formatDisplay(Math.round(finalPrice), priceUnit),
        amount: finalPrice,
        originalAmount: basePrice,
        originalDisplay: formatDisplay(basePrice, priceUnit),
        badge: 'ROT',
        eligible: true,
        savings,
        savingsPercent,
        mode: 'rot'
      };
    } else {
      // Not eligible for ROT
      return {
        display: formatDisplay(basePrice, priceUnit),
        amount: basePrice,
        badge: 'Ej ROT',
        eligible: false,
        mode: 'all',
        savings: 0,
        savingsPercent: 0
      };
    }
  }

  // RUT calculation
  if (mode === 'rut') {
    if (eligible.rut) {
      const discountedLaborCost = laborCost * (1 - RUT_RATE);
      const finalPrice = materialCost + discountedLaborCost;
      const savings = basePrice - finalPrice;
      const savingsPercent = Math.round((savings / basePrice) * 100);

      return {
        display: formatDisplay(Math.round(finalPrice), priceUnit),
        amount: finalPrice,
        originalAmount: basePrice,
        originalDisplay: formatDisplay(basePrice, priceUnit),
        badge: 'RUT',
        eligible: true,
        savings,
        savingsPercent,
        mode: 'rut'
      };
    } else {
      // Not eligible for RUT
      return {
        display: formatDisplay(basePrice, priceUnit),
        amount: basePrice,
        badge: 'Ej RUT',
        eligible: false,
        mode: 'all',
        savings: 0,
        savingsPercent: 0
      };
    }
  }

  // Fallback to ordinary
  return {
    display: formatDisplay(basePrice, priceUnit),
    amount: basePrice,
    badge: null,
    eligible: true,
    mode: 'all',
    savings: 0,
    savingsPercent: 0
  };
}

/**
 * Helper function to check if a service is eligible for the current mode
 */
export function isServiceEligible(
  eligible: { rot: boolean; rut: boolean },
  mode: PriceMode
): boolean {
  if (mode === 'all') return true;
  if (mode === 'rot') return eligible.rot;
  if (mode === 'rut') return eligible.rut;
  return false;
}

/**
 * Helper to get badge color classes
 */
export function getBadgeClasses(badge: string | null): string {
  if (!badge) return '';
  
  if (badge === 'ROT' || badge === 'RUT') {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  }
  
  if (badge === 'Ej ROT' || badge === 'Ej RUT') {
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
  
  return 'bg-primary/10 text-primary';
}