

## Plan: Ta bort "Projekt 2024"-statistiken från ProjectShowcase

### Ändring
Ta bort den första statistik-posten ("3 Projekt 2024") från stats-raden i `ProjectShowcase.tsx`. Behåll "100% Nöjda kunder" och "48h Svarstid".

### Fil
- **`src/components/ProjectShowcase.tsx`** (rad 296-299): Ta bort `<div className="text-center">` med `projects.length` och `projects.stats.year`.

