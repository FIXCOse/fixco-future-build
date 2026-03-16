

# Plan: Påminnelsemail för offerter (admin → kund)

## Vad ska byggas

En ny "Skicka påminnelse"-funktion i admin-vyn, separat från uppföljningsmailet. Påminnelsen har en tydlig ton och design som signalerar "påminnelse om din offert" snarare än en generell uppföljning.

## Komponenter

### 1. `ReminderEmailDialog.tsx` (ny komponent)
Liknar `FollowUpEmailDialog` men med påminnelse-specifik kontext:
- AI-generering av ämnesrad och brödtext med påminnelse-prompt (urgency, giltighetstid, "glöm inte")
- Admin-instruktionsfält (valfritt, som i follow-up)
- Testmail-knapp + skicka-knapp
- Anropar en ny edge function `send-reminder-email`

### 2. `send-reminder-email` (ny edge function)
Samma struktur som `send-followup-email` men med:
- Annorlunda HTML-mall: orange/gul gradient-header istället för lila, tydlig "Påminnelse"-rubrik
- Ämnesrad som default börjar med "Påminnelse: ..."
- CTA-knapp "Se din offert"
- Visar giltighetstid om den finns

### 3. `generate-reminder-text` (ny edge function)
Samma struktur som `generate-followup-text` men med påminnelse-specifika system-prompts:
- Tydligt att det är en påminnelse, inte ett uppföljningsmail
- Nämner att offerten snart går ut (om valid_until finns)
- Kortare och mer direkt ton
- Stöd för sv/en

### 4. Knapp i `RequestQuoteCard.tsx`
- Ny knapp "Påminnelse" bredvid "Uppföljningsmail" för offerter med status `sent`, `viewed`, `change_requested`
- Bell-ikon istället för Mail-ikon

## Teknisk sammanfattning

- 2 nya edge functions (`send-reminder-email`, `generate-reminder-text`)
- 1 ny React-komponent (`ReminderEmailDialog.tsx`)
- 1 redigerad fil (`RequestQuoteCard.tsx` — lägg till knapp + dialog)
- Inga databasändringar behövs — använder samma `quotes_new` + `customers`-tabeller
- Samma auth-mönster som befintliga edge functions (admin/owner-check)

