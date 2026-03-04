

## Plan: Ta bort datum och projekttid från ProjectShowcase (startsidan)

### Ändringar i `src/components/ProjectShowcase.tsx`

1. **Ta bort duration-raden** (rad 230-233): Radera `Clock`-ikonen och `project.duration`
2. **Ta bort completion date-blocket** (rad 267-271): Radera `Calendar`-ikonen och färdigställt-datum
3. **Ta bort oanvända imports**: `Clock` och `Calendar` från lucide-react
4. **Uppdatera kommentaren** "Location and Duration" → "Location"

