

# Plan: Fixa sitemap-hämtningsfel + hreflang-buggar

Tre åtgärder som löser alla kända problem:

## 1. Dela upp lokala sitemaps (fixar "Hämtning misslyckades")

**Fil:** `vite-plugin-sitemap.ts`

Stockholm (151 slugs × 34 områden × 2 språk = ~10 300 URLs) och Uppsala (151 × 19 × 2 = ~5 700 URLs) är för stora. Google timeout:ar vid hämtning.

**Lösning:** Dela service-sluglistan i batchar om 50 och generera flera delfiler:

- `sitemap-local-sthlm-1.xml` (slugs 0–49 × 34 områden)
- `sitemap-local-sthlm-2.xml` (slugs 50–99)
- `sitemap-local-sthlm-3.xml` (slugs 100–150)
- `sitemap-local-uppsala-1.xml` (slugs 0–74)
- `sitemap-local-uppsala-2.xml` (slugs 75–150)

Uppdatera `generateSitemapIndex()` och `buildSitemaps()` för att peka på de nya filnamnen.

## 2. Fixa x-default i useSEO

**Fil:** `src/hooks/useSEO.tsx` — rad 87

Ändra från:
```jsx
<link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />
```
Till:
```jsx
<link rel="alternate" hrefLang="x-default" href={currentUrl.startsWith(`${baseUrl}/en`) ? currentUrl.replace('/en/', '/').replace('/en', '/') : currentUrl} />
```

Beräkna svenska URL:en från `currentUrl` så x-default pekar på aktuell sidas svenska version.

## 3. Lägg till hreflang-taggar i SEO.tsx

**Fil:** `src/components/SEO.tsx`

Efter canonical-länken i useEffect, lägg till logik som:
1. Beräknar sv-URL och en-URL från `canonicalPath` (swap `/tjanster/` ↔ `/en/services/`)
2. Sätter tre `<link rel="alternate">` i `<head>`: `hreflang="sv"`, `hreflang="en"`, `hreflang="x-default"` → sv-URL
3. Rensar gamla hreflang-länkar vid cleanup

## Resultat

| Problem | Fix |
|---------|-----|
| Google kan inte hämta lokala sitemaps | Mindre filer (~3 400 URLs var) |
| x-default pekar på hemsidan | Pekar på aktuell sidas svenska URL |
| SEO.tsx saknar hreflang | Injicerar sv/en/x-default dynamiskt |

