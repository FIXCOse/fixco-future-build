

# Fix: Sitemap-filer som Google inte kan hämta

## Analys

Från skärmdumpen:
- **Lyckas**: sthlm-1 (3 400 URLs), sthlm-4 (1 428 URLs), blog (160), hubs (342), main (28)
- **Misslyckas**: sthlm-2, sthlm-3 (3 400 URLs vardera), alla 3 Uppsala-filer (2 850 / 2 850 / 798)

Nuvarande batch-storlekar: Stockholm = 50 slugs/batch, Uppsala = 75 slugs/batch. Varje URL genererar ~6 rader XML (med hreflang), så filerna blir stora. Google har en timeout och/eller storleksgräns (~50 MB okomprimerat) som slår till inkonsekvent.

## Lösning

Minska batch-storlekarna drastiskt så att varje fil innehåller max ~1 500 URLs:

| Region | Nuvarande | Nytt | Antal filer | URLs/fil (ca) |
|--------|-----------|------|-------------|---------------|
| Stockholm (34 områden) | 50 slugs/batch | **20** | ~9 | ~1 360 |
| Uppsala (19 områden) | 75 slugs/batch | **35** | ~5 | ~1 330 |

## Fil att ändra

**`vite-plugin-sitemap.ts`** — rad 129-130:

```typescript
// Nuvarande
const STHLM_BATCHES = chunk(ALL_SERVICE_SLUGS, 50);
const UPPSALA_BATCHES = chunk(ALL_SERVICE_SLUGS, 75);

// Nytt
const STHLM_BATCHES = chunk(ALL_SERVICE_SLUGS, 20);
const UPPSALA_BATCHES = chunk(ALL_SERVICE_SLUGS, 35);
```

Inget annat behöver ändras — sitemap-index, buildSitemaps() och dev-servern använder redan `STHLM_BATCHES` och `UPPSALA_BATCHES` dynamiskt.

Efter deploy: skicka om alla sitemaps i Google Search Console.

