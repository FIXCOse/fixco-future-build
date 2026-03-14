// ============================================================
// Auto-generated NicheServiceMeta for 120+ expanded SEO slugs
// Uses category-specific templates for unique content per slug
// ============================================================

import { 
  Hammer, Wrench, Paintbrush, Zap, Package, 
  Building, Home, Fence, PaintBucket, TreePine,
  Truck, ShieldCheck, Plug, Droplets, Shovel,
  SprayCan, Scissors, Move, Monitor, Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NicheServiceMeta } from "./nicheServiceData";
import { EXPANDED_SERVICES, EXPANDED_SERVICE_NAME_EN } from "./seoSlugsExpansion";

// Icon mapping per serviceKey
const SERVICE_KEY_ICONS: Record<string, LucideIcon> = {
  snickeri: Hammer,
  vvs: Wrench,
  el: Zap,
  malning: Paintbrush,
  golv: Building,
  montering: Package,
  tradgard: TreePine,
  markarbeten: Shovel,
  stadning: Sparkles,
  flytt: Truck,
  "tekniska-installationer": Monitor,
  rivning: Hammer,
};

// Parent category mapping (serviceKey → database category for related services)
const SERVICE_KEY_TO_CATEGORY: Record<string, string> = {
  snickeri: "snickeri",
  vvs: "vvs",
  el: "el",
  malning: "malning",
  golv: "golv",
  montering: "montering",
  tradgard: "tradgard",
  markarbeten: "markarbeten",
  stadning: "stadning",
  flytt: "flytt",
  "tekniska-installationer": "tekniska-installationer",
  rivning: "rivning",
};

