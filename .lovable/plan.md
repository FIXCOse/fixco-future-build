
# Plan: Fixa bokningsbilagor end-to-end — problemet är större än admin-UI

## Bekräftat nuläge
Jag har spårat flödet och admin-delen är inte huvudfelet.

- `RequestQuoteCard.tsx` visar filer korrekt om `booking.file_urls` innehåller länkar
- `AdminBookingDetail.tsx` visar också filer korrekt om `file_urls` finns
- Databasen visar att flera lyckade bokningar har riktiga `file_urls`
- Jasons senaste bokning har `file_urls = []`
- I storage-bucketen `booking-attachments` finns inga nya filer för Jasons tidpunkt
- Slutsats: filerna laddades aldrig upp/sparades, därför har admin inget att visa

## Trolig rotorsak
Problemet sitter i bokningsmodalen (`ServiceRequestModal.tsx`), inte i adminvisningen.

Jag ser tre konkreta risker i nuvarande kod:

1. **Tyst felhantering**
   - Om upload misslyckas fortsätter bokningen ändå
   - Kunden får bara en lätt missbar toast
   - Resultat: bokningen skapas utan filer

2. **Svag UX för valda filer**
   - Filinputen visar ingen tydlig, persistent lista över valda filer i appens UI
   - Användaren kan tro att filer är bifogade fast state/input tappats eller aldrig kommit med

3. **Inkonsekvent fallback-konfiguration**
   - I `ServiceRequestModal.tsx` finns fortfarande generiska/fallback file-fält med äldre `accept`-strängar utan `.heic`
   - Det är inte huvudorsaken till att admin inte ser filer, men det visar att filflödet inte är helt konsekvent

## Vad jag bygger

### 1. Gör filuppladdning blockerande och tydlig
I `ServiceRequestModal.tsx`:
- Avbryt submit om någon filuppladdning misslyckas
- Visa tydligt felmeddelande i UI, inte bara toast
- Låt användaren försöka igen istället för att skapa bokning utan filer

### 2. Visa valda filer direkt i modalen
Efter file-inputen:
- lista valda filer
- filnamn + storlek
- miniatyr för bilder
- ta-bort-knapp per fil
- tydlig text som visar antal valda filer

Detta gör att kunden ser att filerna faktiskt ligger i state innan submit.

### 3. Visa uppladdningsstatus under submit
- “Laddar upp fil 1 av 3…”
- separat från vanlig loading-state
- gör det tydligt att filer verkligen behandlas

### 4. Normalisera hela file-fältlogiken
I `ServiceRequestModal.tsx`:
- uppdatera alla fallback/generiska file-fält till samma accept-format som övriga tjänster
- säkerställ att alla vägar använder samma label och samma filtyper
- inkludera `.heic` överallt

### 5. Lägg till robust felsökning
- logga antal filer i state precis före upload
- logga upload-resultat per fil
- logga payloadens `fileUrls.length` precis före edge function-anropet

Det gör nästa incident mycket snabbare att förstå.

### 6. Behåll adminvisningen men lägg ev. fallbacktext
I admin:
- om `file_urls` är tomt, visa tydlig status typ “Inga filer sparades med denna bokning”
- så det blir uppenbart att problemet är i bokningsflödet, inte i adminrenderingen

## Filer att ändra
| Fil | Ändring |
|---|---|
| `src/features/requests/ServiceRequestModal.tsx` | Huvudfix: preview, upload-status, blockerande felhantering, konsekvent accept |
| `src/pages/admin/AdminBookingDetail.tsx` | Ev. tydligare fallbacktext när bokning saknar sparade filer |
| `src/components/admin/RequestQuoteCard.tsx` | Ev. tydligare fallbacktext/status för saknade bilagor |

## Viktig observation
Det här är **inte** primärt ett problem med att admin “inte kan se” bilder.  
Det är ett **upstream-problem i bokningsflödet** där vissa bokningar skapas utan att filer någonsin laddas upp till storage eller sparas i `bookings.file_urls`.

## Förväntat resultat
Efter fixen:
- kunder kan se exakt vilka filer som är bifogade innan submit
- bokningen går inte igenom tyst utan filer om upload failar
- admin ser filer på alla bokningar där kunden faktiskt laddat upp dem
- vi får tydlig felsökning om något fortfarande strular

## Tekniska detaljer
```text
Nuvarande kedja:
kund väljer fil
→ upload till storage
→ publicUrl samlas i fileUrls[]
→ edge function sparar fileUrls i bookings.file_urls
→ admin renderar booking.file_urls

Bekräftat brott i kedjan:
för vissa bokningar stannar det innan storage/file_urls
→ därför är admin oskyldig i just detta fel
```
