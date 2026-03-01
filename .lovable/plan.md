
## SEO-optimering: Ranka pa forsta sidan for "snickare uppsala" m.fl.

Baserat pa er GSC-data (144 klick, 1503 exponeringar for "snickare uppsala" = ~9.6% CTR) och en genomgang av kodbasen har jag identifierat 6 atgarder -- fran kritiska fel till nya optimeringar.

---

### 1. KRITISKT: index.html sager "50% ROT-avdrag" (FELAKTIG INFO)

Google laser `index.html` innan React laddas. Er meta description sager fortfarande **"50% ROT-avdrag"** -- det ar 30% sedan januari 2026. Samma fel i OG- och Twitter-taggar.

**Fix:** Uppdatera meta description, OG description och Twitter description fran "50%" till "30%". Ocksa ta bort "15 000+ nojda kunder" om det inte ar verifierat.

**Fil:** `index.html` (rad 34, 51, 66)

---

### 2. KRITISKT: Sitemap lastmod fran december 2025

Alla 1135 rader i `sitemap.xml` har `lastmod: 2025-12-22`. Google ser detta som att inget andrats pa 14 manader --> lagre crawl-prioritet.

Dessutom finns en **duplicerad `/en/ai`-entry** (rad 531-548 duplicerar rad 540-548).

**Fix:** Uppdatera alla `lastmod` till `2026-03-01`. Ta bort duplicerad /en/ai.

**Fil:** `public/sitemap.xml`

---

### 3. _headers cachar HTML i 1 ar (TEKNISKT FEL)

Forsta regeln `/* Cache-Control: public, max-age=31536000, immutable` matchar ALLA filer -- inklusive SPA-routes som `/tjanster/snickare/uppsala`. Google kan alltsa fa en cachad version av sidan.

**Fix:** Flytta `/*` till botten och anvand den bara for security headers. Lagg explicit `index.html` no-cache forst.

**Fil:** `public/_headers`

```text
/index.html
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
```

---

### 4. Blogartiklar med foraldrade "50% ROT 2025"-referenser

Flera blogartiklar namner "50% ROT-avdrag 2025" i statistik, tips och berakningar. Vi ar i 2026 -- dessa behover uppdateras for att inte skada E-E-A-T.

Specifika andringar i `src/data/blogData.ts`:
- Rad ~1904: quotableStatements - uppdatera till historisk referens
- Rad ~1907: statistics "50% ROT-avdrag 2025" --> "30% ROT-avdrag 2026"
- Rad ~1980: ROT-berakningsexempel 50% --> 30%
- Rad ~1985: tip-box om "passa pa 2025" -- ta bort/uppdatera
- Rad ~2069: statistics "50% ROT-avdrag 2025" --> "30% ROT-avdrag 2026"
- Rad ~2079-2089: elektriker-guiden namnder "50% ROT" i excerpt och prisexempel

**Fil:** `src/data/blogData.ts`

---

### 5. Saknar worstRating i lokal AggregateRating-schema

I `LocalServicePage.tsx` (rad 141-146) saknar AggregateRating `worstRating: "1"`. Google rekommenderar detta for fullstandig schema-validering. Samma fix som gjordes for dorrlassidan.

**Fix:** Lagg till `"worstRating": "1"` i AggregateRating-schemat.

**Fil:** `src/pages/LocalServicePage.tsx` (rad 141-146)

---

### 6. Lagg till security headers (liten SEO-signal)

Google anvander HTTPS och sakerhetsheaders som rankning-signal. Ni saknar `X-Content-Type-Options`, `X-Frame-Options` och `Referrer-Policy`. Dessa laggs till via punkt 3 ovan.

---

### Sammanfattning

| Fil | Andring | Paverkan |
|-----|---------|----------|
| `index.html` | 50% --> 30% ROT i meta tags | HOG - Google laser detta forst |
| `public/sitemap.xml` | lastmod 2026-03-01, ta bort duplikat | HOG - crawl-frekvens |
| `public/_headers` | Fix caching + security headers | MEDEL - teknisk SEO |
| `src/data/blogData.ts` | Uppdatera foraldrade 50%-referenser | MEDEL - E-E-A-T |
| `src/pages/LocalServicePage.tsx` | worstRating i schema | LAG - schema-fullstandighet |

### Forvantat resultat

- Google ser korrekt, uppdaterat innehall vid crawl
- Sitemap signalerar "ny content" --> okad crawl-frekvens
- Inga caching-problem som hindrar Google fran att se senaste versionen
- Battre E-E-A-T genom korrekt information genomgaende
- Fullstandiga schemas for rika resultat i SERP