// Category-specific FAQ templates (sv)
const CATEGORY_FAQS: Record<string, { q: string; a: string }[]> = {
  snickeri: [
    { q: "Vad kostar en snickare per timme?", a: "En professionell snickare kostar vanligtvis 850–1 200 kr/h inklusive moms. Med ROT-avdrag betalar du bara 70% av arbetskostnaden." },
    { q: "Hur lång tid tar ett renoveringsprojekt?", a: "Det beror helt på projektets omfattning. En mindre renovering kan ta några dagar medan en totalrenovering tar 4–8 veckor. Vi ger alltid en tidsplan i offerten." },
    { q: "Kan jag få ROT-avdrag?", a: "Ja! Allt snickeriarbete i din bostad berättigar till 30% ROT-avdrag på arbetskostnaden. Max 50 000 kr per person och år." },
    { q: "Samordnar ni alla hantverkare?", a: "Ja, Fixco samordnar alla hantverkare som behövs – snickare, elektriker, VVS och målare. Du får en kontaktperson som håller koll på allt." },
  ],
  vvs: [
    { q: "Vad kostar en VVS-tekniker?", a: "VVS-arbete kostar vanligtvis 900–1 300 kr/h inklusive moms. Med ROT-avdrag sparar du 30% på arbetskostnaden." },
    { q: "Hur snabbt kan ni komma vid akut läcka?", a: "Vid akuta situationer försöker vi komma samma dag eller senast nästa arbetsdag. Kontakta oss direkt så prioriterar vi ditt ärende." },
    { q: "Behöver jag stänga av vattnet?", a: "Vid de flesta VVS-arbeten stänger vi av vattnet tillfälligt. Vi informerar dig alltid innan och minimerar avbrottstiden." },
    { q: "Får jag ROT-avdrag på VVS-arbete?", a: "Ja, allt VVS-arbete i bostaden berättigar till 30% ROT-avdrag. Vi sköter administrationen åt dig." },
  ],
  el: [
    { q: "Måste jag anlita en auktoriserad elektriker?", a: "Ja, i Sverige krävs behörig elektriker för all fast elinstallation. Alla våra elektriker är auktoriserade och certifierade." },
    { q: "Vad kostar elarbete per timme?", a: "Elarbete kostar vanligtvis 1 000–1 200 kr/h inklusive moms. Med ROT-avdrag betalar du bara 70% av arbetskostnaden." },
    { q: "Ingår besiktningsprotokoll?", a: "Ja, vi utfärdar alltid ett besiktningsprotokoll efter avslutat arbete som visar att installationen uppfyller alla säkerhetskrav." },
    { q: "Kan jag få ROT-avdrag på elarbete?", a: "Ja! Elinstallationer i bostaden berättigar till 30% ROT-avdrag på arbetskostnaden." },
  ],
  malning: [
    { q: "Vad kostar en målare per timme?", a: "Måleriarbete kostar vanligtvis 750–1 000 kr/h inklusive moms. Med ROT-avdrag betalar du bara 70% av arbetskostnaden." },
    { q: "Ingår spackling och förarbete?", a: "Ja, vi spacklar sprickor och hål, slipar ytor och grundmålar som en del av varje projekt. Förarbete är avgörande för ett bra resultat." },
    { q: "Vilken färg rekommenderar ni?", a: "Vi använder kvalitetsfärg från Alcro och Beckers som ger bäst resultat och hållbarhet. Vi hjälper gärna med färgval." },
    { q: "Får jag ROT-avdrag på målning?", a: "Ja, allt måleriarbete i bostaden berättigar till 30% ROT-avdrag. Max 50 000 kr per person och år." },
  ],
  golv: [
    { q: "Vilken golvtyp passar bäst?", a: "Det beror på rummet – parkett för vardagsrum, klinker i badrum, laminat som budgetalternativ och vinyl för hög slitstyrka. Vi rådger gärna." },
    { q: "Behöver det gamla golvet rivas först?", a: "Vi tar hand om rivning av befintligt golv och beredning av underlaget – allt ingår i offerten." },
    { q: "Hur lång tid tar golvläggning?", a: "Ett rum på 20 kvm tar normalt 1–2 dagar. En hel lägenhet kan ta 3–5 arbetsdagar." },
    { q: "Får jag ROT-avdrag på golvarbete?", a: "Ja, golvläggning och golvslipning berättigar till 30% ROT-avdrag på arbetskostnaden." },
  ],
  montering: [
    { q: "Vad kostar montering per timme?", a: "Montering kostar vanligtvis 650–900 kr/h inklusive moms. Med RUT-avdrag betalar du bara hälften." },
    { q: "Monterar ni alla varumärken?", a: "Ja! Vi monterar från IKEA, Elfa, HTH, Marbodal och alla andra tillverkare. Vi är vana vid alla typer av plattpaket." },
    { q: "Hur snabbt kan ni komma?", a: "Vi erbjuder ofta montering inom 2–5 arbetsdagar. Vid stor efterfrågan kan det ta något längre." },
    { q: "Får jag RUT-avdrag?", a: "Ja, montering berättigar till 50% RUT-avdrag. Vi sköter administrationen åt dig." },
  ],
  tradgard: [
    { q: "Vad kostar trädgårdsarbete?", a: "Trädgårdstjänster kostar vanligtvis 600–900 kr/h inklusive moms. Med RUT-avdrag betalar du bara hälften." },
    { q: "Jobbar ni året runt?", a: "Ja, vi utför trädgårdsarbete året runt – beskärning, röjning och planering under vintern, plantering och skötsel under säsongen." },
    { q: "Ingår borttransport av avfall?", a: "Ja, vi tar hand om allt trädgårdsavfall och transporterar det till återvinning." },
    { q: "Får jag RUT-avdrag på trädgårdsarbete?", a: "Ja, de flesta trädgårdstjänster berättigar till 50% RUT-avdrag." },
  ],
  markarbeten: [
    { q: "Vad kostar markarbeten?", a: "Priset varierar beroende på arbetets omfattning. Enklare plattläggning kan kosta från 800 kr/kvm. Vi ger alltid en fast offert." },
    { q: "Behöver jag bygglov?", a: "De flesta markarbeten kräver inte bygglov, men det finns undantag. Vi hjälper dig att kolla vad som gäller för ditt projekt." },
    { q: "Hur lång tid tar markarbeten?", a: "En uppfart eller plattsättning tar vanligtvis 3–7 arbetsdagar. Större projekt som dränering kan ta 1–3 veckor." },
    { q: "Får jag ROT-avdrag?", a: "Ja, markarbeten i anslutning till bostaden berättigar normalt till 30% ROT-avdrag." },
  ],
  stadning: [
    { q: "Vad kostar städning per timme?", a: "Städning kostar vanligtvis 450–650 kr/h inklusive moms. Med RUT-avdrag betalar du bara hälften." },
    { q: "Tar ni med eget material?", a: "Ja, vi tar med alla rengöringsmedel och redskap som behövs. Du behöver inte köpa något." },
    { q: "Hur bokar jag?", a: "Du kan boka direkt på vår hemsida eller ringa oss. Vi bekräftar datum och tid inom 24 timmar." },
    { q: "Får jag RUT-avdrag?", a: "Ja, alla städtjänster berättigar till 50% RUT-avdrag. Vi sköter administrationen åt dig." },
  ],
  flytt: [
    { q: "Vad kostar flytt?", a: "Priset beror på bostadens storlek och avstånd. En normal lägenhetsflytt kostar vanligtvis 3 000–8 000 kr. Med RUT-avdrag sparar du 50%." },
    { q: "Ingår packmaterial?", a: "Vi kan tillhandahålla kartonger, bubbelplast och tejp mot en tilläggskostnad. Fråga om våra paketlösningar." },
    { q: "Är mina saker försäkrade?", a: "Ja, vi har ansvarsförsäkring som täcker eventuella skador under flytten." },
    { q: "Får jag RUT-avdrag?", a: "Ja, flytthjälp berättigar till 50% RUT-avdrag på arbetskostnaden." },
  ],
  "tekniska-installationer": [
    { q: "Vad kostar installation?", a: "Priset varierar beroende på typ av installation. Kontakta oss för en kostnadsfri offert anpassad efter dina behov." },
    { q: "Behöver jag dra ny kabel?", a: "Det beror på installationen. Många smarta system fungerar trådlöst, men vissa kräver kabelkoppling. Vi gör en bedömning på plats." },
    { q: "Får jag ROT-avdrag?", a: "Ja, tekniska installationer i bostaden berättigar till 30% ROT-avdrag på arbetskostnaden." },
    { q: "Ger ni support efteråt?", a: "Ja, vi erbjuder support och hjälper till med konfiguration efter installation." },
  ],
  rivning: [
    { q: "Vad kostar rivning?", a: "Rivning av badrum kostar vanligtvis 10 000–25 000 kr. Rivning av kök 8 000–20 000 kr. Vi ger alltid fast pris." },
    { q: "Ingår borttransport?", a: "Ja, vi tar hand om allt rivningsavfall och transporterar det till godkänd deponi eller återvinning." },
    { q: "Hur lång tid tar rivning?", a: "Rivning av ett badrum tar normalt 1–2 dagar. Kök ca 1 dag. Större projekt kan ta längre." },
    { q: "Kan ni riva utan att skada intilliggande ytor?", a: "Ja, vi skyddar intilliggande ytor noggrant med plast och skivmaterial för att minimera risk för skador." },
  ],
};

