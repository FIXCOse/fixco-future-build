

## Problem: Nischsidor kraschar på engelska

### Grundorsak

Språkväxlaren använder `convertPath()` som gör en generisk prefix-swap: `/tjanster/montera-tv-pa-vagg` → `/en/services/montera-tv-pa-vagg`. Men den engelska niche-lookupen (`getNicheServiceByEnSlug`) söker på `enSlug`-fältet, som är `wall-mount-tv` — inte `montera-tv-pa-vagg`. Ingen match → sidan kraschar/visar fel.

Detta gäller **alla** ~20 hyperspecifika nischsidor som har egna engelska slugs.

### Fix (2 delar)

**1. Fallback-lookup i SmartServiceRouter och NicheServiceLandingPage**

När engelska lookupen misslyckas, testa även svenska sluggen som fallback. Detta gör att `/en/services/montera-tv-pa-vagg` fortfarande hittar rätt nisch.

```typescript
// SmartServiceRouter — ändra lookup-logiken
const found = isEnglish
  ? (getNicheServiceByEnSlug(slug || '') || getNicheService(slug || ''))
  : getNicheService(slug || '');
```

Samma ändring i `NicheServiceLandingPage.tsx` rad 49.

**2. Lägg till nischslugs i routeMapping.ts**

Så att språkväxlaren producerar korrekta engelska URL:er (t.ex. `/en/services/wall-mount-tv`):

```typescript
// Loopa genom alla nischslugs och deras enSlug
'/tjanster/montera-tv-pa-vagg': '/en/services/wall-mount-tv',
'/tjanster/installera-akustikpanel': '/en/services/acoustic-panel-installation',
// ... alla 20 nischslugs
```

Mappningarna hämtas från `nicheServiceData.ts` (fälten `slug` och `enSlug`).

### Filer som ändras

- `src/App.tsx` — SmartServiceRouter fallback-lookup (~1 rad)
- `src/pages/NicheServiceLandingPage.tsx` — samma fallback (~1 rad)  
- `src/utils/routeMapping.ts` — lägg till ~20 nischslug-mappningar

