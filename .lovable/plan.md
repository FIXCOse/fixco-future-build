

## Redesign: "Vad kvalificerar för ROT"-sektionen

Nuvarande design är två enkla vita kort med listor — det ser tråkigt och generiskt ut. Ny design ska vara visuellt distinkt och mer engagerande.

### Ny design-koncept: Interaktiv accordion med kategorier

Istället för två platta listor — en helt ny layout:

**Vänster kolumn (Kvalificerar ✅):**
- Grön/primary-tonad gradient-border på kortet
- Rubrik med en stor grön badge/pill istället för emoji
- Varje rad har en subtle hover-effekt och en liten ikon per kategori (Hammer för snickeri, Droplets för VVS, Zap för el, Paintbrush för målning, etc.)
- Visa bara 4 items initialt, "Visa alla" knapp som expanderar resten med animation

**Höger kolumn (Kvalificerar inte ❌):**
- Röd/destructive-tonad subtle border
- Samma mönster men med röda accenter och X-ikoner
- Dimmed/muted styling för att visuellt signalera "nej"

**Visuella detaljer:**
- Kort med `bg-gradient-to-br from-primary/5 to-transparent` (vänster) och `from-destructive/5` (höger)
- Thicker left border (4px) i primary/destructive färg
- Kategori-ikoner från lucide per rad
- Collapsible med framer-motion `AnimatePresence` för smooth expand
- Sektionsbakgrund: subtle muted/5 för kontrast mot övriga sektioner

### Fil att ändra
`src/pages/ROTInfo.tsx` rad 292–351 — hela kvalificerar-sektionen ersätts.

