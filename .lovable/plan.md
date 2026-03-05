

## Plan: Schemalägg automatisk utskick av offerter

### Vad vi bygger
En funktion i admin-panelen där du kan välja datum och tid för när en offert automatiskt ska skickas till kunden via email. Du ser en "Schemalägg"-knapp bredvid "Skicka"-knappen på varje offert.

### Steg

#### 1. Ny databastabell: `scheduled_quote_sends`
Skapar en tabell som lagrar schemalagda utskick:
- `id`, `quote_id` (FK → quotes_new), `scheduled_for` (timestamptz), `executed` (bool), `executed_at`, `cancelled`, `created_by`, `created_at`
- RLS: admin/owner kan läsa/skriva

#### 2. Ny Edge Function: `execute-scheduled-quote-sends`
En cron-triggad funktion som:
1. Hämtar alla rader i `scheduled_quote_sends` där `scheduled_for <= now()` och `executed = false` och `cancelled = false`
2. För varje rad: anropar `send-quote-email-new` internt (skickar email + uppdaterar status till "sent")
3. Markerar raden som `executed = true`

#### 3. Cron-jobb (pg_cron)
Kör `execute-scheduled-quote-sends` varje minut via `pg_cron` + `pg_net`.

#### 4. UI: "Schemalägg utskick"-dialog i admin
- Ny komponent `ScheduleQuoteSendDialog` med en datetime-picker
- Visar befintliga schemalagda utskick för offerten (med möjlighet att avbryta)
- Knappen visas bredvid "Skicka" på offert-kortet i `RequestQuoteCard.tsx`

#### 5. Hook: `useScheduledQuoteSends`
React Query-hook för att skapa, lista och avbryta schemalagda utskick.

### Filer som ändras/skapas
- **Migration SQL** — ny tabell `scheduled_quote_sends` + RLS policies
- **`supabase/functions/execute-scheduled-quote-sends/index.ts`** — ny edge function
- **`src/components/admin/ScheduleQuoteSendDialog.tsx`** — ny UI-komponent
- **`src/hooks/useScheduledQuoteSends.ts`** — ny hook
- **`src/components/admin/RequestQuoteCard.tsx`** — lägg till "Schemalägg"-knapp
- **`src/pages/admin/AdminQuotesUnified.tsx`** — wire up callbacks
- **Cron SQL** — schemalägg edge function varje minut

