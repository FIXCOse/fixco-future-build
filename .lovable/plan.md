

## Plan: Testmail-knapp + förbättrad AI-prompt

### 1. Testmail-stöd i `send-followup-email/index.ts`
Lägg till `testEmail`-parameter (samma mönster som `send-quote-email-new`). Om `testEmail` skickas, override:a mottagaren till den adressen istället för kundens email.

### 2. Testmail-knapp i `FollowUpEmailDialog.tsx`
Lägg till en "Skicka testmail"-knapp bredvid "Skicka mail" som skickar med `testEmail: "imedashviliomar@gmail.com"`. Visa tydligt att det är ett test.

### 3. Förbättrad AI-prompt i `generate-followup-text/index.ts`
Skriva om system-prompten för body-generering:
- **Max 6-8 meningar** — kort och koncist
- **Professionell, vänlig, inte säljig** — inga överdrifter, inga "generationer", inga "förverkliga drömmar"
- Tonläge: som en pålitlig hantverkare som kollar läget
- Nämn att kunden kan ställa frågor via mail eller offertsidan
- Kort nudge om att kika på offerten, inte press
- Ingen ROT-detalj i texten (det finns redan i offerten)

### Filöversikt
- **Ändrad:** `supabase/functions/send-followup-email/index.ts` — `testEmail`-parameter
- **Ändrad:** `supabase/functions/generate-followup-text/index.ts` — ny prompt
- **Ändrad:** `src/components/admin/FollowUpEmailDialog.tsx` — testmail-knapp

