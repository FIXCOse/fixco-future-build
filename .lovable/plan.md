

## Problem: Bifogade bilder visas inte i offertförfrågningar

`RequestQuoteCard.tsx` (som används pa `/admin/quotes`) visar aldrig `booking.file_urls`. Theresa har laddat upp bilder -- de finns i databasen -- men komponenten har ingen sektion for att visa dem.

### Fix

**Fil:** `src/components/admin/RequestQuoteCard.tsx`

Lagg till en "Bifogade bilder"-sektion efter projektbeskrivningen (rad ~268) som:

1. Kollar `booking.file_urls && booking.file_urls.length > 0`
2. Visar en rubrik "Bifogade bilder ({antal})" med en bild-ikon
3. Renderar ett grid med thumbnails (samma stil som `AdminBookingDetail.tsx` -- `aspect-square`, `object-cover`, klickbara for att oppna i ny flik)
4. Visar ett fallback-meddelande om bilden inte laddar (`onError` -> placeholder)

Ingen ny fil behovs, ingen databasandring -- `file_urls` finns redan i hookens data.

