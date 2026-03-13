import { 
  Hammer, Wrench, Paintbrush, Zap, Package, 
  Building, Home, Fence, PaintBucket
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NicheServiceMeta {
  slug: string;
  title: string;
  titleEn: string;
  heroTitle: string;        // Action-oriented H1, e.g. "Renovera Ditt Kök"
  heroTitleEn: string;
  metaDescription: string;  // Sales-focused meta desc for Google
  metaDescriptionEn: string;
  parentCategory: string;   // maps to serviceKey in LOCAL_SERVICES
  icon: LucideIcon;
  rotRut: 'ROT' | 'RUT';
  description: string;
  descriptionEn: string;
  usps: string[];
  uspsEn: string[];
  faqs: { q: string; a: string }[];
  faqsEn: { q: string; a: string }[];
  enSlug: string; // English URL slug
  introText?: string;    // Sales-oriented intro paragraph (sv)
  introTextEn?: string;  // Sales-oriented intro paragraph (en)
}

export const NICHE_SERVICES: NicheServiceMeta[] = [
  {
    slug: 'koksrenovering',
    title: 'Köksrenovering',
    titleEn: 'Kitchen Renovation',
    heroTitle: 'Renovera Ditt Kök',
    heroTitleEn: 'Renovate Your Kitchen',
    metaDescription: 'Dags att renovera köket? Fixcos erfarna hantverkare hjälper dig med komplett köksrenovering. Fast pris, 30% ROT-avdrag och garanti. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Time to renovate your kitchen? Fixco\'s experienced craftsmen handle your complete kitchen renovation. Fixed price, 30% ROT deduction and warranty. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'kok',
    icon: Home,
    rotRut: 'ROT',
    description: 'Komplett köksrenovering med ROT-avdrag. Vi hjälper dig från planering till färdigt kök – snickeri, el, VVS och målning.',
    descriptionEn: 'Complete kitchen renovation with ROT deduction. We help you from planning to finished kitchen – carpentry, electrical, plumbing and painting.',
    usps: ['Helhetslösning från design till installation', 'Samordning av alla hantverkare', '30% ROT-avdrag på arbetskostnaden', 'Garanti på allt arbete'],
    uspsEn: ['Complete solution from design to installation', 'Coordination of all tradespeople', '30% ROT deduction on labor', 'Warranty on all work'],
    faqs: [
      { q: 'Vad kostar en köksrenovering?', a: 'Priset varierar beroende på köksstorlek och materialval. Ett standardkök kostar vanligtvis 80 000–200 000 kr inklusive material och arbete. Med ROT-avdrag sparar du 30% på arbetskostnaden.' },
      { q: 'Hur lång tid tar en köksrenovering?', a: 'En typisk köksrenovering tar 2–4 veckor beroende på omfattning. Vi planerar noggrant för att minimera tiden utan fungerande kök.' },
      { q: 'Kan jag få ROT-avdrag på köksrenovering?', a: 'Ja! Arbetskostnaden för köksrenovering berättigar till 30% ROT-avdrag. Material ingår inte i avdraget.' },
      { q: 'Vad ingår i en köksrenovering från Fixco?', a: 'Vi erbjuder allt från rivning och elarbete till montering av nya skåp, bänkskivor, stänkskydd och vitvaror. Allt samordnas av en projektledare.' },
    ],
    faqsEn: [
      { q: 'What does a kitchen renovation cost?', a: 'The price varies depending on kitchen size and material choices. A standard kitchen typically costs SEK 80,000–200,000 including materials and labor. With ROT deduction you save 30% on labor.' },
      { q: 'How long does a kitchen renovation take?', a: 'A typical kitchen renovation takes 2–4 weeks depending on scope. We plan carefully to minimize time without a functioning kitchen.' },
      { q: 'Can I get ROT deduction on kitchen renovation?', a: 'Yes! The labor cost for kitchen renovation qualifies for 30% ROT deduction. Materials are not included in the deduction.' },
      { q: 'What is included in a kitchen renovation from Fixco?', a: 'We offer everything from demolition and electrical work to installation of new cabinets, countertops, backsplashes and appliances. Everything is coordinated by a project manager.' },
    ],
    enSlug: 'kitchen-renovation',
    introText: 'Drömmer du om ett nytt kök där morgonkaffet smakar lite extra? Fixco tar hand om hela din köksrenovering – från rivning av det gamla till ett komplett, nyinstallerat kök. Våra erfarna hantverkare samordnar snickeri, el och VVS så att du slipper stressen. Med fast pris och 30% ROT-avdrag vet du exakt vad det kostar.',
    introTextEn: 'Dreaming of a new kitchen where your morning coffee tastes just a little better? Fixco handles your entire kitchen renovation – from demolition to a fully installed kitchen. Our experienced craftsmen coordinate carpentry, electrical and plumbing so you can skip the stress. With fixed pricing and 30% ROT deduction, you know exactly what it costs.',
  },
  {
    slug: 'badrumsrenovering',
    title: 'Badrumsrenovering',
    titleEn: 'Bathroom Renovation',
    heroTitle: 'Renovera Ditt Badrum',
    heroTitleEn: 'Renovate Your Bathroom',
    metaDescription: 'Professionell badrumsrenovering med certifierade våtrumstekniker. Tätskikt, kakel, VVS – allt ingår. 30% ROT-avdrag och 10 års garanti. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Professional bathroom renovation with certified wet room technicians. Waterproofing, tiling, plumbing – all included. 30% ROT deduction and 10 year warranty. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'badrum',
    icon: Wrench,
    rotRut: 'ROT',
    description: 'Professionell badrumsrenovering med tätskikt, kakel och VVS. Komplett renovering med ROT-avdrag och garanti.',
    descriptionEn: 'Professional bathroom renovation with waterproofing, tiling and plumbing. Complete renovation with ROT deduction and warranty.',
    usps: ['Certifierade våtrumstekniker', 'Tätskikt enligt branschstandard', '30% ROT-avdrag', '10 års garanti på tätskikt'],
    uspsEn: ['Certified wet room technicians', 'Waterproofing per industry standard', '30% ROT deduction', '10 year waterproofing warranty'],
    faqs: [
      { q: 'Vad kostar en badrumsrenovering?', a: 'Ett standardbadrum (5-7 kvm) kostar vanligtvis 100 000–250 000 kr. Med ROT-avdrag sparar du 30% på arbetskostnaden.' },
      { q: 'Hur lång tid tar en badrumsrenovering?', a: 'Räkna med 3–5 veckor beroende på badrummets storlek och önskade åtgärder.' },
      { q: 'Behöver tätskiktet bytas?', a: 'Om ditt badrum är äldre än 20 år rekommenderar vi alltid byte av tätskikt för att undvika fuktskador.' },
      { q: 'Samordnar ni alla hantverkare?', a: 'Ja, vi samordnar allt – VVS, el, plattsättning, snickeri och målning – så du slipper boka flera olika firmor.' },
    ],
    faqsEn: [
      { q: 'What does a bathroom renovation cost?', a: 'A standard bathroom (5-7 sqm) typically costs SEK 100,000–250,000. With ROT deduction you save 30% on labor.' },
      { q: 'How long does a bathroom renovation take?', a: 'Expect 3–5 weeks depending on bathroom size and desired work.' },
      { q: 'Does the waterproofing need to be replaced?', a: 'If your bathroom is older than 20 years, we always recommend replacing the waterproofing to avoid moisture damage.' },
      { q: 'Do you coordinate all tradespeople?', a: 'Yes, we coordinate everything – plumbing, electrical, tiling, carpentry and painting – so you don\'t need to book multiple companies.' },
    ],
    enSlug: 'bathroom-renovation',
  },
  {
    slug: 'altanbygge',
    title: 'Altanbygge',
    titleEn: 'Deck Building',
    heroTitle: 'Bygg Din Drömaltan',
    heroTitleEn: 'Build Your Dream Deck',
    metaDescription: 'Bygg altan med professionella snickare. Trä eller komposit, 30% ROT-avdrag och garanti. Fast pris från grund till räcke. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Build a deck with professional carpenters. Wood or composite, 30% ROT deduction and warranty. Fixed price from foundation to railing. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'snickeri',
    icon: Fence,
    rotRut: 'ROT',
    description: 'Bygg din drömaltan med professionella snickare. Trä- eller komposittrall med ROT-avdrag. Komplett altan från grund till räcke.',
    descriptionEn: 'Build your dream deck with professional carpenters. Wood or composite decking with ROT deduction. Complete deck from foundation to railing.',
    usps: ['Trä eller komposit – du väljer', 'Bygglov och konstruktion', '30% ROT-avdrag', 'Hållbart och underhållsfritt'],
    uspsEn: ['Wood or composite – your choice', 'Building permits and construction', '30% ROT deduction', 'Durable and low maintenance'],
    faqs: [
      { q: 'Vad kostar det att bygga altan?', a: 'En altan kostar vanligtvis 1 500–3 500 kr/kvm beroende på material och konstruktion. Med ROT-avdrag sparar du 30% på arbetskostnaden.' },
      { q: 'Behöver jag bygglov för altan?', a: 'Altaner under 1,8 meter höjd kräver normalt inte bygglov, men reglerna varierar. Vi hjälper dig med eventuell ansökan.' },
      { q: 'Trä eller komposit – vad är bäst?', a: 'Trä är billigare men kräver underhåll. Komposit kostar mer men är i princip underhållsfritt och håller längre.' },
      { q: 'Hur lång tid tar det att bygga en altan?', a: 'En standardaltan tar vanligtvis 3–7 arbetsdagar beroende på storlek och komplexitet.' },
    ],
    faqsEn: [
      { q: 'What does it cost to build a deck?', a: 'A deck typically costs SEK 1,500–3,500/sqm depending on material and construction. With ROT deduction you save 30% on labor.' },
      { q: 'Do I need a building permit for a deck?', a: 'Decks under 1.8 meters height normally don\'t require a permit, but rules vary. We help with any application.' },
      { q: 'Wood or composite – which is best?', a: 'Wood is cheaper but requires maintenance. Composite costs more but is virtually maintenance-free and lasts longer.' },
      { q: 'How long does it take to build a deck?', a: 'A standard deck typically takes 3–7 working days depending on size and complexity.' },
    ],
    enSlug: 'deck-building',
  },
  {
    slug: 'golvlaggning',
    title: 'Golvläggning',
    titleEn: 'Flooring Installation',
    heroTitle: 'Lägg Nytt Golv',
    heroTitleEn: 'Install New Flooring',
    metaDescription: 'Professionell golvläggning – parkett, laminat, vinyl och klinker. 30% ROT-avdrag, fast pris och garanti. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Professional flooring installation – parquet, laminate, vinyl and tile. 30% ROT deduction, fixed price and warranty. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'golv',
    icon: Building,
    rotRut: 'ROT',
    description: 'Professionell golvläggning – parkett, laminat, vinyl och klinker. Vi lägger alla typer av golv med ROT-avdrag.',
    descriptionEn: 'Professional flooring installation – parquet, laminate, vinyl and tile. We install all types of flooring with ROT deduction.',
    usps: ['Alla typer av golv', 'Undergolvberedning ingår', '30% ROT-avdrag', 'Snyggt och hållbart resultat'],
    uspsEn: ['All types of flooring', 'Subfloor preparation included', '30% ROT deduction', 'Beautiful and durable result'],
    faqs: [
      { q: 'Vad kostar golvläggning?', a: 'Priset beror på golvtyp och yta. Laminat kostar från 300 kr/kvm och parkett från 500 kr/kvm inklusive arbete. ROT-avdrag ger 30% rabatt på arbetet.' },
      { q: 'Hur lång tid tar det att lägga golv?', a: 'Ett rum på 20 kvm tar normalt 1–2 dagar. Hela lägenheten kan ta 3–5 dagar.' },
      { q: 'Behöver jag ta bort det gamla golvet först?', a: 'Vi tar hand om rivning av befintligt golv och förberedelse av underlaget – allt ingår i offerten.' },
      { q: 'Vilken golvtyp rekommenderar ni?', a: 'Det beror på rummet – vi rekommenderar klinker i badrum, parkett i vardagsrum och laminat som budgetalternativ.' },
    ],
    faqsEn: [
      { q: 'What does flooring installation cost?', a: 'Price depends on flooring type and area. Laminate starts at SEK 300/sqm and parquet from SEK 500/sqm including labor. ROT gives 30% off labor.' },
      { q: 'How long does flooring installation take?', a: 'A 20 sqm room typically takes 1–2 days. An entire apartment can take 3–5 days.' },
      { q: 'Do I need to remove the old floor first?', a: 'We handle removal of existing flooring and subfloor preparation – everything is included in the quote.' },
      { q: 'Which flooring type do you recommend?', a: 'It depends on the room – we recommend tile for bathrooms, parquet for living rooms, and laminate as a budget alternative.' },
    ],
    enSlug: 'flooring-installation',
  },
  {
    slug: 'fasadmalning',
    title: 'Fasadmålning',
    titleEn: 'Exterior Painting',
    heroTitle: 'Måla Om Din Fasad',
    heroTitleEn: 'Repaint Your Exterior',
    metaDescription: 'Professionell fasadmålning med kvalitetsfärg som håller 10+ år. Ställning ingår, 30% ROT-avdrag och garanti. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Professional exterior painting with quality paint lasting 10+ years. Scaffolding included, 30% ROT deduction and warranty. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'malning',
    icon: PaintBucket,
    rotRut: 'ROT',
    description: 'Professionell fasadmålning med ROT-avdrag. Vi målar villor, radhus och flerbostadshus med kvalitetsfärg som håller i många år.',
    descriptionEn: 'Professional exterior painting with ROT deduction. We paint houses, townhouses and apartments with quality paint that lasts for years.',
    usps: ['Kvalitetsfärg som håller 10+ år', 'Ställningsbyggnad ingår', '30% ROT-avdrag', 'Förbehandling och grundning'],
    uspsEn: ['Quality paint lasting 10+ years', 'Scaffolding included', '30% ROT deduction', 'Pre-treatment and priming'],
    faqs: [
      { q: 'Vad kostar fasadmålning?', a: 'Fasadmålning kostar vanligtvis 150–350 kr/kvm beroende på ytans skick och tillgänglighet. ROT-avdrag ger 30% rabatt på arbetet.' },
      { q: 'Hur ofta bör man måla om fasaden?', a: 'Generellt rekommenderas ommålning var 8–12 år beroende på väderstreck och färgtyp.' },
      { q: 'Ingår ställning i priset?', a: 'Ja, vi inkluderar alltid ställning eller skylift i offerten så du vet totalkostnaden.' },
      { q: 'Vilken tid på året är bäst för fasadmålning?', a: 'Maj till september är bäst – temperaturen bör vara minst +10°C och det bör vara torrt.' },
    ],
    faqsEn: [
      { q: 'What does exterior painting cost?', a: 'Exterior painting typically costs SEK 150–350/sqm depending on surface condition and accessibility. ROT deduction gives 30% off labor.' },
      { q: 'How often should you repaint the facade?', a: 'Generally we recommend repainting every 8–12 years depending on exposure and paint type.' },
      { q: 'Is scaffolding included in the price?', a: 'Yes, we always include scaffolding or lift in the quote so you know the total cost.' },
      { q: 'What time of year is best for exterior painting?', a: 'May to September is best – temperature should be at least +10°C and conditions should be dry.' },
    ],
    enSlug: 'exterior-painting',
  },
  {
    slug: 'inomhusmalning',
    title: 'Inomhusmålning',
    titleEn: 'Interior Painting',
    heroTitle: 'Måla Om Hemma',
    heroTitleEn: 'Repaint Your Home',
    metaDescription: 'Professionell inomhusmålning – väggar, tak och snickerier. Spackling ingår, 30% ROT-avdrag och garanti. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Professional interior painting – walls, ceilings and woodwork. Patching included, 30% ROT deduction and warranty. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'malning',
    icon: Paintbrush,
    rotRut: 'ROT',
    description: 'Professionell inomhusmålning med ROT-avdrag. Väggar, tak, lister och snickerier – vi ger ditt hem en fräsch look.',
    descriptionEn: 'Professional interior painting with ROT deduction. Walls, ceilings, trim and woodwork – we give your home a fresh look.',
    usps: ['Väggar, tak och snickerier', 'Spackling och förarbete ingår', '30% ROT-avdrag', 'Miljövänlig färg'],
    uspsEn: ['Walls, ceilings and woodwork', 'Patching and prep work included', '30% ROT deduction', 'Eco-friendly paint'],
    faqs: [
      { q: 'Vad kostar inomhusmålning?', a: 'Att måla ett rum kostar vanligtvis 5 000–15 000 kr beroende på storlek och skick. ROT-avdrag ger 30% rabatt på arbetet.' },
      { q: 'Behöver jag flytta möbler?', a: 'Vi täcker och skyddar möbler och golv noggrant. Större möbler kan behöva flyttas från väggarna.' },
      { q: 'Hur många strykningar behövs?', a: 'Normalt behövs 2 strykningar på väggar. Vid färgbyte kan det behövas fler lager eller en grundning.' },
      { q: 'Ingår spackling?', a: 'Ja, vi spacklar hål och sprickor samt slipar ytan som en del av förarbetet.' },
    ],
    faqsEn: [
      { q: 'What does interior painting cost?', a: 'Painting a room typically costs SEK 5,000–15,000 depending on size and condition. ROT deduction gives 30% off labor.' },
      { q: 'Do I need to move furniture?', a: 'We cover and protect furniture and floors carefully. Larger furniture may need to be moved from walls.' },
      { q: 'How many coats are needed?', a: 'Normally 2 coats on walls. When changing colors, more layers or a primer may be needed.' },
      { q: 'Is patching included?', a: 'Yes, we patch holes and cracks and sand the surface as part of the prep work.' },
    ],
    enSlug: 'interior-painting',
  },
  {
    slug: 'elinstallation',
    title: 'Elinstallation',
    titleEn: 'Electrical Installation',
    heroTitle: 'Boka Elinstallation',
    heroTitleEn: 'Book Electrical Installation',
    metaDescription: 'Auktoriserade elektriker för alla typer av elarbeten. Besiktningsprotokoll ingår, 30% ROT-avdrag och garanti. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Authorized electricians for all types of electrical work. Inspection protocol included, 30% ROT deduction and warranty. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'el',
    icon: Zap,
    rotRut: 'ROT',
    description: 'Auktoriserade elektriker för alla typer av elinstallationer. Från elcentral till uttag och belysning med ROT-avdrag.',
    descriptionEn: 'Authorized electricians for all types of electrical installations. From fuse boxes to outlets and lighting with ROT deduction.',
    usps: ['Auktoriserade elektriker', 'Alla typer av elarbeten', '30% ROT-avdrag', 'Besiktningsprotokoll ingår'],
    uspsEn: ['Authorized electricians', 'All types of electrical work', '30% ROT deduction', 'Inspection protocol included'],
    faqs: [
      { q: 'Vad kostar en elektriker?', a: 'Elarbete kostar vanligtvis 1 000–1 200 kr/h inklusive moms. Med ROT-avdrag betalar du bara 70% av arbetskostnaden.' },
      { q: 'Behöver jag en auktoriserad elektriker?', a: 'Ja, i Sverige krävs behörig elektriker för all fast installation. Alla våra elektriker är auktoriserade.' },
      { q: 'Kan ni installera laddbox för elbil?', a: 'Ja! Vi installerar laddboxar från alla stora tillverkare. Laddboxinstallation berättigar till ROT-avdrag.' },
      { q: 'Ingår besiktning?', a: 'Ja, vi utfärdar alltid ett besiktningsprotokoll efter avslutat arbete som visar att installationen är säker.' },
    ],
    faqsEn: [
      { q: 'What does an electrician cost?', a: 'Electrical work typically costs SEK 1,000–1,200/h including VAT. With ROT deduction you only pay 70% of labor.' },
      { q: 'Do I need an authorized electrician?', a: 'Yes, in Sweden a licensed electrician is required for all permanent installations. All our electricians are authorized.' },
      { q: 'Can you install EV chargers?', a: 'Yes! We install charging stations from all major manufacturers. EV charger installation qualifies for ROT deduction.' },
      { q: 'Is inspection included?', a: 'Yes, we always issue an inspection protocol after completed work showing the installation is safe.' },
    ],
    enSlug: 'electrical-installation',
  },
  {
    slug: 'koksmontering',
    title: 'Köksmontering',
    titleEn: 'Kitchen Installation',
    heroTitle: 'Montera Nytt Kök',
    heroTitleEn: 'Install Your New Kitchen',
    metaDescription: 'Professionell köksmontering – IKEA, Marbodal, HTH och alla märken. Monterat på 1–3 dagar, 30% ROT-avdrag. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Professional kitchen installation – IKEA, Marbodal, HTH and all brands. Installed in 1–3 days, 30% ROT deduction. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'kok',
    icon: Package,
    rotRut: 'ROT',
    description: 'Professionell köksmontering – IKEA, Marbodal, HTH och alla andra märken. Vi monterar ditt nya kök snabbt och korrekt.',
    descriptionEn: 'Professional kitchen installation – IKEA, Marbodal, HTH and all other brands. We install your new kitchen quickly and correctly.',
    usps: ['Alla köksvarumärken', 'Bänkskiva och vitvaror', '30% ROT-avdrag', 'Monterat på 1–3 dagar'],
    uspsEn: ['All kitchen brands', 'Countertops and appliances', '30% ROT deduction', 'Installed in 1–3 days'],
    faqs: [
      { q: 'Vad kostar köksmontering?', a: 'Montering av ett standardkök kostar vanligtvis 15 000–30 000 kr beroende på köksstorlek. Med ROT-avdrag sparar du 30%.' },
      { q: 'Monterar ni IKEA-kök?', a: 'Ja! Vi monterar kök från IKEA, Marbodal, HTH, Ballingslöv och alla andra tillverkare.' },
      { q: 'Ingår el- och VVS-arbete?', a: 'Vi kan samordna el- och VVS-anslutningar som en del av monteringen. Berätta vad du behöver så ger vi en komplett offert.' },
      { q: 'Hur lång tid tar köksmontering?', a: 'Ett standardkök monteras vanligtvis på 1–3 arbetsdagar. Större eller mer komplexa kök kan ta längre tid.' },
    ],
    faqsEn: [
      { q: 'What does kitchen installation cost?', a: 'Installation of a standard kitchen typically costs SEK 15,000–30,000 depending on size. With ROT deduction you save 30%.' },
      { q: 'Do you install IKEA kitchens?', a: 'Yes! We install kitchens from IKEA, Marbodal, HTH, Ballingslöv and all other manufacturers.' },
      { q: 'Is electrical and plumbing work included?', a: 'We can coordinate electrical and plumbing connections as part of the installation. Tell us what you need for a complete quote.' },
      { q: 'How long does kitchen installation take?', a: 'A standard kitchen is typically installed in 1–3 working days. Larger or more complex kitchens may take longer.' },
    ],
    enSlug: 'kitchen-installation',
  },
  {
    slug: 'mobelmontering',
    title: 'Möbelmontering',
    titleEn: 'Furniture Assembly',
    heroTitle: 'Boka Möbelmontering',
    heroTitleEn: 'Book Furniture Assembly',
    metaDescription: 'Professionell möbelmontering – IKEA och alla varumärken. Snabbt, pålitligt och 50% RUT-avdrag. ★ 5/5 betyg. Begär gratis offert!',
    metaDescriptionEn: 'Professional furniture assembly – IKEA and all brands. Fast, reliable and 50% RUT deduction. ★ 5/5 rating. Get a free quote!',
    parentCategory: 'montering',
    icon: Package,
    rotRut: 'RUT',
    description: 'Professionell möbelmontering med RUT-avdrag. Vi monterar IKEA-möbler, garderober, hyllsystem och mycket mer.',
    descriptionEn: 'Professional furniture assembly with RUT deduction. We assemble IKEA furniture, wardrobes, shelving systems and much more.',
    usps: ['IKEA och alla varumärken', 'Snabbt och pålitligt', '50% RUT-avdrag', 'Inga dolda kostnader'],
    uspsEn: ['IKEA and all brands', 'Fast and reliable', '50% RUT deduction', 'No hidden costs'],
    faqs: [
      { q: 'Vad kostar möbelmontering?', a: 'Priset beror på möbelns komplexitet. En PAX-garderob kostar ca 1 500–3 000 kr att montera. Med RUT-avdrag betalar du bara hälften.' },
      { q: 'Monterar ni IKEA-möbler?', a: 'Ja! Vi monterar alla IKEA-möbler samt möbler från andra tillverkare. Vi är vana vid alla typer av plattpaket.' },
      { q: 'Får jag RUT-avdrag på möbelmontering?', a: 'Ja, möbelmontering berättigar till 50% RUT-avdrag. Vi sköter pappersarbetet åt dig.' },
      { q: 'Hur snabbt kan ni komma?', a: 'Vi erbjuder ofta montering inom 2–5 arbetsdagar. Vid stor efterfrågan kan det ta något längre.' },
    ],
    faqsEn: [
      { q: 'What does furniture assembly cost?', a: 'Price depends on furniture complexity. A PAX wardrobe costs about SEK 1,500–3,000 to assemble. With RUT deduction you pay only half.' },
      { q: 'Do you assemble IKEA furniture?', a: 'Yes! We assemble all IKEA furniture and furniture from other manufacturers. We\'re experienced with all flat-pack types.' },
      { q: 'Can I get RUT deduction on furniture assembly?', a: 'Yes, furniture assembly qualifies for 50% RUT deduction. We handle the paperwork for you.' },
      { q: 'How quickly can you come?', a: 'We often offer assembly within 2–5 working days. During high demand it may take a bit longer.' },
    ],
    enSlug: 'furniture-assembly',
  },
];

// Merge with expanded niche services
import { EXPANDED_NICHE_SERVICES } from "./nicheServiceDataExpanded";

export const ALL_NICHE_SERVICES: NicheServiceMeta[] = [...NICHE_SERVICES, ...EXPANDED_NICHE_SERVICES];

export const NICHE_SLUGS = ALL_NICHE_SERVICES.map(s => s.slug);

export const getNicheService = (slug: string): NicheServiceMeta | undefined => {
  return ALL_NICHE_SERVICES.find(s => s.slug === slug);
};

export const getNicheServiceByEnSlug = (enSlug: string): NicheServiceMeta | undefined => {
  return ALL_NICHE_SERVICES.find(s => s.enSlug === enSlug);
};