// Category-specific FAQ templates (en)
const CATEGORY_FAQS_EN: Record<string, { q: string; a: string }[]> = {
  snickeri: [
    { q: "What does a carpenter cost per hour?", a: "A professional carpenter typically costs SEK 850–1,200/h including VAT. With ROT deduction you only pay 70% of labor costs." },
    { q: "How long does a renovation project take?", a: "It depends on the scope. A smaller renovation may take a few days while a full renovation takes 4–8 weeks. We always provide a timeline in the quote." },
    { q: "Can I get ROT deduction?", a: "Yes! All carpentry work in your home qualifies for 30% ROT deduction on labor costs. Max SEK 50,000 per person per year." },
    { q: "Do you coordinate all tradespeople?", a: "Yes, Fixco coordinates all needed tradespeople – carpenters, electricians, plumbers and painters. You get one contact person overseeing everything." },
  ],
  vvs: [
    { q: "What does a plumber cost?", a: "Plumbing work typically costs SEK 900–1,300/h including VAT. With ROT deduction you save 30% on labor costs." },
    { q: "How quickly can you come for emergencies?", a: "For urgent situations we try to come the same day or next business day. Contact us directly and we'll prioritize your case." },
    { q: "Do I need to shut off the water?", a: "For most plumbing work we temporarily shut off the water. We always inform you beforehand and minimize downtime." },
    { q: "Can I get ROT deduction on plumbing?", a: "Yes, all plumbing work in the home qualifies for 30% ROT deduction. We handle the administration for you." },
  ],
  el: [
    { q: "Do I need an authorized electrician?", a: "Yes, in Sweden a licensed electrician is required for all permanent electrical installations. All our electricians are authorized and certified." },
    { q: "What does electrical work cost?", a: "Electrical work typically costs SEK 1,000–1,200/h including VAT. With ROT deduction you only pay 70% of labor." },
    { q: "Is an inspection protocol included?", a: "Yes, we always issue an inspection protocol after completed work confirming the installation meets all safety requirements." },
    { q: "Can I get ROT deduction?", a: "Yes! Electrical installations in the home qualify for 30% ROT deduction on labor costs." },
  ],
  malning: [
    { q: "What does a painter cost per hour?", a: "Painting work typically costs SEK 750–1,000/h including VAT. With ROT deduction you only pay 70% of labor." },
    { q: "Is patching and prep included?", a: "Yes, we patch cracks and holes, sand surfaces and prime as part of every project. Prep work is crucial for great results." },
    { q: "What paint do you recommend?", a: "We use quality paint from Alcro and Beckers for the best results and durability. We're happy to help with color choices." },
    { q: "Can I get ROT deduction?", a: "Yes, all painting work in the home qualifies for 30% ROT deduction. Max SEK 50,000 per person per year." },
  ],
  golv: [
    { q: "Which flooring type is best?", a: "It depends on the room – parquet for living rooms, tile for bathrooms, laminate as a budget option, and vinyl for high durability. We're happy to advise." },
    { q: "Does old flooring need to be removed?", a: "We handle removal of existing flooring and subfloor preparation – everything is included in the quote." },
    { q: "How long does flooring take?", a: "A 20 sqm room typically takes 1–2 days. An entire apartment can take 3–5 working days." },
    { q: "Can I get ROT deduction?", a: "Yes, flooring installation and sanding qualifies for 30% ROT deduction on labor costs." },
  ],
  montering: [
    { q: "What does assembly cost?", a: "Assembly typically costs SEK 650–900/h including VAT. With RUT deduction you only pay half." },
    { q: "Do you assemble all brands?", a: "Yes! We assemble from IKEA, Elfa, HTH, Marbodal and all other manufacturers. We're experienced with all flat-pack types." },
    { q: "How quickly can you come?", a: "We often offer assembly within 2–5 working days. During high demand it may take a bit longer." },
    { q: "Can I get RUT deduction?", a: "Yes, assembly qualifies for 50% RUT deduction. We handle the paperwork for you." },
  ],
  tradgard: [
    { q: "What does garden work cost?", a: "Garden services typically cost SEK 600–900/h including VAT. With RUT deduction you only pay half." },
    { q: "Do you work year-round?", a: "Yes, we do garden work year-round – pruning and clearing in winter, planting and maintenance in season." },
    { q: "Is waste removal included?", a: "Yes, we handle all garden waste and transport it for recycling." },
    { q: "Can I get RUT deduction?", a: "Yes, most garden services qualify for 50% RUT deduction." },
  ],
  markarbeten: [
    { q: "What do groundworks cost?", a: "Prices vary by scope. Simple paving starts at SEK 800/sqm. We always provide a fixed quote." },
    { q: "Do I need a building permit?", a: "Most groundworks don't require permits, but there are exceptions. We help you check what applies to your project." },
    { q: "How long do groundworks take?", a: "A driveway or paving typically takes 3–7 working days. Larger projects like drainage can take 1–3 weeks." },
    { q: "Can I get ROT deduction?", a: "Yes, groundworks connected to the home normally qualify for 30% ROT deduction." },
  ],
  stadning: [
    { q: "What does cleaning cost?", a: "Cleaning typically costs SEK 450–650/h including VAT. With RUT deduction you only pay half." },
    { q: "Do you bring your own supplies?", a: "Yes, we bring all cleaning products and equipment needed. You don't need to buy anything." },
    { q: "How do I book?", a: "You can book directly on our website or call us. We confirm date and time within 24 hours." },
    { q: "Can I get RUT deduction?", a: "Yes, all cleaning services qualify for 50% RUT deduction. We handle the paperwork for you." },
  ],
  flytt: [
    { q: "What does moving cost?", a: "Price depends on home size and distance. A normal apartment move typically costs SEK 3,000–8,000. With RUT deduction you save 50%." },
    { q: "Are packing materials included?", a: "We can provide boxes, bubble wrap and tape for an additional cost. Ask about our package deals." },
    { q: "Are my belongings insured?", a: "Yes, we have liability insurance covering any damages during the move." },
    { q: "Can I get RUT deduction?", a: "Yes, moving help qualifies for 50% RUT deduction on labor costs." },
  ],
  "tekniska-installationer": [
    { q: "What does installation cost?", a: "Prices vary by installation type. Contact us for a free quote tailored to your needs." },
    { q: "Do I need new cabling?", a: "It depends on the installation. Many smart systems work wirelessly, but some require wired connections. We assess on-site." },
    { q: "Can I get ROT deduction?", a: "Yes, technical installations in the home qualify for 30% ROT deduction on labor." },
    { q: "Do you provide support afterwards?", a: "Yes, we offer support and help with configuration after installation." },
  ],
  rivning: [
    { q: "What does demolition cost?", a: "Bathroom demolition typically costs SEK 10,000–25,000. Kitchen demolition SEK 8,000–20,000. We always provide fixed pricing." },
    { q: "Is debris removal included?", a: "Yes, we handle all demolition waste and transport it to approved disposal or recycling." },
    { q: "How long does demolition take?", a: "Bathroom demolition normally takes 1–2 days. Kitchen about 1 day. Larger projects may take longer." },
    { q: "Can you demolish without damaging adjacent surfaces?", a: "Yes, we carefully protect adjacent surfaces with plastic and board to minimize risk of damage." },
  ],
};

