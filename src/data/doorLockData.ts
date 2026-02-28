import { Lock, Smartphone, Shield, Key, Wifi, Fingerprint, KeyRound, Building } from "lucide-react";

// Brand data for the brand cards section
export const doorLockBrands = [
  {
    name: "Yale Doorman",
    models: "L3S Flex, Classic, V2N",
    description: "Sveriges mest populära smarta lås. Enkel installation med kodpanel och app-styrning via Yale Access.",
    icon: Lock,
    features: ["Kodpanel", "App-styrning", "Auto-lås"],
    slug: "montering-installera-yale-doorman"
  },
  {
    name: "Yale Linus",
    models: "L2, Smart Lock",
    description: "Kompakt smart lås som monteras på insidan utan borrning. Behåll din befintliga nyckel.",
    icon: Smartphone,
    features: ["Ingen borrning", "Behåll nyckel", "Bluetooth"],
    slug: "montering-installera-yale-linus"
  },
  {
    name: "ASSA ABLOY",
    models: "Connect, Seos, Aperio",
    description: "Premium-lås från Nordens ledande låstillverkare. Hög säkerhetsklass och robust konstruktion.",
    icon: Shield,
    features: ["SSF-certifierat", "Premium-kvalitet", "Robust"],
    slug: "montering-installera-smart-dorrlas"
  },
  {
    name: "Nuki",
    models: "Smart Lock 4.0, Pro",
    description: "Österrikiskt smart lås med bred kompatibilitet. Stödjer HomeKit, Google Home och Alexa.",
    icon: Wifi,
    features: ["HomeKit", "Google Home", "Auto-unlock"],
    slug: "montering-installera-smart-dorrlas"
  },
  {
    name: "Glue",
    models: "Smart Lock, Smart Lock Pro",
    description: "Svenskt smart lås designat för nordiska dörrar. Enkel installation och elegant design.",
    icon: Fingerprint,
    features: ["Svensk design", "Enkel montering", "Bluetooth"],
    slug: "montering-installera-smart-dorrlas"
  },
  {
    name: "Danalock",
    models: "V3, V3+",
    description: "Danskt smart lås med Z-Wave och Bluetooth. Populärt val för smarta hem-system.",
    icon: Key,
    features: ["Z-Wave", "Bluetooth", "Smart hem"],
    slug: "montering-installera-smart-dorrlas"
  },
  {
    name: "Kodlås",
    models: "Mekaniska & digitala",
    description: "Klassiska kodlås för porten, ytterdörren eller kontoret. Inga nycklar, enbart kod.",
    icon: KeyRound,
    features: ["Ingen nyckel", "Enkel kod", "Robust"],
    slug: "montering-installera-kodlas"
  },
  {
    name: "Cylinderlås",
    models: "ASSA, Dorma, Mul-T-Lock",
    description: "Traditionella cylinderlås för ytterdörrar. Vi byter till säkerhetsklassade cylindrar.",
    icon: Building,
    features: ["SSF-klass", "Traditionellt", "Säkert"],
    slug: "montering-byta-cylinderlas"
  }
];

// Comparison table data
export const comparisonData = [
  {
    brand: "Yale Doorman",
    model: "L3S Flex",
    type: "Bluetooth + WiFi",
    doorTypes: "Svenska standarddörrar",
    rotEligible: true,
    priceRange: "3 500 – 5 500 kr"
  },
  {
    brand: "Yale Linus",
    model: "L2 Smart Lock",
    type: "Bluetooth + WiFi",
    doorTypes: "De flesta dörrar (utan borrning)",
    rotEligible: true,
    priceRange: "2 000 – 3 500 kr"
  },
  {
    brand: "Nuki",
    model: "Smart Lock 4.0",
    type: "Bluetooth + WiFi + Matter",
    doorTypes: "Europeiska dörrar (cylinder)",
    rotEligible: true,
    priceRange: "2 500 – 4 000 kr"
  },
  {
    brand: "Glue",
    model: "Smart Lock Pro",
    type: "Bluetooth",
    doorTypes: "Nordiska standarddörrar",
    rotEligible: true,
    priceRange: "2 000 – 3 000 kr"
  },
  {
    brand: "ASSA ABLOY",
    model: "Connect / Seos",
    type: "Bluetooth + RFID",
    doorTypes: "ASSA-kompatibla dörrar",
    rotEligible: true,
    priceRange: "4 000 – 8 000 kr"
  },
  {
    brand: "Danalock",
    model: "V3+",
    type: "Z-Wave + Bluetooth",
    doorTypes: "Europeiska cylinderlås",
    rotEligible: true,
    priceRange: "2 500 – 4 000 kr"
  }
];

