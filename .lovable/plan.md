

## Problem

Idag prerenderas bara ~320 sidor (10 tjänster × 16 områden × 2 språk) via Vite-pluginet `generateBundle`. De övriga ~16,000 sidorna serveras som generisk `index.html` — Googlebot deprioriterar JS-rendering och indexerar dem inte.

Begränsningen är att Lovable's build har en timeout som inte tillåter att alla 16,000+ filer emitteras i Vite's bundle-fas.

## Lösning: Post-build script istället för Vite-plugin

Flytta HTML-genereringen från Vite-pluginet till ett **separat Node-script** som körs *efter* `vite build`. Detta kringgår Vite's bundle-timeout helt.

### Hur det fungerar

```text
Build pipeline (package.json "build"):
  1. generate-sitemaps.mjs        (redan finns)
  2. vite build                   (bygger JS/CSS bundle)
  3. generate-prerender.mjs  ← NY (genererar 16,000+ HTML-filer i dist/)
  4. validate-sitemaps.mjs        (redan finns)
```

### Steg

**1. Skapa `scripts/generate-prerender.mjs`**
- Läser `dist/index.html` för att hitta CSS/JS-filnamn (med hash)
- Loopar alla 152 tjänster × 54 områden × 2 språk
- Skriver `dist/tjanster/{slug}/{area}/index.html` och `dist/en/services/{slug}/{area}/index.html`
- Inkluderar blogg-prerendering (samma som idag)
- Ren string-templating, ingen browser — ~16,400 filer tar ca 5-15 sekunder

**2. Förenkla Vite-pluginet**
- Ta bort `prerenderLocalPlugin()` från `vite.config.ts` (eller gör den till en no-op)
- All prerendering sker nu i post-build-scriptet

**3. Uppdatera `package.json` build-kommandot**
```json
"build": "node scripts/generate-sitemaps.mjs && vite build && node scripts/generate-prerender.mjs && node scripts/validate-sitemaps.mjs"
```

### Resultat
- **~16,400 unika HTML-filer** genereras vid varje deploy
- Varje fil har unik `<title>`, `<meta description>`, canonical, hreflang, JSON-LD
- Netlify serverar dem automatiskt som statiska filer (före SPA fallback)
- Ingen Vite-timeout risk — scriptet körs helt separat
- Googlebot får unikt innehåll per sida utan att köra JavaScript

### Filer som ändras/skapas
- **Ny:** `scripts/generate-prerender.mjs` — huvud-logiken (portad från `vite-plugin-prerender-local.ts`)
- **Ändra:** `package.json` — lägg till scriptet i build-pipeline
- **Ändra:** `vite.config.ts` — ta bort `prerenderLocalPlugin()`
- **Behåll:** `vite-plugin-prerender-local.ts` — kan behållas som referens men används inte längre

