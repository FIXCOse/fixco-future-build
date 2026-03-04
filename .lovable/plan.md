

## Plan: Live-uppdatering av Trafik & SEO-data

### Problem
`useAnalytics`-hooken har `staleTime: 5 min` och ingen automatisk uppdatering. Data visas bara vid första laddning eller manuell refresh.

### Lösning
Två mekanismer för live-data:

1. **Supabase Realtime-prenumeration** på `events`-tabellen — invaliderar analytics-cachen direkt när nya events kommer in (t.ex. page_view, cta_click, booking_completed).

2. **Polling som fallback** — `refetchInterval: 30000` (var 30:e sek) ifall realtime missar något.

### Ändringar

**`src/hooks/useAnalytics.ts`**:
- Lägg till `refetchInterval: 30_000` i query-optionerna
- Sänk `staleTime` till `30_000` (30 sek)
- Lägg till `useEffect` med Supabase realtime-kanal som lyssnar på `INSERT` i `events`-tabellen → anropar `queryClient.invalidateQueries(['analytics'])` vid nya events (debounced 2 sek för att inte spamma vid burst)

Ingen ny fil behövs, inga databasändringar.

