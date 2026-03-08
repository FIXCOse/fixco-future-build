

## Redesign: ServiceDetail — titel & sub-kategori filter

### 1. Ändra "Snickeri" → "Snickare" (och övriga titlar)

Titeln på sidan kommer från `servicesDataNew` via `service.title` (fallback). Ändra titlarna i `servicesDataNew` array i `src/data/servicesDataNew.ts` för de kategorier som ska använda person/agent-namngivning:

| Nuvarande | Ny titel |
|---|---|
| `Snickeri` | `Snickare` |
| `El` | `Elmontör` |

Övriga (`VVS`, `Målare`, `Montering`, etc.) har redan rätt namn eller passar bättre som de är. Samma ändring i `serviceCategories` och `mainServices` arrayerna.

**Fil:** `src/data/servicesDataNew.ts` — uppdatera `title` på `snickeri`-poster i alla tre arrays (`mainServices`, `serviceCategories`, `servicesDataNew`).

### 2. Lägg till sub-kategori filterchips

Lägga till filtrerande tag-chips (som i screenshot 2: "Akustik", "Allmänt", "Altan", etc.) baserade på `sub_category`-fältet från databasen. Endast de sub-kategorier som finns bland den aktuella tjänstens undertjänster visas.

**Ändringar i `src/pages/ServiceDetail.tsx`:**

- Lägg till state: `const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);`
- Beräkna unika sub-kategorier från `filteredSubServices`:
  ```tsx
  const subCategories = useMemo(() => {
    const cats = filteredSubServices
      .map(s => s.sub_category)
      .filter(Boolean);
    return [...new Set(cats)].sort();
  }, [filteredSubServices]);
  ```
- Rendera filterchips mellan SegmentedPriceToggle och grid:
  ```tsx
  {subCategories.length > 1 && (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      <button onClick={() => setSelectedSubCategory(null)}
        className={cn("px-4 py-1.5 rounded-full border text-sm transition-all",
          !selectedSubCategory ? "bg-primary text-white border-primary" : "border-border hover:border-primary/50"
        )}>
        Alla
      </button>
      {subCategories.map(cat => (
        <button key={cat} onClick={() => setSelectedSubCategory(cat)}
          className={cn("px-4 py-1.5 rounded-full border text-sm transition-all",
            selectedSubCategory === cat ? "bg-primary text-white border-primary" : "border-border hover:border-primary/50"
          )}>
          {cat}
        </button>
      ))}
    </div>
  )}
  ```
- Filtrera `paginatedSubServices` genom att lägga till sub-category filter:
  ```tsx
  const displayServices = selectedSubCategory
    ? filteredSubServices.filter(s => s.sub_category === selectedSubCategory)
    : filteredSubServices;
  ```
  Uppdatera pagination och grid att använda `displayServices` istället.

- Reset `selectedSubCategory` och `currentPage` när slug ändras.

### Filer att ändra
| Fil | Åtgärd |
|---|---|
| `src/data/servicesDataNew.ts` | Ändra "Snickeri" → "Snickare" i 3 arrays |
| `src/pages/ServiceDetail.tsx` | Lägg till sub-kategori filter state, chips och filtrering |

