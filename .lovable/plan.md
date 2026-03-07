

## Analys: Varför "ATT BETALA" blir 70 652 kr istället för 98 913 kr

### Rotorsaken — en inkonsekvent moms-hantering

Problemet sitter i `calculateSubtotalAfterDiscount()` (rad 289-293 i QuoteFormModal.tsx):

```text
subtotal_work_sek (sparas)     = 113 044  (alltid exkl moms)
QuotePublic visar              = 113 044 × 1.25 = 141 305 kr (korrekt inkl moms)
ROT-avdrag (ny fix)            = 113 044 × 1.25 × 0.30 = 42 392 kr (korrekt)

MEN calculateTotal gör:
  calculateSubtotalAfterDiscount() = 113 044  ← behandlar som "redan inkl moms" pga vatIncluded=true
  minus ROT                        = 42 392
  total_sek                        = 70 652  ← FEL
```

Rad 291: `const subtotalInclVat = vatIncluded ? subtotal : subtotal * 1.25;`

När `vatIncluded=true` multipliceras INTE med 1.25 — men `subtotal_work_sek` sparas **alltid exkl moms** och QuotePublic multiplicerar **alltid** med 1.25 för visning. Så `calculateTotal()` använder 113 044 som bas medan allt annat (display, ROT) använder 141 305.

### Fix

Ändra `calculateSubtotalAfterDiscount()` och `calculateDiscount()` att **alltid** multiplicera med 1.25, eftersom item-priser i databasen alltid är exkl moms:

**Rad 278** i `calculateDiscount()`:
```ts
// Från:
const subtotalInclVat = vatIncluded ? subtotal : subtotal * 1.25;
// Till:
const subtotalInclVat = subtotal * 1.25;
```

**Rad 291** i `calculateSubtotalAfterDiscount()`:
```ts
// Från:
const subtotalInclVat = vatIncluded ? subtotal : subtotal * 1.25;
// Till:
const subtotalInclVat = subtotal * 1.25;
```

### Resultat efter fix

```text
calculateSubtotalAfterDiscount() = 113 044 × 1.25 = 141 305
calculateRotRutDeduction()       = 113 044 × 1.25 × 0.30 = 42 392
calculateTotal()                 = 141 305 − 42 392 = 98 913 ✅
```

### Fil att ändra
- **`src/components/admin/QuoteFormModal.tsx`** — rad 278 och 291: ta bort `vatIncluded`-villkoret, alltid multiplicera med 1.25

### Befintliga offerter
Offerter som redan sparats med fel `total_sek` behöver öppnas och sparas om i admin för att uppdateras.

