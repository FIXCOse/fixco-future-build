
## Plan: Massiv SEO-expansion — 120+ sökvarianter ✅ KLART

### Vad som är gjort ✅
- **120+ nya slugs** tillagda i `LOCAL_SERVICES` via `src/data/seoSlugsExpansion.ts`
- Alla stödjande data: pricing, myths, certification text (sv+en), English names, title/description templates
- Alla `Record<LocalServiceSlug, ...>` typer uppdaterade med `Partial<>` och fallback-logik
- Lokala sidor fungerar automatiskt via `/tjanster/:serviceSlug/:areaSlug` — **~7 500+ nya sidor genereras**
- **`nicheServiceData.ts`** + `nicheServiceDataExpanded.ts` — Hub-sidor med FAQs, USPs, beskrivningar (sv+en)
- **`slugMapping.ts`** — Alla 120+ sv→en mappningar tillagda
- **`App.tsx`** — SmartServiceRouter hanterar dynamiskt nisch vs. tjänstedetalj-routing

## Plan: Inline SEO Script — body-innehåll + JSON-LD för Google ✅ KLART

### Problem
Google ser `<div id="root"></div>` som body-innehåll för alla 16 400 URL:er. Inline JS sätter meta-taggar, men body är tomt tills React renderar → "thin content" risk.

### Lösning ✅
- **`scripts/generate-seo-inline.mjs`** — Genererar `dist/seo-inline.js` som körs synkront i `<body>`
- Injicerar **synligt HTML-innehåll** (`<div id="seo-root">`) med unik h1, beskrivning, breadcrumb, USP-lista
- Injicerar **JSON-LD structured data**: `LocalBusiness`, `Service`, `BreadcrumbList`, `HowTo`
- Behåller befintlig meta-tagg-funktionalitet (title, description, canonical, hreflang)
- `main.tsx` tar bort `#seo-root` när React mountar
- **Data refaktorerat** till `scripts/seo-data.mjs` för bättre underhåll
- Build-optimering: oanvända bilder borttagna (reference-projects/, images/references/)
- Oanvänd `sitemapGeneratorPlugin`-import borttagen från vite.config.ts

## Plan: SEO-optimering — trafik & ranking ✅ KLART

### Genomförda åtgärder ✅
1. **Blogg i sitemap** — `sitemap-blog.xml` med alla 80+ artiklar (hreflang sv/en, lastmod)
2. **Intern länkning blogg↔tjänster** — `RelatedBlogPosts` på lokala sidor, `BlogServiceLinks` på blogginlägg
3. **Relaterade tjänster per ort** — `RelatedServicesSection` visar 3-5 tjänster i samma ort
4. **Prerendering av blogg** — 80+ artiklar × 2 språk = 160+ statiska HTML-filer
5. **FAQ per tjänstekategori** — `/faq/:category` med FAQPage-schema (10 kategorier)
