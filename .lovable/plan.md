

## Fix: Nya bloggartiklar syns inte — imports placerade fel

### Problem
I `src/data/blogData.ts` ligger `import`-satserna för de nya bloggposterna (rad 6871–6872) **efter** arrayen, mitt i filen. JavaScript kräver att alla `import` ligger högst upp i filen. Resultatet: de 40 nya artiklarna (ID 41–80) laddas aldrig in.

### Lösning

**Fil: `src/data/blogData.ts`**

1. **Flytta imports till toppen** (rad 1–5): Lägg till:
   ```typescript
   import { newBlogPosts2026 } from './blogDataNew2026';
   import { newBlogPosts2026Part2 } from './blogDataNew2026Part2';
   ```

2. **Ta bort felplacerade rader** (rad 6870–6874): Ta bort import + push-raderna som ligger efter arrayen.

3. **Pusha nya poster efter array-deklarationen** (rad 6868, efter `];`):
   ```typescript
   blogPosts.push(...newBlogPosts2026);
   blogPosts.push(...newBlogPosts2026Part2);
   ```

Totalt: 1 fil, ~5 rader ändrade. Alla 80 artiklar kommer synas direkt.

