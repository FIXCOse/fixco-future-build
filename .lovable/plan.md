

## Plan: Lägg till `lastmod` på alla lokala ortssidor i sitemap

Just nu saknar de ~16 000 lokala ortssidorna (`/tjanster/{slug}/{area}`) `lastmod`-tagg. Hub-sidorna och bloggen har det redan. Att lägga till `lastmod` överallt ger Google bättre crawl-prioritering.

### Approach

Ortssidorna ärver samma innehåll som sin tjänstekategori, så vi återanvänder `getLastmod(slug)` — samma datum som hub-sidan för den tjänsten.

### Ändringar

**1. `vite-plugin-sitemap-gen.ts`** — rad 140 och 144
- Lägg till `<lastmod>${getLastmod(slug)}</lastmod>` i de lokala URL-elementen (både sv och en)

**2. `scripts/generate-sitemaps.mjs`**
- Samma ändring speglad

Totalt 4 rader ändras (2 per fil). Blogg och main-sidor har redan `lastmod` — inga ändringar behövs där.

