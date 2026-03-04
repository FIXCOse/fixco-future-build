

## Problem identifierade

### 1. RLS-policy blockerar läsning av events
`events`-tabellen har en SELECT-policy `events_select_own` som bara tillåter `user_id = auth.uid()`. Men tracking-events sparas med `user_id IS NULL` (anonyma besökare). Resultatet: **admin kan inte läsa några anonyma tracking-events** — därför visar dashboarden tom data trots att events faktiskt sparas i databasen.

### 2. Realtime ej aktiverat på `events`-tabellen
`events` finns inte i Supabase Realtime-publikationen. Tabeller som `jobs`, `bookings`, `feature_flags` etc. är tillagda, men inte `events`. Därför triggar realtime-prenumerationen i `useAnalytics` aldrig — inga live-uppdateringar.

## Lösning

### Steg 1: Fixa RLS — Låt admin/owner läsa alla events
```sql
DROP POLICY IF EXISTS "events_select_own" ON events;
CREATE POLICY "events_select_all_for_admin"
  ON events FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR is_admin_or_owner()
  );
```
Detta låter vanliga användare se sina egna events, och admin/owner ser alla.

### Steg 2: Aktivera Realtime på events-tabellen
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE events;
```

### Inga kodändringar behövs
Koden i `useAnalytics.ts`, `useEventTracking.ts` och `AdminTrafficSEO.tsx` är korrekt. Problemet är enbart i databasens konfiguration.

