

## Problem: PDF-filer kan inte laddas upp

### Grundorsak
Storage-bucketen `booking-attachments` har en **vitlista av tillåtna MIME-typer** som BARA tillåter bilder:
- `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`

**PDF (`application/pdf`), Word, Excel och textfiler blockeras** av Supabase storage — uppladdningen misslyckas tyst utan felmeddelande till kunden.

### Varför syns inte felet
Koden i `ServiceRequestModal.tsx` sväljer uppladdningsfel:
```javascript
if (!uploadError) {
    fileUrls.push(publicUrl);
}
// Inget else = inget felmeddelande
```

### Plan

**1. Uppdatera storage-bucketens tillåtna MIME-typer**
Lägg till stöd för dokument via SQL-migration:
- `application/pdf`
- `application/msword` (doc)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (docx)
- `application/vnd.ms-excel` (xls)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (xlsx)
- `text/plain` (txt)

Höj även filstorleksgränsen från 5MB till 20MB för att hantera större PDF:er.

**2. Lägg till felhantering i ServiceRequestModal.tsx**
- Visa toast-felmeddelande om en fil misslyckas att laddas upp
- Visa vilka filer som laddades upp framgångsrikt innan inskickning

### Filer som ändras
- SQL-migration: Uppdatera `storage.buckets` allowed_mime_types
- `src/features/requests/ServiceRequestModal.tsx`: Felhantering vid uppladdning

