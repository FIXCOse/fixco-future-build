

## Plan: Aktivera pg_cron för schemalagda utskick

### Problem
Edge function `execute-scheduled-quote-sends` anropas aldrig i produktion. `config.toml`-schedulern fungerar bara lokalt. `pg_cron` är inte aktiverat.

### Lösning

#### 1. Aktivera pg_cron och pg_net extensions
SQL-migration:
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
```

#### 2. Skapa cron-jobb via SQL (insert, ej migration)
Kör via `supabase--read-query` (innehåller projekt-specifik URL och anon key):
```sql
SELECT cron.schedule(
  'execute-scheduled-quote-sends',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://fnzjgohubvaxwpmnvwdq.supabase.co/functions/v1/execute-scheduled-quote-sends',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

#### 3. Verifiera
- Kontrollera att cron-jobbet skapades korrekt
- Kontrollera edge function logs efter 08:00 för att bekräfta att mailet skickades

### Filer som ändras
- **SQL migration** — enable extensions
- **SQL insert** — cron.schedule (ej migration, innehåller secrets)

### Tidspress
Utskicket är schemalagt till **08:00 idag**. Om vi inte hinner aktivera cron innan dess kan jag manuellt trigga edge functionen åt dig som backup.

