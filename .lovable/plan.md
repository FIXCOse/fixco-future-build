

## Plan: Visa ROT/RUT-rabatterade priser som default på huvudtjänstesidor

### Problem
På `/tjanster/snickeri`, `/tjanster/el` osv visas priserna utan ROT/RUT-avdrag om det globala läget inte redan är inställt. Tjänstesidan (`/tjanster`) har en synlig toggle men ServiceDetail-sidorna saknar den.

### Lösning

**1. Lägg till SegmentedPriceToggle på ServiceDetail.tsx**
- Placera den ovanför tjänstekort-griden (efter rubriken "Alla våra tjänster...")
- Centrerad, storlek `md`

**2. Auto-sätt rätt prisläge baserat på tjänstekategori**
- I `ServiceDetail.tsx`, använd `useEffect` som kollar `service.eligible`:
  - Om `eligible.rot === true` → `setMode('rot')`
  - Om `eligible.rut === true` → `setMode('rut')`
  - Om båda → `setMode('rot')` (ROT prioritet)
- Kör bara vid sidladdning/slug-byte, inte om användaren manuellt bytt

### Fil att ändra

| Fil | Ändring |
|---|---|
| **`src/pages/ServiceDetail.tsx`** | Importera `SegmentedPriceToggle`, lägg till ovanför grid. Lägg till `useEffect` som auto-sätter mode baserat på `service.eligible` |

