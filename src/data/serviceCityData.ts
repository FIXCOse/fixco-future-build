export type ServiceKey =
  | "Elmontör"
  | "VVS"
  | "Snickare"
  | "Städ"
  | "Markarbeten"
  | "Flytt"
  | "Montering"
  | "Trädgård";

export interface ServiceCityItem {
  service: ServiceKey;
  city: "Uppsala" | "Stockholm";
  slug: string;
  h1: string;
  title: string;
  description: string;
  priceHint?: string;
  faqs: Array<{ q: string; a: string }>;
  cases: Array<{ title: string; desc: string }>;
}

export const serviceCityData: ServiceCityItem[] = [
  // ========== ELMONTÖR ==========
  {
    service: "Elmontör",
    city: "Uppsala",
    slug: "elmontor-uppsala",
    h1: "Elmontör i Uppsala",
    title: "Elmontör i Uppsala – Installation & Felsökning | ROT 50%",
    description:
      "Auktoriserade elektriker i Uppsala för belysning, uttag, laddbox och felsökning. Snabb hjälp, ROT-avdrag 50% och fri resa. Start inom 24h.",
    priceHint: "Vanliga jobb 1–3 h • ROT 50% gäller • Fri resa",
    faqs: [
      { 
        q: "Hur snabbt kan elektriker komma ut i Uppsala?", 
        a: "Vid akuta fel försöker vi komma samma dag. För planerade installationer kan vi ofta starta inom 24-48 timmar." 
      },
      { 
        q: "Installerar ni laddboxar i Uppsala?", 
        a: "Ja, vi installerar laddboxar för elbilar inklusive effektvakt, jordning och dokumentation enligt Elsäkerhetsverkets krav." 
      },
      {
        q: "Är era elektriker auktoriserade?",
        a: "Ja, alla våra elektriker är auktoriserade av Elsäkerhetsverket och arbetar enligt gällande standarder (SS 436 40 00)."
      }
    ],
    cases: [
      { 
        title: "Felsökning jordfel Svartbäcken", 
        desc: "Spårning och åtgärd av jordfel i villa, byte av 3 st dvärgbrytare och dokumentation. Genomfört på 2 timmar." 
      },
      { 
        title: "LED-belysning kök Luthagen", 
        desc: "Installation av 8 st LED-spotlights med dimmers och ny strömförsörjning. Snyggt, energieffektivt och med ROT-avdrag." 
      },
      {
        title: "Laddbox installation Gottsunda",
        desc: "Installation av 11 kW laddbox för elbil, inkl. effektvakt, jordning och besiktningsprotokoll."
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
      "Elinstallation, belysning, laddbox och felsökning i Stockholm. Auktoriserade elektriker med tydliga priser och ROT-avdrag 50%. Reseavgift 299 kr.",
    priceHint: "Reseavgift 299 kr • ROT 50% gäller",
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
      "Rörmokare i Uppsala för blandare, WC, dusch, läckor och badrumsrenoveringar. Snabb hjälp vid akuta läckor och ROT-avdrag 50%. Fri resa.",
    priceHint: "Vanliga jobb 1–3 h • ROT 50% gäller • Fri resa",
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
      "VVS-hjälp i Stockholm för blandare, WC, dusch, läckor och badrumsrenoveringar. Snabbt på plats och tydliga prisexempel. ROT-avdrag 50%. Reseavgift 299 kr.",
    priceHint: "Reseavgift 299 kr • ROT 50% gäller",
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

  // 🔽🔽 PLATSHÅLLARE FÖR FLER TJÄNSTER – LÄGG TILL NÄR DU EXPANDERAR 🔽🔽
  
  // Exempel: Städ Uppsala
  // {
  //   service: "Städ",
  //   city: "Uppsala",
  //   slug: "stad-uppsala",
  //   h1: "Städtjänster i Uppsala",
  //   title: "Städning i Uppsala – Hemstäd, Flyttstäd | RUT 50%",
  //   description: "Hemstäd, flyttstäd, byggstäd och fönsterputs i Uppsala. RUT 50% och fasta paket.",
  //   priceHint: "RUT 50% gäller • Fri resa",
  //   faqs: [
  //     { q: "Tar ni med städmaterial?", a: "Ja, vi tar med professionellt städmaterial eller använder kundens om så önskas." }
  //   ],
  //   cases: [
  //     { title: "Flyttstäd Luthagen", desc: "Full besiktning godkänd utan anmärkning." }
  //   ]
  // },
  
  // Exempel: Markarbeten Uppsala
  // {
  //   service: "Markarbeten",
  //   city: "Uppsala",
  //   slug: "markarbeten-uppsala",
  //   h1: "Markarbeten i Uppsala",
  //   title: "Markarbeten i Uppsala – Dränering, Grävning | ROT 50%",
  //   description: "Dränering, grävning, planering och markförberedelser i Uppsala. ROT-avdrag 50%.",
  //   priceHint: "ROT 50% gäller • Fri resa",
  //   faqs: [
  //     { q: "Gör ni schaktning för altan?", a: "Ja, vi gräver och planerar marken inför altanbygge." }
  //   ],
  //   cases: [
  //     { title: "Dränering Svartbäcken", desc: "Installation av ny dränering runt villa, 30 meter rör." }
  //   ]
  // },
];
