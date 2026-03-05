

## Diagnos: Admin-notiser skickas inte vid offertöppning/accept

### Problem
Edge functions `get-quote-public` och `accept-quote-public` innehåller korrekt `notifyAdmin()`-logik som anropar Resend API till `imedashviliomar@gmail.com`. Men funktionerna är troligen **inte deployade** med senaste koden — loggarna visar inga anrop alls.

### Lösning
Deploya alla relevanta edge functions som hanterar kundinteraktioner med offerter:

1. **`get-quote-public`** — skickar 👁️-notis när kund öppnar offert (status ändras från `sent` → `viewed`)
2. **`accept-quote-public`** — skickar ✅-notis vid accept
3. **`reject-quote-public`** — skickar notis vid avvisning  
4. **`ask-question-quote`** — skickar notis vid frågor
5. **`request-change-quote-public`** — skickar notis vid ändringsbegäran

### Åtgärd
Deploya dessa 5 edge functions. Ingen kodändring behövs — koden är redan korrekt.

