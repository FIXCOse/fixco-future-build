

## Fasta landningssidor för nisch-tjänster

### Problem
9 nischade tjänster (köksrenovering, badrumsrenovering, altanbygge, golvläggning, fasadmålning, inomhusmålning, elinstallation, köksmontering, möbelmontering) har 540+ lokala SEO-sidor men saknar en generell landningssida på `/tjanster/{slug}`. Besöker man t.ex. `/tjanster/koksrenovering` idag visas "Tjänsten hittades inte".

### Vilka sidor skapas
| Slug | Titel | Kopplar till |
|---|---|---|
| koksrenovering | Köksrenovering | snickeri |
| badrumsrenovering | Badrumsrenovering | vvs |
| altanbygge | Altanbygge | snickeri |
| golvlaggning | Golvläggning | golv |
| fasadmalning | Fasadmålning | malning |
| inomhusmalning | Inomhusmålning | malning |
| elinstallation | Elinstallation | el |
| koksmontering | Köksmontering | montering |
| mobelmontering | Möbelmontering | montering |

### Lösning

**1. Ny komponent: `src/pages/NicheServiceLandingPage.tsx`**
- Hämtar data från `LOCAL_SERVICES` i `localServiceData.ts` (slug, namn, serviceKey, rotRut)
- Konverteringsfokuserad layout liknande `LocalServicePage` men utan ortsspecifik data
- Sektioner:
  - **Hero** med tjänstespecifik gradient, titel, beskrivning, CTA-knappar (Begär offert + Boka hembesök)
  - **Trust indicators** (F-skatt, garanti, ROT/RUT)
  - **Relaterade undertjänster** från databasen (filtrerar `useServices` på `serviceKey`)
  - **Områdeslänkar** — grid med alla orter där tjänsten finns (Stockholm + Uppsala), länkade till lokala sidor
  - **FAQ** med 4-5 vanliga frågor per nisch
  - **CTA-sektion** längst ned

**2. Routing i `App.tsx`**
- Registrera explicita routes **före** den dynamiska `tjanster/:serviceSlug/:areaSlug`:
```
/tjanster/koksrenovering → NicheServiceLandingPage
/tjanster/badrumsrenovering → NicheServiceLandingPage
... (alla 9)
```
- Alternativt: en dynamisk route med validering i komponenten mot `LOCAL_SERVICES`-listan
- Samma mönster för engelska: `/en/services/kitchen-renovation` etc.

**3. SEO i varje sida**
- Dynamisk `<title>` och `<meta description>` per nisch
- Canonical URL
- Intern länkning till lokala sidor (stärker PageRank-flödet)
- Breadcrumbs: Hem → Tjänster → Köksrenovering

**4. Data: `src/data/nicheServiceData.ts`**
- Nisch-specifik metadata: beskrivning, FAQ, USPs, ikon-mappning
- Återanvänder `LOCAL_SERVICES` för slug-validering och serviceKey-koppling

### Filer att skapa/ändra
| Fil | Åtgärd |
|---|---|
| `src/pages/NicheServiceLandingPage.tsx` | **Ny** — landningssida |
| `src/data/nicheServiceData.ts` | **Ny** — metadata, FAQ, beskrivningar per nisch |
| `src/App.tsx` | **Ändra** — lägg till routes |
| `src/utils/slugMapping.ts` | **Ändra** — lägg till sv↔en mappningar |
| `public/sitemap.xml` | **Ändra** — lägg till 9 nya URLs |

