

## Plan: Fix offert-ersättning som inte körs korrekt

### Problem
Databasen visar att Q-2026-009 (ny offert) och Q-2026-005 (gammal offert) delar samma bokning, men:
- Q-2026-005 har fortfarande `status = 'viewed'` (borde vara `superseded`)
- Q-2026-009 har `replaces_quote_id = null` (borde peka på Q-2026-005)
- Q-2026-005 har `replaced_by_id = null` (borde peka på Q-2026-009)

Det betyder att ersättningsflödet aldrig kördes, trots att koden finns. Trolig orsak: `quoteToSupersede` hann nollställas eller satts aldrig korrekt.

### Grundorsak — Race condition i state-hantering
I `AlertDialogAction` (rad 907-913):
```ts
onClick={() => {
  setShowReplaceConfirm(false);
  if (pendingCreateBookingId && quoteToSupersede) {
    proceedCreateQuote(pendingCreateBookingId, quoteToSupersede);
  }
  setPendingCreateBookingId(null);  // ← nollställs här
}}
```

`proceedCreateQuote` är async men kallas utan `await`. Den sätter `quoteToSupersede` igen (rad 269-271), men `setPendingCreateBookingId(null)` körs direkt efter. React kan batcha state-uppdateringar och `quoteToSupersede` kan vara instabilt när `onSuccess` slutligen körs efter att QuoteFormModal stängs.

### Åtgärder

| Fil | Ändring |
|-----|---------|
| `AdminQuotesUnified.tsx` | Skicka `supersedeQuoteId` direkt till `QuoteFormModal` som en prop istället för att förlita sig på React state som kan ändras mellan renders |
| `QuoteFormModal.tsx` | Ta emot `supersedeQuoteId` prop. Kör `supersedeQuote()` + sätt `replaces_quote_id` direkt i `handleSubmit` INNAN `onSuccess` anropas — inte i en callback |
| `send-quote-email-new` | Ingen kodändring behövs — logiken för `isReplacement` fungerar korrekt, den hittade bara ingen data pga bugg ovan |
| `get-quote-public` | Ingen ändring — superseded-redirect fungerar korrekt |
| `QuotePublic.tsx` | Ingen ändring — superseded-vyn fungerar korrekt |

### Teknisk detalj

Flytta supersede-logiken från `onSuccess`-callbacken till inne i `QuoteFormModal.handleSubmit`:

```ts
// I QuoteFormModal.handleSubmit, efter createQuoteNew():
if (supersedeQuoteId && result?.id) {
  await supersedeQuote(supersedeQuoteId, result.id);
  await supabase.from('quotes_new')
    .update({ replaces_quote_id: supersedeQuoteId })
    .eq('id', result.id);
}
onSuccess(result);
```

### Manuell datafix
Utöver kodfixen behöver vi köra en engångs-SQL för att fixa de två existerande offerterna:

```sql
UPDATE quotes_new SET status = 'superseded', replaced_by_id = '7b450a9b-...' WHERE id = '544a2db6-...';
UPDATE quotes_new SET replaces_quote_id = '544a2db6-...' WHERE id = '7b450a9b-...';
```

