
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
- **`scripts/generate-prerender.mjs`** — Post-build script som genererar ~16,400 statiska HTML-filer
- Körs **efter** `vite build` som separat Node-script (kringgår Vite timeout)
- Varje fil har unik `<title>`, `<meta description>`, canonical, hreflang, geo-meta och JSON-LD schema
- Stödjer alla 152 tjänster × 53 områden × 2 språk (sv/en) + bloggartiklar
- Netlify serverar statiska filer automatiskt före SPA-fallback
- React hydraterar som vanligt för interaktivitet
- **Build pipeline:** `generate-sitemaps.mjs → vite build → generate-prerender.mjs → validate-sitemaps.mjs`

## Plan: SEO-optimering — trafik & ranking ✅ KLART

### Genomförda åtgärder ✅
1. **Blogg i sitemap** — `sitemap-blog.xml` med alla 80+ artiklar (hreflang sv/en, lastmod)
2. **Intern länkning blogg↔tjänster** — `RelatedBlogPosts` på lokala sidor, `BlogServiceLinks` på blogginlägg
3. **Relaterade tjänster per ort** — `RelatedServicesSection` visar 3-5 tjänster i samma ort
4. **Prerendering av blogg** — 80+ artiklar × 2 språk = 160+ statiska HTML-filer
5. **FAQ per tjänstekategori** — `/faq/:category` med FAQPage-schema (10 kategorier)
