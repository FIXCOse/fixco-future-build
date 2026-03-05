

## Plan: Rensa upp SEO-sektionerna i botten av lokala sidor

### Problem
Botten av lokala tjänstesidor (LocalServicePage) och områdessidor har flera gråtonade sektioner med "Snabbfakta", "Visste du detta om...", "Relaterade sökningar", "Akuta tjänster", och dubbla områdeslänkar (NearbyAreasSection + ExpandableAreaLinks + nearbyAreas-text-links). Det ser spammigt och oorganiserat ut.

### Lösning
Konsolidera och rensa upp genom att:

1. **Slå ihop Quick Facts + Fun Facts** till en enda snygg sektion med ikon + kort-layout istället för gråtonade rutor med `text-muted-foreground/60`-text. Ge dem `bg-card border border-border rounded-xl` styling.

2. **Ta bort duplicerade områdeslänkar** — behåll bara `NearbyAreasSection` (som redan sitter högt upp, efter How-To). Ta bort de separata text-länkarna (`nearbyAreas`-sektionen rad 846-866) som bara listar tjänstenamn+ort utan styling.

3. **Rensa ExpandableAreaLinks** — ge den bättre visuell struktur: tydligare rubrik, bättre kontrast på länkarna (inte `bg-muted/50` + `text-foreground/70`), ta bort `bg-muted/30`-bakgrunden.

4. **Relaterade sökningar + Akuta tjänster** — slå ihop till en diskret "Relaterat"-sektion med bättre styling istället för separata `border-t` sektioner med `text-zinc-600`.

### Filer som ändras

| Fil | Ändring |
|-----|---------|
| `src/pages/LocalServicePage.tsx` | Rensa sektionerna rad 775-916: slå ihop facts, ta bort dubbla area-links, städa related searches |
| `src/components/local-service/ExpandableAreaLinks.tsx` | Ta bort grå bakgrund, ge länkarna bättre kontrast och styling |
| `src/components/local-service/NearbyAreasSection.tsx` | Mindre justering av bakgrund (ta bort `bg-muted/30`) |
| `src/pages/locations/ServiceCityDetail.tsx` | Samma typ av cleanup: Quick Facts + Did You Know → en sektion, bättre styling |

### Designprincip
- Inga `bg-muted/20` eller `bg-muted/30` fyllda bakgrunder på hela sektioner
- Allt innehåll i tydliga kort (`bg-card border border-border rounded-xl`)
- Länkchips med hover-effekt istället för grå text
- Max en områdesnavigering (NearbyAreasSection högt upp + ExpandableAreaLinks längst ned)