// FAQ data
export const doorLockFAQs = [
  {
    question: "Kan jag installera Yale Doorman själv?",
    answer: "Tekniskt sett ja, men vi rekommenderar professionell installation. Felaktig montering kan påverka låsets funktion och din försäkring. Dessutom krävs korrekt anpassning till din dörr – fel mått eller vinkel kan göra att låset inte låser ordentligt. Med professionell installation får du även ROT-avdrag (30%) på arbetskostnaden."
  },
  {
    question: "Vilka dörrar passar Yale Doorman på?",
    answer: "Yale Doorman är designad för svenska standarddörrar med en tjocklek på 40–80 mm. Modellen L3S Flex passar de flesta ytterdörrar med standardmått. Vi kontrollerar alltid din dörr innan installation och rekommenderar rätt modell. Har du en speciell dörr (säkerhetsdörr, aluminium, glas) kontaktar du oss för rådgivning."
  },
  {
    question: "Vad kostar installation av smart dörrlås?",
    answer: "Installationskostnaden beror på låstyp och dörr. Typiskt tar en installation 1–2 timmar. Med vår timpris på 759 kr/h och 30% ROT-avdrag betalar du från ca 531 kr/h efter avdrag. Själva låset köper du separat eller via oss. Kontakta oss för en exakt offert baserad på ditt val av lås."
  },
  {
    question: "Får jag ROT-avdrag för dörrlåsinstallation?",
    answer: "Ja! Installation av dörrlås räknas som ROT-arbete (reparation, ombyggnad, tillbyggnad). Du får 30% avdrag på arbetskostnaden, upp till 50 000 kr per person och år. ROT-avdraget gäller oavsett om det är ett smart lås, kodlås eller traditionellt cylinderlås – så länge arbetet utförs i din bostad."
  },
  {
    question: "Vad är skillnaden mellan Yale Doorman och Yale Linus?",
    answer: "Yale Doorman ersätter hela låset och har en inbyggd kodpanel på utsidan – perfekt som huvudlås. Yale Linus monteras på insidan av din befintliga dörr utan borrning och behåller din vanliga nyckel. Doorman passar bäst som komplett låslösning, medan Linus är idealisk om du vill lägga till smart funktion utan att ändra dörren."
  },
  {
    question: "Fungerar smarta lås om strömmen går?",
    answer: "Ja, alla smarta lås har batteribackup som räcker 6–12 månader (beroende på modell). Yale Doorman varnar i god tid via appen och med pip-ljud. Om batteriet tar slut helt kan du använda en extern 9V-batterihållare för nödöppning. Du blir alltså aldrig utelåst."
  },
  {
    question: "Kan jag behålla mitt vanliga lås parallellt?",
    answer: "Med Yale Linus – ja! Linus monteras på insidan och fungerar tillsammans med ditt befintliga lås. Med Yale Doorman ersätts det gamla låset helt. Med Nuki kan du också behålla din befintliga cylinder. Vi rådger dig om bästa lösningen utifrån dina behov."
  },
  {
    question: "Hur lång tid tar installation?",
    answer: "En typisk installation tar 1–2 timmar beroende på låstyp och dörr. Yale Linus (utan borrning) tar ofta under 1 timme. Yale Doorman tar typiskt 1,5–2 timmar inklusive konfiguration av app och koder. Vi bokar alltid in tillräckligt med tid för att säkerställa att allt fungerar perfekt."
  },
  {
    question: "Är smarta lås lika säkra som vanliga lås?",
    answer: "Ja, och ofta säkrare. Yale Doorman har SSF 3522-certifiering (klass 2) och ASSA ABLOY-lås uppfyller högsta säkerhetsklasser. Smarta lås loggar dessutom all aktivitet – du ser exakt vem som öppnat dörren och när. Automatisk låsning eliminerar risken att glömma låsa dörren."
  },
  {
    question: "Vilka smart hem-system fungerar med dörrlåsen?",
    answer: "Det varierar per märke: Yale fungerar med Apple HomeKit, Google Home och Alexa via Yale Connect WiFi Bridge. Nuki stödjer HomeKit, Google Home, Alexa och Matter. Danalock stödjer Z-Wave-system (Fibaro, Homey). Vi hjälper dig välja rätt lås för ditt befintliga smart hem-system."
  }
];

// HowTo steps
export const howToSteps = [
  {
    step: 1,
    title: "Beskriv ditt projekt",
    description: "Berätta vilken typ av lås du vill installera och vilken dörr det gäller. Skicka gärna bilder."
  },
  {
    step: 2,
    title: "Få gratis offert",
    description: "Vi återkommer inom 24 timmar med en skräddarsydd offert inklusive ROT-avdrag."
  },
  {
    step: 3,
    title: "Boka tid",
    description: "Välj en tid som passar dig. Vi finns tillgängliga vardagar och helger."
  },
  {
    step: 4,
    title: "Professionell installation",
    description: "Vår certifierade montör installerar och konfigurerar ditt nya lås. Du betalar efter ROT-avdrag."
  }
];

