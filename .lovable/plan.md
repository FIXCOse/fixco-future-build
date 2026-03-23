

# Plan: Enhetlig SEO — eliminera alla dubbla metadata-system

## Kvarvarande konflikt efter seo-inline.js

Det finns fortfarande **två parallella SEO-system** i React-koden:

```text
System A: src/components/SEO.tsx (<Seo>)
  → Sätter document.title = ... manuellt
  → Skapar meta-taggar via document.createElement()
  → Injicerar JSON-LD via document.head.appendChild()
  → Används av: NicheServiceLandingPage, ServiceCityPage, LocationCityPage,
    ServiceDetail, NotFound

System B: react-helmet-async (<Helmet>)
  → Deklarativt, korrekt React-mönster
  → Används av: LocalServicePage (alla 8200+ sidor), Home, Services,
    BlogPost, FAQ, Contact, Careers, Referenser, ROT/RUT-info, m.fl.
```

**Problemet:** `NicheServiceLandingPage` använder BÅDA — `<Seo>` sätter title/meta via DOM, sedan `<Helmet>` lägger till JSON-LD. Dessutom injicerar `GlobalFooter.tsx` ett Organization-schema på VARJE sida via Helmet — detta dupliceras med Organization-schemat som redan finns på specifika sidor.

## Åtgärder

### 1. Migrera alla `<Seo>`-sidor till `<Helmet>`
Ersätt `<Seo>` med `<Helmet>` på dessa 5 sidor:

| Sida | Fil |
|---|---|
| NicheServiceLandingPage | `src/pages/NicheServiceLandingPage.tsx` |
| ServiceCityPage | `src/pages/locations/ServiceCityPage.tsx` |
| LocationCityPage | `src/pages/locations/LocationCityPage.tsx` |
| ServiceDetail | `src/pages/ServiceDetail.tsx` |
| NotFound | `src/pages/NotFound.tsx` |

Varje sida får en ren `<Helmet>`-block med title, meta description, canonical, og-tags, och JSON-LD — samma mönster som `LocalServicePage.tsx` redan använder.

### 2. Ta bort Organization-schema från GlobalFooter
**Fil:** `src/components/layout/GlobalFooter.tsx`
- Ta bort `<Helmet>`-blocket med Organization-schemat (rad 46-62)
- Organization-schema sätts redan korrekt av startsidan och `SEOSchemaEnhanced`

### 3. Ta bort oanvända SEO-filer
- **`src/components/SEO.tsx`** — tas bort helt (alla sidor migrerade)
- **`src/components/SEOSchema.tsx`** — tas bort (aldrig använd som komponent, `<SEOSchema>` förekommer ingenstans)
- **`src/hooks/useSEO.tsx`** — behålls (används av Home, AboutUs, DoorLockLandingPage, AdminLayout)

### 4. Verifiera att LocalServicePage inte har dubbla scheman
**Fil:** `src/pages/LocalServicePage.tsx`
- Kontrollera att alla JSON-LD-scheman (BreadcrumbList, ProfessionalService, FAQPage, HowTo, Review, AggregateOffer) är i ETT `<Helmet>`-block
- Inga duplicerade scheman från andra komponenter (InlineGuideSection har sitt eget Article-schema — detta är OK, det är en annan @type)

## Resultat
- **En enda SEO-källa**: Alla sidor använder enbart `<Helmet>` från react-helmet-async
- **Inga dubbla title/meta**: `document.title =` försvinner helt
- **Inga dubbla JSON-LD**: Organization-schema visas bara på relevant sida, inte globalt
- **Renare kodbas**: 2 filer raderade, 5 filer migrerade

## Filer som ändras

| Fil | Ändring |
|---|---|
| `src/pages/NicheServiceLandingPage.tsx` | Ersätt `<Seo>` + `<Helmet>` med ett enda `<Helmet>`-block |
| `src/pages/locations/ServiceCityPage.tsx` | Ersätt `<Seo>` med `<Helmet>` |
| `src/pages/locations/LocationCityPage.tsx` | Ersätt `<Seo>` med `<Helmet>` |
| `src/pages/ServiceDetail.tsx` | Ersätt `<Seo>` med `<Helmet>` |
| `src/pages/NotFound.tsx` | Ersätt `<Seo>` med `<Helmet>` |
| `src/components/layout/GlobalFooter.tsx` | Ta bort Organization-schema |
| `src/components/SEO.tsx` | **Radera** |
| `src/components/SEOSchema.tsx` | **Radera** |

