

## Översätt tjänstekategorier i bokningsmodalen

### Problem
Kategorinamn och beskrivningar (Elmontör, VVS, Snickare etc.) visas alltid på svenska i modalen eftersom de kommer direkt från `serviceCategories` i `servicesDataNew.ts` — ett statiskt array utan språkstöd.

### Lösning
Lägg till engelska översättningar i `modalTranslations` och mappa `category.id` till rätt språk vid rendering.

### Ändringar i `src/features/requests/ServiceRequestModal.tsx`

**1. Utöka `modalTranslations` med kategori-översättningar**

Lägg till nya nycklar i EN-dictionaryt (SV behåller originalvärdena från data):

| id | SV title | EN title | SV desc | EN desc |
|---|---|---|---|---|
| el | Elmontör | Electrician | Installation, reparation och underhåll | Installation, repair and maintenance |
| vvs | VVS | Plumbing | Rör, kranar, toaletter och duschvägg | Pipes, faucets, toilets and shower screens |
| snickeri | Snickare | Carpenter | Kök, garderober och inredning | Kitchens, wardrobes and interiors |
| malare | Målare | Painter | Professionell målning in- och utvändigt | Professional painting indoors and outdoors |
| montering | Montering | Assembly | Möbler, hyllor och apparater | Furniture, shelves and appliances |
| tradgard | Trädgård | Garden | Gräs, häckar och trädvård | Grass, hedges and tree care |
| stadning | Städning | Cleaning | Hem, flytt och byggstäd | Home, moving and construction cleaning |
| markarbeten | Markarbeten | Groundwork | Schakt, dränering och plattläggning | Excavation, drainage and paving |
| tekniska-installationer | Tekniska installationer | Technical installations | Nätverk, larm och IT-support | Networks, alarms and IT support |
| flytt | Flytt | Moving | Bärhjälp, packning och transport | Carrying, packing and transport |
| rivning | Rivning | Demolition | Badrum, kök, väggar & bortforsling | Bathrooms, kitchens, walls & removal |

**2. Skapa en helper-funktion för att hämta översatt titel/beskrivning**

```tsx
const getCategoryTitle = (category: typeof serviceCategories[0]) => 
  ml[`cat_${category.id}_title`] || category.title;
const getCategoryDesc = (category: typeof serviceCategories[0]) => 
  ml[`cat_${category.id}_desc`] || category.description;
```

**3. Uppdatera rendering (~rad 628-631)**

Byt `category.title` → `getCategoryTitle(category)` och `category.description` → `getCategoryDesc(category)`.

**4. Översätt fält-labels i fallback-config (~rad 1252-1266)**

Byt hårdkodade "Beskriv ditt projekt" och "Bilder (valfritt)" till `ml.describeProject` / `ml.imagesOptional` (lägg till dessa nycklar).

### Fil att ändra
| Fil | Åtgärd |
|---|---|
| `src/features/requests/ServiceRequestModal.tsx` | Utöka translations, mappa kategori-strängar via `ml` |

