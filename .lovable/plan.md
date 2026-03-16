

## Plan: Merge local sitemaps into hubs

The local Stockholm and Uppsala sitemaps are failing in Google Search Console ("Hämtning misslyckades"). The fix is to merge all local area URLs directly into `sitemap-hubs.xml` and remove the two separate local files.

**URL count check**: 151 services × 53 areas × 2 languages = ~16,006 local URLs + 302 existing hub URLs = ~16,308 total. Well under Google's 50,000 URL limit per sitemap.

### Changes

**1. `vite-plugin-sitemap-gen.ts`**
- Modify `hubsSitemap()` to also loop through all Stockholm + Uppsala areas for each service slug (same logic as `localSitemap()` but appended into the same `<urlset>`)
- Remove the `localSitemap()` function
- Update `sitemapIndex()` to only list 3 child sitemaps: `sitemap-main.xml`, `sitemap-hubs.xml`, `sitemap-blog.xml`
- Remove generation of `sitemap-local-sthlm.xml` and `sitemap-local-uppsala.xml` from the files map

**2. `scripts/generate-sitemaps.mjs`**
- Same changes mirrored: merge local URLs into hubs, remove local sitemap generation, update sitemap index

**3. `public/sitemap.xml`** (static fallback)
- Remove the two local sitemap entries

**4. Cleanup**
- Delete `public/sitemap-local-sthlm.xml` and `public/sitemap-local-uppsala.xml`

