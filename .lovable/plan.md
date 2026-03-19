

## Problem

`sitemap-local-sthlm-2.xml` innehåller tjänstesluggen `bygga-utekök` som har ett **ö** (icke-ASCII-tecken) i URL:en. Google kräver att URL:er i sitemaps är korrekt URL-encodade. Det ogiltiga tecknet gör att Google inte kan parsa filen, och rapporterar "Hämtning misslyckades".

Sluggen `bygga-utekök` finns i den andra halvan av `ALL_SERVICE_SLUGS` (efter index 76), vilket förklarar varför sthlm-1 fungerar men inte sthlm-2.

## Lösning

Ändra sluggen `bygga-utekök` till `bygga-utekok` (utan ö) i alla tre filer:

### Filer att ändra

1. **`vite-plugin-sitemap-gen.ts`** — rad 51: `'bygga-utekök'` → `'bygga-utekok'`
2. **`scripts/generate-sitemaps.mjs`** — samma ändring
3. **Routern/tjänstesidorna** — säkerställa att `bygga-utekok` matchar den faktiska route-sluggen i appen

Alternativt kan vi URL-encoda alla sluggar i sitemap-genereringen (`encodeURI`), men det är bättre att ha konsekventa ASCII-sluggar genomgående.

### Kontroll
Söka igenom hela kodbasen efter `utekök` för att hitta alla förekomster som behöver uppdateras.

