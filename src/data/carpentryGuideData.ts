/**
 * Inline guide templates for all "bygg" services (everything except VVS, el, flytt, städ, trädgård).
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
        body: 'Börja med att ta fram en budget och prioriteringslista. I {area} rekommenderar vi att börja med våtrum (badrum/kök) eftersom de är mest komplexa. Anlita en hantverkare som kan samordna alla yrkesgrupper – snickare, elektriker, VVS-montör och målare. En välplanerad totalrenovering tar 3–6 veckor beroende på bostadens storlek.'
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
  },

  // === GOLV ===
  golvlaggning: {
    slug: 'golvlaggning',
    title: 'Guide: Golvläggning i {area}',
    intro: 'Nytt golv förändrar hela känslan i hemmet. Oavsett om du vill lägga parkett, laminat, vinyl eller klinker i {area} så finns det viktiga val att göra. Här guidar vi dig genom golvläggningsprocessen från materialval till färdigt resultat.',
    sections: [
      {
        heading: 'Vilket golv passar bäst i {area}?',
        body: 'Det beror på rummet och din budget. Parkett ger naturlig värme och lång livslängd – perfekt för vardagsrum och sovrum. Laminat ger parkettlook till lägre kostnad. Vinyl och LVT tål fukt och passar kök och hall. Klinkergolv är slitstarka och populära i hallar och badrum. I {area} är parkett och vinyl de vanligaste valen.'
      },
      {
        heading: 'Hur lång tid tar golvläggning?',
        body: 'Ett normalstort rum i {area} tar 1–2 dagar att lägga golv i. En hel lägenhet tar oftast 2–5 dagar beroende på golvtyp och förberedelser som behövs. Klinkerläggning tar längre tid eftersom bruk behöver torka. Med Fixco planerar vi arbetet så att du kan bo kvar under hela processen.'
      },
      {
        heading: 'Vad kostar golvläggning i {area}?',
        body: 'Golvläggning i {area} kostar normalt 300–800 kr per kvadratmeter inklusive material och arbete. Parkett ligger i det övre intervallet, laminat i det undre. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Ett vardagsrum på 25 kvm kostar därmed 7 500–20 000 kr – ofta betydligt mindre efter ROT.'
      },
      {
        heading: 'Förberedelser innan golvläggning',
        body: 'Undergolvet måste vara plant, torrt och rent innan nytt golv kan läggas. I {area} behöver äldre hus ibland avjämning av betonggolv innan parketten kan läggas. Fuktmätning är viktigt – särskilt i källare och markplan. Fixco utför alltid en ordentlig besiktning av undergolvet innan arbetet påbörjas.'
      }
    ],
    cta: 'Behöver du lägga nytt golv i {area}? Kontakta Fixco för kostnadsfri offert med fast pris och ROT-avdrag.'
  },

  golvslipning: {
    slug: 'golvslipning',
    title: 'Guide: Golvslipning i {area}',
    intro: 'Golvslipning ger dina gamla trägolv nytt liv utan att behöva byta hela golvet. I {area} är golvslipning ett populärt och kostnadseffektivt sätt att fräscha upp hemmet. Här berättar vi vad du behöver veta.',
    sections: [
      {
        heading: 'När bör man slipa golvet?',
        body: 'Trägolv i {area} bör slipas när lacken är nött, när golvet har repor eller fläckar, eller när du vill byta nyans. De flesta parkettgolv kan slipas 3–5 gånger under sin livslängd. Massiva trägolv kan slipas ännu fler gånger. Äldre golv i {area} från 50- och 60-talet är ofta av utmärkt kvalitet och blir fantastiska efter slipning.'
      },
      {
        heading: 'Hur går golvslipning till?',
        body: 'Professionell golvslipning i {area} sker i tre steg: grovslipning tar bort gammal lack och ojämnheter, finslipning jämnar ut ytan, och slutligen appliceras ny lack, olja eller vax. Hela processen tar 1–2 dagar per rum. Dammsugarsystem minimerar damm men vi rekommenderar att möbler flyttas ut och att du vädrar ordentligt efteråt.'
      },
      {
        heading: 'Vad kostar golvslipning i {area}?',
        body: 'Golvslipning i {area} kostar normalt 200–400 kr per kvadratmeter inklusive lackning. Med ROT-avdrag sparar du 30 % på arbetet. Ett vardagsrum på 20 kvm kostar alltså 4 000–8 000 kr – ofta under 6 000 kr efter ROT. Jämfört med att lägga nytt golv sparar du 50–70 % och behåller golvets originalkaraktär.'
      },
      {
        heading: 'Olja eller lacka golvet?',
        body: 'Lack ger en tålig yta som är enkel att hålla ren – bäst för familjer med barn och husdjur. Olja ger en mer naturlig och matt finish som framhäver träets karaktär. I {area} väljer de flesta halvmatt lack för vardagsrum och olja för sovrum. Fixco hjälper dig välja rätt ytbehandling för ditt hem.'
      }
    ],
    cta: 'Vill du slipa golven i {area}? Begär en gratis offert från Fixco – professionell golvslipning med ROT-avdrag och snabb start.'
  },

  parkettlaggning: {
    slug: 'parkettlaggning',
    title: 'Guide: Parkettläggning i {area}',
    intro: 'Parkett är det mest populära golvvalet i Sverige – och av goda skäl. Ett parkettgolv ger värme, karaktär och håller i decennier. I {area} lägger vi parkett i allt från nyproduktion till renoveringsprojekt.',
    sections: [
      {
        heading: 'Vilken parkett passar i {area}?',
        body: 'De vanligaste parkettsorterna i {area} är ek, ask och björk. Ek är mest populärt tack vare sin hållbarhet och tidlösa utseende. Välj mellan 1-stavs (bredare plankor för modern känsla) och 3-stavs (klassiskt mönster). Tjockleken påverkar hållbarheten – 14 mm parkett kan slipas flera gånger medan 7 mm är mer prisvärt.'
      },
      {
        heading: 'Flytande läggning eller limning?',
        body: 'I {area} är flytande läggning vanligast – parketten klickas ihop ovanpå en underlagsmatta. Det går snabbt och parketten kan återanvändas. Limning ger ett tystare golv och används ofta i bostadsrätter i {area} där steg- och ljudisolering är extra viktigt. Limmat golv känns mer "fast" att gå på.'
      },
      {
        heading: 'Vad kostar parkettläggning i {area}?',
        body: 'Parkettläggning i {area} kostar 400–700 kr per kvm inklusive material och arbete. En 3-stavs ek i mellanprisklassen med flytande läggning landar runt 500 kr/kvm. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Räkna med 1–2 dagars arbete för ett normalstort rum.'
      },
      {
        heading: 'Skötselråd för parkett',
        body: 'Dammsug regelbundet och torka med en lätt fuktad mopp. Undvik stående vatten – torka upp spill direkt. Använd filttassar under möbler. Med rätt skötsel håller ett parkettgolv i {area} 30–50 år. Lackat golv bör underhållslackas vart 5–10 år för att behålla sin glans.'
      }
    ],
    cta: 'Vill du lägga parkett i {area}? Fixco erbjuder professionell parkettläggning med fast pris och ROT-avdrag.'
  },

  laminatgolv: {
    slug: 'laminatgolv',
    title: 'Guide: Laminatgolv i {area}',
    intro: 'Laminatgolv ger dig utseendet av äkta trä eller sten till en bråkdel av priset. Det är slitstarkt, enkelt att underhålla och snabbt att installera. I {area} är laminat ett populärt val vid renovering och nyproduktion.',
    sections: [
      {
        heading: 'Fördelar med laminatgolv',
        body: 'Laminat är ett av de mest prisvärda golvalternativen i {area}. Det tål slitage bättre än många andra golv, är enkelt att rengöra och finns i hundratals design – från klassisk ek till modern betong-look. Moderna laminatgolv har integrerat ljuddämpande underlag och klicksystem som gör installationen snabb.'
      },
      {
        heading: 'Vilken slitklass ska jag välja?',
        body: 'För bostäder i {area} rekommenderar vi slitklass AC4 eller AC5. AC3 fungerar för sovrum med lite trafik. AC4 är bäst för vardagsrum och hall. AC5 tål tung trafik och passar även kontor. Välj alltid en slitklass som matchar rummets användning – det förlänger golvets livslängd avsevärt.'
      },
      {
        heading: 'Vad kostar laminatgolv i {area}?',
        body: 'Laminatgolv i {area} kostar 200–450 kr per kvm inklusive material och läggning. Budget-laminat börjar från 100 kr/kvm för enbart material. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Ett vardagsrum på 25 kvm kostar 5 000–11 000 kr – ett av de mest prisvärda golvalternativen.'
      },
      {
        heading: 'Tips vid läggning av laminat',
        body: 'Låt laminatplankorna acklimatisera sig i rummet minst 48 timmar före läggning. Lämna en expansionsfog på 8–10 mm mot alla väggar. Använd alltid ett underlag som dämpar ljud och skyddar mot fukt underifrån. I {area} lägger Fixcos hantverkare laminat snabbt och effektivt – oftast klart på en dag per rum.'
      }
    ],
    cta: 'Vill du lägga laminatgolv i {area}? Kontakta Fixco för fast pris med ROT-avdrag.'
  },

  vinylgolv: {
    slug: 'vinylgolv',
    title: 'Guide: Vinylgolv i {area}',
    intro: 'Vinylgolv har blivit ett av de mest populära golvalternativen i Sverige tack vare sin vattenresistens, slitstyrka och enorma designutbud. I {area} väljer allt fler vinylgolv – särskilt LVT (Luxury Vinyl Tiles) – för kök, hall och badrum.',
    sections: [
      {
        heading: 'Varför välja vinylgolv?',
        body: 'Vinyl tål vatten, är tyst att gå på och finns i realistiska trä- och stendesigner. Det är varmare och mjukare under foten än klinker. Moderna LVT-golv i {area} är så naturtrogna att det är svårt att skilja dem från äkta trä. Perfekt för familjer med barn och husdjur.'
      },
      {
        heading: 'Vinyl i kök och badrum',
        body: 'Till skillnad från parkett och laminat klarar vinyl stående vatten, vilket gör det idealiskt för kök, badrum och tvättrum i {area}. Välj alltid vinyl med klicksystem (inte självhäftande) för bästa resultat. SPC-vinyl (rigid core) är extra stabil och tål temperaturskillnader bättre.'
      },
      {
        heading: 'Vad kostar vinylgolv i {area}?',
        body: 'Vinylgolv i {area} kostar 300–600 kr per kvm inklusive material och läggning. LVT i premiumklass ligger högre medan enklare vinyl börjar från 150 kr/kvm. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Kostnaden hamnar mellan parkett och laminat – med fördelen att det tål fukt.'
      },
      {
        heading: 'Miljöaspekter',
        body: 'Moderna vinylgolv är ftalatfria och uppfyller EU:s strängaste miljökrav. Välj golv med certifieringar som Floorscore eller EU Ecolabel. Flera tillverkare erbjuder nu återvinningsprogram. I {area} rekommenderar Fixco alltid vinyl som uppfyller de senaste miljöstandarderna.'
      }
    ],
    cta: 'Vill du lägga vinylgolv i {area}? Få en kostnadsfri offert från Fixco – vattentåligt golv med fast pris och ROT-avdrag.'
  },

  golvbyte: {
    slug: 'golvbyte',
    title: 'Guide: Golvbyte i {area}',
    intro: 'Att byta golv ger hemmet ett helt nytt utseende och kan höja bostadens värde avsevärt. I {area} hjälper vi med allt från rivning av gammalt golv till installation av nytt – oavsett om du väljer parkett, laminat, vinyl eller klinker.',
    sections: [
      {
        heading: 'När är det dags att byta golv?',
        body: 'Slitna, buckliga eller skadade golv bör bytas ut. I {area} ser vi ofta golv som inte kan slipas fler gånger, vinyl som lossnat eller klinker med sprickor. Ibland byts golv i samband med en större renovering – då kan det vara smart att göra allt på en gång och utnyttja ROT-avdraget maximalt.'
      },
      {
        heading: 'Rivning av gammalt golv',
        body: 'Rivning ingår alltid i Fixcos golvbytesoffert. Vi tar hand om rivning, bortforsling och avjämning av undergolvet innan det nya golvet läggs. I äldre fastigheter i {area} kan det ibland finnas flera lager golv ovanpå varandra – alla måste tas bort för bästa resultat.'
      },
      {
        heading: 'Vad kostar golvbyte i {area}?',
        body: 'Golvbyte i {area} kostar 400–900 kr per kvm inklusive rivning, material och läggning. Priset beror på golvtyp och hur mycket förarbete som krävs. Med ROT-avdrag sparar du 30 % på arbetskostnaden. En hel lägenhet på 70 kvm kan kosta 28 000–63 000 kr – betydligt mindre efter ROT.'
      },
      {
        heading: 'Kombinera golvbyte med annan renovering',
        body: 'Golvbyte i {area} görs ofta i samband med köks- eller badrumsrenovering. Genom att samordna arbetena sparar du tid och pengar. Fixco samordnar alla hantverkare så att projektet löper smidigt och du slipper boka flera olika firmor.'
      }
    ],
    cta: 'Dags att byta golv i {area}? Kontakta Fixco för en kostnadsfri offert med fast pris och ROT-avdrag.'
  },

  // === MÅLNING ===
  malare: {
    slug: 'malare',
    title: 'Guide: Anlita målare i {area}',
    intro: 'En skicklig målare förvandlar ditt hem med rätt färg, teknik och finish. I {area} utför vi allt från enklare ommålningar till komplett invändig och utvändig målning av villor och bostadsrätter. Här är vad du bör veta.',
    sections: [
      {
        heading: 'Vad gör en målare i {area}?',
        body: 'En målare utför invändig och utvändig målning, tapetsering, spackling och lackering. I {area} är de vanligaste uppdragen ommålning av väggar och tak, tapetbyte, målning av fönster och dörrar samt fasadmålning. En professionell målare i {area} vet vilka färger och tekniker som ger bäst hållbarhet.'
      },
      {
        heading: 'Så väljer du rätt målare i {area}',
        body: 'Kontrollera att målaren har F-skattsedel och ansvarsförsäkring. Be om att se tidigare arbeten – en bra målare visar gärna referenser. I {area} varierar priserna, så jämför alltid minst två offerter. Se till att offerten specificerar antal strykningar, färgmärke och om spackling ingår.'
      },
      {
        heading: 'Vad kostar målning i {area}?',
        body: 'Invändig målning i {area} kostar normalt 100–200 kr per kvm väggyta. Ett rum på 12 kvm (väggar och tak) kostar ca 5 000–10 000 kr. Utvändig målning av en villa kostar 80 000–200 000 kr beroende på storlek och fasadmaterial. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Invändig vs utvändig målning',
        body: 'Invändig målning kan göras året runt. Utvändig målning i {area} bör göras maj–september när det är torrt och minst 10 grader. Välj rätt färgtyp – latexfärg för innerväggar, alkyd för snickerier och linoljefärg eller silikatfärg för putsade fasader. Fixco använder alltid professionella färger som Alcro, Beckers och Teknos.'
      }
    ],
    cta: 'Behöver du en målare i {area}? Begär kostnadsfri offert från Fixco – professionell målning med ROT-avdrag och garanti.'
  },

  fasadmalning: {
    slug: 'fasadmalning',
    title: 'Guide: Fasadmålning i {area}',
    intro: 'Fasaden är husets ansikte utåt. En nymålad fasad skyddar huset mot väder och vind samtidigt som den höjer fastighetens värde. I {area} är fasadmålning ett av de mest eftertraktade utvändiga underhållsprojekten.',
    sections: [
      {
        heading: 'När behöver fasaden målas om?',
        body: 'En trähussfasad i {area} bör målas om vart 8–12 år, putsade fasader vart 15–20 år. Tecken på att det är dags: flagande färg, grånad yta, mögelväxt eller synliga sprickor. Att vänta för länge kan leda till dyrare reparationer av underliggande trä eller puts.'
      },
      {
        heading: 'Vilken färg passar din fasad i {area}?',
        body: 'Trähus i {area} målas traditionellt med linoljefärg eller slamfärg (som Falu rödfärg). Moderna alternativ som akrylatfärg ger längre hållbarhet. Putsade fasader kräver silikatfärg eller kalkfärg. Färgvalet påverkar både utseende och hållbarhet – rådgör alltid med en erfaren målare i {area}.'
      },
      {
        heading: 'Vad kostar fasadmålning i {area}?',
        body: 'Fasadmålning av en villa i {area} kostar normalt 80 000–200 000 kr beroende på husets storlek, höjd och skick. Ett radhus hamnar lägre – runt 40 000–80 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Byggnadsställning ingår alltid i priset från Fixco.'
      },
      {
        heading: 'Bästa tiden för fasadmålning i {area}',
        body: 'Fasadmålning i {area} bör utföras maj–september när temperaturen håller sig över 10 grader och det inte regnar. Boka tidigt – våren är högsäsong. Arbetet tar normalt 1–2 veckor för en villa och inkluderar tvätt, skrapning, grundning och två strykningar.'
      }
    ],
    cta: 'Dags att måla om fasaden i {area}? Kontakta Fixco för kostnadsfri offert med fast pris och ROT-avdrag.'
  },

  inomhusmalning: {
    slug: 'inomhusmalning',
    title: 'Guide: Inomhusmålning i {area}',
    intro: 'Ny färg på väggarna är det snabbaste och mest prisvärda sättet att förändra ditt hem. I {area} utför vi professionell inomhusmålning av väggar, tak, snickerier och dörrar – med perfekt finish varje gång.',
    sections: [
      {
        heading: 'Vad ingår i inomhusmålning?',
        body: 'Professionell inomhusmålning i {area} inkluderar täckning och skydd av golv och möbler, spackling av hål och sprickor, grundning vid behov och målning i 2–3 strykningar. Vi målar väggar, tak, fönsterfoder, dörrar och lister. Resultatet blir jämnt och hållbart.'
      },
      {
        heading: 'Välja rätt färg och finish',
        body: 'Matt färg döljer ojämnheter och ger en lugn känsla – bäst för sovrum och vardagsrum. Halvmatt är lättare att torka av och passar kök, hall och barnrum. Helmatt ger ett exklusivt intryck. I {area} rekommenderar vi färg med hög täckförmåga – det sparar tid och ger bättre resultat med färre strykningar.'
      },
      {
        heading: 'Vad kostar inomhusmålning i {area}?',
        body: 'Inomhusmålning i {area} kostar normalt 100–200 kr per kvm väggyta inklusive spackling och 2 strykningar. Ett rum på 12 kvm kostar ca 5 000–10 000 kr. En hel lägenhet (3 rok) hamnar på 25 000–50 000 kr. Med ROT-avdrag sparar du 30 % och arbetet tar oftast 2–5 dagar.'
      },
      {
        heading: 'Förberedelser som sparar tid och pengar',
        body: 'Ju mer du förbereder desto snabbare går arbetet. Flytta ut möbler och ta ner gardiner och tavlor. Skydda golven med täckpapper. Meddela målaren i förväg om det finns fuktskador, tapeter som ska tas bort eller snickerier som behöver slipas. God förberedelse ger ett bättre slutresultat.'
      }
    ],
    cta: 'Vill du måla om hemma i {area}? Fixco erbjuder professionell målning med fast pris och ROT-avdrag.'
  },

  tapetsering: {
    slug: 'tapetsering',
    title: 'Guide: Tapetsering i {area}',
    intro: 'Tapeter ger hemmet personlighet och karaktär på ett sätt som färg inte kan matcha. I {area} ser vi en ökad trend med mönstrade tapeter, naturtoner och hållbara material. Här är vad du behöver veta om professionell tapetsering.',
    sections: [
      {
        heading: 'Varför tapetsera istället för att måla?',
        body: 'Tapeter ger djup, mönster och textur som målning inte kan uppnå. En fondvägg med en vacker tapet kan definiera hela rummets stil. I {area} är skandinaviska designmärken som Boråstapeter, Sandberg och Eco Wallpaper populära. Tapeter döljer även småojämnheter i väggen bättre än färg.'
      },
      {
        heading: 'Vilken typ av tapet ska jag välja?',
        body: 'Vliestapeter är enklast att sätta upp – du stryker lim direkt på väggen. Vinyltapeter tål fukt och passar kök och badrum. Textiltapeter ger en exklusiv känsla men kräver mer skötsel. I {area} rekommenderar vi vlies för de flesta rum. Överdimensionerade mönster kräver en erfaren tapetserare för bästa resultat.'
      },
      {
        heading: 'Vad kostar tapetsering i {area}?',
        body: 'Tapetsering i {area} kostar normalt 200–400 kr per kvm väggyta inklusive borttagning av gammal tapet och uppsättning. Tapetens pris tillkommer – från 300 kr till 3 000 kr per rulle beroende på märke och design. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Professionell vs gör-det-själv',
        body: 'Tapetsering kräver precision – sneda skarvar och bubblor syns tydligt. En professionell tapetserare i {area} säkerställer raka skarvar, mönstermatchning och hållbart resultat. Särskilt vid mönstrade tapeter, höga väggar och svåra hörn lönar det sig att anlita proffs.'
      }
    ],
    cta: 'Vill du tapetsera i {area}? Kontakta Fixco för kostnadsfri offert med ROT-avdrag.'
  },

  // === MARKARBETEN ===
  markarbeten: {
    slug: 'markarbeten',
    title: 'Guide: Markarbeten i {area}',
    intro: 'Markarbeten lägger grunden för allt utomhusbyggande – från uppfarter och trädgårdsgångar till dränering och tomtplanering. I {area} utför vi alla typer av markarbeten med professionell utrustning och erfarna hantverkare.',
    sections: [
      {
        heading: 'Vanliga markarbeten i {area}',
        body: 'De mest efterfrågade markarbetena i {area} är plattsättning av uppfarter och uteplatser, dränering runt husgrunden, schaktning för nybyggnation och stenläggning av trädgårdsgångar. Även murning av stödmurar, grävning för pool och installation av belysning i mark är vanliga projekt.'
      },
      {
        heading: 'Behövs bygglov för markarbeten?',
        body: 'I {area} krävs marklov för schaktning och fyllning som avsevärt ändrar marknivån (vanligtvis mer än 0,5 meter). Stödmurar högre än 0,5 meter kan kräva bygglov. Plattsättning och stenläggning kräver normalt inget lov. Kontrollera alltid med kommunen innan du påbörjar större markarbeten.'
      },
      {
        heading: 'Vad kostar markarbeten i {area}?',
        body: 'Plattsättning i {area} kostar 800–1 500 kr per kvm inklusive material och arbete. Dränering runt ett hus kostar 80 000–200 000 kr beroende på husets storlek. Schaktning kostar 300–600 kr per kvm. Med ROT-avdrag sparar du 30 % på arbetskostnaden – markarbeten berättigar till ROT.'
      },
      {
        heading: 'Bästa tiden för markarbeten i {area}',
        body: 'Markarbeten i {area} utförs bäst april–oktober när marken inte är frusen. Dränering bör dock göras så snart som möjligt om fuktproblem upptäckts. Vinterhalvåret kan användas för planering och offerter. Boka tidigt – vår och sommar är högsäsong för markarbeten i {area}.'
      }
    ],
    cta: 'Behöver du markarbeten i {area}? Kontakta Fixco för kostnadsfri offert med fast pris och ROT-avdrag.'
  },

  plattlaggning: {
    slug: 'plattlaggning',
    title: 'Guide: Plattläggning i {area}',
    intro: 'Plattläggning ger din uteplats, uppfart eller trädgårdsgång ett snyggt och hållbart utseende. I {area} erbjuder vi professionell plattläggning med allt från betongplattor till natursten.',
    sections: [
      {
        heading: 'Vilka plattor ska jag välja?',
        body: 'I {area} är betongplattor det vanligaste valet – prisvärda och finns i många format och färger. Natursten som granit och skiffer ger en exklusivare känsla men kostar mer. Keramiska utomhusplattor är ett modernt alternativ som tål frost och kräver minimalt underhåll.'
      },
      {
        heading: 'Hur går plattläggning till?',
        body: 'Professionell plattläggning i {area} börjar med markberedning: schaktning, packning av bärlager (makadam) och utläggning av sättsand. Plattorna läggs med jämna fogar och vibreras fast. Bra dränering är avgörande för att undvika sättningar och frostsprängning – ett steg som ofta hoppas över vid gör-det-själv.'
      },
      {
        heading: 'Vad kostar plattläggning i {area}?',
        body: 'Plattläggning i {area} kostar 800–1 500 kr per kvm inklusive markberedning, material och arbete. En uteplats på 20 kvm kostar alltså 16 000–30 000 kr. Natursten kan kosta 1 500–2 500 kr/kvm. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Underhåll av plattytor',
        body: 'Foga om med sand vart 2–3 år och tvätta plattorna med högtryckstvätt på våren. Ogräs i fogar kan förhindras med polymersand. I {area} rekommenderar vi impregnering av natursten för att förhindra fläckar och mossa. Rätt underhåll gör att din plattsatta yta håller i 20+ år.'
      }
    ],
    cta: 'Vill du lägga plattor i {area}? Begär en gratis offert från Fixco – professionell plattläggning med ROT-avdrag.'
  },

  dranering: {
    slug: 'dranering',
    title: 'Guide: Dränering i {area}',
    intro: 'Dränering skyddar ditt hus mot fuktskador och grundvattenproblem. I {area} är dränering särskilt viktigt för äldre hus där den befintliga dräneringen ofta har passerat sin livslängd. Här förklarar vi varför och hur.',
    sections: [
      {
        heading: 'Varför är dränering viktigt?',
        body: 'Bristfällig dränering leder till fukt i källare och krypgrund, mögelbildning och i värsta fall sättningar i grunden. I {area} har många hus från 50–70-talet dränering som behöver bytas. Att åtgärda fuktskador i efterhand kostar ofta 3–5 gånger mer än att förebygga med ny dränering.'
      },
      {
        heading: 'Vad ingår i ett dräneringsarbete?',
        body: 'Dränering i {area} inkluderar schaktning runt husgrunden, borttagning av gammal dränering, ny markisolering, nytt dräneringsrör, ny makadambädd och återfyllning. Ofta kombineras arbetet med tätning av grundmuren och installation av dagvattenbrunn. Arbetet tar normalt 1–3 veckor.'
      },
      {
        heading: 'Vad kostar dränering i {area}?',
        body: 'Dränering i {area} kostar normalt 2 000–4 000 kr per löpmeter. En villa med 60 löpmeter hamnar på 120 000–240 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Det är en stor investering men förhindrar mångdubbelt dyrare fuktskador.'
      },
      {
        heading: 'Tecken på dålig dränering',
        body: 'Fuktiga eller mögliga källarväggar, kondens på fönster i källaren, mustig lukt eller synliga vattenlinjer på grundmuren är alla tecken på bristfällig dränering. I {area} erbjuder Fixco kostnadsfri fuktbesiktning för att bedöma behovet av ny dränering.'
      }
    ],
    cta: 'Misstänker du fuktproblem i {area}? Kontakta Fixco för kostnadsfri besiktning och offert på dränering med ROT-avdrag.'
  },

  // === MONTERING ===
  montering: {
    slug: 'montering',
    title: 'Guide: Monteringstjänster i {area}',
    intro: 'Professionell montering sparar tid och säkerställer att allt sitter perfekt. I {area} hjälper vi med allt från möbelmontering och TV-upphängning till garderobssystem och persienner. Snabbt, smidigt och med garanti.',
    sections: [
      {
        heading: 'Vanliga monteringsuppdrag i {area}',
        body: 'De mest populära monteringstjänsterna i {area} är IKEA-möbelmontering, TV-montering på vägg, garderobssystem, hyllor och förvaring, persienner och gardinstänger samt köksfläkt. Vi monterar även akustikpaneler, markiser och spegelskåp. Inget uppdrag är för litet.'
      },
      {
        heading: 'Varför anlita proffs för montering?',
        body: 'Felmontering kan leda till att möbler eller hyllor faller ner – en säkerhetsrisk särskilt i hem med barn. En professionell montör i {area} vet vilka infästningar som krävs för olika väggtyper (betong, gips, tegel) och har rätt verktyg. Resultatet blir säkert, snyggt och hållbart.'
      },
      {
        heading: 'Vad kostar montering i {area}?',
        body: 'Monteringspriser i {area} varierar beroende på uppdrag. IKEA-möbelmontering kostar 500–2 000 kr per möbel. TV-montering på vägg kostar 1 000–2 500 kr. Garderobssystem kostar 3 000–8 000 kr. Många monteringstjänster berättigar till RUT-avdrag (50 % på arbetet) – fråga oss vilka!'
      },
      {
        heading: 'Boka montering samma vecka',
        body: 'Fixco i {area} kan ofta boka monteringsuppdrag med kort varsel. Vi kommer med alla verktyg som behövs och städar alltid efter oss. Passa på att samla ihop flera monteringsuppdrag i en och samma bokning – det sparar tid och pengar.'
      }
    ],
    cta: 'Behöver du hjälp med montering i {area}? Boka Fixco – vi monterar snabbt och korrekt med RUT/ROT-avdrag.'
  },

  // === RIVNING ===
  rivning: {
    slug: 'rivning',
    title: 'Guide: Rivning i {area}',
    intro: 'Rivning är ofta första steget i ett renoveringsprojekt. I {area} utför vi kontrollerad rivning av kök, badrum, väggar och hela rum – med korrekt sortering och bortforsling av allt material.',
    sections: [
      {
        heading: 'Vad ingår i rivningsarbete?',
        body: 'Rivning i {area} inkluderar demontering av skåp, bänkar och inredning, rivning av kakel, klinker och väggmaterial, borttagning av golv samt rivning av icke-bärande väggar. Vi sorterar allt material för korrekt avfallshantering och ser till att el och vatten stängs av säkert innan arbetet påbörjas.'
      },
      {
        heading: 'Rivning av kök och badrum',
        body: 'Köks- och badrumsrivning i {area} kräver särskild hänsyn till el, VVS och eventuellt asbest i äldre fastigheter. Vi koordinerar med elektriker och VVS-montör för säker frånkoppling. Rivningstiden är normalt 1–2 dagar för ett kök och 1–3 dagar för ett badrum beroende på storlek.'
      },
      {
        heading: 'Vad kostar rivning i {area}?',
        body: 'Rivning av ett kök i {area} kostar normalt 8 000–15 000 kr. Badrumsrivning kostar 10 000–20 000 kr. Bortforsling och containerhyra ingår oftast i priset. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Vi ger alltid ett fast pris efter besiktning.'
      },
      {
        heading: 'Säkerhet vid rivning',
        body: 'I äldre fastigheter i {area} kan material som asbest, PCB och bly finnas. Vi utför alltid en riskbedömning innan rivning av fastigheter byggda före 1975. Vid misstänkt asbest tar vi prover och anlitar certifierade sanerare. Säkerheten går alltid först.'
      }
    ],
    cta: 'Behöver du rivningshjälp i {area}? Kontakta Fixco för fast pris inklusive bortforsling och ROT-avdrag.'
  },

  // === REMAINING SNICKERI / BYGG SLUGS ===
  renovering: {
    slug: 'renovering',
    title: 'Guide: Renovering i {area}',
    intro: 'Renovering kan innebära allt från ett enskilt rum till en hel bostad. I {area} hjälper vi med renoveringsprojekt av alla storlekar – från ett nytt badrum till en komplett ombyggnad av din villa eller bostadsrätt.',
    sections: [
      {
        heading: 'Vanliga renoveringsprojekt i {area}',
        body: 'De vanligaste renoveringsprojekten i {area} är kök, badrum och golvbyte. Många väljer att renovera ett rum i taget för att sprida ut kostnaden. Andra passar på att göra en totalrenovering och ta allt på en gång. Oavsett omfattning hjälper Fixco dig från planering till färdigt resultat.'
      },
      {
        heading: 'Så planerar du din renovering',
        body: 'Börja med att bestämma budget och prioritera vilka rum som behöver åtgärdas mest. I {area} rekommenderar vi att alltid börja med våtrum om tätskikten är äldre än 20 år. Ta in offerter från minst två hantverkare och jämför vad som ingår. En bra offert specificerar material, arbetstid och garantier.'
      },
      {
        heading: 'Vad kostar renovering i {area}?',
        body: 'Renoveringskostnader i {area} varierar kraftigt. Ett rum kostar 20 000–80 000 kr beroende på typ och omfattning. Kök och badrum är dyrast. Med ROT-avdrag sparar du 30 % på alla arbetskostnader. Fixco erbjuder alltid fast pris utan överraskningar.'
      },
      {
        heading: 'ROT-avdrag vid renovering',
        body: 'Som privatperson kan du få 30 % avdrag på arbetskostnaden vid renovering – max 50 000 kr per person och år. I {area} inkluderar de flesta renoveringsprojekt arbete som berättigar till ROT. Fixco hanterar avdraget direkt på fakturan så du slipper krångla med Skatteverket.'
      }
    ],
    cta: 'Planerar du renovering i {area}? Kontakta Fixco för kostnadsfri offert med fast pris och ROT-avdrag.'
  },

  hantverkare: {
    slug: 'hantverkare',
    title: 'Guide: Hitta hantverkare i {area}',
    intro: 'Att hitta en pålitlig hantverkare i {area} kan vara utmanande. Oavsett om du behöver hjälp med bygg, renovering eller montering så finns det viktiga saker att kontrollera innan du väljer. Här guidar vi dig.',
    sections: [
      {
        heading: 'Vad ska du leta efter hos en hantverkare?',
        body: 'Kontrollera att hantverkaren i {area} har F-skattsedel, ansvarsförsäkring och är godkänd för ROT-avdrag. Be om referenser och titta på tidigare projekt. En seriös hantverkare kommer gärna på ett kostnadsfritt hembesök och lämnar en detaljerad skriftlig offert.'
      },
      {
        heading: 'Typer av hantverkare i {area}',
        body: 'I {area} kan du anlita snickare, målare, VVS-montörer, elektriker och allround-hantverkare. För större projekt som kök och badrum behövs ofta flera yrkesgrupper. Fixco samordnar alla hantverkare åt dig – en kontaktperson, en offert, en garanti.'
      },
      {
        heading: 'Vad kostar en hantverkare i {area}?',
        body: 'Timpriset för en hantverkare i {area} varierar: snickare 450–650 kr/h, målare 400–550 kr/h, VVS 500–700 kr/h. Alla priser exklusive moms. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Fast pris är alltid att föredra framför löpande räkning.'
      },
      {
        heading: 'Undvik oseriösa hantverkare',
        body: 'Betala aldrig hela beloppet i förskott – en seriös hantverkare i {area} begär max 10–30 % vid start. Undvik hantverkare utan skriftlig offert, utan F-skatt eller som enbart vill ha kontant betalning. Kontrollera företaget på allabolag.se och Skatteverkets tjänst.'
      }
    ],
    cta: 'Behöver du en pålitlig hantverkare i {area}? Fixco har kontrollerade hantverkare med garanti och ROT-avdrag.'
  },

  villarenovering: {
    slug: 'villarenovering',
    title: 'Guide: Villarenovering i {area}',
    intro: 'Att renovera en villa är ett av de största projekten en husägare tar sig an. I {area} hjälper vi med allt från utvändig renovering av fasad och tak till invändig modernisering av kök, badrum och vardagsytor.',
    sections: [
      {
        heading: 'Vanliga villarenoveringar i {area}',
        body: 'I {area} är de vanligaste villarenoveringarna köks- och badrumsrenovering, fasadbyte, takbyte, fönsterbyte och tilläggsisolering. Många husägare i {area} väljer att kombinera flera åtgärder för att maximera ROT-avdraget och göra hemmet mer energieffektivt.'
      },
      {
        heading: 'Utvändig vs invändig renovering',
        body: 'Utvändig renovering (fasad, tak, fönster) skyddar husets konstruktion och bör prioriteras om det finns synliga skador. Invändig renovering (kök, bad, golv) förbättrar boendekomfort och ökar fastighetsvärdet. I {area} rekommenderar vi att åtgärda utvändiga brister först.'
      },
      {
        heading: 'Vad kostar villarenovering i {area}?',
        body: 'En komplett villarenovering i {area} kostar 500 000–2 000 000 kr beroende på husets storlek och skick. Enskilda projekt: fasadbyte 100 000–300 000 kr, takbyte 150 000–400 000 kr, kök 80 000–250 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Energieffektivisera vid renovering',
        body: 'Passa på att energieffektivisera när du ändå renoverar villan i {area}. Tilläggsisolering, nya fönster och värmepump kan halvera uppvärmningskostnaderna. Kombinera energiåtgärder med estetisk renovering för bästa totalresultat och maximal ROT-avdrag.'
      }
    ],
    cta: 'Planerar du villarenovering i {area}? Kontakta Fixco för kostnadsfri besiktning och offert med ROT-avdrag.'
  },

  lagenhetsrenovering: {
    slug: 'lagenhetsrenovering',
    title: 'Guide: Lägenhetsrenovering i {area}',
    intro: 'Att renovera en lägenhet kräver planering och hänsyn till grannar och bostadsrättsförening. I {area} har vi erfarenhet av lägenhetsrenoveringar i alla storlekar – från enstaka rum till totalrenoveringar.',
    sections: [
      {
        heading: 'Vad ska du tänka på i bostadsrätt?',
        body: 'I {area} krävs alltid styrelsens godkännande för ingrepp i våtrum, bärande väggar och rördragningar. Skicka in en ansökan med ritningar och tidsplan. Informera grannarna om arbetena. Många föreningar i {area} har regler om vilka tider arbete får utföras – oftast vardagar 08–17.'
      },
      {
        heading: 'Populära lägenhetsrenoveringar i {area}',
        body: 'De vanligaste projekten i {area} är badrumsrenovering, köksrenovering, golvbyte och ommålning. Många passar på att öppna upp planlösningen genom att ta bort icke-bärande väggar. Hall och förvaring är också populära att renovera för att maximera ytan i mindre lägenheter.'
      },
      {
        heading: 'Vad kostar lägenhetsrenovering i {area}?',
        body: 'En lägenhetsrenovering i {area} kostar normalt 3 000–10 000 kr per kvm beroende på omfattning. En 2:a på 55 kvm hamnar på 165 000–550 000 kr vid totalrenovering. Enstaka rum kostar mindre. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Minimera störningar för grannar',
        body: 'Professionella hantverkare i {area} planerar arbetet för att minimera buller och damm. Vi använder dammsugare med HEPA-filter, skyddar trapphus och gemensamma ytor, och respekterar alltid föreningens arbetstider. Fixco informerar alltid grannarna via anslag före arbetsstart.'
      }
    ],
    cta: 'Ska du renovera lägenheten i {area}? Fixco hjälper dig från ansökan till färdigt resultat – med fast pris och ROT-avdrag.'
  },

  fonsterbyte: {
    slug: 'fonsterbyte',
    title: 'Guide: Fönsterbyte i {area}',
    intro: 'Nya fönster sänker energikostnaderna, minskar buller och förbättrar boendekomforten. I {area} är fönsterbyte ett av de mest lönsamma underhållsprojekten tack vare kombinationen av energibesparing och ROT-avdrag.',
    sections: [
      {
        heading: 'När ska fönstren bytas?',
        body: 'Fönster äldre än 25–30 år i {area} bör bytas eller renoveras. Tecken: drag vid fönsterkarmarna, kondens mellan rutorna, svårt att öppna/stänga eller synlig röta i träet. Moderna 3-glasfönster har 3–4 gånger bättre isolering än gamla 2-glasfönster.'
      },
      {
        heading: 'Vilka fönster ska jag välja?',
        body: 'I {area} är trä/alu-fönster populärast – träram inuti och underhållsfritt aluminium utvändigt. Rena träfönster ger traditionellt utseende men kräver utvändig målning vart 8–10 år. PVC-fönster är billigast men passar inte alla hustyper. Välj alltid fönster med U-värde under 1,0 för bästa energibesparing.'
      },
      {
        heading: 'Vad kostar fönsterbyte i {area}?',
        body: 'Fönsterbyte i {area} kostar 5 000–15 000 kr per fönster inklusive montering. Ett hus med 15 fönster hamnar på 75 000–225 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Energibesparingen kan ge tillbaka investeringen på 5–8 år.'
      },
      {
        heading: 'Behövs bygglov för fönsterbyte?',
        body: 'I {area} krävs normalt inget bygglov om nya fönster har samma storlek och utseende som de befintliga. Vid storleksändring, ny placering eller byte till annan fönstertyp kan bygglov krävas. I kulturhistoriskt skyddade områden i {area} kan särskilda regler gälla – kontrollera med kommunen.'
      }
    ],
    cta: 'Dags att byta fönster i {area}? Kontakta Fixco för kostnadsfri offert med fast pris och ROT-avdrag.'
  },

  taklaggning: {
    slug: 'taklaggning',
    title: 'Guide: Takläggning i {area}',
    intro: 'Taket skyddar ditt hem mot väder och vind. I {area} utför vi takläggning, takbyte och takreparation med material som betongtakpannor, plåt och takshingel. Här är vad du behöver veta.',
    sections: [
      {
        heading: 'Vanliga takmaterial i {area}',
        body: 'Betongtakpannor är vanligast i {area} och håller 30–50 år. Plåttak (falsat eller profilerat) är lättare och håller 40–60 år. Takpapp och takshingel är billigare alternativ för garage och förråd. Tegelpannor ger ett klassiskt utseende och håller 50+ år.'
      },
      {
        heading: 'Tecken på att taket behöver åtgärdas',
        body: 'Läckage, skadade pannor, mossa och lav, fuktfläckar på vinden eller i taket är alla varningssignaler. I {area} rekommenderar vi en takinspektion vart 5:e år. Att åtgärda taket i tid förhindrar kostsamma fuktskador i konstruktionen.'
      },
      {
        heading: 'Vad kostar takläggning i {area}?',
        body: 'Takbyte i {area} kostar normalt 150 000–400 000 kr för en villa beroende på yta och material. Takpanneläggning kostar 500–800 kr per kvm, plåttak 600–1 000 kr per kvm. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Takreparationer kostar från 5 000 kr.'
      },
      {
        heading: 'Säkerhet vid takarbeten',
        body: 'Takarbeten i {area} kräver ställning eller skylift, säkerhetssele och skyddsräcke. Anlita alltid professionella takläggare med rätt utrustning och försäkring. Gör aldrig takarbeten själv – risken för allvarliga olyckor är stor. Fixco har certifierade takläggare i {area}.'
      }
    ],
    cta: 'Behöver du takläggning i {area}? Kontakta Fixco för kostnadsfri besiktning och offert med ROT-avdrag.'
  },

  takbyte: {
    slug: 'takbyte',
    title: 'Guide: Takbyte i {area}',
    intro: 'Ett takbyte är en stor investering men nödvändig när taket nått sin livslängd. I {area} utför vi kompletta takbyten med modern isolering och materialval som håller i decennier.',
    sections: [
      {
        heading: 'När behöver taket bytas?',
        body: 'Betongtakpannor i {area} håller normalt 30–50 år. Plåttak 40–60 år. Om taket har upprepade läckage, trasiga pannor som inte kan ersättas, eller om isoleringen är undermålig kan det vara dags för komplett takbyte. En professionell besiktning ger dig beslutsunderlag.'
      },
      {
        heading: 'Vad ingår i ett takbyte?',
        body: 'Ett komplett takbyte i {area} inkluderar borttagning av befintligt takmaterial, inspektion av takstolar och läkt, ny underlagspapp, ny isolering, nytt takmaterial och nya plåtbeslag. Hängrännor och stuprör byts ofta samtidigt. Arbetet tar normalt 1–2 veckor.'
      },
      {
        heading: 'Vad kostar takbyte i {area}?',
        body: 'Takbyte i {area} kostar normalt 150 000–400 000 kr för en normalvilla (120–150 kvm takyta). Betongpannor är billigast, plåt och tegel dyrare. Tilläggsisolering kostar extra men spar energi långsiktigt. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Passa på att tilläggsisolera',
        body: 'Vid takbyte i {area} rekommenderar vi alltid att tilläggsisolera – det förlänger takstolarnas livslängd och sänker uppvärmningskostnaden med upp till 30 %. Kostnaden för extra isolering är marginell när taket ändå är öppet.'
      }
    ],
    cta: 'Dags att byta tak i {area}? Kontakta Fixco för kostnadsfri besiktning och offert med ROT-avdrag.'
  },

  fasadrenovering: {
    slug: 'fasadrenovering',
    title: 'Guide: Fasadrenovering i {area}',
    intro: 'Fasaden skyddar huset och ger det karaktär. I {area} erbjuder vi fasadrenovering av alla typer – trä, puts, tegel och plåt. Från ommålning till komplett fasadbyte.',
    sections: [
      {
        heading: 'Typer av fasadrenovering',
        body: 'I {area} är de vanligaste fasadrenoveringarna ommålning av träfasad, omputsning av putsfasad, tilläggsisolering med ny fasadbeklädnad och byte av fasadpanel. Ibland kombineras fasadrenoveringen med fönsterbyte för bästa helhet och energibesparing.'
      },
      {
        heading: 'Material och metoder',
        body: 'Träfasad i {area} kan målas med linoljefärg (traditionellt) eller akrylatfärg (längre hållbarhet). Putsfasader renoveras med ny armering och puts. Modernt alternativ: ventilerad fasad med skivmaterial – ger utmärkt isolering och kräver minimalt underhåll.'
      },
      {
        heading: 'Vad kostar fasadrenovering i {area}?',
        body: 'Fasadrenovering i {area} kostar 100 000–500 000 kr beroende på husstorlek och åtgärd. Ommålning av träfasad kostar 80 000–200 000 kr. Ny fasadpanel med isolering 200 000–500 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Bygglov vid fasadrenovering',
        body: 'I {area} krävs oftast bygglov om fasadens utseende ändras väsentligt – exempelvis byte av material eller färg. Underhåll i samma kulör och material kräver normalt inget lov. Kontrollera alltid med kommunen. Fixco hjälper dig med bygglovsansökan vid behov.'
      }
    ],
    cta: 'Dags att renovera fasaden i {area}? Kontakta Fixco för kostnadsfri offert med ROT-avdrag.'
  },

  tillbyggnad: {
    slug: 'tillbyggnad',
    title: 'Guide: Tillbyggnad i {area}',
    intro: 'Behöver du mer plats? En tillbyggnad ökar din bostadsyta utan att behöva flytta. I {area} bygger vi tillbyggnader av alla slag – från uterum och garage till extra rum och våningsplan.',
    sections: [
      {
        heading: 'Vanliga tillbyggnader i {area}',
        body: 'De populäraste tillbyggnaderna i {area} är uterum/inglasade verandor, garage och carport, extra sovrum eller arbetsrum och påbyggnad av en extra våning. Även förråd, attefallshus och gäststugor är efterfrågade. En tillbyggnad kan öka bostadens värde med 15–30 %.'
      },
      {
        heading: 'Bygglov och regler',
        body: 'Tillbyggnad i {area} kräver nästan alltid bygglov. Undantag: attefallstillbyggnad upp till 15 kvm kräver bara anmälan. Kontakta kommunen tidigt för att undvika förseningar. Räkna med 4–8 veckors handläggningstid. Fixco hjälper till med ritningar och ansökan.'
      },
      {
        heading: 'Vad kostar tillbyggnad i {area}?',
        body: 'Tillbyggnad i {area} kostar normalt 15 000–30 000 kr per kvm beroende på standard och komplexitet. Ett extra rum på 15 kvm kostar 225 000–450 000 kr. Ett uterum kostar 100 000–250 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Planering och tidsplan',
        body: 'Räkna med 2–4 månader totalt: 1–2 månader för planering och bygglov, 1–2 månader för byggnation. Mindre tillbyggnader som attefallshus går snabbare. Vinterhalvåret passar bra för planering så att bygget kan starta på våren i {area}.'
      }
    ],
    cta: 'Vill du bygga till i {area}? Kontakta Fixco för kostnadsfri konsultation och offert med ROT-avdrag.'
  },

  byggfirma: {
    slug: 'byggfirma',
    title: 'Guide: Hitta byggfirma i {area}',
    intro: 'En pålitlig byggfirma i {area} gör hela skillnaden för ditt bygg- eller renoveringsprojekt. Här guidar vi dig i hur du väljer rätt och vad du bör tänka på innan du anlitar en byggfirma.',
    sections: [
      {
        heading: 'Vad ska en bra byggfirma erbjuda?',
        body: 'En seriös byggfirma i {area} har F-skattsedel, ansvarsförsäkring och erfarenhet av liknande projekt. De ger dig en detaljerad skriftlig offert, tydlig tidsplan och namngivna hantverkare. De bör också kunna visa tidigare referensprojekt i {area}.'
      },
      {
        heading: 'Totalentreprenad eller delad entreprenad?',
        body: 'Vid totalentreprenad ansvarar byggfirman för hela projektet inklusive underentreprenörer (el, VVS, etc.). Vid delad entreprenad bokar du varje hantverkare separat. I {area} rekommenderar vi totalentreprenad för större projekt – det ger en ansvarig part och minskar risken.'
      },
      {
        heading: 'Vad kostar det att anlita en byggfirma i {area}?',
        body: 'Kostnaden beror helt på projektet. Timpris för byggarbete i {area} ligger på 450–700 kr/h exkl moms. Fast pris är vanligast vid renovering och nybyggnation. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Jämför alltid minst två offerter.'
      },
      {
        heading: 'Kontrollera byggfirman',
        body: 'Sök på företaget på allabolag.se – kolla omsättning, antal anställda och eventuella betalningsanmärkningar. Kontrollera att de har F-skatt på Skatteverkets hemsida. Be om minst tre referenser. I {area} finns Fixco som din trygga partner med garanti på alla arbeten.'
      }
    ],
    cta: 'Letar du efter en pålitlig byggfirma i {area}? Fixco erbjuder fast pris, garanti och ROT-avdrag.'
  },

  'bygga-altan': {
    slug: 'bygga-altan',
    title: 'Guide: Bygga altan i {area}',
    intro: 'Drömmer du om en ny altan i {area}? Vi bygger altaner och trädäck i alla storlekar – från en enkel uteplats till en stor altan med räcke, trappa och belysning. Här guidar vi dig genom processen.',
    sections: [
      {
        heading: 'Planera din altan i {area}',
        body: 'Tänk igenom storlek, placering och materialval. Ska altanen vara i sol eller halvskugga? Behöver du trappa eller räcke? I {area} är 15–25 kvm den vanligaste storleken. Mät upp noga och fundera på hur du vill använda ytan – matplats, loungehörna eller solplats.'
      },
      {
        heading: 'Material: trä eller komposit?',
        body: 'Tryckimpregnerat trä är billigast men kräver årlig oljebehandling. Värmebehandlat trä (ThermoWood) ger fin färg utan kemikalier. Komposittrall är dyrast men helt underhållsfritt. I {area} väljer allt fler komposit tack vare den långa livslängden och noll underhåll.'
      },
      {
        heading: 'Vad kostar det att bygga altan i {area}?',
        body: 'Att bygga altan i {area} kostar 2 500–5 500 kr/kvm inklusive material och arbete. En altan på 20 kvm kostar 50 000–110 000 kr. Med ROT-avdrag sparar du 30 %. Tillval som räcke, trappa och belysning kostar extra men gör altanen mer funktionell.'
      },
      {
        heading: 'Bygglov och regler',
        body: 'Altaner under 1,8 m höjd är ofta bygglovsbefriade i {area}. Närmare än 4,5 m till tomtgräns krävs grannens medgivande. Fixco hjälper dig att kolla reglerna innan bygget startar.'
      }
    ],
    cta: 'Vill du bygga altan i {area}? Fixco levererar fast pris med ROT-avdrag – kontakta oss för gratis offert.'
  },

  'bygga-bastu': {
    slug: 'bygga-bastu',
    title: 'Guide: Bygga bastu i {area}',
    intro: 'En egen bastu är en dröm för många husägare i {area}. Oavsett om du vill bygga inomhusbastu eller utomhusbastu hjälper vi dig från planering till färdig bastu med el och ventilation.',
    sections: [
      {
        heading: 'Inomhus- eller utomhusbastu?',
        body: 'Inomhusbastu i {area} byggs ofta i källare, badrum eller som fristående kabinett. Utomhusbastu kan placeras på tomten som ett fristående hus. Bastutunna har blivit populärt – snabb installation och kompakt format. Välj baserat på tillgängligt utrymme och budget.'
      },
      {
        heading: 'Vad krävs för att bygga bastu?',
        body: 'Bastun behöver ett elaggregat (kräver behörig elektriker), god ventilation och fuktisolering. I {area} behöver du normalt inget bygglov för inomhusbastu. Utomhusbastu som fristående byggnad kan kräva bygglov om den är större än 15 kvm. Fixco samordnar alla hantverkare.'
      },
      {
        heading: 'Vad kostar det att bygga bastu i {area}?',
        body: 'En inomhusbastu i {area} kostar 30 000–80 000 kr inklusive aggregat och installation. En utomhusbastu kostar 50 000–150 000 kr. Bastutunnor finns från 40 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Elanslutning och ventilation ingår i Fixcos offert.'
      },
      {
        heading: 'Aggregat: el eller ved?',
        body: 'Elaggregat är vanligast i {area} – smidigt, snabbt och kräver ingen skorsten. Vedeldad bastu ger autentisk upplevelse men kräver skorsten och sotning. I bostadsrätt är el enda alternativet. Fixco installerar alla typer av bastuaggregat.'
      }
    ],
    cta: 'Vill du bygga bastu i {area}? Kontakta Fixco för kostnadsfri offert med ROT-avdrag.'
  },

  'bygga-carport': {
    slug: 'bygga-carport',
    title: 'Guide: Bygga carport i {area}',
    intro: 'En carport skyddar bilen mot väder och höjer fastighetsvärdet. I {area} bygger vi carportar i trä, stål och aluminium – anpassade efter ditt hus och din tomt.',
    sections: [
      {
        heading: 'Carport eller garage?',
        body: 'En carport är billigare och kräver ofta inget bygglov (under 15 kvm som attefallsåtgärd). Garage ger bättre skydd men kostar 2–3 gånger mer. I {area} är carport det populäraste valet för villor. Många kombinerar carport med förråd på sidan.'
      },
      {
        heading: 'Bygglov i {area}',
        body: 'Carport under 15 kvm kan byggas som attefallsåtgärd med bara en anmälan. Större carportar kräver bygglov. Avstånd till tomtgräns (minst 4,5 m) och placering i förhållande till gatan påverkar. Fixco hjälper med bygglovsansökan.'
      },
      {
        heading: 'Vad kostar en carport i {area}?',
        body: 'En enkel carport i {area} kostar 30 000–60 000 kr. En dubbelcarport kostar 50 000–100 000 kr. Med extra förråd, belysning och eluttag ökar priset. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Material och design',
        body: 'Trä är klassiskt och anpassas enkelt till husets stil. Stål och aluminium ger en modern look och kräver minimalt underhåll. Takbeläggning kan vara plåt, papp eller genomskinliga plattor för ljusinsläpp. I {area} matchar vi alltid carporten med husets arkitektur.'
      }
    ],
    cta: 'Vill du bygga carport i {area}? Fixco erbjuder fast pris med ROT-avdrag – begär gratis offert.'
  },

  'bygga-friggebod': {
    slug: 'bygga-friggebod',
    title: 'Guide: Bygga friggebod i {area}',
    intro: 'En friggebod ger extra utrymme för förvaring, gästrum eller hemmakontor – utan bygglov. I {area} bygger vi skräddarsydda friggebodar och attefallshus som passar din tomt och dina behov.',
    sections: [
      {
        heading: 'Friggebod vs attefallshus',
        body: 'En friggebod i {area} får vara max 15 kvm och kräver varken bygglov eller anmälan. Ett attefallshus får vara upp till 30 kvm men kräver startbesked. Friggeboden passar för förråd och enklare gästrum. Attefallshuset kan vara en komplett bostad med kök och badrum.'
      },
      {
        heading: 'Vad kan friggeboden användas till?',
        body: 'I {area} används friggebodar som förråd, hemmakontor, uthyrningsrum, ateljé, gym och gästhus. Med isolering, el och värme blir friggeboden användbar året runt. Perfekt för den som behöver extra utrymme utan att bygga om huset.'
      },
      {
        heading: 'Vad kostar en friggebod i {area}?',
        body: 'En enkel friggebod i {area} kostar 40 000–80 000 kr. En isolerad och elansluten friggebod kostar 80 000–150 000 kr. Skräddarsydda lösningar med badrum kostar mer. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Regler och placering',
        body: 'Friggeboden i {area} ska placeras minst 4,5 m från tomtgräns (annars krävs grannens godkännande). Nockhöjden får vara max 3 m. Tänk på tillgänglighet, solinfall och avstånd till huvudbyggnaden. Fixco hjälper dig att hitta optimal placering.'
      }
    ],
    cta: 'Vill du bygga friggebod i {area}? Fixco levererar nyckelfärdigt med ROT-avdrag – begär gratis offert.'
  },

  'bygga-utekok': {
    slug: 'bygga-utekok',
    title: 'Guide: Bygga utekök i {area}',
    intro: 'Ett utekök tar ditt uteliv till nästa nivå. I {area} bygger vi skräddarsydda utekök med grill, diskbänk och bänkytor – perfekt för sommarens alla middagar och fester.',
    sections: [
      {
        heading: 'Vad ska ett utekök innehålla?',
        body: 'Ett komplett utekök i {area} har arbetsbänk, grill (gas eller kol), diskho med rinnande vatten och förvaring. Populära tillägg är pizzaugn, kylskåp, sidbrännare och baryta. Materialvalet är avgörande – allt måste tåla väder året runt.'
      },
      {
        heading: 'Material som tål utomhusbruk',
        body: 'Rostfritt stål och natursten är de mest populära materialen i {area}. Bänkskivor i granit, betong eller kompakt laminat tål väder bra. Undvik trä i direkt kontakt med vatten. Skåp bör vara i pulverlackad aluminium eller marin plywood.'
      },
      {
        heading: 'Vad kostar ett utekök i {area}?',
        body: 'Ett utekök i {area} kostar 30 000–150 000 kr beroende på storlek och utrustning. En enkel grillstation kostar från 30 000 kr. Ett komplett utekök med vatten och el kostar 80 000–150 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Vattenanslutning och el',
        body: 'Rinnande vatten i uteköket kräver VVS-arbete – antingen permanent anslutning eller avtagbar koppling som töms inför vintern. El för belysning, kyl och eventuella vitvaror kräver behörig elektriker. Fixco samordnar alla installationer i {area}.'
      }
    ],
    cta: 'Drömmer du om ett utekök i {area}? Kontakta Fixco för kostnadsfri offert med ROT-avdrag.'
  },

  'bygga-plank': {
    slug: 'bygga-plank',
    title: 'Guide: Bygga plank & staket i {area}',
    intro: 'Ett nytt plank eller staket ger insynsskydd, avgränsar tomten och förhöjer utemiljön. I {area} bygger vi alla typer av plank och staket – från klassiska trästaket till moderna lamellplank.',
    sections: [
      {
        heading: 'Plank vs staket – vad passar dig?',
        body: 'Staket är lägre (under 1,1 m) och kräver sällan bygglov i {area}. Plank är högre och ger bättre insynsskydd men kan kräva bygglov om det är över 1,8 m. Lamellplank ger en modern look med delvis insyn. Spaljé kombinerar insynsskydd med klätterväxter.'
      },
      {
        heading: 'Bygglov för plank i {area}',
        body: 'I {area} krävs normalt bygglov för plank högre än 1,8 m. Vid tomtgräns gäller 4,5 meters avstånd – annars krävs grannens godkännande. Staket under 1,1 m kräver sällan lov. Kontrollera alltid med kommunen innan bygget startar.'
      },
      {
        heading: 'Vad kostar plank och staket i {area}?',
        body: 'Staket i {area} kostar 800–1 500 kr per löpmeter. Plank kostar 1 200–2 500 kr per löpmeter beroende på höjd och material. En 20 meter lång inhägnad kostar 16 000–50 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Material och underhåll',
        body: 'Tryckimpregnerat trä är billigast och håller 15–20 år. Cederträ och lärk håller längre utan behandling. Kompositmaterial kräver noll underhåll. I {area} rekommenderar vi att oljebehandla träplank vart 2–3 år för bästa hållbarhet och utseende.'
      }
    ],
    cta: 'Vill du bygga plank eller staket i {area}? Fixco erbjuder fast pris med ROT-avdrag – begär gratis offert.'
  },

  'platsbyggd-garderob': {
    slug: 'platsbyggd-garderob',
    title: 'Guide: Platsbyggd garderob i {area}',
    intro: 'En platsbyggd garderob maximerar förvaringen och anpassas helt efter ditt utrymme. I {area} bygger vi garderober i alla storlekar – från walk-in closets till smarta hallgarderober.',
    sections: [
      {
        heading: 'Fördelar med platsbyggd garderob',
        body: 'En platsbyggd garderob i {area} utnyttjar varje centimeter – även snedtak, nischer och ovanliga mått. Du väljer själv indelningen: hyllor, lådor, stänger och tillbehör. Resultatet blir en garderob som passar dina kläder och vanor perfekt, och som ser inbyggd och exklusiv ut.'
      },
      {
        heading: 'Material och dörrar',
        body: 'Stommen byggs vanligtvis i vitmålad MDF eller melaminbelagd spånskiva. Dörrar kan vara skjutdörrar (sparar utrymme), pardörrar eller öppna hyllor med textila gardiner. I {area} är vita skjutdörrar med spegel populärast. Massivt trä eller ekfanér ger en mer exklusiv känsla.'
      },
      {
        heading: 'Vad kostar platsbyggd garderob i {area}?',
        body: 'En platsbyggd garderob i {area} kostar normalt 15 000–40 000 kr beroende på storlek och utförande. En walk-in garderob kostar 30 000–80 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Jämfört med färdiga system får du en perfekt anpassad lösning.'
      },
      {
        heading: 'Planering och mått',
        body: 'Fixco kommer på hembesök i {area} för att mäta utrymmet och diskutera dina behov. Vi tar fram en 3D-skiss så du ser resultatet innan bygget startar. Tillverkning och montering tar normalt 2–5 dagar beroende på garderobens storlek.'
      }
    ],
    cta: 'Vill du ha en platsbyggd garderob i {area}? Fixco bygger skräddarsytt med ROT-avdrag – begär gratis offert.'
  },

  'platsbyggd-bokhylla': {
    slug: 'platsbyggd-bokhylla',
    title: 'Guide: Platsbyggd bokhylla i {area}',
    intro: 'En platsbyggd bokhylla ger hemmet karaktär och maximerar förvaringen. I {area} bygger vi bokhyllor som sitter vägg-till-vägg, i nischer, runt dörröppningar och under snedtak.',
    sections: [
      {
        heading: 'Varför platsbyggt istället för färdigköpt?',
        body: 'En platsbyggd bokhylla i {area} anpassas exakt efter rummets mått och din stil. Inga glapp mot tak eller väggar – hyllan ser ut som en del av arkitekturen. Du väljer färg, djup, hyllplan och eventuella skåp med dörrar. Resultatet blir både funktionellt och vackert.'
      },
      {
        heading: 'Design och stilval',
        body: 'Klassiska bokhyllor med profilerade lister ger en bibliotekskänsla. Moderna varianter med rena linjer och integrerad belysning passar skandinavisk inredning. I {area} kan vi matcha hyllan med befintliga lister och snickerier för en sömlös integration.'
      },
      {
        heading: 'Vad kostar en platsbyggd bokhylla i {area}?',
        body: 'En platsbyggd bokhylla i {area} kostar normalt 10 000–35 000 kr beroende på storlek och utförande. En vägg-till-vägg hylla (3 m) kostar ca 15 000–25 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Tillval som LED-belysning och skåp med dörrar kostar extra.'
      },
      {
        heading: 'Montering och tidplan',
        body: 'Fixco bygger bokhyllan på plats i {area} – vi mäter, tillverkar och monterar. Arbetet tar normalt 2–4 dagar. Vi skyddar golv och väggar under arbetet och städar alltid efter oss. Hyllan levereras färdigmålad eller lackad.'
      }
    ],
    cta: 'Vill du ha en platsbyggd bokhylla i {area}? Kontakta Fixco för kostnadsfri offert med ROT-avdrag.'
  },

  'renovera-trapp': {
    slug: 'renovera-trapp',
    title: 'Guide: Renovera trapp i {area}',
    intro: 'En renoverad trappa förvandlar hela intrycket av ditt hem. I {area} renoverar vi trappor av alla slag – från slipning och lackning till byte av räcke och steg.',
    sections: [
      {
        heading: 'Vanliga trapprenovering i {area}',
        body: 'De vanligaste trappåtgärderna i {area} är slipning och lackning av trästeg, byte av slitna steg, montering av nytt räcke, installation av trappbelysning och lackning i ny kulör. En sliten trappa kan ofta renoveras istället för att bytas – det sparar både pengar och tid.'
      },
      {
        heading: 'Slipa eller byta trappsteg?',
        body: 'Om stegen är av massivt trä kan de ofta slipas och behandlas med ny lack eller olja. Fanerade steg kan ibland slipas försiktigt. Om stegen är för skadade eller om du vill byta material helt (t.ex. till ek) byts de ut. Fixco bedömer vilken metod som ger bäst resultat i ditt hem i {area}.'
      },
      {
        heading: 'Vad kostar trapprenovering i {area}?',
        body: 'Slipning och lackning av trappa i {area} kostar 8 000–20 000 kr. Byte av alla trappsteg kostar 15 000–40 000 kr. Nytt räcke kostar 5 000–20 000 kr beroende på material. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Räcke: glas, trä eller metall?',
        body: 'Glasräcke ger en modern och luftig känsla. Träräcke är klassiskt och kan matchas med trappans steg. Metallräcke (stål eller smide) ger en industriell look. I {area} är kombinationen av trä-handledare med glasfyllning den mest populära stilen just nu.'
      }
    ],
    cta: 'Vill du renovera trappan i {area}? Fixco erbjuder fast pris med ROT-avdrag – begär gratis offert.'
  },

  trapprenovering: {
    slug: 'trapprenovering',
    title: 'Guide: Trapprenovering i {area}',
    intro: 'En sliten trappa drar ner helhetsintrycket i hemmet. I {area} renoverar vi alla typer av trappor – raka, svängda och spiraltrappor. Från enkel uppfräschning till komplett renovering.',
    sections: [
      {
        heading: 'När bör trappan renoveras?',
        body: 'Tecken på att trappan behöver åtgärdas: nött lack, repor och märken, lösa steg, gnissel vid gång eller ett omodernt räcke. I {area} ser vi ofta trappor från 80- och 90-talet som behöver ny ytbehandling och modernare räcken. En renovering ger nytt liv åt hela hallen.'
      },
      {
        heading: 'Vilka alternativ finns?',
        body: 'Lätt renovering: slipning, lackning och byte av stötbräda. Medium: nya trappsteg ovanpå befintliga, nytt räcke. Komplett: byte av samtliga steg, nytt räcke och ny handledare. I {area} rekommenderar vi att bedöma befintligt material – ofta räcker en medium-renovering för fantastiskt resultat.'
      },
      {
        heading: 'Vad kostar trapprenovering i {area}?',
        body: 'Trapprenovering i {area} kostar 8 000–45 000 kr beroende på omfattning. Enkel slipning/lackning från 8 000 kr. Kompletta trappsteg och räcke 25 000–45 000 kr. Med ROT-avdrag sparar du 30 % på arbetskostnaden. Fixco erbjuder alltid fast pris.'
      },
      {
        heading: 'Tid och praktiska tips',
        body: 'En trapprenovering tar normalt 2–4 dagar. Under arbetet kan man oftast använda en alternativ väg mellan våningarna. Lacken behöver torka minst 24 timmar efter sista strykningen. Fixco planerar arbetet så att störningen i ditt hem i {area} blir minimal.'
      }
    ],
    cta: 'Dags att renovera trappan i {area}? Kontakta Fixco för kostnadsfri offert med ROT-avdrag.'
  },

  dorrbyte: {
    slug: 'dorrbyte',
    title: 'Guide: Dörrbyte i {area}',
    intro: 'Nya dörrar gör underverk för hemmets utseende, ljudisolering och säkerhet. I {area} byter vi innerdörrar, ytterdörrar och altandörrar – snabbt och professionellt.',
    sections: [
      {
        heading: 'Innerdörrar: stil och funktion',
        body: 'Innerdörrar i {area} finns i allt från klassiska 3-spegeldörrar till moderna släta dörrar och glasdörrar. Byte av innerdörrar är ett av de enklaste sätten att modernisera hemmet. Matcha dörrarna med golvlister och fönsterfoder för en sammanhållen stil.'
      },
      {
        heading: 'Ytterdörr: säkerhet och isolering',
        body: 'En ny ytterdörr i {area} förbättrar säkerheten med moderna lås och förstärkt karm. Moderna ytterdörrar har bättre isolering som minskar energiförlust och drag. Välj dörr med säkerhetsklass 3 eller 4 för bästa inbrottsskydd.'
      },
      {
        heading: 'Vad kostar dörrbyte i {area}?',
        body: 'Innerdörr med montering i {area} kostar 3 000–8 000 kr per dörr. Ytterdörr med montering kostar 10 000–30 000 kr. Altandörr/balkongdörr kostar 8 000–20 000 kr. Med ROT-avdrag sparar du 30 % på monteringskostnaden.'
      },
      {
        heading: 'Behövs det mätning innan?',
        body: 'Ja – dörrens mått måste stämma exakt med karmen. Fixco kommer alltid på hembesök i {area} för att mäta innan beställning. Om karmen är skev eller skadad byts den samtidigt. Vi hanterar även justering av lister och trösklar för ett perfekt resultat.'
      }
    ],
    cta: 'Dags att byta dörrar i {area}? Kontakta Fixco för fast pris med ROT-avdrag.'
  },

  ombyggnad: {
    slug: 'ombyggnad',
    title: 'Guide: Ombyggnad i {area}',
    intro: 'En ombyggnad förändrar din bostads planlösning och funktionalitet. I {area} hjälper vi med allt från att slå ut väggar och öppna upp ytor till att skapa nya rum och bättre flöde.',
    sections: [
      {
        heading: 'Vanliga ombyggnadsprojekt i {area}',
        body: 'De vanligaste ombyggnaderna i {area} är öppen planlösning mellan kök och vardagsrum, skapa extra sovrum, bygga om vindsvåning till boyta och omvandla garage till bostad eller kontor. Många ombyggnader ökar bostadens funktionalitet och värde avsevärt.'
      },
      {
        heading: 'Bärande väggar – vad gäller?',
        body: 'Innan du river en vägg i {area} måste du veta om den är bärande. Bärande väggar kan inte tas bort utan att ersättas med balk – detta kräver en konstruktörs beräkning och bygglov. Icke-bärande väggar kan normalt tas bort utan lov. Fixco hjälper dig att utreda detta.'
      },
      {
        heading: 'Vad kostar ombyggnad i {area}?',
        body: 'Ombyggnadskostnader i {area} varierar kraftigt. Att ta bort en icke-bärande vägg kostar 5 000–15 000 kr. Att ersätta en bärande vägg med balk kostar 20 000–60 000 kr. En komplett ombyggnad av planlösningen kostar 100 000–400 000 kr. ROT-avdrag ger 30 % rabatt på arbetet.'
      },
      {
        heading: 'Bygglov vid ombyggnad',
        body: 'I {area} krävs bygglov för ändringar i bärande konstruktion, ändrad planlösning med påverkan på brandskydd och ändrad användning (t.ex. garage till bostad). Enklare ombyggnader som att ta bort icke-bärande väggar kräver normalt inget lov.'
      }
    ],
    cta: 'Planerar du ombyggnad i {area}? Kontakta Fixco för kostnadsfri konsultation och offert med ROT-avdrag.'
  },

  stenlaggning: {
    slug: 'stenlaggning',
    title: 'Guide: Stenläggning i {area}',
    intro: 'Stenläggning ger din uteplats, uppfart eller trädgårdsgång ett exklusivt och hållbart utseende. I {area} lägger vi natursten, gatsten och betongsten med professionell precision.',
    sections: [
      {
        heading: 'Typer av sten',
        body: 'I {area} är de populäraste alternativen granitgatsten (klassisk och extremt hållbar), skiffer (elegant och modern), kalksten (varm och mjuk) och betongsten (prisvärt och mångsidigt). Natursten håller i generationer medan betongsten ger fler design-möjligheter till lägre pris.'
      },
      {
        heading: 'Var passar stenläggning?',
        body: 'Stenläggning i {area} används till uppfarter, uteplatser, trädgårdsgångar, poolområden och entréer. Gatsten på uppfarten tål tunga fordon och ser elegant ut i decennier. Skiffer på uteplatsen ger en modern och exklusiv känsla.'
      },
      {
        heading: 'Vad kostar stenläggning i {area}?',
        body: 'Stenläggning i {area} kostar 1 000–2 500 kr per kvm inklusive material och arbete. Betongsten från 800 kr/kvm, granitgatsten 1 200–2 000 kr/kvm, skiffer 1 500–2 500 kr/kvm. Med ROT-avdrag sparar du 30 % på arbetskostnaden.'
      },
      {
        heading: 'Markberedning är nyckeln',
        body: 'Professionell stenläggning i {area} börjar alltid med ordentlig markberedning: schaktning, packning av bärlager och utläggning av sättsand. Utan rätt underarbete riskerar du sättningar och ojämnheter. Fixco utför alltid komplett markberedning som en del av projektet.'
      }
    ],
    cta: 'Vill du ha stenläggning i {area}? Kontakta Fixco för kostnadsfri offert med ROT-avdrag.'
  },
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

/**
 * Get all guide slugs (for related links).
 */
export function getAllGuideSlugs(): string[] {
  return Object.keys(CARPENTRY_GUIDES);
}

/**
 * Get display name for a guide slug.
 */
export function getGuideDisplayName(slug: string): string | null {
  const guide = CARPENTRY_GUIDES[slug];
  if (!guide) return null;
  // Extract name from title by removing "Guide: " prefix and " i {area}" suffix
  return guide.title.replace('Guide: ', '').replace(' i {area}', '');
}
