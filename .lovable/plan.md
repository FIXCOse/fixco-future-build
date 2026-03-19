

## Tacksida som modal istället för separat sida

### Idé
Istället för att navigera bort till `/tack` efter bokning, visar vi bekräftelsen (konfetti + tackmeddelande) direkt i samma modal. URL:en uppdateras med `history.pushState` till `/tack?booking_id=xxx&service=yyy` så att Google Ads fortfarande kan spåra konverteringen — men användaren stannar kvar på samma sida.

### Plan

#### 1. Ändra ServiceRequestModal — visa tack-steg i modalen
- Behåll `setDone(true)` men **ta bort** `window.location.href`-redirecten
- Lägg till `history.pushState(null, '', '/tack?booking_id=...&service=...')` för URL-spårning
- När `done === true`, visa ett tack-steg i modalen med:
  - Konfetti (`fireConfetti()`)
  - Grön bock-ikon + "Tack för din förfrågan!"
  - Bekräftelsetext + referensnummer
  - "Stäng"-knapp som återställer URL:en med `history.back()`

#### 2. Uppdatera stängningslogik
- När modalen stängs (X eller stäng-knapp) efter done-state → `history.replaceState` tillbaka till ursprunglig URL
- Rensa done-state

#### 3. Behåll `/tack`-routen
- Tacksidan (`ThankYou.tsx`) behålls som fallback om någon landar direkt på `/tack` (t.ex. bokmärke, delad länk)

### Filer som ändras
- `src/features/requests/ServiceRequestModal.tsx` — Tack-steg i modalen + pushState
- Inga nya filer behövs

