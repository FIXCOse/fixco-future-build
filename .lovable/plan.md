

## Fix: Översätt sub-category filter-chips till engelska

### Problem
Filter-chips (rad 350 i `ServiceDetail.tsx`) renderar `{cat}` direkt från databasens `sub_category`-fält, som alltid är på svenska.

### Lösning
Lägg till en `subCategoryTranslations`-map i `ServiceDetail.tsx` och använd den vid rendering när `isEnglish === true`.

### Ändringar i `src/pages/ServiceDetail.tsx`

**1. Lägg till översättningsmap (~efter rad 31)**

```tsx
const subCategoryTranslations: Record<string, string> = {
  'Akustik': 'Acoustics', 'Allmänt': 'General', 'Altan': 'Deck',
  'Anläggning': 'Landscaping', 'AV': 'AV', 'Avlopp': 'Drainage',
  'Bänkskiva': 'Countertop', 'Beläggning': 'Paving', 'Belysning': 'Lighting',
  'Blandare': 'Faucets', 'Dörrar': 'Doors', 'Dörrlås': 'Door Locks',
  'Dränering': 'Drainage', 'Dusch': 'Shower', 'Elektronik': 'Electronics',
  'Fasad': 'Facade', 'Finish': 'Finish', 'Fönster': 'Windows',
  'Förvaring': 'Storage', 'Grävning': 'Excavation', 'Hemstäd': 'Home Cleaning',
  'Innerväggar': 'Interior Walls', 'Inredning': 'Interior', 'Installationer': 'Installations',
  'Isolering': 'Insulation', 'IT': 'IT', 'Kakel': 'Tiles',
  'Klinker': 'Clinker', 'Kök': 'Kitchen', 'Laminat/Vinyl': 'Laminate/Vinyl',
  'Målning': 'Painting', 'Matta': 'Carpet', 'Möbler': 'Furniture',
  'Montering': 'Assembly', 'Murning': 'Masonry', 'Packning': 'Packing',
  'Parkett': 'Parquet', 'Renovering': 'Renovation', 'Säkerhet': 'Security',
  'Sanitetsarbeten': 'Sanitary Work', 'Service': 'Service', 'Skötsel': 'Maintenance',
  'Specialstäd': 'Special Cleaning', 'Större projekt': 'Larger Projects',
  'Strömbrytare': 'Switches', 'Tak': 'Roof', 'Takläggning': 'Roofing',
  'Tapetsering': 'Wallpapering', 'Totalrenovering': 'Full Renovation',
  'Transport': 'Transport', 'Underhåll': 'Maintenance', 'Utebelysning': 'Outdoor Lighting',
  'Utomhus': 'Outdoor', 'Uttag': 'Outlets', 'Värme': 'Heating',
  'Vinterservice': 'Winter Service', 'Vitvaror': 'Appliances',
};
```

**2. Uppdatera chip-rendering (rad 350)**

Byt `{cat}` till `{isEnglish ? (subCategoryTranslations[cat] || cat) : cat}`.

### Fil att ändra
| Fil | Åtgärd |
|---|---|
| `src/pages/ServiceDetail.tsx` | Lägg till map + uppdatera chip-rendering |

