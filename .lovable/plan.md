

# Analys: Varför sitemap-filerna fortfarande inte fungerar

## Rotorsak

Jag hämtade den live-deployade `sitemap.xml` från både `fixco.se` och `fixco-future-build.lovable.app`. **Båda serverar fortfarande den GAMLA versionen** med 17 child-sitemaps (sthlm-1 genom sthlm-9, uppsala-1 genom uppsala-5). Det nya generate-scriptet har aldrig körts.

Dessutom finns **inga sitemap-XML-filer i `/public/`-mappen** — listan visar bara `_headers`, `_redirects`, `robots.txt` etc. Scriptet `generate-sitemaps.mjs` är tänkt att köras som pre-build-steg via `package.json`, men **Lovable's byggmiljö kör `vite build` direkt**, inte `npm run build`. Därför körs aldrig `node scripts/generate-sitemaps.mjs`.

Resultatet: Vite har inget att kopiera, och den gamla plugin-genererade versionen (cachad från tidigare deploy) serveras istället.

## Lösning

Sluta förlita sig på att scriptet körs vid build-tid. Istället **skriva de 6 XML-filerna direkt till `/public/`** som committade filer. Vite kopierar sedan allt i `/public/` till `dist/` automatiskt — ingen script-körning behövs.

### Filer att skapa (direkt i `/public/`):
1. `public/sitemap.xml` — Sitemap index med 5 child-sitemaps
2. `public/sitemap-main.xml` — 14 huvudsidor × 2 språk = 28 URLs
3. `public/sitemap-hubs.xml` — 151 tjänster × 2 språk = 302 URLs  
4. `public/sitemap-blog.xml` — Alla bloggposter × 2 språk
5. `public/sitemap-local-sthlm.xml` — 151 tjänster × 34 områden × 2 språk
6. `public/sitemap-local-uppsala.xml` — 151 tjänster × 19 områden × 2 språk

### Övriga ändringar:
- `public/_redirects` — Redan korrekt med 6 explicita 200!-regler
- `public/_headers` — Redan korrekt med `/sitemap*.xml` wildcard
- Behåll `scripts/generate-sitemaps.mjs` för framtida manuell uppdatering, men filerna ska finnas committade i `/public/`

### Viktigt:
De stora filerna (sthlm ~11K URLs, uppsala ~6.5K URLs) genereras programmatiskt av scriptet. Vi kör logiken från `generate-sitemaps.mjs` och skriver output direkt som statiska filer. Sitemap-indexet refererar bara till de 5 konsoliderade child-sitemaps.

