

## Plan: Uppdatera sitemap-hubs.xml med hreflang

### Problem
`generateHubsSitemap()` listar bara svenska `/tjanster/{slug}` — inga engelska `/en/services/{slug}` och inga hreflang-attribut. Samma gap som fixades för lokala sidor.

### Ändring

**`vite-plugin-sitemap.ts`** — `generateHubsSitemap()` (rad 135-144):
- Lägg till `xmlns:xhtml` namespace
- För varje slug, generera **två** `<url>`-entries (SV + EN) med bidirektionella `xhtml:link` hreflang-attribut (`sv`, `en`, `x-default`)
- Svenska: `/tjanster/{slug}` priority 0.80
- Engelska: `/en/services/{slug}` priority 0.75

