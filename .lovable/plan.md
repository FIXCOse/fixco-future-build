## Plan: Kundbilduppladdning på offertsidan + Admin-begäran om bilder

### Vad vi bygger

1. **Ny tabell `quote_images**` — sparar bilduppladdningar kopplade till en offert (quote_id, file_path, uploaded_by)
2. **Storage bucket `quote-customer-images**` — publik bucket för kundbilder
3. **Admin-toggle i QuoteFormModal** — "Begär bilder från kund" sparas som `_meta`-objekt `images_requested: true` i items-arrayen
4. **Bilduppladdningssektion i QuotePublic** — kunden kan ladda upp bilder, se sina uppladdade bilder, och ta bort dem
5. **Email-copy i `send-quote-email-new**` — om `images_requested` meta-flagga finns, visa en tydlig box i mailet: "Vi önskar att du laddar upp bilder"

### Databasändringar

**1. Ny tabell:**

```sql
CREATE TABLE public.quote_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes_new(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT,
  uploaded_by TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_quote_images_quote_id ON quote_images(quote_id);
ALTER TABLE quote_images ENABLE ROW LEVEL SECURITY;
-- Public insert (kund laddar upp via token)
CREATE POLICY "Public can insert images" ON quote_images FOR INSERT WITH CHECK (true);
-- Public select (för att visa bilder)
CREATE POLICY "Public can view images" ON quote_images FOR SELECT USING (true);
-- Admin full access
CREATE POLICY "Admin full access images" ON quote_images FOR ALL TO authenticated USING (public.is_admin_or_owner());
```

**2. Storage bucket:**

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('quote-customer-images', 'quote-customer-images', true, 10485760, 
  ARRAY['image/jpeg','image/png','image/webp','image/heic']);
-- Public upload policy
CREATE POLICY "Anyone can upload quote images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'quote-customer-images');
CREATE POLICY "Anyone can view quote images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'quote-customer-images');
```

### Filändringar


| Fil                                                | Ändring                                                                                                                                                                                 |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/admin/QuoteFormModal.tsx`          | Ny Switch "Begär bilder från kund" i "Övriga tillval". Sparar `_meta` `images_requested: true` i items                                                                                  |
| `src/pages/QuotePublic.tsx`                        | Ny sektion "Ladda upp bilder" med file input, preview grid, och delete. Hämtar bilder från `quote_images` tabell. Visas alltid men med extra highlight om `images_requested` meta finns |
| `supabase/functions/send-quote-email-new/index.ts` | Kolla `items` för `_meta` `images_requested`, och om true, lägg till en tydlig blå box i mailet: "📸 Vi önskar att du laddar upp bilder via offertsidan"                                |


### Bilingual copy

- SV: "Ladda upp bilder", "Vi önskar bilder från dig", "Dra och släpp eller klicka för att ladda upp"
- EN: "Upload images", "We would like photos from you", "Drag and drop or click to upload"

### Flöde

1. Admin skapar offert → aktiverar "Begär bilder" toggle → sparas som `_meta`
2. Offert skickas → email innehåller "Vi önskar bilder" box med CTA
3. Kund öppnar offertsida → ser bilduppladdningssektion → laddar upp bilder
4. Bilder sparas i `quote-customer-images` bucket + `quote_images` tabell
5. Admin kan se uppladdade bilder (framtida vy, eller via Supabase dashboard)
6. Admin kan se bilder både från offert sidan, men även så skall bilderna  läggas till i bokningen  (precis likadant som det ser ut när kunder laddar upp bilder i samband med blkningen)