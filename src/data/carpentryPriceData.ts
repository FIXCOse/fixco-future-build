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
  // ─── Golvläggning & golv ───
  "golvlaggning": {
    slug: "golvlaggning",
    headline: "Vad kostar golvläggning i {area}?",
    headlineEn: "What does flooring installation cost in {area}?",
    intro: "Priset för golvläggning i {area} beror på golvtyp och underlagets skick. Här är typiska kostnader:",
    introEn: "Flooring costs in {area} depend on floor type and subfloor condition. Here are typical costs:",
    prices: [
      { project: "Laminatgolv", priceFrom: 250, priceTo: 450, unit: "kr/kvm" },
      { project: "Parkett", priceFrom: 400, priceTo: 700, unit: "kr/kvm" },
      { project: "Vinylgolv (LVT/SPC)", priceFrom: 300, priceTo: 550, unit: "kr/kvm" },
      { project: "Klinkergolv", priceFrom: 600, priceTo: 1100, unit: "kr/kvm" },
      { project: "Rivning av befintligt golv", priceFrom: 80, priceTo: 200, unit: "kr/kvm" },
      { project: "Avjämning/golvspackling", priceFrom: 120, priceTo: 250, unit: "kr/kvm" },
    ],
    pricesEn: [
      { project: "Laminate flooring", unit: "SEK/sqm" },
      { project: "Parquet", unit: "SEK/sqm" },
      { project: "Vinyl flooring (LVT/SPC)", unit: "SEK/sqm" },
      { project: "Tile flooring", unit: "SEK/sqm" },
      { project: "Removal of existing floor", unit: "SEK/sqm" },
      { project: "Floor leveling", unit: "SEK/sqm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials are additional.",
  },
  "golvslipning": {
    slug: "golvslipning",
    headline: "Vad kostar golvslipning i {area}?",
    headlineEn: "What does floor sanding cost in {area}?",
    intro: "Golvslipning i {area} fräschar upp trägolv och ger dem nytt liv. Priset beror på golvets skick och yta:",
    introEn: "Floor sanding in {area} refreshes wooden floors. Price depends on condition and area:",
    prices: [
      { project: "Slipning + lackning", priceFrom: 250, priceTo: 450, unit: "kr/kvm" },
      { project: "Slipning + oljning", priceFrom: 280, priceTo: 500, unit: "kr/kvm" },
      { project: "Enbart slipning", priceFrom: 180, priceTo: 300, unit: "kr/kvm" },
      { project: "Mellanslipning + omlackning", priceFrom: 150, priceTo: 280, unit: "kr/kvm" },
      { project: "Trappslipning (per steg)", priceFrom: 300, priceTo: 600, unit: "kr" },
    ],
    pricesEn: [
      { project: "Sanding + lacquering", unit: "SEK/sqm" },
      { project: "Sanding + oiling", unit: "SEK/sqm" },
      { project: "Sanding only", unit: "SEK/sqm" },
      { project: "Light sanding + re-lacquer", unit: "SEK/sqm" },
      { project: "Stair sanding (per step)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Lacka/olja ingår normalt i priset.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Lacquer/oil is normally included.",
  },
  "parkettlaggning": {
    slug: "parkettlaggning",
    headline: "Vad kostar parkettläggning i {area}?",
    headlineEn: "What does parquet installation cost in {area}?",
    intro: "Parkettläggning i {area} ger ett elegant och hållbart golv. Priset varierar med parkettens kvalitet:",
    introEn: "Parquet installation in {area} provides an elegant and durable floor. Prices vary with quality:",
    prices: [
      { project: "3-stav parkett (standard)", priceFrom: 350, priceTo: 550, unit: "kr/kvm" },
      { project: "1-stav parkett (plank)", priceFrom: 450, priceTo: 750, unit: "kr/kvm" },
      { project: "Fiskbensmönster", priceFrom: 550, priceTo: 900, unit: "kr/kvm", note: "Mer tidskrävande" },
      { project: "Avjämning + läggning", priceFrom: 500, priceTo: 800, unit: "kr/kvm" },
    ],
    pricesEn: [
      { project: "3-strip parquet (standard)", unit: "SEK/sqm" },
      { project: "1-strip parquet (plank)", unit: "SEK/sqm" },
      { project: "Herringbone pattern", unit: "SEK/sqm", note: "More time-consuming" },
      { project: "Leveling + installation", unit: "SEK/sqm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Parkett/material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Parquet/materials additional.",
  },
  "laminatgolv": {
    slug: "laminatgolv",
    headline: "Vad kostar laminatgolv i {area}?",
    headlineEn: "What does laminate flooring cost in {area}?",
    intro: "Laminatgolv i {area} är ett prisvärt och tåligt alternativ. Här är vanliga kostnader:",
    introEn: "Laminate flooring in {area} is an affordable and durable option. Here are typical costs:",
    prices: [
      { project: "Laminat (standard)", priceFrom: 200, priceTo: 350, unit: "kr/kvm" },
      { project: "Laminat (premium/vattentåligt)", priceFrom: 300, priceTo: 500, unit: "kr/kvm" },
      { project: "Inkl. rivning av gammalt golv", priceFrom: 350, priceTo: 550, unit: "kr/kvm" },
      { project: "Avjämning + läggning", priceFrom: 400, priceTo: 600, unit: "kr/kvm" },
    ],
    pricesEn: [
      { project: "Laminate (standard)", unit: "SEK/sqm" },
      { project: "Laminate (premium/waterproof)", unit: "SEK/sqm" },
      { project: "Including old floor removal", unit: "SEK/sqm" },
      { project: "Leveling + installation", unit: "SEK/sqm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material beställs separat.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials ordered separately.",
  },
  "vinylgolv": {
    slug: "vinylgolv",
    headline: "Vad kostar vinylgolv i {area}?",
    headlineEn: "What does vinyl flooring cost in {area}?",
    intro: "Vinylgolv (LVT/SPC) i {area} är vattentåligt och slitstark. Priserna varierar med typ och kvalitet:",
    introEn: "Vinyl flooring (LVT/SPC) in {area} is waterproof and durable. Prices vary by type:",
    prices: [
      { project: "Klickvinyl (SPC)", priceFrom: 250, priceTo: 450, unit: "kr/kvm" },
      { project: "Lim-vinyl (LVT)", priceFrom: 300, priceTo: 500, unit: "kr/kvm" },
      { project: "Våtrumsvinyl", priceFrom: 350, priceTo: 550, unit: "kr/kvm", note: "Inkl. fog" },
      { project: "Rivning + ny vinyl", priceFrom: 400, priceTo: 650, unit: "kr/kvm" },
    ],
    pricesEn: [
      { project: "Click vinyl (SPC)", unit: "SEK/sqm" },
      { project: "Glue-down vinyl (LVT)", unit: "SEK/sqm" },
      { project: "Wet room vinyl", unit: "SEK/sqm", note: "Including sealing" },
      { project: "Removal + new vinyl", unit: "SEK/sqm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials additional.",
  },
  "golvbyte": {
    slug: "golvbyte",
    headline: "Vad kostar golvbyte i {area}?",
    headlineEn: "What does floor replacement cost in {area}?",
    intro: "Golvbyte i {area} inkluderar rivning av gammalt golv plus nytt golv. Priset beror på golvtyp:",
    introEn: "Floor replacement in {area} includes removal of old floor plus new floor:",
    prices: [
      { project: "Laminat (rivning + nytt)", priceFrom: 350, priceTo: 600, unit: "kr/kvm" },
      { project: "Parkett (rivning + nytt)", priceFrom: 500, priceTo: 850, unit: "kr/kvm" },
      { project: "Vinyl (rivning + nytt)", priceFrom: 400, priceTo: 700, unit: "kr/kvm" },
      { project: "Klinker (rivning + nytt)", priceFrom: 700, priceTo: 1300, unit: "kr/kvm" },
    ],
    pricesEn: [
      { project: "Laminate (removal + new)", unit: "SEK/sqm" },
      { project: "Parquet (removal + new)", unit: "SEK/sqm" },
      { project: "Vinyl (removal + new)", unit: "SEK/sqm" },
      { project: "Tile (removal + new)", unit: "SEK/sqm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material och avfallshantering tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials and waste disposal additional.",
  },

  // ─── Målning ───
  "malare": {
    slug: "malare",
    headline: "Vad kostar målare i {area}?",
    headlineEn: "What does a painter cost in {area}?",
    intro: "Målningskostnad i {area} beror på yta, underlag och antal strykningar. Vanliga priser:",
    introEn: "Painting costs in {area} depend on surface, substrate and number of coats:",
    prices: [
      { project: "Invändig målning (väggar)", priceFrom: 120, priceTo: 250, unit: "kr/kvm" },
      { project: "Takmålning", priceFrom: 100, priceTo: 200, unit: "kr/kvm" },
      { project: "Fasadmålning (trähus)", priceFrom: 200, priceTo: 400, unit: "kr/kvm" },
      { project: "Snickerimålning (foder/lister)", priceFrom: 80, priceTo: 180, unit: "kr/lm" },
      { project: "Fönstermålning (per fönster)", priceFrom: 1500, priceTo: 4000, unit: "kr" },
      { project: "Tapetsering", priceFrom: 200, priceTo: 400, unit: "kr/kvm" },
    ],
    pricesEn: [
      { project: "Interior painting (walls)", unit: "SEK/sqm" },
      { project: "Ceiling painting", unit: "SEK/sqm" },
      { project: "Exterior painting (wood house)", unit: "SEK/sqm" },
      { project: "Trim painting (molding)", unit: "SEK/lm" },
      { project: "Window painting (per window)", unit: "SEK" },
      { project: "Wallpapering", unit: "SEK/sqm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Färg/tapet tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Paint/wallpaper additional.",
  },
  "fasadmalning": {
    slug: "fasadmalning",
    headline: "Vad kostar fasadmålning i {area}?",
    headlineEn: "What does exterior painting cost in {area}?",
    intro: "Fasadmålning i {area} kräver rätt färg och noggrann förbehandling. Vanliga priser:",
    introEn: "Exterior painting in {area} requires proper paint and careful preparation:",
    prices: [
      { project: "Trähus (normal storlek)", priceFrom: 40000, priceTo: 100000, unit: "kr" },
      { project: "Villa (stor)", priceFrom: 80000, priceTo: 160000, unit: "kr" },
      { project: "Per kvm (inkl. förbehandling)", priceFrom: 200, priceTo: 400, unit: "kr/kvm" },
      { project: "Enbart gavlar", priceFrom: 15000, priceTo: 40000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Wood house (normal size)", unit: "SEK" },
      { project: "Villa (large)", unit: "SEK" },
      { project: "Per sqm (incl. preparation)", unit: "SEK/sqm" },
      { project: "Gable ends only", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Ställning och färg tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Scaffolding and paint additional.",
  },
  "inomhusmalning": {
    slug: "inomhusmalning",
    headline: "Vad kostar inomhusmålning i {area}?",
    headlineEn: "What does interior painting cost in {area}?",
    intro: "Inomhusmålning i {area} varierar beroende på rum och yta. Här är vanliga priser:",
    introEn: "Interior painting costs in {area} vary by room and surface:",
    prices: [
      { project: "Vardagsrum (30 kvm väggar)", priceFrom: 5000, priceTo: 12000, unit: "kr" },
      { project: "Sovrum", priceFrom: 3500, priceTo: 8000, unit: "kr" },
      { project: "Hall/entré", priceFrom: 3000, priceTo: 7000, unit: "kr" },
      { project: "Hel lägenhet (3 rum)", priceFrom: 15000, priceTo: 35000, unit: "kr" },
      { project: "Hel villa (invändigt)", priceFrom: 30000, priceTo: 80000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Living room (30 sqm walls)", unit: "SEK" },
      { project: "Bedroom", unit: "SEK" },
      { project: "Hallway/entrance", unit: "SEK" },
      { project: "Full apartment (3 rooms)", unit: "SEK" },
      { project: "Full villa (interior)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad inkl. spackling före ROT-avdrag (30%). Färg tillkommer.",
    afterRotNoteEn: "Prices include labor and filling, before ROT deduction (30%). Paint additional.",
  },
  "tapetsering": {
    slug: "tapetsering",
    headline: "Vad kostar tapetsering i {area}?",
    headlineEn: "What does wallpapering cost in {area}?",
    intro: "Tapetsering i {area} ger en helt ny känsla i rummet. Priset beror på tapet och väggskick:",
    introEn: "Wallpapering in {area} transforms any room. Prices depend on wallpaper and wall condition:",
    prices: [
      { project: "Standard tapet (per kvm)", priceFrom: 200, priceTo: 350, unit: "kr/kvm" },
      { project: "Premiumtapet/mönstermatchning", priceFrom: 300, priceTo: 500, unit: "kr/kvm" },
      { project: "Borttagning av gammal tapet", priceFrom: 80, priceTo: 150, unit: "kr/kvm" },
      { project: "Fondvägg", priceFrom: 2000, priceTo: 5000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Standard wallpaper (per sqm)", unit: "SEK/sqm" },
      { project: "Premium/pattern-matching", unit: "SEK/sqm" },
      { project: "Old wallpaper removal", unit: "SEK/sqm" },
      { project: "Feature wall", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före RUT-avdrag. Tapet beställs separat.",
    afterRotNoteEn: "Prices refer to labor cost before RUT deduction. Wallpaper ordered separately.",
  },

  // ─── Mark & sten ───
  "markarbeten": {
    slug: "markarbeten",
    headline: "Vad kostar markarbeten i {area}?",
    headlineEn: "What does groundwork cost in {area}?",
    intro: "Markarbeten i {area} inkluderar schaktning, dränering och planering. Vanliga priser:",
    introEn: "Groundwork in {area} includes excavation, drainage and grading:",
    prices: [
      { project: "Schaktning (per kbm)", priceFrom: 200, priceTo: 500, unit: "kr/kbm" },
      { project: "Dränering runt hus", priceFrom: 80000, priceTo: 200000, unit: "kr" },
      { project: "Garageuppfart (markarbete)", priceFrom: 30000, priceTo: 80000, unit: "kr" },
      { project: "Planering/utfyllnad", priceFrom: 150, priceTo: 350, unit: "kr/kvm" },
      { project: "Murverk/stödmur", priceFrom: 3000, priceTo: 8000, unit: "kr/lm" },
    ],
    pricesEn: [
      { project: "Excavation (per cbm)", unit: "SEK/cbm" },
      { project: "Drainage around house", unit: "SEK" },
      { project: "Driveway (groundwork)", unit: "SEK" },
      { project: "Grading/filling", unit: "SEK/sqm" },
      { project: "Retaining wall", unit: "SEK/lm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Materialtransport och deponi tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Transport and disposal additional.",
  },
  "plattlaggning": {
    slug: "plattlaggning",
    headline: "Vad kostar plattläggning i {area}?",
    headlineEn: "What does paving cost in {area}?",
    intro: "Plattläggning i {area} ger en snygg och hållbar utomhusyta. Priser varierar med plattval:",
    introEn: "Paving in {area} creates a beautiful outdoor surface. Prices vary by stone type:",
    prices: [
      { project: "Betongplattor", priceFrom: 400, priceTo: 700, unit: "kr/kvm" },
      { project: "Natursten", priceFrom: 600, priceTo: 1200, unit: "kr/kvm" },
      { project: "Gatsten", priceFrom: 500, priceTo: 1000, unit: "kr/kvm" },
      { project: "Markberedning + läggning", priceFrom: 700, priceTo: 1400, unit: "kr/kvm" },
    ],
    pricesEn: [
      { project: "Concrete pavers", unit: "SEK/sqm" },
      { project: "Natural stone", unit: "SEK/sqm" },
      { project: "Cobblestone", unit: "SEK/sqm" },
      { project: "Ground prep + installation", unit: "SEK/sqm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Sten/plattor och grus tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Stone and gravel additional.",
  },
  "stenlaggning": {
    slug: "stenlaggning",
    headline: "Vad kostar stenläggning i {area}?",
    headlineEn: "What does stone laying cost in {area}?",
    intro: "Stenläggning i {area} skapar hållbara och eleganta ytor utomhus:",
    introEn: "Stone laying in {area} creates durable and elegant outdoor surfaces:",
    prices: [
      { project: "Gatsten (uppfart)", priceFrom: 500, priceTo: 1000, unit: "kr/kvm" },
      { project: "Natursten (plattor)", priceFrom: 600, priceTo: 1200, unit: "kr/kvm" },
      { project: "Kantsten (per lm)", priceFrom: 200, priceTo: 500, unit: "kr/lm" },
      { project: "Komplett uppfart (30 kvm)", priceFrom: 25000, priceTo: 60000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Cobblestone (driveway)", unit: "SEK/sqm" },
      { project: "Natural stone (pavers)", unit: "SEK/sqm" },
      { project: "Curb stone (per lm)", unit: "SEK/lm" },
      { project: "Complete driveway (30 sqm)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Sten och underlag tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Stone and base additional.",
  },
  "dranering": {
    slug: "dranering",
    headline: "Vad kostar dränering i {area}?",
    headlineEn: "What does drainage cost in {area}?",
    intro: "Dränering i {area} skyddar husgrunden mot fukt. Priset beror på husets storlek och markförhållanden:",
    introEn: "Drainage in {area} protects the foundation from moisture. Costs depend on house size and soil:",
    prices: [
      { project: "Villa (normalt)", priceFrom: 80000, priceTo: 180000, unit: "kr" },
      { project: "Radhus/parhus", priceFrom: 50000, priceTo: 120000, unit: "kr" },
      { project: "Per löpmeter", priceFrom: 2000, priceTo: 5000, unit: "kr/lm" },
      { project: "Inkl. isolering av grund", priceFrom: 120000, priceTo: 280000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Villa (normal)", unit: "SEK" },
      { project: "Townhouse", unit: "SEK" },
      { project: "Per linear meter", unit: "SEK/lm" },
      { project: "Including foundation insulation", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Grävning, rör och isolering tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Excavation, pipes and insulation additional.",
  },

  // ─── Montering & rivning ───
  "montering": {
    slug: "montering",
    headline: "Vad kostar montering i {area}?",
    headlineEn: "What does assembly/installation cost in {area}?",
    intro: "Monteringskostnader i {area} varierar beroende på vad som ska monteras:",
    introEn: "Assembly costs in {area} vary depending on the item:",
    prices: [
      { project: "Garderobsmontering (PAX)", priceFrom: 2000, priceTo: 6000, unit: "kr" },
      { project: "TV-montering på vägg", priceFrom: 800, priceTo: 2500, unit: "kr" },
      { project: "Hyllsystem", priceFrom: 1500, priceTo: 4000, unit: "kr" },
      { project: "Dörrmontering (per dörr)", priceFrom: 1500, priceTo: 4000, unit: "kr" },
      { project: "Persiennmontering", priceFrom: 500, priceTo: 1500, unit: "kr" },
      { project: "IKEA-möbler (per timme)", priceFrom: 400, priceTo: 600, unit: "kr/h" },
    ],
    pricesEn: [
      { project: "Wardrobe assembly (PAX)", unit: "SEK" },
      { project: "TV wall mounting", unit: "SEK" },
      { project: "Shelving system", unit: "SEK" },
      { project: "Door installation (per door)", unit: "SEK" },
      { project: "Blind installation", unit: "SEK" },
      { project: "IKEA furniture (per hour)", unit: "SEK/h" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT/RUT-avdrag. Infästningsmaterial ingår normalt.",
    afterRotNoteEn: "Prices refer to labor cost before ROT/RUT deduction. Mounting hardware normally included.",
  },
  "rivning": {
    slug: "rivning",
    headline: "Vad kostar rivning i {area}?",
    headlineEn: "What does demolition cost in {area}?",
    intro: "Rivningskostnader i {area} beror på omfattning och avfallshantering:",
    introEn: "Demolition costs in {area} depend on scope and waste handling:",
    prices: [
      { project: "Badrumsrivning", priceFrom: 8000, priceTo: 20000, unit: "kr" },
      { project: "Köksrivning", priceFrom: 6000, priceTo: 15000, unit: "kr" },
      { project: "Väggrivning (icke-bärande)", priceFrom: 3000, priceTo: 8000, unit: "kr" },
      { project: "Golvrivning (per kvm)", priceFrom: 80, priceTo: 250, unit: "kr/kvm" },
      { project: "Container + bortforsling", priceFrom: 3000, priceTo: 8000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Bathroom demolition", unit: "SEK" },
      { project: "Kitchen demolition", unit: "SEK" },
      { project: "Wall demolition (non-load-bearing)", unit: "SEK" },
      { project: "Floor demolition (per sqm)", unit: "SEK/sqm" },
      { project: "Container + waste removal", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Deponiavgifter tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Disposal fees additional.",
  },

  // ─── Renoveringstyper ───
  "renovering": {
    slug: "renovering",
    headline: "Vad kostar renovering i {area}?",
    headlineEn: "What does renovation cost in {area}?",
    intro: "Renoveringskostnader i {area} varierar stort beroende på typ och omfattning:",
    introEn: "Renovation costs in {area} vary greatly depending on type and scope:",
    prices: [
      { project: "Enstaka rum", priceFrom: 30000, priceTo: 100000, unit: "kr" },
      { project: "Kök", priceFrom: 80000, priceTo: 180000, unit: "kr" },
      { project: "Badrum", priceFrom: 80000, priceTo: 250000, unit: "kr" },
      { project: "Lägenhet (komplett)", priceFrom: 300000, priceTo: 800000, unit: "kr" },
      { project: "Villa (komplett)", priceFrom: 500000, priceTo: 1500000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Single room", unit: "SEK" },
      { project: "Kitchen", unit: "SEK" },
      { project: "Bathroom", unit: "SEK" },
      { project: "Apartment (complete)", unit: "SEK" },
      { project: "Villa (complete)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material och bygglov tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials and permits additional.",
  },
  "villarenovering": {
    slug: "villarenovering",
    headline: "Vad kostar villarenovering i {area}?",
    headlineEn: "What does villa renovation cost in {area}?",
    intro: "Villarenovering i {area} kan omfatta allt från ytskikt till stomme. Typiska kostnader:",
    introEn: "Villa renovation in {area} can range from surfaces to structural. Typical costs:",
    prices: [
      { project: "Ytskiktsrenovering", priceFrom: 200000, priceTo: 500000, unit: "kr" },
      { project: "Kök + badrum", priceFrom: 200000, priceTo: 450000, unit: "kr" },
      { project: "Totalrenovering", priceFrom: 600000, priceTo: 1500000, unit: "kr" },
      { project: "Fasad + tak", priceFrom: 200000, priceTo: 500000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Surface renovation", unit: "SEK" },
      { project: "Kitchen + bathroom", unit: "SEK" },
      { project: "Full renovation", unit: "SEK" },
      { project: "Facade + roof", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Projektledning ingår.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Project management included.",
  },
  "lagenhetsrenovering": {
    slug: "lagenhetsrenovering",
    headline: "Vad kostar lägenhetsrenovering i {area}?",
    headlineEn: "What does apartment renovation cost in {area}?",
    intro: "Lägenhetsrenovering i {area} kräver ofta samordning med BRF. Vanliga priser:",
    introEn: "Apartment renovation in {area} often requires coordination with the housing association:",
    prices: [
      { project: "1–2 rum (ytskikt)", priceFrom: 60000, priceTo: 150000, unit: "kr" },
      { project: "3 rum (komplett)", priceFrom: 200000, priceTo: 500000, unit: "kr" },
      { project: "4+ rum (komplett)", priceFrom: 350000, priceTo: 800000, unit: "kr" },
      { project: "Kök + badrum (paket)", priceFrom: 180000, priceTo: 400000, unit: "kr" },
    ],
    pricesEn: [
      { project: "1–2 rooms (surfaces)", unit: "SEK" },
      { project: "3 rooms (complete)", unit: "SEK" },
      { project: "4+ rooms (complete)", unit: "SEK" },
      { project: "Kitchen + bathroom (package)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Kontrollera med BRF innan renovering.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Check with housing association first.",
  },

  // ─── Tak & fasad ───
  "taklaggning": {
    slug: "taklaggning",
    headline: "Vad kostar takläggning i {area}?",
    headlineEn: "What does roofing cost in {area}?",
    intro: "Takläggning i {area} beror på takmaterial och husets storlek:",
    introEn: "Roofing costs in {area} depend on material and house size:",
    prices: [
      { project: "Betongpannor", priceFrom: 400, priceTo: 700, unit: "kr/kvm" },
      { project: "Plåttak", priceFrom: 500, priceTo: 900, unit: "kr/kvm" },
      { project: "Tegelpannor", priceFrom: 600, priceTo: 1000, unit: "kr/kvm" },
      { project: "Komplett takbyte (villa)", priceFrom: 100000, priceTo: 300000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Concrete tiles", unit: "SEK/sqm" },
      { project: "Metal roof", unit: "SEK/sqm" },
      { project: "Clay tiles", unit: "SEK/sqm" },
      { project: "Complete roof replacement (villa)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Ställning och material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Scaffolding and materials additional.",
  },
  "takbyte": {
    slug: "takbyte",
    headline: "Vad kostar takbyte i {area}?",
    headlineEn: "What does roof replacement cost in {area}?",
    intro: "Takbyte i {area} är en stor investering som skyddar huset i 30-50 år:",
    introEn: "Roof replacement in {area} is a major investment protecting the house for 30-50 years:",
    prices: [
      { project: "Villa (100–150 kvm tak)", priceFrom: 120000, priceTo: 300000, unit: "kr" },
      { project: "Radhus", priceFrom: 60000, priceTo: 150000, unit: "kr" },
      { project: "Inkl. underlagstak + isolering", priceFrom: 180000, priceTo: 400000, unit: "kr" },
      { project: "Takomläggning (pannbyte)", priceFrom: 80000, priceTo: 200000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Villa (100–150 sqm roof)", unit: "SEK" },
      { project: "Townhouse", unit: "SEK" },
      { project: "Including underlayment + insulation", unit: "SEK" },
      { project: "Re-roofing (tile replacement)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Ställning, pannor och underlag tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Scaffolding, tiles and underlayment additional.",
  },
  "fasadrenovering": {
    slug: "fasadrenovering",
    headline: "Vad kostar fasadrenovering i {area}?",
    headlineEn: "What does facade renovation cost in {area}?",
    intro: "Fasadrenovering i {area} förbättrar utseende och skyddar huset. Vanliga kostnader:",
    introEn: "Facade renovation in {area} improves appearance and protects the house:",
    prices: [
      { project: "Ommålning (trähus)", priceFrom: 40000, priceTo: 120000, unit: "kr" },
      { project: "Fasadbyte (panel)", priceFrom: 100000, priceTo: 300000, unit: "kr" },
      { project: "Putsrenovering", priceFrom: 80000, priceTo: 250000, unit: "kr" },
      { project: "Tilläggsisolering + ny fasad", priceFrom: 200000, priceTo: 500000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Repainting (wood house)", unit: "SEK" },
      { project: "Facade replacement (panels)", unit: "SEK" },
      { project: "Stucco renovation", unit: "SEK" },
      { project: "Added insulation + new facade", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Ställning och material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Scaffolding and materials additional.",
  },

  // ─── Fönster, dörr, trappa ───
  "fonsterbyte": {
    slug: "fonsterbyte",
    headline: "Vad kostar fönsterbyte i {area}?",
    headlineEn: "What does window replacement cost in {area}?",
    intro: "Fönsterbyte i {area} sänker energikostnaden och förbättrar komforten:",
    introEn: "Window replacement in {area} reduces energy costs and improves comfort:",
    prices: [
      { project: "Standard fönster (per st)", priceFrom: 3000, priceTo: 8000, unit: "kr" },
      { project: "Stort fönster/fönsterdörr", priceFrom: 6000, priceTo: 15000, unit: "kr" },
      { project: "Hel villa (10–15 fönster)", priceFrom: 40000, priceTo: 120000, unit: "kr" },
      { project: "Takfönster", priceFrom: 8000, priceTo: 20000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Standard window (per unit)", unit: "SEK" },
      { project: "Large window/patio door", unit: "SEK" },
      { project: "Full villa (10–15 windows)", unit: "SEK" },
      { project: "Roof window", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Fönster och bågmaterial tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Windows additional.",
  },
  "dorrbyte": {
    slug: "dorrbyte",
    headline: "Vad kostar dörrbyte i {area}?",
    headlineEn: "What does door replacement cost in {area}?",
    intro: "Dörrbyte i {area} förbättrar både utseende och säkerhet:",
    introEn: "Door replacement in {area} improves appearance and security:",
    prices: [
      { project: "Innerdörr (per st)", priceFrom: 2000, priceTo: 5000, unit: "kr" },
      { project: "Ytterdörr", priceFrom: 5000, priceTo: 15000, unit: "kr" },
      { project: "Altandörr/skjutdörr", priceFrom: 8000, priceTo: 20000, unit: "kr" },
      { project: "Säkerhetsdörr", priceFrom: 8000, priceTo: 18000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Interior door (per unit)", unit: "SEK" },
      { project: "Exterior door", unit: "SEK" },
      { project: "Patio/sliding door", unit: "SEK" },
      { project: "Security door", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Dörrar och beslag tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Doors and hardware additional.",
  },
  "trapprenovering": {
    slug: "trapprenovering",
    headline: "Vad kostar trapprenovering i {area}?",
    headlineEn: "What does stair renovation cost in {area}?",
    intro: "Trapprenovering i {area} ger ny look och ökad säkerhet. Vanliga kostnader:",
    introEn: "Stair renovation in {area} gives a new look and increased safety:",
    prices: [
      { project: "Slipning + lackning", priceFrom: 8000, priceTo: 20000, unit: "kr" },
      { project: "Beklädnad (laminat/vinyl)", priceFrom: 12000, priceTo: 30000, unit: "kr" },
      { project: "Nytt räcke/ledstång", priceFrom: 5000, priceTo: 15000, unit: "kr" },
      { project: "Komplett trappbyte", priceFrom: 30000, priceTo: 80000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Sanding + lacquering", unit: "SEK" },
      { project: "Cladding (laminate/vinyl)", unit: "SEK" },
      { project: "New railing/handrail", unit: "SEK" },
      { project: "Complete stair replacement", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%).",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%).",
  },

  // ─── Tillbyggnad & ombyggnad ───
  "tillbyggnad": {
    slug: "tillbyggnad",
    headline: "Vad kostar tillbyggnad i {area}?",
    headlineEn: "What does an extension cost in {area}?",
    intro: "Tillbyggnad i {area} kräver bygglov och noggrann planering. Vanliga prisintervall:",
    introEn: "An extension in {area} requires a building permit. Typical price ranges:",
    prices: [
      { project: "Liten tillbyggnad (10–15 kvm)", priceFrom: 150000, priceTo: 350000, unit: "kr" },
      { project: "Medel tillbyggnad (20–30 kvm)", priceFrom: 300000, priceTo: 700000, unit: "kr" },
      { project: "Stor tillbyggnad (30+ kvm)", priceFrom: 500000, priceTo: 1200000, unit: "kr" },
      { project: "Inglasad altan/uterum", priceFrom: 80000, priceTo: 250000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Small extension (10–15 sqm)", unit: "SEK" },
      { project: "Medium extension (20–30 sqm)", unit: "SEK" },
      { project: "Large extension (30+ sqm)", unit: "SEK" },
      { project: "Glazed patio/conservatory", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Bygglov, arkitekt och material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Permit, architect and materials additional.",
  },
  "ombyggnad": {
    slug: "ombyggnad",
    headline: "Vad kostar ombyggnad i {area}?",
    headlineEn: "What does a conversion cost in {area}?",
    intro: "Ombyggnad i {area} kan innebära planlösningsändringar, vindsinredning eller källarutbyggnad:",
    introEn: "Conversion in {area} can include layout changes, attic or basement conversion:",
    prices: [
      { project: "Planlösningsändring (öppen planlösning)", priceFrom: 40000, priceTo: 120000, unit: "kr" },
      { project: "Vindsinredning", priceFrom: 200000, priceTo: 600000, unit: "kr" },
      { project: "Källarutbyggnad", priceFrom: 150000, priceTo: 500000, unit: "kr" },
      { project: "Garage till bostad", priceFrom: 150000, priceTo: 400000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Layout change (open plan)", unit: "SEK" },
      { project: "Attic conversion", unit: "SEK" },
      { project: "Basement conversion", unit: "SEK" },
      { project: "Garage to living space", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Bygglov kan krävas.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Building permit may be required.",
  },

  // ─── Specialprojekt ───
  "bygga-altan": {
    slug: "bygga-altan",
    headline: "Vad kostar det att bygga altan i {area}?",
    headlineEn: "What does it cost to build a deck in {area}?",
    intro: "Att bygga altan i {area} ger mer boarea utomhus. Priserna beror på storlek och material:",
    introEn: "Building a deck in {area} extends your outdoor living space:",
    prices: [
      { project: "Trädäck (15–25 kvm)", priceFrom: 30000, priceTo: 70000, unit: "kr" },
      { project: "Kompositdäck (15–25 kvm)", priceFrom: 45000, priceTo: 100000, unit: "kr" },
      { project: "Med räcke och trappa", priceFrom: 50000, priceTo: 120000, unit: "kr" },
      { project: "Pergola eller tak", priceFrom: 15000, priceTo: 50000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Wood deck (15–25 sqm)", unit: "SEK" },
      { project: "Composite deck (15–25 sqm)", unit: "SEK" },
      { project: "With railing and stairs", unit: "SEK" },
      { project: "Pergola or roof", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material och eventuellt bygglov tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials and possible permit additional.",
  },
  "bygga-bastu": {
    slug: "bygga-bastu",
    headline: "Vad kostar det att bygga bastu i {area}?",
    headlineEn: "What does it cost to build a sauna in {area}?",
    intro: "Att bygga bastu i {area} ökar bostadsvärdet och ger en lyxkänsla. Vanliga kostnader:",
    introEn: "Building a sauna in {area} adds value and luxury. Typical costs:",
    prices: [
      { project: "Inomhusbastu (basturum)", priceFrom: 30000, priceTo: 80000, unit: "kr" },
      { project: "Utomhusbastu (fristående)", priceFrom: 60000, priceTo: 150000, unit: "kr" },
      { project: "Bastuaggregat + installation", priceFrom: 8000, priceTo: 25000, unit: "kr" },
      { project: "Elinstallation (3-fas)", priceFrom: 5000, priceTo: 15000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Indoor sauna (sauna room)", unit: "SEK" },
      { project: "Outdoor sauna (freestanding)", unit: "SEK" },
      { project: "Sauna heater + installation", unit: "SEK" },
      { project: "Electrical installation (3-phase)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Bastuaggregat och virke tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Heater and timber additional.",
  },
  "bygga-carport": {
    slug: "bygga-carport",
    headline: "Vad kostar det att bygga carport i {area}?",
    headlineEn: "What does it cost to build a carport in {area}?",
    intro: "Carport i {area} skyddar bilen och höjer fastighetsvärdet. Typiska kostnader:",
    introEn: "A carport in {area} protects your car and increases property value:",
    prices: [
      { project: "Enkel carport (1 bil)", priceFrom: 25000, priceTo: 60000, unit: "kr" },
      { project: "Dubbel carport (2 bilar)", priceFrom: 45000, priceTo: 100000, unit: "kr" },
      { project: "Carport med förråd", priceFrom: 50000, priceTo: 120000, unit: "kr" },
      { project: "Markarbete + platta", priceFrom: 15000, priceTo: 40000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Single carport (1 car)", unit: "SEK" },
      { project: "Double carport (2 cars)", unit: "SEK" },
      { project: "Carport with storage", unit: "SEK" },
      { project: "Groundwork + slab", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material och eventuellt bygglov tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials and possible permit additional.",
  },
  "bygga-friggebod": {
    slug: "bygga-friggebod",
    headline: "Vad kostar det att bygga friggebod i {area}?",
    headlineEn: "What does it cost to build a garden shed in {area}?",
    intro: "En friggebod i {area} (max 15 kvm) kräver normalt inget bygglov. Vanliga kostnader:",
    introEn: "A garden shed (max 15 sqm) in {area} typically requires no permit. Costs:",
    prices: [
      { project: "Enkel friggebod (10 kvm)", priceFrom: 40000, priceTo: 90000, unit: "kr" },
      { project: "Isolerad friggebod (15 kvm)", priceFrom: 80000, priceTo: 180000, unit: "kr" },
      { project: "Gäststuga (med el/vatten)", priceFrom: 120000, priceTo: 300000, unit: "kr" },
      { project: "Attefallshus (25–30 kvm)", priceFrom: 200000, priceTo: 500000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Simple shed (10 sqm)", unit: "SEK" },
      { project: "Insulated shed (15 sqm)", unit: "SEK" },
      { project: "Guest house (with utilities)", unit: "SEK" },
      { project: "Attefallshus (25–30 sqm)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Grund och material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Foundation and materials additional.",
  },
  "bygga-utekok": {
    slug: "bygga-utekok",
    headline: "Vad kostar det att bygga utekök i {area}?",
    headlineEn: "What does it cost to build an outdoor kitchen in {area}?",
    intro: "Utekök i {area} förlänger sommarsäsongen. Kostnaden beror på utrustning och material:",
    introEn: "An outdoor kitchen in {area} extends the summer season. Cost depends on equipment:",
    prices: [
      { project: "Enkelt utekök (grill + bänk)", priceFrom: 20000, priceTo: 50000, unit: "kr" },
      { project: "Murat utekök", priceFrom: 40000, priceTo: 100000, unit: "kr" },
      { project: "Komplett utekök (med tak)", priceFrom: 60000, priceTo: 180000, unit: "kr" },
      { project: "Vatten- och elanslutning", priceFrom: 10000, priceTo: 30000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Simple outdoor kitchen (grill + counter)", unit: "SEK" },
      { project: "Brick outdoor kitchen", unit: "SEK" },
      { project: "Complete outdoor kitchen (with roof)", unit: "SEK" },
      { project: "Water and electrical connection", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Grillutrusting och material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Grill equipment and materials additional.",
  },
  "bygga-plank": {
    slug: "bygga-plank",
    headline: "Vad kostar det att bygga plank/staket i {area}?",
    headlineEn: "What does it cost to build a fence in {area}?",
    intro: "Plank och staket i {area} ger insynsskydd och ramar in tomten. Priser per löpmeter:",
    introEn: "Fencing in {area} provides privacy. Prices per linear meter:",
    prices: [
      { project: "Trästaket (1,2 m högt)", priceFrom: 800, priceTo: 1800, unit: "kr/lm" },
      { project: "Plank (1,8 m högt)", priceFrom: 1500, priceTo: 3500, unit: "kr/lm" },
      { project: "Kompositstaket", priceFrom: 2000, priceTo: 4500, unit: "kr/lm" },
      { project: "Nätstaket/hönsnät", priceFrom: 300, priceTo: 800, unit: "kr/lm" },
      { project: "Stolpsättning + gjutning", priceFrom: 500, priceTo: 1200, unit: "kr/st" },
    ],
    pricesEn: [
      { project: "Wood fence (1.2m high)", unit: "SEK/lm" },
      { project: "Privacy fence (1.8m high)", unit: "SEK/lm" },
      { project: "Composite fence", unit: "SEK/lm" },
      { project: "Wire fence", unit: "SEK/lm" },
      { project: "Post setting + concrete", unit: "SEK/each" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Plank/staketmaterial tillkommer. Plank över 1,8 m kan kräva bygglov.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Fence materials additional. Fences over 1.8m may require a permit.",
  },
  "platsbyggd-garderob": {
    slug: "platsbyggd-garderob",
    headline: "Vad kostar platsbyggd garderob i {area}?",
    headlineEn: "What does a custom wardrobe cost in {area}?",
    intro: "Platsbyggd garderob i {area} maximerar förvaringen och anpassas exakt efter ditt utrymme:",
    introEn: "A custom wardrobe in {area} maximizes storage and fits your space exactly:",
    prices: [
      { project: "Enkel garderob (1,5–2 m)", priceFrom: 12000, priceTo: 30000, unit: "kr" },
      { project: "Walk-in closet (liten)", priceFrom: 25000, priceTo: 60000, unit: "kr" },
      { project: "Stor platsbyggd (vägg till vägg)", priceFrom: 30000, priceTo: 80000, unit: "kr" },
      { project: "Med skjutdörrar", priceFrom: 20000, priceTo: 50000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Simple wardrobe (1.5–2m)", unit: "SEK" },
      { project: "Walk-in closet (small)", unit: "SEK" },
      { project: "Large custom (wall to wall)", unit: "SEK" },
      { project: "With sliding doors", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material och beslag tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials and hardware additional.",
  },
  "platsbyggd-bokhylla": {
    slug: "platsbyggd-bokhylla",
    headline: "Vad kostar platsbyggd bokhylla i {area}?",
    headlineEn: "What does a custom bookshelf cost in {area}?",
    intro: "Platsbyggd bokhylla i {area} utnyttjar varje centimeter och ger rummet karaktär:",
    introEn: "A custom bookshelf in {area} uses every centimeter and adds character:",
    prices: [
      { project: "Enkel bokhylla (2 m bred)", priceFrom: 8000, priceTo: 20000, unit: "kr" },
      { project: "Hela väggen (3–4 m)", priceFrom: 15000, priceTo: 45000, unit: "kr" },
      { project: "Med inbyggd belysning", priceFrom: 20000, priceTo: 55000, unit: "kr" },
      { project: "Runt öppning/dörr", priceFrom: 12000, priceTo: 35000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Simple bookshelf (2m wide)", unit: "SEK" },
      { project: "Full wall (3–4m)", unit: "SEK" },
      { project: "With built-in lighting", unit: "SEK" },
      { project: "Around opening/door", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Virke och beslag tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Timber and hardware additional.",
  },
  "renovera-trapp": {
    slug: "renovera-trapp",
    headline: "Vad kostar det att renovera trapp i {area}?",
    headlineEn: "What does stair renovation cost in {area}?",
    intro: "Trapprenovering i {area} kan ge en helt ny look utan att byta hela trappan:",
    introEn: "Stair renovation in {area} can give a completely new look without replacing the entire staircase:",
    prices: [
      { project: "Slipning + lackning", priceFrom: 8000, priceTo: 20000, unit: "kr" },
      { project: "Målning av trappa", priceFrom: 5000, priceTo: 12000, unit: "kr" },
      { project: "Ny beklädnad (laminat/vinyl)", priceFrom: 12000, priceTo: 30000, unit: "kr" },
      { project: "Nytt räcke", priceFrom: 5000, priceTo: 15000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Sanding + lacquering", unit: "SEK" },
      { project: "Stair painting", unit: "SEK" },
      { project: "New cladding (laminate/vinyl)", unit: "SEK" },
      { project: "New railing", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%).",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%).",
  },
  "hantverkare": {
    slug: "hantverkare",
    headline: "Vad kostar hantverkare i {area}?",
    headlineEn: "What does a craftsman cost in {area}?",
    intro: "Hantverkarkostnaden i {area} varierar med typ av arbete. Vanliga timpriser och projektpriser:",
    introEn: "Craftsman costs in {area} vary by type of work. Typical hourly and project rates:",
    prices: [
      { project: "Snickare (timpris)", priceFrom: 450, priceTo: 700, unit: "kr/h" },
      { project: "Målare (timpris)", priceFrom: 400, priceTo: 600, unit: "kr/h" },
      { project: "Plattsättare (timpris)", priceFrom: 450, priceTo: 700, unit: "kr/h" },
      { project: "Allround hantverkare", priceFrom: 400, priceTo: 650, unit: "kr/h" },
      { project: "Mindre uppdrag (halv dag)", priceFrom: 2500, priceTo: 5000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Carpenter (hourly)", unit: "SEK/h" },
      { project: "Painter (hourly)", unit: "SEK/h" },
      { project: "Tiler (hourly)", unit: "SEK/h" },
      { project: "General craftsman", unit: "SEK/h" },
      { project: "Small job (half day)", unit: "SEK" },
    ],
    afterRotNote: "Timpriserna avser före ROT-avdrag (30%). Med avdraget betalar du 70% av arbetskostnaden.",
    afterRotNoteEn: "Hourly rates are before ROT deduction (30%). With the deduction you pay 70% of labor cost.",
  },
  "byggfirma": {
    slug: "byggfirma",
    headline: "Vad kostar byggfirma i {area}?",
    headlineEn: "What does a construction company cost in {area}?",
    intro: "Att anlita byggfirma i {area} ger projektledning och garanti. Typiska priser:",
    introEn: "Hiring a construction company in {area} provides project management and warranty:",
    prices: [
      { project: "Mindre renovering", priceFrom: 50000, priceTo: 150000, unit: "kr" },
      { project: "Kök + badrum", priceFrom: 200000, priceTo: 450000, unit: "kr" },
      { project: "Totalrenovering villa", priceFrom: 600000, priceTo: 1500000, unit: "kr" },
      { project: "Tillbyggnad", priceFrom: 200000, priceTo: 700000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Minor renovation", unit: "SEK" },
      { project: "Kitchen + bathroom", unit: "SEK" },
      { project: "Full villa renovation", unit: "SEK" },
      { project: "Extension", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad inkl. projektledning, före ROT-avdrag (30%).",
    afterRotNoteEn: "Prices include labor and project management, before ROT deduction (30%).",
  },

  // ─── EL-TJÄNSTER ───
  "elektriker": {
    slug: "elektriker",
    headline: "Vad kostar elektriker i {area}?",
    headlineEn: "What does an electrician cost in {area}?",
    intro: "Elkostnader i {area} varierar med typ av arbete. Alla elarbeten kräver behörig elektriker:",
    introEn: "Electrical costs in {area} vary by type of work. All work requires a certified electrician:",
    prices: [
      { project: "Timpris (elektriker)", priceFrom: 500, priceTo: 850, unit: "kr/h" },
      { project: "Elcentral (byte)", priceFrom: 15000, priceTo: 35000, unit: "kr" },
      { project: "Laddbox (installation)", priceFrom: 8000, priceTo: 20000, unit: "kr" },
      { project: "Spotlights (per st)", priceFrom: 500, priceTo: 1500, unit: "kr" },
      { project: "Jordfelsbrytare", priceFrom: 3000, priceTo: 8000, unit: "kr" },
      { project: "Komplett elrenovering (lägenhet)", priceFrom: 40000, priceTo: 100000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Hourly rate (electrician)", unit: "SEK/h" },
      { project: "Electrical panel (replacement)", unit: "SEK" },
      { project: "EV charger (installation)", unit: "SEK" },
      { project: "Spotlights (per unit)", unit: "SEK" },
      { project: "Ground fault breaker", unit: "SEK" },
      { project: "Complete rewiring (apartment)", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials additional.",
  },
  "elinstallation": {
    slug: "elinstallation",
    headline: "Vad kostar elinstallation i {area}?",
    headlineEn: "What does electrical installation cost in {area}?",
    intro: "Elinstallation i {area} utförs av auktoriserade elektriker. Vanliga priser:",
    introEn: "Electrical installation in {area} is performed by certified electricians:",
    prices: [
      { project: "Ny strömkrets", priceFrom: 2000, priceTo: 6000, unit: "kr" },
      { project: "Uttag/strömbrytare (per st)", priceFrom: 800, priceTo: 2000, unit: "kr" },
      { project: "3-fas installation", priceFrom: 8000, priceTo: 20000, unit: "kr" },
      { project: "Belysningsinstallation (per rum)", priceFrom: 3000, priceTo: 8000, unit: "kr" },
      { project: "Utomhusbelysning", priceFrom: 5000, priceTo: 15000, unit: "kr" },
    ],
    pricesEn: [
      { project: "New circuit", unit: "SEK" },
      { project: "Outlet/switch (per unit)", unit: "SEK" },
      { project: "3-phase installation", unit: "SEK" },
      { project: "Lighting installation (per room)", unit: "SEK" },
      { project: "Outdoor lighting", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Kablar och material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Cables and materials additional.",
  },
  "laddbox": {
    slug: "laddbox",
    headline: "Vad kostar laddbox i {area}?",
    headlineEn: "What does an EV charger cost in {area}?",
    intro: "Laddboxinstallation i {area} kräver behörig elektriker och ofta uppgradering till 3-fas:",
    introEn: "EV charger installation in {area} requires a certified electrician:",
    prices: [
      { project: "Laddbox (enkel, 11 kW)", priceFrom: 8000, priceTo: 15000, unit: "kr" },
      { project: "Laddbox (smart, 22 kW)", priceFrom: 15000, priceTo: 30000, unit: "kr" },
      { project: "3-fas uppgradering", priceFrom: 5000, priceTo: 15000, unit: "kr" },
      { project: "Kabelförläggning (per meter)", priceFrom: 200, priceTo: 500, unit: "kr/m" },
    ],
    pricesEn: [
      { project: "EV charger (basic, 11 kW)", unit: "SEK" },
      { project: "EV charger (smart, 22 kW)", unit: "SEK" },
      { project: "3-phase upgrade", unit: "SEK" },
      { project: "Cable routing (per meter)", unit: "SEK/m" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Laddbox och kabel tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Charger and cable additional.",
  },

  // ─── VVS-TJÄNSTER ───
  "vvs": {
    slug: "vvs",
    headline: "Vad kostar VVS i {area}?",
    headlineEn: "What does plumbing cost in {area}?",
    intro: "VVS-kostnader i {area} varierar med arbetstyp. Alla rörarbeten kräver auktoriserad rörmokare:",
    introEn: "Plumbing costs in {area} vary by work type. All pipe work requires a certified plumber:",
    prices: [
      { project: "Timpris (rörmokare)", priceFrom: 500, priceTo: 900, unit: "kr/h" },
      { project: "Blandarbyte", priceFrom: 2000, priceTo: 5000, unit: "kr" },
      { project: "Toalettbyte", priceFrom: 3000, priceTo: 8000, unit: "kr" },
      { project: "Diskmaskin (installation)", priceFrom: 2000, priceTo: 5000, unit: "kr" },
      { project: "Tvättmaskin (installation)", priceFrom: 2000, priceTo: 5000, unit: "kr" },
      { project: "Värmepump (installation)", priceFrom: 30000, priceTo: 80000, unit: "kr" },
      { project: "Golvvärme (per kvm)", priceFrom: 600, priceTo: 1200, unit: "kr/kvm" },
    ],
    pricesEn: [
      { project: "Hourly rate (plumber)", unit: "SEK/h" },
      { project: "Faucet replacement", unit: "SEK" },
      { project: "Toilet replacement", unit: "SEK" },
      { project: "Dishwasher (installation)", unit: "SEK" },
      { project: "Washing machine (installation)", unit: "SEK" },
      { project: "Heat pump (installation)", unit: "SEK" },
      { project: "Underfloor heating (per sqm)", unit: "SEK/sqm" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Materials additional.",
  },

  // ─── TRÄDGÅRD ───
  "tradgard": {
    slug: "tradgard",
    headline: "Vad kostar trädgårdstjänster i {area}?",
    headlineEn: "What does garden services cost in {area}?",
    intro: "Trädgårdstjänster i {area} varierar med typ av arbete. RUT-avdrag gäller för skötsel:",
    introEn: "Garden services in {area} vary by type. RUT deduction applies for maintenance:",
    prices: [
      { project: "Gräsklippning (per tillfälle)", priceFrom: 500, priceTo: 1500, unit: "kr" },
      { project: "Häckklippning (per timme)", priceFrom: 400, priceTo: 600, unit: "kr/h" },
      { project: "Trädbeskärning", priceFrom: 2000, priceTo: 8000, unit: "kr" },
      { project: "Trädgårdsanläggning (per kvm)", priceFrom: 300, priceTo: 800, unit: "kr/kvm" },
      { project: "Plantering (per timme)", priceFrom: 400, priceTo: 600, unit: "kr/h" },
      { project: "Vårröjning", priceFrom: 2000, priceTo: 6000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Lawn mowing (per visit)", unit: "SEK" },
      { project: "Hedge trimming (per hour)", unit: "SEK/h" },
      { project: "Tree pruning", unit: "SEK" },
      { project: "Garden design (per sqm)", unit: "SEK/sqm" },
      { project: "Planting (per hour)", unit: "SEK/h" },
      { project: "Spring cleanup", unit: "SEK" },
    ],
    afterRotNote: "Skötsel (klippning, beskärning) ger RUT-avdrag (50%). Anläggning (ny design, stenläggning) ger ROT-avdrag (30%).",
    afterRotNoteEn: "Maintenance (mowing, trimming) qualifies for RUT (50%). Landscaping (new design, paving) qualifies for ROT (30%).",
  },

  // ─── STÄD ───
  "stad": {
    slug: "stad",
    headline: "Vad kostar städning i {area}?",
    headlineEn: "What does cleaning cost in {area}?",
    intro: "Städtjänster i {area} kvalificerar för RUT-avdrag (50% av arbetskostnaden):",
    introEn: "Cleaning services in {area} qualify for RUT deduction (50% of labor cost):",
    prices: [
      { project: "Hemstäd (2 rum, varannan vecka)", priceFrom: 800, priceTo: 1500, unit: "kr" },
      { project: "Hemstäd (3–4 rum)", priceFrom: 1200, priceTo: 2500, unit: "kr" },
      { project: "Flyttstäd (lägenhet)", priceFrom: 2500, priceTo: 5000, unit: "kr" },
      { project: "Flyttstäd (villa)", priceFrom: 4000, priceTo: 8000, unit: "kr" },
      { project: "Fönsterputs (per fönster)", priceFrom: 100, priceTo: 300, unit: "kr" },
      { project: "Storstädning", priceFrom: 2000, priceTo: 5000, unit: "kr" },
      { project: "Byggstäd (efter renovering)", priceFrom: 3000, priceTo: 8000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Home cleaning (2 rooms, biweekly)", unit: "SEK" },
      { project: "Home cleaning (3–4 rooms)", unit: "SEK" },
      { project: "Move-out cleaning (apartment)", unit: "SEK" },
      { project: "Move-out cleaning (house)", unit: "SEK" },
      { project: "Window cleaning (per window)", unit: "SEK" },
      { project: "Deep cleaning", unit: "SEK" },
      { project: "Post-renovation cleaning", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser före RUT-avdrag (50%). Du betalar hälften av arbetskostnaden.",
    afterRotNoteEn: "Prices are before RUT deduction (50%). You pay half of the labor cost.",
  },

  // ─── FLYTT ───
  "flytt": {
    slug: "flytt",
    headline: "Vad kostar flytt i {area}?",
    headlineEn: "What does moving cost in {area}?",
    intro: "Flytthjälp i {area} med RUT-avdrag gör flytten billigare. Vanliga priser:",
    introEn: "Moving help in {area} with RUT deduction makes your move more affordable:",
    prices: [
      { project: "Lägenhetsflytt (1–2 rum)", priceFrom: 3000, priceTo: 8000, unit: "kr" },
      { project: "Lägenhetsflytt (3–4 rum)", priceFrom: 6000, priceTo: 15000, unit: "kr" },
      { project: "Villaflytt", priceFrom: 10000, priceTo: 30000, unit: "kr" },
      { project: "Packning (per timme/person)", priceFrom: 350, priceTo: 550, unit: "kr/h" },
      { project: "Pianoflytt", priceFrom: 2000, priceTo: 6000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Apartment move (1–2 rooms)", unit: "SEK" },
      { project: "Apartment move (3–4 rooms)", unit: "SEK" },
      { project: "House move", unit: "SEK" },
      { project: "Packing (per hour/person)", unit: "SEK/h" },
      { project: "Piano move", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser före RUT-avdrag (50%). Du betalar hälften av arbetskostnaden.",
    afterRotNoteEn: "Prices are before RUT deduction (50%). You pay half of the labor cost.",
  },

  // ─── TEKNISKA INSTALLATIONER ───
  "tekniska-installationer": {
    slug: "tekniska-installationer",
    headline: "Vad kostar tekniska installationer i {area}?",
    headlineEn: "What does technical installations cost in {area}?",
    intro: "Tekniska installationer i {area} — larm, nätverk, smart home och mer:",
    introEn: "Technical installations in {area} — alarms, networking, smart home and more:",
    prices: [
      { project: "Hemlarm (installation)", priceFrom: 5000, priceTo: 15000, unit: "kr" },
      { project: "Nätverksinstallation (hem)", priceFrom: 5000, priceTo: 15000, unit: "kr" },
      { project: "Smart home (startpaket)", priceFrom: 3000, priceTo: 12000, unit: "kr" },
      { project: "Kameraövervakning", priceFrom: 5000, priceTo: 20000, unit: "kr" },
      { project: "Porttelefon", priceFrom: 3000, priceTo: 10000, unit: "kr" },
    ],
    pricesEn: [
      { project: "Home alarm (installation)", unit: "SEK" },
      { project: "Home networking", unit: "SEK" },
      { project: "Smart home (starter)", unit: "SEK" },
      { project: "Camera surveillance", unit: "SEK" },
      { project: "Intercom", unit: "SEK" },
    ],
    afterRotNote: "Priserna avser arbetskostnad före ROT-avdrag (30%). Utrustning och material tillkommer.",
    afterRotNoteEn: "Prices refer to labor cost before ROT deduction (30%). Equipment and materials additional.",
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
  "golvlaggning": {
    sv: [
      { q: "Vilken golvtyp passar bäst i {area}?", a: "Det beror på rummet. Parkett och laminat passar vardagsrum och sovrum. Vinyl/klinker passar kök och hall. I våtutrymmen krävs klinker eller våtrumsvinyl. Vi hjälper dig välja rätt golv för ditt hem i {area}." },
      { q: "Behöver man avjämna golvet innan läggning?", a: "Ofta ja. Ett ojämnt underlag ger sprickor och golvgnissel. Avjämning kostar 120–250 kr/kvm men är värt varje krona för ett perfekt resultat." },
      { q: "Hur lång tid tar golvläggning i {area}?", a: "Ett rum (15–20 kvm) tar normalt 1 dag. En hel lägenhet tar 2–4 dagar beroende på golvtyp och förberedelser." },
    ],
    en: [
      { q: "Which floor type suits best in {area}?", a: "It depends on the room. Parquet and laminate suit living rooms. Vinyl/tile suits kitchens and hallways. Wet rooms need tile or wet room vinyl." },
      { q: "Do I need to level the floor before installation?", a: "Often yes. An uneven subfloor leads to cracks and creaking. Leveling costs 120–250 SEK/sqm but is worth it." },
      { q: "How long does flooring installation take in {area}?", a: "One room (15–20 sqm) typically takes 1 day. A full apartment takes 2–4 days." },
    ]
  },
  "golvslipning": {
    sv: [
      { q: "Hur ofta behöver man slipa om trägolvet?", a: "Normalt vart 10–15 år beroende på slitage. Har du husdjur eller mycket trafik kan det behövas oftare. Mellanslipning vart 5–7 år förlänger golvets livslängd." },
      { q: "Kan man slipa alla trägolv?", a: "De flesta massiva trägolv kan slipas 3–5 gånger. Flerskiktsparkett kan ofta slipas 1–2 gånger. Vi bedömer ditt golv kostnadsfritt i {area}." },
      { q: "Lacka eller olja efter slipning?", a: "Lack ger en tålig yta — bäst för barnfamiljer. Olja ger naturlig, matt känsla och är lättare att underhålla lokalt." },
    ],
    en: [
      { q: "How often do you need to sand wooden floors?", a: "Normally every 10–15 years depending on wear. With pets or heavy traffic it may be needed more often." },
      { q: "Can all wooden floors be sanded?", a: "Most solid wood floors can be sanded 3–5 times. Engineered parquet can typically be sanded 1–2 times." },
      { q: "Lacquer or oil after sanding?", a: "Lacquer gives a durable surface — best for families. Oil gives a natural matte feel and is easier to maintain locally." },
    ]
  },
  "malare": {
    sv: [
      { q: "Hur många strykningar behövs?", a: "Normalt 2 strykningar på grundade ytor, 3 om du byter från mörk till ljus färg." },
      { q: "Vilken färg är bäst för invändig målning?", a: "Helmatt (glans 7) är vanligast för väggar. Halvmatt (glans 20–40) fungerar bra i kök och badrum." },
      { q: "Behöver man flytta ut möblerna?", a: "Vi täcker golv och möbler noggrant. Flyttbara möbler bör ställas i mitten av rummet. Stora möbler behöver inte flyttas." },
    ],
    en: [
      { q: "How many coats are needed?", a: "Normally 2 coats on primed surfaces, 3 if changing from dark to light." },
      { q: "Which paint is best for interior?", a: "Matte (gloss 7) is most common for walls. Semi-matte (gloss 20–40) works well in kitchens and bathrooms." },
      { q: "Do I need to move furniture out?", a: "We carefully cover floors and furniture. Movable items should be placed in room center." },
    ]
  },
  "fasadmalning": {
    sv: [
      { q: "Hur ofta behöver man måla om fasaden?", a: "Trähus bör målas om vart 8–12 år. Hus i skuggigt läge kan behöva det oftare. Vi inspekterar din fasad i {area} kostnadsfritt." },
      { q: "Vilken årstid är bäst för fasadmålning?", a: "Maj–september. Temperaturen bör vara över 10°C och torrt i minst 24 timmar efter målning." },
      { q: "Behövs ställning?", a: "För 2+ våningar behövs ställning (ca 15 000–30 000 kr). Envåningshus kan ofta målas med stege." },
    ],
    en: [
      { q: "How often does the facade need repainting?", a: "Wood houses should be repainted every 8–12 years." },
      { q: "Which season is best?", a: "May–September. Temperature above 10°C and dry for 24 hours after painting." },
      { q: "Is scaffolding needed?", a: "For 2+ stories yes (approx. 15,000–30,000 SEK). Single story can often use ladder." },
    ]
  },
  "tapetsering": {
    sv: [
      { q: "Kan man tapetsera på gammal tapet?", a: "Vi rekommenderar alltid att ta bort gammal tapet först. Borttagning kostar 80–150 kr/kvm." },
      { q: "Hur väljer man rätt tapet?", a: "Vlies-tapet är enklast att sätta upp och ta ner. Papperstapet ger traditionellt resultat men kräver mer erfarenhet." },
      { q: "Hur lång tid tar tapetsering?", a: "Ett rum (15–20 kvm väggar) tar normalt 1 dag. Mönstermatchning tar längre." },
    ],
    en: [
      { q: "Can you wallpaper over old wallpaper?", a: "We always recommend removing old wallpaper first. Removal costs 80–150 SEK/sqm." },
      { q: "How do I choose the right wallpaper?", a: "Non-woven is easiest to install and remove. Paper gives a traditional look but needs more skill." },
      { q: "How long does wallpapering take?", a: "One room typically takes 1 day. Pattern matching takes longer." },
    ]
  },
  "markarbeten": {
    sv: [
      { q: "Behöver jag marklov i {area}?", a: "Marklov kan krävas om du höjer/sänker marknivån mer än 50 cm i detaljplanerat område." },
      { q: "När är det bäst att göra markarbeten?", a: "Vår och höst är bäst — marken är varken frusen eller för blöt. Undvik december–februari i {area}." },
      { q: "Vad ingår i dränering runt hus?", a: "Schaktning, ny dräneringsslang, makadam, ev. isolering och återfyllning. Normalt 2 000–5 000 kr/lm." },
    ],
    en: [
      { q: "Do I need a land permit in {area}?", a: "May be required if ground level changes by more than 50 cm in a detailed plan area." },
      { q: "Best time of year for groundwork?", a: "Spring and autumn — ground neither frozen nor too wet. Avoid Dec–Feb in {area}." },
      { q: "What's included in house drainage?", a: "Excavation, drainage pipe, gravel, possible insulation and backfilling. Typically 2,000–5,000 SEK/lm." },
    ]
  },
  "rivning": {
    sv: [
      { q: "Ingår bortforsling i priset?", a: "Normalt tillkommer container och deponiavgifter. En 10-kubiks container kostar ca 3 000–6 000 kr i {area}." },
      { q: "Kan man riva bärande väggar?", a: "Ja, men det kräver konstruktör som beräknar vilken balk som behövs. Räkna med 10 000–30 000 kr extra." },
      { q: "Hur lång tid tar rivning?", a: "Badrumsrivning: 1–2 dagar. Köksrivning: 1 dag. Vi borttransporterar allt rivningsmaterial." },
    ],
    en: [
      { q: "Is waste removal included?", a: "Container and disposal are typically additional. A 10-cubic container costs approx. 3,000–6,000 SEK in {area}." },
      { q: "Can you demolish load-bearing walls?", a: "Yes, but requires a structural engineer. Expect 10,000–30,000 SEK extra for steel beam." },
      { q: "How long does demolition take?", a: "Bathroom: 1–2 days. Kitchen: 1 day. We remove all debris." },
    ]
  },
  "tillbyggnad": {
    sv: [
      { q: "Behöver jag bygglov för tillbyggnad?", a: "Ja, tillbyggnader kräver bygglov. Undantag: Attefallstillbyggnad (max 15 kvm) kräver bara anmälan." },
      { q: "Hur lång tid tar tillbyggnad?", a: "Liten (10–15 kvm): 4–8 veckor. Större (20–30 kvm): 8–12 veckor. Bygglovsprocessen tar normalt 10 veckor." },
      { q: "Vad påverkar priset mest?", a: "Grundläggning, tak-anslutning och om VVS/el behövs i tillbyggnaden." },
    ],
    en: [
      { q: "Do I need a building permit?", a: "Yes. Exception: Attefalls extensions (max 15 sqm) only need notification." },
      { q: "How long does an extension take?", a: "Small (10–15 sqm): 4–8 weeks. Larger (20–30 sqm): 8–12 weeks." },
      { q: "What affects price most?", a: "Foundation, roof connection and whether plumbing/electrical is needed." },
    ]
  },
  "bygga-plank": {
    sv: [
      { q: "Behöver jag bygglov för plank?", a: "Plank över 1,8 m kan kräva bygglov. Staket under 1,1 m kräver aldrig bygglov." },
      { q: "Trä eller komposit?", a: "Trä: 800–1 800 kr/lm, kräver underhåll. Komposit: 2 000–4 500 kr/lm, underhållsfritt 25+ år." },
      { q: "Hur lång tid tar det?", a: "10–20 löpmeter tar 2–3 dagar inkl. stolpsättning och gjutning." },
    ],
    en: [
      { q: "Do I need a permit for fencing?", a: "Fences over 1.8m may require a permit. Under 1.1m never needs one." },
      { q: "Wood or composite?", a: "Wood: 800–1,800 SEK/lm, needs maintenance. Composite: 2,000–4,500 SEK/lm, maintenance-free 25+ years." },
      { q: "How long does it take?", a: "10–20 linear meters takes 2–3 days including post setting." },
    ]
  },
  "bygga-bastu": {
    sv: [
      { q: "Krävs bygglov för bastu?", a: "Inomhusbastu: nej. Utomhusbastu under 15 kvm (friggebod): normalt nej." },
      { q: "Vilken typ av bastuaggregat?", a: "Vedeldad ger klassisk upplevelse men kräver skorsten. Elbastu är enklast — men kräver 3-fas för aggregat över 6 kW." },
      { q: "Hur lång tid tar det?", a: "Inomhusbastu: 3–5 dagar. Utomhusbastu: 1–2 veckor inkl. grund och el." },
    ],
    en: [
      { q: "Is a permit needed?", a: "Indoor sauna: no. Outdoor under 15 sqm: typically no." },
      { q: "Which heater type?", a: "Wood-burning gives classic experience but needs chimney. Electric is easiest — needs 3-phase for over 6 kW." },
      { q: "How long does it take?", a: "Indoor: 3–5 days. Outdoor: 1–2 weeks including foundation and electrical." },
    ]
  },
  "bygga-carport": {
    sv: [
      { q: "Krävs bygglov?", a: "Under Attefallsreglerna (max 30 kvm, 4 m höjd, 4,5 m från tomtgräns) krävs bara anmälan." },
      { q: "Vilken grund behövs?", a: "Plintar är billigast och enklast. Gjuten platta ger jämnare yta." },
      { q: "Hur lång tid?", a: "Enkel carport: 3–5 dagar. Dubbel med förråd: 5–8 dagar." },
    ],
    en: [
      { q: "Is a permit needed?", a: "Under Attefalls rules (max 30 sqm, 4m high, 4.5m from boundary) only notification needed." },
      { q: "What foundation?", a: "Concrete piers are cheapest. Poured slab gives a more even surface." },
      { q: "How long?", a: "Simple: 3–5 days. Double with storage: 5–8 days." },
    ]
  },
  "bygga-friggebod": {
    sv: [
      { q: "Skillnad friggebod vs Attefallshus?", a: "Friggebod (max 15 kvm, 3 m hög): inget bygglov/anmälan. Attefallshus (max 30 kvm): anmälan krävs." },
      { q: "Kan man bo i friggebod?", a: "Ja, med el, vatten och uppvärmning. Populärt som gäststuga i {area}." },
      { q: "Hur lång tid?", a: "Enkel: 1–2 veckor. Isolerad gäststuga med VA: 2–4 veckor." },
    ],
    en: [
      { q: "Friggebod vs Attefallshus?", a: "Friggebod (max 15 sqm): no permit. Attefallshus (max 30 sqm): notification required." },
      { q: "Can you live in one?", a: "Yes, with electricity, water and heating. Popular as guest house in {area}." },
      { q: "How long?", a: "Simple: 1–2 weeks. Insulated with utilities: 2–4 weeks." },
    ]
  },
  "platsbyggd-garderob": {
    sv: [
      { q: "Varför platsbyggt istället för IKEA PAX?", a: "Platsbyggt utnyttjar varje millimeter — perfekt för snedtak, nischer och udda mått." },
      { q: "Vilka material används?", a: "MDF (lackad/folierad) eller plywood. MDF ger slät yta, plywood ger naturkänsla." },
      { q: "Hur lång tid?", a: "Standardgarderob (2 m): 2–3 dagar. Walk-in closet: 3–5 dagar." },
    ],
    en: [
      { q: "Why custom over IKEA PAX?", a: "Custom uses every millimeter — perfect for sloped ceilings, niches and odd sizes." },
      { q: "What materials?", a: "MDF (painted/foil-wrapped) or plywood. MDF gives smooth surface, plywood natural feel." },
      { q: "How long?", a: "Standard (2m): 2–3 days. Walk-in: 3–5 days." },
    ]
  },
  "taklaggning": {
    sv: [
      { q: "Hur vet jag om taket behöver bytas?", a: "Vanliga tecken: läckage, trasiga pannor, mossa. Tak äldre än 30 år bör inspekteras. Vi gör fri inspektion i {area}." },
      { q: "Vilket takmaterial är bäst?", a: "Betong: billigast, 30–50 år. Plåt: lättast, 40–60 år. Tegel: dyrast, 50–100 år." },
      { q: "Behövs bygglov?", a: "Byte med samma material: normalt nej. Ändrad materialtyp kan kräva bygglov." },
    ],
    en: [
      { q: "How do I know if the roof needs replacing?", a: "Signs: leaks, broken tiles, moss. Roofs over 30 years should be inspected." },
      { q: "Best roofing material?", a: "Concrete: cheapest, 30–50 years. Metal: lightest, 40–60 years. Clay: most expensive, 50–100 years." },
      { q: "Is a permit needed?", a: "Same material: typically no. Changed type may require one." },
    ]
  },
  "fonsterbyte": {
    sv: [
      { q: "Hur mycket sparar jag på energin?", a: "Moderna 3-glasfönster kan sänka uppvärmningen med 15–25%. Även bättre ljudisolering." },
      { q: "Trä- eller aluminiumfönster?", a: "Trä: klassisk look, kräver underhåll. Trä/alu: minimalt underhåll. PVC: billigast men kortare livslängd." },
      { q: "Hur lång tid?", a: "1–2 fönster/dag. Hel villa (10–15 fönster): 3–5 dagar." },
    ],
    en: [
      { q: "How much energy will I save?", a: "Modern triple-glazed can reduce heating by 15–25%. Also better sound insulation." },
      { q: "Wood or aluminum?", a: "Wood: classic look, needs maintenance. Wood/alu: minimal maintenance. PVC: cheapest, shorter lifespan." },
      { q: "How long?", a: "1–2 windows/day. Full villa (10–15 windows): 3–5 days." },
    ]
  },
  "hantverkare": {
    sv: [
      { q: "Hur hittar jag pålitlig hantverkare i {area}?", a: "Kontrollera F-skattsedel, försäkring och referensprojekt. Genom Fixco får du verifierade hantverkare med garanti." },
      { q: "Skillnad ROT och RUT?", a: "ROT (30%): reparation, ombyggnad, tillbyggnad. RUT (50%): hushållsarbete. Max 75 000 kr totalt/person/år." },
      { q: "Fast pris eller timpris?", a: "Fast pris rekommenderas för definierade projekt. Timpris passar löpande underhåll." },
    ],
    en: [
      { q: "How to find a reliable craftsman?", a: "Check F-tax certificate, insurance and references. Through Fixco you get verified craftsmen with guarantee." },
      { q: "ROT vs RUT?", a: "ROT (30%): repair, renovation, extension. RUT (50%): household services. Max 75,000 SEK total/person/year." },
      { q: "Fixed or hourly price?", a: "Fixed recommended for defined projects. Hourly suits ongoing maintenance." },
    ]
  },
  "elektriker": {
    sv: [
      { q: "Behöver jag anlita behörig elektriker i {area}?", a: "Ja, alla elarbeten som går bortom att byta glödlampa eller plugga in en apparat kräver behörig elektriker enligt Elsäkerhetsverket. Det gäller installation av uttag, säkringsbyten, laddboxar och ny eldragning." },
      { q: "Vad kostar det att installera laddbox i {area}?", a: "En laddbox kostar normalt 10 000–25 000 kr inklusive installation. Med ROT-avdrag (30% på arbete) sparar du 3 000–7 500 kr. Priset beror på avstånd till elcentralen och om kapaciteten behöver uppgraderas." },
      { q: "Hur snabbt kan ni komma för akut elfelsökning?", a: "Vi erbjuder normalt besök inom 1–3 arbetsdagar i {area}. Vid akuta situationer (helt strömlöst, brandlukt) — ring 112 och kontakta sedan oss." },
      { q: "Vad ingår i en elbesiktning?", a: "En elbesiktning omfattar kontroll av jordning, säkringar, kablar, uttag och fast installation. Vi dokumenterar allt och ger dig ett protokoll med rekommendationer." },
    ],
    en: [
      { q: "Do I need a certified electrician in {area}?", a: "Yes, all electrical work beyond changing bulbs or plugging in appliances requires a certified electrician per Swedish regulations." },
      { q: "What does an EV charger installation cost in {area}?", a: "An EV charger typically costs 10,000–25,000 SEK including installation. With ROT deduction (30% on labor) you save 3,000–7,500 SEK." },
      { q: "How quickly can you come for emergency electrical issues?", a: "We typically offer visits within 1–3 working days in {area}. For emergencies (total power loss, burning smell) — call 112 first." },
      { q: "What's included in an electrical inspection?", a: "An inspection covers grounding, fuses, cables, outlets and fixed installations. We document everything and provide a report." },
    ]
  },
  "vvs": {
    sv: [
      { q: "Vad kostar rörmokare i {area}?", a: "Timpriset för VVS-arbete ligger normalt på 595–895 kr/timme före ROT-avdrag. Med ROT (30%) betalar du effektivt 298–448 kr/timme. Fast pris rekommenderas för definierade projekt." },
      { q: "Kan ni hjälpa med akut vattenläcka i {area}?", a: "Ja, vi hanterar akuta läckor. Stäng av huvudkranen, torka upp det värsta och kontakta oss omedelbart. Vi prioriterar akuta ärenden i {area}." },
      { q: "Behöver jag Säker Vatten-certifierad rörmokare?", a: "Vi rekommenderar alltid Säker Vatten-certifierade hantverkare. Certifieringen säkerställer att arbetet utförs enligt branschstandard och att din hemförsäkring gäller vid eventuella vattenskador." },
      { q: "Vad kostar byte av blandare?", a: "Ett blandarebyte kostar normalt 1 500–4 000 kr inklusive arbete (exkl. blandaren). Priset beror på åtkomlighet och om rör behöver justeras." },
    ],
    en: [
      { q: "What does a plumber cost in {area}?", a: "Hourly rate for plumbing is typically 595–895 SEK before ROT deduction. With ROT (30%) you effectively pay 298–448 SEK/hour." },
      { q: "Can you help with an emergency water leak in {area}?", a: "Yes. Turn off the main valve, mop up, and contact us immediately. We prioritize emergencies in {area}." },
      { q: "Do I need a Säker Vatten-certified plumber?", a: "We always recommend certified plumbers. Certification ensures work meets industry standards and your insurance covers potential water damage." },
      { q: "What does replacing a faucet cost?", a: "A faucet replacement typically costs 1,500–4,000 SEK including labor (excluding the faucet)." },
    ]
  },
  "tradgard": {
    sv: [
      { q: "Vilka trädgårdstjänster ger RUT-avdrag?", a: "Gräsklippning, häckklippning, ogräsrensning, lövräfsning och enklare plantering ger RUT-avdrag (50%). Anläggning av ny trädgård, stenläggning och trädfällning ger inte RUT." },
      { q: "Hur ofta behöver gräsmattan klippas?", a: "Under växtsäsongen (maj–september) rekommenderas klippning var 7–10 dag. I {area} kan det variera beroende på väder och gödning." },
      { q: "Kan ni hjälpa med trädgårdsdesign?", a: "Ja, vi hjälper med planering och design av trädgårdar i {area}. Vi kan rekommendera växter som trivs i ditt läge och skapa en skötselplan." },
      { q: "Vad kostar häckklippning i {area}?", a: "Häckklippning kostar normalt 395–595 kr/timme. En normalstora häck (10–20 m) tar 1–3 timmar. Med RUT-avdrag (50%) halveras arbetskostnaden." },
    ],
    en: [
      { q: "Which garden services qualify for RUT deduction?", a: "Lawn mowing, hedge trimming, weeding, leaf raking and simple planting qualify for RUT (50%). New garden installations and tree felling do not." },
      { q: "How often should the lawn be mowed?", a: "During growing season (May–September), every 7–10 days is recommended." },
      { q: "Can you help with garden design?", a: "Yes, we help with planning and design in {area}, recommending plants suited to your conditions." },
      { q: "What does hedge trimming cost in {area}?", a: "Hedge trimming typically costs 395–595 SEK/hour. A standard hedge (10–20m) takes 1–3 hours. RUT deduction (50%) halves the labor cost." },
    ]
  },
  "stad": {
    sv: [
      { q: "Vilka städtjänster ger RUT-avdrag i {area}?", a: "Hemstädning, fönsterputsning, strykning och enklare trädgårdsarbete ger RUT-avdrag (50%, max 75 000 kr/person/år). Flyttstäd och byggstäd ger också RUT om det utförs i din bostad." },
      { q: "Hur ofta bör man ha hemstädning?", a: "De flesta kunder i {area} bokar varannan vecka. Familjer med barn och husdjur kan ha nytta av varje vecka. Vi anpassar upplägg efter dina behov." },
      { q: "Vad ingår i en flyttstädning?", a: "En flyttstädning omfattar hela bostaden: golv, väggar, fönster (insida), kök med ugn/kyl, badrum och alla skåp/garderober. Vi följer mäklarstandard." },
      { q: "Behöver jag tillhandahålla städmaterial?", a: "Nej, vi har med oss allt — städprodukter, moppar, dammsugare och övrig utrustning. Vi använder miljövänliga produkter." },
    ],
    en: [
      { q: "Which cleaning services qualify for RUT deduction?", a: "Home cleaning, window washing, ironing qualify for RUT (50%, max 75,000 SEK/person/year). Move-out cleaning also qualifies." },
      { q: "How often should I book home cleaning?", a: "Most clients in {area} book biweekly. Families with children or pets may benefit from weekly." },
      { q: "What's included in a move-out cleaning?", a: "Full cleaning including floors, walls, windows (inside), kitchen with oven/fridge, bathroom and all cabinets. We follow real estate standard." },
      { q: "Do I need to provide cleaning supplies?", a: "No, we bring everything — products, mops, vacuum and equipment. We use eco-friendly products." },
    ]
  },
  "montering": {
    sv: [
      { q: "Vilken typ av montering erbjuder ni i {area}?", a: "Vi monterar allt från IKEA-möbler och TV-fästen till vitvaror, hyllsystem och garderobsinredning. Både RUT (hushållsmöbler) och ROT (fast inredning) kan vara tillämpligt." },
      { q: "Hur lång tid tar montering av IKEA-kök?", a: "Ett rakt kök (3–4 m): 1–2 dagar. L-format med köksö: 2–4 dagar. Vi hämtar och transporterar köket åt dig om du vill." },
      { q: "Kan ni montera TV på vägg med dold kabeldragning?", a: "Ja, vi monterar TV-fästen och drar kablar i väggen för en snygg installation. Priset ligger normalt på 1 500–3 500 kr." },
      { q: "Behöver jag vara hemma under monteringen?", a: "Idealt vid start och avslut. Många kunder i {area} lämnar nyckel och vi kontaktar dig när vi är klara." },
    ],
    en: [
      { q: "What type of assembly do you offer in {area}?", a: "We assemble everything from IKEA furniture and TV mounts to appliances, shelving systems and wardrobe interiors." },
      { q: "How long does IKEA kitchen assembly take?", a: "A straight kitchen (3–4m): 1–2 days. L-shaped with island: 2–4 days." },
      { q: "Can you mount a TV with hidden cables?", a: "Yes, we mount TV brackets and run cables inside walls. Typically 1,500–3,500 SEK." },
      { q: "Do I need to be home during assembly?", a: "Ideally at start and finish. Many clients in {area} leave a key and we contact you when done." },
    ]
  },
  "flytt": {
    sv: [
      { q: "Vad kostar flytthjälp i {area}?", a: "Flytthjälp kostar normalt 395–595 kr/timme och person. En lägenhetsflytt (2 rum) tar 3–5 timmar med 2 personer. Med RUT-avdrag (50%) halveras arbetskostnaden." },
      { q: "Ingår lastbil i priset?", a: "Vi erbjuder flytt med och utan fordon. Flytt med lastbil inkluderar normalt fordonet i timpriset. Ange din flytt-sträcka så ger vi dig ett fast pris." },
      { q: "Kan ni hjälpa med packning?", a: "Ja, vi erbjuder packhjälp som en tilläggstjänst. Vi tar med oss flyttkartonger, bubbelplast och tejp. Packning ger också RUT-avdrag." },
      { q: "Hur långt i förväg ska jag boka?", a: "Boka minst 2–3 veckor i förväg, speciellt vid månadsskiften (högsäsong). Sommar och nyår är extra populära perioder i {area}." },
    ],
    en: [
      { q: "What does moving help cost in {area}?", a: "Moving help typically costs 395–595 SEK/hour per person. A 2-room apartment takes 3–5 hours with 2 people. RUT deduction (50%) halves labor cost." },
      { q: "Is a truck included?", a: "We offer moves with and without vehicle. Moves with truck typically include the vehicle in the hourly rate." },
      { q: "Can you help with packing?", a: "Yes, we offer packing as an add-on. We bring boxes, bubble wrap and tape. Packing also qualifies for RUT." },
      { q: "How far in advance should I book?", a: "Book at least 2–3 weeks ahead, especially around month-ends (peak season)." },
    ]
  },
  "tekniska-installationer": {
    sv: [
      { q: "Vilka tekniska installationer erbjuder ni i {area}?", a: "Vi installerar nätverk (LAN/WiFi), larmsystem, smarta hem-system, kameraövervakning och AV-utrustning. Allt från enklare WiFi-förstärkning till komplett nätverksdragning." },
      { q: "Behöver jag förbereda något innan installation?", a: "Ha klart var du vill ha uttag/accesspunkter och vilken utrustning du har. Vi gör en kostnadsfri behovsanalys i {area} innan vi börjar." },
      { q: "Kan ni installera smarta hem-system?", a: "Ja — vi installerar system som Apple HomeKit, Google Home och Samsung SmartThings. Vi hjälper med allt från smarta lampor till avancerad hemautomation." },
      { q: "Ger tekniska installationer ROT-avdrag?", a: "Fast nätverksdragning och larminstallation kan ge ROT-avdrag (30%). Lösa produkter och enbart konfigurering ger normalt inte avdrag." },
    ],
    en: [
      { q: "What technical installations do you offer in {area}?", a: "We install networks (LAN/WiFi), alarm systems, smart home systems, camera surveillance and AV equipment." },
      { q: "Do I need to prepare anything?", a: "Know where you want outlets/access points and what equipment you have. We do a free needs analysis in {area}." },
      { q: "Can you install smart home systems?", a: "Yes — Apple HomeKit, Google Home, Samsung SmartThings and more. From smart lights to full home automation." },
      { q: "Do technical installations qualify for ROT?", a: "Fixed network wiring and alarm installation can qualify for ROT (30%). Loose products and configuration only typically do not." },
    ]
  },
  "mobelmontering": {
    sv: [
      { q: "Vilka möbler monterar ni?", a: "Vi monterar alla typer — IKEA, Jysk, Mio, EM och andra. Garderober, sängar, bokhyllor, skrivbord, TV-möbler och barnmöbler." },
      { q: "Hur lång tid tar montering av en PAX-garderob?", a: "En enkel PAX (100 cm): 1–2 timmar. Dubbel PAX med skjutdörrar: 2–4 timmar. Vi monterar alltid fast i väggen för säkerhet." },
      { q: "Tar ni med oss emballaget?", a: "Ja, vi tar med oss alla kartonger och emballage efter montering. Det ingår i priset." },
    ],
    en: [
      { q: "What furniture do you assemble?", a: "All types — IKEA, Jysk, Mio, EM and others. Wardrobes, beds, bookshelves, desks and children's furniture." },
      { q: "How long does a PAX wardrobe take?", a: "Single PAX (100cm): 1–2 hours. Double with sliding doors: 2–4 hours. Always wall-mounted for safety." },
      { q: "Do you take the packaging?", a: "Yes, we remove all boxes and packaging after assembly. It's included in the price." },
    ]
  },
  "inomhusmalning": {
    sv: [
      { q: "Hur lång tid tar målning av ett rum?", a: "Ett normalstort rum (12–15 kvm) tar 1 dag inklusive spackling och 2 strykningar. En hel lägenhet (3 rum) tar 3–5 dagar." },
      { q: "Vilken färg rekommenderar ni?", a: "Vi använder kvalitetsfärger från Alcro, Beckers eller Flügger. Helmatt (glans 7) är standard för väggar, halvmatt för kök/bad." },
      { q: "Behöver vi flytta ut möblerna?", a: "Vi täcker golv och möbler noggrant. Flytta möbler till rummets mitt om möjligt. Tyngre möbler kan stå kvar." },
      { q: "Kan man bo kvar under målningen?", a: "Ja, vi målar rum för rum. Modern inomhusfärg har låg lukt och torkar snabbt. Vädra gärna efter varje strykning." },
    ],
    en: [
      { q: "How long does it take to paint a room?", a: "A standard room (12–15 sqm) takes 1 day including filling and 2 coats. A full apartment (3 rooms) takes 3–5 days." },
      { q: "Which paint do you recommend?", a: "We use quality paints from Alcro, Beckers or Flügger. Matte (gloss 7) standard for walls, semi-matte for kitchen/bathroom." },
      { q: "Do we need to move furniture?", a: "We cover floors and furniture carefully. Move furniture to room center if possible." },
      { q: "Can we stay during painting?", a: "Yes, we paint room by room. Modern paint has low odor and dries quickly." },
    ]
  },
  "elinstallation": {
    sv: [
      { q: "Vad räknas som elinstallation?", a: "Alla fasta elarbeten: nya uttag, belysning, jordfelsbrytare, säkringsbyte, laddbox och elcentral. Allt utförs av behöriga elektriker." },
      { q: "Hur mycket kan jag spara med ROT-avdrag på elarbete?", a: "Du sparar 30% på arbetskostnaden, max 50 000 kr/person/år. En laddboxinstallation på 15 000 kr (arbete) ger 4 500 kr i ROT." },
      { q: "Behöver man uppgradera elsäkringen i äldre hus?", a: "Hus byggda före 1970 saknar ofta jordfelsbrytare och har underdimensionerade säkringar. Vi rekommenderar en elbesiktning om huset är äldre än 30 år." },
    ],
    en: [
      { q: "What counts as electrical installation?", a: "All fixed electrical work: new outlets, lighting, RCD breakers, fuse changes, EV chargers and consumer units." },
      { q: "How much can I save with ROT on electrical work?", a: "You save 30% on labor, max 50,000 SEK/person/year. A charger installation of 15,000 SEK (labor) gives 4,500 SEK ROT." },
      { q: "Do older houses need electrical upgrades?", a: "Houses built before 1970 often lack RCDs and have undersized fuses. We recommend an inspection if your house is over 30 years old." },
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
