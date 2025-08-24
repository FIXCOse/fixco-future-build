// Postcode formatting and validation helpers for Swedish postcodes

export const normalizePostcode = (raw: string = '') => 
  raw.replace(/\D/g, '').slice(0, 5);

export const formatPostcode = (raw: string = '') => {
  const digits = normalizePostcode(raw);
  return digits.length >= 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits;
};

export const isValidSwedishPostcode = (raw: string = '') => {
  const digits = normalizePostcode(raw);
  return digits.length === 5 && /^\d{5}$/.test(digits);
};