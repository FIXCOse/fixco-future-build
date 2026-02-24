

## Fix: FloatingSettingsWidget med Portal (som NavbarPortal och StickyPhoneButton)

### Problemet
Widgeten ligger utanfor `#smooth-content` men fortfarande **inuti** `#smooth-wrapper`, som har `overflow: hidden`. Det klipps bort visuellt. `NavbarPortal` och `StickyPhoneButton` fungerar for att de anvander `ReactDOM.createPortal` for att rendera direkt till `document.body` -- helt utanfor GSAP:s DOM-trad.

### Losning
Uppdatera `FloatingSettingsWidget` att anvanda `ReactDOM.createPortal` -- samma monster som `StickyPhoneButton`.

### Tekniska detaljer

**Fil:** `src/components/FloatingSettingsWidget.tsx`

Andra komponenten till:
1. Anvanda `useState` + `useEffect` for att vanta pa mount (SSR-safe)
2. Wrappa hela innehallet i `ReactDOM.createPortal(..., document.body)`
3. Behalla all befintlig styling (`fixed bottom-4 left-4 z-40 ...`)

Monstret ar identiskt med hur `StickyPhoneButton` redan fungerar (rad 7-24 i den filen).

**Inga andra filer behover andras** -- placeringen i `App.tsx` ar redan korrekt.

