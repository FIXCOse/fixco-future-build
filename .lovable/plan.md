

# Plan: Fixa dörrlås-sidan + lokala SEO-sidor

## Problem
1. **Design**: Dörrlås-landningssidan (`/tjanster/dorrlas`) saknar den konverteringsfokuserade layouten som övriga tjänstesidor har (gradient-hero med vit logotyp, trust badges etc.)
2. **Inga lokala sidor**: Det finns inga `/tjanster/dorrlas/stockholm`, `/tjanster/dorrlas/bromma` etc. — dörrlås är markerat som "global" och saknas i `LOCAL_SERVICES`

## Åtgärder

### 1. Lägg till "dorrlas" i LOCAL_SERVICES
**Fil:** `src/data/localServiceData.ts`
- Lägg till `{ slug: "dorrlas", name: "Dörrlås", serviceKey: "montering", rotRut: "ROT" }` i `BASE_SERVICES`
- Detta genererar automatiskt ~54 lokala sidor (`/tjanster/dorrlas/stockholm`, `/tjanster/dorrlas/bromma`, `/tjanster/dorrlas/uppsala` etc.)
- Alla befintliga system (prerendering, sitemaps, intern länkning) plockar upp den automatiskt

### 2. Ta bort `isGlobal` för dörrlås i CityServicesGrid
**Fil:** `src/components/city/CityServicesGrid.tsx`
- Ändra dörrlås-posten så att den INTE har `isGlobal: true` — då länkas stadssidorna korrekt till `/tjanster/dorrlas/{citySlug}` istället för `/tjanster/dorrlas`

### 3. Uppgradera DoorLockLandingPage-designen
**Fil:** `src/pages/DoorLockLandingPage.tsx`
- Byt hero-sektionen till gradient-hero med vit Fixco-logotyp (samma mönster som `LocalServicePage`/`NicheServiceLandingPage`)
- Lägg till breadcrumbs
- Lägg till en sektion "Dörrlås i din stad" med länkar till alla lokala sidor (Stockholm, Uppsala, Bromma etc.) — ger kraftig intern länkning

### 4. Uppdatera interna länkar på dörrlås-sidan
**Fil:** `src/pages/DoorLockLandingPage.tsx` (botten-sektionen)
- Ersätt de felaktiga interna länkarna (t.ex. `/tjanster/montering/uppsala` med text "Dörrlås Uppsala") med korrekta länkar till `/tjanster/dorrlas/uppsala` och `/tjanster/dorrlas/stockholm`

### 5. Lägg till söktermer/SEO-data för dörrlås
**Fil:** `src/data/localSeoData.ts`
- Lägg till `SEARCH_ACTION_PATTERNS` för "dorrlas" med relevanta sökfraser: "installera dörrlås", "byta lås", "yale doorman installation", "smart dörrlås", "kodlås montering"
- Lägg till `SERVICE_MYTHS` och `AREA_FUN_FACTS`-kopplingar för dörrlås om de saknas

## Resultat
- ~54 nya indexerbara lokala sidor (t.ex. "Dörrlås Stockholm", "Dörrlås Bromma")
- Korrekt intern länkning från hub-sida → lokala sidor
- Uppfräschad design i linje med övriga tjänstesidor
- Automatisk inkludering i sitemaps och prerendering vid nästa build

