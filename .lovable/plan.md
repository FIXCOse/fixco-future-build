

## Plan: Generera PDF klient-sida med jsPDF + html2canvas (utan PDFBolt)

### Problem
PDFBolt API ger 400-fel. Istället för att felsöka en extern tjänst kan vi generera PDF:en direkt i webbläsaren med **jsPDF** och **html2canvas** som redan är installerade.

### Lösning
Skapa en ny funktion som:
1. Hämtar offertdata från Supabase (samma som edge functionen gör)
2. Återanvänder HTML-mallen från `_shared/pdf-html-templates.ts` — men som en klient-sida funktion
3. Renderar HTML → canvas → PDF med html2canvas + jsPDF
4. Laddar upp PDF:en till Supabase Storage (`quotes`-bucketen)
5. Uppdaterar `quotes_new.pdf_url`

### Filer som ändras

**1. Ny fil: `src/lib/generateQuotePdf.ts`**
- Klient-sida PDF-generator som tar ett `quoteId`
- Hämtar offertdata + kunddata från Supabase
- Bygger HTML (portar logiken från `_shared/pdf-html-templates.ts`)
- Använder html2canvas + jsPDF för att skapa PDF
- Laddar upp till Supabase Storage och uppdaterar `pdf_url`

**2. Ändra: `src/pages/admin/AdminQuotesUnified.tsx`**
- `handleViewPdf` anropar den nya klient-sida funktionen istället för edge function `generate-pdf-from-quote`

### Fördelar
- Ingen extern API-nyckel behövs
- Ingen edge function-deploy krävs
- Snabbare (ingen nätverksrunda till PDFBolt)
- Redan installerade beroenden (jsPDF, html2canvas)

