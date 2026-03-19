## Bygg om sitemapen från grunden — Google-optimerad, svenska sidor i fokus

### Bakgrund

Google visar engelska sidor för svenska sökningar. Den nuvarande `sitemap-hubs.xml` är ~16 000 URL:er i en enda fil. Vi bygger om allt från scratch enligt Googles riktlinjer.

### Plan

#### 1. Skriv om `scripts/generate-sitemaps.mjs` helt

**Nyckelprinciper enligt Google:**

- `<?xml version="1.0" encoding="UTF-8"?>` på varje fil
- Bara svenska URL:er — inga `/en/`-sidor
- Korrekt self-closing `<xhtml:link ... />` med `hreflang="sv"` + `hreflang="x-default"` (båda pekar på svenska URL:en)
- Max ~5 000 URL:er per fil

**Nya filer som genereras:**

```text
sitemap.xml (index)
├── sitemap-main.xml           (~14 svenska huvudsidor)
├── sitemap-services.xml       (~151 tjänste-hubbar)
├── sitemap-local-sthlm.xml    (~5 100 lokala Stockholm-sidor)
├── sitemap-local-uppsala.xml  (~2 870 lokala Uppsala-sidor)
└── sitemap-blog.xml           (blogginlägg)
```

- Höga prioriteter: huvudsidor 1.0, tjänste-hubbar 0.90, lokala sidor i storstäder 0.85, övriga lokala 0.80, blogg 0.70
- `<changefreq>weekly</changefreq>` på tjänster/lokala, `daily` på startsida
- `<lastmod>` satt till byggdagen

#### 2. Uppdatera `vite.config.ts`

Importera och aktivera `sitemapGeneratorPlugin` från `vite-plugin-sitemap-gen.ts` så att sitemaps genereras automatiskt vid build. Uppdatera pluginen med samma logik som det nya scriptet.

#### 3. Uppdatera `vite-plugin-sitemap-gen.ts`

Synka med samma struktur — svenska URL:er only, splittade filer, korrekt XML.

#### 4. Uppdatera `public/_redirects`

Ta bort gamla sitemap-referenser, lägg till de nya:

```
/sitemap.xml                /sitemap.xml                200!
/sitemap-main.xml           /sitemap-main.xml           200!
/sitemap-services.xml       /sitemap-services.xml       200!
/sitemap-local-sthlm.xml    /sitemap-local-sthlm.xml    200!
/sitemap-local-uppsala.xml  /sitemap-local-uppsala.xml  200!
/sitemap-blog.xml           /sitemap-blog.xml           200!
```

#### 5. Ta bort gamla statiska sitemap-filer

Radera `public/sitemap.xml`, `public/sitemap-main.xml`, `public/sitemap-hubs.xml`, `public/sitemap-blog.xml` — de genereras nu dynamiskt vid build.

#### 6. Uppdatera `robots.txt` (om den finns)

Säkerställ att `Sitemap: https://fixco.se/sitemap.xml` pekar rätt.  
7. 

ändra inte våra svenska titlar, meta descriptions osv

### Resultat

- Google ser **enbart svenska URL:er** → slutar visa engelska i svenska sökresultat
- Mindre filer → snabbare crawlning, inga timeouts
- Korrekt XML enligt Googles specifikation → inga parsningsfel i Search Console
- Engelska sidor finns kvar live men indexeras inte aktivt  
