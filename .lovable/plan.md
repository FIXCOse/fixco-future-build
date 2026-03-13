

## Plan: Automatisk geolocation-taggning vid offertvisning

### Översikt
Vid varje offertvisning i `get-quote-public` edge function, slå upp IP-adressen mot ett gratis geolocation-API och spara land/stad i `quote_views`-tabellen. Visa info i admin-tidslinjens tooltip.

### Ändring 1 — Migration: Nya kolumner på `quote_views`
Lägg till `country` (text) och `city` (text) på `quote_views`.

### Ändring 2 — Edge function `get-quote-public/index.ts`
Efter att IP-adressen hämtats (rad 152-155), anropa `http://ip-api.com/json/{ip}?fields=country,city` (gratis, ingen API-nyckel krävs, max 45 req/min). Spara `country` och `city` i insert-raden till `quote_views`. Wrappa i try/catch så att ett misslyckat lookup inte blockerar offertvisningen.

```typescript
let city = null, country = null;
try {
  const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
  if (geo.ok) {
    const geoData = await geo.json();
    city = geoData.city || null;
    country = geoData.country || null;
  }
} catch (e) {
  console.error('Geo lookup failed:', e);
}

await supabase.from('quote_views').insert({
  quote_id: quote.id, user_agent: userAgent, ip_address: ip,
  source: viewSource, city, country
});
```

### Ändring 3 — TypeScript-typer (`types.ts`)
Lägg till `city` och `country` i `quote_views` Row/Insert/Update.

### Ändring 4 — UI: `QuoteStatusTimeline.tsx`
Uppdatera query att även hämta `city, country`. Visa i tooltip bredvid IP, t.ex.:
`12 mar 2026 kl. 15:07 — 213.35.171.205 (Tallinn, Estonia)`

### Filer som ändras
- `supabase/migrations/` — ny migration
- `supabase/functions/get-quote-public/index.ts`
- `src/integrations/supabase/types.ts`
- `src/components/admin/QuoteStatusTimeline.tsx`

