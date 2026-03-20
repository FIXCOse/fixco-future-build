/**
 * Inline guide templates for carpentry-related services.
 * Each guide has 200-400 words of template text with {area} placeholders.
 * Used on local service pages to boost content depth and keyword density.
 */

export interface GuideSection {
  heading: string;
  body: string;
}

export interface ServiceGuide {
  slug: string;
  title: string; // "Guide: {service} i {area}"
  intro: string;
  sections: GuideSection[];
  cta: string;
}

const CARPENTRY_GUIDES: Record<string, ServiceGuide> = {
  snickare: {
    slug: 'snickare',
    title: 'Guide: Anlita snickare i {area}',
    intro: 'Att hitta en pålitlig snickare i {area} kan vara en utmaning. Oavsett om du behöver hjälp med ett mindre reparationsarbete eller ett större byggprojekt så finns det viktiga saker att tänka på innan du väljer hantverkare. Här delar vi med oss av vår erfarenhet från hundratals snickeriprojekt i {area} och omgivande områden.',
    sections: [
      {
        heading: 'Vad gör en snickare i {area}?',
        body: 'En snickare utför allt från mindre reparationer och montering till större projekt som tillbyggnader, altanbyggen och inredningssnickeri. I {area} är de vanligaste uppdragen köksmontering, garderobslösningar, golvläggning och fasadrenovering. Många fastighetsägare i {area} anlitar även snickare för att bygga trädäck, staket och uterum.'
      },
      {
        heading: 'Så väljer du rätt snickare i {area}',
        body: 'Be alltid om minst två offerter och kontrollera att hantverkaren har F-skattsedel och ansvarsförsäkring. Fråga efter referenser från tidigare projekt i {area}. En seriös snickare kommer gärna på ett kostnadsfritt hembesök för att bedöma arbetet innan offert lämnas. Kontrollera även att företaget är registrerat hos Skatteverket för ROT-avdrag.'
      },
      {
        heading: 'Vad kostar en snickare i {area}?',
        body: 'Timpriset för en snickare i {area} ligger normalt mellan 450–650 kr per timme exklusive moms. Med ROT-avdrag (30 % på arbetskostnaden) kan du spara tusentals kronor. Ett typiskt snickeriprojekt i {area} – exempelvis montering av ett nytt kök – kostar mellan 25 000 och 80 000 kr beroende på omfattning och materialval.'
      },
      {
        heading: 'Vanliga snickeriprojekt i {area}',
        body: 'De mest populära snickeritjänsterna i {area} inkluderar köksrenovering, badrumsrenovering, altanbygge och platsbyggda lösningar som bokhyllor och garderober. Under våren och sommaren ökar efterfrågan på utomhusprojekt som trädäck och staket, medan höst och vinter är högsäsong för inomhusrenoveringar.'
      }
    ],
    cta: 'Behöver du en snickare i {area}? Begär en kostnadsfri offert från Fixco idag – vi återkommer inom 24 timmar med ett fast pris inklusive ROT-avdrag.'
  },

  koksrenovering: {
    slug: 'koksrenovering',
    title: 'Guide: Köksrenovering i {area}',
    intro: 'Att renovera köket är en av de mest värdeskapande investeringarna du kan göra i ditt hem. I {area} ser vi allt från mindre uppdateringar till totalrenoveringar av kök i villor och bostadsrätter. Här går vi igenom vad du bör tänka på innan du påbörjar din köksrenovering.',
    sections: [
      {
        heading: 'Vad ingår i en köksrenovering?',
        body: 'En komplett köksrenovering i {area} omfattar vanligtvis rivning av befintligt kök, el- och VVS-arbeten, montering av nytt kök, bänkskivor, kakel och stänkskydd samt målning. Många väljer även att passa på att byta golv och belysning i samband med renoveringen. Arbetet tar normalt max 1–2 veckor beroende på projektets omfattning.'
      },
      {
        heading: 'IKEA-kök eller platsbyggt i {area}?',
        body: 'I {area} är IKEA-kök det vanligaste valet tack vare bra pris och stort utbud. Platsbyggda kök ger däremot maximal anpassning och kvalitet. Ett mellanalternativ är att använda IKEA-stommar med specialbeställda luckor och bänkskivor. Oavsett val kan en professionell montering förlänga kökets livslängd med 10–15 år jämfört med självmontering.'
      },
      {
        heading: 'Vad kostar köksrenovering i {area}?',
        body: 'En köksrenovering i {area} kostar normalt mellan 80 000 och 250 000 kr inklusive material. Med ROT-avdrag sparar du 30 % på arbetskostnaden, vilket ofta motsvarar 15 000–40 000 kr. Materialvalet – särskilt bänkskivor och vitvaror – påverkar slutpriset mest. Begär alltid en detaljerad offert som specificerar material och arbete separat.'
      },
      {
        heading: 'Vanliga misstag vid köksrenovering',
        body: 'Det vanligaste misstaget är att underskatta tidsåtgången och kostnaden för el- och VVS-arbeten. Många i {area} glömmer även att ansöka om bygglov vid större förändringar i bärande väggar. Se till att planera kökets layout noggrant – det är svårt och dyrt att flytta rördragningar i efterhand. Anlita alltid behörig elektriker och VVS-montör.'
      }
    ],
    cta: 'Planerar du köksrenovering i {area}? Få en kostnadsfri offert från Fixco med fast pris och 30 % ROT-avdrag – vi hjälper dig från planering till färdigt kök.'
  },

  badrumsrenovering: {
    slug: 'badrumsrenovering',
    title: 'Guide: Badrumsrenovering i {area}',
    intro: 'Badrumsrenovering är ett av de mest komplexa hantverksprojekten i hemmet. I {area} ser vi ett stort behov av badrumsrenoveringar, särskilt i fastigheter byggda på 60- och 70-talet där tätskikten ofta börjar bli uttjänta. Här är vad du behöver veta.',
    sections: [
      {
        heading: 'Varför renovera badrummet?',
        body: 'Ett uttjänt tätskikt kan leda till fuktskador som kostar hundratusentals kronor att åtgärda. I {area} rekommenderar vi att renovera badrummet vart 20–25 år för att förebygga problem. En renovering höjer även bostadens värde – i {area} kan ett nytt badrum öka marknadsvärdet med 5–10 %.'
      },
      {
        heading: 'Vad ingår i en badrumsrenovering?',
        body: 'En fullständig badrumsrenovering i {area} inkluderar rivning, nytt tätskikt (våtrumsmatta eller flytande tätskikt), kakling av golv och väggar, byte av toalett, handfat och dusch samt ny el och VVS. Arbetet utförs av behöriga hantverkare och dokumenteras med våtrumsintyg för din trygghet.'
      },
      {
        heading: 'Vad kostar badrumsrenovering i {area}?',
        body: 'En badrumsrenovering i {area} kostar vanligtvis mellan 100 000 och 250 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Priset beror på badrummets storlek, materialval och om rör behöver dras om. Ett litet badrum (3–5 kvm) hamnar ofta i nedre prisintervallet medan större badrum med exklusivt kakel kostar mer.'
      },
      {
        heading: 'Behövs bygglov för badrumsrenovering?',
        body: 'I de flesta fall behövs inget bygglov för badrumsrenovering i {area}, men om du bor i bostadsrätt behöver du styrelsens godkännande. Vid ändring av planlösning eller rördragningar kan bygglov krävas – kontrollera alltid med din kommun. Fixco hjälper dig att navigera tillståndskraven i {area}.'
      }
    ],
    cta: 'Dags att renovera badrummet i {area}? Kontakta Fixco för en kostnadsfri offert – vi använder certifierade hantverkare och utfärdar våtrumsintyg.'
  },

  altanbygge: {
    slug: 'altanbygge',
    title: 'Guide: Altanbygge i {area}',
    intro: 'En altan eller ett trädäck förlänger sommaren och ökar trivseln i ditt hem. I {area} är altanbygge ett av de mest populära utomhusprojekten, och med ROT-avdrag blir investeringen extra lönsam. Här går vi igenom det viktigaste att tänka på.',
    sections: [
      {
        heading: 'Vilken typ av altan passar i {area}?',
        body: 'I {area} väljer de flesta mellan tryckimpregnerat trä, värmebehandlat trä (som ThermoWood) eller komposittrall. Tryckimpregnerat är billigast men kräver mer underhåll. Komposit är underhållsfritt men dyrare. Val av material bör anpassas efter husets stil och platsens förutsättningar – exempelvis vind, sol och markförhållanden.'
      },
      {
        heading: 'Behövs bygglov för altan i {area}?',
        body: 'Sedan 2019 är altaner lägre än 1,8 meter över mark ofta bygglovsbefriade för en- och tvåbostadshus i {area}. Däremot krävs alltid bygglov om altanen byggs nära tomtgräns (närmare än 4,5 meter) eller om huset har kulturhistoriskt värde. Kontrollera alltid med kommunen i {area} innan du börjar bygga.'
      },
      {
        heading: 'Vad kostar altanbygge i {area}?',
        body: 'Ett trädäck i {area} kostar normalt mellan 2 500 och 5 500 kr per kvadratmeter inklusive material och arbete. En altan på 20 kvm landar därmed på 50 000–110 000 kr. Med ROT-avdrag (30 % på arbetet) sparar du 10 000–25 000 kr. Vill du ha räcke, trappor eller inbyggd belysning ökar kostnaden.'
      },
      {
        heading: 'Bästa tiden att bygga altan i {area}',
        body: 'Den bästa tiden att bygga altan i {area} är april till september när marken är torr och temperaturen tillåter gjutning och montering. Boka tidigt – våren är högsäsong och hantverkare i {area} blir snabbt fullbokade. Genom att planera vintertid kan du ofta få ett bättre pris och snabbare start.'
      }
    ],
    cta: 'Vill du bygga altan i {area}? Begär en gratis offert från Fixco – vi levererar fast pris med ROT-avdrag och kan ofta starta inom 5 dagar.'
  },

  koksmontering: {
    slug: 'koksmontering',
    title: 'Guide: Köksmontering i {area}',
    intro: 'Professionell köksmontering säkerställer att ditt nya kök monteras korrekt, håller länge och ser fantastiskt ut. I {area} monterar vi kök från alla tillverkare – IKEA, Marbodal, HTH, Ballingslöv och fler. Här är vad du bör veta innan du bokar.',
    sections: [
      {
        heading: 'Varför anlita proffs för köksmontering?',
        body: 'Självmontering av kök är lockande men riskfyllt. Felaktigt monterade skåp kan lossna, bänkskivor kan spricka och vattenanslutningar kan läcka. En professionell montör i {area} säkerställer att allt sitter plant, att rör och el ansluts korrekt och att garantin på köket inte äventyras. Dessutom tar det hälften så lång tid.'
      },
      {
        heading: 'Vad ingår i köksmontering?',
        body: 'Professionell köksmontering i {area} inkluderar montering av stommar, lådor och luckor, installation av bänkskiva, diskbänk och blandare, montering av fläkt och vitvaror samt justering av alla dörrar och lådor. El- och VVS-arbeten utförs av behöriga installatörer och inkluderas i offerten.'
      },
      {
        heading: 'Vad kostar köksmontering i {area}?',
        body: 'Köksmontering i {area} kostar normalt 15 000–40 000 kr beroende på kökets storlek och komplexitet. IKEA-kök är generellt billigare att montera medan skräddarsydda kök kräver mer arbete. Med ROT-avdrag sparar du 30 % på monteringskostnaden. Offerten inkluderar alltid ett fast pris utan dolda avgifter.'
      },
      {
        heading: 'Hur lång tid tar köksmontering?',
        body: 'Ett standardkök i {area} tar 2–4 dagar att montera beroende på kökets storlek och om el- och VVS-arbeten ingår. Mer komplexa kök med köksö, specialanpassningar eller omfattande rörarbeten kan ta upp till 1–2 veckor. Vi planerar alltid arbetet så att du kan använda köket så snart som möjligt.'
      }
    ],
    cta: 'Ska du montera nytt kök i {area}? Få ett fast pris från Fixco – vi monterar alla märken med ROT-avdrag och garanti.'
  },

  totalrenovering: {
    slug: 'totalrenovering',
    title: 'Guide: Totalrenovering i {area}',
    intro: 'En totalrenovering förvandlar hela din bostad – från golv till tak, kök och badrum. I {area} är totalrenoveringar vanliga i äldre villor och bostadsrätter som behöver moderniseras. Här guidar vi dig genom processen.',
    sections: [
      {
        heading: 'Vad innebär totalrenovering?',
        body: 'Totalrenovering i {area} omfattar renovering av alla rum i bostaden: kök, badrum, vardagsrum, sovrum och eventuellt hall och entré. Arbetet inkluderar ofta rivning, ny el och VVS, isolering, golvläggning, väggbehandling, köks- och badrumsinstallation samt målning. Projektet samordnas av en projektledare som ansvarar för tidplan och kvalitet.'
      },
      {
        heading: 'Hur planerar man en totalrenovering?',
        body: 'Börja med att ta fram en budget och prioriteringslista. I {area} rekommenderar vi att börja med våtrum (badrum/kök) eftersom de är mest komplexa. Anlita en hantverkare som kan samordna alla yrkesgrupper – snickare, elektriker, VVS-montör och målare. En välplanerad totalrenovering tar 6–12 veckor beroende på bostadens storlek.'
      },
      {
        heading: 'Vad kostar totalrenovering i {area}?',
        body: 'En totalrenovering i {area} kostar normalt 5 000–15 000 kr per kvadratmeter. En villa på 120 kvm hamnar därmed på 600 000–1 800 000 kr. Med ROT-avdrag sparar du 30 % på alla arbetskostnader, vilket ofta motsvarar 150 000–300 000 kr. Materialkostnaden varierar mest beroende på dina val av kök, badrum och ytskikt.'
      },
      {
        heading: 'Tips för att lyckas med totalrenovering i {area}',
        body: 'Ha alltid en buffert på minst 10–15 % av budgeten för oförutsedda kostnader. Flytta helst ut under renoveringen för att underlätta arbetet. Välj en totalentreprenör som tar ansvar för hela projektet – det minskar risken för förseningar och missförstånd. Be om ett detaljerat kontrakt med tydlig tidplan och betalningsvillkor.'
      }
    ],
    cta: 'Planerar du totalrenovering i {area}? Kontakta Fixco för en gratis konsultation – vi projektleder hela renoveringen med fast pris och ROT-avdrag.'
  },

  husrenovering: {
    slug: 'husrenovering',
    title: 'Guide: Husrenovering i {area}',
    intro: 'Husrenovering omfattar allt från fasadrenovering och tilläggsisolering till invändiga renoveringar och tillbyggnader. I {area} finns ett stort bestånd av villor och radhus som behöver underhåll och modernisering. Här går vi igenom de vanligaste projekten.',
    sections: [
      {
        heading: 'Vanliga husrenoveringsprojekt i {area}',
        body: 'De vanligaste husrenoveringarna i {area} är fasadbyte eller fasadmålning, fönsterbyte, takbyte, tilläggsisolering och stambyte. Många husägare i {area} kombinerar flera projekt för att maximera ROT-avdraget och minimera störningen. Under sommaren ökar efterfrågan på utvändiga arbeten medan invändiga projekt sprids mer jämnt över året.'
      },
      {
        heading: 'Behövs bygglov för husrenovering?',
        body: 'I {area} krävs bygglov för fasadändring (till exempel byte av fasadmaterial eller färg), tillbyggnad, ändrad planlösning med bärande väggar och takkupor. Mindre arbeten som invändig renovering, ommålning i samma kulör och byte av fönster med samma utseende kräver normalt inget bygglov. Kontrollera alltid med kommunen.'
      },
      {
        heading: 'Vad kostar husrenovering i {area}?',
        body: 'Kostnaderna för husrenovering i {area} varierar kraftigt beroende på projektets omfattning. Fasadmålning kostar 100 000–300 000 kr, takbyte 150 000–400 000 kr och fönsterbyte 80 000–200 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. En komplett utvändig renovering av ett hus i {area} kan landa på 400 000–1 000 000 kr.'
      },
      {
        heading: 'Energibesparing genom husrenovering',
        body: 'Många husägare i {area} väljer att energieffektivisera vid renovering. Tilläggsisolering, nya fönster och modern ventilation kan sänka uppvärmningskostnaden med 30–50 %. Sedan 2024 finns även gröna lån med förmånlig ränta för energirenoveringar. Fixco hjälper dig att identifiera de åtgärder som ger störst energibesparing i ditt hus i {area}.'
      }
    ],
    cta: 'Dags att renovera huset i {area}? Begär en kostnadsfri offert från Fixco – vi hanterar allt från fasad till invändiga renoveringar med ROT-avdrag.'
  }
};

/**
 * Get guide data for a given service slug, with {area} replaced.
 */
export function getServiceGuide(serviceSlug: string, area: string): ServiceGuide | null {
  const template = CARPENTRY_GUIDES[serviceSlug];
  if (!template) return null;

  const replace = (text: string) => text.replace(/\{area\}/g, area);

  return {
    ...template,
    title: replace(template.title),
    intro: replace(template.intro),
    sections: template.sections.map(s => ({
      heading: replace(s.heading),
      body: replace(s.body)
    })),
    cta: replace(template.cta)
  };
}

/**
 * Check if a service has a guide available.
 */
export function hasServiceGuide(serviceSlug: string): boolean {
  return serviceSlug in CARPENTRY_GUIDES;
}