// Category-specific USPs (sv)
const CATEGORY_USPS: Record<string, string[]> = {
  snickeri: ["Erfarna snickare med F-skatt", "30% ROT-avdrag på arbetet", "Fast pris – inga dolda kostnader", "Garanti på allt arbete"],
  vvs: ["Certifierade VVS-tekniker", "30% ROT-avdrag på arbetet", "Snabb service vid akuta ärenden", "Garanti på allt arbete"],
  el: ["Auktoriserade elektriker", "30% ROT-avdrag på arbetet", "Besiktningsprotokoll ingår", "Tryggt och säkert"],
  malning: ["Professionella målare", "30% ROT-avdrag på arbetet", "Kvalitetsfärg som håller", "Förarbete och spackling ingår"],
  golv: ["Alla typer av golv", "30% ROT-avdrag på arbetet", "Undergolvsbehandling ingår", "Snyggt och hållbart resultat"],
  montering: ["Alla varumärken och modeller", "50% RUT-avdrag", "Snabb leverans", "Inga dolda kostnader"],
  tradgard: ["Erfarna trädgårdsmästare", "50% RUT-avdrag", "Året runt-service", "Borttransport av avfall ingår"],
  markarbeten: ["Komplett markentreprenad", "30% ROT-avdrag", "Fast pris efter besiktning", "Erfarna maskinförare"],
  stadning: ["Professionella städare", "50% RUT-avdrag", "Eget material och utrustning", "Nöjdhetsgaranti"],
  flytt: ["Försäkrad flytt", "50% RUT-avdrag", "Erfarna flyttare", "Packning och transport"],
  "tekniska-installationer": ["Certifierade tekniker", "30% ROT-avdrag", "Smart hem-integration", "Support efter installation"],
  rivning: ["Kontrollerad rivning", "30% ROT-avdrag", "Borttransport ingår", "Skyddar intilliggande ytor"],
};

