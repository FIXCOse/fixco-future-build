
## Plan: Massiv SEO-expansion — 120+ sökvarianter ✅ KLART

### Vad som är gjort ✅
- **120+ nya slugs** tillagda i `LOCAL_SERVICES` via `src/data/seoSlugsExpansion.ts`
- Alla stödjande data: pricing, myths, certification text (sv+en), English names, title/description templates
- Alla `Record<LocalServiceSlug, ...>` typer uppdaterade med `Partial<>` och fallback-logik
- Lokala sidor fungerar automatiskt via `/tjanster/:serviceSlug/:areaSlug` — **~7 500+ nya sidor genereras**
- **`nicheServiceData.ts`** + `nicheServiceDataExpanded.ts` — Hub-sidor med FAQs, USPs, beskrivningar (sv+en)
- **`slugMapping.ts`** — Alla 120+ sv→en mappningar tillagda
- **`App.tsx`** — SmartServiceRouter hanterar dynamiskt nisch vs. tjänstedetalj-routing

## Plan: Statisk HTML-prerendering för Google-indexering ✅ KLART

### Problem
Google hittade 8000+ sidor men indexerade dem inte ("Upptäckt – inte indexerad") pga att alla returnerade samma generiska `index.html` utan unik SEO-data.

### Lösning ✅
- **`vite-plugin-prerender-local.ts`** — Genererar ~16,000 statiska HTML-filer vid build
- Varje fil har unik `<title>`, `<meta description>`, canonical, hreflang, geo-meta och JSON-LD schema
- Stödjer alla 151 tjänster × 53 områden × 2 språk (sv/en)
- Netlify serverar statiska filer automatiskt före SPA-fallback
- React hydraterar som vanligt för interaktivitet
