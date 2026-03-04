

## Plan: Maximal Analytics Dashboard med SEO & Användarresa-insikter

### Vad som saknas idag

Den nuvarande `/admin/reports`-dashboarden har ekonomi, kunder, tjänster, trafik och offert-pipeline. Men den saknar:

1. **Användarresa-data** -- `fetchSessionJourneys` finns i koden men används aldrig i UI:t
2. **SEO-specifika insikter** -- vilka lokala sidor (t.ex. `/tjanster/malare/stockholm`) driver trafik och konverteringar
3. **Google-källa-analys** -- vilka sökord/UTM-kampanjer ger bäst ROI
4. **Funnel dropoff per steg** -- var i bokningsflödet tappar ni folk (modal öppnad → steg 1 → 2 → 3 → slutförd)
5. **Landing page performance** -- vilka sidor konverterar bäst, vilka behöver förbättras
6. **Bounce-analys** -- sessioner med bara 1 sidvisning

### Vad vi bygger

**Ny flik "SEO & Resor"** i AdminReports + 3 nya visualiseringskomponenter:

#### 1. `SessionJourneyPanel` -- Användarresor
- Tabell med sessioner: landing page → sidor besökta → CTA-klick → konverterad?
- Filtrera på källa (Google, direkt, etc.)
- Visa konverteringsgrad per källa som horisontellt stapeldiagram
- Expanderbar rad som visar hela resan steg-för-steg

#### 2. `LandingPagePerformance` -- Landing Page Rankings
- Tabell: URL | Sessioner | Konverteringar | Konverteringsgrad | Bounce Rate
- Sorterar efter mest trafik, markerar sidor med hög trafik men låg konvertering (= SEO-möjligheter)
- Färgkodade badges: grön (>5% conv), gul (1-5%), röd (<1%)

#### 3. `BookingFunnelDropoff` -- Detaljerad Bokningsfunnel
- Använder de nya `funnel_*`-eventsen från `useEventTracking`
- Visar: Sidbesök → CTA-klick → Modal öppnad → Steg 1 → Steg 2 → Steg 3 → Bokning slutförd
- Dropoff-procent mellan varje steg
- Horisontellt funnel-diagram med Recharts

#### 4. Nya KPI-kort överst
- **Bounce Rate** (sessioner med 1 page_view / totala sessioner)
- **Avg. sidor/session**
- **Top konverterande källa** (Google/direkt/etc)
- **Bästa landing page** (högst konverteringsgrad med min 10 sessioner)

### Teknisk sammanfattning

| Fil | Ändring |
|-----|---------|
| `src/components/admin/analytics/SessionJourneyPanel.tsx` | **Ny** -- resevy med källanalys |
| `src/components/admin/analytics/LandingPagePerformance.tsx` | **Ny** -- landing page-tabell |
| `src/components/admin/analytics/BookingFunnelDropoff.tsx` | **Ny** -- detaljerad funnel med nya event-typer |
| `src/components/admin/analytics/SEOKPICards.tsx` | **Ny** -- SEO-specifika KPI-kort |
| `src/hooks/useAnalytics.ts` | Lägg till `fetchSessionJourneys` + ny `fetchDetailedFunnel` i queryn |
| `src/lib/api/analytics.ts` | Ny `fetchDetailedFunnel` (hämtar `funnel_*`-events) + `fetchBounceRate` |
| `src/pages/admin/AdminReports.tsx` | Ny flik "SEO & Resor" med alla nya komponenter |

### Dataflöde

Alla data kommer från befintliga tabeller (`events`, `bookings`, `invoices`). Inga databasändringar behövs. `fetchSessionJourneys` från `analyticsJourneys.ts` kopplas in i `useAnalytics`-hooken så dashboarden laddar allt på en gång.

