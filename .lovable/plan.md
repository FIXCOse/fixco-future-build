

## Plan: Frågor till kund skickas först vid offertutskick, inte vid sparande

### Problemet
`send-admin-question-to-customer` edge function gör två saker samtidigt:
1. Insertar frågan i `quote_questions`
2. Skickar email till kunden

Detta anropas vid sparande av offert (rad 488-498 i QuoteFormModal.tsx), vilket innebär att kunden får email om frågor redan när offerten sparas som utkast.

### Lösning

**1. QuoteFormModal.tsx — Spara frågor direkt i databasen, utan email**
- Ersätt anropet till edge function med en enkel `supabase.from('quote_questions').insert()` 
- Spara `asked_by: 'admin'`, `customer_name: 'Fixco'`, `answered: false`
- Inget email skickas vid detta tillfälle

**2. Samma ändring i AdminQuoteQuestions.tsx (knappen "Ställ fråga")**
- Om offerten inte är skickad ännu (`status !== 'sent'`): spara bara i databasen
- Om offerten redan är skickad: behåll anropet till edge function (då vill man meddela kunden direkt)

**3. send-quote-email-new — Redan klart**
- Denna edge function hämtar redan obesvarade admin-frågor och inkluderar dem i offertmailet (implementerades i förra steget)

**4. send-admin-question-to-customer — Ingen ändring**
- Behålls som den är, men anropas bara när offerten redan är skickad och admin ställer en ny fråga i efterhand

### Sammanfattning av ändringar

| Fil | Ändring |
|-----|---------|
| `src/components/admin/QuoteFormModal.tsx` | Pending questions: insert direkt i DB istället för edge function. Befintlig offert: insert i DB om status ≠ sent, annars edge function |
| `src/pages/admin/AdminQuoteQuestions.tsx` | Samma logik: kontrollera offertstatus innan email skickas |

### Resultat
- Frågor sparas alltid i databasen direkt
- Email till kund skickas **bara** när offerten skickas ut (via `send-quote-email-new` som redan inkluderar frågorna) eller om admin ställer en fråga efter att offerten redan skickats

