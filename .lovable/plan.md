

# Implement Sitelinks Recovery

## Changes

### 1. `src/components/SEOSchemaEnhanced.tsx` — Fix navigation schema
Replace `getSiteNavigationSchema` (lines 358-407). The current `hasPart` + `WebPageElement` structure is non-standard. Replace with an **array of individual `SiteNavigationElement` objects** in the user's priority order:

1. Hem → `https://fixco.se/`
2. Tjänster → `https://fixco.se/tjanster`
3. Boka Hembesök → `https://fixco.se/boka-hembesok`
4. Referenser → `https://fixco.se/referenser`
5. Kontakta Oss → `https://fixco.se/kontakt`

Also add `mainEntityOfPage` to `getWebsiteSchema` (line 278-297).

### 2. `src/pages/Home.tsx` — Add BreadcrumbList to @graph
Add a homepage `BreadcrumbList` schema to the combined `@graph` array. This is a strong Google signal for sitelinks generation.

### Summary
| File | What |
|------|------|
| `SEOSchemaEnhanced.tsx` | Replace nav schema with standard format in priority order + add mainEntityOfPage |
| `Home.tsx` | Add BreadcrumbList to @graph |

Sitelinks typically reappear within 1-2 weeks after Google recrawls.

