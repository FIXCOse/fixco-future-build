

## Fix: Ta bort info@fixco.se från AI-genererad text

### Problem
Prompten instruerar AI:n att nämna "svara på mailet till info@fixco.se" — detta ska bort helt. Kunden kan svara direkt på mailet (reply-to är redan info@fixco.se) och kan skriva via offertsidan. Ingen anledning att skriva ut e-postadressen i brödtexten.

### Ändring i `supabase/functions/generate-followup-text/index.ts`

Uppdatera system-prompten:
- Ta bort all instruktion om att nämna info@fixco.se
- Istället: "Nämn att kunden kan svara direkt på detta mail eller skriva via offertsidan"
- Ingen e-postadress ska förekomma i den genererade texten

### Fil
- **Ändrad:** `supabase/functions/generate-followup-text/index.ts` — ta bort e-postadress från prompt

