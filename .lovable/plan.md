

# Rekommendation: Undvik keyword stuffing — gör detta istället

## Varför INTE fler röda sökord
Google straffar sidor med onaturligt hög sökordsdensitet ("keyword stuffing"). Färgmarkerade sökord i brödtext är en av de äldsta SEO-tricksen och **sänker** ranking idag. Det ser också oprofessionellt ut och skrämmer besökare.

## Vad som faktiskt hjälper er att ranka högre

Ni har redan stark on-page SEO. De två största luckorna jag ser:

### 1. Lägg till AggregateRating-schema på lokala sidor
Google visar **stjärnor i sökresultaten** om sidan har korrekt `AggregateRating`-markup. Ni har redan testimonials/reviews-data per område (`getAreaReviews`), men saknar `AggregateRating` i JSON-LD-schemat. Sidor med stjärnor i sökresultaten får **20–30% högre klickfrekvens** (CTR), vilket i sin tur förbättrar ranking.

**Ändring**: Lägg till `AggregateRating` i det befintliga `LocalBusiness`-schemat på `LocalServicePage.tsx` med data från `areaActivity`.

### 2. Utöka guide-innehållet med "Relaterade sökningar"-sektion
Istället för att stoppa in sökord i röd text, lägg till en sektion längst ner i varje guide med **naturliga interna länkar** till relaterade tjänster/orter. T.ex. på "Köksrenovering Stockholm":
- "Läs även: Badrumsrenovering Stockholm"
- "Läs även: Köksmontering Stockholm"
- "Läs även: Köksrenovering Solna"

Detta ger Google **interna länkar med relevanta anchor-texter** — en av de starkaste on-page signalerna som finns.

**Ändring**: Utöka `InlineGuideSection.tsx` med en "Relaterade guider"-sektion som korslänkar till andra snickeritjänster i samma ort + samma tjänst i närliggande orter.

## Teknisk plan

### Fil 1: `src/pages/LocalServicePage.tsx`
- Lägg till `aggregateRating` i det befintliga schemat med `areaActivity.avgRating` och `areaActivity.reviewCount`

### Fil 2: `src/components/local/InlineGuideSection.tsx`
- Lägg till ny prop `relatedLinks` (array av `{ label, href }`)
- Rendera en "Relaterade guider i {area}"-sektion med interna länkar efter CTA:n

### Fil 3: `src/pages/LocalServicePage.tsx` (integration)
- Generera `relatedLinks` baserat på: andra snickeritjänster i samma ort + samma tjänst i 2–3 närliggande orter
- Skicka till `InlineGuideSection`

## Omfattning
- 2 filer ändras
- Påverkar ~378 snickerisidor
- Ingen ny route eller data-fil

