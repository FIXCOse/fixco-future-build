

## Plan: Rensa upp botten-sektionerna till ett professionellt utseende

### Problem
Botten av lokala tjänstesidor har för många separata sektioner med liknande visuell vikt som skapar ett "spammigt" intryck: Vanliga projekt-grid, Om-text med tips, Quick Facts-grid, Fun Facts-grid, Relaterade sökningar-chips, och ExpandableAreaLinks. Det är för mycket "småkort" och grids som ser ut som SEO-fyllnad.

### Lösning
Konsolidera alla SEO-sektioner till **en enda sammanhållen sektion** med en diskret, professionell design. Flytta fokus från många separata grids till en strukturerad, minimalistisk layout.

### Ändringar

**`src/pages/LocalServicePage.tsx` (rad 741-865)**

1. **Ta bort** "Vanliga projekt"-gridden (rad 741-773) helt — innehållet är redundant med popularSearches som redan visas i relatedSearches.

2. **Slå ihop** "Om tjänst i ort" + "Facts & Lokalt" + "Relaterat" till **en sektion** med rubriken typ "Om {tjänst} i {ort}". Sektionen får:
   - Om-texten (uniqueIntro) som löpande text
   - Local Tip i ett diskret kort under texten
   - Quick Facts som en enkel kommaseparerad eller punktlista (inte grid-kort)
   - Fun Facts som en kort lista med ikoner (inte separata kort)
   - Relaterade sökningar som diskreta textlänkar (inte chips)

3. **ExpandableAreaLinks** behålls men läggs sist som enda navigationssektion.

**`src/components/local-service/ExpandableAreaLinks.tsx`**
- Ingen ändring behövs, ser redan bra ut.

**`src/components/local-service/NearbyAreasSection.tsx`**
- Ingen ändring behövs.

### Designprincip
- En sammanhållen sektion istället för 5 separata
- Textbaserat innehåll istället för grid-kort för facts
- Renare visuell hierarki — mindre "boxy"

### Filer
| Fil | Ändring |
|-----|---------|
| `src/pages/LocalServicePage.tsx` | Ta bort "Vanliga projekt"-sektion, slå ihop Om/Facts/Relaterat till en sektion |

