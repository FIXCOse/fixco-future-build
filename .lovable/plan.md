

## Plan: Fixa färger i serviceGradients

### Problem

`getGradientForService()` i `src/utils/serviceGradients.ts` har mappningar för slugs som `'el'`, `'snickeri'`, `'malare'` — men flera komponenter (CityServicesGrid, LocalServicePage "Andra tjänster") använder andra slugs:

- `'elektriker'` → ingen mappning → **grå** (borde vara gul/orange som `'el'`)
- `'snickare'` → ingen mappning → **grå** (borde vara amber som `'snickeri'`)
- `'koksmontering'` → ingen mappning → **grå**
- `'mobelmontering'` → ingen mappning → **grå**
- `'badrumsrenovering'` → ingen mappning → **grå**
- `'koksrenovering'` → ingen mappning → **grå**
- `'altanbygge'` → ingen mappning → **grå**
- `'fasadmalning'` → ingen mappning → **grå**
- `'inomhusmalning'` → ingen mappning → **grå**
- `'golvlaggning'` → ingen mappning → **grå**
- `'elinstallation'` → ingen mappning → **grå**
- `'dorrlas'` → ingen mappning → **grå**

### Lösning

Uppdatera **båda** gradient-mappningarna i `src/utils/serviceGradients.ts`:

**`getGradientForService` (Tailwind-klasser)** — lägg till:
- `'elektriker'` → samma som `'el'` (gul/orange)
- `'snickare'` → samma som `'snickeri'` (amber/orange)
- `'malning'` → samma som `'malare'` (turkos/rosa/gul/lila)
- `'dorrlas'` → grå/slate (lås/säkerhet)
- `'koksmontering'` → lila/violet (ärver från montering)
- `'mobelmontering'` → lila/violet (ärver från montering)
- `'badrumsrenovering'` → blå/cyan (ärver från vvs)
- `'koksrenovering'` → amber/orange (ärver från snickeri)
- `'altanbygge'` → amber/orange (ärver från snickeri)
- `'fasadmalning'` → turkos/rosa (ärver från målare)
- `'inomhusmalning'` → turkos/rosa (ärver från målare)
- `'golvlaggning'` → amber/brun (trä/golv)
- `'elinstallation'` → gul/orange (ärver från el)
- `'golv'` → amber/brun

**`getHeroGradientStyle` (CSS inline gradients)** — lägg till samma slugs med matchande CSS-gradienter för hero-bakgrunder.

### En fil ändras
`src/utils/serviceGradients.ts` — utöka båda mappningarna med alla saknade slugs.

