

# Problem: Google hittar sidorna men indexerar dem INTE

## Grundorsak
Fixco är en **client-side SPA** (Single Page Application). När Googlebot besöker `/tjanster/golvlaggning/huddinge` får den exakt samma `index.html` som startsidan — med titeln "Fixco | Privat • BRF • Företag" och startsidans meta-description. Google måste sedan köra JavaScript-rendering för att se det riktiga innehållet.

Med **8000+ sidor** som alla ser likadana ut i råkällan deprioriterar Google dem i sin render-kö → status "Upptäckt – inte indexerad."

## Lösning: Statisk HTML-generering vid build

Skapa en **Vite-plugin** som vid build-tid genererar unika HTML-filer för varje lokal tjänstesida. Varje fil får rätt `<title>`, `<meta description>`, canonical, hreflang och JSON-LD schema — direkt i HTML:en, utan att Google behöver köra JavaScript.

```text
Före (alla sidor):
  GET /tjanster/golvlaggning/huddinge → index.html
    <title>Fixco | Privat • BRF • Företag</title>  ← Fel!

Efter:
  GET /tjanster/golvlaggning/huddinge → tjanster/golvlaggning/huddinge/index.html
    <title>Golvläggning Huddinge ★ Parkett, vinyl & klinker · ROT 30%</title>  ← Rätt!
```

### Vad pluginet gör

1. Itererar över alla `LOCAL_SERVICES × ALL_AREAS` kombinationer (151 × 53 = ~8000 sidor)
2. För varje kombination genererar en `tjanster/{slug}/{area}/index.html` med:
   - Korrekt `<title>` och `<meta name="description">` (från `generateLocalContent`)
   - `<link rel="canonical">` till rätt URL
   - Hreflang-taggar (sv, en, x-default)
   - Geo-meta (region, placename)
   - JSON-LD: LocalBusiness + BreadcrumbList schema
   - Samma `<script type="module" src="/src/main.tsx">` för React-hydration
3. Gör samma sak för engelska varianter (`en/services/{slug}/{area}/index.html`)

### Filer som ändras

**Ny fil — `vite-plugin-prerender-local.ts`**
- Importerar service/area-data från sitemap-pluginets redan existerande listor
- Importerar title/description-templates (duplicerar logiken, inte runtime-import)
- Genererar ~16,000 HTML-filer (8000 sv + 8000 en) vid build via `generateBundle()`
- Varje fil är ~3-4 KB (bara `<head>` med SEO + tom `<body>` med React-mount)

**`vite.config.ts`**
- Lägger till det nya pluginet

**`public/_redirects`**
- Tar bort eller justerar SPA-fallbacken så att de statiska filerna serveras först (Lovable/Netlify serverar statiska filer före fallback automatiskt)

### Teknisk detalj

```typescript
// vite-plugin-prerender-local.ts (förenklat)
function generateLocalHtml(serviceSlug, areaSlug, locale) {
  const title = getTitleForService(serviceSlug, areaSlug, locale);
  const description = getDescriptionForService(serviceSlug, areaSlug, locale);
  const canonical = locale === 'en' 
    ? `https://fixco.se/en/services/${serviceSlug}/${areaSlug}`
    : `https://fixco.se/tjanster/${serviceSlug}/${areaSlug}`;
  
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <meta name="description" content="${description}"/>
  <link rel="canonical" href="${canonical}"/>
  <link rel="alternate" hreflang="sv" href="..."/>
  <link rel="alternate" hreflang="en" href="..."/>
  <script type="application/ld+json">{...LocalBusiness schema...}</script>
  <!-- Same CSS/JS as index.html -->
</head>
<body><div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
</body></html>`;
}

// In generateBundle(), emit all files
for (const service of ALL_SERVICES) {
  for (const area of ALL_AREAS) {
    this.emitFile({
      type: 'asset',
      fileName: `tjanster/${service}/${area}/index.html`,
      source: generateLocalHtml(service, area, 'sv')
    });
  }
}
```

### Resultat
- Google ser unikt SEO-innehåll direkt i HTML — utan JavaScript-rendering
- Sidorna indexeras snabbare (dagar istället för veckor/aldrig)
- React hydraterar som vanligt för interaktivitet
- Ingen påverkan på dev-server eller befintlig funktionalitet

