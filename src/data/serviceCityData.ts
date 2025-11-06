export type ServiceKey =
  | "Elmontör"
  | "VVS"
  | "Snickare"
  | "Måleri"
  | "Städ"
  | "Markarbeten"
  | "Flytt"
  | "Montering"
  | "Trädgård"
  | "Tekniska installationer";

// Multilingual string type
export interface LocalizedString {
  sv: string;
  en: string;
}

export interface ServiceCityItem {
  service: ServiceKey;
  city: "Uppsala" | "Stockholm";
  slug: string | LocalizedString; // Can be simple string (old) or multilingual (new)
  h1: string | LocalizedString;
  title: string | LocalizedString;
  description: string | LocalizedString;
  priceHint?: string | LocalizedString;
  faqs: Array<{ q: string | LocalizedString; a: string | LocalizedString }>;
  cases: Array<{ title: string | LocalizedString; desc: string | LocalizedString }>;
  howItWorks?: Array<{ step: number; title: string | LocalizedString; desc: string | LocalizedString }>;
  priceExamples?: Array<{ job: string | LocalizedString; price: string; duration: string | LocalizedString }>;
  quickFacts?: Array<string | LocalizedString>;
  didYouKnow?: Array<string | LocalizedString>;
}

export const serviceCityData: ServiceCityItem[] = [
  // ========== ELMONTÖR ==========
  {
    service: "Elmontör",
    city: "Uppsala",
    slug: { sv: "elmontor-uppsala", en: "electrician-uppsala" },
    h1: { 
      sv: "Elmontör i Uppsala", 
      en: "Electrician in Uppsala" 
    },
    title: { 
      sv: "Elmontör i Uppsala – Installation & Felsökning | ROT 50%", 
      en: "Electrician in Uppsala – Installation & Troubleshooting | ROT 50%" 
    },
    description: {
      sv: "Auktoriserade elektriker i Uppsala för belysning, uttag, laddbox och felsökning. Snabb hjälp, ROT-avdrag 50%. Start inom 24h.",
      en: "Certified electricians in Uppsala for lighting, outlets, charging boxes and troubleshooting. Fast help, ROT deduction 50%. Start within 24h."
    },
    howItWorks: [
      { 
        step: 1, 
        title: { sv: "Kontakta oss", en: "Contact us" }, 
        desc: { 
          sv: "Ring eller begär offert online. Vi återkommer inom 2 timmar på vardagar.", 
          en: "Call or request a quote online. We respond within 2 hours on weekdays." 
        }
      },
      { 
        step: 2, 
        title: { sv: "Kostnadsfri besiktning", en: "Free inspection" }, 
        desc: { 
          sv: "Vi kommer hem till dig i Uppsala för att se över jobbet. Ofta samma dag.", 
          en: "We come to your home in Uppsala to inspect the job. Often same day." 
        }
      },
      { 
        step: 3, 
        title: { sv: "Tydlig offert", en: "Clear quote" }, 
        desc: { 
          sv: "Du får en detaljerad offert med fast pris. Inga dolda kostnader.", 
          en: "You get a detailed quote with fixed price. No hidden costs." 
        }
      },
      { 
        step: 4, 
        title: { sv: "Vi genomför jobbet", en: "We complete the job" }, 
        desc: { 
          sv: "Auktoriserade elektriker utför arbetet enligt avtalad tid. Start inom 24-48h.", 
          en: "Certified electricians perform the work according to agreed time. Start within 24-48h." 
        }
      },
      { 
        step: 5, 
        title: { sv: "Dokumentation & garanti", en: "Documentation & warranty" }, 
        desc: { 
          sv: "Du får besiktningsprotokoll och garanti. ROT-avdraget sköter vi.", 
          en: "You get inspection report and warranty. We handle the ROT deduction." 
        }
      }
    ],
    priceExamples: [
      { 
        job: { sv: "Byte av 5 st eluttag", en: "Replacement of 5 electrical outlets" }, 
        price: "2 500 kr", 
        duration: { sv: "1-2 timmar", en: "1-2 hours" }
      },
      { 
        job: { sv: "Installation av taklampa", en: "Installation of ceiling lamp" }, 
        price: "1 200 kr", 
        duration: { sv: "30-60 min", en: "30-60 min" }
      },
      { 
        job: { sv: "Laddbox 11 kW inkl. installation", en: "Charging box 11 kW incl. installation" }, 
        price: "12 500 kr", 
        duration: { sv: "4-6 timmar", en: "4-6 hours" }
      },
      { 
        job: { sv: "Felsökning jordfel", en: "Ground fault troubleshooting" }, 
        price: "från 1 800 kr", 
        duration: { sv: "1-3 timmar", en: "1-3 hours" }
      }
    ],
    quickFacts: [
      { 
        sv: "90% av Uppsalas fastigheter behöver eluppgradering inom 10 år",
        en: "90% of Uppsala's properties need electrical upgrades within 10 years"
      },
      {
        sv: "Laddbox kan öka fastighetsvärdet med 2-5%",
        en: "Charging box can increase property value by 2-5%"
      },
      {
        sv: "ROT-avdrag ger 50% rabatt på arbetskostnaden",
        en: "ROT deduction gives 50% discount on labor costs"
      },
      {
        sv: "Uppsala kommun kräver installationstillstånd för laddboxar",
        en: "Uppsala municipality requires installation permit for charging boxes"
      },
      {
        sv: "LED-belysning sparar 80% energi jämfört med glödlampor",
        en: "LED lighting saves 80% energy compared to incandescent bulbs"
      },
      {
        sv: "Elinstallationer får endast utföras av auktoriserad elektriker enligt ellagen",
        en: "Electrical installations may only be performed by certified electricians according to law"
      },
      {
        sv: "En elsäkerhetsbesiktning kostar 2 500-4 500 kr och rekommenderas vart 10:e år",
        en: "An electrical safety inspection costs 2,500-4,500 kr and is recommended every 10 years"
      },
      {
        sv: "Uppsala har över 15 000 villor byggda före 1970 med behov av eluppgradering",
        en: "Uppsala has over 15,000 houses built before 1970 in need of electrical upgrades"
      },
      {
        sv: "Modernisering av elcentral inkl. 10 nya automatsäkringar kostar ca 15 000-25 000 kr",
        en: "Modernization of electrical panel incl. 10 new circuit breakers costs approx. 15,000-25,000 kr"
      },
      {
        sv: "Jordfelsvarnare är obligatoriska i våtutrymmen sedan 1994",
        en: "Ground fault circuit interrupters have been mandatory in wet rooms since 1994"
      },
      {
        sv: "Uppsala Energi erbjuder bidrag för installation av solceller på villatak",
        en: "Uppsala Energi offers grants for solar panel installation on house roofs"
      },
      {
        sv: "En 3-rums lägenhet i Uppsala använder i snitt 2 000-3 000 kWh el per år",
        en: "A 3-room apartment in Uppsala uses on average 2,000-3,000 kWh electricity per year"
      }
    ],
    didYouKnow: [
      {
        sv: "Uppsala universitet installerade Sveriges första elledning för gatubelysning år 1893",
        en: "Uppsala University installed Sweden's first electrical wiring for street lighting in 1893"
      },
      {
        sv: "Ett hushåll i Uppsala lämnar i snitt apparater i standby-läge som drar 500 kWh/år – motsvarande 800 kr",
        en: "A household in Uppsala leaves appliances on standby that consume 500 kWh/year – equivalent to 800 kr"
      },
      {
        sv: "Blixtnedslag orsakar varje år skador på elsystem i Uppsala län för över 50 miljoner kronor",
        en: "Lightning strikes cause electrical system damage in Uppsala county for over 50 million kr annually"
      },
      {
        sv: "En smart termostat kan sänka din elräkning med 15-20% genom optimerad styrning",
        en: "A smart thermostat can reduce your electricity bill by 15-20% through optimized control"
      },
      {
        sv: "Uppsala har Sveriges högsta andel laddboxar per capita – 1 laddbox per 12 invånare",
        en: "Uppsala has Sweden's highest proportion of charging boxes per capita – 1 charging box per 12 residents"
      },
      {
        sv: "En typisk villa i Uppsala kan spara 8 000-12 000 kr/år genom byte till LED-belysning",
        en: "A typical house in Uppsala can save 8,000-12,000 kr/year by switching to LED lighting"
      },
      {
        sv: "Elsäkerhetsverket kontrollerar ca 15% av alla elanläggningar i Sverige årligen",
        en: "The Swedish Electrical Safety Authority inspects approximately 15% of all electrical installations in Sweden annually"
      }
    ],
    faqs: [
      { 
        q: { 
          sv: "Hur snabbt kan elektriker komma ut i Uppsala?", 
          en: "How fast can an electrician come out in Uppsala?" 
        },
        a: { 
          sv: "Vid akuta fel försöker vi komma samma dag. För planerade installationer kan vi ofta starta inom 24-48 timmar.", 
          en: "For urgent issues we try to come the same day. For planned installations we can often start within 24-48 hours." 
        }
      },
      { 
        q: { 
          sv: "Installerar ni laddboxar i Uppsala?", 
          en: "Do you install charging boxes in Uppsala?" 
        },
        a: { 
          sv: "Ja, vi installerar laddboxar för elbilar inklusive effektvakt, jordning och dokumentation enligt Elsäkerhetsverkets krav.", 
          en: "Yes, we install charging boxes for electric cars including load guard, grounding and documentation according to Swedish Electrical Safety Authority requirements." 
        }
      },
      {
        q: { 
          sv: "Är era elektriker auktoriserade?", 
          en: "Are your electricians certified?" 
        },
        a: { 
          sv: "Ja, alla våra elektriker är auktoriserade av Elsäkerhetsverket och arbetar enligt gällande standarder (SS 436 40 00).", 
          en: "Yes, all our electricians are certified by the Swedish Electrical Safety Authority and work according to current standards (SS 436 40 00)." 
        }
      }
    ],
    cases: [
      { 
        title: { 
          sv: "Felsökning jordfel Svartbäcken", 
          en: "Ground fault troubleshooting Svartbäcken" 
        },
        desc: { 
          sv: "Spårning och åtgärd av jordfel i villa, byte av 3 st dvärgbrytare och dokumentation. Genomfört på 2 timmar.", 
          en: "Tracking and fixing ground fault in house, replacement of 3 miniature circuit breakers and documentation. Completed in 2 hours." 
        }
      },
      { 
        title: { 
          sv: "LED-belysning kök Luthagen", 
          en: "LED lighting kitchen Luthagen" 
        },
        desc: { 
          sv: "Installation av 8 st LED-spotlights med dimmers och ny strömförsörjning. Snyggt, energieffektivt och med ROT-avdrag.", 
          en: "Installation of 8 LED spotlights with dimmers and new power supply. Clean, energy efficient and with ROT deduction." 
        }
      },
      {
        title: { 
          sv: "Laddbox installation Gottsunda", 
          en: "Charging box installation Gottsunda" 
        },
        desc: { 
          sv: "Installation av 11 kW laddbox för elbil, inkl. effektvakt, jordning och besiktningsprotokoll.", 
          en: "Installation of 11 kW charging box for electric car, incl. load guard, grounding and inspection protocol." 
        }
      }
    ]
  },
  {
    service: "Elmontör",
    city: "Stockholm",
    slug: "elmontor-stockholm",
    h1: "Elmontör i Stockholm",
    title: "Elmontör i Stockholm – Elektriker för Hem & Företag | ROT 50%",
    description:
      "Elinstallation, belysning, laddbox och felsökning i Stockholm. Auktoriserade elektriker med tydliga priser och ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Kontakta oss", desc: "Ring eller begär offert online. Svar inom 2 timmar på vardagar." },
      { step: 2, title: "Kostnadsfri besiktning", desc: "Vi kommer till dig i Stockholm för att bedöma jobbet. Ofta samma dag." },
      { step: 3, title: "Fast pris-offert", desc: "Du får en detaljerad offert med fast pris och tidsplan. Inga överraskningar." },
      { step: 4, title: "Auktoriserad elektriker", desc: "Vi utför arbetet enligt avtalad tid. Start inom 24-48h." },
      { step: 5, title: "Besiktning & garanti", desc: "Besiktningsprotokoll och garanti ingår. Vi hanterar ROT-avdraget åt dig." }
    ],
    priceExamples: [
      { job: "Byte av 5 st eluttag", price: "2 800 kr", duration: "1-2 timmar" },
      { job: "Installation av taklampa", price: "1 400 kr", duration: "30-60 min" },
      { job: "Laddbox 11 kW inkl. installation", price: "13 500 kr", duration: "4-6 timmar" },
      { job: "Elfelsökning", price: "från 2 000 kr", duration: "1-3 timmar" }
    ],
    quickFacts: [
      "80% av Stockholms sekelskifteslägenheter har ursprunglig el",
      "Laddbox i Stockholm kräver anmälan till Ellevio 4-6 veckor innan",
      "ROT-avdrag ger 50% rabatt på arbetskostnaden (max 50 000 kr/år)",
      "Stockholm har Sveriges högsta efterfrågan på elbilsladdning",
      "Modern belysning kan spara 500-800 kr/år per rum",
      "Sekelskifteslägenheter har ofta schukuttag som ska bytas till jordat uttag",
      "Stockholm Energi erbjuder bidrag för smart elmätare och energioptimering",
      "Elbilar i Stockholm har ökat med 400% sedan 2019 - laddbox är nödvändigt",
      "En lägenhet i Stockholm förbrukar i snitt 2 500-3 500 kWh el per år",
      "Felaktig elinstallation orsakar 5 000 bostadsbränder i Sverige årligen",
      "LED-konvertering av en 3:a i Stockholm sparar 3 000-4 000 kr/år",
      "Jordfelsbrytare ska testas månadsvis enligt Elsäkerhetsverkets rekommendation"
    ],
    didYouKnow: [
      "Kungliga Slottet fick Sveriges första elbelysning år 1883 med gatubelysning längs Slottsbacken",
      "Stockholm konsumerar 8 TWh el årligen - mer än hela Norrbottens industri",
      "Gamla Stan har fortfarande äldre elledningar från 1930-talet som behöver moderniseras",
      "En lägenhet på Östermalm använder i snitt 40% mer el än motsvarande lägenhet i förorten",
      "Stockholm har Sveriges högsta koncentration av datahallar vilket påverkar elnätet",
      "Blixtnedslag orsakar skador på elektronik i Stockholms innerstad för 80 miljoner kr/år",
      "Ett hushåll i Stockholm kan spara 15 000-20 000 kr/år genom att byta till energieffektiv belysning och smart styrning"
    ],
    faqs: [
      { 
        q: "Kan ni arbeta i Stockholms innerstad?", 
        a: "Ja, vi planerar parkering/lastzon i förväg och tar med skyddsmaterial för att skydda trappor och golv i lägenheter." 
      },
      {
        q: "Gör ni felsökning på äldre elinstallationer?",
        a: "Ja, vi har stor erfarenhet av äldre installationer i sekelskifteslägenheter och kan både felsöka och modernisera enligt gällande standard."
      }
    ],
    cases: [
      { 
        title: "Kontorsbelysning Vasastan", 
        desc: "Byte till LED-paneler i kontorslokal, installation av närvarostyrning och zonindelning för energieffektiv belysning." 
      },
      {
        title: "Elfelsökning Östermalm",
        desc: "Felsökning av utlösta säkringar, byte av defekt jordfelsbrytare och dokumentation."
      }
    ]
  },

  // ========== VVS ==========
  {
    service: "VVS",
    city: "Uppsala",
    slug: "vvs-uppsala",
    h1: "VVS-montör i Uppsala",
    title: "VVS i Uppsala – Rörmokare för Badrum & Akut läcka | ROT 50%",
    description:
      "Rörmokare i Uppsala för blandare, WC, dusch, läckor och badrumsrenoveringar. Snabb hjälp vid akuta läckor och ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Ring vid akut läcka", desc: "Vid akuta läckor - ring direkt. Vi prioriterar nödfall och kommer ofta samma dag." },
      { step: 2, title: "Snabb utryckning", desc: "Vi kommer till din fastighet i Uppsala med verktyg och reservdelar." },
      { step: 3, title: "Felsökning & åtgärd", desc: "Vi hittar problemet, förklarar vad som behövs och ger dig ett fast pris." },
      { step: 4, title: "Professionell utförande", desc: "Certifierad rörmokare utför arbetet enligt branschstandard." },
      { step: 5, title: "Test & garanti", desc: "Vi testar allt noga och ger garanti. Försäkringsintyg vid behov." }
    ],
    priceExamples: [
      { job: "Byte av blandare", price: "2 200 kr", duration: "1 timme" },
      { job: "Installation av WC-stol", price: "3 500 kr", duration: "2-3 timmar" },
      { job: "Akut läcka (utryckning)", price: "från 2 500 kr", duration: "1-2 timmar" },
      { job: "Badrumsrenovering liten", price: "från 85 000 kr", duration: "2-3 veckor" }
    ],
    quickFacts: [
      "Uppsala har många läckor vintertid på grund av äldre rör",
      "BRF-badrumsrenoveringar kräver ofta godkännande från styrelse",
      "ROT-avdrag gäller både arbetskostnad och viss materiel",
      "Försäkring kan täcka akuta läckor - spara alltid kvitton",
      "Moderna termostatblandare sparar vatten och energi",
      "VVS-installationer kräver certifiering enligt Byggvarudeklaration",
      "En droppande kran slösar 20 liter vatten per dag (motsvarande 150 kr/år)",
      "Uppsala vatten har hög hårdhet vilket kräver regelbunden avkalkning",
      "Fuktskador kostar svenska husägare 9 miljarder kr årligen",
      "Golvvärme i badrum kan spara 20% på uppvärmningskostnaden",
      "Uppsala kommun kräver VA-anmälan för större badrumsrenoveringar",
      "Moderna duschsystem använder 50% mindre vatten än äldre modeller"
    ],
    didYouKnow: [
      "Uppsala fick sitt första vattenledningssystem år 1867 - ett av Sveriges äldsta",
      "En genomsnittlig familj i Uppsala använder 150 liter vatten per person och dag",
      "Uppsalas vattenledningsnät är 600 km långt - det är längre än från Uppsala till Malmö",
      "Köldknäpp kan orsaka läckor i ovärmda sommarstugor runt Uppsala - över 200 fall per vinter",
      "En standard WC-spolning använder 6 liter vatten - äldre modeller använde 9-12 liter",
      "Vattenläckor i Uppsala upptäcks i genomsnitt efter 3 dagar - mycket senare än Stockholm",
      "Uppsala Vatten har Sveriges modernaste reningsverk med 99,7% reningsgrad"
    ],
    faqs: [
      { 
        q: "Fixar ni akuta läckor i Uppsala?", 
        a: "Ja, ring oss direkt vid akuta läckor. Vi prioriterar nödfall och försöker komma ut samma dag." 
      },
      { 
        q: "Hjälper ni med intyg till försäkringsbolag?", 
        a: "Ja, vi dokumenterar alla vattenrelaterade skador och kan skriva intyg enligt försäkringsbolagens krav." 
      },
      {
        q: "Gör ni badrumsrenoveringar?",
        a: "Ja, vi gör kompletta badrumsrenoveringar inklusive VVS, kakel, golvvärme och ventilation. ROT-avdrag gäller."
      }
    ],
    cases: [
      { 
        title: "Byte av WC Gottsunda", 
        desc: "Demontering av gammal WC-stol, installation av ny med mjukstängande sits, test och bortforsling av gamla enheten." 
      },
      {
        title: "Akut läcka Luthagen",
        desc: "Snabb insats vid läckande blandare i kök, byte av packningar och kontroll av alla anslutningar."
      }
    ]
  },
  {
    service: "VVS",
    city: "Stockholm",
    slug: "vvs-stockholm",
    h1: "VVS-montör i Stockholm",
    title: "VVS i Stockholm – Rörmokare & Badrum | ROT 50%",
    description:
      "VVS-hjälp i Stockholm för blandare, WC, dusch, läckor och badrumsrenoveringar. Snabbt på plats och tydliga prisexempel. ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Kontakt & bokning", desc: "Ring oss för akuta läckor eller boka tid för planerade jobb. Svar inom 2h." },
      { step: 2, title: "Hembesök", desc: "Certifierad rörmokare kommer till dig i Stockholm med verktyg och vanliga reservdelar." },
      { step: 3, title: "Offert på plats", desc: "Vi bedömer jobbet och ger dig ett fast pris direkt. Inga dolda avgifter." },
      { step: 4, title: "Utförande", desc: "Vi utför arbetet snabbt och professionellt med kvalitetsmaterial." },
      { step: 5, title: "Test & dokumentation", desc: "Funktionstest och dokumentation ingår. Försäkringsintyg vid skador." }
    ],
    priceExamples: [
      { job: "Byte av blandare", price: "2 500 kr", duration: "1 timme" },
      { job: "Installation av WC-stol", price: "3 800 kr", duration: "2-3 timmar" },
      { job: "Akut läcka (jourtid)", price: "från 3 000 kr", duration: "1-2 timmar" },
      { job: "Badrumsrenovering liten", price: "från 95 000 kr", duration: "2-3 veckor" }
    ],
    quickFacts: [
      "Stockholm har Sveriges äldsta vattenledningsnät",
      "BRF-badrum kräver ofta fuktsäkerhetsprojektering",
      "Vattentryck i Stockholm varierar mellan 2-6 bar",
      "ROT-avdrag gäller upp till 50 000 kr per person och år",
      "Moderna duschblandare kan spara 30% vatten",
      "Stockholm vatten levererar 350 000 m³ dricksvatten per dag",
      "Äldre fastigheter i Stockholm har ofta blyrör som bör bytas",
      "BRF-renovering av stammar kostar typiskt 15 000-30 000 kr per lägenhet",
      "Vattentryck i Stockholm kan variera mellan 1,5 och 6 bar beroende på våning",
      "Läckor i stamledningar är vanligt i fastigheter byggda före 1980",
      "Försäkringsbolag kräver ofta dokumentation från certifierad VVS-montör",
      "Installationsbesiktning kostar 3 000-5 000 kr och rekommenderas efter större renoveringar"
    ],
    didYouKnow: [
      "Stockholms första vattenledning byggdes 1861 från Årsta sjön till Norr Mälarstrand",
      "Stockholm förlorar 12% av allt dricksvatten genom läckor i ledningsnätet - motsvarande 42 000 m³/dag",
      "En genomsnittlig lägenhet i Stockholm har 15 vattenpunkter (kranar, toaletter, tvättmaskin)",
      "Gamla Stans medeltida källare får ofta problem med grundvatten och kräver avancerad dränering",
      "Stambyte i en BRF kan öka lägenhetsvärdet med 5-8% direkt",
      "Stockholm använder värmeåtervinning från avloppsvatten som värmer 400 000 bostäder",
      "Vattenskador är den vanligaste försäkringsskadan i Stockholm - över 15 000 ärenden per år"
    ],
    faqs: [
      { 
        q: "Arbetar ni i BRF:er i Stockholm?", 
        a: "Ja, vi har stor erfarenhet av BRF-arbete. Vi bokar tid via styrelse eller förvaltare och följer husets rutiner." 
      },
      {
        q: "Kan ni hjälpa till vid vattenläcka från lägenhet ovan?",
        a: "Ja, vi kan göra akuta insatser för att begränsa skador och dokumentera för försäkringsärenden."
      }
    ],
    cases: [
      { 
        title: "Byte blandare Södermalm", 
        desc: "Installation av ny termostatblandare i dusch, kontroll av tätskikt och funktionsprov. Genomfört på 1 timme." 
      },
      {
        title: "Badrumsrenovering Vasastan",
        desc: "Total renovering av badrum i 60-talslägenhet med ny VVS, golvvärme och kakelsättning. ROT-avdrag tillämpades."
      }
    ]
  },

  // ========== SNICKARE ==========
  {
    service: "Snickare",
    city: "Uppsala",
    slug: "snickare-uppsala",
    h1: "Snickare i Uppsala",
    title: "Snickare i Uppsala – Kök, Garderober & Inredning | ROT 50%",
    description: "Erfarna snickare i Uppsala för köksmontering, platsbyggda garderober, lister och alla typer av snickeriarbeten. ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Planering", desc: "Berätta om ditt projekt. Vi bokar tid för mätning och diskussion om design och material." },
      { step: 2, title: "Mätning hemma", desc: "Vi kommer hem till dig i Uppsala för att mäta upp och diskutera lösningar." },
      { step: 3, title: "Offert & ritning", desc: "Du får en detaljerad offert med ritning och materialspecifikation." },
      { step: 4, title: "Beställning & produktion", desc: "Efter godkänt underlag beställs material och produktionen planeras." },
      { step: 5, title: "Montering & färdigställande", desc: "Erfaren snickare monterar och justerar. Du får ROT-avdrag på arbetskostnaden." }
    ],
    priceExamples: [
      { job: "IKEA-köksmontering 10 skåp", price: "18 000 kr", duration: "2-3 dagar" },
      { job: "Platsbyggd garderob 2 meter", price: "25 000 kr", duration: "3-4 dagar" },
      { job: "Montering av lister 50 m", price: "8 500 kr", duration: "1 dag" },
      { job: "Köksbänkskiva montering", price: "4 500 kr", duration: "3-4 timmar" }
    ],
    quickFacts: [
      "Uppsalas sekelskifteslägenheter har ofta kök från 60-70-talet",
      "Platsbyggt är ofta billigare än färdiga lösningar för sneda rum",
      "ROT-avdrag gäller montering men inte själva möblerna",
      "Köksbyte tar vanligtvis 2-4 dagar beroende på storlek",
      "Moderna kök ökar lägenhetsvärdet med upp till 10%",
      "Platsbyggda lösningar kan spara 30-40% jämfört med standardlösningar från stora kedjor",
      "Snickeriarbeten ska följa BFS 2011:6 - BBR (Boverkets Byggregler)",
      "Massivt trä ökar i värde över tid och håller i generationer",
      "Köksskåp från 60-70-talet innehåller ofta asbest i baksidor - ska hanteras av proffs",
      "Uppsala har många snickerier som kan specialtillverka komponenter",
      "Träfukt ska vara under 16% vid montering för att undvika sprickor",
      "Moderna MDF-skivor är stabilare än massivt trä men tål inte fukt lika bra"
    ],
    didYouKnow: [
      "Uppsala har en 400 år gammal snickeritradition kopplad till slottsbygget på 1500-talet",
      "En välbyggd platsbyggd garderob kan hålla i 50+ år - längre än byggnaden själv ibland",
      "IKEA-köksmontering tar en proffs 6-8 timmar - en oerfaren person kan behöva 20-30 timmar",
      "Gamla Uppsalahus från 1800-talet har ofta trädetaljer som kräver specialanpassad snickeri",
      "Listmontering runt fönster och dörrar förbättrar energieffektiviteten genom att täta springor",
      "Snickeriarbeten utomhus (altaner, plank) kräver impregnerat eller hyvlat tryckimpregnerat trä",
      "Moderna limträbalkar kan spänna över 12 meter utan mellanstöd - perfekt för öppna planlösningar"
    ],
    faqs: [
      { q: "Bygger ni platsbyggda garderober?", a: "Ja, vi bygger skräddarsydda garderober, bokhyllor och förvaringslösningar anpassade efter dina behov och utrymme." },
      { q: "Monterar ni IKEA-kök?", a: "Ja, vi monterar IKEA-kök och andra kökslösningar. Vi hanterar även vattenanslutningar och elinstallationer i samarbete med våra elektriker." },
      { q: "Hur lång tid tar ett köksmontage?", a: "Ett standardkök tar vanligtvis 2-4 dagar beroende på storlek och komplexitet. Vi ger en tydlig tidsplan innan start." }
    ],
    cases: [
      { title: "Platsbyggd bokhylla Luthagen", desc: "Bokhylla från golv till tak med integrerad belysning och skräddarsydda hyllplan. Målad i vit kulör för elegant look." },
      { title: "Köksrenovering Gottsunda", desc: "Komplett köksmontering med nya skåp, bänkskivor i laminat, kakel och installation av vitvaror." }
    ]
  },
  {
    service: "Snickare",
    city: "Stockholm",
    slug: "snickare-stockholm",
    h1: "Snickare i Stockholm",
    title: "Snickare i Stockholm – Kök, Garderober & Renovering | ROT 50%",
    description: "Professionella snickare i Stockholm för alla snickeriarbeten. ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Initial konsultation", desc: "Kontakta oss för att diskutera ditt projekt. Vi bokar tid för hembesök." },
      { step: 2, title: "Mätning & design", desc: "Snickare besöker dig i Stockholm för mätning och designdiskussion." },
      { step: 3, title: "Offert med ritning", desc: "Du får en detaljerad offert med 3D-ritning och materialförslag." },
      { step: 4, title: "Material & produktion", desc: "Vi beställer material och förbereder alla komponenter i verkstad." },
      { step: 5, title: "Installation & finish", desc: "Professionell montering på plats. Vi städar efter oss och ROT-avdrag ingår." }
    ],
    priceExamples: [
      { job: "IKEA-köksmontering 12 skåp", price: "22 000 kr", duration: "2-4 dagar" },
      { job: "Platsbyggd walk-in closet", price: "35 000 kr", duration: "4-5 dagar" },
      { job: "Montering av lister 60 m", price: "10 500 kr", duration: "1-2 dagar" },
      { job: "Altandörr + karm", price: "12 000 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "80% av Stockholms sekelskifteslägenheter har originaldetaljer att bevara",
      "BRF-arbete kräver ofta styrelsegodkännande innan start",
      "Stockholm har strängare bullerkrav - ljudisolering kan behövas",
      "ROT-avdrag gäller arbetskostnad men inte material",
      "Platsbyggda lösningar är perfekta för Stockholms sneda väggar",
      "Sekelskifteslägenheter har ofta 3,2 meter i takhöjd - perfekt för höga bokhyllor",
      "Parkettgolv i Stockholm är ofta 100+ år gamla och kan slipas många gånger",
      "Ljudisolering mellan rum kräver dubbelreglar med mineralull",
      "Platsbyggda hyllor kan utnyttja takvinklar och sneda väggar perfekt",
      "Måttsydda lösningar passar perfekt för Stockholms ojämna väggar",
      "Ekparkett kostar 800-1 500 kr/kvm inklusive slipning och lackering",
      "BRF-regler i Stockholm kräver ofta tillstånd för större ombyggnationer"
    ],
    didYouKnow: [
      "Gamla Stans hus från 1600-talet har timmerkonstruktioner som fortfarande är starka",
      "Stockholms sekelskifteslägenheter har ofta 3,2 meter i takhöjd - perfekt för höga bokhyllor",
      "Originaldetaljer från 1890-talet som dörrar och lister kan vara värda 50 000+ kr på auktion",
      "En genomsnittlig Stockholmslägenhet har 3-5 skeva väggar - platsbyggt är enda lösningen",
      "Sveriges första standardiserade kök byggdes i Stockholm 1922 - 'Stockholmsköket'",
      "Träpanel i sekelskifteshus är ofta av furu från Norrland - håller i 200+ år med rätt underhåll",
      "Snickare i Stockholm måste ofta hantera eldragning i gamla väggar med kanalisation"
    ],
    faqs: [
      { q: "Arbetar ni i BRF:er?", a: "Ja, vi har stor erfarenhet av BRF-arbete och följer husets rutiner för bokning, tillträde och städning." },
      { q: "Kan ni göra soundproof väggar?", a: "Ja, vi bygger ljudisolerade väggar med dubbelreglar och isolering för optimal ljuddämpning mellan rum eller lägenheter." }
    ],
    cases: [
      { title: "Garderob Vasastan", desc: "Platsbyggd walk-in closet med belysning, klädstänger och hyllsystem i sekelskifteslägenhet." },
      { title: "Köksmontage Östermalm", desc: "Montering av exklusivt kök med massivt trä, stenbänkskiva och integrerade vitvaror." }
    ]
  },

  // ========== MONTERING ==========
  {
    service: "Montering",
    city: "Uppsala",
    slug: "montering-uppsala",
    h1: "Montering i Uppsala",
    title: "Montering i Uppsala – IKEA-möbler, TV-fästen & Mer | ROT 50%",
    description: "Snabb och professionell montering i Uppsala. IKEA-möbler, vitvaror, TV-fästen. ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Bokning online/telefon", desc: "Berätta vad som ska monteras och när. Vi bokar tid som passar dig." },
      { step: 2, title: "Bekräftelse & förberedelse", desc: "Du får SMS-påminnelse och information om vad du behöver förbereda." },
      { step: 3, title: "Vi kommer hem till dig", desc: "Montör kommer med verktyg och kunnande. Ofta klart samma dag." },
      { step: 4, title: "Professionell montering", desc: "Vi monterar enligt tillverkarens instruktioner och testar allt." },
      { step: 5, title: "Städning & bortforsling", desc: "Vi städar och tar hand om emballage. ROT/RUT-avdrag inkluderat." }
    ],
    priceExamples: [
      { job: "TV-fäste på vägg", price: "1 200 kr", duration: "1 timme" },
      { job: "IKEA PAX-garderob 3 dörrar", price: "2 500 kr", duration: "2-3 timmar" },
      { job: "Köksmontage IKEA 8 skåp", price: "12 000 kr", duration: "1-2 dagar" },
      { job: "Säng + 2 nattduksbord", price: "1 800 kr", duration: "1,5 timmar" }
    ],
    quickFacts: [
      "IKEA-instruktioner är ofta otydliga - proffs gör jobbet 3x snabbare",
      "Felaktig montering kan göra möbler farliga - särskilt barnsäkring",
      "TV-fästen på betongvägg kräver specialborr och pluggar",
      "ROT/RUT-avdrag gäller monteringsarbete i hemmet",
      "Moderna möbler är ofta tyngre än äldre - rätt väggfäste är kritiskt",
      "Emballage från IKEA ska till återvinningen - vi tar hand om det",
      "PAX-garderober med spegeldörrar kräver noggrann vågrätjustering",
      "Vitvaror måste anslutas enligt tillverkarens instruktioner för garanti",
      "Felmontering av köksskåp kan orsaka vattenskador senare",
      "TV-montering kräver studsare för att hitta reglar i väggen",
      "IKEA-möbler från samma serie passar ofta inte exakt ihop - justering behövs",
      "Professionell montering sparar 4-6 timmar frustration för genomsnittlig IKEA-möbel"
    ],
    didYouKnow: [
      "IKEA-möbler kommer med 19 000 olika skruvar och beslag - lätt att blanda ihop",
      "En felaktigt monterad bokhylla kan rasa och orsaka skador på 50 000+ kr",
      "Uppsala har Sveriges högsta andel IKEA-möbler per capita efter Stockholm",
      "Genomsnittlig IKEA-kund spenderar 4-6 timmar på montering - proffs gör samma jobb på 1-2 timmar",
      "TV-fästen på gipsväggar kräver specialfästen som klarar 50+ kg",
      "IKEA-kök har 45 olika delar per skåp i genomsnitt",
      "Felaktig montering av vitvaror kan orsaka vattenskador som inte täcks av försäkring"
    ],
    faqs: [
      { q: "Monterar ni IKEA-möbler samma dag?", a: "Ja, för mindre monteringsjobb kan vi ofta komma samma dag. Kontakta oss för aktuell tillgänglighet." },
      { q: "Tar ni hand om emballage?", a: "Ja, vi tar med oss alla kartonger och emballage och ser till att det lämnas på återvinningsstation." },
      { q: "Monterar ni vitvaror?", a: "Ja, vi monterar vitvaror som ugnar, diskmaskin, kylskåp och ansluter dem enligt tillverkarens specifikationer." }
    ],
    cases: [
      { title: "PAX-garderob 4 dörrar Luthagen", desc: "Montering av stor PAX-garderob med spegeldörrar, inredning och belysning. Klart på 3 timmar." },
      { title: "Köksmontage IKEA Gottsunda", desc: "Montering av komplett IKEA-kök med skåp, bänkskivor och installation av spis och fläkt." }
    ]
  },
  {
    service: "Montering",
    city: "Stockholm",
    slug: "montering-stockholm",
    h1: "Montering i Stockholm",
    title: "Montering i Stockholm – IKEA, Vitvaror & Fästen | ROT 50%",
    description: "Professionell monteringshjälp i Stockholm. IKEA-möbler, vitvaror och fästen. ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Bokning online/telefon", desc: "Berätta vad som ska monteras och när. Vi bokar tid som passar dig." },
      { step: 2, title: "Bekräftelse & förberedelse", desc: "Du får SMS-påminnelse och information om vad du behöver förbereda." },
      { step: 3, title: "Vi kommer hem till dig", desc: "Montör kommer med verktyg och kunnande. Ofta klart samma dag." },
      { step: 4, title: "Professionell montering", desc: "Vi monterar enligt tillverkarens instruktioner och testar allt." },
      { step: 5, title: "Städning & bortforsling", desc: "Vi städar och tar hand om emballage. ROT/RUT-avdrag inkluderat." }
    ],
    priceExamples: [
      { job: "TV-fäste på vägg", price: "1 400 kr", duration: "1 timme" },
      { job: "IKEA PAX-garderob 3 dörrar", price: "2 800 kr", duration: "2-3 timmar" },
      { job: "Köksmontage IKEA 8 skåp", price: "14 000 kr", duration: "1-2 dagar" },
      { job: "Säng + 2 nattduksbord", price: "2 000 kr", duration: "1,5 timmar" }
    ],
    quickFacts: [
      "IKEA-instruktioner är ofta otydliga - proffs gör jobbet 3x snabbare",
      "Felaktig montering kan göra möbler farliga - särskilt barnsäkring",
      "TV-fästen på betongvägg kräver specialborr och pluggar",
      "ROT/RUT-avdrag gäller monteringsarbete i hemmet",
      "Moderna möbler är ofta tyngre än äldre - rätt väggfäste är kritiskt",
      "Emballage från IKEA ska till återvinningen - vi tar hand om det",
      "PAX-garderober med spegeldörrar kräver noggrann vågrätjustering",
      "Sekelskifteslägenheter har ofta betongväggar som kräver slagborr",
      "Stockholm har strängare bullerkrav - monteringar efter 18.00 kan störa grannar",
      "BRF-regler kan begränsa vad som får monteras - kontrollera innan",
      "Gamla Stans smala trapphus kräver ofta demontering av stora möbler för transport",
      "TV-montering i Stockholm kostar ofta mer på grund av betongväggar"
    ],
    didYouKnow: [
      "Stockholms tightaste utrymmen är i Gamla Stan - montering kräver ofta specialverktyg",
      "Sekelskifteslägenheter har ofta ojämna golv - möbler behöver justeras noggrannt",
      "IKEA Kungens Kurva säljer 2,5 miljoner Billy-bokhyllor per år",
      "En felaktigt monterad spegel kan falla och orsaka skador - alltid säkra tunga föremål",
      "Betongväggar i nybyggen i Stockholm kräver slagborr - vanlig borr funkar inte",
      "Stockholm har flest hyreslägenheter där BRF-regler kan begränsa monteringar",
      "Genomsnittlig Stockholmare monterar 3-4 IKEA-möbler per år"
    ],
    faqs: [
      { q: "Kan ni hämta möbler från IKEA?", a: "Ja, vi kan hämta möbler från IKEA Kungens Kurva eller Barkarby och leverera direkt till dig för montering." },
      { q: "Arbetar ni på kvällar?", a: "Ja, vi erbjuder kvällstider för de som behöver monteringshjälp efter kontorstid. Boka i förväg för bästa tid." }
    ],
    cases: [
      { title: "TV-vägg Södermalm", desc: "Montering av 65\" TV påvägg med dold kabelföring och soundbar. Snyggt och stabilt resultat." },
      { title: "Kontorsmöbler Kungsholmen", desc: "Montering av skrivbord, stolar och förvaringsskåp för hemmakontor." }
    ]
  },

  // ========== TRÄDGÅRD ==========
  {
    service: "Trädgård",
    city: "Uppsala",
    slug: "tradgard-uppsala",
    h1: "Trädgårdstjänster i Uppsala",
    title: "Trädgård i Uppsala – Gräsklippning, Häckar & Plantering | RUT 50%",
    description: "Trädgårdshjälp i Uppsala. Gräsklippning, häckklippning, ogräsrensning och plantering. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Beskriv ditt trädgårdsbehov", desc: "Gräsklippning, häck, plantering? Ring eller fyll i formulär online." },
      { step: 2, title: "Offert & schemaläggning", desc: "Vi bedömer arbetet och ger fast pris. Regelbundet eller engångsjobb." },
      { step: 3, title: "Vi kommer med utrustning", desc: "Proffs med gräsklippare, häcksax och trädgårdssäckar." },
      { step: 4, title: "Professionell trädgårdsskötsel", desc: "Vi klipper, rensar och planerar enligt säsong." },
      { step: 5, title: "Bortforsling & RUT-avdrag", desc: "Vi tar hand om trädgårdsavfall. RUT 50% ingår." }
    ],
    priceExamples: [
      { job: "Gräsklippning 300 kvm", price: "800 kr", duration: "1 timme" },
      { job: "Häckklippning 20 meter", price: "1 500 kr", duration: "2 timmar" },
      { job: "Ogräsrensning rabatter", price: "600 kr/timme", duration: "2-4 timmar" },
      { job: "Plantering 10 buskar", price: "2 200 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Uppsalas lera kräver kompost för bättre dränering",
      "Gräsklippning april-oktober rekommenderas varannan vecka",
      "Häckar ska klippas 2 gånger per år - juni och augusti",
      "RUT-avdrag gäller trädgårdsskötsel på tomten",
      "Mulchning sparar vatten och minskar ogräs",
      "Uppsala har kyligare nätter än Stockholm - vissa växter trivs sämre",
      "Kompostering minskar trädgårdsavfall med 50%",
      "Gräsmattor i Uppsala behöver kalkgödsling på grund av sur jord",
      "Snöskottning ingår inte i RUT-avdrag men snöröjning gör det",
      "Trädgårdsavfall kan lämnas på Rosendals återvinningscentral",
      "Bevattning av gräsmattan bör göras tidigt på morgonen för bäst effekt",
      "Plantering bör göras i maj eller september i Uppsala"
    ],
    didYouKnow: [
      "Uppsala botaniska trädgård grundades 1655 - en av världens äldsta",
      "Uppsalas leriga jord är perfekt för äppelträd - staden hade 10 000+ äppelträd på 1800-talet",
      "Gräsklippning på rätt höjd (5-6 cm) gör gräsmattan tätare och grönare",
      "En trädgård i Uppsala behöver 30-40 liter vatten per kvm under torr sommar",
      "Häckar av thuja växer 30-40 cm per år och behöver regelbunden klippning",
      "Uppsala har 15 000+ privata trädgårdar som kräver regelbunden skötsel",
      "Rätt tid för plantering i Uppsala är maj (efter sista frosten) och september"
    ],
    faqs: [
      { q: "Hur ofta klipps gräset?", a: "Vi rekommenderar gräsklippning var 7-10 dag under högsäsong. Vi kan sätta upp regelbundna besök efter ditt schema." },
      { q: "Tar ni med utrustning?", a: "Ja, vi tar med all nödvändig utrustning som gräsklippare, häcksax, kratta och trädgårdssäckar." },
      { q: "Gör ni snöskottning vintertid?", a: "Ja, vi erbjuder snöskottning av uppfarter, gångvägar och trappor under vintersäsongen." }
    ],
    cases: [
      { title: "Regelbunden trädgårdsskötsel Svartbäcken", desc: "Gräsklippning varannan vecka, häckklippning 2 ggr/år och ogräsrensning i rabatter." },
      { title: "Häckbeskärning Luthagen", desc: "Beskärning av 30 meter thujahaeck med formklippning och bortforsling av grenar." }
    ]
  },
  {
    service: "Trädgård",
    city: "Stockholm",
    slug: "tradgard-stockholm",
    h1: "Trädgårdstjänster i Stockholm",
    title: "Trädgård i Stockholm – Gräs, Häckar & Plantering | RUT 50%",
    description: "Professionell trädgårdshjälp i Stockholm. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Beskriv ditt trädgårdsbehov", desc: "Gräsklippning, häck, plantering? Ring eller fyll i formulär online." },
      { step: 2, title: "Offert & schemaläggning", desc: "Vi bedömer arbetet och ger fast pris. Regelbundet eller engångsjobb." },
      { step: 3, title: "Vi kommer med utrustning", desc: "Proffs med gräsklippare, häcksax och trädgårdssäckar." },
      { step: 4, title: "Professionell trädgårdsskötsel", desc: "Vi klipper, rensar och planerar enligt säsong." },
      { step: 5, title: "Bortforsling & RUT-avdrag", desc: "Vi tar hand om trädgårdsavfall. RUT 50% ingår." }
    ],
    priceExamples: [
      { job: "Gräsklippning 300 kvm", price: "950 kr", duration: "1 timme" },
      { job: "Häckklippning 20 meter", price: "1 800 kr", duration: "2 timmar" },
      { job: "Ogräsrensning rabatter", price: "700 kr/timme", duration: "2-4 timmar" },
      { job: "Plantering 10 buskar", price: "2 500 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Stockholms innerstad har över 1 000 innergårdar som kräver professionell skötsel",
      "BRF-trädgårdar kräver ofta kollektivt godkännande för större förändringar",
      "RUT-avdrag gäller trädgårdsskötsel på fastigheten",
      "Takträdgårdar blir allt vanligare i Stockholm",
      "Häckar ska klippas 2 gånger per år för optimal form",
      "Gräsklippning varje vecka under högsäsong rekommenderas",
      "Stockholm har 300 soliga dagar per år - perfekt för rosor",
      "Bevattning bör göras tidigt på morgonen eller sent på kvällen",
      "Kompostering minskar trädgårdsavfall och ger bättre jord",
      "Plantering bör göras i maj eller september i Stockholm",
      "Snöskottning ingår inte i RUT-avdrag men snöröjning gör det",
      "Trädgårdsavfall kan lämnas på Stockholms återvinningscentraler"
    ],
    didYouKnow: [
      "Stockholms innerstad har över 1 000 innergårdar som kräver professionell trädgårdsskötsel",
      "Takträdgårdar i Stockholm kan minska temperaturen inomhus med 5 grader på sommaren",
      "Stockholm har Sveriges högsta andel gräsmattor per capita i innerstaden",
      "En välskött trädgård kan öka fastighetsvärdet med 5-10% i Stockholmsområdet",
      "Gräsklippning 1 gång för lite kan göra gräsmattan gul och torr - regelbundenhet är nyckeln",
      "Stockholm har 300 soliga dagar per år - perfekt för rosor och perenna plantor",
      "BRF-trädgårdar i Stockholm kräver ofta kollektivt godkännande för större förändringar"
    ],
    faqs: [
      { q: "Arbetar ni i BRF-trädgårdar?", a: "Ja, vi har avtal med flera BRF:er för regelbunden trädgårdsskötsel av gemensamma ytor." },
      { q: "Kan ni sköta takträdgårdar?", a: "Ja, vi har erfarenhet av takträdgårdar och terrasser inklusive bevattning, plantering och underhåll." }
    ],
    cases: [
      { title: "Takträdgård Södermalm", desc: "Skötsel av takträdgård med automatisk bevattning, växtplantering och säsongsväxlingar." },
      { title: "BRF-trädgård Vasastan", desc: "Regelbunden skötsel av BRF-innergård med gräsklippning, buskar och blomrabatter." }
    ]
  },

  // ========== STÄD ==========
  {
    service: "Städ",
    city: "Uppsala",
    slug: "stad-uppsala",
    h1: "Städtjänster i Uppsala",
    title: "Städning i Uppsala – Hemstäd, Flyttstäd & Byggstäd | RUT 50%",
    description: "Professionell städning i Uppsala. Hemstäd, flyttstäd och byggstäd. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Berätta om städbehov", desc: "Hemstäd, flyttstäd, byggstäd? Storlek och önskemål." },
      { step: 2, title: "Offert direkt", desc: "Fast pris baserat på typ av städning och storlek. Inga dolda avgifter." },
      { step: 3, title: "Bokning av tid", desc: "Välj datum som passar dig. Vi kommer med allt städmaterial." },
      { step: 4, title: "Professionell städning", desc: "Certifierade städare med kvalitetsprodukter städar enligt checklista." },
      { step: 5, title: "Kontroll & garanti", desc: "Vi kontrollerar resultatet. Flyttstäd har besiktningsgaranti." }
    ],
    priceExamples: [
      { job: "Hemstäd 60 kvm", price: "1 200 kr", duration: "2 timmar" },
      { job: "Flyttstäd 2:a", price: "3 500 kr", duration: "4 timmar" },
      { job: "Byggstäd efter badrum", price: "2 800 kr", duration: "3 timmar" },
      { job: "Fönsterputs 10 fönster", price: "1 500 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Flyttstäd ska följa Svensk Fastighetsförmedlings checklista för godkänd besiktning",
      "Byggstäd efter renovering är kritiskt för att undvika dammspridning",
      "RUT-avdrag gäller hemstäd, flyttstäd och fönsterputsning",
      "Professionella städare städar 50% snabbare än privatpersoner",
      "Miljövänliga produkter är lika effektiva som traditionella",
      "Uppsala har över 50 000 hushåll som använder städtjänster regelbundet",
      "Fönsterputs 2 gånger per år rekommenderas för bästa ljusinsläpp",
      "Flyttstäd tar vanligtvis 3-6 timmar för en 3:a",
      "Byggstäd ska göras direkt efter renovering för att undvika permanent smuts",
      "Hemstäd varannan vecka är vanligast i Uppsala",
      "Allergiker rekommenderas använda miljömärkta städprodukter",
      "Professionell städning sparar 4-6 timmar per tillfälle"
    ],
    didYouKnow: [
      "Svenskar städar i genomsnitt 3,5 timmar per vecka - motsvarande 7 arbetsveckor per år",
      "Dåligt städad bostad kan innehålla 200 bakteriearter på kök sytor",
      "Flyttstäd som inte godkänns kan kosta 10 000+ kr i efterarbete och försenade inflyttningar",
      "Uppsala har Sveriges tredje högsta användning av städtjänster per capita",
      "Fönsterputsning kan öka ljusinsläppet med 30% - sparar elkostnad för belysning",
      "Byggdamm efter renovering kan orsaka allergi och andningsbesvär i flera månader",
      "Professionella städare använder 4-stegs metod som är 10x effektivare än vanlig städning"
    ],
    faqs: [
      { q: "Tar ni med städmaterial?", a: "Ja, vi tar med allt professionellt städmaterial och utrustning. Miljövänliga produkter används." },
      { q: "Gör ni flyttstäd med besiktning?", a: "Ja, vi gör flyttstäd enligt Svensk Fastighetsförmedlings checklista och garanterar godkänd besiktning." },
      { q: "Kan ni städa samma dag?", a: "För akuta städbehov försöker vi alltid hitta en lösning. Kontakta oss för dagens tillgänglighet." }
    ],
    cases: [
      { title: "Flyttstäd med godkänd besiktning Luthagen", desc: "Komplett flyttstäd av 3:a med rengöring av kök, badrum, fönster och alla ytor. Besiktning godkänd utan anmärkning." },
      { title: "Byggstäd efter renovering Gottsunda", desc: "Grundlig städning efter badrumrenovering med dammsugning, avtorkning och fönsterputsning." }
    ]
  },
  {
    service: "Städ",
    city: "Stockholm",
    slug: "stad-stockholm",
    h1: "Städtjänster i Stockholm",
    title: "Städning i Stockholm – Hem, Flytt & Kontor | RUT 50%",
    description: "Professionella städtjänster i Stockholm. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Berätta om städbehov", desc: "Hemstäd, flyttstäd, byggstäd? Storlek och önskemål." },
      { step: 2, title: "Offert direkt", desc: "Fast pris baserat på typ av städning och storlek. Inga dolda avgifter." },
      { step: 3, title: "Bokning av tid", desc: "Välj datum som passar dig. Vi kommer med allt städmaterial." },
      { step: 4, title: "Professionell städning", desc: "Certifierade städare med kvalitetsprodukter städar enligt checklista." },
      { step: 5, title: "Kontroll & garanti", desc: "Vi kontrollerar resultatet. Flyttstäd har besiktningsgaranti." }
    ],
    priceExamples: [
      { job: "Hemstäd 60 kvm", price: "1 400 kr", duration: "2 timmar" },
      { job: "Flyttstäd 2:a", price: "4 200 kr", duration: "4 timmar" },
      { job: "Byggstäd efter badrum", price: "3 200 kr", duration: "3 timmar" },
      { job: "Fönsterputs 10 fönster", price: "1 800 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Stockholm har Sveriges högsta andel hushåll som använder regelbunden städtjänst - 35%",
      "Flyttstäd ska följa Svensk Fastighetsförmedlings checklista",
      "RUT-avdrag ger 50% rabatt på arbetskostnaden (max 75 000 kr/år)",
      "Professionella städare städar 50% snabbare än privatpersoner",
      "Miljövänliga produkter rekommenderas för innerstadslägenheter",
      "BRF-trapphus i Stockholm städas ofta 1 gång per vecka",
      "Fönsterputs 2 gånger per år rekommenderas för bästa ljusinsläpp",
      "Kontorsstäd görs ofta efter kontorstid för att inte störa",
      "Flyttstäd i Stockholm kostar i genomsnitt 5 000 kr för en 3:a",
      "Byggstäd ska göras direkt efter renovering",
      "Hemstäd varannan vecka är vanligast i Stockholm",
      "Sekelskifteslägenheter kräver extra noggrann städning av stuckaturer"
    ],
    didYouKnow: [
      "Stockholm har Sveriges högsta andel hushåll som använder regelbunden städtjänst - 35%",
      "En genomsnittlig lägenhet i Stockholm har 200 000 damm partiklar per kubikdecimeter",
      "Städning med fel produkter på parkett kan orsaka skador för 50 000+ kr",
      "BRF-trapphus i Stockholm städas ofta 1 gång per vecka av professionella städare",
      "Flyttstäd i Stockholm kostar i genomsnitt 5 000 kr för en 3:a",
      "Stockholms torra inomhusklimat gör att damm sprids snabbare än i andra städer",
      "Kontorsstäd i Stockholm sker ofta kl 18-22 för att inte störa arbetet"
    ],
    faqs: [
      { q: "Städar ni kontor?", a: "Ja, vi städar kontor både engångsstädning och regelbundna städavtal. Vi arbetar efter kontorstid för minimal störning." },
      { q: "Gör ni fönsterputs?", a: "Ja, vi erbjuder fönsterputsning både in- och utvändigt för lägenheter upp till 3:e våningen." },
      { q: "Kan ni komma på kvällar?", a: "Ja, vi erbjuder kvällstider för de som behöver städning efter kontorstid. Boka i förväg." }
    ],
    cases: [
      { title: "Kontorsstäd Vasastan", desc: "Regelbunden städning av kontorslokal 200 kvm, 2 gånger per vecka inklusive kök och konferensrum." },
      { title: "Flyttstäd lägenhet Södermalm", desc: "Flyttstäd av 2:a med fönsterputs, rengöring av vitvaror och besiktningsgaranti." }
    ]
  },

  // ========== MARKARBETEN ==========
  {
    service: "Markarbeten",
    city: "Uppsala",
    slug: "markarbeten-uppsala",
    h1: "Markarbeten i Uppsala",
    title: "Markarbeten i Uppsala – Dränering, Grävning & Plattläggning | ROT 50%",
    description: "Professionella markarbeten i Uppsala. Dränering, schaktning, planering och plattläggning. ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Beskriv ditt markprojekt", desc: "Dränering, plattläggning, schakt? Vi bokar tid för platsbesök." },
      { step: 2, title: "Platsbesök & mätning", desc: "Vi bedömer mark, lutning och behov av förberedande arbete." },
      { step: 3, title: "Detaljerad offert", desc: "Du får offert med materialspecifikation och tidsplan." },
      { step: 4, title: "Utförande med maskiner", desc: "Vi schaktar, dränerar och planerar med rätt utrustning." },
      { step: 5, title: "Färdigställande & dokumentation", desc: "Slutbesiktning och garanti. ROT-avdrag ingår." }
    ],
    priceExamples: [
      { job: "Dränering 20 meter", price: "28 000 kr", duration: "2 dagar" },
      { job: "Plattläggning 30 kvm", price: "45 000 kr", duration: "3-4 dagar" },
      { job: "Schakt för altan 15 kvm", price: "12 000 kr", duration: "1 dag" },
      { job: "Kantsten 10 meter", price: "8 500 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "Uppsalas lerjord kräver ofta mer dränering än sandig jord",
      "Markarbeten kräver ofta bygglov för större projekt",
      "Dränering runt hus förhindrar fuktskador i källare",
      "ROT-avdrag gäller markarbeten kopplade till fastigheten",
      "Plattor ska läggas på stabiliserad sandbädd för långlivad hållbarhet",
      "Uppsala kommun kräver VA-anmälan för koppling till dagvatten",
      "Markarbeten bör göras april-oktober när marken inte är frusen",
      "Dränering kan spara 100 000+ kr i framtida fuktskador",
      "Plattläggning kräver noggrann planering och lutning för vattenavrinning",
      "Schaktning djupare än 1 meter kräver ofta grävtillstånd",
      "Kantsten ger stabilitet och förhindrar att plattor förskjuts",
      "Uppsalas lerjord kräver extra förberedelse innan plattläggning"
    ],
    didYouKnow: [
      "Uppsalas höga lerinnehåll i jorden orsakar fuktproblem i 60% av alla källare",
      "Dränering kan minska fuktproblem med 90% och spara 100 000+ kr i framtida skador",
      "Schaktning till 1 meters djup kräver ofta grävtillstånd från Uppsala kommun",
      "Markarbeten i Uppsala påverkas starkt av frost - arbeten under vinter undviks",
      "Äldre fastigheter i Uppsala (före 1960) saknar ofta dränering helt",
      "Plattläggning i Uppsala kräver 15 cm sandbädd på grund av lerjorden",
      "Uppsala har över 500 mm nederbörd per år - bra dränering är kritiskt"
    ],
    faqs: [
      { q: "Gör ni dränering?", a: "Ja, vi installerar dränering runt hus och fastigheter för att förhindra fuktproblem och läckage i källare." },
      { q: "Kan ni schakta för altan?", a: "Ja, vi gräver och planerar marken inför altanbygge, inklusive kantsten och dränering vid behov." },
      { q: "Lägger ni plattor?", a: "Ja, vi lägger markplattor, natursten och klinkers för uppfarter, gångvägar och uteplatser." }
    ],
    cases: [
      { title: "Dränering villa Svartbäcken", desc: "Installation av dränering runt villa, 30 meter rör med dräneringsmassa och uppkoppling till dagvatten." },
      { title: "Uppfartsplattläggning Luthagen", desc: "Schaktning och plattläggning av biluppfart 40 kvm med kantsten och stabiliserad sandbädd." }
    ]
  },
  {
    service: "Markarbeten",
    city: "Stockholm",
    slug: "markarbeten-stockholm",
    h1: "Markarbeten i Stockholm",
    title: "Markarbeten i Stockholm – Schakt, Dränering & Plattor | ROT 50%",
    description: "Markarbeten i Stockholm med ROT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Beskriv ditt markprojekt", desc: "Dränering, plattläggning, schakt? Vi bokar tid för platsbesök." },
      { step: 2, title: "Platsbesök & mätning", desc: "Vi bedömer mark, lutning och behov av förberedande arbete." },
      { step: 3, title: "Detaljerad offert", desc: "Du får offert med materialspecifikation och tidsplan." },
      { step: 4, title: "Utförande med maskiner", desc: "Vi schaktar, dränerar och planerar med rätt utrustning." },
      { step: 5, title: "Färdigställande & dokumentation", desc: "Slutbesiktning och garanti. ROT-avdrag ingår." }
    ],
    priceExamples: [
      { job: "Dränering 20 meter", price: "32 000 kr", duration: "2 dagar" },
      { job: "Plattläggning 30 kvm", price: "52 000 kr", duration: "3-4 dagar" },
      { job: "Schakt för altan 15 kvm", price: "14 000 kr", duration: "1 dag" },
      { job: "Kantsten 10 meter", price: "10 000 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "Stockholm är byggt på lera och morän - markarbeten är ofta komplexa",
      "Innergårdar kräver ofta handschaktning på grund av begränsat utrymme",
      "ROT-avdrag gäller markarbeten kopplade till fastigheten",
      "Dränering runt hus förhindrar fuktskador i källare",
      "Plattläggning kräver noggrann lutning för vattenavrinning",
      "Stockholm kommun kräver ofta bokning av lastzon för markarbeten",
      "Markarbeten bör göras april-oktober när marken inte är frusen",
      "Schaktning kan stöta på fornlämningar - arkeologisk undersökning krävs ibland",
      "BRF-innergårdar kräver ofta styrelsegodkännande",
      "Dränering kan öka fastighetsvärdet med 5-10%",
      "Kantsten förhindrar att plattor förskjuts över tid",
      "Stockholms markarbeten kostar ofta 20% mer än i andra städer"
    ],
    didYouKnow: [
      "Stockholm är byggt på lera och morän - markarbeten är ofta komplexa",
      "Gamla Stans medeltida hus har ofta dränering från 1600-talet som fortfarande fungerar",
      "Schaktning i Stockholm kan stöta på fornlämningar - arkeologisk undersökning krävs ibland",
      "Markarbeten i Stockholm kräver ofta bokning av lastzon 4 veckor i förväg",
      "Stockholms kommuner har olika regler för markarbeten - kolla lokala föreskrifter",
      "Plattläggning på Södermalm kräver ofta bergsprängning - mycket dyrare än på andra platser",
      "Dränering runt sekelskiftesfastigheter i Stockholm kan öka värdet med 200 000+ kr"
    ],
    faqs: [
      { q: "Kan ni arbeta i innergårdar?", a: "Ja, vi har erfarenhet av arbete i innergårdar med begränsat utrymme och tar hänsyn till grannar och tillgänglighet." },
      { q: "Gör ni markberedning för pool?", a: "Ja, vi gräver och förbereder mark för poolinstallation inklusive planering och stabilisering." }
    ],
    cases: [
      { title: "Trädgårdsplattläggning Östermalm", desc: "Uteplats 25 kvm med natursten, dränering och kantsten i innergård." }
    ]
  },

  // ========== TEKNISKA INSTALLATIONER ==========
  {
    service: "Tekniska installationer",
    city: "Uppsala",
    slug: "tekniska-installationer-uppsala",
    h1: "Tekniska installationer i Uppsala",
    title: "Tekniska installationer i Uppsala – Nätverk, Larm & IT",
    description: "Nätverksinstallation, larm och IT-support i Uppsala.",
    howItWorks: [
      { step: 1, title: "Beskriv din tekniska installation", desc: "Nätverk, larm, kameror? Telefon eller online-bokning." },
      { step: 2, title: "Platsbesök & analys", desc: "Tekniker besöker för att bedöma behov och befintlig infrastruktur." },
      { step: 3, title: "Lösningsförslag & offert", desc: "Vi föreslår bästa lösning med utrustning och kostnad." },
      { step: 4, title: "Installation & konfiguration", desc: "Certifierad tekniker installerar och testar allt." },
      { step: 5, title: "Utbildning & dokumentation", desc: "Du får instruktioner och dokumentation för systemet." }
    ],
    priceExamples: [
      { job: "Nätverksinstallation 5 punkter", price: "8 500 kr", duration: "1 dag" },
      { job: "Larm villa med 8 sensorer", price: "12 000 kr", duration: "1 dag" },
      { job: "Wifi-mesh 3 accesspunkter", price: "6 500 kr", duration: "0,5 dag" },
      { job: "Kamerasystem 4 kameror", price: "15 000 kr", duration: "1-2 dagar" }
    ],
    quickFacts: [
      "Nätverkskablar ska vara Cat6 eller bättre för framtidssäkring",
      "Wifi-täckning i Uppsala påverkas av tjocka tegelväggar",
      "Larmsystem kräver abonnemang hos larmcentral (200-400 kr/mån)",
      "Kameror med molnlagring kostar 50-150 kr/mån per kamera",
      "ROT-avdrag gäller inte för tekniska installationer (undantag: belysningsstyrning)",
      "Uppsala har god 4G/5G-täckning för backup-lösningar",
      "Wifi-mesh är bättre än repeaters för stora hus",
      "Nätverksinstallation ökar fastighetsvärdet med 1-3%",
      "Smart home-integration kan spara 15% på elräkningen",
      "Uppsala har 5 000+ smarta hem med automation",
      "Kamerasystem kräver GDPR-compliance vid utomhusinstallation",
      "Säkerhetssystem med app-styrning ökar tryggheten"
    ],
    didYouKnow: [
      "Uppsala universitet har Sveriges snabbaste forskningsnätverk - 100 Gbit/s",
      "En genomsnittlig villa i Uppsala har 25 uppkopplade enheter (IoT)",
      "Wifi i betongväggar tappar 60% styrka jämfört med träväggar",
      "Larmsystem minskar inbrottsrisken med 90% enligt Folksam",
      "Kamerasystem i Uppsala måste följa Datainspektionens regler för integritet",
      "Cat6-kablar kan leverera 10 Gbit/s över 55 meter - mycket snabbare än wifi",
      "Smart home-automation i Uppsala växer med 30% per år"
    ],
    faqs: [
      { q: "Installerar ni nätverk?", a: "Ja, vi drar nätverkskablar, installerar routrar, switches och wifi-accesspunkter för hemma och kontor." },
      { q: "Kan ni sätta upp larm?", a: "Ja, vi installerar och programmerar larmsystem för villor, lägenheter och företag." },
      { q: "Gör ni IT-support?", a: "Ja, vi hjälper till med datorproblem, nätverksinställningar och installation av programvara." }
    ],
    cases: [
      { title: "Nätverksinstallation kontor Gottsunda", desc: "Dragning av Cat6-kablar till 12 arbetsstationer, installation av rack och konfiguration av nätverk." },
      { title: "Larminstallation villa Svartbäcken", desc: "Installation av trådlöst larmsystem med rörelsesensorer, dörrkontakter och app-styrning." }
    ]
  },
  {
    service: "Tekniska installationer",
    city: "Stockholm",
    slug: "tekniska-installationer-stockholm",
    h1: "Tekniska installationer i Stockholm",
    title: "Tekniska installationer i Stockholm – Nätverk & Larm",
    description: "Professionella tekniska installationer i Stockholm.",
    howItWorks: [
      { step: 1, title: "Beskriv din tekniska installation", desc: "Nätverk, larm, kameror? Telefon eller online-bokning." },
      { step: 2, title: "Platsbesök & analys", desc: "Tekniker besöker för att bedöma behov och befintlig infrastruktur." },
      { step: 3, title: "Lösningsförslag & offert", desc: "Vi föreslår bästa lösning med utrustning och kostnad." },
      { step: 4, title: "Installation & konfiguration", desc: "Certifierad tekniker installerar och testar allt." },
      { step: 5, title: "Utbildning & dokumentation", desc: "Du får instruktioner och dokumentation för systemet." }
    ],
    priceExamples: [
      { job: "Nätverksinstallation 5 punkter", price: "10 000 kr", duration: "1 dag" },
      { job: "Larm villa med 8 sensorer", price: "14 000 kr", duration: "1 dag" },
      { job: "Wifi-mesh 3 accesspunkter", price: "7 500 kr", duration: "0,5 dag" },
      { job: "Kamerasystem 4 kameror", price: "18 000 kr", duration: "1-2 dagar" }
    ],
    quickFacts: [
      "Stockholm har Sveriges bästa fiberinfrastruktur - 95% täckning",
      "Nätverksinstallation i BRF kräver ofta styrelsegodkännande",
      "Wifi i sekelskifteslägenheter påverkas av tjocka murarväggar",
      "Kamerasystem utomhus kräver tillstånd från byggnadsnämnden",
      "Larmsystem med rörelsedetektorer rekommenderas för Stockholms lägenheter",
      "Tekniska installationer i Stockholm måste följa BBR 2011:6",
      "Mesh-wifi täcker 300 kvm med 3 accesspunkter",
      "Cat7-kablar rekommenderas för framtidssäkra installationer",
      "Stockholm har 80 000+ smarta hem med automation",
      "Larm med kameraverifiering minskar falsklarm med 95%",
      "Nätverksinstallation i Stockholm kostar 20% mer än Uppsala",
      "GDPR kräver tydlig skyltning vid kameraövervakning"
    ],
    didYouKnow: [
      "Stockholm har Sveriges snabbaste hemanslutningar - upp till 10 Gbit/s fiber",
      "En genomsnittlig Stockholmslägenhet har 30+ uppkopplade enheter",
      "Wifi-störningar i Stockholm orsakas ofta av grannars nätverk - rätt kanal är kritiskt",
      "Stockholms polisstation använder samma larmcentraler som finns för privatpersoner",
      "Cat6-kabling i Stockholm ökar lägenhetsvärdet med 50 000+ kr",
      "Smart home i Stockholm kan spara 2 000-4 000 kr/år på el och värme",
      "Kamerasystem i Stockholm minskar inbrottsförsök med 85% enligt försäkringsbolag"
    ],
    faqs: [
      { q: "Arbetar ni med företag?", a: "Ja, vi har stor erfarenhet av företagsinstallationer inklusive nätverk, larmsystem och kamerasystem." },
      { q: "Installerar ni kamerasystem?", a: "Ja, vi installerar kamerasystem för övervakning av fastigheter och företag med molnlagring." }
    ],
    cases: [
      { title: "Kontorsnätverk Vasastan", desc: "Nätverksinstallation för nytt kontor med wifi-täckning, serverskåp och backup-lösning." }
    ]
  },

  // ========== FLYTT ==========
  {
    service: "Flytt",
    city: "Uppsala",
    slug: "flytt-uppsala",
    h1: "Flytthjälp i Uppsala",
    title: "Flytthjälp i Uppsala – Bärhjälp, Packning & Transport | RUT 50%",
    description: "Professionell flytthjälp i Uppsala. Bärhjälp, packning och transport. RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Berätta om din flytt", desc: "Storlek, distans, extra tjänster som packning? Ring eller boka online." },
      { step: 2, title: "Offert & inventering", desc: "Vi ger fast pris baserat på volym och distans. Platsbesök vid behov." },
      { step: 3, title: "Bokning & förberedelse", desc: "Vi bokar lastbil, personal och skyddsmaterial för flytten." },
      { step: 4, title: "Flyttdagen", desc: "Proffs bär, lastar och transporterar säkert. Vi skyddar trappor och väggar." },
      { step: 5, title: "Uppackning & RUT-avdrag", desc: "Vi packar upp vid behov. RUT 50% ingår i priset." }
    ],
    priceExamples: [
      { job: "Flytt 2:a (40 kvm) inom Uppsala", price: "6 500 kr", duration: "4 timmar" },
      { job: "Flytt 3:a med packning", price: "12 000 kr", duration: "1 dag" },
      { job: "Kontorsflytt 100 kvm", price: "18 000 kr", duration: "1 dag" },
      { job: "Pianoflytt", price: "4 500 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Flytt kräver bokning av flyttlastzon på trafikerade gator",
      "RUT-avdrag gäller 50% av arbetskostnaden för flytt",
      "Packning av glas och porslin ska göras med bubbelplast",
      "Piano kräver specialutrustning och 3 personer",
      "Flyttkartonger kostar 25-35 kr/st och kan återvinnas",
      "Uppsala har 8 000 flyttar per år i genomsnitt",
      "Flytt mellan våningar utan hiss kostar 30% mer",
      "Försäkring täcker skador under flytt - spara kvitton",
      "Flytt tar i genomsnitt 4-8 timmar för en 3:a",
      "Vinterflytt kräver extra skydd mot kyla och snö",
      "Bästa tiden för flytt i Uppsala är maj-september",
      "Kontorsflytt kräver ofta IT-flytt med specialkompetens"
    ],
    didYouKnow: [
      "Svenskar flyttar i genomsnitt 9 gånger under sitt liv",
      "Felaktig bärning av tunga föremål orsakar 3 000 arbetsskador per år i Sverige",
      "En 3:a i Uppsala har i genomsnitt 30 kubikmeter volym att flytta",
      "Flytt utan proffs tar 3x längre tid och riskerar skador på möbler",
      "Uppsala kommun kräver flytttillstånd för stora flyttbilar på vissa gator",
      "Piano kan väga 200-400 kg och kräver 3-4 personer för säker flytt",
      "Packningstid för en 3:a är 10-15 timmar för en person - proffs gör det på 4 timmar"
    ],
    faqs: [
      { q: "Har ni egen lastbil?", a: "Ja, vi har lastbilar i olika storlekar för allt från mindre lägenhetsflyttar till stora villor." },
      { q: "Packar ni också?", a: "Ja, vi erbjuder packhjälp med professionellt packmaterial och kan packa hela hushållet åt dig." },
      { q: "Flyttar ni möbler mellan våningar?", a: "Ja, vi har utrustning för tunga lyft och trappflyttar. Vi skyddar trappor och väggar under flytten." }
    ],
    cases: [
      { title: "Flytt lägenhet 3:a Luthagen", desc: "Komplett flytt med packning, transport och uppackning. Piano och stora möbler hanterades professionellt." },
      { title: "Kontorsflytt Gottsunda", desc: "Flytt av kontor med IT-utrustning, möbler och arkiv. Utförd på en helg för minimal driftstörning." }
    ]
  },
  {
    service: "Flytt",
    city: "Stockholm",
    slug: "flytt-stockholm",
    h1: "Flytthjälp i Stockholm",
    title: "Flytthjälp i Stockholm – Bärhjälp & Transport | RUT 50%",
    description: "Pålitlig flytthjälp i Stockholm med RUT-avdrag 50%.",
    howItWorks: [
      { step: 1, title: "Berätta om din flytt", desc: "Storlek, distans, extra tjänster som packning? Ring eller boka online." },
      { step: 2, title: "Offert & inventering", desc: "Vi ger fast pris baserat på volym och distans. Platsbesök vid behov." },
      { step: 3, title: "Bokning & förberedelse", desc: "Vi bokar lastbil, personal och skyddsmaterial för flytten." },
      { step: 4, title: "Flyttdagen", desc: "Proffs bär, lastar och transporterar säkert. Vi skyddar trappor och väggar." },
      { step: 5, title: "Uppackning & RUT-avdrag", desc: "Vi packar upp vid behov. RUT 50% ingår i priset." }
    ],
    priceExamples: [
      { job: "Flytt 2:a (40 kvm) inom Stockholm", price: "8 500 kr", duration: "4 timmar" },
      { job: "Flytt 3:a med packning", price: "15 000 kr", duration: "1 dag" },
      { job: "Kontorsflytt 100 kvm", price: "22 000 kr", duration: "1 dag" },
      { job: "Pianoflytt", price: "5 500 kr", duration: "2 timmar" }
    ],
    quickFacts: [
      "Stockholm har Sveriges högsta flytt densitet - 35 000 flyttar/år",
      "Lastzon måste bokas 2-4 veckor i förväg i innerstaden",
      "Flytt utan hiss i Gamla Stan kan kosta dubbelt så mycket",
      "RUT-avdrag ger 50% rabatt på arbetskostnad (max 75 000 kr/år)",
      "Sekelskifteslägenheter har ofta trånga trapphus - mät innan flytt",
      "Försäkring täcker skador upp till 100 000 kr vid professionell flytt",
      "Packmaterial kan återvinnas hos Stockholms återvinningscentraler",
      "Flytt mellan städer (Uppsala-Stockholm) tar 4-6 timmar",
      "Piano i Stockholm kostar 5 500-8 000 kr beroende på våning",
      "Flytt på sommaren är 20% dyrare på grund av högre efterfrågan",
      "Stockholm har 15 flyttfirmor med miljöcertifiering",
      "Kontorsflytt i Stockholm kräver ofta nattarbete för att inte störa verksamhet"
    ],
    didYouKnow: [
      "Stockholm har Sveriges smalaste gränd (Mårten Trotzigs gränd, 90 cm) - omöjlig för stora möbler",
      "Genomsnittlig Stockholmsflytt kostar 12 000 kr för en 3:a",
      "Gamla Stans trapphus från 1600-talet är ofta för smala för moderna möbler - behövs lyftkran",
      "En sekelskifteslägenhet i Stockholm har ofta dörrar som är 10 cm smalare än moderna standarder",
      "Flytt i Stockholm utan proffs kan ta 2-3 dagar för en familj",
      "Stockholms innerstad har parkeringsförbud på 90% av gatorna - lastzon är obligatorisk",
      "Pianoflytt i Stockholm använder ofta lyftkran för våningar över 3:e - kostar 15 000+ kr"
    ],
    faqs: [
      { q: "Kan ni flytta piano?", a: "Ja, vi har specialutrustning och erfarenhet av att flytta pianon och andra tunga instrument säkert." },
      { q: "Arbetar ni helger?", a: "Ja, vi erbjuder flytthjälp även på helger för de som behöver flytta då. Boka i god tid." },
      { q: "Har ni flyttkartonger?", a: "Ja, vi säljer och hyr ut flyttkartonger i olika storlekar samt packmaterial." }
    ],
    cases: [
      { title: "Lägenhetsflytt Södermalm", desc: "Flytt av 2:a från 4:e våning utan hiss. Allt hanterades smidigt med trappskydd och professionell utrustning." },
      { title: "Kontorsflytt Kungsholmen", desc: "Flytt av större kontor med servrar, skrivbord och kontorsinredning. Genomförd över en helg." }
    ]
  },

  // ========== MÅLERI - UPPSALA ==========
  {
    service: "Måleri",
    city: "Uppsala",
    slug: "malning-uppsala",
    h1: "Målare i Uppsala",
    title: "Målare i Uppsala – Målning, Tapetsering & Ytbehandling | ROT 30%",
    description: "Professionella målare i Uppsala för målning av rum, tak, fasad och tapetsering. Snabb start, ROT-avdrag 30%. Vi täcker hela Uppsala.",
    priceHint: "Från 450 kr/h",
    howItWorks: [
      { step: 1, title: "Kontakt & konsultation", desc: "Berätta om målningsprojekt. Rum, fasad, färgval? Vi bokar hembesök." },
      { step: 2, title: "Platsbesök & färgkonsultation", desc: "Målare bedömer yta, skick och behov. Hjälper med färgval." },
      { step: 3, title: "Offert med tidsplan", desc: "Fast pris med material och arbetskostnad. Tydlig tidsplan." },
      { step: 4, title: "Förberedelse & målning", desc: "Vi täcker golv, spackling, slipning, grundning och målning." },
      { step: 5, title: "Slutbesiktning & garanti", desc: "Kontroll och städning. Du får garanti och ROT-avdrag 30%." }
    ],
    priceExamples: [
      { job: "Målning rum 15 kvm", price: "6 500 kr", duration: "1 dag" },
      { job: "Målning kök inkl. luckor", price: "12 000 kr", duration: "2 dagar" },
      { job: "Fasadmålning 100 kvm", price: "45 000 kr", duration: "1 vecka" },
      { job: "Tapetsering sovrum", price: "5 500 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "ROT-avdrag för målning är 30% av arbetskostnaden (inte 50% som VVS/El)",
      "Uppsala har många villor med träfasader som behöver målning vart 8-10 år",
      "Spackling och slipning är 40% av arbetet - viktigt för bra resultat",
      "Färgval påverkar rumskänsla - ljusa färger gör rum större",
      "Målning av köksluckor kostar 60% mindre än nya luckor",
      "Fasadmålning kräver torrt väder - undvik oktober-mars",
      "Grundning är obligatoriskt på nya ytor för långlivad hållbarhet",
      "Målning ökar fastighetsvärdet med 2-5%",
      "Uppsala har 12 000+ villor med träfasader",
      "Tapetsering kräver 24h torktid innan möbler kan flyttas in",
      "Miljömärkt färg kostar 20% mer men är bättre för inomhusluft",
      "Professionella målare målar 50% snabbare och snyggare än privatpersoner"
    ],
    didYouKnow: [
      "Färg uppfanns i Sverige 1887 av Alcro-Beckers - Uppsala var bland första städerna att använda färg",
      "Fel färgval kan göra ett rum 20% mindre - ljusa färger reflekterar ljus",
      "Spackling och slipning tar längre tid än själva målningen",
      "En villa i Uppsala målas om var 15:e år i genomsnitt",
      "Gammal blymålning från före 1970 kräver specialhantering - farlig för barn",
      "Takmålning kräver 30% mer färg än väggmålning på grund av absorption",
      "En proffsmålare använder 10 liter färg för 40 kvm väggyta"
    ],
    faqs: [
      { 
        q: "Hur snabbt kan målare komma ut i Uppsala?", 
        a: "Vi kan oftast starta målningsprojekt inom 3-5 dagar beroende på projektets storlek. För akuta behov kontakta oss direkt." 
      },
      { 
        q: "Ingår material i priset?", 
        a: "Material som färg, spackel och tape faktureras separat. Vi hjälper dig välja rätt kvalitet och färgval för ditt projekt." 
      },
      {
        q: "Kan ni tapetsera också?",
        a: "Ja, vi utför både målning och tapetsering. Vi har erfarenhet av både klassiska tapeter och moderna tapetvarianter."
      },
      {
        q: "Finns ROT-avdrag för målning?",
        a: "Ja, målning och tapetsering i befintlig bostad ger 30% ROT-avdrag på arbetskostnaden."
      }
    ],
    cases: [
      { 
        title: "Målning av villa i Gottsunda",
        desc: "Komplett målning av 3 rum, hall och kök. Inklusive spackling, grundning och två lager toppmålning. Projekttid: 5 dagar." 
      },
      { 
        title: "Tapetsering lägenhet Kungsängen",
        desc: "Tapetsering av sovrum och vardagsrum med moderna designtapeter. Inklusive rivning av gammal tapet och preparering." 
      },
      { 
        title: "Fasadmålning radhus Stenhagen",
        desc: "Målning av träfasad på radhus, inklusive slipning, grundning och två lager fasadfärg. Certifierad för ROT-avdrag." 
      }
    ]
  },

  // ========== MÅLERI - STOCKHOLM ==========
  {
    service: "Måleri",
    city: "Stockholm",
    slug: "malning-stockholm",
    h1: "Målare i Stockholm",
    title: "Målare i Stockholm – Målning, Tapetsering & Ytbehandling | ROT 30%",
    description: "Erfarna målare i Stockholm för målning av rum, fasader och tapetsering. Snabb hjälp, ROT-avdrag 30%. Täcker hela Stockholms stad.",
    priceHint: "Från 500 kr/h",
    howItWorks: [
      { step: 1, title: "Första kontakt", desc: "Beskriv målningsprojekt och område i Stockholm. Vi bokar tid för besök." },
      { step: 2, title: "Hembesök & färgrådgivning", desc: "Målare mäter upp, bedömer skick och ger färgrekommendationer." },
      { step: 3, title: "Detaljerad offert", desc: "Du får fast pris med material, arbetskostnad och tidsplan. ROT-avdrag 30% ingår." },
      { step: 4, title: "Målningsarbete", desc: "Vi täcker, spackar, slipar, grundar och målar. Minimal störning." },
      { step: 5, title: "Slutkontroll & städning", desc: "Vi kontrollerar kvalitet, städar och du får garanti." }
    ],
    priceExamples: [
      { job: "Målning rum 15 kvm", price: "8 000 kr", duration: "1 dag" },
      { job: "Målning kök inkl. luckor", price: "15 000 kr", duration: "2 dagar" },
      { job: "Fasadmålning 100 kvm", price: "55 000 kr", duration: "1 vecka" },
      { job: "Tapetsering sovrum", price: "7 000 kr", duration: "1 dag" }
    ],
    quickFacts: [
      "ROT-avdrag för målning är 30% (gäller arbetskostnad, ej material)",
      "Stockholm har 80% lägenheter - målning av väggar i lägenheter är vanligast",
      "BRF-regler i Stockholm kräver ofta godkännande för fasadmålning",
      "Sekelskifteslägenheter har ofta vackra stuckaturer som ska bevaras",
      "Målning av köksluckor är 70% billigare än att köpa nytt kök",
      "Spackling av sprickor är kritiskt i gamla Stockholmshus",
      "Färgval i Stockholm påverkas av ljusinsläpp - Södermalm har mindre ljus än Östermalm",
      "Takmålning i Stockholm är vanligare än i andra städer - höga tak",
      "Målning kan minska värdet om fel färg väljs - konsultera proffs",
      "Stockholm har 500+ målare - välj certifierade för ROT-avdrag",
      "Fasadmålning i Stockholm kräver bygglov i vissa områden",
      "Miljömärkt färg (Svanen) rekommenderas för innerstadslägenheter"
    ],
    didYouKnow: [
      "Stockholms sekelskifteslägenheter målades ursprungligen med linoljefärg som höll i 50+ år",
      "Fel färgval kan minska lägenhetsvärdet med 100 000+ kr vid försäljning",
      "Gamla Stan har 600+ fastigheter med originalmålning från 1600-1800-talet",
      "Stuckatur i Stockholms lägenheter kan ha 10+ lager färg - avspolning kan ta dagar",
      "Målning av trapphus i BRF kostar 50 000-150 000 kr beroende på storlek",
      "Stockholms torra inomhusklimat gör att färg torkar 30% snabbare än i kustnära städer",
      "Professionell målning i Stockholm kan spara 20 000+ kr i skador jämfört med egen målning"
    ],
    faqs: [
      { 
        q: "Hur snabbt kan målare komma ut i Stockholm?", 
        a: "Beroende på område och projekttyp kan vi ofta starta inom 3-7 dagar. Kontakta oss för exakt tillgänglighet." 
      },
      { 
        q: "Vilka områden i Stockholm täcker ni?", 
        a: "Vi täcker hela Stockholms stad inklusive Södermalm, Östermalm, Vasastan, Kungsholmen och alla övriga stadsdelar." 
      },
      {
        q: "Kan ni måla fasader?",
        a: "Ja, vi utför både fasadmålning och invändig målning. Vi har rätt utrustning och kompetens för både putsfasader och träfasader."
      },
      {
        q: "Vad kostar målning av ett rum?",
        a: "Priset beror på rumsstorlek, skick och finish. Ett standardrum (15-20 kvm) kostar typiskt 8 000-15 000 kr inklusive material och ROT."
      }
    ],
    cases: [
      { 
        title: "Helrenovering lägenhet Södermalm",
        desc: "Målning av 3:a i Södermalm inklusive spackling, grundning och målning av väggar, tak och foder. Projekttid: 1 vecka." 
      },
      { 
        title: "Tapetsering våning Östermalm",
        desc: "Tapetsering av hall och två sovrum med exklusiva designer-tapeter. Perfekt slutresultat med ROT-avdrag." 
      },
      { 
        title: "Målning radhus Bromma",
        desc: "Fasadmålning av 2-plans radhus inklusive fönsterbågar och dörrar. Komplett målningssystem för långvarig skydd." 
      }
    ]
  }
];
