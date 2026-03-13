

# Fix: Lokala sidor för nisch-tjänster kraschar (vita sidor)

## Rotorsak

`generateUniqueLocalContent()` i `src/data/localSeoData.ts` (rad 516) gör `SEARCH_ACTION_PATTERNS[serviceSlug]` — men denna map har bara ~20 base services (snickare, vvs, etc.). De 120+ expanded slugs (totalrenovering, renovering, hantverkare, byggfirma, kok, badrum...) saknas helt.

Resultat: `patterns` blir `undefined`, och `patterns.objects.slice(0, 4)` på rad 524 kraschar med TypeError. Sidan dör utan felmeddelande → vit sida.

## Fix

**`src/data/localSeoData.ts`** — rad 516-526:

Lägg till en null-guard som faller tillbaka till parent-tjänstens patterns (via `serviceKey`-mappningen) eller genererar säkra defaults:

```typescript
const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug);
const serviceName = service?.name.toLowerCase() || serviceSlug;

// Fallback: use parent service's patterns if expanded slug has none
const patterns = SEARCH_ACTION_PATTERNS[serviceSlug] 
  || (service?.serviceKey ? SEARCH_ACTION_PATTERNS[service.serviceKey as LocalServiceSlug] : null);

const fallbackPatterns = {
  actions: ["boka", "hitta", "beställa"],
  objects: [serviceName],
  urgentTerms: [],
  projectTypes: [serviceName],
  synonyms: []
};

const safePatterns = patterns || fallbackPatterns;
```

Sedan ersätt alla `patterns.X` med `safePatterns.X` i resten av funktionen.

Samma fix behövs för `getImprovedDescription` (rad ~604-606) som också accessar `SEARCH_ACTION_PATTERNS[serviceSlug]` utan guard.

## Påverkan
Fixar alla 120+ × 54 = 6,480+ lokala sidor som idag kraschar vid rendering.

