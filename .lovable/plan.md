

## Fix: Offerten visas på svenska trots att kunden bokade på engelska

### Problem (3 delar)

1. **DB-funktionen `create_draft_quote_for_booking`** kopierar inte bokningens `locale` till `quotes_new.locale` — alla offerter får default `'sv'`.
2. **Edge function `get-quote-public`** returnerar inte `locale` till frontend.
3. **`QuotePublic.tsx`** har ~100+ hårdkodade svenska strängar: "Mottagare", "Giltig till", "Vad ingår i offerten", "Arbete", "Material", "ATT BETALA", "Acceptera offert", "Neka offert", etc.

### Lösning

**1. DB-migration: Uppdatera `create_draft_quote_for_booking`**
- Lägg till `SELECT locale INTO v_locale FROM bookings WHERE id = booking_id`
- Sätt `locale = v_locale` i INSERT till `quotes_new`

**2. Edge function `get-quote-public/index.ts`**
- Lägg till `locale` i SELECT-query
- Inkludera `locale` i `publicData`-objektet som returneras

**3. Frontend `QuotePublic.tsx` — tvåspråkig offertvy**
- Lägg till `locale` i `PublicQuote` type
- Skapa ett `quoteCopy`-objekt med sv/en översättningar för alla UI-strängar (~40 nycklar)
- Ersätt alla hårdkodade svenska strängar med `t.key`-lookups
- Påverkar: rubriker, labels, knappar, info-kort, dialoger, footer

### Filer som ändras

| Fil | Ändring |
|-----|---------|
| SQL-migration | Uppdaterad `create_draft_quote_for_booking` — kopiera `locale` från booking |
| `supabase/functions/get-quote-public/index.ts` | Returnera `locale` i API-response |
| `src/pages/QuotePublic.tsx` | Tvåspråkigt copy-objekt + ersätt alla hårdkodade strängar |

