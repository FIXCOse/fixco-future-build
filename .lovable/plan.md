
## Dörrlås och Smarta Lås -- Ultimate SEO-strategi

### Sammanfattning

Planen bygger en **tvådelad strategi** som ger er maximal SEO-täckning:

1. **Nya dörrlåstjänster** i databasen under rätt kategori (Montering + cross-listing till Tekniska installationer)
2. **En dedikerad landningssida** (`/tjanster/dorrlas`) fullspäckad med SEO-innehåll, märkesspecifik info och boknings-CTA

Detta liknar Clas Fixares upplägg men med **bättre SEO** tack vare er befintliga lokala sidstruktur, Schema.org och AI-optimering.

---

### DEL 1: Nya tjänster i databasen

Lägg till dessa tjänster i `services`-tabellen:

| Tjänst | Kategori | Cross-listing | ROT |
|--------|----------|---------------|-----|
| Installera smart dörrlås | montering | tekniska-installationer | Ja (50%) |
| Installera Yale Doorman | montering | tekniska-installationer | Ja (50%) |
| Installera Yale Linus | montering | tekniska-installationer | Ja (50%) |
| Installera kodlås | montering | tekniska-installationer | Ja (50%) |
| Byta cylinderlås | montering | -- | Ja (50%) |
| Installera larm och dörrlås-paket | tekniska-installationer | montering | Ja (50%) |

Varje tjänst får `search_keywords` med brett sökfält:
- "yale doorman, yale linus, smart lås, kodlås, dörrlås, assa, assa abloy, nuki, glue lock, digitalt lås, elektriskt lås, ytterdörr, säkerhet, hemmasäkerhet, nyckelritt, nyckelritt lås"

Tjänsterna visas automatiskt under **Montering** och **Tekniska installationer** i ert nuvarande filter tack vare cross-listing.

---

### DEL 2: Dedikerad landningssida `/tjanster/dorrlas`

En helt ny sida som fungerar som ett **SEO-nav** ("content hub") for allt som rör dörrlås. Sidan byggs som en ny komponent `DoorLockLandingPage.tsx`.

#### Innehållsstruktur (uppifrån och ner):

**1. Hero-sektion**
- H1: "Installation av Dörrlås och Smarta Lås"
- Intro: Kort, säljande text med USP:ar (5/5 betyg, ROT-avdrag 50%, fast pris)
- CTA: "Begär offert" (öppnar ServiceRequestModal) + Telefonnummer

**2. Märkessektion -- "Vi installerar alla märken"**
- Visuella kort per märke med logotyp/ikon:
  - **Yale Doorman** (L3S Flex, Classic, V2N)
  - **Yale Linus**
  - **ASSA ABLOY** (Connect, Seos)
  - **Nuki** (Smart Lock 4.0)
  - **Glue** (Smart Lock)
  - **Danalock**
  - **Kodlås** (generiskt)
  - **Traditionella cylinderlås**
- Varje kort har en kort beskrivning + "Boka installation" CTA

**3. SEO-textsektion -- "Allt du behöver veta om smarta dörrlås"**
- Lång, informativ text (~800-1000 ord) som täcker:
  - Vad är ett smart dörrlås?
  - Skillnaden mellan Yale Doorman, Linus, Nuki och Glue
  - Vilka dörrar passar smarta lås på?
  - Hur fungerar ROT-avdrag for dörrlåsinstallation?
  - Behöver man en elektriker eller snickare?
  - Säkerhet: certifieringar och försäkring

**4. Jämförelsetabell**
- Tabell med Yale Doorman vs Yale Linus vs Nuki vs Glue vs ASSA
- Kolumner: Märke, Modell, Typ (Bluetooth/Z-Wave/WiFi), Passar dörrar, ROT-avdrag, Pris ca.

**5. Så bokar du -- HowTo-steg**
- 4 steg med ikoner (samma mönster som LocalServicePage)

**6. FAQ-sektion (8-10 frågor)**
- "Kan jag installera Yale Doorman själv?"
- "Vilka dörrar passar Yale Doorman?"
- "Vad kostar installation av smart dörrlås?"
- "Får jag ROT-avdrag for dörrlåsinstallation?"
- "Vad är skillnaden mellan Yale Doorman och Yale Linus?"
- "Fungerar smarta lås om strömmen går?"
- "Kan jag behålla mitt vanliga lås parallellt?"
- "Hur lång tid tar installation?"

**7. Interna länkar**
- Länk till Tekniska installationer
- Länk till Montering
- Länk till Smart Hem-sidan
- Lokala länkar: "Dörrlås installation Uppsala", "Dörrlås installation Stockholm"

---

### DEL 3: SEO och Schema.org

Sidan får:
- **Meta title**: `Installera Dörrlås | Yale Doorman, Linus, Nuki | 50% ROT | Fixco`
- **Meta description**: `Installation av smarta dörrlås ★ 5/5 betyg ✓ Yale Doorman, Linus, Nuki, ASSA ✓ 50% ROT-avdrag ✓ Fast pris. Boka certifierad montör!`
- **Schema.org**: Product, FAQPage, HowTo, Service, Organization
- **Canonical**: `https://fixco.se/tjanster/dorrlas`

---

### DEL 4: Lokal SEO-integration

Dörrlås-sidan blir en del av ert lokala SEO-nät:
- Internt länkade från LocalServicePage (Montering + Tekniska installationer) i alla 54 orter
- "Dörrlås installation Uppsala" och "Dörrlås installation Stockholm" länkas från sidan tillbaka till lokala sidor

---

### Teknisk implementation

#### Nya/ändrade filer:

1. **`src/pages/DoorLockLandingPage.tsx`** -- Helt ny sida med all SEO-content
2. **`src/data/doorLockData.ts`** -- Data for märken, FAQ:s, jämförelsetabell
3. **`src/App.tsx`** -- Ny route: `tjanster/dorrlas`
4. **Supabase `services`-tabell** -- 6 nya tjänsteposter med search_keywords
5. **`src/data/servicesDataNew.ts`** -- Lägg till dörrlås som sub-services under Montering
6. **`src/features/requests/serviceConfig.ts`** -- Ny config for dörrlåstjänster

#### Routing:
```text
/tjanster/dorrlas          --> DoorLockLandingPage (ny)
/tjanster/montering        --> ServiceDetail (visar dörrlås bland andra montering-tjänster)
/tjanster/montering/uppsala --> LocalServicePage (befintlig, nämner dörrlås)
```

#### Designstil:
Samma premium-design som era befintliga sidor -- GradientText, motion-animationer, glaseffekter, dark theme. Inga nya designsystem.

---

### Sökord som sidan rankar for

Primära:
- "installera dörrlås"
- "installera yale doorman"
- "yale doorman installation"
- "smart dörrlås installation"
- "montera kodlås"

Long-tail:
- "installera yale doorman l3s flex"
- "yale doorman vs linus"
- "smart dörrlås ROT-avdrag"
- "byta dörrlås Uppsala"
- "kodlås ytterdörr installation Stockholm"
- "yale doorman pris installation"
- "nuki smart lock installation Sverige"

LSI/relaterade:
- "smarta hemlösningar"
- "hemmasäkerhet"
- "nyckelritt lås"
- "digitalt lås"
- "bluetooth lås"
