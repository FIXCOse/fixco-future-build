

## Plan: Ny Admin-sida "Trafik & SEO" — Dedikerad Dashboard

### Översikt

Skapa en helt ny sida `/admin/traffic` med en samlad, användarvänlig dashboard som kombinerar **trafik, SEO, användarresor, funnel-analys och performance** — allt på en sida utan flikar. Samtidigt tas SEO-fliken bort från Rapporter så den blir ren igen.

### Nya filer

**`src/pages/admin/AdminTrafficSEO.tsx`** — Huvudsidan med följande layout uppifrån och ned:

1. **Header** med titel "Trafik & SEO", refresh-knapp och datumfilter (återanvänd `AnalyticsFilters`)
2. **SEO KPI-kort** (4 st) — Bounce Rate, Sidor/session, Top källa, Bästa landing page (befintlig `SEOKPICards`)
3. **Två-kolumns grid:**
   - Vänster: **Bokningsfunnel Dropoff** (`BookingFunnelDropoff`)
   - Höger: **Landing Page Performance** (`LandingPagePerformance`)
4. **Trafikkällor** — Befintlig `TrafficSourcesChart` med besök/konverteringar per källa
5. **Conversion Funnel** — Befintlig `ConversionFunnelChart` (visuell steg-för-steg)
6. **Populära sidor** — Topp-sidor med visningar och genomsnittlig tid (inline, samma data som i trafik-fliken)
7. **Sessionsresor** — Full `SessionJourneyPanel` med källfiltrering och expanderbara rader

Sidan använder `useAnalytics`-hooken som redan hämtar all data (traffic, funnel, journeys, detailedFunnel, bounceAnalytics).

### Ändringar i befintliga filer

| Fil | Ändring |
|-----|---------|
| `src/App.tsx` | Lägg till lazy import + route `<Route path="traffic" element={lazyElement(AdminTrafficSEO)} />` |
| `src/components/admin/AdminSidebar.tsx` | Lägg till menypost "Trafik & SEO" med `Globe`-ikon under "Ekonomi"-kategorin |
| `src/pages/admin/AdminReports.tsx` | Ta bort SEO-fliken (tab 8), återställ `grid-cols-7`, ta bort SEO-imports |

### Layout-princip

Ingen flik-navigering — allt visas vertikalt i logisk ordning: KPI:er → Funnel → Källor → Sidor → Resor. Scroll-baserad dashboard med tydliga sektionsrubriker. Samma datumfilter styr all data.