const CATEGORY_USPS_EN: Record<string, string[]> = {
  snickeri: ["Experienced carpenters with F-tax", "30% ROT deduction on labor", "Fixed price – no hidden costs", "Warranty on all work"],
  vvs: ["Certified plumbing technicians", "30% ROT deduction on labor", "Fast service for emergencies", "Warranty on all work"],
  el: ["Authorized electricians", "30% ROT deduction on labor", "Inspection protocol included", "Safe and secure"],
  malning: ["Professional painters", "30% ROT deduction on labor", "Quality paint that lasts", "Prep work and patching included"],
  golv: ["All types of flooring", "30% ROT deduction on labor", "Subfloor preparation included", "Beautiful and durable result"],
  montering: ["All brands and models", "50% RUT deduction", "Fast delivery", "No hidden costs"],
  tradgard: ["Experienced gardeners", "50% RUT deduction", "Year-round service", "Waste removal included"],
  markarbeten: ["Complete groundwork services", "30% ROT deduction", "Fixed price after inspection", "Experienced operators"],
  stadning: ["Professional cleaners", "50% RUT deduction", "Own supplies and equipment", "Satisfaction guarantee"],
  flytt: ["Insured moving", "50% RUT deduction", "Experienced movers", "Packing and transport"],
  "tekniska-installationer": ["Certified technicians", "30% ROT deduction", "Smart home integration", "Support after installation"],
  rivning: ["Controlled demolition", "30% ROT deduction", "Debris removal included", "Protects adjacent surfaces"],
};

// Hero title templates per category (action-oriented H1s)
const HERO_TITLE_SV: Record<string, (name: string) => string> = {
  snickeri: (n) => n,
  vvs: (n) => n,
  el: (n) => n,
  malning: (n) => n,
  golv: (n) => n,
  montering: (n) => n,
  tradgard: (n) => n,
  markarbeten: (n) => n,
  stadning: (n) => n,
  flytt: (n) => n,
  "tekniska-installationer": (n) => n,
  rivning: (n) => n,
};

const HERO_TITLE_EN: Record<string, (name: string) => string> = {
  snickeri: (n) => n,
  vvs: (n) => n,
  el: (n) => n,
  malning: (n) => n,
  golv: (n) => n,
  montering: (n) => n,
  tradgard: (n) => n,
  markarbeten: (n) => n,
  stadning: (n) => n,
  flytt: (n) => n,
  "tekniska-installationer": (n) => n,
  rivning: (n) => n,
};

// Description templates per category (used as hero subtitle)
const CATEGORY_DESC_SV: Record<string, (name: string) => string> = {
  snickeri: (n) => `Professionell ${n.toLowerCase()} med ROT-avdrag. Erfarna hantverkare, fast pris och garanti. ★ 5/5 betyg.`,
  vvs: (n) => `${n} utförd av certifierade VVS-tekniker med ROT-avdrag. Snabb service och garanti på allt arbete.`,
  el: (n) => `${n} av auktoriserade elektriker med ROT-avdrag. Säkert, snabbt och med besiktningsprotokoll.`,
  malning: (n) => `Professionell ${n.toLowerCase()} med ROT-avdrag. Kvalitetsfärg, spackling och förarbete ingår.`,
  golv: (n) => `${n} med ROT-avdrag. Vi lägger alla typer av golv – parkett, laminat, vinyl och klinker.`,
  montering: (n) => `${n} med RUT-avdrag. Snabb och pålitlig montering av alla varumärken och modeller.`,
  tradgard: (n) => `${n} med RUT-avdrag. Professionella trädgårdsmästare som skapar din drömträdgård.`,
  markarbeten: (n) => `${n} med ROT-avdrag. Komplett markentreprenad med fast pris och erfarna maskinförare.`,
  stadning: (n) => `${n} med RUT-avdrag. Professionella städare med eget material. Nöjdhetsgaranti.`,
  flytt: (n) => `${n} med RUT-avdrag. Försäkrad flytt med erfarna flyttare. Packning och transport.`,
  "tekniska-installationer": (n) => `${n} med ROT-avdrag. Certifierade tekniker som installerar smart och tryggt.`,
  rivning: (n) => `${n} med ROT-avdrag. Kontrollerad rivning med borttransport och skydd av intilliggande ytor.`,
};

