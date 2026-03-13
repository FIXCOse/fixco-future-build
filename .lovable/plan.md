

# Diagnos: Nisch-tjänstesidor vita / laddar inte

## Problem
Sidorna har innehåll (hero, USPs, områdeslänkar, FAQ, CTA) men kraschar troligen vid rendering utan att visa något. Två orsaker identifierade:

1. **Ingen ErrorBoundary** runt `SmartServiceRouter` — om komponenten kraschar (t.ex. chunk-laddningsfel, nätverksfel) visas en helt vit sida utan felmeddelande.

2. **Lazy chunk-laddning kan misslyckas** — `NicheServiceLandingPage` laddas via `lazy()` och om JS-filen inte hämtas korrekt (timeout, cache-problem) kraschar Suspense utan fallback.

## Plan

### 1. Lägg till ErrorBoundary runt SmartServiceRouter (App.tsx)
Wrappa `<SmartServiceRouter />` i en `ErrorBoundary` med retry-logik så att misslyckade chunk-laddningar visar ett användbart felmeddelande istället för vit sida.

### 2. Lägg till retry-logik för lazy imports (App.tsx)
Ändra `lazy(() => import('./pages/NicheServiceLandingPage'))` till en version som automatiskt försöker ladda om chunken vid nätverksfel:

```typescript
const NicheServiceLandingPage = lazy(() => 
  import("./pages/NicheServiceLandingPage").catch(() => {
    window.location.reload();
    return import("./pages/NicheServiceLandingPage");
  })
);
```

### 3. Förbättra SmartServiceRouter med felhantering (App.tsx)
Lägg till try/catch i den dynamiska importen av `nicheServiceData` och säkerställ att fallback till `ServiceDetail` fungerar korrekt om importen misslyckas.

### 4. Verifiera att alla expanded slugs matchas korrekt
Dubbelkolla att `getNicheService()` hittar alla slugs som visas i griden (totalrenovering, renovering, hantverkare, byggfirma, etc.) — detta ser korrekt ut i koden men bör verifieras.

## Sammanfattning
Huvudfixen är att wrappa routern i en ErrorBoundary och lägga till retry-logik för lazy-laddade chunks. Sidorna HAR redan innehåll (hero, USPs, 54 områdeslänkar, FAQ, CTA) — problemet är att de kraschar innan de hinner renderas.

