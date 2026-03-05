

## Plan: Uppdatera stadssidorna till samma design som lokala tjänstesidorna

### Problem
Stockholm- och Uppsala-sidorna (`LocationCityPage.tsx`) använder en gammal layout med glassmorphism-kort, GradientText-rubriker, FixcoFIcon-watermarks och en tvåkolumns hero med illustration. De lokala tjänstesidorna har en modern, konverteringsfokuserad design.

### Vad som ändras i `LocationCityPage.tsx`

**1. Hero-sektion** -- Byt från tvåkolumns layout med CityHeroIllustration till centrerad fullbredd-hero med gradient-bakgrund (likt LocalServicePage). Stor centrerad H1, betyg-stjärnor ovanför, GradientButton CTAs. Ta bort "Ring"-knappen (ersätt med "Begär offert" som öppnar offertmodal). Ta bort FixcoFIcon-watermarks.

**2. Sektionsdesign** -- Byt GlassCard till `bg-card border border-border rounded-xl`. Byt GradientText-rubriker till vanlig `text-foreground` med `text-primary` accenter. Använd `bg-muted/30` och `bg-background` som bakgrunder istället för `bg-muted/20` med watermarks.

**3. CTA-strategi** -- Ersätt telefonknapp med offertförfrågan (likt local service pages). "Begär offert" + "Visa tjänster" som GradientButton.

**4. Cases-kort** -- Från GlassCard till `bg-card border border-border rounded-xl`.

**5. FAQ** -- Från GlassCard-wrapper till individuella `bg-card border border-border rounded-xl`-accordion items (samma som LocalServicePage).

**6. Final CTA** -- Uppdatera till `bg-card border border-border rounded-3xl` med GradientButton istället för gradient-bakgrund med watermarks.

### Filer
- **Ändras:** `src/pages/locations/LocationCityPage.tsx` -- Hela layouten uppdateras
- **Kan tas bort från import:** `GlassCard`, `FixcoFIcon`, `CityHeroIllustration` (om ej används annanstans)
- **Läggs till import:** `GradientButton`, `openServiceRequestModal`, `useEventTracking`

