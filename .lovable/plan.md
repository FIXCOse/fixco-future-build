## Plan: Skicka offert-kopia till valfria e-postadresser

### Problem

Admin kan bara skicka offerten till kundens registrerade e-post. Behöver kunna skicka kopior till ytterligare mottagare när som helst.

### Ändring 1 — Ny knapp "Skicka kopia" i `RequestQuoteCard.tsx`

Lägg till en knapp (synlig för alla statusar utom `superseded`) som öppnar en dialog/prompt där admin anger en eller flera e-postadresser (kommaseparerade). Knappen anropar en ny callback `onSendCopy`.

### Ändring 2 — `AdminQuotesUnified.tsx`

Ny funktion `handleSendCopy(quoteId)`:

- Öppnar `window.prompt` med text "Ange e-postadress(er) att skicka kopia till (kommaseparera vid flera):"
- Anropar `send-quote-email-new` med `{ quoteId, copyEmails: [...], isCopy: true }`

### Ändring 3 — Edge function `send-quote-email-new/index.ts`

- Acceptera ny parameter `copyEmails` (string[]) och `isCopy` (boolean)
- Om `copyEmails` finns: skicka till dessa adresser istället för kunden
- Om `isCopy` är true: hoppa över statusuppdatering (precis som testEmail), lägg till "[Kopia]" i ämnesraden
- Behåll befintlig logik för vanlig skickning oförändrad

### Flöde

1. Admin klickar "Skicka kopia" → prompt med e-postfält
2. Edge function skickar exakt samma offertmail till angivna adresser
3. Offertens status ändras INTE (det är bara en kopia)  
Om `isCopy` är true: logga ip adressen med att mailadressen med kopian har öppnat den, så jag kan skilja på om bokaren eller kopi mottaagren har öppnat