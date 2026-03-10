&nbsp;

## Plan: Offert-ersättning med automatisk omdirigering

### Koncept

Istället för att bara "makulera" en offert, inför vi ett **ersättningssystem** där en ny offert automatiskt pekar tillbaka på den gamla, och den gamla pekar framåt till den nya. Kunden som öppnar en gammal länk ser direkt att offerten har ersatts och kan klicka sig vidare.

### Databasändringar

Lägg till en kolumn `replaced_by_id` på `quotes_new`:

```sql
ALTER TABLE quotes_new ADD COLUMN replaced_by_id UUID REFERENCES quotes_new(id);
```

När en ny offert skapas för samma bokning:

1. Den gamla offertens status sätts till `superseded` och `replaced_by_id` pekas till den nya offerten
2. Den nya offerten skapas som vanligt med nytt nummer och token

### Filändringar


| Fil                                        | Ändring                                                                                                                                                                                                                                                               |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DB migration**                           | Lägg till `replaced_by_id` kolumn på `quotes_new`                                                                                                                                                                                                                     |
| `**useRequestsQuotes.ts**`                 | Ändra quote-matchningen (rad 199) — hämta senaste icke-superseded offert för varje bokning                                                                                                                                                                            |
| `**AdminQuotesUnified.tsx**`               | Ta bort blockeringen "En offert finns redan" (rad 208-211). Istället: om en aktiv offert redan finns, visa bekräftelsedialog "Vill du ersätta befintlig offert?". Vid bekräftelse → sätt gamla offertens status till `superseded` + `replaced_by_id`, skapa ny offert |
| `**get-quote-public` (edge function)**     | Om offerten har `replaced_by_id`, returnera `{ superseded: true, new_quote_url }` istället för offertdata. Bygg nya URL:en från den nya offertens `number` + `public_token`                                                                                           |
| `**QuotePublic.tsx**`                      | Ny vy för superseded-offerter: visa en snygg kort med "Denna offert har ersatts av en uppdaterad version" + CTA-knapp "Visa uppdaterad offert" som leder till nya URL:en                                                                                              |
| `**send-quote-email-new` (edge function)** | Om den gamla offerten har `replaced_by_id` (dvs det finns en föregångare), lägg till en banner i mailet: "📋 Detta är en uppdaterad offert som ersätter din tidigare offert [gammalt nummer]"                                                                         |
| `**RequestQuoteCard.tsx**`                 | Lägg till "Ersätt offert"-knapp (eller ändra "Skapa offert" till att hantera ersättning)                                                                                                                                                                              |


### Flöde

1. Admin klickar "Skapa ny offert" på en bokning som redan har en offert
2. Bekräftelsedialog: "Det finns redan en offert (Q-2026-005). Vill du ersätta den med en ny?"
3. Vid OK → gamla offerten får `status = 'superseded'`, `replaced_by_id = nya offertens id`
4. Ny offert skapas med nytt nummer, ny token, status `draft`
5. Admin redigerar och skickar → mail skickas med "Uppdaterad offert"-banner
6. Kund som öppnar gamla länken → ser "Offerten har uppdaterats" + knapp till nya offerten
7. Kund som öppnar nya länken → ser den nya offerten som vanligt
8. Säkerställ att allting finns tillgängligt på både svenska och engelska, det vill säga är bokningen ursprungligen på engelska, elelr admin manuellt satt den till engelska, skall nya mailet, nya sidrona, pop up osv oxkså vara på engelska