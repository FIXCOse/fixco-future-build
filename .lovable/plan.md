

## Plan: Ta bort telefonnummer från tjänstesidor, FAQ och stadstjänstesidor

Telefonnumret finns kvar på tre filer som missades i förra omgången:

### Filer att ändra

| Fil | Ändring |
|---|---|
| **`src/pages/ServiceDetail.tsx`** (rad 196-203) | Ersätt "Ring oss"-knappen med "Boka Hembesök" som öppnar `openServiceRequestModal({ mode: 'home_visit', showCategories: true })` |
| **`src/pages/locations/ServiceCityDetail.tsx`** (rad 310-317) | Samma ändring — ersätt telefon-knappen med "Boka Hembesök" |
| **`src/pages/FAQ.tsx`** (rad 127, 130-137, 234-244) | Hero: ersätt Phone-ikon med Calendar, ta bort "Ring oss"-knappen. Botten: ersätt `tel:`-länken med "Boka Hembesök"-knapp som öppnar modalen |

Alla ersättningar använder `Calendar`-ikon och `openServiceRequestModal({ mode: 'home_visit', showCategories: true })`.

