

## Plan: Fix — Kundens namn visas som "Fixco" på svar

### Problem
När admin skapar en fråga sätts `customer_name = 'Fixco'` på `quote_questions`-raden. På den publika sidan (rad 1699) visas svaret med `q.customer_name` — som alltså är `'Fixco'` istället för kundens namn.

### Ändring 1 — Frontend-display (`QuotePublic.tsx`)
Rad 1699: Byt `q.customer_name` till `quote.customer_name` (alltid kundens riktiga namn):
```tsx
// Nuvarande (fel):
{isAdminQ ? q.customer_name || quote.customer_name : t.answerFromFixco}
// Ny (rätt):
{isAdminQ ? quote.customer_name : t.answerFromFixco}
```

### Ändring 2 — Spara svarandens namn (`QuotePublic.tsx` + `answer-quote-question`)
Skicka med `answerName` till edge-funktionen och spara det som `answered_by_name` i databasen, så att vi har en riktig referens.

- `QuotePublic.tsx` rad 713-718: Lägg till `answer_name: answerName.trim()` i body
- `answer-quote-question/index.ts` rad 53-59: Spara `answer_name` i update

### Ändring 3 — Fixa befintliga svar i databasen
Kör en SQL-migration som uppdaterar alla befintliga besvarade admin-frågor (där `asked_by = 'admin'` och `answered = true`) med kundens namn från offertens koppling:
```sql
UPDATE quote_questions qq
SET customer_name = c.name
FROM quotes_new q
JOIN customers c ON c.id = q.customer_id
WHERE qq.quote_id = q.id
  AND qq.asked_by = 'admin'
  AND qq.answered = true
  AND qq.customer_name = 'Fixco';
```

Notera: `customer_name` på admin-frågor bör förbli `'Fixco'` (asker), men displaylogiken ska använda `quote.customer_name` för svaret.

