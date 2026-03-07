

## Plan: Skapa bekräftelsemail till kund efter accepterad offert

### Nuläge
När en kund accepterar en offert via den publika länken händer detta:
1. Offertens status uppdateras till `accepted`
2. Ett projekt skapas automatiskt
3. Admin får ett kort notifieringsmail

**Kunden får inget mail alls.** De ser bara en bekräftelsesida i webbläsaren.

### Åtgärd

**`supabase/functions/accept-quote-public/index.ts`** — Lägg till en funktion `sendCustomerConfirmation()` som skickas efter lyckad accept:

1. Hämta kundens email från `quote.customer.email`
2. Skicka ett snyggt, branded mail via Resend med:
   - **Ämne:** `Tack! Din offert från Fixco är bekräftad`
   - **Innehåll:**
     - Grön header med checkmark och "Offert accepterad!"
     - Offertdetaljer: nummer, titel
     - Bekräftelse att projektet är skapat
     - Info om nästa steg ("Vi kontaktar dig inom kort för att boka in arbetet")
     - Kontaktuppgifter: info@fixco.se, 079-335 02 28
   - **Design:** Samma card-layout som admin-notifieringen (gradient header, tabell, footer med Fixco-branding)

3. Anropa funktionen efter lyckad accept (rad ~201, efter `notifyAdmin`) — både för normal accept och re-accept
4. Logga eventuella fel men låt inte ett misslyckat kundmail stoppa hela flödet

### Vill du att jag också skickar ett testmail till dig?
Efter implementationen kan vi trigga `send-test-accept-email` med kundversionen så du ser hur den ser ut i din inbox.

