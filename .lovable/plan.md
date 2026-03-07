

## Plan: Fixa ROT-beräkningen — räkna alltid på arbetskostnad inkl moms

### Rotorsaken

`subtotal_work_sek` sparas alltid som **exkl moms** (raw item sum). Men `calculateRotRutDeduction()` i QuoteFormModal använder `calculateSubtotalAfterDiscount()` som — när `vatIncluded=true` — behandlar det råa beloppet som om det redan vore inkl moms (ingen × 1.25). Resultatet: ROT beräknas på exkl moms istället för inkl moms.

Från skärmdumparna:
- Sparat: `subtotal_work_sek = 113 044` (exkl moms)
- Visat korrekt: `141 305 kr inkl moms` (113 044 × 1.25)
- ROT felaktigt: `33 913 kr` (113 044 × 0.30) — exkl moms
- ROT korrekt: `42 392 kr` (141 305 × 0.30) — inkl moms

### Ändringar

**1. `src/components/admin/QuoteFormModal.tsx` — `calculateRotRutDeduction()`**

Nuvarande logik använder `subtotalAfterDiscount * workRatio` som bas, men den funktionen ger fel resultat vid `vatIncluded=true`. Fix: beräkna arbetskostnad inkl moms explicit, oberoende av `vatIncluded`-flaggan:

```ts
const calculateRotRutDeduction = () => {
  const workCost = calculateSubtotalWork();
  const matCost = calculateSubtotalMaterial();
  const totalCost = workCost + matCost;
  const workRatio = totalCost > 0 ? workCost / totalCost : 1;
  
  // Arbetskostnad INKL moms — alltid multiplicera med 1.25
  // subtotal_work_sek sparas alltid exkl moms
  const workCostInclVat = workCost * 1.25;
  
  // Proportionell rabatt på arbetsdelen
  const discount = calculateDiscount();
  const discountOnWork = discount * workRatio;
  const workCostAfterDiscountInclVat = workCostInclVat - discountOnWork;
  
  let deduction = 0;
  if (enableRot) {
    deduction += Math.round(workCostAfterDiscountInclVat * (rotRate / 100));
  }
  if (enableRut) {
    deduction += Math.round(workCostAfterDiscountInclVat * (rutRate / 100));
  }
  return deduction;
};
```

Dessutom behöver `calculateTotal()` uppdateras så den tar hänsyn till att ROT dras från totalen inkl moms oavsett `vatIncluded`-flagga.

**2. `src/pages/QuotePublic.tsx` — rad 831**

Ändra fallback-procent från `50` till `30`:
```tsx
Skattereduktion (ROT {quote.rot_percentage || 30}%)
```

**3. DB-migration — `create_draft_quote_for_booking`**

Rad 107: `rot_deduction := work_total * 0.30;`
Ändra till: `rot_deduction := work_total * 1.25 * 0.30;`

Rad 110: `total := subtotal + vat - rot_deduction;` — detta blir korrekt automatiskt när rot_deduction beräknas rätt.

**4. PDF-templates och e-postmallar — redan korrekt**

`generateQuotePdf.ts` och `pdf-html-templates.ts` visar redan `quote.rot_percentage || 30` och använder det sparade `rot_deduction_sek`-värdet, så de blir korrekta automatiskt när beräkningen fixas.

### Påverkan på befintliga offerter

Offerter som redan sparats med fel ROT-belopp behöver öppnas och sparas om i admin-formuläret. Nya offerter och auto-genererade draft-offerter från bokningar blir korrekta direkt.

