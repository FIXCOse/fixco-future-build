# Plan: Enhetlig SEO — eliminera alla dubbla metadata-system

## Nuläge (bekräftat via kodgranskning)

**5 sidor använder `<Seo>` (DOM-manipulation):**

- `NicheServiceLandingPage.tsx` — använder BÅDA `<Seo>` OCH `<Helmet>` (dubbla signaler)
- `ServiceCityPage.tsx` — `<Seo>` med schemas
- `LocationCityPage.tsx` — `<Seo>` med schemas
- `ServiceDetail.tsx` — `<Seo>` utan schemas
- `NotFound.tsx` — `<Seo>` utan schemas

**GlobalFooter.tsx** injicerar Organization-schema via `<Helmet>` på ALLA sidor.

`**useSEO.tsx**` använder redan `<Helmet>` korrekt — behålls.

## Åtgärder

### 1. Migrera NicheServiceLandingPage till enbart `<Helmet>`

Ta bort `<Seo>` + separata `<Helmet>` och ersätt med ETT `<Helmet>`-block med title, meta description, canonical, OG-tags, och JSON-LD (FAQ-schema).

### 2. Migrera ServiceCityPage till `<Helmet>`

Ersätt `<Seo schemas={[breadcrumb, localSchema, faqSchema]}>` med `<Helmet>` som innehåller title, description, canonical, OG-tags och alla tre JSON-LD-scheman.

### 3. Migrera LocationCityPage till `<Helmet>`

Ersätt `<Seo schemas={[breadcrumb, localSchema, faqSchema]}>` med `<Helmet>` med title, description, canonical, OG-tags och alla tre JSON-LD-scheman.

### 4. Migrera ServiceDetail till `<Helmet>`

Ersätt `<Seo>` med `<Helmet>` med title, description, canonical och OG-tags.

### 5. Migrera NotFound till `<Helmet>`

Ersätt `<Seo noindex={true}>` med `<Helmet>` med noindex robots-tag, title och description.

### 6. Ta bort Organization-schema från GlobalFooter

Radera `<Helmet>`-blocket (rad 46–63) som injicerar Organization JSON-LD på varje sida. Organization-schema finns redan på startsidan och relevanta sidor via `SEOSchemaEnhanced`.

### 7. Radera oanvända SEO-filer

- `**src/components/SEO.tsx**` — raderas (alla imports borta efter migration)
- `**src/components/SEOSchema.tsx**` — raderas (ingen komponent importerar den)

### 8. Behåll

- `**src/hooks/useSEO.tsx**` — använder redan `<Helmet>` korrekt, används av Home, AboutUs, DoorLockLandingPage, AdminLayout
- `**src/components/SEOSchemaEnhanced.tsx**` — helper-funktioner för schema-generering, används av många sidor

## Filer som ändras


| Fil                                        | Ändring                                            |
| ------------------------------------------ | -------------------------------------------------- |
| `src/pages/NicheServiceLandingPage.tsx`    | Ersätt `<Seo>` + `<Helmet>` → ett `<Helmet>`-block |
| `src/pages/locations/ServiceCityPage.tsx`  | Ersätt `<Seo>` → `<Helmet>`                        |
| `src/pages/locations/LocationCityPage.tsx` | Ersätt `<Seo>` → `<Helmet>`                        |
| `src/pages/ServiceDetail.tsx`              | Ersätt `<Seo>` → `<Helmet>`                        |
| `src/pages/NotFound.tsx`                   | Ersätt `<Seo>` → `<Helmet>`                        |
| `src/components/layout/GlobalFooter.tsx`   | Ta bort Organization-schema `<Helmet>`             |
| `src/components/SEO.tsx`                   | **Radera**                                         |
| `src/components/SEOSchema.tsx`             | **Radera**                                         |


## Resultat

- EN enda SEO-källa: alla sidor använder `<Helmet>` från react-helmet-async
- Inga `document.title =` eller manuella DOM-meta-tags kvar
- Inga dubbla JSON-LD (Organization-schema inte längre globalt)
- Inga title-konflikter mellan system
- Befintliga CTR-optimerade titlar på LocalServicePage (8200+ sidor) påverkas INTE  
Säkerställ att ALLA titlar följer samma CTR-optimerade format (System 2)  
