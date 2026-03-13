
## Plan: Massiv SEO-expansion — 120+ sökvarianter ✅ KLART

### Vad som är gjort ✅
- **120+ nya slugs** tillagda i `LOCAL_SERVICES` via `src/data/seoSlugsExpansion.ts`
- Alla stödjande data: pricing, myths, certification text (sv+en), English names, title/description templates
- Alla `Record<LocalServiceSlug, ...>` typer uppdaterade med `Partial<>` och fallback-logik
- Lokala sidor fungerar automatiskt via `/tjanster/:serviceSlug/:areaSlug` — **~7 500+ nya sidor genereras**
- **`nicheServiceData.ts`** + `nicheServiceDataExpanded.ts` — Hub-sidor med FAQs, USPs, beskrivningar (sv+en)
- **`slugMapping.ts`** — Alla 120+ sv→en mappningar tillagda
- **`App.tsx`** — SmartServiceRouter hanterar dynamiskt nisch vs. tjänstedetalj-routing

### Teknisk arkitektur
- `seoSlugsExpansion.ts` — 120+ expanded slugs + metadata (pricing, EN names, myths)
- `nicheServiceDataExpanded.ts` — Auto-genererad NicheServiceMeta per slug via kategori-templates
- `localServiceData.ts` — Mergar base + expanded, dynamisk fallback lookup
- `localSeoData.ts` — Partial<Record> för kompatibilitet
- `slugMapping.ts` — Komplett sv→en URL-mappning
- `App.tsx` — SmartServiceRouter resolvar nisch vs. ServiceDetail dynamiskt
