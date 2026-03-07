

## Problem: Dubbel momspåläggning när `vatIncluded=true`

När du anger 958 kr/h **inkl moms** och kryssar i "Priser inkl moms", sparas `subtotal_work_sek = 113 044` (958 × 118). Det värdet ÄR redan inklusive moms.

Men koden (efter förra fixen) multiplicerar **alltid** med 1.25 — oavsett flaggan. Resultat:
- QuotePublic visar: 113 044 × 1.25 = **141 305** — fel, dubbelräknar moms
- ROT beräknas på: 113 044 × 1.25 × 0.30 = 42 392 — fel bas
- Total: 141 305 − 42 392 = 98 913 — fel

**Korrekt** (958 inkl moms × 118h = 113 044 inkl moms):
- Arbetskostnad inkl moms: **113 044 kr**
- ROT: 113 044 × 0.30 = **33 913 kr**
- ATT BETALA: 113 044 − 33 913 = **79 131 kr**

### Åtgärder

**1. `src/components/admin/QuoteFormModal.tsx`** — Återställ `vatIncluded`-villkoret i tre funktioner:

- `calculateDiscount()` (rad 279): `vatIncluded ? subtotal : subtotal * 1.25`
- `calculateSubtotalAfterDiscount()` (rad 293): `vatIncluded ? subtotal : subtotal * 1.25`
- `calculateRotRutDeduction()` (rad 319): `vatIncluded ? workCost : workCost * 1.25`

Logik: om `vatIncluded=true` ÄR item-priset redan inkl moms → multiplicera inte. Om false → multiplicera med 1.25.

**2. `src/pages/QuotePublic.tsx`** (rad 740-746) — Sluta multiplicera med 1.25 när `vatIncluded=true`:

```ts
// Från:
const workCostDisplay = vatIncluded 
  ? Math.round(quote.subtotal_work_sek * 1.25)  // FEL: dubbelräknar
  : quote.subtotal_work_sek;
// Till:
const workCostDisplay = quote.subtotal_work_sek;  // Alltid visa som lagrat
// (vatIncluded=true → lagrat inkl moms, false → lagrat exkl moms)
```

Samma för `matCostDisplay`. Texten "(inkl moms)" / "(exkl moms)" bredvid etiketten kvarstår.

### Resultat efter fix

```text
vatIncluded=true, 958 kr/h × 118h:
  subtotal_work_sek (lagrat) = 113 044 (inkl moms)
  Visas: "Arbetskostnad (inkl moms): 113 044 kr"
  ROT: 113 044 × 0.30 = 33 913 kr
  ATT BETALA: 113 044 − 33 913 = 79 131 kr ✅
```

