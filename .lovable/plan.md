

## Plan: Generera AI-bilder för referensprojekt (före/efter)

### Sammanfattning

Skapa en edge function som genererar realistiska före/efter-bilder med **google/gemini-3-pro-image-preview** (Nano Banana Pro — bästa kvalitet för bildgenerering). Bilderna sparas automatiskt i Supabase Storage och kan sedan användas för att skapa referensprojekt.

### Varför en ny edge function?

Den befintliga `ai-image-edit` redigerar befintliga bilder. Vi behöver en ny funktion som **genererar bilder från text-prompts** — t.ex. "ett slitet badrum i svenskt 70-talshus" och "samma badrum efter totalrenovering med vit kakel och spotlights".

### Teknisk implementation

**1. Ny edge function: `ai-generate-image`**
- Tar emot: `prompt` (text), `style` (before/after), `category` (bathroom/kitchen/exterior etc.)
- Skickar prompten till `google/gemini-3-pro-image-preview` via Lovable AI Gateway
- Laddar upp genererad bild till Supabase Storage (`reference-projects/ai-generated/`)
- Returnerar public URL

**2. Ny admin-sida eller komponent: AI Bildgenerator**
- Formulär där man väljer kategori (badrum, kök, fasad, garderob, etc.)
- Genererar ett par bilder (före + efter) per klick
- Visar preview med before/after slider
- Knapp för att direkt skapa referensprojekt från genererade bilder

**3. Promptstrategi för realism**
- Före-bilder: "Ultra-realistic photograph of a worn-out Swedish [category], natural lighting, showing age and wear, 70s/80s era Swedish interior..."
- Efter-bilder: "Ultra-realistic photograph of the same [category] after professional renovation, modern Scandinavian design, same room layout and angle..."
- Pro-modellen (`gemini-3-pro-image-preview`) ger betydligt bättre resultat än flash-varianten

**4. Uppdatera config.toml**
- Lägg till `[functions.ai-generate-image]` med `verify_jwt = true` (admin-only)

### Kategorier att generera

Jag kan generera före/efter-par för t.ex.:
- Badrumsrenovering
- Köksrenovering
- Fasadrenovering
- Garderobsinstallation
- Golvläggning
- Målning (interiör/exteriör)

### Begränsningar

- AI-genererade bilder kan ibland se "för perfekta" ut — prompten måste justeras för att lägga till naturliga imperfektioner
- Före/efter-bilderna genereras separat, så rumslayouten kan skilja sig något mellan paren
- Pro-modellen är långsammare och dyrare men ger markant bättre realism

