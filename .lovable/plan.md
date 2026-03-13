

## Plan: Massiv SEO-expansion — 120+ sökvarianter med fokus på Snickeri & Kök

### Vad vi bygger
Expanderar `LOCAL_SERVICES` från 21 till **~140 entries** (120+ nya slugs). Varje slug genererar 54 lokala sidor = **~7 500+ totalt indexerbara sidor**. Tyngdpunkt på snickeri- och kökstjänster (~40 varianter), med full täckning för övriga kategorier.

### Nya slugs per kategori

```text
SNICKERI & BYGG (~25 nya)
totalrenovering, renovering, hantverkare, byggfirma, byggtjanster,
husrenovering, villarenovering, lagenhetsrenovering, ombyggnad,
utbyggnad, tillbyggnad, fonsterbyte, dorrbyte, fasadrenovering,
trapprenovering, taklaggning, takbyte, takrenoverning,
verandarenovering, entrerenoverning, vardagsrumsrenovering,
sovrumsrenovering, kontorsbygge, bostadsanpassning, platsbyggt

KÖK (~15 nya)
kok, koksbyte, ikea-koksmontage, koksinstallation,
koksdesign, nytt-kok, koksluckor, bankskiva,
platsbyggt-kok, koksplanering, vitvaruinstallation-kok,
diskbanksbyte, koksbelysning, koksflakt, stankskydd

BADRUM (~10 nya)
badrum, badrumskakel, plattsattning, tatskikt,
wc-renovering, duschrum, duschvagg, badrumsinredning,
tvattrum, badrumsgolv

EL (~12 nya)
elarbeten, elreparation, laddbox, laddboxinstallation,
sakringsbyte, belysning, elcentral, eljour, lampmontering,
spotlights, elbesiktning, jordfelsbrytare

VVS (~10 nya)
vvs-arbeten, rorjour, rorarbeten, varmepump, vattenlas,
avlopp, golvvarme, vattenbatteri, blandarbyte, radiatorbyte

MÅLNING (~8 nya)
malning, tapetsering, spackling, lackering, fonstermalning,
takmålning, trappmalning, snickerimålning

GOLV (~7 nya)
golvslipning, parkettlaggning, laminatgolv, vinylgolv,
klinkergolv, epoxigolv, golvbyte

TRÄDGÅRD (~8 nya)
tradgardsanlaggning, tradgardsskotsel, grasklippning,
hackklippning, tradbeskaring, tradgardsdesign,
stenlaggning-tradgard, buskrojning

MARKARBETEN (~8 nya)
dranering, schaktning, plattlaggning, stenlaggning,
asfaltering, murverk, uppfart, garageuppfart

STÄD (~8 nya)
hemstad, flyttstad, byggstad, fonsterputs, storstadning,
kontorsstad, dodsbo, trappstad

MONTERING (~6 nya)
garderobsmontering, tv-montering, persiennmontering,
hyllmontering, ikeamontering, dorrmontering

FLYTT (~5 nya)
flytthjalp, packhjalp, kontorsflytt, magasinering,
pianoflytt

TEKNIK (~6 nya)
larm, smarthome, natverksinstallation, kameraovervakning,
solceller, porttelefon

RIVNING (~3 nya)
rivning-badrum, rivning-kok, bortforsling
```

**Totalt: ~120 nya slugs → ~6 480 nya sidor + befintliga 1 134 = ~7 600 sidor**

### Filer som ändras

**1. `src/data/localServiceData.ts`** (huvudfil — flest ändringar)
- Lägg till alla ~120 nya entries i `LOCAL_SERVICES`
- Lägg till varje ny slug i `SERVICE_MYTHS` (3 myter per slug, grupperade — t.ex. alla kök-varianter delar köksmyter med unika tillägg)
- Lägg till i `SERVICE_PRICING` (mappas till föräldrens priser)
- Lägg till i `SERVICE_NAME_EN` (engelska namn)
- Lägg till i `titleTemplates` (sv + en)
- Lägg till i `descriptionTemplates` (sv + en)
- Lägg till i alla andra Record-mappningar i `generateLocalContent`

**2. `src/data/nicheServiceData.ts`**
- Lägg till `NicheServiceMeta` för varje ny slug (titel, beskrivning, 4 USPs, 4 FAQs, sv+en)
- Dessa blir hub-sidorna på `/tjanster/{slug}`

**3. `src/utils/slugMapping.ts`**
- Lägg till sv→en mappningar för alla nya slugs

**4. `src/App.tsx`**
- Registrera nisch-landningssidor som routes

### Strategi för unikt innehåll (undvika duplicate content)
- Varje slug får **unik H1** (t.ex. "Totalrenovering Stockholm" vs "Hantverkare Stockholm")
- Unik meta description med det specifika sökordet
- Myter grupperas per kategori men med unika varianter per slug-kluster
- Intro-texter genereras dynamiskt med slug-specifika ord

### Implementationsordning
1. Alla nya entries i `LOCAL_SERVICES` + `SERVICE_PRICING` + `SERVICE_NAME_EN`
2. `SERVICE_MYTHS` för alla nya slugs
3. `titleTemplates` och `descriptionTemplates` (sv + en)  
4. Övriga content-records i `generateLocalContent`
5. `nicheServiceData.ts` — hub-sidor med FAQs och USPs
6. `slugMapping.ts` och `App.tsx` routes

### Teknisk not
Filen `localServiceData.ts` kommer bli mycket stor (~3000+ rader). Alla nya slugs måste finnas i **alla** Record-typer som indexeras med `LocalServiceSlug`, annars blir det TypeScript-fel.

