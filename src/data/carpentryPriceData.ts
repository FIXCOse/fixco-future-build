// ============================================================
// PRISGUIDE & EXTRA FAQ-DATA FÖR SNICKERI-RELATERADE TJÄNSTER
// ============================================================
// Prisintervall baserade på svenska marknadsdata 2024-2025.
// Alla priser avser arbetskostnad exkl. material, före ROT-avdrag.

export interface PriceRange {
  project: string;
  priceFrom: number;
  priceTo: number;
  unit: string; // 'kr', 'kr/kvm', 'kr/lm'
  note?: string;
}

export interface ServicePriceGuide {
  slug: string;
  headline: string;
  headlineEn: string;
  intro: string;
  introEn: string;
  prices: PriceRange[];
  pricesEn: { project: string; unit: string; note?: string }[];
  afterRotNote: string;
  afterRotNoteEn: string;
}

// ─── Snickeri-relaterade tjänster med prisdata ───
export const CARPENTRY_PRICE_GUIDES: Record<string, ServicePriceGuide> = {
  "snickare": {
    slug: "snickare",
    headline: "Vad kostar snickare i {area}?",
    headlineEn: "What does a carpenter cost in {area}?",
    intro: "Priserna varierar beroende på projektets omfattning. Nedan ser du typiska prisintervall för vanliga snickeriprojekt i {area} — alla priser avser arbetskostnad före ROT-avdrag.",
    introEn: "Prices vary depending on the scope of the project. Below are typical price ranges for common carpentry projects in {area} — all prices refer to labor costs before ROT deduction.",
    prices: [
      { project: "Köksrenovering (komplett)", priceFrom: 80000, priceTo: 180000, unit: "kr" },
      { project: "Altanbygge (20–30 kvm)", priceFrom: 40000, priceTo: 90000, unit: "kr" },
      { project: "Platsbyggd garderob", priceFrom: 15000, priceTo: 40000, unit: "kr" },
      { project: "Fönsterbyte (per fönster)", priceFrom: 3000, priceTo: 8000, unit: "kr" },
      { project: "Dörrbyte (per dörr)", priceFrom: 2500, priceTo: 6000, unit: "kr" },
      { project: "Golvläggning", priceFrom: 350, priceTo: 800, unit: "kr/kvm" },
      { project: "Tillbyggnad/utbyggnad", priceFrom: 150000, priceTo: 400000, unit: "kr" },
      { project: "Vindsinredning", priceFrom: 200000, priceTo: 500000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Kitchen renovation (complete)", unit: "SEK" },
      { project: "Deck building (20–30 sqm)", unit: "SEK" },
      { project: "Custom wardrobe", unit: "SEK" },
      { project: "Window replacement (per window)", unit: "SEK" },
      { project: "Door replacement (per door)", unit: "SEK" },
      { project: "Flooring installation", unit: "SEK/sqm" },
      { project: "Extension/addition", unit: "SEK" },
      { project: "Attic conversion", unit: "SEK" },
    ],
    afterRotNote: "Priserna ovan är före ROT-avdrag. Med 30% ROT-avdrag betalar du 70% av arbetskostnaden.",
    afterRotNoteEn: "Prices above are before ROT deduction. With 30% ROT deduction you pay 70% of labor cost.",
  },
  "koksrenovering": {
    slug: "koksrenovering",
    headline: "Vad kostar köksrenovering i {area}?",
    headlineEn: "What does kitchen renovation cost in {area}?",
    intro: "En köksrenovering i {area} varierar kraftigt i pris beroende på om du byter luckor, gör en delrenovering eller en totalrenovering. Här är typiska kostnader:",
    introEn: "Kitchen renovation costs in {area} vary greatly depending on whether you replace doors, do a partial or full renovation. Here are typical costs:",
    prices: [
      { project: "Byta köksluckor", priceFrom: 15000, priceTo: 35000, unit: "kr", note: "Snabbaste uppgraderingen" },
      { project: "Delrenovering (luckor + bänkskiva)", priceFrom: 30000, priceTo: 70000, unit: "kr" },
      { project: "Totalrenovering (allt nytt)", priceFrom: 80000, priceTo: 180000, unit: "kr" },
      { project: "IKEA-kök montering", priceFrom: 20000, priceTo: 50000, unit: "kr" },
      { project: "Platsbyggt kök", priceFrom: 120000, priceTo: 300000, unit: "kr", note: "Exklusivt & unikt" },
      { project: "Bänkskiva (sten/komposit)", priceFrom: 8000, priceTo: 25000, unit: "kr" },
      { project: "El- & VVS-arbete i kök", priceFrom: 15000, priceTo: 40000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Replace kitchen doors", unit: "SEK", note: "Quickest upgrade" },
      { project: "Partial renovation (doors + countertop)", unit: "SEK" },
      { project: "Full renovation (everything new)", unit: "SEK" },
      { project: "IKEA kitchen assembly", unit: "SEK" },
      { project: "Custom-built kitchen", unit: "SEK", note: "Exclusive & unique" },
      { project: "Countertop (stone/composite)", unit: "SEK" },
      { project: "Electrical & plumbing in kitchen", unit: "SEK" },
    ],
    afterRotNote: "Alla priser avser arbetskostnad före ROT-avdrag (30%). Material tillkommer.",
    afterRotNoteEn: "All prices refer to labor cost before ROT deduction (30%). Materials are additional.",
  },
  "badrumsrenovering": {
    slug: "badrumsrenovering",
    headline: "Vad kostar badrumsrenovering i {area}?",
    headlineEn: "What does bathroom renovation cost in {area}?",
    intro: "Badrumsrenovering i {area} kräver auktoriserade hantverkare för tätskikt. Här är vanliga prisintervall för olika typer av badrumsrenovering:",
    introEn: "Bathroom renovation in {area} requires certified contractors for waterproofing. Here are typical price ranges:",
    prices: [
      { project: "Litet badrum (3–5 kvm)", priceFrom: 80000, priceTo: 150000, unit: "kr" },
      { project: "Medelstort badrum (5–8 kvm)", priceFrom: 120000, priceTo: 220000, unit: "kr" },
      { project: "Stort badrum (8+ kvm)", priceFrom: 180000, priceTo: 350000, unit: "kr" },
      { project: "Byte av duschvägg", priceFrom: 5000, priceTo: 15000, unit: "kr" },
      { project: "Nytt tätskikt", priceFrom: 800, priceTo: 1500, unit: "kr/kvm" },
      { project: "Kakel & klinker (arbete)", priceFrom: 700, priceTo: 1200, unit: "kr/kvm" },
      { project: "Golvvärme i badrum", priceFrom: 8000, priceTo: 20000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Small bathroom (3–5 sqm)", unit: "SEK" },
      { project: "Medium bathroom (5–8 sqm)", unit: "SEK" },
      { project: "Large bathroom (8+ sqm)", unit: "SEK" },
      { project: "Shower screen replacement", unit: "SEK" },
      { project: "New waterproofing", unit: "SEK/sqm" },
      { project: "Tiling (labor)", unit: "SEK/sqm" },
      { project: "Underfloor heating in bathroom", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Alla tätskiktsarbeten utförs av GVK-auktoriserade hantverkare.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). All waterproofing is done by certified contractors.",
  },
  "altanbygge": {
    slug: "altanbygge",
    headline: "Vad kostar altanbygge i {area}?",
    headlineEn: "What does deck building cost in {area}?",
    intro: "Kostnaden för att bygga altan i {area} beror på storlek, material och om det krävs bygglov. Här är vanliga prisintervall:",
    introEn: "The cost of building a deck in {area} depends on size, material, and whether a building permit is needed:",
    prices: [
      { project: "Trädäck (15–25 kvm)", priceFrom: 30000, priceTo: 70000, unit: "kr" },
      { project: "Kompositdäck (15–25 kvm)", priceFrom: 45000, priceTo: 100000, unit: "kr", note: "Underhållsfritt" },
      { project: "Inglasad altan", priceFrom: 80000, priceTo: 200000, unit: "kr" },
      { project: "Altanräcke (per lm)", priceFrom: 800, priceTo: 2500, unit: "kr/lm" },
      { project: "Trappa till altan", priceFrom: 8000, priceTo: 25000, unit: "kr" },
      { project: "Pergola", priceFrom: 15000, priceTo: 50000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Wood deck (15–25 sqm)", unit: "SEK" },
      { project: "Composite deck (15–25 sqm)", unit: "SEK", note: "Maintenance-free" },
      { project: "Glazed patio", unit: "SEK" },
      { project: "Deck railing (per lm)", unit: "SEK/lm" },
      { project: "Deck stairs", unit: "SEK" },
      { project: "Pergola", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Observera att bygglov kan krävas för altaner högre än 1,2 meter.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Note that a building permit may be required for decks higher than 1.2 meters.",
  },
  "koksmontering": {
    slug: "koksmontering",
    headline: "Vad kostar köksmontering i {area}?",
    headlineEn: "What does kitchen assembly cost in {area}?",
    intro: "Kostnaden för köksmontering i {area} beror på kökets storlek och komplexitet. Här är vanliga prisintervall:",
    introEn: "The cost of kitchen assembly in {area} depends on the kitchen's size and complexity:",
    prices: [
      { project: "IKEA-kök (litet, rak)", priceFrom: 12000, priceTo: 25000, unit: "kr" },
      { project: "IKEA-kök (L-format/stort)", priceFrom: 25000, priceTo: 50000, unit: "kr" },
      { project: "Kök med köksö", priceFrom: 35000, priceTo: 65000, unit: "kr" },
      { project: "Bänkskiva montering", priceFrom: 3000, priceTo: 10000, unit: "kr" },
      { project: "Vitvaruinstallation (per enhet)", priceFrom: 1500, priceTo: 4000, unit: "kr" },
      { project: "Köksfläkt montering", priceFrom: 2000, priceTo: 5000, unit: "kr" },
    ],
    pricesEn: [
      { project: "IKEA kitchen (small, straight)", unit: "SEK" },
      { project: "IKEA kitchen (L-shaped/large)", unit: "SEK" },
      { project: "Kitchen with island", unit: "SEK" },
      { project: "Countertop installation", unit: "SEK" },
      { project: "Appliance installation (per unit)", unit: "SEK" },
      { project: "Range hood installation", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Inkluderar montering, justering och installationskontroll.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Includes assembly, adjustment, and installation check.",
  },
  // Expanded slugs that are snickeri-related
  "totalrenovering": {
    slug: "totalrenovering",
    headline: "Vad kostar totalrenovering i {area}?",
    headlineEn: "What does a full renovation cost in {area}?",
    intro: "En totalrenovering i {area} omfattar allt från rivning till färdigt resultat. Priserna varierar kraftigt beroende på bostadens storlek och skick:",
    introEn: "A full renovation in {area} covers everything from demolition to finished result. Prices vary greatly depending on property size and condition:",
    prices: [
      { project: "Lägenhet (50–70 kvm)", priceFrom: 300000, priceTo: 600000, unit: "kr" },
      { project: "Lägenhet (80–120 kvm)", priceFrom: 500000, priceTo: 900000, unit: "kr" },
      { project: "Villa (100–150 kvm)", priceFrom: 600000, priceTo: 1500000, unit: "kr" },
      { project: "Kök + badrum (paket)", priceFrom: 200000, priceTo: 400000, unit: "kr" },
      { project: "Enstaka rum", priceFrom: 40000, priceTo: 120000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Apartment (50–70 sqm)", unit: "SEK" },
      { project: "Apartment (80–120 sqm)", unit: "SEK" },
      { project: "Villa (100–150 sqm)", unit: "SEK" },
      { project: "Kitchen + bathroom (package)", unit: "SEK" },
      { project: "Single room", unit: "SEK" },
    ],
    afterRotNote: "Priserna inkluderar arbetskostnad och projektledning, före ROT-avdrag (30%). Material tillkommer.",
    afterRotNoteEn: "Prices include labor and project management, before ROT deduction (30%). Materials are additional.",
  },
  "husrenovering": {
    slug: "husrenovering",
    headline: "Vad kostar husrenovering i {area}?",
    headlineEn: "What does house renovation cost in {area}?",
    intro: "Renovering av hus i {area} kan innebära allt från ytskikt till stomme. Här är typiska kostnader:",
    introEn: "House renovation in {area} can range from surfaces to structural work. Here are typical costs:",
    prices: [
      { project: "Ytskiktsrenovering (hela huset)", priceFrom: 200000, priceTo: 500000, unit: "kr" },
      { project: "Kök + badrum", priceFrom: 200000, priceTo: 450000, unit: "kr" },
      { project: "Fasadrenovering", priceFrom: 80000, priceTo: 250000, unit: "kr" },
      { project: "Takrenovering", priceFrom: 100000, priceTo: 300000, unit: "kr" },
      { project: "Totalrenovering villa", priceFrom: 600000, priceTo: 1500000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Surface renovation (entire house)", unit: "SEK" },
      { project: "Kitchen + bathroom", unit: "SEK" },
      { project: "Facade renovation", unit: "SEK" },
      { project: "Roof renovation", unit: "SEK" },
      { project: "Full house renovation", unit: "SEK" },
    ],
    afterRotNote: "Alla priser avser arbetskostnad före ROT-avdrag (30%). Material och bygglov tillkommer vid behov.",
    afterRotNoteEn: "All prices refer to labor cost before ROT deduction (30%). Materials and building permits additional as needed.",
  },
};

// ─── Kontrollera om en slug har prisguide ───
export const hasPriceGuide = (slug: string): boolean => {
  return slug in CARPENTRY_PRICE_GUIDES;
};

export const getPriceGuide = (slug: string): ServicePriceGuide | null => {
  return CARPENTRY_PRICE_GUIDES[slug] || null;
};

// ─── EXTRA FAQs för snickeri-tjänster (utöver standardfrågor) ───
export interface ExtraFaq {
  q: string;
  a: string;
}

export const CARPENTRY_EXTRA_FAQS: Record<string, { sv: ExtraFaq[]; en: ExtraFaq[] }> = {
  "snickare": {
    sv: [
      { q: "Behöver jag bygglov för min renovering i {area}?", a: "Det beror på renoveringens omfattning. Invändiga ändringar som köksrenovering kräver sällan bygglov. Tillbyggnader, altaner över 1,2 meter och fasadändringar kan kräva bygglov. Vi hjälper dig att kontrollera vad som gäller för ditt projekt i {area}." },
      { q: "Vad är skillnaden mellan ROT-avdrag och vanligt avdrag?", a: "ROT-avdrag ger dig 30% rabatt direkt på arbetskostnaden, upp till 50 000 kr per person och år. Du behöver inte göra avdraget i deklarationen — vi ansöker om det hos Skatteverket åt dig. Det gäller för reparation, underhåll, om- och tillbyggnad av bostaden." },
      { q: "Hur lång tid tar en köksrenovering i {area}?", a: "En komplett köksrenovering tar normalt max 1–2 veckor beroende på projektets omfattning. Byter du bara luckor och bänkskiva kan det gå på ett par dagar. Vi ger dig en exakt tidsplan vid offerten." },
      { q: "Kan ni hjälpa med ritningar och planering?", a: "Ja! Vi hjälper med allt från mätning och planering till val av material. För större projekt som tillbyggnader kan vi rekommendera arkitekter vi samarbetar med i {area}." },
      { q: "Vad ingår i ert fasta pris?", a: "Vårt fasta pris inkluderar all arbetskostnad, projektledning och slutstädning. Material specificeras separat så du har full kontroll. Inga dolda kostnader — priset du får i offerten är priset du betalar." },
    ],
    en: [
      { q: "Do I need a building permit for my renovation in {area}?", a: "It depends on the scope. Interior changes like kitchen renovation rarely need a permit. Extensions, decks over 1.2m, and facade changes may require one. We help you check what applies to your project in {area}." },
      { q: "What's the difference between ROT deduction and regular tax deduction?", a: "ROT gives you 30% off labor costs directly, up to 50,000 SEK per person per year. You don't need to claim it in your tax return — we apply for it with the Swedish Tax Agency on your behalf." },
      { q: "How long does a kitchen renovation take in {area}?", a: "A complete kitchen renovation typically takes 1–2 weeks depending on scope. Replacing just doors and countertop can be done in a few days. We provide an exact timeline with your quote." },
      { q: "Can you help with drawings and planning?", a: "Yes! We help with everything from measuring and planning to material selection. For larger projects like extensions, we can recommend architects we work with in {area}." },
      { q: "What's included in your fixed price?", a: "Our fixed price includes all labor, project management, and final cleanup. Materials are specified separately so you have full control. No hidden costs." },
    ]
  },
  "koksrenovering": {
    sv: [
      { q: "IKEA-kök eller platsbyggt kök — vad är bäst?", a: "IKEA-kök ger bra kvalitet till lägre pris och snabbare leverans. Platsbyggt kök ger maximal anpassning och unika lösningar. Prisskillnaden är ca 40–60%. Vi monterar båda typerna i {area}." },
      { q: "Kan jag bo kvar under köksrenoveringen?", a: "Ja, de flesta bor kvar. Vi planerar arbetet i etapper och ser till att du har tillgång till vatten och el. Tips: ställ upp ett tillfälligt kök i ett annat rum med micro, vattenkokare och kylskåp." },
      { q: "Vad ska jag tänka på vid val av bänkskiva?", a: "Laminat är prisvärt (från 2 000 kr), komposit ger hållbarhet (8 000–15 000 kr), och sten som granit/marmor är lyxigast (12 000–25 000 kr). Vi rekommenderar komposit för bästa pris/kvalitet." },
      { q: "Hur mycket höjer en köksrenovering bostadens värde?", a: "En modern köksrenovering kan höja bostadens värde med 5–15% enligt svenska mäklare. I {area} är köket ofta det viktigaste rummet vid försäljning." },
      { q: "Behövs det elektriker och rörmokare vid köksrenovering?", a: "Ja, el- och VVS-arbete ska alltid utföras av behöriga hantverkare. Vi koordinerar alla hantverkare åt dig — snickare, elektriker och rörmokare — så du har en kontaktperson genom hela projektet." },
    ],
    en: [
      { q: "IKEA kitchen or custom-built — which is best?", a: "IKEA kitchens offer good quality at lower cost with faster delivery. Custom kitchens provide maximum customization and unique solutions. The price difference is about 40–60%. We install both types in {area}." },
      { q: "Can I stay at home during the kitchen renovation?", a: "Yes, most people do. We plan the work in stages and ensure you have access to water and electricity. Tip: set up a temporary kitchen in another room." },
      { q: "What should I consider when choosing a countertop?", a: "Laminate is affordable (from 2,000 SEK), composite offers durability (8,000–15,000 SEK), and stone like granite/marble is most luxurious (12,000–25,000 SEK)." },
      { q: "How much does a kitchen renovation increase property value?", a: "A modern kitchen renovation can increase property value by 5–15% according to Swedish real estate agents. In {area}, the kitchen is often the most important room when selling." },
      { q: "Do I need an electrician and plumber for kitchen renovation?", a: "Yes, electrical and plumbing work must always be done by certified professionals. We coordinate all contractors for you — carpenter, electrician, and plumber." },
    ]
  },
  "badrumsrenovering": {
    sv: [
      { q: "Varför är badrumsrenovering så dyrt?", a: "Badrummet kräver specialkompetens: GVK-auktoriserat tätskikt, VVS-arbete, el-arbete och plattsättning. Varje steg måste göras korrekt för att undvika fuktskador. Det är den mest tekniskt krävande renoveringen i hemmet." },
      { q: "Vad är GVK-auktorisering och varför behövs det?", a: "GVK (Golvbranschens Våtrumskommitté) certifierar hantverkare som utför tätskiktsarbeten. Utan GVK-intyg riskerar du att försäkringen inte täcker eventuella fuktskador. Alla våra badrumsrenoveringar i {area} utförs av GVK-auktoriserade hantverkare." },
      { q: "Hur lång tid tar en badrumsrenovering i {area}?", a: "En komplett badrumsrenovering tar normalt 3–5 veckor. Det inkluderar rivning, VVS, tätskikt, plattsättning och montering. Vi ger dig en detaljerad tidsplan i offerten." },
      { q: "Kan jag välja vilka plattor jag vill ha?", a: "Absolut! Du väljer själv kakel och klinker. Vi kan rekommendera kakelleverantörer i {area} med bra urval och priser. Tips: beställ 10% extra plattor för eventuella skärningar och framtida reparationer." },
      { q: "Vad händer om det upptäcks fuktskador?", a: "Om vi hittar fuktskador vid rivningen dokumenterar vi detta noggrant och ger dig ett tilläggsförslag innan vi går vidare. Du betalar aldrig för överraskningar utan godkännande." },
    ],
    en: [
      { q: "Why is bathroom renovation so expensive?", a: "Bathrooms require specialized skills: certified waterproofing, plumbing, electrical, and tiling. Each step must be done correctly to prevent moisture damage." },
      { q: "What is GVK certification and why is it needed?", a: "GVK certifies contractors who perform waterproofing work. Without GVK certification, your insurance may not cover potential moisture damage. All our bathroom renovations in {area} are done by GVK-certified contractors." },
      { q: "How long does a bathroom renovation take in {area}?", a: "A complete bathroom renovation typically takes 3–5 weeks, including demolition, plumbing, waterproofing, tiling, and installation." },
      { q: "Can I choose my own tiles?", a: "Absolutely! You choose your own tiles. We can recommend tile suppliers in {area}. Tip: order 10% extra for cuts and future repairs." },
      { q: "What happens if moisture damage is discovered?", a: "If we find moisture damage during demolition, we document it thoroughly and give you a supplementary proposal before proceeding. You never pay for surprises without approval." },
    ]
  },
  "altanbygge": {
    sv: [
      { q: "Behöver jag bygglov för altan i {area}?", a: "Altaner under 1,2 meter från marken kräver normalt inte bygglov. Inglasade altaner och altaner med tak kan kräva bygglov. Vi hjälper dig kontrollera reglerna som gäller i {area}s kommun." },
      { q: "Trä eller komposit — vad ska jag välja?", a: "Tryckimpregnerat trä är billigast men kräver underhåll. Värmebehandlat trä (t.ex. ThermoWood) ger fin look utan kemikalier. Komposit kostar mer men är i princip underhållsfritt. Vi rekommenderar komposit om du vill slippa underhåll." },
      { q: "Hur lång tid tar det att bygga en altan i {area}?", a: "En vanlig altan (15–25 kvm) tar normalt 3–5 arbetsdagar att bygga. Inglasade altaner eller altaner med pergola kan ta 1–2 veckor. Bästa tiden att bygga altan är april–september." },
      { q: "Vilken grund behövs under altanen?", a: "De vanligaste grundalternativen är plintar (enklast), balksko (för fristående altan) eller gjuten platta (för inglasad altan). Vi rekommenderar rätt grund utifrån markförhållandena vid ditt hem i {area}." },
    ],
    en: [
      { q: "Do I need a building permit for a deck in {area}?", a: "Decks under 1.2 meters from ground level typically don't require a permit. Glazed decks and decks with roofs may require one. We help you check the regulations in {area}." },
      { q: "Wood or composite — what should I choose?", a: "Pressure-treated wood is cheapest but requires maintenance. Composite costs more but is virtually maintenance-free. We recommend composite if you want to avoid upkeep." },
      { q: "How long does it take to build a deck in {area}?", a: "A standard deck (15–25 sqm) typically takes 3–5 working days. Glazed decks or decks with pergola can take 1–2 weeks." },
      { q: "What foundation is needed under the deck?", a: "The most common options are concrete piers (simplest), beam shoes (for freestanding decks), or poured slab (for glazed decks). We recommend the right foundation based on ground conditions at your home in {area}." },
    ]
  },
  "koksmontering": {
    sv: [
      { q: "Kan jag köpa köket själv och bara anlita er för montering?", a: "Ja! Många kunder köper sitt IKEA-kök själva och anlitar oss för montering. Vi monterar alla kökstyper — IKEA, HTH, Ballingslöv, Marbodal med flera. Du sparar pengar genom att separera köp och montering." },
      { q: "Vad ska vara klart innan köksmonteringen börjar?", a: "El- och VVS-dragning ska vara klart, golvet lagt, och väggarna målade. Vi kan koordinera alla förberedelser åt dig om du vill ha en helhetslösning i {area}." },
      { q: "Hur lång tid tar en köksmontering?", a: "Ett rakt IKEA-kök tar 1–2 dagar. Ett L-format kök med köksö tar 2–4 dagar. Vi bokar in exakt tid vid offerten så du kan planera." },
      { q: "Ingår vitvaruinstallation i köksmonteringen?", a: "Ja, vi monterar diskmaskin, ugn, häll och kyl/frys. Spis- och vattenanslutning kräver behörig elektriker/rörmokare — vi samordnar det åt dig." },
    ],
    en: [
      { q: "Can I buy the kitchen myself and just hire you for assembly?", a: "Yes! Many customers buy their IKEA kitchen themselves and hire us for assembly. We assemble all kitchen types — IKEA, HTH, Ballingslöv, Marbodal and more." },
      { q: "What should be ready before kitchen assembly starts?", a: "Electrical and plumbing should be done, flooring laid, and walls painted. We can coordinate all preparations for you in {area}." },
      { q: "How long does kitchen assembly take?", a: "A straight IKEA kitchen takes 1–2 days. An L-shaped kitchen with island takes 2–4 days." },
      { q: "Does appliance installation come included?", a: "Yes, we install dishwasher, oven, hob, and fridge/freezer. Stove and water connections require certified electrician/plumber — we coordinate that for you." },
    ]
  },
};

// ─── Hämta extra FAQs med area-replacement ───
export const getExtraFaqs = (slug: string, area: string, locale: 'sv' | 'en'): ExtraFaq[] => {
  const data = CARPENTRY_EXTRA_FAQS[slug];
  if (!data) return [];
  const faqs = locale === 'sv' ? data.sv : data.en;
  return faqs.map(faq => ({
    q: faq.q.replace(/\{area\}/g, area),
    a: faq.a.replace(/\{area\}/g, area),
  }));
};
