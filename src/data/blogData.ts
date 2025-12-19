// ============================================================
// SEO-OPTIMERAD BLOGG DATA - 5 artiklar
// ============================================================

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  category: 'rot-rut' | 'renovering' | 'tips' | 'nyheter' | 'guider';
  tags: string[];
  readingTime: number;
  image: string;
  featured: boolean;
}

export const blogCategories = [
  { slug: 'rot-rut', name: 'ROT & RUT', description: 'Allt om skatteavdrag för hemarbeten' },
  { slug: 'renovering', name: 'Renovering', description: 'Tips och guider för renoveringsprojekt' },
  { slug: 'tips', name: 'Tips & Råd', description: 'Praktiska tips för hemmet' },
  { slug: 'nyheter', name: 'Nyheter', description: 'Senaste nytt från Fixco' },
  { slug: 'guider', name: 'Guider', description: 'Steg-för-steg guider' },
] as const;

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'rot-avdrag-guide-2025',
    title: 'ROT-avdrag 2025: Komplett guide – spara upp till 75 000 kr',
    metaTitle: 'ROT-avdrag 2025: Komplett Guide | Spara 50% på Hantverkare',
    metaDescription: 'Lär dig allt om ROT-avdrag 2025. Vilka arbeten ingår, hur mycket kan du spara, och hur ansöker du? Komplett guide med exempel och beräkningar.',
    excerpt: 'Allt du behöver veta om ROT-avdrag 2025 – från vilka arbeten som gäller till hur du maximerar din besparing. Med konkreta exempel och steg-för-steg instruktioner.',
    content: `
## Vad är ROT-avdrag?

ROT-avdrag (Renovering, Ombyggnad, Tillbyggnad) är en skattelättnad som ger dig **50% rabatt** på arbetskostnaden för renoveringsarbeten i din bostad. År 2025 kan du spara upp till **75 000 kronor per person och år**.

### Vilka arbeten ger ROT-avdrag?

ROT-avdrag gäller för arbeten som förbättrar, reparerar eller underhåller din bostad:

- ✅ **Elarbeten** – installation av nya eluttag, belysning, elbilsladdare
- ✅ **VVS-arbeten** – byte av rör, installation av värmepump, badrumsrenovering
- ✅ **Snickeriarbeten** – köksbyte, altanbygge, fönsterbyte
- ✅ **Målning** – in- och utvändig målning av bostaden
- ✅ **Markarbeten** – dränering, stenläggning, murar

### Vilka arbeten ger INTE ROT-avdrag?

- ❌ Nybyggnation (huset måste vara minst 5 år gammalt)
- ❌ Materialkostnader
- ❌ Arbeten i fritidshus som inte är permanentbostad
- ❌ Reparation av vitvaror

## Hur beräknas ROT-avdraget?

ROT-avdraget är **50% av arbetskostnaden** (exklusive material och moms):

| Arbetskostnad | ROT-avdrag (50%) | Du betalar |
|---------------|------------------|------------|
| 20 000 kr     | 10 000 kr        | 10 000 kr  |
| 50 000 kr     | 25 000 kr        | 25 000 kr  |
| 100 000 kr    | 50 000 kr        | 50 000 kr  |
| 150 000 kr    | 75 000 kr*       | 75 000 kr  |

*Maxbelopp per person och år

### Räkneexempel: Badrumsrenovering

En komplett badrumsrenovering kostar ofta 150 000-250 000 kr. Så här kan det se ut:

- **Total kostnad:** 200 000 kr
- **Materialkostnad:** 80 000 kr
- **Arbetskostnad:** 120 000 kr
- **ROT-avdrag (50%):** 60 000 kr
- **Din slutkostnad:** 140 000 kr

## Så här ansöker du om ROT-avdrag

### Steg 1: Välj ett seriöst företag
Företaget måste ha F-skattsedel och vara godkänt för ROT-avdrag.

### Steg 2: Begär offert
Se till att offerten tydligt visar arbetskostnad och materialkostnad separat.

### Steg 3: Utför arbetet
Företaget ansöker om ROT-avdrag åt dig direkt till Skatteverket.

### Steg 4: Betala fakturan
Du betalar endast din del (50% av arbetskostnaden + material).

## Vanliga frågor om ROT-avdrag

### Kan jag få ROT-avdrag för bostadsrätt?
Ja, du kan få ROT-avdrag för arbeten i din bostadsrätt, men inte för arbeten som föreningen ansvarar för.

### Hur lång tid tar det att få ROT-avdraget?
Du får avdraget direkt på fakturan – företaget ansöker åt dig.

### Kan flera personer i hushållet få ROT-avdrag?
Ja, varje person med inkomst kan få upp till 75 000 kr i ROT-avdrag per år.

## Sammanfattning

ROT-avdraget är en fantastisk möjlighet att spara pengar på nödvändiga renoveringar. Kom ihåg:

- **50% rabatt** på arbetskostnaden
- Max **75 000 kr** per person och år
- Gäller renovering, ombyggnad och tillbyggnad
- Företaget hanterar ansökan åt dig

---

*Behöver du hjälp med ett renoveringsprojekt? [Begär en gratis offert](/kontakt) från Fixco idag!*
    `,
    author: {
      name: 'Erik Lindberg',
      role: 'ROT-expert på Fixco',
    },
    publishedAt: '2025-01-15',
    updatedAt: '2025-01-15',
    category: 'rot-rut',
    tags: ['rot-avdrag', 'skatteavdrag', 'renovering', 'besparing', '2025'],
    readingTime: 8,
    image: '/placeholder.svg',
    featured: true,
  },
  {
    id: '2',
    slug: 'badrumsrenovering-kostnad-guide',
    title: 'Badrumsrenovering kostnad 2025: Prisguide med ROT-avdrag',
    metaTitle: 'Badrumsrenovering Kostnad 2025 | Priser & ROT-avdrag Guide',
    metaDescription: 'Vad kostar badrumsrenovering 2025? Komplett prisguide med ROT-avdrag beräkningar. Lär dig vad som påverkar priset och hur du sparar pengar.',
    excerpt: 'Få koll på vad badrumsrenovering faktiskt kostar 2025. Vi går igenom alla kostnader, från kakel till VVS, och visar hur du sparar med ROT-avdrag.',
    content: `
## Vad kostar badrumsrenovering 2025?

En badrumsrenovering kostar normalt mellan **80 000 och 350 000 kronor** beroende på storlek, materialval och arbetets omfattning. Med ROT-avdrag kan du spara upp till **75 000 kronor**.

### Prisöversikt per badrumsstorlek

| Badrumsstorlek | Enkel renovering | Standard | Lyxig |
|----------------|------------------|----------|-------|
| Litet (3-4 m²) | 80 000-120 000 kr | 120 000-180 000 kr | 180 000-250 000 kr |
| Medium (5-7 m²) | 120 000-180 000 kr | 180 000-250 000 kr | 250 000-350 000 kr |
| Stort (8+ m²) | 180 000-250 000 kr | 250 000-350 000 kr | 350 000+ kr |

## Vad påverkar priset?

### 1. Våtrumsisolering (tätskikt)
Detta är det viktigaste och får aldrig kompromissas:
- **Kostnad:** 15 000-30 000 kr
- Kräver certifierad hantverkare (Säker Vatten)

### 2. Kakel och klinker
- **Budget:** 300-500 kr/m² (ca 5 000-10 000 kr)
- **Standard:** 500-1 000 kr/m² (ca 10 000-20 000 kr)
- **Premium:** 1 000-2 000+ kr/m² (ca 20 000-40 000 kr)

### 3. VVS-arbeten
- Byte av rör och avlopp: 25 000-50 000 kr
- Golvvärme installation: 10 000-20 000 kr
- Ny duschblandare: 3 000-8 000 kr

### 4. Sanitetsporslin
- Toalett: 3 000-15 000 kr
- Handfat med kommod: 5 000-25 000 kr
- Duschvägg: 4 000-15 000 kr
- Badkar: 8 000-40 000 kr

### 5. El-installationer
- Ny belysning: 5 000-15 000 kr
- Golvvärme (el): 8 000-15 000 kr
- Handdukstork: 2 000-8 000 kr

## ROT-avdrag på badrumsrenovering

### Beräkningsexempel

**Total kostnad:** 200 000 kr
- Material (kakel, porslin, etc): 70 000 kr
- Arbetskostnad: 130 000 kr

**ROT-avdrag (50% av arbete):** 65 000 kr

**Din slutkostnad:** 135 000 kr

Du sparar alltså **65 000 kronor** tack vare ROT-avdraget!

## Så här går en badrumsrenovering till

### Vecka 1-2: Rivning och förberedelse
- Rivning av gammalt badrum
- Kontroll av rör och stomme
- Eventuella rörbyten

### Vecka 2-3: Tätskikt och VVS
- Installation av nytt tätskikt
- VVS-arbeten och golvvärme
- El-installationer

### Vecka 3-4: Kakelsättning
- Kakel på väggar
- Klinker på golv
- Fogning

### Vecka 4-5: Färdigställande
- Montering av porslin
- Installation av blandare
- Slutbesiktning

## Tips för att spara pengar

1. **Behåll rörens placering** – att flytta rör kostar 20 000-50 000 kr extra
2. **Välj standardformat på kakel** – specialstorlekar kostar mer
3. **Planera noga** – ändringar under arbetets gång är dyra
4. **Jämför offerter** – begär minst 3 offerter
5. **Utnyttja ROT-avdraget** – spara 50% på arbetskostnaden

---

*Redo att renovera ditt badrum? [Begär en gratis offert](/kontakt) och få exakt pris för ditt projekt.*
    `,
    author: {
      name: 'Maria Svensson',
      role: 'Renoveringsexpert',
    },
    publishedAt: '2025-01-10',
    updatedAt: '2025-01-10',
    category: 'renovering',
    tags: ['badrumsrenovering', 'kostnad', 'pris', 'rot-avdrag', 'kakel'],
    readingTime: 10,
    image: '/placeholder.svg',
    featured: true,
  },
  {
    id: '3',
    slug: 'elektriker-pris-guide',
    title: 'Vad kostar elektriker 2025? Prisguide för elarbeten',
    metaTitle: 'Elektriker Pris 2025 | Kostnad för Elarbeten med ROT',
    metaDescription: 'Vad kostar en elektriker 2025? Komplett prisguide för elinstallationer, från uttag till elbilsladdare. Lär dig hur ROT-avdrag minskar kostnaden.',
    excerpt: 'Få koll på vad olika elarbeten kostar och hur du sparar 50% med ROT-avdrag. Från nya uttag till komplett elinstallation.',
    content: `
## Elektriker timpris 2025

En behörig elektriker tar normalt **550-850 kr per timme** exklusive moms. Med ROT-avdrag betalar du effektivt **275-425 kr per timme**.

### Priser för vanliga elarbeten

| Elarbete | Pris exkl. moms | Med ROT-avdrag |
|----------|-----------------|----------------|
| Nytt eluttag | 1 500-2 500 kr | 750-1 250 kr |
| Ny strömbrytare | 1 200-2 000 kr | 600-1 000 kr |
| Taklampepunkt | 2 000-3 500 kr | 1 000-1 750 kr |
| Spotlights (4 st) | 4 000-6 000 kr | 2 000-3 000 kr |
| Dimmer installation | 1 500-2 500 kr | 750-1 250 kr |
| Elbilsladdare (Easee) | 15 000-25 000 kr | 7 500-12 500 kr |
| Elcentral byte | 25 000-45 000 kr | 12 500-22 500 kr |
| Jordfelsbrytare | 3 000-5 000 kr | 1 500-2 500 kr |

## Faktorer som påverkar priset

### 1. Typ av arbete
- **Enklare arbeten** (uttag, strömbrytare): 1-2 timmar
- **Medium arbeten** (spotlights, dimmer): 2-4 timmar
- **Komplexa arbeten** (elcentral, komplett installation): 1-3 dagar

### 2. Tillgänglighet
- Synliga kablar: Billigare
- Infällda kablar i vägg: Dyrare (kräver bilning)
- Äldre hus utan kabelkanal: Betydligt dyrare

### 3. Material
- Standarduttag: 100-200 kr
- Designuttag (Schneider, ELKO Plus): 300-600 kr
- USB-uttag: 200-400 kr

## Populära elprojekt och kostnader

### Elbilsladdare hemma
**Total kostnad:** 15 000-35 000 kr
- Laddbox (Easee, Wallbox): 8 000-12 000 kr
- Installation: 7 000-15 000 kr
- **Med ROT:** 11 500-23 000 kr

### Köksrenovering (el)
**Total kostnad:** 15 000-40 000 kr
- Nya uttag för vitvaror: 5 000-10 000 kr
- Spotlights: 4 000-8 000 kr
- Arbetsbelysning: 3 000-6 000 kr
- **Med ROT:** 7 500-20 000 kr

### Smart hem-installation
**Total kostnad:** 10 000-50 000 kr
- Smarta strömbrytare: 5 000-15 000 kr
- Smart belysning: 3 000-10 000 kr
- Central styrning: 5 000-25 000 kr

## Varför anlita behörig elektriker?

### Lagkrav
Alla elinstallationer måste utföras av behörig elektriker enligt Elsäkerhetsverkets regler. Olagliga elarbeten kan:
- Orsaka brand
- Leda till elolyckor
- Ogiltigförklara din hemförsäkring
- Ge böter upp till 100 000 kr

### Garanti och trygghet
- 2 års garanti på utfört arbete
- Försäkring om något går fel
- Korrekt dokumentation

## Tips för att spara på elarbeten

1. **Samla flera jobb** – startavgiften är samma oavsett antal uttag
2. **Förbered väl** – rensa undan och visa var du vill ha uttagen
3. **Välj ROT-berättigade arbeten** – spara 50% på arbetskostnaden
4. **Jämför offerter** – begär minst 2-3 offerter

---

*Behöver du hjälp med elarbeten? [Begär en gratis offert](/kontakt) från våra certifierade elektriker.*
    `,
    author: {
      name: 'Jonas Bergström',
      role: 'Certifierad elmontör',
    },
    publishedAt: '2025-01-08',
    updatedAt: '2025-01-08',
    category: 'guider',
    tags: ['elektriker', 'pris', 'kostnad', 'elinstallation', 'rot-avdrag'],
    readingTime: 7,
    image: '/placeholder.svg',
    featured: false,
  },
  {
    id: '4',
    slug: 'koksrenovering-guide',
    title: 'Köksrenovering 2025: Komplett guide med prisexempel',
    metaTitle: 'Köksrenovering 2025 | Kostnad, Tips & ROT-avdrag Guide',
    metaDescription: 'Planerar du köksrenovering? Få koll på kostnader, tidsplan och hur du sparar med ROT-avdrag. Komplett guide för 2025.',
    excerpt: 'Drömmköket är närmare än du tror! Lär dig allt om köksrenovering – från planering till färdigt resultat. Med ROT-avdrag sparar du tusentals kronor.',
    content: `
## Vad kostar köksrenovering 2025?

En köksrenovering kostar normalt mellan **100 000 och 500 000 kronor** beroende på storlek, materialval och omfattning. Med ROT-avdrag kan du spara upp till **75 000 kronor**.

### Prisöversikt

| Nivå | Beskrivning | Ungefärligt pris |
|------|-------------|------------------|
| Budget | Måla luckor, byta bänkskiva | 30 000-80 000 kr |
| Standard | Nya stommar (IKEA-nivå) | 100 000-200 000 kr |
| Premium | Platsbyggt kök | 200 000-400 000 kr |
| Lyx | Designkök med specialmaterial | 400 000+ kr |

## Fördelning av kostnader

### Typisk köksrenovering (200 000 kr)

- **Köksstommar och luckor:** 60 000-80 000 kr (30-40%)
- **Bänkskiva:** 15 000-40 000 kr (8-20%)
- **Vitvaror:** 30 000-60 000 kr (15-30%)
- **Installation och snickeri:** 40 000-60 000 kr (20-30%)
- **El och VVS:** 15 000-30 000 kr (8-15%)
- **Övrigt (handtag, belysning):** 10 000-20 000 kr (5-10%)

## Steg-för-steg: Så går köksrenoveringen till

### Fas 1: Planering (2-4 veckor)
- Rita upp befintligt kök
- Bestäm budget och önskemål
- Välj stil och material
- Begär offerter

### Fas 2: Beställning (4-8 veckor)
- Beställ köksstommar och luckor
- Beställ vitvaror
- Beställ bänkskiva

### Fas 3: Rivning (1-2 dagar)
- Ta bort gammalt kök
- Kontrollera el och VVS
- Förbered ytor

### Fas 4: Installation (1-2 veckor)
- El- och VVS-arbeten
- Montering av stommar
- Montering av bänkskiva
- Installation av vitvaror

### Fas 5: Slutförande (2-3 dagar)
- Montering av handtag
- Fogning och silikon
- Slutstädning

## Bänkskivor: Material och priser

| Material | Pris per löpmeter | Fördelar | Nackdelar |
|----------|-------------------|----------|-----------|
| Laminat | 800-2 000 kr | Billigt, många färger | Känsligt för repor |
| Kompaktlaminat | 2 000-4 000 kr | Tåligt, vattenresistent | Begränsade färger |
| Massivt trä | 3 000-6 000 kr | Vackert, kan slipas | Kräver underhåll |
| Sten (granit) | 4 000-8 000 kr | Värmetal, lyxigt | Tungt, dyrt |
| Komposit (Silestone) | 5 000-10 000 kr | Hygieniskt, tåligt | Dyrt |

## ROT-avdrag på köksrenovering

Du får ROT-avdrag på:
- ✅ Snickeriarbete (montering)
- ✅ Elinstallation
- ✅ VVS-arbete
- ✅ Målning

Du får INTE ROT-avdrag på:
- ❌ Material (stommar, luckor, vitvaror)
- ❌ Bänkskiva

### Beräkningsexempel

**Total kostnad:** 250 000 kr
- Material: 150 000 kr
- Arbetskostnad: 100 000 kr

**ROT-avdrag (50% av arbete):** 50 000 kr

**Din slutkostnad:** 200 000 kr

## 5 tips för lyckad köksrenovering

1. **Planera köksundertriangeln** – spis, diskho och kylskåp ska vara nära varandra
2. **Tänk på förvaring** – bättre med för många skåp än för få
3. **Investera i bra vitvaror** – de används varje dag
4. **Glöm inte belysningen** – spotlights under överskåpen är ett måste
5. **Ha en buffert** – räkna med 10-15% extra för oförutsedda kostnader

---

*Dags att förnya köket? [Begär en gratis offert](/kontakt) och få hjälp av våra experter.*
    `,
    author: {
      name: 'Anna Holm',
      role: 'Köksdesigner',
    },
    publishedAt: '2025-01-05',
    updatedAt: '2025-01-05',
    category: 'renovering',
    tags: ['köksrenovering', 'kök', 'kostnad', 'renovering', 'rot-avdrag'],
    readingTime: 9,
    image: '/placeholder.svg',
    featured: false,
  },
  {
    id: '5',
    slug: 'vanliga-renoveringsmisstag',
    title: '7 vanliga misstag vid renovering – och hur du undviker dem',
    metaTitle: '7 Vanliga Renoveringsmisstag | Undvik Dyra Fel 2025',
    metaDescription: 'Lär dig de 7 vanligaste misstagen vid renovering och hur du undviker dem. Spara pengar och stress med våra experttips.',
    excerpt: 'Renovering kan bli en mardröm om du gör fel. Lär dig av andras misstag och undvik de vanligaste fallgroparna.',
    content: `
## Misstag #1: Ingen ordentlig budget

### Problemet
Många underskattar kostnaden och hamnar i ekonomisk knipa mitt i projektet.

### Lösningen
- Lägg till **15-20% buffert** på alla kostnader
- Begär detaljerade offerter med fast pris
- Prioritera: vad MÅSTE göras vs vad VILL du göra?

## Misstag #2: Börja utan tillstånd

### Problemet
Vissa renoveringar kräver bygglov eller bygganmälan. Att göra dem utan tillstånd kan leda till:
- Böter
- Rivningsföreläggande
- Problem vid försäljning

### Lösningen
Kontrollera alltid med kommunen:
- **Bygglov krävs för:** tillbyggnader, fasadändringar, fönsterbyten
- **Bygganmälan krävs för:** bärande väggar, VVS-ändringar, eldstad
- **Inget krävs för:** målning, tapetsering, golvbyte, köksrenovering

## Misstag #3: Välja hantverkare enbart på pris

### Problemet
Den billigaste offerten blir ofta dyrast i slutändan:
- Dålig kvalitet = dyra reparationer
- Försening = extra kostnader
- Ingen garanti = du står ensam om något går fel

### Lösningen
Utvärdera hantverkare baserat på:
1. Referenser och tidigare projekt
2. F-skatt och försäkringar
3. Tydlig offert med fast pris
4. Kommunikation och tillgänglighet

## Misstag #4: Ändra planen mitt i projektet

### Problemet
"Kan vi inte bara flytta det där uttaget?" kan kosta tusentals kronor och förlänga projektet med veckor.

### Lösningen
- **Planera noggrant** innan du börjar
- **Besök showroom** och provbo i köket mentalt
- **Ta alla beslut** innan rivningen börjar
- **Skriftliga ändringar** om något måste ändras

## Misstag #5: Glömma dolda kostnader

### Problemet
Du budgeterar för kakel och stommar, men glömmer:
- Bortforsling av rivningsmaterial
- Tillfällig bostad/kök
- Höjda elkostnader (byggfläktar, verktyg)
- Oförutsedda problem (fukt, mögel, asbest)

### Lösningen
Inkludera i budgeten:
- **Rivning och bortforsling:** 5 000-15 000 kr
- **Tillfälligt kök:** 500-1 000 kr/vecka
- **Buffer för oförutsett:** 15-20% av total budget

## Misstag #6: Kompromissa med våtrum

### Problemet
Dålig tätskiktinstallation i badrum leder till:
- Fuktskador i stomme
- Mögel och dålig lukt
- Reparationer för 100 000+ kr

### Lösningen
- **Anlita certifierad hantverkare** (Säker Vatten eller BKR)
- **Kräv dokumentation** på tätskikt
- **Kompromissa ALDRIG** på tätskikt för att spara pengar

## Misstag #7: Inte utnyttja ROT-avdrag

### Problemet
Många betalar fullpris för hantverksarbeten och missar tusentals kronor i besparing.

### Lösningen
- **Kontrollera att företaget har F-skatt**
- **Se till att offerten separerar** material och arbete
- **Använd ROT för alla berättigade arbeten:**
  - Snickeri
  - El
  - VVS
  - Målning
  - Markarbeten

**Du kan spara upp till 75 000 kr per person och år!**

## Sammanfattning

| Misstag | Kostnad att åtgärda |
|---------|---------------------|
| Ingen budget | 20-50% över budget |
| Inget tillstånd | 10 000-100 000 kr i böter |
| Billigaste hantverkaren | 50-100% av projektets värde |
| Ändringar mitt i | 5 000-50 000 kr extra |
| Glömda kostnader | 10-20% av budget |
| Dåligt våtrum | 100 000-500 000 kr i skador |
| Missat ROT | Upp till 75 000 kr |

---

*Vill du renovera utan att göra dessa misstag? [Begär en gratis offert](/kontakt) från Fixco och få professionell hjälp från start till mål.*
    `,
    author: {
      name: 'Peter Andersson',
      role: 'Projektledare',
    },
    publishedAt: '2025-01-02',
    updatedAt: '2025-01-02',
    category: 'tips',
    tags: ['renovering', 'misstag', 'tips', 'råd', 'budget'],
    readingTime: 8,
    image: '/placeholder.svg',
    featured: false,
  },
];

// Hitta bloggpost baserat på slug
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

// Hämta relaterade artiklar
export const getRelatedPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return blogPosts.slice(0, limit);
  
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.category === currentPost.category || 
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
};

// Hämta featured posts
export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

// Hämta posts per kategori
export const getPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};