const CATEGORY_DESC_EN: Record<string, (nameEn: string) => string> = {
  snickeri: (n) => `Professional ${n.toLowerCase()} with ROT deduction. Experienced craftsmen, fixed pricing and warranty. ★ 5/5 rating.`,
  vvs: (n) => `${n} by certified plumbing technicians with ROT deduction. Fast service and warranty on all work.`,
  el: (n) => `${n} by authorized electricians with ROT deduction. Safe, fast and with inspection protocol.`,
  malning: (n) => `Professional ${n.toLowerCase()} with ROT deduction. Quality paint, patching and prep work included.`,
  golv: (n) => `${n} with ROT deduction. We install all types of flooring – parquet, laminate, vinyl and tile.`,
  montering: (n) => `${n} with RUT deduction. Fast and reliable assembly of all brands and models.`,
  tradgard: (n) => `${n} with RUT deduction. Professional gardeners creating your dream garden.`,
  markarbeten: (n) => `${n} with ROT deduction. Complete groundwork with fixed pricing and experienced operators.`,
  stadning: (n) => `${n} with RUT deduction. Professional cleaners with own supplies. Satisfaction guarantee.`,
  flytt: (n) => `${n} with RUT deduction. Insured moving with experienced movers. Packing and transport.`,
  "tekniska-installationer": (n) => `${n} with ROT deduction. Certified technicians for smart and secure installation.`,
  rivning: (n) => `${n} with ROT deduction. Controlled demolition with debris removal and surface protection.`,
};

// Intro text templates per category (conversational sales pitch, sv)
const INTRO_TEXT_SV: Record<string, (name: string) => string> = {
  snickeri: (n) => `Funderar du på ${n.toLowerCase()}? Fixcos erfarna snickare tar hand om hela projektet – från planering till färdigt resultat. Med fast pris och 30% ROT-avdrag kan du känna dig trygg hela vägen.`,
  vvs: (n) => `Behöver du hjälp med ${n.toLowerCase()}? Våra certifierade VVS-tekniker löser det snabbt och professionellt. Du får alltid fast pris, garanti och 30% ROT-avdrag – utan krångel.`,
  el: (n) => `Dags för ${n.toLowerCase()}? Våra auktoriserade elektriker utför arbetet säkert och korrekt med besiktningsprotokoll. Alltid med 30% ROT-avdrag och garanti på allt arbete.`,
  malning: (n) => `Vill du fräscha upp hemmet med ${n.toLowerCase()}? Vi på Fixco har professionella målare som levererar ett hållbart och snyggt resultat. Fast pris, ROT-avdrag och spackling ingår alltid.`,
  golv: (n) => `Längtar du efter nytt golv? Fixcos golvläggare hjälper dig med ${n.toLowerCase()} – oavsett om du väljer parkett, laminat eller vinyl. Med 30% ROT-avdrag och garanti blir det enkelt och prisvärt.`,
  montering: (n) => `Har du möbler eller inredning som behöver monteras? Fixco fixar ${n.toLowerCase()} snabbt och pålitligt. Med 50% RUT-avdrag betalar du bara hälften – och slipper krånglet.`,
  tradgard: (n) => `Drömmer du om en vackrare trädgård? Fixcos professionella trädgårdsmästare hjälper dig med ${n.toLowerCase()} – från beskärning till helt ny anläggning. Med 50% RUT-avdrag blir trädgårdsdrömmen verklighet.`,
  markarbeten: (n) => `Planerar du ${n.toLowerCase()}? Fixcos erfarna markentreprenörer utför allt från schaktning till stenläggning med fast pris och 30% ROT-avdrag. Vi ser till att grunden blir rätt från start.`,
  stadning: (n) => `Behöver du hjälp med ${n.toLowerCase()}? Fixcos professionella städare gör jobbet grundligt med eget material och utrustning. Med 50% RUT-avdrag och nöjdhetsgaranti kan du luta dig tillbaka.`,
  flytt: (n) => `Ska du flytta och behöver hjälp? Fixco erbjuder ${n.toLowerCase()} med försäkring och erfarna flyttare som tar hand om dina ägodelar. Med 50% RUT-avdrag blir flytten smidig och prisvärd.`,
  "tekniska-installationer": (n) => `Behöver du ${n.toLowerCase()}? Fixcos certifierade tekniker installerar smart och tryggt – med garanti och 30% ROT-avdrag. Vi ser till att tekniken fungerar perfekt från dag ett.`,
  rivning: (n) => `Dags för ${n.toLowerCase()} inför en renovering? Fixco utför kontrollerad rivning med professionell borttransport och skydd av intilliggande ytor. Med 30% ROT-avdrag och fast pris vet du exakt vad det kostar.`,
};

