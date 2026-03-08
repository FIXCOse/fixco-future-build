

## Ta bort "Slutförda projekt"-statistiken

Ta bort det första stat-kortet (rad 172–179) som visar `{projects.length}+` och ändra gridet från `md:grid-cols-4` till `md:grid-cols-3`.

### Ändring i `src/pages/Referenser.tsx`
- **Rad 171**: Byt `grid md:grid-cols-4` → `grid md:grid-cols-3`
- **Rad 172–179**: Ta bort hela `<div>` med `{projects.length}+` och `stat-projects-label`

