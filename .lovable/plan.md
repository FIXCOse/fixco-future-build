

##Fix: 3 problem på /rot-sidan

### Problem 1: "Begär offert"-knappen gör ingenting
`ROTCalculator.tsx` rad 139 — `Button` saknar `onClick`. Ska öppna `openServiceRequestModal({ mode: 'home_visit', showCategories: true })` enligt projektets mönster.

### Problem 2: Prisexempel räknade på 50% istället för 30%
De hårdkodade värdena i `ROTInfo.tsx` (rad 41-62) visar 50%-besparing. Korrekta värden med 30% ROT:

| Tjänst | Normalpris | Med ROT (30%) | Besparing |
|---|---|---|---|
| Köksblandare | 1 918 kr | 1 343 kr | 575 kr |
| Toalettstol | 3 500 kr | 2 450 kr | 1 050 kr |
| Köksrenovering | 38 360 kr | 26 852 kr | 11 508 kr |

### Problem 3: Redesign "Vad kvalificerar för ROT"-sektionen
Baserat på skärmbilden — ta bort `gradient-primary-subtle` bakgrund (vit bakgrund istället), behåll den tvåkolumniga layouten med kort men ge dem en renare, mer premium känsla. Emojis (✅ / ❌) i rubrikerna som i referensbilden. Ta bort den subtila färgade bakgrunden.

### Filer att ändra

| Fil | Ändring |
|---|---|
| `src/components/ROTCalculator.tsx` | Importera `openServiceRequestModal`, lägg `onClick` på knappen |
| `src/pages/ROTInfo.tsx` | Fixa prisexempel till 30%, redesigna kvalificerar-sektionen |

