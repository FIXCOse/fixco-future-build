

## Plan: Fixa konfetti, admin-bekräftelsemail och footer-ändringar

### Problem identifierade

1. **Konfetti fungerar inte** — Koden anropar `confetti()` korrekt men dialogen (`Dialog`) kan blockera canvas-overlay. Konfetti måste triggas med en liten delay så att DOM:en hinner rendera, och z-index behöver hanteras.

2. **Admin-bekräftelsemail är basic** — `notifyAdmin()` i `accept-quote-public` skickar bara enkla `<p>`-taggar (screenshot bekräftar detta). Behöver uppgraderas till samma styled card-layout som kundens bekräftelsemail.

3. **Footer: telefonnummer + fel email** — `GlobalFooter.tsx` visar `+46 79 335 02 28` och `support@fixco.se`. Ska ta bort telefonnumret och ändra till `info@fixco.se`.

### Ändringar

**1. `src/pages/QuotePublic.tsx`** — Fixa konfetti
- Flytta `confetti()`-anropen till en `setTimeout(() => ..., 100)` så att dialogen hinner öppnas först
- Lägg till `zIndex: 9999` i confetti-anropen så partiklarna syns ovanpå dialogen
- Lägg till en extra våg med delay 800ms för mer dramatisk effekt

**2. `supabase/functions/accept-quote-public/index.ts`** — Uppgradera admin-notifieringsmailet
- Ersätt de enkla `<h2>/<p>`-taggarna i `notifyAdmin()`-anropen (rad 211-218 och 275-283) med samma styled HTML-template som `sendCustomerConfirmation` använder:
  - Grön gradient-header med checkmark
  - Tabell med offertdetaljer (nummer, kund, signatur, tidpunkt)
  - "Projekt skapats automatiskt"-ruta
  - "Öppna i Admin →"-knapp

**3. `src/components/layout/GlobalFooter.tsx`** — Ta bort telefon, ändra email
- Rad 186-190: Ta bort hela `<li>` med telefonnumret
- Rad 192: Ändra `support@fixco.se` → `info@fixco.se` (both href och text)
- Rad 54: Ändra `support@fixco.se` → `info@fixco.se` i JSON-LD schema

