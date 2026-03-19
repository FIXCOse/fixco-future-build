

## Problem
`sitemap-local-sthlm.xml` innehåller 151 tjänster × 34 orter = **5 134 URL:er** (~390 KB). Google Search Console rapporterar "Hämtning misslyckades" — troligen timeout eller temporärt fel pga filstorleken. Uppsala-filen är hälften så stor och fungerar.

## Lösning
Dela upp Stockholm-sitemapen i **2 filer** för att minska risken för hämtningsfel:

- `sitemap-local-sthlm-1.xml` — Första halvan av tjänsterna (ca 76 tjänster × 34 orter = ~2 584 URL:er)
- `sitemap-local-sthlm-2.xml` — Andra halvan (ca 75 tjänster × 34 orter = ~2 550 URL:er)

## Ändringar

### 1. `vite-plugin-sitemap-gen.ts`
- Dela `ALL_SERVICE_SLUGS` i två halvor vid index 76
- Generera `sitemap-local-sthlm-1.xml` och `sitemap-local-sthlm-2.xml` istället för en fil
- Uppdatera sitemap-indexet att peka på de två nya filerna

### 2. `scripts/generate-sitemaps.mjs`
- Samma uppdelning som ovan (hålla skriptet i sync)

### 3. `public/sitemap.xml`
- Ersätt `sitemap-local-sthlm.xml` med `sitemap-local-sthlm-1.xml` och `sitemap-local-sthlm-2.xml`

## Resultat
- 6 child-sitemaps istället för 5
- Varje fil < 200 KB — ingen risk för timeout
- Google Search Console: skicka om sitemap.xml efter deploy

