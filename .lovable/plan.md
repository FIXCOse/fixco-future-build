

## Problem

Den statiska `public/sitemap.xml` pekar fortfarande på gamla `sitemap-hubs.xml` (som raderats). De nya sitemap-filerna (`sitemap-services.xml`, `sitemap-local-sthlm.xml`, `sitemap-local-uppsala.xml`) har aldrig genererats — scriptet och Vite-pluginen är uppdaterade men har inte körts. Google ser alltså en trasig sitemap-index.

## Plan

### 1. Generera de nya statiska sitemap-filerna direkt i `public/`

Skriva ut korrekta, färdiga XML-filer:

- **`public/sitemap.xml`** — Sitemap-index med XML-deklaration, pekar på de 5 nya filerna
- **`public/sitemap-main.xml`** — ~14 svenska huvudsidor (priority 1.0–0.30)
- **`public/sitemap-services.xml`** — 151 tjänste-hubbar (priority 0.90)
- **`public/sitemap-local-sthlm.xml`** — ~5 100 Stockholm-sidor (priority 0.80–0.85)
- **`public/sitemap-local-uppsala.xml`** — ~2 870 Uppsala-sidor (priority 0.80–0.85)
- **`public/sitemap-blog.xml`** — Blogginlägg (priority 0.70)

Alla filer får:
- `<?xml version="1.0" encoding="UTF-8"?>` överst
- Korrekt `xmlns:xhtml` namespace
- Self-closing `<xhtml:link ... />` med `hreflang="sv"` + `hreflang="x-default"`
- Bara svenska URL:er, inga `/en/`-sidor
- `<lastmod>` satt till dagens datum

### 2. Behåll `_redirects` som de är

Redan korrekt uppdaterade med de nya filnamnen.

### 3. Rör INTE svenska titlar/meta/descriptions

Inga ändringar i SEO-komponenter eller sidinnehåll.

### Filer som skapas/uppdateras
- `public/sitemap.xml` — Ny sitemap-index
- `public/sitemap-main.xml` — Uppdateras med XML-deklaration
- `public/sitemap-services.xml` — Ny fil
- `public/sitemap-local-sthlm.xml` — Ny fil
- `public/sitemap-local-uppsala.xml` — Ny fil
- `public/sitemap-blog.xml` — Uppdateras med XML-deklaration

### Teknisk detalj
Eftersom vi inte kan köra Node-scripts i Lovable, skriver vi ut filerna direkt. Vite-pluginen genererar dem vid nästa production build, men vi behöver korrekta statiska filer NU så att Google kan börja crawla direkt efter deploy.

