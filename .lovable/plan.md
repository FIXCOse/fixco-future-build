

## Redesign av /rut-sidan — matcha ROT-sidans moderna design

### Nuvarande problem
RUT-sidan (`src/pages/RUT.tsx`) har den gamla designen: gradient-text, card-premium, statiska listor, ingen framer-motion, och CTA-knappar som navigerar till `/boka-hembesok` istället för att öppna popup-modalen.

### Ändringar

**1. Hero** — Samma mönster som ROT: animerad `30%`-counter, en CTA-knapp med `openBooking()`, ta bort telefon-knappen och gradient-text.

**2. Ta bort "Vad är RUT"-sektionen** — Onödig textmassa som inte finns på ROT-sidan. Informationen framgår av hero + kalkylator.

**3. Process-timeline** — Ersätt den colorful gradient-circle-designen med ROT-sidans cleana cirkel+nummer+linje-layout med framer-motion.

**4. Kalkylator — Flytta upp** — Direkt efter process-sektionen (som på ROT). Uppdatera `RUTCalculator.tsx`: ta bort "Populära RUT-tjänster"-exemplen och "Börja idag"-CTA-kortet. Lägg till `onClick` på "Begär offert"-knappen som öppnar modalen.

**5. Prisexempel** — Konvertera till numeriska värden med before/after-bars och `AnimatedCounter` (som ROT).

**6. Kvalificerar-sektionen** — Använd `QualifiesCard`-komponenten (extrahera från ROTInfo eller duplicera) med ikoner, collapsible lists, gradient-borders.

**7. Alla CTA-knappar** — `onClick={openBooking}` istället för `<Link to={bookingPath}>`.

### Filer att ändra

| Fil | Ändring |
|---|---|
| `src/pages/RUT.tsx` | Fullständig redesign: framer-motion, AnimatedCounter, QualifiesCard, modal-CTAs |
| `src/components/RUTCalculator.tsx` | Ta bort examples+bottom CTA, lägg onClick på knappen, modernare styling |

### Tekniska detaljer
- Importera `useBookHomeVisitModal`, `motion`, `useInView`, `AnimatePresence`, `containerVariants`, `itemVariants`, `viewportConfig`
- RUT-specifika ikoner för kvalificerar: `Sparkles` (städ), `Droplets` (fönsterputs), `Shirt` (tvätt), etc.
- Prisexempel: konvertera strängar till nummer för AnimatedCounter
- Behåll alla `t()` och `isEnglish`-logik

