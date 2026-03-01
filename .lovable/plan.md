

## SEO-optimering: Fixa buggar + nya optimeringar for maximal SERP-synlighet

Tva buggar behover fixas och tva nya optimeringar laggs till.

---

### 1. BUG FIX: Relaterade sokningar lankar till SAMMA sida

**Problem:** Alla relaterade sokningar (rad 920-926) pekar pa `${servicePrefix}/${serviceSlug}/${areaSlug}` -- dvs sidan man redan ar pa. Noll SEO-varde.

**Fix:** Skapa en mapping-funktion `getRelatedSearchUrl()` som analyserar soktermen och matchar mot ratt tjanst-slug:
- "hantverkare uppsala" -> synonym-match -> `/tjanster/snickare/uppsala`
- "koksrenovering pris" -> projekttyp-match -> `/tjanster/snickare/${areaSlug}` (samma ort)
- "maleri stockholm" -> annan tjanst -> `/tjanster/malare/stockholm`

Logiken: Loopa igenom alla `SEARCH_ACTION_PATTERNS` synonymer och projekttyper, hitta vilken tjanst soktermen matchar bast. Om det ar SAMMA tjanst som nuvarande sida, hoppa till narmaste synonym-tjanst. Extrahera ort fran soktermen om den finns.

**Fil:** `src/pages/LocalServicePage.tsx`

---

### 2. BUG FIX: Urgent services ar spans, inte lankar

**Problem:** Rad 942-948 visar "akut snickare i Uppsala" som `<span>`. Dessa borde vara `<Link>`.

**Fix:** Byt `<span>` till `<Link>` som pekar pa samma tjanst+ort-sida. Aven om det ar en self-link sa ger det Google crawl-signaler att sidan ar relevant for dessa termer.

**Fil:** `src/pages/LocalServicePage.tsx`

---

### 3. NY: Lagg till hreflang pa lokala sidor

**Problem:** Lokala sidor saknar `hreflang`-taggar i `<head>`. Google vet inte att `/tjanster/snickare/uppsala` och `/en/services/snickare/uppsala` ar samma sida pa olika sprak. Det kan leda till duplicerat innehall-straff.

**Fix:** Lagg till hreflang `<link>` taggar i Helmet:
```
<link rel="alternate" hreflang="sv" href="https://fixco.se/tjanster/snickare/uppsala" />
<link rel="alternate" hreflang="en" href="https://fixco.se/en/services/snickare/uppsala" />
<link rel="alternate" hreflang="x-default" href="https://fixco.se/tjanster/snickare/uppsala" />
```

**Fil:** `src/pages/LocalServicePage.tsx`

---

### 4. NY: Lagg till geo meta-taggar pa lokala sidor

**Problem:** Lokala sidor saknar geo-taggar som hjalper Google med lokal ranking. Metadata med `region` och koordinater finns redan i `getAreaMetadata()`.

**Fix:** Lagg till i Helmet:
```
<meta name="geo.region" content="SE-C" />
<meta name="geo.placename" content="Uppsala" />
```

**Fil:** `src/pages/LocalServicePage.tsx`

---

### Teknisk sammanfattning

| Fil | Andring |
|-----|---------|
| `src/pages/LocalServicePage.tsx` | Smart URL-mapping for relaterade sokningar, urgent services som lankar, hreflang-taggar, geo meta-taggar |

### Forvantat resultat

- **Intern lankning fungerar**: Relaterade sokningar fordelar PageRank till ratt sidor istallet for self-links
- **Battre crawlbarhet**: Urgent services som lankar ger fler crawl-signaler
- **Ingen duplicerat innehall**: hreflang forhindrar att Google straffar SV/EN-versioner
- **Starkare lokal signal**: Geo-taggar forstarker lokal ranking for "snickare uppsala" etc.

