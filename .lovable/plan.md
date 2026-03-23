

# Plan: Admin drag-and-drop sortering av referensprojekt

## Vad byggs
En sorteringsfunktion i admin/edit-läge på `/referenser`-sidan där admin kan dra och släppa projektkort för att ändra ordningen. Ordningen sparas direkt till databasen (`sort_order`-kolumnen).

## Teknisk approach

### 1. Skapa `SortableProjectGrid`-komponent
Ny komponent `src/components/admin/SortableProjectGrid.tsx` som:
- Använder `@dnd-kit/core` och `@dnd-kit/sortable` (redan installerat, används i `EditableReferenceGrid`)
- Wrappar `ReferenceProjectCard` i sortable containers med drag-handtag
- Visar ett informationsfält "Dra för att ändra ordning" i edit-läge

### 2. Uppdatera `Referenser.tsx`
- I edit-läge: rendera `SortableProjectGrid` istället för det vanliga gridet
- Vid drag-end: anropa `useUpdateReferenceProject` för att spara nya `sort_order`-värden till Supabase

### 3. Sparlogik
- Vid omordning: tilldela `sort_order = index` för varje projekt i den nya ordningen
- Batch-uppdatera alla ändrade projekts `sort_order` via separata mutationer
- Visa toast vid lyckad/misslyckad sparning

## Filer som ändras
| Fil | Ändring |
|---|---|
| `src/components/admin/SortableProjectGrid.tsx` | **Ny** — drag-and-drop grid med sortable kort |
| `src/pages/Referenser.tsx` | Importera och använd `SortableProjectGrid` i edit-läge |