// Long-form SEO content
export const seoContent = {
  intro: `Ett smart dörrlås ger dig frihet att låsa och låsa upp din dörr utan traditionella nycklar. Istället använder du en app på din telefon, en personlig kod, fingeravtryck eller till och med automatisk upplåsning baserat på din GPS-position. Det innebär att du aldrig mer behöver oroa dig för borttappade nycklar, och du kan enkelt ge tillfällig tillgång till hantverkare, familjemedlemmar eller gäster.`,
  
  brandComparison: `**Yale Doorman** är det överlägset populäraste smarta låset i Sverige. Med sin inbyggda kodpanel och robusta konstruktion passar det perfekt som huvudlås på din ytterdörr. Modellen L3S Flex är den senaste och stödjer både Bluetooth och WiFi via Yale Connect Bridge.

**Yale Linus** är det smarta valet om du vill behålla ditt befintliga lås. Det monteras på insidan av dörren utan borrning och fungerar som ett smart "påbyggnadslås". Perfekt för hyresrätter eller om du gillar din nuvarande nyckel.

**Nuki Smart Lock 4.0** är ett populärt europeiskt alternativ som stödjer Matter – den nya smarta hem-standarden. Det fungerar med praktiskt taget alla smart hem-plattformar och har en elegant, kompakt design.

**Glue Smart Lock** är ett svenskt alternativ designat specifikt för nordiska dörrar. Enkel installation, diskret design och pålitlig Bluetooth-anslutning gör det till ett utmärkt val.

**ASSA ABLOY** erbjuder premium-lösningar för den som prioriterar maximal säkerhet. Med SSF-certifiering och robust konstruktion är ASSA-låsen branschledande i Norden.`,

  doorCompatibility: `De flesta smarta lås passar svenska standarddörrar med en tjocklek på 40–80 mm. Yale Doorman är specifikt designat för svenska dörrmått och passar de allra flesta ytterdörrar. Yale Linus och Nuki monteras på befintlig cylinder och fungerar med nästan alla dörrtyper.

Har du en säkerhetsdörr, branddörr eller en dörr med ovanliga mått? Kontakta oss innan bokning – vi hjälper dig hitta rätt lösning. I vissa fall kan anpassningar behövas, vilket vi alltid informerar om i förväg.`,

  rotInfo: `Installation av dörrlås berättigar till **ROT-avdrag**. Det innebär att du får tillbaka 30% av arbetskostnaden (inklusive moms), upp till 50 000 kr per person och år. ROT-avdraget gäller för:

- Installation av smart dörrlås (Yale Doorman, Linus, Nuki m.fl.)
- Byte av cylinderlås
- Installation av kodlås
- Byte av hela låshuset

Avdraget hanteras automatiskt av oss – du betalar bara din del direkt. Vi skickar underlag till Skatteverket.`,

  professionalHelp: `Även om vissa smarta lås marknadsförs som "enkel hemmainstallation" rekommenderar vi alltid professionell montering. Anledningarna är flera:

1. **Säkerhet** – Felaktig installation kan göra att låset inte låser ordentligt, vilket äventyrar din säkerhet.
2. **Försäkring** – Många försäkringsbolag kräver att låsbyten utförs av behörig montör.
3. **Garanti** – Tillverkarens garanti kan påverkas av felaktig installation.
4. **ROT-avdrag** – Du får bara ROT-avdrag om arbetet utförs av ett F-skatteregistrerat företag.
5. **Konfiguration** – Vi hjälper dig konfigurera appen, koder och smart hem-integration.`,

  safety: `Alla smarta lås vi installerar uppfyller relevanta säkerhetsstandarder. Yale Doorman har SSF 3522-certifiering (klass 2) och ASSA ABLOY-produkter uppfyller de högsta säkerhetsklasserna i Norden.

Smarta lås erbjuder dessutom funktioner som traditionella lås saknar:
- **Aktivitetslogg** – Se exakt vem som öppnat dörren och när
- **Automatisk låsning** – Dörren låses automatiskt efter en inställd tid
- **Fjärrstyrning** – Lås och lås upp var du än befinner dig
- **Tillfälliga koder** – Ge hantverkare eller gäster temporär tillgång`
};

// Schema.org structured data
export const getDoorLockSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://fixco.se/tjanster/dorrlas#service",
      "name": "Installation av Dörrlås och Smarta Lås",
      "description": "Professionell installation av smarta dörrlås – Yale Doorman, Linus, Nuki, ASSA ABLOY m.fl. ROT-avdrag 30%. Certifierade montörer i Uppsala och Stockholm.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Fixco",
        "telephone": "+46793350228",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Kungsgatan 1",
          "addressLocality": "Uppsala",
          "addressCountry": "SE"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "89",
          "reviewCount": "67"
        }
      },
      "areaServed": [
        { "@type": "City", "name": "Uppsala" },
        { "@type": "City", "name": "Stockholm" }
      ],
      "serviceType": "Dörrlås installation",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "SEK",
        "price": "759",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "759",
          "priceCurrency": "SEK",
          "unitText": "timme"
        }
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://fixco.se/tjanster/dorrlas#faq",
      "mainEntity": doorLockFAQs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@type": "HowTo",
      "@id": "https://fixco.se/tjanster/dorrlas#howto",
      "name": "Så bokar du installation av dörrlås",
      "description": "4 enkla steg för att boka installation av dörrlås via Fixco",
      "step": howToSteps.map(step => ({
        "@type": "HowToStep",
        "position": step.step,
        "name": step.title,
        "text": step.description
      }))
    }
  ]
});