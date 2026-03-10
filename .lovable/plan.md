

## Plan: Tre separata förbättringar

### 1. Admin-visningar ska inte räknas som kundvisningar

**Problem:** När admin klickar "Visa offert" i adminpanelen, anropar den samma `/q/:number/:token`-route som kunden, och edge-funktionen `get-quote-public` loggar det som en visning.

**Lösning:** Lägg till en `?source=admin` query-parameter i alla admin-länkar. I `QuotePublic.tsx`, skicka med denna parameter till edge-funktionen. I `get-quote-public`, om `source=admin` → hoppa över `quote_views`-insert och admin-notifikationsmail.

| Fil | Ändring |
|-----|---------|
| `src/components/admin/RequestQuoteCard.tsx` | Ändra `window.open(publicUrl)` → `window.open(publicUrl + '?source=admin')` |
| `src/pages/admin/AdminQuotesUnified.tsx` | Samma för kopiera-länk (den behöver inte ändras — kopierade länken ska vara utan `?source=admin` så att kunden får rätt länk) |
| `src/pages/QuotePublic.tsx` | Läs `searchParams.get('source')`, skicka med till edge-funktionen |
| `supabase/functions/get-quote-public/index.ts` | Läs `source`-param från request-URL. Om `source === 'admin'` → skippa `quote_views` insert + skippa admin-notifikationsmail |

### 2. Admin-notifikationsmails hamnar i skräp/kampanjer

**Orsak:** Gmail klassificerar mailen som kampanjer pga:
- HTML-styling (gradient-bakgrunder, CTA-knappar, marknadsföringslayout)
- Emojis i ämnesraden (👁️, ❓, 💬)
- Generiskt `from: Fixco <info@fixco.se>` — samma avsändare som kundmails

**Lösning:** Admin-notifikationerna (de interna varningarna) ska vara **minimala plaintext-liknande mail** utan HTML-styling:
- Ta bort emojis från ämnesraden
- Använd minimal HTML (bara `<p>`-taggar, ingen styling)
- Använd `reply-to: noreply@fixco.se` för interna notiser

Berörda edge functions som skickar admin-notiser:
- `get-quote-public/index.ts` (offert öppnad)
- `accept-quote-public/index.ts` (offert accepterad)
- `reject-quote-public/index.ts` (offert nekad)
- `request-change-quote-public/index.ts` (ändringsförfrågan)
- `ask-question-quote/index.ts` (kundfråga)

Alla dessa har en `notifyAdmin()`-funktion — uppdatera alla till minimal plaintext-stil utan emojis i subject.

### 3. Företagsmail i adminpanelen

**Kort svar:** Det är möjligt men kräver en extern mailkoppling. Det finns tre huvudsakliga alternativ:

- **Gmail API** — Koppla ert Google Workspace-konto via OAuth. Kräver `gmail.readonly`, `gmail.send` scopes. Ni kan läsa inbox, skicka mail som `info@fixco.se` direkt från adminpanelen.
- **Microsoft Graph API** — Om ni använder Outlook/365.
- **IMAP/SMTP** — Universell lösning men mer komplex att bygga.

Detta är ett **stort feature-bygge** (inbox-vy, compose, trådar, realtidssynk) och bör planeras separat. Jag rekommenderar att vi fokuserar på punkt 1 och 2 nu, och tar mailintegration som ett framtida projekt.

