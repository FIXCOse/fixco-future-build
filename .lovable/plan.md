

## Plan: Uppdatera sitemap.xml med alla 120+ nya sökvarianter

### Problem
`public/sitemap.xml` har bara ~1 200 rader och täcker bara de 11 ursprungliga bastjänsterna + ~5 nisch-slugs. De 120+ nya slugsarna från `seoSlugsExpansion.ts` saknas helt — Google kan inte hitta dem via sitemap.

### Lösning
Eftersom en statisk sitemap med 8 000+ `<url>`-entries blir ohanterlig (~100 000+ rader XML), byter vi till en **sitemap index** med en **dynamisk sitemap-generator**.

**Approach: Bygg-tid sitemap-generering via Vite plugin**

En custom Vite plugin som vid build-tid:
1. Importerar `LOCAL_SERVICES` och `ALL_AREAS` från koden
2. Genererar en `sitemap-index.xml` som pekar på delsitemaps
3. Genererar delsitemaps per kategori (snickeri, kok, el, vvs, etc.) med alla ort-kombinationer

Alternativt (enklare): Generera hela sitemap.xml som en enda stor fil vid build-tid med ett script.

### Enklaste implementationen

**Fil 1 — `scripts/generate-sitemap.ts`** (nytt build-script)
- Importerar alla slugs från `seoSlugsExpansion.ts` och alla areas
- Genererar komplett `public/sitemap.xml` med alla 8 000+ URLs
- Körs som en del av build-processen

**Fil 2 — `public/sitemap.xml`** (ersätts helt)
- Den statiska filen ersätts med output från scriptet
- Alternativt: Vi genererar den direkt i koden och skriver ut hela filen

### Praktisk approach (utan build-script)
Eftersom vi inte kan köra Node-scripts i Lovable, genererar vi istället sitemap.xml direkt som en stor statisk fil med alla kombinationer. Med 152 slugs × 54 orter = 8 208 lokala URLer + ~150 hub-sidor + ~40 blogg + ~30 huvudsidor = **~8 430 URL-entries**.

Google tillåter max 50 000 URLs per sitemap, så en enda fil fungerar.

### Fil som ändras

**`public/sitemap.xml`** — Skriv om helt med:
1. Alla befintliga huvudsidor (behålls som de är)
2. Alla befintliga blogginlägg (behålls)
3. **152 hub-sidor** (`/tjanster/{slug}`) för alla nya nisch-slugs
4. **8 208 lokala sidor** (`/tjanster/{slug}/{area}`) för alla slug×area-kombinationer
5. Varje entry med `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`

Filen blir ~8 400 entries. Prioriteringar:
- Hub-sidor: 0.80
- Lokala sidor (Stockholm/Uppsala huvudort): 0.80
- Lokala sidor (övriga orter): 0.65-0.70

### Alternativ: Sitemap Index
Dela upp i flera filer om en enda fil blir för stor att hantera:
- `sitemap-index.xml` → pekar på `sitemap-main.xml`, `sitemap-snickeri.xml`, `sitemap-kok.xml`, etc.

Detta ger bättre struktur men kräver fler filer.

### Rekommendation
Generera en enda stor `sitemap.xml` med alla ~8 400 URLs. Det är inom Googles 50 000-gräns och enklast att underhålla.

