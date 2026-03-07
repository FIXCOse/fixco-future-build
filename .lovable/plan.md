

## Plan: Prioritera populära kategorier i default-sorteringen ("Alla tjänster")

### Problem
När "Alla tjänster" är valt och sorteringen är "relevans" visas tjänsterna i databasordning utan prioritering. Populära kategorier som montering, snickeri och rivning hamnar inte nödvändigtvis på första sidorna.

### Lösning
I `FastServiceFilter.tsx`, lägg till en prioriteringslogik i sort-steget för `sortBy === 'relevans'` (default):

1. **Prioritera kategori**: Ge snickeri, montering och rivning högre prioritet
2. **Inom varje grupp**: Visa tjänster med synliga priser (hourly/fixed) före offert-tjänster

### Fil att ändra

| Fil | Ändring |
|---|---|
| **`src/components/FastServiceFilter.tsx`** (rad 193-200) | Lägg till sortering för `relevans`-läget som prioriterar snickeri → montering → rivning → övriga, och inom varje grupp: prissatta före offert |

### Sorteringslogik
```ts
// Default "relevans" sort: prioritize popular categories, then priced services
const CATEGORY_PRIORITY: Record<string, number> = {
  'snickeri': 0,
  'montering': 1,
  'rivning': 2,
};

if (sortBy === 'relevans') {
  filtered.sort((a, b) => {
    const aPrio = CATEGORY_PRIORITY[a.category] ?? 3;
    const bPrio = CATEGORY_PRIORITY[b.category] ?? 3;
    if (aPrio !== bPrio) return aPrio - bPrio;
    // Within same priority: priced before quote
    const aHasPrice = a.priceType !== 'quote' ? 0 : 1;
    const bHasPrice = b.priceType !== 'quote' ? 0 : 1;
    return aHasPrice - bHasPrice;
  });
}
```

Denna sortering gäller bara i "Alla tjänster" + "relevans"-läge. Vid kategorifiltrering eller annan sort påverkas ingenting.

