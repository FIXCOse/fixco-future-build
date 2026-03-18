

## Problem

Påminnelsemailet ser ut som om det skickats personligen av en admin. Det saknar indikation på att det är ett automatiskt genererat meddelande.

## Plan

### 1. Uppdatera e-postmallen i `supabase/functions/send-reminder-email/index.ts`

- Lägg till en tydlig "automatiskt meddelande"-disclaimer i mailet, t.ex. en liten text ovanför eller under brödtexten:
  - SV: "Detta är ett automatiskt påminnelsemail."
  - EN: "This is an automated reminder."
- Ändra sign-off från `signoff + Fixco Team` till en mer systemaktig avsändare, t.ex. bara "Fixco" utan "Med vänliga hälsningar"
- Lägg till en diskret fotnot längst ner: "Du får detta mail eftersom du har en öppen offert hos Fixco."

### 2. Deploya edge-funktionen

- Deploya `send-reminder-email` så ändringarna går live

### Filer som ändras
- `supabase/functions/send-reminder-email/index.ts` — E-postmallen uppdateras med automatiskt-meddelande-indikation

