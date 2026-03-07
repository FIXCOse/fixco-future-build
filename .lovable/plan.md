

## Problem

Tabellen `quote_views` lagrar inte IP-adresser, så det går inte att se om det är samma person som öppnat offerten flera gånger.

## Plan

### 1. Databasmigrering
Lägg till kolumn `ip_address text` i `quote_views`.

```sql
ALTER TABLE public.quote_views ADD COLUMN ip_address text;
```

### 2. Edge function (`get-quote-public/index.ts`)
Extrahera IP från request headers (Supabase edge functions kör bakom en proxy som sätter `x-forwarded-for` eller `x-real-ip`). Spara i insert:

```ts
const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  || req.headers.get('x-real-ip')
  || 'okänd';

await supabase
  .from('quote_views')
  .insert({ quote_id: quote.id, user_agent: userAgent, ip_address: ip });
```

### 3. Admin-timeline (`QuoteStatusTimeline.tsx`)
- Uppdatera queryn att hämta `ip_address` utöver `viewed_at`
- Visa IP bredvid varje tidsstämpel i tooltip:en, t.ex. `7 mars 2026 kl. 14:33 — 83.12.45.67`
- Visa antal unika IP:er i rubriken: "Öppnad 16 gånger (3 unika IP:er)"

