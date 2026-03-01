

## SEO-optimering: Dominera "snickare uppsala", "snickare stockholm" m.fl.

Jag har identifierat **5 atgarder** som kan gora verklig skillnad for era lokala sidor.

---

### 1. Lagg till individuella Review-schemas pa lokala sidor

**Problem:** Ni har `AggregateRating` (stjarnor) i schemat, men Google behover individuella `Review`-schemas for att validera att betyget ar trovärdigt och visa det i SERP. Funktionen `getReviewSchema()` finns redan i `SEOSchemaEnhanced.tsx` men anvands **aldrig** pa lokala sidor.

**Fix:** I `LocalServicePage.tsx`, generera 3-5 individuella Review-schemas fran `getAreaReviews()` och injektera dem som `<script type="application/ld+json">` i Helmet. Dessa validerar era AggregateRating-stjarnor och ger Google bevis for att betyget ar riktigt.

**Fil:** `src/pages/LocalServicePage.tsx`

---

### 2. Gor "Relaterade sokningar" till interna lankar (ej bara text)

**Problem:** Rad 884-890 i `LocalServicePage.tsx` visar relaterade sokningar som `<span>`-element -- dessa ger **noll SEO-varde**. Google kan inte folja dem, och de distribuerar ingen PageRank.

**Fix:** Omvandla varje relaterad sokning till en `<Link>` som pekar pa ratt tjanst+ort-kombination (t.ex. "hantverkare uppsala" -> `/tjanster/snickare/uppsala`). For soktermer som inte har en exakt match (t.ex. "koksrenovering pris") lankar vi till naermaste tjanst-sida.

**Fil:** `src/pages/LocalServicePage.tsx`

---

### 3. Fixa kvarvarande "50% ROT" i localSeoData.ts

**Problem:** Trots att vi fixade `index.html` och `blogData.ts`, har `localSeoData.ts` kvar **24 forekomster av "50%"** -- i `localTip` fallback (rad 472), alla 10 `getImprovedTitle`-templates (rad 503-512), och `getImprovedDescription` (rad 538). Aven om dessa inte anvands pa alla sidor idag, ar `localTip`-fallbacken aktiv for orter utan specifik `AREA_UNIQUE_CONTENT`.

**Fix:** Byt alla "50%" till "30%" i hela filen.

**Fil:** `src/data/localSeoData.ts`

---

### 4. Lagg till "sameAs" och "hasMap" i lokalt schema

**Problem:** Ert `ProfessionalService`-schema pa lokala sidor saknar `sameAs` (sociala medier) och `hasMap` (Google Maps-lank). Dessa stärker Googles fortroende for att ert foretag ar legitimt och hjalper med Knowledge Panel-visning.

**Fix:** Lagg till `sameAs`-array (Facebook, Instagram, LinkedIn) och `hasMap` (Google Maps embed-URL med ort) i `localBusinessSchema` i `LocalServicePage.tsx`.

**Fil:** `src/pages/LocalServicePage.tsx`

---

### 5. Lagg till `hasOfferCatalog` pa varje lokal sida

**Problem:** Varje lokal sida listar specifika tjanster (t.ex. "Koksrenovering i Uppsala", "Altanbygge i Uppsala") men dessa exponeras inte som strukturerad data. Google kan inte indexera ert fulla tjansteutbud per ort.

**Fix:** Lagg till `hasOfferCatalog`-schema i `localBusinessSchema` baserat pa `content.servicesSection.items`, sa att Google ser exakt vilka tjanster ni erbjuder pa varje ort.

**Fil:** `src/pages/LocalServicePage.tsx`

---

### Teknisk sammanfattning

| Fil | Andring |
|-----|---------|
| `src/pages/LocalServicePage.tsx` | Review-schemas, relaterade sokningar som lankar, sameAs/hasMap, hasOfferCatalog |
| `src/data/localSeoData.ts` | 50% -> 30% ROT (24 forekomster) |

### Forvantat resultat

- **Stjarnor i SERP**: Individuella reviews validerar AggregateRating -- Google visar gula stjarnor under ert resultat
- **Battre intern lankning**: Relaterade sokningar som lankar fordelar PageRank och hjalper Google forsta sidstrukturen
- **Korrekt info**: Inga "50% ROT"-pastaenden som skadar trovärdighet
- **Starkare lokalt schema**: sameAs + hasMap + OfferCatalog ger Google mer data for att visa ert resultat framfor konkurrenterna