const INTRO_TEXT_EN: Record<string, (name: string) => string> = {
  snickeri: (n) => `Considering ${n.toLowerCase()}? Fixco's experienced carpenters handle the entire project – from planning to finished result. With fixed pricing and 30% ROT deduction, you can feel confident every step of the way.`,
  vvs: (n) => `Need help with ${n.toLowerCase()}? Our certified plumbing technicians solve it quickly and professionally. You always get fixed pricing, warranty and 30% ROT deduction – hassle-free.`,
  el: (n) => `Time for ${n.toLowerCase()}? Our authorized electricians perform the work safely and correctly with inspection protocol. Always with 30% ROT deduction and warranty on all work.`,
  malning: (n) => `Want to freshen up your home with ${n.toLowerCase()}? Fixco's professional painters deliver a durable and beautiful result. Fixed price, ROT deduction and prep work always included.`,
  golv: (n) => `Longing for a new floor? Fixco's flooring installers help you with ${n.toLowerCase()} – whether you choose parquet, laminate or vinyl. With 30% ROT deduction and warranty, it's easy and affordable.`,
  montering: (n) => `Got furniture or fittings that need assembling? Fixco handles ${n.toLowerCase()} quickly and reliably. With 50% RUT deduction you only pay half – and skip the hassle.`,
  tradgard: (n) => `Dreaming of a more beautiful garden? Fixco's professional gardeners help you with ${n.toLowerCase()} – from pruning to completely new landscaping. With 50% RUT deduction, your garden dream becomes reality.`,
  markarbeten: (n) => `Planning ${n.toLowerCase()}? Fixco's experienced groundwork contractors handle everything from excavation to paving with fixed pricing and 30% ROT deduction. We make sure the foundation is right from the start.`,
  stadning: (n) => `Need help with ${n.toLowerCase()}? Fixco's professional cleaners do a thorough job with their own supplies and equipment. With 50% RUT deduction and satisfaction guarantee, you can sit back and relax.`,
  flytt: (n) => `Moving and need help? Fixco offers ${n.toLowerCase()} with insurance and experienced movers who take care of your belongings. With 50% RUT deduction, your move becomes smooth and affordable.`,
  "tekniska-installationer": (n) => `Need ${n.toLowerCase()}? Fixco's certified technicians install smartly and safely – with warranty and 30% ROT deduction. We make sure the technology works perfectly from day one.`,
  rivning: (n) => `Time for ${n.toLowerCase()} before a renovation? Fixco performs controlled demolition with professional debris removal and protection of adjacent surfaces. With 30% ROT deduction and fixed pricing, you know exactly what it costs.`,
};

// Meta description templates per category (sales-focused for Google)
const META_DESC_SV: Record<string, (name: string, rotRut: string) => string> = {
  snickeri: (n, rr) => `Fixcos erfarna hantverkare hjälper dig med ${n.toLowerCase()}. Fast pris, 30% ${rr}-avdrag och garanti. ★ 5/5 betyg. Begär gratis offert!`,
  vvs: (n, rr) => `Behöver du ${n.toLowerCase()}? Fixcos certifierade VVS-tekniker hjälper dig. 30% ${rr}-avdrag, fast pris och garanti. ★ 5/5 betyg. Begär offert!`,
  el: (n, rr) => `Boka ${n.toLowerCase()} med auktoriserade elektriker. 30% ${rr}-avdrag, besiktningsprotokoll och garanti. ★ 5/5 betyg. Begär gratis offert!`,
  malning: (n, rr) => `Fixcos professionella målare hjälper dig med ${n.toLowerCase()}. Spackling ingår, 30% ${rr}-avdrag och garanti. ★ 5/5 betyg. Begär offert!`,
  golv: (n, rr) => `Boka ${n.toLowerCase()} med Fixco. Parkett, laminat, vinyl och klinker. 30% ${rr}-avdrag, fast pris. ★ 5/5 betyg. Begär gratis offert!`,
  montering: (n, rr) => `Boka ${n.toLowerCase()} med Fixco. Alla varumärken, snabb leverans och 50% ${rr}-avdrag. ★ 5/5 betyg. Begär gratis offert!`,
  tradgard: (n, rr) => `Boka ${n.toLowerCase()} med Fixco. Professionella trädgårdsmästare, 50% ${rr}-avdrag. ★ 5/5 betyg. Begär gratis offert!`,
  markarbeten: (n, rr) => `Boka ${n.toLowerCase()} med Fixco. Fast pris, erfarna maskinförare och 30% ${rr}-avdrag. ★ 5/5 betyg. Begär offert!`,
  stadning: (n, rr) => `Boka ${n.toLowerCase()} med Fixco. Eget material, nöjdhetsgaranti och 50% ${rr}-avdrag. ★ 5/5 betyg. Begär gratis offert!`,
  flytt: (n, rr) => `Boka ${n.toLowerCase()} med Fixco. Försäkrad flytt, erfarna flyttare och 50% ${rr}-avdrag. ★ 5/5 betyg. Begär offert!`,
  "tekniska-installationer": (n, rr) => `Boka ${n.toLowerCase()} med Fixco. Certifierade tekniker, 30% ${rr}-avdrag och garanti. ★ 5/5 betyg. Begär offert!`,
  rivning: (n, rr) => `Boka ${n.toLowerCase()} med Fixco. Kontrollerad rivning, borttransport ingår och 30% ${rr}-avdrag. ★ 5/5 betyg. Begär offert!`,
};

