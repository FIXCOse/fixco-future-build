

## Plan: Skapa nytt referensprojekt — Garderobsbyte & Fixartjänster i Liljeholmen

### Vad som ska göras

Skapa en SQL-migration som insertar ett nytt referensprojekt i `reference_projects`-tabellen med de uppladdade bilderna och en engagerande beskrivning.

### Projektdata

- **Titel (SV):** Garderobsbyte & Hemfixar i Liljeholmen
- **Titel (EN):** Wardrobe Replacement & Home Repairs in Liljeholmen
- **Klient:** H.W
- **Plats:** Liljeholmen, Stockholm
- **Kategori:** Hemfixar / Home Repairs
- **Betyg:** 5
- **Bilder:** De tre uppladdade bilderna (IMG_8962.HEIC, garderob.webp, Garderob_hall.webp)
- **Pris/ROT:** Rimliga värden baserat på arbetstypen
- **Beskrivning (SV):** En engagerande text om att kunden hade en balkongdörr med trasiga gångjärn som inte gick att stänga ordentligt, samt gamla garderober som behövde demonteras och ersättas med nya moderna lösningar. Allt utfört smidigt och professionellt.
- **Features:** Balkongdörrsreparation, Garderobsdemontering, Garderobsmontering, Gångjärnsbyte

### Teknisk implementation

1. **Ny SQL-migration** som insertar projektet med alla fält (title, description, location, category, features, multilingual fields, images, etc.)
2. Bilderna refereras via sina uppladdade sökvägar
3. `sort_order` sätts till 1 (eller nästa lediga)
4. `is_featured: true`, `is_active: true`

Inga kodändringar behövs — projektet dyker upp automatiskt via befintliga queries.

