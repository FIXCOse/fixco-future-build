

## Plan: Visa "Material faktureras separat" på offerten

### Problem
När man skapar offert och väljer "Materialkostnad ingår inte" sparas aldrig den informationen — `materialIncluded` är bara ett lokalt state i formuläret. Det enda som händer är att `subtotal_mat_sek` sätts till 0. Den publika offerten visar då bara ingen materialrad alls, utan att förklara att material tillkommer separat.

### Lösning (2 delar)

**1. Spara flaggan i items-metadata (QuoteFormModal.tsx)**
Lägg till ett metadata-objekt i items-arrayen vid spara, t.ex.:
```ts
items: [
  ...items,
  ...(materialIncluded ? [] : [{ type: '_meta', key: 'material_included', value: false }])
]
```
Detta kräver ingen databasändring — items är redan en JSONB-kolumn.

**2. Visa info-ruta i publika vyn (QuotePublic.tsx)**
Efter kostnadsspecifikationen, om `_meta.material_included === false` finns i items, visa:
```
ℹ️ Material ingår ej i denna offert och faktureras separat efter slutfört arbete.
```
Stilas som en info-ruta (blå/neutral bakgrund med Package-ikon), placerad i "Betalning"-kortet eller direkt efter prissammanställningen.

### Filer som ändras
- `src/components/admin/QuoteFormModal.tsx` — spara `material_included` i items-metadata
- `src/pages/QuotePublic.tsx` — läs metadata och visa info-ruta

