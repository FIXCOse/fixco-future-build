

## Plan: Lägg till "Ställ fråga till kund" direkt i QuoteFormModal

### Problem
Admin kan bara ställa frågor till kunder via den separata AdminQuoteQuestions-sidan. Det finns ingen möjlighet att ställa frågor direkt från offertformuläret (QuoteFormModal) — varken innan eller efter att offerten skickats.

### Lösning

**Fil: `src/components/admin/QuoteFormModal.tsx`**

Lägg till en sektion i QuoteFormModal (under befintliga fält, t.ex. efter "Kundnotering") där admin kan:

1. Se befintliga frågor kopplade till denna offert (om `quote` finns)
2. Skriva och skicka nya frågor till kunden direkt från formuläret
3. Frågorna sparas via `send-admin-question-to-customer` edge function (redan implementerad)

Konkret:
- Lägg till state för `adminQuestions` (lista), `newAdminQuestion` (textarea), `sendingQuestion` (loading)
- Vid öppning av en befintlig offert: hämta frågor från `quote_questions` där `quote_id` matchar och `asked_by = 'admin'`
- Visa en "Frågor till kund"-sektion med:
  - Lista på redan ställda frågor med status (besvarad/ej besvarad)
  - Textarea + "Skicka fråga"-knapp för att ställa ny fråga
- Anropet går till `send-admin-question-to-customer` edge function som redan hanterar insert + mail

### Filer som ändras

| Fil | Ändring |
|-----|---------|
| `src/components/admin/QuoteFormModal.tsx` | Ny sektion "Frågor till kund" med lista + textarea + skicka-knapp |

### Ingen ny edge function behövs
Återanvänder befintlig `send-admin-question-to-customer`.

