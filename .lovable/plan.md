

## Plan: Sortera tjänster så de med synliga priser visas först

### Problem
På huvudtjänstesidorna (t.ex. `/tjanster/snickeri`) visas "Begär offert"-tjänster blandat med prisade tjänster. Det gör att första sidan ofta fylls med offert-tjänster istället för de med synliga priser.

### Lösning
Sortera `filteredSubServices` i `ServiceDetail.tsx` (och `ServiceCityDetail.tsx`) så att tjänster med `price_type: 'hourly'` eller `'fixed'` visas **före** `price_type: 'quote'`. Inom varje grupp behålls befintlig ordning (`sort_order`).

### Fil att ändra

| Fil | Ändring |
|---|---|
| **`src/pages/ServiceDetail.tsx`** (rad 96-102) | Lägg till `.sort()` efter `.filter()` — tjänster med pris först, offert sist |
| **`src/pages/locations/ServiceCityDetail.tsx`** (rad ~120-130) | Samma sorteringslogik |

### Sorteringslogik
```ts
.sort((a, b) => {
  const aHasPrice = a.price_type !== 'quote' ? 0 : 1;
  const bHasPrice = b.price_type !== 'quote' ? 0 : 1;
  return aHasPrice - bHasPrice;
})
```

Inga prisändringar, inga nya tjänster — bara omsortering.

