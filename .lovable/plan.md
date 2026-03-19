

## Lägg till konfetti på tacksidan

### Bakgrund
Tacksidan (`/tack`) är ännu inte skapad — den ingick i den godkända Google Ads-planen. Konfetti-effekten från offertbekräftelsen i `QuotePublic.tsx` (flerstegs-burst med färger) ska återanvändas.

### Plan

#### 1. Extrahera `fireConfetti` till en delad utility
Skapa `src/lib/confetti.ts` med den befintliga `fireConfetti`-funktionen från `QuotePublic.tsx` (flerstegs-burst, mobilanpassad, canvas-baserad). Uppdatera `QuotePublic.tsx` att importera därifrån istället.

#### 2. Skapa tacksidan `src/pages/ThankYou.tsx`
- Visar bekräftelsemeddelande ("Tack för din bokning/förfrågan!")
- Kör `fireConfetti()` vid mount med kort fördröjning (500ms)
- Tar emot `booking_id` och `service` som URL-parametrar
- Knapp tillbaka till startsidan
- Plats för Google Ads `gtag('event', 'conversion')` (aktiveras när ni har Conversion ID)

#### 3. Lägg till route `/tack` i `src/App.tsx`

### Filer
- `src/lib/confetti.ts` — Ny, delad konfetti-funktion
- `src/pages/ThankYou.tsx` — Ny tacksida
- `src/App.tsx` — Ny route
- `src/pages/QuotePublic.tsx` — Importera från delad utility

