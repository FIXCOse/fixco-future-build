

## Byt till vitt tema som standard + fixa ljustema-buggar

### Vad som behöver ändras

Hemsidan är byggd "dark-first" -- många bakgrunder, gradienter och textfärger är hårdkodade för mörkt tema. Att bara byta default till `light` (som du sett) ger konstiga resultat. Här är allt som behöver fixas:

---

### 1. Ändra default-tema till `light`

**Fil:** `src/theme/useTheme.ts`

- Ändra `theme: 'dark'` till `theme: 'light'` (rad 13)
- Ändra fallback på rad 40 från `'dark'` till `'light'`

---

### 2. Fixa `hero-background` CSS-klassen

**Fil:** `src/index.css`

Nuvarande `.hero-background` använder hårdkodade mörka värden (`hsl(240 8% 10%)`). På ljust tema ser det svart ut.

Lösning: Byt till tema-medvetna variabler så att hero-background automatiskt anpassas:

```text
Dark: radial-gradient med subtila mörka nyanser (som nu)
Light: radial-gradient med subtila ljusa nyanser (grå/vit)
```

Lägg till en `[data-theme="light"] .hero-background`-override, eller gör den befintliga klassen dynamisk via CSS-variabler.

---

### 3. Förbättra `gradient-text` kontrast på ljust tema

**Fil:** `src/index.css`

Rainbow-gradienten (`hsl(262, 83%, 58%)`, `hsl(200, 100%, 50%)`, `hsl(320, 100%, 65%)`) är designad för mörk bakgrund. På vit bakgrund blir den ljusblåa delen nästan osynlig.

Lösning: Lägg till `[data-theme="light"] .gradient-text` med mörkare gradient-färger (lägre lightness-värden) för bättre kontrast mot vit bakgrund.

---

### 4. Fixa ComparisonUltra för ljust tema

**Fil:** `src/components/ComparisonUltra.tsx`

- Bakgrundseffekterna (`hsl(280 100% 60% / 0.08)`) fungerar på mörkt men syns knappt/ser konstiga ut på ljust
- `FixcoFIcon` watermarks med `opacity-20` + `animate-pulse` ser stökiga ut på ljust tema -- ta bort dem (redan identifierat som problem i tidigare plan)
- `card-premium` och `bg-primary/5` behöver ses över

---

### 5. Fixa `shadow-card` och kort-styling för ljust tema

**Fil:** `src/index.css`

Lägg till starkare skuggor för ljust tema så att kort inte "försvinner" mot vit bakgrund:

```text
[data-theme="light"] .shadow-card {
  box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04);
}

[data-theme="light"] .card-premium {
  border-color: hsl(220 14% 88%);
}
```

---

### 6. Fixa undersidornas hero-sektioner

**Filer:** `Services.tsx`, `Contact.tsx`, `FAQ.tsx`, `AboutUs.tsx`, `ROTInfo.tsx`, `RUT.tsx`, `BookVisit.tsx`, `Referenser.tsx`

Alla använder `hero-background`-klassen. Om CSS-fixen i steg 2 fungerar korrekt bör dessa automatiskt se bra ut. Men sektioner som har extra `opacity-50`/`opacity-30` på hero-background-diven kan behöva justeras för ljust tema.

---

### 7. Fixa Navigation/Navbar bakgrund för ljust tema

**Fil:** `src/components/Navigation.tsx`

Kontrollera att navbar-bakgrunden (troligtvis `bg-background/80 backdrop-blur`) ser bra ut på ljust tema. Kan behöva starkare `border-b` eller subtil skugga.

---

### Sammanfattning av filer

| Fil | Ändring |
|-----|---------|
| `src/theme/useTheme.ts` | Default tema -> `light` |
| `src/index.css` | Hero-background, gradient-text, shadow-card, card-premium -- ljustema-overrides |
| `src/components/ComparisonUltra.tsx` | Ta bort FixcoFIcon watermarks, justera bakgrundseffekter |
| Eventuellt: Navigation.tsx, undersidor | Mindre justeringar om CSS-fixarna inte räcker |

### Vad som INTE ändras
- Alla tre teman (dark, light, ocean) finns kvar -- användaren kan byta
- All funktionalitet, data, SEO behålls
- Tema-switcher i navbar behålls

