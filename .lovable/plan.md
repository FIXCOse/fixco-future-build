

## Google SEO-optimering — Saknade meta tags, schemas och canonical URLs

### Problem
Flera viktiga publika sidor saknar helt SEO-metadata:

| Sida | Title/Desc | Canonical | OG Tags | Schema | Breadcrumb |
|------|-----------|-----------|---------|--------|------------|
| `/faq` | Saknas | Saknas | Saknas | Saknas (borde ha FAQPage) | Saknas |
| `/kontakt` | Saknas | Saknas | Saknas | Saknas (borde ha LocalBusiness+ContactPoint) | Saknas |
| `/tjanster` | Saknas | Saknas | Saknas | Saknas (borde ha ItemList+OfferCatalog) | Saknas |
| `/referenser` | Saknas | Saknas | Saknas | Saknas (borde ha CollectionPage) | Saknas |
| `/smart-hem` | Saknas | Saknas | Saknas | Saknas | Saknas |
| `/karriar` | Har title/desc via Seo | Saknas | Saknas | Saknas (borde ha JobPosting) | Saknas |
| `/rot-info` | Har title/desc | Saknas canonical | Saknas OG | Saknas (borde ha FAQPage+HowTo) | Saknas |
| `/rut` | Har title/desc | Saknas canonical | Saknas OG | Saknas (borde ha FAQPage+HowTo) | Saknas |

**Hem, Om oss, Blogg, BloggPost, LocalServicePage** har bra SEO redan.

### Plan — 8 filer att uppdatera

**1. `src/pages/FAQ.tsx`** — Lägg till Helmet med title, description, canonical, OG-tags + **FAQPage schema** (generera från befintliga frågor — detta ger rich snippets i Google).

**2. `src/pages/Contact.tsx`** — Helmet + **LocalBusiness schema med ContactPoint** (telefon, email, adress).

**3. `src/pages/Services.tsx`** — Helmet + **ItemList schema** (lista alla tjänster med URL) + **OfferCatalog schema**. Canonical + OG.

**4. `src/pages/Referenser.tsx`** — Helmet + **CollectionPage schema** med projektexempel. Canonical + OG.

**5. `src/pages/SmartHome.tsx`** — Helmet + OG + canonical. Product-lista schema.

**6. `src/pages/Careers.tsx`** — Utöka Seo-komponenten med canonical `/karriar`, OG-tags, + **JobPosting schema** (en per yrke som söks — snickare, elektriker, VVS etc.). JobPosting ger "Jobs" rich snippets i Google.

**7. `src/pages/ROTInfo.tsx`** — Lägg till canonical, OG-tags, **FAQPage schema** (ROT-frågor) + **HowTo schema** (hur man ansöker om ROT).

**8. `src/pages/RUT.tsx`** — Samma som ROT: canonical, OG, FAQPage schema + HowTo schema.

### Tekniska detaljer

Varje sida får:
- `<Helmet>` med `<title>`, `<meta name="description">`, `<link rel="canonical">`
- OG-tags: `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:locale`
- Twitter card tags
- Relevant JSON-LD schema via `<script type="application/ld+json">`
- Breadcrumb schema via `getBreadcrumbSchema()`

Schemas som skapas:
- `getJobPostingSchema()` i SEOSchemaEnhanced.tsx — för karriärsidan
- FAQ-sidans alla frågor konverteras till FAQPage schema med `getFAQSchema()`
- ROT/RUT får HowTo + FAQ schemas

Ingen ny dependency behövs — allt finns redan (react-helmet-async, SEOSchemaEnhanced).

