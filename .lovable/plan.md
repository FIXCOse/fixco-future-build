

## Plan: "Skicka uppföljningsmail till kund" med AI-genererad text

### Vad byggs
En ny funktion under offertkort (i `RequestQuoteCard`) som låter admin skicka ett personligt uppföljningsmail till kunden. Mailet ska vara säljande och övertygande, med möjlighet att:
- AI-generera mailtext baserat på offertdata och kundnamn
- AI-generera mailtitel
- Manuellt redigera både titel och brödtext innan man skickar
- Skicka mailet från `info@fixco.se` via Resend

### Tekniska ändringar

#### 1. Ny edge function: `send-followup-email/index.ts`
- Tar emot `quoteId`, `subject`, `body` (HTML-text)
- Hämtar offertdata + kundinfo från DB
- Skickar via Resend från `Fixco <info@fixco.se>`
- Wrappas i Fixco-brandad HTML-mall (samma stil som `send-quote-email-new`)
- Inkluderar länk till offerten (`/q/{number}/{token}`)
- Uppdaterar INTE offertstatus

#### 2. Ny edge function: `generate-followup-text/index.ts`
- Tar emot `quoteId` och `type` (`body` | `subject`)
- Hämtar offertdata + kundnamn + tjänst
- Anropar Lovable AI Gateway (`google/gemini-3-flash-preview`) med `LOVABLE_API_KEY`
- System-prompt: "Skriv säljande, övertygande uppföljningstext på svenska för ett hantverksföretag. Kunden ska känna att de gör rätt val. Nämn att de kan ställa frågor via mail eller direkt via offertsidan."
- Returnerar genererad text

#### 3. Ny komponent: `FollowUpEmailDialog.tsx`
- Dialog med:
  - **Ämnesrad** — textfält + "AI-generera"-knapp (sparkle-ikon)
  - **Brödtext** — textarea + "AI-generera"-knapp
  - Båda fälten fullt redigerbara manuellt
  - Förhandsvisning av hur mailet ser ut
  - "Skicka"-knapp
- Öppnas via ny knapp i `RequestQuoteCard` under offertsektionen (synlig för quotes med status `sent`, `viewed`, `change_requested`)

#### 4. Ändringar i `RequestQuoteCard.tsx`
- Lägg till `onSendFollowUp` callback i Props
- Ny knapp "📩 Uppföljningsmail" i offertens action-rad (bredvid Redigera, Skicka, etc.)
- Knappen öppnar `FollowUpEmailDialog`

#### 5. Ändringar i `AdminQuotesUnified.tsx`
- Koppla `FollowUpEmailDialog`-logiken

#### 6. `supabase/config.toml`
- Lägg till `send-followup-email` och `generate-followup-text` med `verify_jwt = false`

### Filöversikt
- **Ny:** `supabase/functions/send-followup-email/index.ts`
- **Ny:** `supabase/functions/generate-followup-text/index.ts`
- **Ny:** `src/components/admin/FollowUpEmailDialog.tsx`
- **Ändrad:** `src/components/admin/RequestQuoteCard.tsx` — ny knapp
- **Ändrad:** `src/pages/admin/AdminQuotesUnified.tsx` — state + handler
- **Ändrad:** `supabase/config.toml` — nya funktioner

