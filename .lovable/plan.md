

## Plan: Lägg till test-email override i send-quote-email-new

### Problem
Edge function `send-quote-email-new` skickar alltid till kundens email från databasen. Det finns inget sätt att testa med en annan mottagare.

### Lösning
Lägg till en valfri `testEmail`-parameter i edge function. Om den skickas med, används den istället för kundens email.

### Fil som ändras

**`supabase/functions/send-quote-email-new/index.ts`**
- Acceptera `testEmail` i request body (utöver `quoteId`)
- Om `testEmail` finns, skicka till den istället för `customerEmail`
- Skippa statusuppdatering till "sent" om testEmail används (så offerten inte markeras som skickad)
- Logga tydligt att det är ett testutskick

### Användning från frontend
Inget UI behöver ändras — du kan testa genom att anropa funktionen manuellt, eller så lägger jag till en "Skicka testmail"-knapp i admin-vyn om du vill.

