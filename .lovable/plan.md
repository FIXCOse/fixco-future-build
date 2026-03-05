

## Plan: Offert-spårning med visuell tidslinje

### Vad vi bygger
En visuell tidslinje inne i varje offert-kort som visar offertens resa med tidsstämplar, plus möjlighet att manuellt ändra status.

### Redan på plats
- `quotes_new` har kolumner: `sent_at`, `viewed_at`, `accepted_at`, `declined_at`, `change_req_at`
- `get-quote-public` sätter `viewed_at` automatiskt när kunden öppnar länken
- Statusar visas redan som badges

### Vad som läggs till

#### 1. Ny komponent: `QuoteStatusTimeline.tsx`
Visuell steg-tidslinje:
```text
● Skapad    (5 mar 2026, 10:30)
● Skickad   (5 mar 2026, 14:00)
● Öppnad    (5 mar 2026, 15:22)
○ Accepterad (väntar...)
```
Grön prick = klart, grå = väntar. Visar även avböjd/ändringsbegäran.

#### 2. Manuell statusändring
Dropdown i offert-sektionen för att manuellt sätta status (skickad, accepterad, etc.).

#### 3. Integration i RequestQuoteCard
Tidslinjen visas i expanderad vy under offertinfo.

### Filer
- **Ny:** `src/components/admin/QuoteStatusTimeline.tsx`
- **Ändras:** `src/components/admin/RequestQuoteCard.tsx` — visa tidslinje + statusändring
- **Ändras:** `src/hooks/useRequestsQuotes.ts` — säkerställ att tidsstämplar hämtas

### Inga databasändringar
All data finns redan i `quotes_new`.

