

## Plan: Skicka bekräftelsemail till admin efter schemalagt utskick

### Vad vi gör
Efter att ett schemalagt offertmail har skickats till kunden, skickar vi ett bekräftelsemail till `imedashviliomar@gmail.com` med info om vilken offert som skickades och till vem.

### Fil som ändras

**`supabase/functions/execute-scheduled-quote-sends/index.ts`**

Efter raden där vi loggar `✅ Sent scheduled quote` (rad 69), lägger vi till:

1. Importera Resend (redan tillgänglig via `RESEND_API_KEY`)
2. Hämta offert + kundinfo från `quotes_new` (med JOIN på `customers`)
3. Skicka ett kort bekräftelsemail via Resend till `imedashviliomar@gmail.com`:
   - Ämne: `✅ Offert [nummer] skickad till [kundnamn]`
   - Innehåll: offertnamn, kundnamn, kundens email, tidpunkt

### Inga nya filer, inga databasändringar
Bara en uppdatering av edge functionen med Resend-anrop efter lyckad leverans.

