

## Problem: Google visar engelska titlar för svenska sökningar

### Vad som händer
Skärmdumpen visar att sökning på "snickare hägersten" ger titeln **"Carpenter Hägersten Kitchen, wardrobe & deck - Fixco"** — den engelska varianten istället för den svenska "Snickare Hägersten ★ Kök, garderob & altan · ROT 30% · Fri offert".

### Grundorsak (3 buggar)

**1. Canonical pekar alltid på svenska URL:en — även på engelska sidan**
`LocalServicePage.tsx` rad 285:
```html
<link rel="canonical" href="https://fixco.se/tjanster/snickare/hagersten" />
```
Detta är **hårdkodat** till `/tjanster/...` oavsett om besökaren (eller Google) är på `/en/services/snickare/hagersten`. Google får motstridiga signaler: canonical säger "svenska är primär" men sidans `<title>` är på engelska.

**2. Schema.org-data är alltid på svenska**
Rad 159, 184, 200-201, 228-231 — alla JSON-LD schemas (LocalBusiness, HowTo, Breadcrumbs) använder hårdkodade svenska strängar och svenska URL:er, oavsett locale. Google kan då tolka sidan som svenskt innehåll med engelsk titel.

**3. Sitemap-pluginet listar bara svenska URL:er för lokala sidor**
`vite-plugin-sitemap.ts` genererar bara `/tjanster/{slug}/{area}` — de engelska versionerna `/en/services/{slug}/{area}` finns inte i sitemap. Google hittar dem ändå via hreflang, men utan sitemap-representation får de lägre crawl-prioritet.

### Samma problem på ALLA ~8000+ lokala sidor
Dessa buggar påverkar samtliga lokala tjänstesidor, inte bara "snickare hägersten".

### Plan

**Fil 1 — `src/pages/LocalServicePage.tsx`**
- Uppdatera canonical att vara **locale-medveten**: `/tjanster/...` för sv, `/en/services/...` för en
- Uppdatera alla JSON-LD schemas att använda locale-baserade URL:er och texter (breadcrumbs, HowTo, LocalBusiness)
- OG-taggar (`og:url`, `og:title`, `og:description`) ska matcha aktuellt språk

**Fil 2 — `vite-plugin-sitemap.ts`**
- Lägg till engelska URL:er i `sitemap-local-stockholm.xml` och `sitemap-local-uppsala.xml` med hreflang-attribut
- Varje lokal sida får ett `<xhtml:link>` par som pekar sv↔en

### Teknisk detalj
```tsx
// LocalServicePage.tsx — Canonical fix
const baseUrl = 'https://fixco.se';
const canonicalPath = locale === 'en' 
  ? `/en/services/${serviceSlug}/${areaSlug}`
  : `/tjanster/${serviceSlug}/${areaSlug}`;
const canonicalUrl = `${baseUrl}${canonicalPath}`;

// Helmet
<link rel="canonical" href={canonicalUrl} />
<meta property="og:url" content={canonicalUrl} />

// Schema URLs also use canonicalUrl instead of hardcoded /tjanster/
```

