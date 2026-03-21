

# Nästa SEO-steg för byggtjänster — 3 konkreta förbättringar

## Nuläge
Ni har redan: inline-guider (35+ tjänster), prisguider (7 tjänster), extra FAQs (5 tjänster), AggregateRating, HowTo-schema, FAQPage-schema, intern länkning, och seo-inline.js med synligt HTML-innehåll.

## De tre största luckorna jag ser nu

### 1. Prisguider för alla 28+ nya byggtjänster
Prisguiden (`carpentryPriceData.ts`) täcker bara de 7 ursprungliga snickeritjänsterna. De ~28 nya tjänsterna (golvläggning, golvslipning, parkettläggning, målning, staket, rivning, bastu, carport, etc.) saknar prisdata. Google älskar prissidor — de rankar högt för sökningar som "vad kostar golvslipning i Stockholm" och triggar **rich results** med prisinformation.

**Ändring**: Utöka `carpentryPriceData.ts` med prisintervall och extra FAQs för alla bygg-tjänster som har guider.

### 2. Guide-innehåll i seo-inline.js (pre-render för Googlebot)
Guiderna renderas bara via React — Googlebot ser dem inte i det initiala HTML-svaret. `seo-inline.js` injicerar redan synligt innehåll (H1, beskrivning, breadcrumbs, USPs), men guide-texten saknas. Genom att lägga till ett utdrag av guiden (intro + första rubriken) i seo-inline.js får Googlebot 200+ ord extra unikt innehåll direkt i HTML:en.

**Ändring**: Importera guide-data i `scripts/seo-data.mjs` och injicera guide-utdrag i `generate-seo-inline.mjs`.

### 3. Extra FAQs för alla byggtjänster
Extra FAQs finns bara för 5 tjänster (snickare, köksrenovering, badrumsrenovering, altanbygge, köksmontering). De övriga 30+ tjänsterna saknar extra FAQ-innehåll, vilket betyder färre FAQ-snippets i Google och tunnare FAQPage-schema.

**Ändring**: Utöka `CARPENTRY_EXTRA_FAQS` i `carpentryPriceData.ts` med 3-5 FAQs per tjänst för alla byggtjänster.

## Prioriterad plan

### Steg 1: Prisguider + FAQs för alla byggtjänster
- **Fil**: `src/data/carpentryPriceData.ts`
- Lägg till `ServicePriceGuide` + `ExtraFaq` för ~28 tjänster
- Varje tjänst får 3-5 prisintervall och 3-5 unika FAQs (sv + en)
- Allt med `{area}`-platshållare

### Steg 2: Guide-utdrag i seo-inline.js
- **Fil**: `scripts/seo-data.mjs` — exportera kompakt guide-data (intro + första rubrik per slug)
- **Fil**: `scripts/generate-seo-inline.mjs` — injicera guide-utdrag i `#