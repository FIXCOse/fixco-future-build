

# Fix: Guide expand bug + uppdatera tidsuppskattningar

## Problem 1: "Läs hela guiden" visar vitt/tomt
Nya sektioner som renderas efter expand använder `variants={itemVariants}` (startar med `opacity: 0, y: 16`). Men föräldra-animationen (`whileInView`) har redan triggats och kör inte igen — så de nya barnen fastnar i `hidden`-state och syns aldrig.

**Fix**: Ge de expanderade sektionerna egna `initial`/`animate`-props istället för att förlita sig på förälderns `variants`.

## Problem 2: Felaktiga tidsuppskattningar för köksrenovering
Användaren säger att kök tar max 1–2 veckor, inte 3–6 veckor. Uppdatera på alla ställen:

### Filer som ändras:

1. **`src/components/local/InlineGuideSection.tsx`** — Fixa expand-buggen: expanderade sektioner får `initial={{ opacity: 0, y: 16 }}` och `animate={{ opacity: 1, y: 0 }}` direkt istället för parent-variants.

2. **`src/data/carpentryGuideData.ts`** — Ändra:
   - Köksrenovering: "2–5 veckor" → "1–2 veckor"
   - Totalrenovering: "6–12 veckor" → "3–6 veckor" (proportionellt rimligare)

3. **`src/data/localServiceData.ts`** (rad 507) — Ändra myten: "3-6 veckor" → "max 1–2 veckor beroende på projektets omfattning"

4. **`src/data/seoSlugsExpansion.ts`** (rad 538) — Samma myt-uppdatering

5. **`src/data/carpentryPriceData.ts`** (rad 231) — FAQ: "3–6 veckor" → "1–2 veckor"

