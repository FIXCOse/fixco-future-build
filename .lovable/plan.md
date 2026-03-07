

## Plan: Spåra alla offertöppningar, maila admin bara första gången

### Problem
Idag sparas bara `viewed_at` (en enda tidsstämpel) och admin-mail skickas bara när status ändras från `sent` → `viewed`. Om kunden öppnar offerten igen loggas ingenting.

### Lösning

#### 1. Ny tabell `quote_views`
Loggar varje öppning med tidsstämpel och user-agent.

```sql
CREATE TABLE public.quote_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES quotes_new(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL,
  user_agent text
);
ALTER TABLE public.quote_views ENABLE ROW LEVEL SECURITY;
-- Admin-only read
CREATE POLICY "Admins can read quote_views"
  ON public.quote_views FOR SELECT TO authenticated
  USING (public.is_admin_or_owner());
```

#### 2. Edge function `get-quote-public`
- **Alltid** insert en rad i `quote_views` (oavsett status)
- **Bara** skicka admin-mail och uppdatera status till `viewed` om `quote.status === 'sent'` (samma som idag)

#### 3. Timeline-komponenten (`QuoteStatusTimeline.tsx`)
- Hämta alla rader från `quote_views` för offerten
- Visa "Öppnad av kund" med antal öppningar och senaste tidsstämpel
- Tooltip eller expanderbar lista med alla öppningstider

#### 4. API-typer
- Lägg till `quote_views` i Supabase-typerna

### Filer som ändras

| Fil | Ändring |
|-----|---------|
| SQL migration | Skapa `quote_views` tabell med RLS |
| `supabase/functions/get-quote-public/index.ts` | Alltid logga vy, maila bara vid `sent` → `viewed` |
| `src/components/admin/QuoteStatusTimeline.tsx` | Hämta och visa alla öppningar |
| `src/integrations/supabase/types.ts` | Lägg till `quote_views` typ |

