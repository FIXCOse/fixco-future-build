
# Plan: Inline-guider på lokala tjänstesidor (snickeri först)

## Vad vi bygger
En ny sektion **"Guide: [Tjänst] i [Ort]"** med 200-400 ord sammanhängande text direkt på varje lokal tjänstesida. Texten är template-baserad men dynamiskt anpassad per tjänst och ort.

## Varför det hjälper SEO
- **Unikt long-form innehåll** — Google rankar sidor med djupt innehåll högre
- **Naturlig sökordsdensitet** — "köksrenovering Stockholm", "snickare Huddinge" etc. vävs in naturligt
- **Ökad tid-på-sidan** — mer att läsa = bättre engagement-signaler
- **Featured snippets** — strukturerad guide-text kan plockas upp av Google

## Teknisk approach

### 1. Ny datafil: `src/data/carpentryGuideData.ts`
- En guide-template per snickeritjänst (7 st: snickare, köksrenovering, badrumsrenovering, altanbygge, köksmontering, totalrenovering, husrenovering)
- Varje template innehåller:
  - **Intro-stycke** (vad tjänsten innebär i {area})
  - **3-4 rubriker med brödtext** (t.ex. "Vad kostar köksrenovering i {area}?", "Så väljer du rätt snickare", "Vanliga projekt i {area}")
  - **Avslutande CTA-stycke**
- `{area}` och `{service}` ersätts dynamiskt

### 2. Ny komponent: `src/components/local/InlineGuideSection.tsx`
- Renderar guiden med tydlig typografi (H2, H3, stycken)
- Visuellt: diskret bakgrund, bra läsbarhet
- Inkluderar schema.org `Article`-markup i JSON-LD
- Collapsible/expandable: visar intro + "Läs mer" för att inte göra sidan för lång visuellt

### 3. Integration i `LocalServicePage.tsx`
- Placeras **efter PriceGuideSection**, **före FAQ-sektionen**
- Renderas bara om guide-data finns för tjänsten (snickeri först)
- Guiden inkluderas i sidans JSON-LD schema

## Innehållsstruktur (exempel: Köksrenovering)

```text
## Guide: Köksrenovering i {area}

Att renovera köket är en av de mest värdefulla investeringarna...
i {area} ser vi ofta projekt i villor och bostadsrätter...

### Vad ingår i en köksrenovering?
Stycke om rivning, el, VVS, montering, bänkskivor...

### Vad kostar köksrenovering i {area}?
Referens till prisguiden ovan + ROT-avdrag 30%...

### Så väljer du rätt hantverkare i {area}
Tips om att jämföra offerter, kontrollera F-skatt...

### Vanliga misstag att undvika
Praktiska tips baserade på erfarenhet...
```

## Omfattning
- **7 snickeri-tjänster** × 54 områden = **378 sidor** med inline-guider
- Ingen ny route, inga nya sidor — bara mer innehåll på befintliga sidor

## Filer som ändras/skapas
1. **Skapa** `src/data/carpentryGuideData.ts` — guide-templates
2. **Skapa** `src/components/local/InlineGuideSection.tsx` — UI-komponent
3. **Ändra** `src/pages/LocalServicePage.tsx` — lägg till sektionen
