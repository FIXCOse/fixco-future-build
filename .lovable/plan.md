

## Plan: Konsistent före/efter-generering + stöd för flera bilder

### Problem
Före- och efter-bilderna genereras helt oberoende av varandra med separata textprompts, vilket ger helt olika rum. Efter-bilden måste baseras på före-bilden för att se ut som samma rum — bara renoverat.

### Lösning

**1. Tvåstegsprocess i edge function `ai-generate-image`**

Ändra flödet så att:
- **Före-bild**: Genereras från textprompt (som idag)
- **Efter-bild**: Skickas som **bildredigering** — före-bilden skickas med som input tillsammans med en prompt som säger "Visa samma rum efter professionell renovering". Detta använder multimodal input (bild + text) till Gemini-modellen.

Ny parameter: `sourceImageUrl` (optional). När den skickas, använd image editing istället för ren textgenerering.

**2. Uppdatera admin-UI:t**

- Efter att före-bilden genererats, skicka dess URL automatiskt som `sourceImageUrl` till efter-genereringen
- `generateBoth()` genererar före först, väntar, sedan skickar före-bildens URL med efter-requesten

**3. Stöd för flera bilder per projekt**

Byt från `GeneratedPair` till `GeneratedImage[]`-array:
- Varje genererad bild appendas till listan
- Användaren kan generera fler bilder (olika vinklar) och ta bort enskilda
- Vid sparning skickas alla URL:er som `images`-array

### Tekniska ändringar

**`supabase/functions/ai-generate-image/index.ts`:**
- Lägg till stöd för `sourceImageUrl` i request body
- Om `sourceImageUrl` finns: skicka multimodal message med `[{type: "text", text: prompt}, {type: "image_url", image_url: {url: sourceImageUrl}}]`
- Om inte: generera från enbart text (som idag)
- Justera efter-prompten till: "Transform this exact room to show it after a professional renovation. Keep the same room layout, window positions, and dimensions. Modern Scandinavian design..."

**`src/pages/admin/AdminAiImageGenerator.tsx`:**
- Ny state: `generatedImages: GeneratedImage[]` istället för `generatedPair`
- `generateImage('after')` skickar senaste före-bildens URL som `sourceImageUrl`
- Dynamiskt bildgalleri med möjlighet att lägga till/ta bort bilder
- Räknare: "X före-bilder, Y efter-bilder"
- Spara-knappen skickar hela bildlistan

