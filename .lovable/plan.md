

## Redesign av /rot-sidan -- Modernare, cleanare & mer interaktiv

### Nuvarande problem
Sidan har ett generiskt utseende med repetitiva kort, stora textblock utan visuell variation, och kalkylatorn känns inklämd längst ned. Layouten är "busy" med för många liknande sektioner.

### Ny struktur & design

**1. Hero -- Minimalistisk med animerad besparing**
- Renare hero utan gradient-text-overload
- Stor animerad siffra som räknar upp till "30%" med framer-motion `useInView` + `animate`
- Subtitel + en enda stark CTA-knapp
- Bort med telefon-knappen (den finns i navbaren)

**2. "Så fungerar det" -- 3-stegs horisontell timeline**
- Ersätt nuvarande process-sektion med en cleaner variant
- Numrerade cirklar med tunn connecting line (CSS, ej absolut-positionerad)
- Kortare texter, ikoner utan overlay-hack
- Fade-in med `useInView` per steg

**3. Kalkylator -- Flytta upp & gör till sidans hjärta**
- Flytta ROTCalculator direkt efter "Så fungerar det"
- Uppdatera kalkylatorn: modernare slider med thumb-styling, glassmorphism-kort för resultat
- Ta bort "Populära projekt"-exemplen under kalkylatorn (de duplicerar examples-sektionen)
- Ta bort "Börja idag"-CTA-kortet längst ned i kalkylatorn

**4. Prisexempel -- Visuella jämförelsekort**
- Behåll 3 exempel men med ny design: horisontella "before/after"-bars istället för textlista
- Animerad savings-siffra per kort
- Grön accent för besparingen

**5. Vad berättigar -- Modernare två-kolumns-layout**
- Istället för listor i card-premium: använd ikoner med grön check / röd X i en kompaktare grid
- Collapsible/accordion om listan är lång (visa 4 + "Visa fler")

**6. Avslutande CTA-sektion**
- En ren, fullbredd CTA-banner med gradient bakgrund
- En knapp: "Boka hembesök"

### Filer att ändra

| Fil | Ändring |
|---|---|
| `src/pages/ROTInfo.tsx` | Fullständig redesign av alla sektioner |
| `src/components/ROTCalculator.tsx` | Modernare styling, ta bort "Populära projekt" och bottom-CTA |

### Tekniska detaljer
- Framer-motion `motion.div` + `useInView` för scroll-animationer
- Behåll alla `t()` och `isEnglish`-logik oförändrad
- Behåll Helmet/SEO oförändrat
- Inga nya dependencies behövs (framer-motion redan installerat)

