export const normalizeOrgNo = (raw: string) =>
  (raw || "").replace(/\D/g, "").slice(0, 10);

export const formatOrgNo = (raw: string) => {
  const digits = normalizeOrgNo(raw);
  return digits.length > 6 ? `${digits.slice(0, 6)}-${digits.slice(6)}` : digits;
};

// Luhn-kontroll för 10-siffrigt svenskt org/personnummer
export const isValidSwedishOrgNo = (raw: string) => {
  const digits = normalizeOrgNo(raw);
  if (digits.length !== 10) return false;
  
  const nums = digits.split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let v = nums[i] * (i % 2 === 0 ? 2 : 1);
    if (v > 9) v -= 9;
    sum += v;
  }
  const control = (10 - (sum % 10)) % 10;
  return control === nums[9];
};