# Fix Niche Landing Pages: Trust Badge Duplicates, Titles, Descriptions & Grammar

## Problems Identified

1. **Duplicate trust badges**: The hero section shows pills (30% ROT, F-skatt, Försäkrade, Fast pris) AND the USP section below repeats nearly identical content ("30% ROT-avdrag på arbetet", "Erfarna snickare med F-skatt", "Fast pris – inga dolda kostnader"). The USP section below the hero must be removed entirely.
2. **Weak H1 titles**: "Nytt kök" is just the noun. Should be action-oriented: "Installera Nytt Kök" — more compelling and matches search intent.
3. **Broken grammar in related services heading**: Code does `Våra ${title.toLowerCase()}tjänster` which produces "Våra nytt köktjänster" — broken Swedish. Same for subtitle "Se våra relaterade tjänster inom nytt kök".
4. **Generic meta description**: Template produces "Professionell nytt kök med ROT-avdrag..." which reads poorly in Google results. Needs to be more like Clas Fixare's approach — direct, benefit-focused, natural language.
5. **SEO title format**: Currently `Nytt kök – Professionell tjänst | Fixco` — should be more keyword-rich and compelling.

---

## Plan

### 1. Remove USP section from `NicheServiceLandingPage.tsx`

Delete the entire USP grid section (lines 191-210) that duplicates the hero trust badges.

### 2. Add `heroTitle` / `heroTitleEn` field to `NicheServiceMeta`

Add optional action-oriented title fields. The existing `title` stays as the service name (used in URLs, breadcrumbs). The new field provides the H1 text.

For the **9 hand-crafted niche services** in `nicheServiceData.ts`, add explicit heroTitles:

- "Köksrenovering" → "Renovera Ditt Kök"
- "Badrumsrenovering" → "Renovera Ditt Badrum"  
- "Nytt kök" (via expanded) → stays as template  
Ta inte bort dom nuvarande Sidorna som redan finns, men skapa bara nya ytterligare sidor med dom nya bättre söktermerna, så att vi verkligen maximerar chanser att synas oavsett vad folk söker på, DOCK uppdatera meta titel och beskrvning, och lite mer info under hero på alla lokala sidor, och alla nisch sidor osv, med passande säljande beskrivning, du fattar.

For **expanded auto-generated services** in `nicheServiceDataExpanded.ts`, add a category-level `HERO_TITLE_TEMPLATE` that generates action-oriented titles:

- snickeri: `(name) => "Boka ${name}"` → "Boka Nytt Kök"
- el: `(name) => "Boka ${name}"` → "Boka Elinstallation"
- etc.

### 3. Improve meta title & description templates

**Meta title**: `${heroTitle} – Fixco | ROT-avdrag & Garanti` instead of `${title} – Professionell tjänst | Fixco`

**Meta description templates** per category — more natural, benefit-focused, like Clas Fixare:

- snickeri: `"Fixcos erfarna hantverkare hjälper dig med ${name.toLowerCase()}. Fast pris, 30% ROT-avdrag och garanti. ★ 5/5 betyg. Begär gratis offert"`

### 4. Fix related services heading grammar

Replace the concatenation `Våra ${title.toLowerCase()}tjänster` with a smarter approach:

- Use `parentCategory` display name: "Våra köktjänster" (from a category label map)
- Subtitle: "Relaterade tjänster" instead of broken grammar

### 5. Update `NicheServiceLandingPage.tsx` to use new fields

- H1 uses `heroTitle` (falls back to `title`)
- Helmet uses new meta title/description
- Related services section uses category display name

---

## Technical Details

### Files to modify:

1. `**src/data/nicheServiceData.ts**` — Add `heroTitle`/`heroTitleEn` to interface and hand-crafted entries
2. `**src/data/nicheServiceDataExpanded.ts**` — Add hero title templates and improved meta description templates per category
3. `**src/pages/NicheServiceLandingPage.tsx**` — Remove USP section, use heroTitle for H1, fix related services heading, improve SEO tags

### Category display name map (for related services heading):

```typescript
const CATEGORY_DISPLAY: Record<string, { sv: string; en: string }> = {
  kok: { sv: 'Kök', en: 'Kitchen' },
  badrum: { sv: 'Badrum', en: 'Bathroom' },
  snickeri: { sv: 'Snickeri', en: 'Carpentry' },
  malning: { sv: 'Målning', en: 'Painting' },
  // etc.
};
```

Heading becomes: "Våra köktjänster" / "Relaterade tjänster inom kök"