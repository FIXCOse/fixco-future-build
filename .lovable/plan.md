

## Analys: Varför fixco.se serverar fel sitemaps

### Vad jag verifierat just nu (live-hämtning)

| Fil | fixco.se | fixco-future-build.lovable.app | Koden i repot |
|-----|----------|-------------------------------|---------------|
| sitemap.xml | **3 sitemaps** (main, hubs, blog) — 2026-03-18 | **6 sitemaps** (korrekt) — 2026-03-19 | **6 sitemaps** — 2026-03-20 |
| sitemap-main.xml | **Gammal** — innehåller /en/ URLs | Korrekt — bara svenska | Korrekt |
| sitemap-hubs.xml | **Finns** — gammal fil med /en/ | Finns inte | Finns inte i kod |
| sitemap-services.xml | Korrekt — 2026-03-19 | Korrekt | Korrekt |
| sitemap-local-sthlm-2.xml | Korrekt — 2026-03-19 | Korrekt | Korrekt |

**Slutsats:** fixco.se serverar EN BLANDNING av gammal och ny deploy. Vissa filer (services, sthlm-2) är från 2026-03-19, men sitemap.xml och sitemap-main.xml är från en äldre deploy (2026-03-18) som fortfarande refererar till den gamla `sitemap-hubs.xml`.

Google läser `sitemap.xml` som pekar på `sitemap-hubs.xml` istället för de 6 korrekta filerna. Därför hittar Google inte `sitemap-local-sthlm-2.xml`.

### Rotorsak

Bygget kraschade tidigare (pga non-ASCII slug `router-natverksskåp-guide`). Det fixades, men **den senaste koden (med korrekt sitemap.xml) har aldrig publicerats framgångsrikt till fixco.se**. Subdomänen fick en delpublicering (2026-03-19) men custom domain sitter kvar på en äldre version för vissa filer.

### Plan

**Steg 1 — Ta bort dubbel sitemap-generering (kodhärdning)**

Det finns TVÅ generatorer som skriver samma filer:
- `scripts/generate-sitemaps.mjs` (körs före `vite build`)
- `vite-plugin-sitemap-gen.ts` (körs under `vite build`)

Ta bort Vite-pluginet och behåll bara det fristående skriptet. Det eliminerar risken att de skriver olika innehåll.

**Steg 2 — Uppdatera build-skriptet**

`package.json` build-kommandot behåller bara: `generate-sitemaps.mjs → vite build → generate-seo-inline.mjs → validate-sitemaps.mjs`. Inga ändringar här — redan korrekt.

Ta bort `sitemapGeneratorPlugin` från `vite.config.ts`.

**Steg 3 — Publicera**

Efter kodändringen: Klicka "Update" i publish-dialogen. Det triggar en ny build som:
1. Genererar korrekta sitemaps (6 filer, bara svenska, ASCII-säkra)
2. Validerar dem
3. Deployer till BÅDE subdomänen och fixco.se

**Steg 4 — Verifiera**

Efter publicering, besök `https://fixco.se/sitemap.xml` och bekräfta att den listar 6 child sitemaps med dagens datum. Begär sedan ny hämtning i Google Search Console.

### Tekniska detaljer

- `vite-plugin-sitemap-gen.ts` — tas bort som plugin i `vite.config.ts` (filen kan behållas som referens)
- `vite.config.ts` rad 5 och 16 — ta bort import och användning av `sitemapGeneratorPlugin`
- Inga andra kodfiler behöver ändras
- Bygget ska fungera korrekt eftersom non-ASCII-sluggen redan är fixad

