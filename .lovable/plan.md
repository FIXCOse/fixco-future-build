
## Plan: Massiv SEO-expansion — 120+ sökvarianter ✅ Steg 1 klart

### Vad som är gjort ✅
- **120+ nya slugs** tillagda i `LOCAL_SERVICES` via `src/data/seoSlugsExpansion.ts`
- Alla stödjande data: pricing, myths, certification text (sv+en), English names, title/description templates
- Alla `Record<LocalServiceSlug, ...>` typer uppdaterade med `Partial<>` och fallback-logik
- Lokala sidor fungerar automatiskt via `/tjanster/:serviceSlug/:areaSlug` — **~7 500+ nya sidor genereras**

### Kvar att göra
1. **`nicheServiceData.ts`** — Lägg till NicheServiceMeta för nya slugs (hub-sidor på `/tjanster/{slug}`)
2. **`slugMapping.ts`** — Lägg till sv→en mappningar
3. **`App.tsx`** — Registrera nisch-landningssidor som routes

### Teknisk arkitektur
- `seoSlugsExpansion.ts` — Ny fil med alla 120+ expanded slugs och deras metadata
- `localServiceData.ts` — Mergar base + expanded, använder dynamic fallback lookup
- `localSeoData.ts` — Uppdaterad med Partial<Record> för kompatibilitet
