

## Problem: "Spara ändringar"-knappen fungerar inte i ProjectEditModal

### Orsak
`DialogContent`-komponenten har default `p-6` padding (från `dialog.tsx`), men `ProjectEditModal` lagger till *ytterligare* `px-6` padding pa header, scroll-area och footer. Denna dubbla padding gor att footern med knappen hamnar for nara kanten av dialogen. Nar du klickar pa knappen registreras klicket som ett klick pa overlays (bakgrunden) istallet, vilket stanger modalen utan att spara.

Dessutom: varje gang modalen stangs forlorar du uppladdade bilder eftersom `formData` aterstalls.

### Plan

**1. Fixa DialogContent-padding i ProjectEditModal**
- Lagg till `p-0` pa `DialogContent` for att ta bort default-padding
- Behall de inre `px-6`-paddingarna som redan finns pa header, scroll-area och footer
- Detta gor att footern hamnar korrekt inuti dialogens klickbara omrade

**2. Stoppa click-propagation pa footer-knapparna**
- Lagg till `onPointerDownOutside={(e) => e.preventDefault()}` pa `DialogContent` for att forhindra att klick nara kanten stangar modalen
- Detta ar en kand Radix UI-issue med stora modaler

### Filer som andras
- `src/components/admin/ProjectEditModal.tsx` — Fixa padding och click-handling

