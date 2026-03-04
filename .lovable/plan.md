

## Plan: Fullständig användarresa-spårning (Google → Bokning)

### Nuläge
- `events`-tabellen finns med `session_id`, `event_type`, `page_url`, `event_data`
- `PageViewTracker` i App.tsx spårar sidvisningar med UTM-parametrar
- `trackClick` finns men **används aldrig** i hela kodbasen
- Ingen spårning av bokningsflödet (steg 1→2→3→slutförd)
- Ingen koppling mellan session och slutförd bokning

### Vad vi bygger

**1. Utöka `useEventTracking` med nya event-typer**

Lägg till funktioner i `src/hooks/useEventTracking.ts`:
- `trackFunnelStep(step, metadata)` — spårar varje steg i ServiceRequestModal (öppnad → steg 1 → steg 2 → steg 3 → skickad)
- `trackConversion(bookingId, metadata)` — spårar slutförd bokning med session_id + UTM-källa + landing page
- Spara `landing_page` och `utm_*` i sessionStorage vid första sidladdning så vi vet var sessionen startade

**2. Instrumentera ServiceRequestModal**

I `src/features/requests/ServiceRequestModal.tsx`:
- Spåra `modal_opened` när modalen öppnas (med service-slug)
- Spåra `funnel_step_1`, `funnel_step_2`, `funnel_step_3` vid varje stegbyte
- Spåra `booking_completed` vid lyckad submit (med booking-id, service, UTM-källa, landing page)

**3. Instrumentera CTA-knappar**

Lägg till `trackClick` på de viktigaste knapparna:
- "Boka hembesök" / "Begär offert" CTA:er på lokala sidor och tjänstesidor
- Navbar-CTA
- Så vi kan se vilka sidor/knappar som driver mest bokningar

**4. Analytics-dashboard: Konverteringsvy**

Uppdatera analytics-dashboarden (`src/lib/api/analytics.ts`) med en ny funktion `fetchSessionJourneys` som:
- Grupperar events per `session_id`
- Visar: landing page → sidor besökta → modal öppnad → bokning slutförd
- Filtrerar på UTM-källa (Google, direkt, etc.)
- Visar konverteringsgrad per källa och per landing page

### Teknisk sammanfattning

| Fil | Ändring |
|-----|---------|
| `src/hooks/useEventTracking.ts` | Nya funktioner: `trackFunnelStep`, `trackConversion`. Spara landing page i sessionStorage |
| `src/features/requests/ServiceRequestModal.tsx` | Instrumentera modal-öppning, stegbyten, submit |
| `src/components/LocalServicePage.tsx` (+ andra CTA-sidor) | Lägg till `trackClick` på CTA-knappar |
| `src/lib/api/analytics.ts` | Ny `fetchSessionJourneys`-funktion |

### Ingen databasändring behövs
`events`-tabellen har redan alla fält som behövs (`event_type`, `session_id`, `event_data` med UTM). Vi använder nya `event_type`-värden:
- `funnel_modal_opened`
- `funnel_step_1/2/3`
- `booking_completed`
- `cta_click`

### Förväntat resultat
- Full synlighet: "Användare kom från Google sök 'snickare uppsala' → landade på /tjanster/snickare/uppsala → klickade CTA → öppnade modal → slutförde bokning"
- Konverteringsgrad per Google-sökord/UTM-källa
- Dropoff-analys: var i flödet tappar ni besökare

