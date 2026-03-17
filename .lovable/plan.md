

## Problem

Google ser `<div id="root"></div>` som body-innehåll for alla 16 400 URL:er. Inline JS satter meta-taggar, men **body ar tomt** tills React renderar. Google kan indexera via WRS (Web Rendering Service) men det tar veckor/manader och manga sidor riskerar "thin content".

## Losning: seo-inline.js injicerar synligt HTML i body

Uppgradera `scripts/generate-seo-inline.mjs` sa att scriptet, forutom meta-taggar i `<head>`, ocksa injicerar **synligt HTML-innehall direkt i `<body>`** innan React mountar. Nar React mountar skriver den over `<div id="root">` som vanligt.

### Vad scriptet injicerar (per URL)

**I `<head>` (redan implementerat + nytt):**
- `document.title` (finns)
- `<meta description>` (finns)  
- `<link canonical>` + hreflang (finns)
- **NYTT:** JSON-LD `LocalBusiness` + `Service` + `BreadcrumbList` schema

**I `<body>` (NYTT — detta ar det som saknas):**

Scriptet injicerar en dold `<div id="seo-root">` **innan** `<div id="root">` med:

```html
<div id="seo-root">
  <h1>Snickare i Stockholm</h1>
  <p>Professionell snickare i Stockholm. Fixco erbjuder snabb start inom 5 dagar, 
     ROT/RUT-avdrag och nojd-kund-garanti.</p>
  <nav aria-label="Breadcrumb">
    <a href="/">Hem</a> > <a href="/tjanster">Tjanster</a> > 
    <a href="/tjanster/snickare">Snickare</a> > Stockholm
  </nav>
  <ul>
    <li>Start inom 5 dagar</li>
    <li>ROT/RUT-avdrag</li>
    <li>Nojd-kund-garanti</li>
  </ul>
</div>
```

Nar React mountar och renderar sitt innehall i `<div id="root">`, doljs `seo-root` automatiskt (scriptet satter `display:none` pa det nar React ar redo, eller sa overlappar `#root` det visuellt).

### Varfor detta funkar for Google

1. Googlebot hamtar HTML → ser `seo-root` med **unikt h1, p, nav, ul** per URL
2. Googlebot kanner igen det som riktigt innehall, inte "thin content"
3. WRS renderar ocksa React-innehallet, men even utan WRS finns tillrackligt for indexering
4. JSON-LD ger strukturerad data for rich snippets

### Implementationsplan

**1. Ta bort oanvanda bilder (fixa bygget)**
- Radera `public/reference-projects/` (27 JPG, noll kodreferences)
- Radera `public/images/references/` (6 filer, noll kodreferences)

**2. Rensa vite.config.ts**
- Ta bort oanvand `sitemapGeneratorPlugin`-import

**3. Uppgradera `scripts/generate-seo-inline.mjs`**
- Lagg till JSON-LD generering (LocalBusiness, Service, BreadcrumbList)
- Lagg till body-innehallsinjicering (`seo-root` div med h1, beskrivning, breadcrumb, USP-lista)
- Scriptet injicerar i bade `<head>` och `<body>` av `dist/index.html`

**4. Uppdatera `index.html`**
- Flytta seo-inline.js script-taggen till precis innan `</body>` (efter `<div id="root">` men fore React-modulen) sa att `document.body` finns tillganglig for injicering

**5. Lagg till React-side cleanup**
- I `main.tsx` eller rot-komponenten: dölj `#seo-root` nar React mountar (`document.getElementById('seo-root')?.remove()`)

### Filer som andras
- **Ta bort:** `public/reference-projects/*`, `public/images/references/*`
- **Andra:** `scripts/generate-seo-inline.mjs` — utoka med body-HTML + JSON-LD
- **Andra:** `index.html` — flytta script-tagg, lagg till `<div id="seo-root"></div>` placeholder
- **Andra:** `vite.config.ts` — ta bort oanvand import
- **Andra:** `src/main.tsx` — ta bort `#seo-root` vid mount

### Resultat
- Google ser **unikt synligt innehall** per URL utan att behova rendera React
- Alla 8 200 svenska sidor har unik h1, beskrivning, breadcrumb och schema
- Bygget producerar **noll extra filer** (allt sker i 1 seo-inline.js)
- Build-storlek minskar ~15-30MB (borttagna bilder)

