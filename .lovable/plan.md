

## Total redesign av /karriar-sidan

Problemet: Varje sektion ser exakt likadan ut — ikon i rund box, rubrik, beskrivning, kort med border. Monotont och tråkigt. Sidan behöver rytmskiften, visuell hierarki och personlighet.

### Struktur (ny ordning)

1. **Hero** — Asymmetrisk split-layout istället för centrerad text
   - Vänster: rubrik, beskrivning, CTA
   - Höger: 3x3 grid av profession-ikoner med staggered animation, varje ikon i en liten pill/chip med titel
   - Trust badges under CTA (behåll)
   - Ta bort stats från hero (flyttas till egen sektion nedan)

2. **Stats-banner** — Fullbredd horisontell rad med 4 stats, ingen bakgrund, bara en enkel `border-y` med siffrorna i en rad. Minimalistiskt, inte kort-baserat.

3. **WhyFixco** — Ny layout: 2 "hero-benefits" överst (stora kort, halv bredd, med ikon+rubrik+beskrivning+subtle illustration) + 6 kompakta rader under (ikon + text på en rad, ingen card — som en checklista med `CheckCircle`). Bryter monotonin.

4. **ProfessionGrid** — Horisontell scrollbar på mobil, grid på desktop. Varje kort får en "accent-stripe" överst (tunn färgad linje) och en `Badge` som säger "Vi söker aktivt" på 3-4 av yrkena. Korten visar alltid CTA-knappen (ta bort opacity-0 hover).

5. **CareerQuiz** — Ge sektionen en `bg-primary/5` bakgrund för visuell separation. Lägg till steg-indikatorer (5 små cirklar/dots under progress bar). Behåll logik.

6. **ApplicationForm** — Lägg till visuell stepper ovanför formuläret: 3 cirklar med nummer, förbundna med linjer, aktiv cirkel fylld med primary. Nuvarande logik behålls.

7. **FAQ + Contact** — Slå ihop CareersContact in i CareersFAQ-sektionen som en CTA-banner under accordionen istället för separat sektion. En enda rad: "Har du frågor? Ring oss på X eller maila Y" med ikoner inline.

### Filer att ändra

| Fil | Ändring |
|---|---|
| `src/pages/Careers.tsx` | Ta bort `<CareersContact />` som separat sektion |
| `src/components/careers/CareersHero.tsx` | Split-layout, ikon-grid höger sida, ta bort inline stats |
| `src/components/careers/CareersStats.tsx` | Minimalistisk horisontell rad med border-y |
| `src/components/careers/WhyFixco.tsx` | 2 hero-cards + 6 checkliste-rader |
| `src/components/careers/ProfessionGrid.tsx` | Accent-stripe, "Vi söker aktivt" badges, synlig CTA |
| `src/components/careers/CareerQuiz.tsx` | bg-primary/5 bakgrund, dot-indikatorer |
| `src/components/careers/ApplicationForm.tsx` | Visuell stepper med cirklar och linjer |
| `src/components/careers/CareersFAQ.tsx` | Integrera kontaktinfo som CTA-banner under FAQ |
| `src/components/careers/CareersContact.tsx` | Ta bort (integreras i FAQ) |

