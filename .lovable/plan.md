

## Fix: Flytta FloatingSettingsWidget utanfor ScrollSmoother

### Problem
`FloatingSettingsWidget` renderas inuti `AppLayout`, som ligger inuti `#smooth-content`. GSAP ScrollSmoother applicerar en CSS `transform` pa `#smooth-content`, vilket bryter `position: fixed` -- elementet scrollar med sidan istallet for att stanna kvar pa skarmen.

Samma problem har redan loests for `NavbarPortal` och `StickyPhoneButton` -- de renderas **utanfor** `#smooth-content` i `App.tsx`.

### Losning
Flytta `FloatingSettingsWidget` fran `AppLayout.tsx` till `App.tsx`, placerad utanfor `#smooth-content` bredvid `NavbarPortal` och `StickyPhoneButton`.

### Tekniska detaljer

| Fil | Andring |
|-----|---------|
| `src/components/layouts/AppLayout.tsx` | Ta bort `<FloatingSettingsWidget />` och dess import |
| `src/App.tsx` | Lagg till `<FloatingSettingsWidget />` utanfor `#smooth-content`, bredvid `StickyPhoneButton` (rad ~462) |

### Varfor detta fungerar
- Utanfor `#smooth-content` paverkas inte elementet av ScrollSmothers `transform`
- `position: fixed` fungerar korrekt igen
- Samma monster som redan anvands for `NavbarPortal` och `StickyPhoneButton`

