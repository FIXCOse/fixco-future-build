

## Plan: Ta bort utförandedatum och projekttid från referensprojektkort

### Ändringar

**1. `src/components/ReferenceProjectCard.tsx`**
- Ta bort `completion_date`-variabeln (`formattedDate`) och dess rendering (rad 60-64, 136-141)
- Ta bort `Calendar`-importen
- Ta bort `format`, `sv`, `enUS` imports (om ej använda på annat håll)
- Behåll plats/location-raden men utan datum-delen

**2. `src/components/admin/ProjectDetailModal.tsx`**
- Ta bort "Projekttid"-kortet (rad 246-256) som visar `project.duration`
- Ta bort `Clock`-importen
- Ändra grid från `lg:grid-cols-3` till `lg:grid-cols-2` (bara Plats + Klient kvar)

Inga databasändringar — fälten finns kvar men visas inte för besökare.

