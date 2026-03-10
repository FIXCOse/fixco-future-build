Inkludera/informera även i mailet till kunden när offerten skickas ut att vi har ställt frågor som vi önskar att dom besvarar direkt via offert sidan

## Plan: Admin kan ställa frågor till kund via offerten

### Koncept

Utöka det befintliga `quote_questions`-systemet så att frågor kan gå åt båda håll. Admin ställer fråga → kund ser den i offerten och kan svara → admin får notis.

### Databasändring

Lägg till kolumn `asked_by` på `quote_questions`:

```sql
ALTER TABLE quote_questions ADD COLUMN asked_by text DEFAULT 'customer' CHECK (asked_by IN ('customer', 'admin'));
```

När `asked_by = 'admin'`: `customer_name` sätts till "Fixco", `question` innehåller admins fråga, `answer` fylls i av kunden.

### Frontend-ändringar

**1. Admin: Ställ fråga från offertvy (`AdminQuoteQuestions.tsx` eller `QuoteFormModal.tsx`)**

- Lägg till en "Ställ fråga till kund"-knapp i admin-offerthanteringen
- Dialog med textarea för frågan
- Insertar direkt i `quote_questions` med `asked_by: 'admin'`, `customer_name: 'Fixco'`, `answered: false`

**2. Publik offert (`QuotePublic.tsx`)**

- I Q&A-sektionen: visa admin-frågor med annorlunda styling (Fixco-ikon, blå bakgrund)
- Kunden ser en "Svara"-knapp på obesvarade admin-frågor
- Dialog med namn + svar → uppdaterar `answer` och `answered` på frågan
- Kopiera tvåspråkigt: "Fixco has a question for you" / "Fixco har en fråga till dig"

**3. Edge function: Notifiera kund via email (`send-admin-question-to-customer`)**

- Ny edge function som skickar mail till kunden med frågan
- Använder offertens `locale` för rätt språk
- CTA-knapp: "Se offerten och svara"

**4. Notifiera admin när kund svarar**

- Återanvänd befintlig `answer-quote-question` edge function men anpassa så att om `asked_by = 'admin'`, skickas notis till admin istället för kund

### Filer som ändras


| Fil                                                           | Ändring                                         |
| ------------------------------------------------------------- | ----------------------------------------------- |
| SQL-migration                                                 | `asked_by` kolumn                               |
| `src/pages/admin/AdminQuoteQuestions.tsx`                     | "Ställ fråga"-knapp + dialog                    |
| `src/pages/QuotePublic.tsx`                                   | Visa admin-frågor, svara-funktion, copy         |
| `supabase/functions/send-admin-question-to-customer/index.ts` | Ny edge function — mail till kund               |
| `supabase/functions/answer-quote-question/index.ts`           | Hantera `asked_by = 'admin'` (notis till admin) |
| `src/integrations/supabase/types.ts`                          | `asked_by` i typer                              |
| `supabase/functions/get-quote-public/index.ts`                | Returnera `asked_by` i frågor                   |
