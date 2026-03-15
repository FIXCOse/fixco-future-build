

# Aggressiv fix: Konsolidera child-sitemaps

## Problem

Google Search Console misslyckas hämta **8 av 14** lokala sitemap-filer (sthlm-6/7/8, alla 5 uppsala). Filerna är tillgängliga live och innehåller giltig XML. Problemet är sannolikt att Google timeout:ar vid parallell hämtning av många child-sitemaps.

## Lösning

Slå ihop alla 14 lokala sitemaps till **2 filer**:
- `sitemap-local-sthlm.xml` (alla 171 tjänster × 34 områden × 2 språk = ~11 628 URLs)
- `sitemap-local-uppsala.xml` (alla 171 tjänster × 19 områden × 2 språk = ~6 498 URLs)

Båda ligger långt under Googles gräns på 50 000 URLs och 50MB per fil. Totalt antal child-sitemaps minskar från **17 till 5** (main, hubs, blog, sthlm, uppsala), vilket kraftigt minskar risken för hämtningsfel.

## Tekniska ändringar

### 1. `vite-plugin-sitemap.ts`
- Ta bort chunk-logiken (`STHLM_BATCHES`, `UPPSALA_BATCHES`)
- Generera en enda `sitemap-local-sthlm.xml` med alla tjänster + alla Stockholmsområden
- Generera en enda `sitemap-local-uppsala.xml` med alla tjänster + alla Uppsalaområden
- Uppdatera `generateSitemapIndex()` att lista bara dessa 2 istället för 14

### 2. `public/_redirects`
- Behåll wildcard-regeln `/sitemap-local-*` (fungerar redan)
- Ingen ändring behövs

### 3. `scripts/validate-sitemaps.mjs`
- Ingen ändring behövs (validerar alla sitemap-filer dynamiskt)

## Resultat

| Före | Efter |
|------|-------|
| 17 child-sitemaps | 5 child-sitemaps |
| 8 filer med "Hämtning misslyckades" | Färre filer = mindre risk |
| Google måste hämta 17 filer | Google hämtar 5 filer |

