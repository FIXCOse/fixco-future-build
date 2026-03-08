

## Fix: Ändra "Snickeri" → "Snickare" och "El" → "Elektriker" i copy-filer

Titlarna på `/tjanster`-sidan kommer från copy-systemet (`src/copy/sv.ts` och `src/copy/en.ts`), inte från `servicesDataNew.ts`. Där står fortfarande "El" och "Snickeri".

### Ändringar

**1. `src/copy/sv.ts`** — 4 rader:
- Rad 154: `'serviceCategories.el': 'El'` → `'serviceCategories.el': 'Elektriker'`
- Rad 156: `'serviceCategories.snickeri': 'Snickeri'` → `'serviceCategories.snickeri': 'Snickare'`
- Rad 169: `'serviceCategories.el.title': 'El'` → `'serviceCategories.el.title': 'Elektriker'`
- Rad 173: `'serviceCategories.snickeri.title': 'Snickeri'` → `'serviceCategories.snickeri.title': 'Snickare'`

**2. `src/copy/en.ts`** — 4 rader:
- Rad 154: `'serviceCategories.el': 'Electrical'` → `'serviceCategories.el': 'Electrician'`
- Rad 156: `'serviceCategories.snickeri': 'Carpentry'` → `'serviceCategories.snickeri': 'Carpenter'`
- Rad 169: `'serviceCategories.el.title': 'Electrical'` → `'serviceCategories.el.title': 'Electrician'`
- Rad 173: `'serviceCategories.snickeri.title': 'Carpentry'` → `'serviceCategories.snickeri.title': 'Carpenter'`

Inga andra filer behöver ändras — `servicesDataNew.ts` har redan rätt titlar som fallback.

