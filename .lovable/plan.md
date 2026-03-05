

## Plan: Fixa CTA-knappens storlek under "Så bokar du"

### Problem
Knappen "Begär offert" under stegen har `size="cta"` (h-12, px-8, text-base, rounded-xl) och `variant="cta-primary"` med hover-scale, vilket gör den oproportionerligt stor och dominant i kontexten.

### Ändring i `src/pages/LocalServicePage.tsx` (rad 508-522)

Byt till en mindre, mer subtil knappstorlek:
- `size="cta"` → `size="default"` 
- `variant="cta-primary"` → `variant="default"`
- Behåll `mt-10` för avstånd

Detta ger en `h-10 px-4` knapp som passar bättre proportionellt under steg-korten.

En fil, en ändring.

