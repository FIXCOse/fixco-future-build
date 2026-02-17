

## Uppfräschning av lokala tjänstesidor

### Problem

**1. Hero-illustrationen ser barnslig ut**
Den roterande "planetmodellen" med streckade cirklar, orbitande prickar och flytande verktygsikoner ser ut som en sci-fi-leksak -- inte som ett seriost hantverksforetag. Den tar halva skarmytan men ger noll information.

**2. Rainbow-gradient pa for manga rubriker**
Nastan varje sektion har en `GradientText gradient="rainbow"` -- "snickare" i regnbagsfarg i 6-7 rubriker pa samma sida. Det tappar all effekt och ser oserioest ut.

**3. For manga micro-animationer**
Flytande partiklar, orbitande prickar, pulserande ikoner, svavande verktyg -- det adderar "leksaks-kansla" och distraherar fran innehallet.

**4. Sektionerna ser monotona ut**
Varje sektion har nastan identisk mork gradient-bakgrund (hsl(240,10%,8%) vs hsl(260,12%,10%)) -- svart pa svart. Svart att se var en sektion slutar och nasta borjar.

---

### Losning

#### 1. Byt ut HeroIllustration mot en ren, professionell hero

Ta bort hela HeroIllustration-komponenten (orbitande ikoner, partiklar, streckade cirklar). Ersatt med en av tva varianter beroende pa om tjansten har en action-bild:

- **Tjanster MED action-bild** (snickare, malare, vvs, el, tradgard, markarbeten): Flytta action-bilden TILL heron som bakgrundsbild (fullbredd) med mork gradient-overlay och text ovanpa. Ta bort den separata ActionSection nedanfor -- allt i en hero.
- **Tjanster UTAN action-bild** (stad, montering, flytt, tekniska installationer): Enkel clean hero utan illustration -- bara text, badges och CTA pa en ren gradient-bakgrund. Tjansteikonen visas som en subtil badge bredvid rubriken (som den ar nu), men inget mer.

#### 2. Begransar GradientText till MAX 1 per sida

Bara hero h1 far anvanda `GradientText`. Alla andra sektionsrubriker anvander vanlig `text-foreground` (vit text). Nyckelord kan fa `text-primary` for subtil betoning.

#### 3. Rensa bort overflodiga animationer

- Ta bort alla flytande partiklar
- Ta bort orbitande cirklar och prickar
- Behal enbart: fade-in pa scroll (whileInView), hover-effekter pa kort, och CTA-skuggeffekter
- Mycket renare, mer professionell kansla

#### 4. Battre visuell separation mellan sektioner

Varannan sektion far en subtilt ljusare bakgrund (`bg-muted/30` eller `bg-white/[0.02]`) for att skapa tydlig visuell rytm. Inte alla sektioner ska vara nastan identiskt morka.

---

### Tekniska detaljer

| Fil | Andring |
|-----|---------|
| `src/components/local-service/HeroIllustration.tsx` | **Tas bort helt** -- komponenten anvands inte langre |
| `src/pages/LocalServicePage.tsx` | **Stor refaktor av hero-sektionen**: ersatt split-layout med antingen fullbredd action-bild-hero eller ren text-hero. Ta bort import av HeroIllustration. Flytta action-bild-logik in i heron. Ta bort alla `<GradientText>` utom h1. Justera sektionsbakgrunder for visuell variation. |
| `src/components/local-service/CarpenterActionSection.tsx` | **Tas bort** -- bilden flyttas in i heron |
| `src/components/local-service/PainterActionSection.tsx` | **Tas bort** |
| `src/components/local-service/PlumberActionSection.tsx` | **Tas bort** |
| `src/components/local-service/ElectricianActionSection.tsx` | **Tas bort** |
| `src/components/local-service/GardenActionSection.tsx` | **Tas bort** |
| `src/components/local-service/GroundworkActionSection.tsx` | **Tas bort** |
| `src/components/city/CityHeroIllustration.tsx` | **Samma behandling** -- ta bort orbitande ikoner, ersatt med ren design |

### Hero-design (efter andring)

For tjanster med bild (t.ex. snickare):
- Fullbredd bakgrundsbild (samma foton som action-sektionerna anvander idag)
- Mork gradient-overlay (`from-black/80 via-black/50 to-black/30`)
- Text, badges och CTA-knappar ovanpa
- Compact trust bar under

For tjanster utan bild:
- Ren gradient-bakgrund (som nu, men utan illustration)
- Storre, mer centrerad text
- Badges och CTA-knappar

### Vad som INTE andras
- All text/data/SEO-innehall behalls
- Alla CTA-handlers (openServiceRequestModal, tel-lankar) behalls
- Schema.org markup behalls
- FAQ accordion behalls
- CompactTrustBar, TestimonialCarouselLocal, NearbyAreasSection behalls
- ExpandableAreaLinks behalls
- Sektionsordning behalls (forutom att ActionSection slas ihop med hero)

