

## Problem: PDF-filer visas som trasiga bilder i admin-panelen

### Analys
Filuppladdningen fungerar korrekt — `file_urls` sparas i databasen. Problemet ar att **admin-panelen renderar alla filer som `<img>`-taggar**, vilket inte fungerar for PDF, DOCX eller andra dokumenttyper. Dessutom star det "Bifogade bilder" som rubrik, oavsett filtyp.

### Berorda filer
1. **`src/components/admin/RequestQuoteCard.tsx`** (rad 283-314) — Filvisning i offert/bokningskort
2. **`src/pages/admin/AdminBookingDetail.tsx`** (rad 311-344) — Filvisning i bokningsdetalj

### Plan

**1. Skapa hjalpfunktion for filtypsdetektering**
- Extrahera filtyp fran URL (`.pdf`, `.docx`, etc.)
- Returnera om filen ar en bild eller ett dokument

**2. Uppdatera `RequestQuoteCard.tsx`**
- Byt rubrik fran "Bifogade bilder" till "Bifogade filer"
- For bilder: behall `<img>`-rendering som idag
- For PDF/dokument: visa en klickbar ikon (FileText) med filnamn och "Oppna PDF"-lank
- Alla filer far `target="_blank"` for att oppna i ny flik

**3. Uppdatera `AdminBookingDetail.tsx`**
- Samma logik: sarskilj bilder fran dokument
- Dokument visas som kort med ikon + filnamn istallet for `<img>`
- Byt rubrik till "Bifogade filer"

### Teknisk detalj
```text
URL: .../requests/1710...._dokument.pdf
         ↓ extrahera extension
      ".pdf" → visa som dokument-ikon + lank
      ".jpg" → visa som <img> thumbnail
```

