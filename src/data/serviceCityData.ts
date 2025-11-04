export type ServiceKey =
  | "Elmontör"
  | "VVS"
  | "Snickare"
  | "Städ"
  | "Markarbeten"
  | "Flytt"
  | "Montering"
  | "Trädgård"
  | "Tekniska installationer";

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
      "Auktoriserade elektriker i Uppsala för belysning, uttag, laddbox och felsökning. Snabb hjälp, ROT-avdrag 50%. Start inom 24h.",
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
      "Elinstallation, belysning, laddbox och felsökning i Stockholm. Auktoriserade elektriker med tydliga priser och ROT-avdrag 50%.",
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
    faqs: [
      { q: "Kan ni flytta piano?", a: "Ja, vi har specialutrustning och erfarenhet av att flytta pianon och andra tunga instrument säkert." },
      { q: "Arbetar ni helger?", a: "Ja, vi erbjuder flytthjälp även på helger för de som behöver flytta då. Boka i god tid." },
      { q: "Har ni flyttkartonger?", a: "Ja, vi säljer och hyr ut flyttkartonger i olika storlekar samt packmaterial." }
    ],
    cases: [
      { title: "Lägenhetsflytt Södermalm", desc: "Flytt av 2:a från 4:e våning utan hiss. Allt hanterades smidigt med trappskydd och professionell utrustning." },
      { title: "Kontorsflytt Kungsholmen", desc: "Flytt av större kontor med servrar, skrivbord och kontorsinredning. Genomförd över en helg." }
    ]
  }
];
