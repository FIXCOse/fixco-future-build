export type EstimateInput = {
  serviceName: string;
  serviceId?: string;
  quantity: number;          // m², löpmeter, timmar
  unit: 'timme' | 'm²' | 'löpmeter' | 'st' | 'project';
  materialSek?: number;      // materialkostnad
  hourlySek?: number;        // timpris eller m²-pris
  rotEligible?: boolean;
};

export type EstimateResult = {
  serviceName: string;
  quantity: number;
  unit: string;
  workSek: number;
  materialSek: number;
  subtotalSek: number;
  vatSek: number;
  totalInclVatSek: number;
  rotDeductionSek: number;
  totalAfterRotSek: number;
  rotEligible: boolean;
};

/**
 * Beräknar offert med svensk ROT-regel:
 * - 25% moms på allt
 * - 30% ROT-avdrag på arbetskostnad INKLUSIVE moms (enligt Skatteverket)
 * - OBS: ROT-satsen sänktes till 30% från 2026-01-01
 */
export function estimateQuote(input: EstimateInput, serviceBaseSek?: number): EstimateResult {
  const hourly = input.hourlySek ?? serviceBaseSek ?? 950;
  const work = hourly * input.quantity;
  const material = input.materialSek ?? 0;
  const subtotal = work + material;
  
  // Moms 25%
  const vat = subtotal * 0.25;
  const totalInclVat = subtotal + vat;
  
  // ROT: 30% av arbetskostnaden INKLUSIVE moms (Skatteverkets regel fr.o.m. 2026)
  const rotEligible = input.rotEligible ?? true;
  const workInclVat = work * 1.25;
  const rotDeduction = rotEligible ? Math.round(workInclVat * 0.30) : 0;
  
  const totalAfterRot = Math.max(0, totalInclVat - rotDeduction);
  
  return {
    serviceName: input.serviceName,
    quantity: input.quantity,
    unit: input.unit,
    workSek: Math.round(work),
    materialSek: Math.round(material),
    subtotalSek: Math.round(subtotal),
    vatSek: Math.round(vat),
    totalInclVatSek: Math.round(totalInclVat),
    rotDeductionSek: rotDeduction,
    totalAfterRotSek: Math.round(totalAfterRot),
    rotEligible,
  };
}

/**
 * Formaterar priser enligt svensk standard: 12 345 kr
 */
export function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 kr';
  }
  return `${amount.toLocaleString('sv-SE')} kr`;
}