const META_DESC_EN: Record<string, (name: string, rotRut: string) => string> = {
  snickeri: (n, rr) => `Fixco's experienced craftsmen help you with ${n.toLowerCase()}. Fixed price, 30% ${rr} deduction and warranty. ★ 5/5 rating. Get a free quote!`,
  vvs: (n, rr) => `Need ${n.toLowerCase()}? Fixco's certified plumbers help you. 30% ${rr} deduction, fixed price and warranty. ★ 5/5 rating. Get a quote!`,
  el: (n, rr) => `Book ${n.toLowerCase()} with authorized electricians. 30% ${rr} deduction, inspection protocol and warranty. ★ 5/5 rating. Get a free quote!`,
  malning: (n, rr) => `Fixco's professional painters help you with ${n.toLowerCase()}. Prep included, 30% ${rr} deduction and warranty. ★ 5/5 rating. Get a quote!`,
  golv: (n, rr) => `Book ${n.toLowerCase()} with Fixco. Parquet, laminate, vinyl and tile. 30% ${rr} deduction, fixed price. ★ 5/5 rating. Get a free quote!`,
  montering: (n, rr) => `Book ${n.toLowerCase()} with Fixco. All brands, fast delivery and 50% ${rr} deduction. ★ 5/5 rating. Get a free quote!`,
  tradgard: (n, rr) => `Book ${n.toLowerCase()} with Fixco. Professional gardeners, 50% ${rr} deduction. ★ 5/5 rating. Get a free quote!`,
  markarbeten: (n, rr) => `Book ${n.toLowerCase()} with Fixco. Fixed price, experienced operators and 30% ${rr} deduction. ★ 5/5 rating. Get a quote!`,
  stadning: (n, rr) => `Book ${n.toLowerCase()} with Fixco. Own supplies, satisfaction guarantee and 50% ${rr} deduction. ★ 5/5 rating. Get a free quote!`,
  flytt: (n, rr) => `Book ${n.toLowerCase()} with Fixco. Insured moving, experienced movers and 50% ${rr} deduction. ★ 5/5 rating. Get a quote!`,
  "tekniska-installationer": (n, rr) => `Book ${n.toLowerCase()} with Fixco. Certified technicians, 30% ${rr} deduction and warranty. ★ 5/5 rating. Get a quote!`,
  rivning: (n, rr) => `Book ${n.toLowerCase()} with Fixco. Controlled demolition, debris removal and 30% ${rr} deduction. ★ 5/5 rating. Get a quote!`,
};

// Generate enSlug from the EXPANDED_SERVICE_NAME_EN
function generateEnSlug(nameEn: string): string {
  return nameEn
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Build all expanded NicheServiceMeta entries
export const EXPANDED_NICHE_SERVICES: NicheServiceMeta[] = EXPANDED_SERVICES.map(svc => {
  const nameEn = EXPANDED_SERVICE_NAME_EN[svc.slug as keyof typeof EXPANDED_SERVICE_NAME_EN];
  const serviceKey = svc.serviceKey;
  const icon = SERVICE_KEY_ICONS[serviceKey] || Hammer;
  const category = SERVICE_KEY_TO_CATEGORY[serviceKey] || serviceKey;
  const rotRut = svc.rotRut as 'ROT' | 'RUT';

  const descSv = (CATEGORY_DESC_SV[serviceKey] || CATEGORY_DESC_SV.snickeri)(svc.name);
  const descEn = (CATEGORY_DESC_EN[serviceKey] || CATEGORY_DESC_EN.snickeri)(nameEn);
  const heroTitleSv = (HERO_TITLE_SV[serviceKey] || HERO_TITLE_SV.snickeri)(svc.name);
  const heroTitleEn = (HERO_TITLE_EN[serviceKey] || HERO_TITLE_EN.snickeri)(nameEn);
  const metaDescSv = (META_DESC_SV[serviceKey] || META_DESC_SV.snickeri)(svc.name, rotRut);
  const metaDescEn = (META_DESC_EN[serviceKey] || META_DESC_EN.snickeri)(nameEn, rotRut);

  const introSv = (INTRO_TEXT_SV[serviceKey] || INTRO_TEXT_SV.snickeri)(svc.name);
  const introEn = (INTRO_TEXT_EN[serviceKey] || INTRO_TEXT_EN.snickeri)(nameEn);

  return {
    slug: svc.slug,
    title: svc.name,
    titleEn: nameEn,
    heroTitle: heroTitleSv,
    heroTitleEn: heroTitleEn,
    metaDescription: metaDescSv,
    metaDescriptionEn: metaDescEn,
    parentCategory: category,
    icon,
    rotRut,
    description: descSv,
    descriptionEn: descEn,
    usps: CATEGORY_USPS[serviceKey] || CATEGORY_USPS.snickeri,
    uspsEn: CATEGORY_USPS_EN[serviceKey] || CATEGORY_USPS_EN.snickeri,
    faqs: CATEGORY_FAQS[serviceKey] || CATEGORY_FAQS.snickeri,
    faqsEn: CATEGORY_FAQS_EN[serviceKey] || CATEGORY_FAQS_EN.snickeri,
    enSlug: generateEnSlug(nameEn),
    introText: introSv,
    introTextEn: introEn,
  };
});
