

## Flytta tema- och språkväxlare till en flytande widget

### Problem
Tema- och språkväxlarna sitter inbäddade i navbaren bland många andra knappar. De är svåra att hitta, speciellt på mobil där de göms i hamburgermenyn.

### Lösning
Skapa en liten flytande widget i nedre vänstra hörnet (bottom-left) som alltid är synlig oavsett scroll-position. Widgeten visar två kompakta knappar: en glob-ikon för språk (SV/EN) och en tema-ikon (sol/måne/våg).

### Design
- Fast position i nedre vänstra hörnet (`fixed bottom-4 left-4`)
- Kompakt pill-formad container med `bg-card border border-border shadow-lg rounded-full`
- Två små knappar sida vid sida: glob + tema-ikon
- Diskret men alltid tillgänglig
- `z-40` så den inte krockar med andra flytande element
- Dold på worker-layout (har egen nav)

### Tekniska detaljer

| Fil | Ändring |
|-----|---------|
| `src/components/FloatingSettingsWidget.tsx` | **Ny fil** -- flytande widget med LanguageSwitcher och ThemeSwitcher |
| `src/components/layouts/AppLayout.tsx` | Lägg till `FloatingSettingsWidget` |
| `src/components/Navigation.tsx` | Ta bort LanguageSwitcher och ThemeSwitcher från desktop-navbaren (rad 230-234) och mobil-menyn (rad 431-435) |

### Vad som INTE ändras
- LanguageSwitcher och ThemeSwitcher komponenterna själva -- de återanvänds i den nya widgeten
- All funktionalitet (språkbyte, temaval) behålls identiskt
- Worker-layout påverkas inte

