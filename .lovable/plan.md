

# Fix: Tillbaka-knappen i ServiceRequestModal kraschar/fryser modalen

## Problem
Två buggar i back-navigeringen:

1. **Steg 2 (tidsval) i quote-mode saknar back-hantering helt.** Koden hanterar bara `currentStep === 2` för `mode === 'home_visit'`. I quote-mode gör "Tillbaka" ingenting.

2. **Steg 3 → Steg 1 utan addons renderar tom modal.** När man går tillbaka från steg 3 sätts `skipAddonsStep = true` och `currentStep = 1`. Men steg 1:s innehåll kräver `addons.length > 0` (rad 725), så inget renderas — modalen ser "kraschad" ut.

## Lösning

### `src/features/requests/ServiceRequestModal.tsx` — Back-knappens onClick (rad ~1236-1265)

Fixa navigeringslogiken:

**Steg 2 (quote-mode):** Lägg till back-hantering — gå till steg 1 om addons finns, annars till steg 0 (eller stäng om ingen kategori-vy).

**Steg 3 (quote-mode):** Gå till steg 2 istället för steg 1, eftersom steg 2 (tidsval) nu alltid visas.

Uppdaterad logik:
```
currentStep === 3:
  → goToStep2()  (alltid, oavsett mode)

currentStep === 2:
  → om addons.length > 0: setSkipAddonsStep(true), goToStep1()
  → om showCategories: goToStep0()
  → annars: setOpen(false)

currentStep === 1:
  → om showCategories: goToStep0()
  → annars: setOpen(false)
```

Detta säkerställer att man alltid kan navigera bakåt utan att hamna i ett tomt steg.

