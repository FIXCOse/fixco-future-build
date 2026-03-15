# Plan: Byt från Vite-plugin till statiska sitemaps

## Ändringar

### 1. Radera `vite-plugin-sitemap.ts`

### 2. Uppdatera `vite.config.ts`

- Ta bort rad 5 (`import { sitemapPlugin }`) och rad 18 (`sitemapPlugin()`)

### 3. Skapa `scripts/generate-sitemaps.mjs`

- Fristående Node-script som skriver 6 XML-filer direkt till `/public/`
- Läser `src/data/blogSlugs.ts` via regex-parsing (TS-fil, kan inte importeras direkt i .mjs)
- Innehåller samma data och logik som nuvarande plugin (service slugs, area slugs, hreflang, priorities, lastmod)
- Genererar: `sitemap.xml`, `sitemap-main.xml`, `sitemap-hubs.xml`, `sitemap-blog.xml`, `sitemap-local-sthlm.xml`, `sitemap-local-uppsala.xml`

### 4. Uppdatera `package.json`

```json
"build": "node scripts/generate-sitemaps.mjs && vite build && node scripts/validate-sitemaps.mjs",
"generate:sitemaps": "node scripts/generate-sitemaps.mjs"
```

### 5. Uppdatera `public/_redirects`

Ersätt wildcard-regeln `/sitemap-local-*` med 6 explicita force-passthrough-regler högst upp:

```
/sitemap.xml              /sitemap.xml              200!
/sitemap-main.xml         /sitemap-main.xml         200!
/sitemap-hubs.xml         /sitemap-hubs.xml         200!
/sitemap-blog.xml         /sitemap-blog.xml         200!
/sitemap-local-sthlm.xml  /sitemap-local-sthlm.xml  200!
/sitemap-local-uppsala.xml /sitemap-local-uppsala.xml 200!
```

### 6. Uppdatera `public/_headers`

Konsolidera till en enda wildcard-regel (redan finns men säkerställ):

```
/sitemap*.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600
```

### 7. Uppdatera scripts/validate-sitemaps.mjs

Validera sitemap-filer i dist/ istället för public/.

Detta säkerställer att build-outputen (det som faktiskt deployas och hämtas av Google) alltid innehåller giltiga XML-filer.

## Resultat

- Bygget kraschar inte längre (pluginen som refererar STHLM_BATCHES tas bort helt)
- Sitemaps blir vanliga statiska filer som Vite kopierar till dist/
- Ingen plugin, ingen SPA-routing, ingen magi — bara statiska XML-filer