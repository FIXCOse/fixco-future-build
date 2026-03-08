

## Fix: Rätt tjänstekoppling för nisch-sidor

### Problem
`parentCategory` i `nicheServiceData.ts` pekar på breda kategorier (`snickeri`, `vvs`, `montering`) istället för de specifika databaskategorierna. T.ex. köksrenovering mappar till `snickeri` och visar snickeri-tjänster istället för kökstjänster.

### Mappning som behöver ändras

| Nisch | Nuvarande `parentCategory` | Korrekt värde |
|---|---|---|
| koksrenovering | `snickeri` | `kok` |
| badrumsrenovering | `vvs` | `badrum` |
| altanbygge | `snickeri` | `snickeri` (korrekt) |
| golvlaggning | `golv` | `golv` (korrekt) |
| fasadmalning | `malning` | `malning` (korrekt) |
| inomhusmalning | `malning` | `malning` (korrekt) |
| elinstallation | `el` | `el` (korrekt) |
| koksmontering | `montering` | `kok` |
| mobelmontering | `montering` | `montering` (korrekt) |

### Ändring
En rad per nisch i `src/data/nicheServiceData.ts`:
- **koksrenovering**: `parentCategory: 'snickeri'` → `'kok'`
- **badrumsrenovering**: `parentCategory: 'vvs'` → `'badrum'`
- **koksmontering**: `parentCategory: 'montering'` → `'kok'`

3 rader ändras i en fil.

