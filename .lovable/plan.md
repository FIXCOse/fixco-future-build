

## Problem

Det finns **två** `AdminReports`-filer:
- `src/pages/admin/AdminReports.tsx` — **denna används av routern** (`App.tsx` importerar härifrån)
- `src/pages/MyFixco/AdminReports.tsx` — **denna har SEO-fliken, men används aldrig**

SEO & Resor-komponenterna (`SEOKPICards`, `BookingFunnelDropoff`, `LandingPagePerformance`, `SessionJourneyPanel`) skapades korrekt, men kopplades till fel fil.

## Fix

Lägg till en **"SEO & Resor"**-flik i `src/pages/admin/AdminReports.tsx` (den som faktiskt används):

1. Importera de fyra nya komponenterna + `fetchSessionJourneys`, `fetchDetailedFunnel`, `fetchBounceAnalytics`
2. Lägg till en åttonde tab `"seo"` i TabsList med Globe-ikon
3. Lägg till TabsContent med `SEOKPICards`, `BookingFunnelDropoff`, `LandingPagePerformance`, `SessionJourneyPanel` — exakt samma upplägg som i MyFixco-versionen
4. Data kommer redan från `useAnalytics`-hooken som redan hämtar `journeys`, `detailedFunnel`, och `bounceAnalytics`

Inga nya filer behövs — bara en ändring i `src/pages/admin/AdminReports.tsx`.

