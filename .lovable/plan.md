

## Problem

1. **Referensprojekt-bilder saknas**: Två av tre referensprojekt pekar på lokala filer (`/reference-projects/...` och `/images/references/...`) som raderades i en tidigare build-optimering. Bilderna finns INTE i Supabase storage heller — de är helt borta.

2. **SyntaxError kraschar sidan**: `Unexpected token '}'` — behöver hitta och fixa syntaxfelet som hindrar sidan från att laddas.

## Plan

### 1. Fixa SyntaxError som kraschar appen
- Identifiera och åtgärda syntaxfelet (troligen från senaste redigeringen)

### 2. Hantera saknade bilder i referensprojekt
De lokala bildfilerna är **permanent borttagna** från repot. De finns inte heller i Supabase storage. Det finns två alternativ:

**Alternativ A**: Inaktivera de två projekten som saknar bilder (sätt `is_active = false`) tills nya bilder laddas upp via admin-panelen

**Alternativ B**: Sätt en placeholder-bild och uppdatera databasen så att de två projekten visar en generisk bild istället för trasiga länkar

### 3. Förbättra bildvisningen i ReferenceProjectCard
- Lägg till felhantering (`onError`) i `<img>`-taggar som visar en fallback-bild om en URL inte fungerar
- Detta förhindrar att trasiga bilder visas i framtiden

### Filer som ändras
- Den fil som orsakar SyntaxError (behöver identifieras)
- SQL-migration: Uppdatera `images`/`thumbnail_image` i `reference_projects` för de två berörda projekten
- `src/components/ReferenceProjectCard.tsx`: Lägg till `onError` fallback på bilder

### Viktigt att veta
**Originalbilderna går inte att återskapa** — de togs bort från repot och finns inte i Supabase storage. Nya bilder måste laddas upp via admin-panelen för dessa två projekt.

