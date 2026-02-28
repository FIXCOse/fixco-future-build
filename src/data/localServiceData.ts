// ============================================================
// MASSIV LOKAL SEO DATA - 450+ lokala sidor
// ============================================================

// Stockholm-regionen: 30+ orter
export const STOCKHOLM_AREAS = [
  // Stadsdelar
  "Stockholm", "Bromma", "Hägersten", "Kungsholmen", "Södermalm", "Vasastan", "Östermalm",
  // Förorter & kommuner
  "Danderyd", "Ekerö", "Haninge", "Huddinge", "Järfälla", "Järna", "Lidingö", 
  "Märsta", "Nacka", "Norrtälje", "Nykvarn", "Nynäshamn", "Salem", "Sigtuna",
  "Sollentuna", "Solna", "Sundbyberg", "Södertälje", "Tyresö", "Täby", 
  "Upplands Väsby", "Upplands-Bro", "Vallentuna", "Vaxholm", "Värmdö", "Åkersberga", "Botkyrka"
] as const;

// Uppsala-regionen: 15+ orter
export const UPPSALA_AREAS = [
  "Uppsala", "Knivsta", "Enköping", "Tierp", "Östhammar",
  // Tätorter
  "Storvreta", "Björklinge", "Bälinge", "Vattholma", "Alsike", 
  "Gränby", "Sävja", "Eriksberg", "Gottsunda", "Sunnersta",
  "Skyttorp", "Lövstalöt", "Gamla Uppsala", "Ultuna"
] as const;

export const ALL_AREAS = [...STOCKHOLM_AREAS, ...UPPSALA_AREAS] as const;

export type AreaKey = typeof ALL_AREAS[number];

// Alla tjänster som ska ha lokala sidor
export const LOCAL_SERVICES = [
  { slug: "snickare", name: "Snickare", serviceKey: "snickeri", rotRut: "ROT" },
  { slug: "elektriker", name: "Elektriker", serviceKey: "el", rotRut: "ROT" },
  { slug: "vvs", name: "VVS", serviceKey: "vvs", rotRut: "ROT" },
  { slug: "malare", name: "Målare", serviceKey: "malning", rotRut: "ROT" },
  { slug: "tradgard", name: "Trädgård", serviceKey: "tradgard", rotRut: "ROT" },
  { slug: "stad", name: "Städ", serviceKey: "stadning", rotRut: "RUT" },
  { slug: "markarbeten", name: "Markarbeten", serviceKey: "markarbeten", rotRut: "ROT" },
  { slug: "montering", name: "Montering", serviceKey: "montering", rotRut: "ROT" },
  { slug: "flytt", name: "Flytt", serviceKey: "flytt", rotRut: "RUT" },
  { slug: "tekniska-installationer", name: "Tekniska installationer", serviceKey: "tekniska-installationer", rotRut: "ROT" },
] as const;

export type LocalServiceSlug = typeof LOCAL_SERVICES[number]["slug"];

// Genererar slug för URL
export const generateAreaSlug = (area: string): string => {
  return area
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Area metadata (befolkning, typ, etc) - Uppdaterade siffror baserade på SCB 2024
export const getAreaMetadata = (area: AreaKey): { population: string; type: string; region: "Stockholm" | "Uppsala" } => {
  const stockholmAreas = STOCKHOLM_AREAS as readonly string[];
  const region = stockholmAreas.includes(area) ? "Stockholm" : "Uppsala";
  
  // Befolkningsdata baserat på SCB 2024 (kommunsiffror)
  const populationMap: Record<string, string> = {
    // Stockholm - huvudstad och stora kommuner
    "Stockholm": "984 000",
    "Huddinge": "118 000",
    "Nacka": "109 000",
    "Södertälje": "103 000",
    "Haninge": "98 000",
    "Botkyrka": "96 000",
    "Solna": "87 000",
    "Järfälla": "83 000",
    "Sollentuna": "76 000",
    "Täby": "75 000",
    "Sundbyberg": "54 000",
    "Sigtuna": "52 000",
    "Lidingö": "50 000",
    "Upplands Väsby": "49 000",
    "Tyresö": "49 000",
    "Värmdö": "47 000",
    "Vallentuna": "36 000",
    "Danderyd": "34 000",
    "Upplands-Bro": "32 000",
    "Ekerö": "30 000",
    "Nynäshamn": "30 000",
    "Norrtälje": "65 000",
    "Salem": "18 000",
    "Vaxholm": "12 000",
    "Nykvarn": "12 000",
    "Järna": "8 000",
    "Märsta": "28 000",
    "Åkersberga": "32 000",
    
    // Stockholms stadsdelar (ca befolkning)
    "Bromma": "78 000",
    "Hägersten": "95 000",
    "Kungsholmen": "72 000",
    "Södermalm": "130 000",
    "Vasastan": "75 000",
    "Östermalm": "76 000",
    
    // Uppsala län - kommunsiffror SCB 2024
    "Uppsala": "248 000",
    "Enköping": "48 000",
    "Tierp": "22 000",
    "Östhammar": "22 000",
    "Knivsta": "21 000",
    
    // Uppsala tätorter (ca befolkning)
    "Storvreta": "9 000",
    "Björklinge": "3 500",
    "Bälinge": "6 000",
    "Vattholma": "800",
    "Alsike": "4 500",
    "Gränby": "5 000",
    "Sävja": "12 000",
    "Eriksberg": "8 000",
    "Gottsunda": "10 000",
    "Sunnersta": "4 000",
    "Skyttorp": "600",
    "Lövstalöt": "500",
    "Gamla Uppsala": "2 500",
    "Ultuna": "3 000"
  };

  return {
    population: populationMap[area] || "10 000+",
    type: ["Stockholm", "Uppsala", "Sollentuna", "Huddinge", "Nacka", "Täby", "Södertälje", "Solna", "Sundbyberg"].includes(area) ? "stad" : "kommun",
    region
  };
};

// ============================================================
// ROLIG FAKTA OM ORTER - Engagerande lokalt innehåll
// ============================================================
const AREA_FUN_FACTS: Record<string, string[]> = {
  // Uppsala kommun
  "Uppsala": [
    "Uppsala universitet grundades 1477 och är Nordens äldsta universitet",
    "Uppsala domkyrka är Skandinaviens största kyrkobyggnad med 118,7 meters höjd",
    "Uppsala var Sveriges religiösa centrum och ärkebiskopens säte sedan medeltiden",
    "Carl von Linné bodde och verkade i Uppsala – hans trädgård finns kvar än idag"
  ],
  // Stockholm
  "Stockholm": [
    "Stockholm är byggd på 14 öar sammankopplade av 57 broar",
    "Stockholms tunnelbana kallas världens längsta konstutställning med konst i 90+ stationer",
    "Gamla stan är en av Europas bäst bevarade medeltidsstäder från 1200-talet",
    "Vasa-museet är Sveriges mest besökta museum med 1,5 miljoner besökare årligen"
  ],
  "Täby": [
    "Täby har den högsta andelen villaägare i Stockholms län",
    "Arninge handelsområde är ett av Stockholmsregionens största",
    "Täby kyrka har världsberömda kalkmålningar av Albertus Pictor från 1400-talet",
    "Täby galoppfält var en av Europas finaste tävlingsbanor"
  ],
  "Sollentuna": [
    "Sollentuna har anor från bronsåldern med gravfält från 1000-talet f.Kr.",
    "Edsviken som gränsar till Sollentuna var en viktig handelsled under vikingatiden",
    "Sollentuna centrum är ett av Stockholms mest expansiva",
    "Friends Arena ligger delvis i Sollentuna och rymmer 65 000 personer"
  ],
  "Huddinge": [
    "Huddinge är Stockholms läns näst största kommun",
    "Karolinska sjukhuset i Huddinge är ett av Europas största universitetssjukhus",
    "Huddinge har 40% naturreservat och grönområden",
    "Kommunen har Stockholms största sammanhängande skogsområde"
  ],
  "Nacka": [
    "Nacka är känd för sina vackra stränder vid Saltsjön",
    "Nacka strand var tidigare Stockholms största varvsområde",
    "Nyckelviken i Nacka är ett populärt friluftsområde sedan 1935",
    "Nacka har över 30 km kustlinje"
  ],
  "Södertälje": [
    "Södertälje är hem för Scania och AstraZeneca",
    "Södertälje kanal invigdes 1819 och är Sveriges äldsta sluss",
    "Staden har anor från vikingatiden som handelsplats",
    "Torekällberget är ett av Sveriges äldsta friluftsmuseum"
  ],
  "Sundbyberg": [
    "Sundbyberg är Sveriges minsta kommun till ytan men en av de tätast befolkade",
    "Kommunen fick stadsrättigheter 1927",
    "Marabouparken med dess chokladhistoria är en populär attraktion",
    "Sundbyberg växer snabbast av alla kommuner i länet"
  ],
  "Solna": [
    "Friends Arena i Solna är Sveriges största arena",
    "Karolinska Institutet har sitt huvudcampus i Solna",
    "Hagaparken med Haga slott ligger delvis i Solna",
    "Mall of Scandinavia är Nordens största köpcentrum"
  ],
  "Danderyd": [
    "Danderyd har Sveriges högsta medianinkomst",
    "Djursholms slott byggdes på 1600-talet",
    "Stocksunds hamn är en charmig båtmiljö från 1800-talet",
    "Ekebyhovs slott är en populär evenemangsplats"
  ],
  "Lidingö": [
    "Lidingöloppet är världens största terränglopp med 50 000 deltagare",
    "Millesgården är ett världskänt konstnärshem och museum",
    "Carl Milles berömda skulpturer finns utspridda över hela ön",
    "Lidingö har kallats 'den gröna ön' för sina många parker"
  ],
  "Järfälla": [
    "Järfälla har bevarat sin karaktär av trädgårdsstad",
    "Viksjö kyrka har medeltida anor från 1100-talet",
    "Barkarby handelsområde är ett av regionens största",
    "Den nya tunnelbanelinjen till Barkarby öppnar 2026"
  ],
  "Haninge": [
    "Haninge sträcker sig från Östersjön till Sörmlands inland",
    "Tyresta nationalpark ligger delvis i Haninge",
    "Rudans friluftsområde är populärt för bad och vandring",
    "Dalarö var en viktig sjöfartsort under stormaktstiden"
  ],
  "Botkyrka": [
    "Botkyrka är uppkallat efter Sankt Botvid som missionerade här på 1100-talet",
    "Tumba bruk grundades 1755 för papperstillverkning till sedlar",
    "Botkyrka är en av Sveriges mest mångkulturella kommuner",
    "Hågelbyparken är en av regionens finaste herrgårdsmiljöer"
  ],
  "Knivsta": [
    "Knivsta blev egen kommun först 2003",
    "Alsike kloster är ett populärt andligt center",
    "Kommunen är en av Sveriges snabbast växande",
    "Knivsta station gör det enkelt att pendla till både Stockholm och Uppsala"
  ],
  "Enköping": [
    "Enköping kallas 'Parkernas stad' med 25 parker i centrum",
    "Enköpings trädgårdar vinner regelbundet utmärkelser",
    "Bredsands badplats är en av Mälarens populäraste",
    "Staden har medeltida anor som handelsplats"
  ],
  "Norrtälje": [
    "Norrtälje är porten till Roslagen och skärgården",
    "Pythagoras Industrimuseum visar Norrtäljes industrihistoria",
    "Norrtälje hamn är charmig med restauranger och båtliv",
    "Kommunen har över 11 000 öar i sin skärgård"
  ],
  "Tyresö": [
    "Tyresö slott är ett av Stockholms vackraste barockslott",
    "Tyresta nationalpark gränsar till Tyresö",
    "Brevik är ett populärt område för båtliv",
    "Tyresö strand är en av Stockholms bästa badplatser"
  ],
  "Vallentuna": [
    "Vallentuna var centrum för Attundaland under vikingatiden",
    "Orkesta runstenar är bland Sveriges mest välbevarade",
    "Vallentuna sjö är populär för fiske och bad",
    "Kommunen har Sveriges tätaste koncentration av runstenar"
  ],
  "Värmdö": [
    "Värmdö omfattar stora delar av Stockholms skärgård",
    "Gustavsberg är känt för sin keramiktillverkning sedan 1825",
    "Artipelag är ett modernt konst- och evenemangscentrum",
    "Sandhamn är en klassisk skärgårdsdestination"
  ],
  "Sigtuna": [
    "Sigtuna är Sveriges äldsta stad, grundad omkring år 980",
    "Mariakyrkan är en av få bevarade medeltidskyrkor i området",
    "Stora gatan är Sveriges äldsta gata som fortfarande används",
    "Arlanda flygplats ligger i Sigtuna kommun"
  ],
  // Uppsala-områden
  "Storvreta": [
    "Storvreta ligger vackert vid Fyrisån norr om Uppsala",
    "Tätorten har vuxit kraftigt sedan 1970-talet",
    "Nära till både stad och natur",
    "Populärt område för barnfamiljer"
  ],
  "Gottsunda": [
    "Gottsunda är Uppsalas mest mångkulturella stadsdel",
    "Gottsunda centrum byggdes på 1970-talet",
    "Nära till Dag Hammarskjölds backe för skidåkning",
    "Stora gröna områden runt stadsdelen"
  ],
  "Sävja": [
    "Sävja är en av Uppsalas snabbast växande stadsdelar",
    "Nära till E4 för enkel pendling",
    "Blandat bostadsområde med villor och flerfamiljshus",
    "Goda förbindelser till Uppsala centrum"
  ],
  "Eriksberg": [
    "Eriksberg är Uppsalas nyaste stadsdel",
    "Modern stadsplanering med fokus på hållbarhet",
    "Nära till Fyrishov – Nordens största inomhusanläggning",
    "Populärt bland unga familjer"
  ],
  // Stockholms stadsdelar
  "Södermalm": [
    "Södermalm var arbetarstadsdel men är nu en av Stockholms hipaste",
    "Fotografiska är ett av världens största fotomuseer",
    "Monteliusvägen erbjuder en av Stockholms bästa utsikter",
    "'Söder' är känd för sin cafékultur och vintage-shopping"
  ],
  "Östermalm": [
    "Östermalm är Stockholms exklusivaste stadsdel",
    "Östermalmshallen är en klassisk saluhall från 1888",
    "Strandvägen anses vara Stockholms finaste adress",
    "Djurgården gränsar till Östermalm"
  ],
  "Kungsholmen": [
    "Kungsholmen var industristadsdel men är nu populärt bostadsområde",
    "Stadshuset ligger på Kungsholmen och ses som Stockholms symbol",
    "Rålambshovsparken är populär för picknick och bad",
    "Öns strandpromenad är 8 km lång"
  ],
  "Vasastan": [
    "Vasastan är känd för sin vackra jugendarkitektur",
    "Odenplan är Vasastans centrum",
    "Stadsbiblioteket av Gunnar Asplund är arkitektoniskt ikoniskt",
    "Rörstrandsgatan är känd för sina restauranger"
  ],
  "Bromma": [
    "Bromma flygplats är Stockholms cityflygplats",
    "Bromma är Stockholms mest villabebodda stadsdel",
    "Äppelviken är ett av områdets finaste villaområden",
    "Bromma kyrka har anor från 1100-talet"
  ],
  "Hägersten": [
    "Hägersten är en charmig förort med blandad bebyggelse",
    "Vinterviken var Alfred Nobels sprängämnesfabrik",
    "Telefonplan har blivit ett kreativt centrum",
    "Nära till Mälaren för bad och båtliv"
  ]
};

// Standardfakta för orter som saknar specifika
const getDefaultFunFacts = (area: string, region: string): string[] => [
  `${area} ligger i vackra ${region}s län`,
  `${area} erbjuder god livskvalitet nära både stad och natur`,
  `Goda pendlingsmöjligheter till ${region} centrum`,
  `${area} är populärt för barnfamiljer och aktiva`
];

// ============================================================
// MYTER OCH SANNINGAR PER TJÄNST
// ============================================================
const SERVICE_MYTHS: Record<LocalServiceSlug, Array<{ myth: string; truth: string }>> = {
  "elektriker": [
    { 
      myth: "Man kan byta uttag och strömbrytare själv utan elektriker", 
      truth: "Alla elarbeten kräver behörighet enligt Elsäkerhetsverket. Felaktigt utförda elarbeten kan leda till brand eller elchock – och ogiltigförklarar din hemförsäkring." 
    },
    { 
      myth: "Gamla säkringar fungerar lika bra som moderna jordfelsbrytare", 
      truth: "Jordfelsbrytare räddar liv genom att bryta strömmen på 30 millisekunder. Gamla proppsäkringar ger inte samma skydd mot elolyckor." 
    },
    { 
      myth: "Elbesiktning är bara nödvändigt vid försäljning", 
      truth: "Regelbunden elbesiktning rekommenderas vart 10-20 år för att säkerställa att installationerna är säkra och uppfyller moderna krav." 
    }
  ],
  "snickare": [
    { 
      myth: "IKEA-kök är lika bra som snickeribyggda kök", 
      truth: "Platsbyggda kök anpassas exakt efter ditt rum, har högre materialkvalitet och håller ofta 2-3 gånger längre än standardkök." 
    },
    { 
      myth: "Snickare behöver man bara för stora projekt", 
      truth: "En duktig snickare kan hjälpa med allt från att hänga en dörr till att bygga om hela huset – ofta lönar sig experthjälp även för mindre jobb." 
    },
    { 
      myth: "Alla träslag fungerar lika bra utomhus", 
      truth: "Tryckimpregnerat virke, lärkträ och cederträ tål väder bäst. Vanlig gran ruttnar snabbt utan rätt behandling." 
    }
  ],
  "vvs": [
    { 
      myth: "En droppande kran är inget att oroa sig för", 
      truth: "En droppande kran kan slösa upp till 20 000 liter vatten per år och leder ofta till större problem om den inte åtgärdas." 
    },
    { 
      myth: "Värmepumpar fungerar inte i kallt klimat", 
      truth: "Moderna luft-vattenvärmepumpar fungerar effektivt ner till -25°C och kan halvera dina uppvärmningskostnader även i Sverige." 
    },
    { 
      myth: "Man kan installera bidé eller toalett själv", 
      truth: "Felaktig VVS-installation kan leda till vattenskador för hundratusentals kronor. Säker Vatteninstallation-certifiering krävs för garantier." 
    }
  ],
  "malare": [
    { 
      myth: "Billig färg är lika bra som dyr", 
      truth: "Kvalitetsfärg har högre pigmentkoncentration, täcker bättre och håller 2-3 gånger längre – du sparar på sikt." 
    },
    { 
      myth: "Man behöver inte grunda innan målning", 
      truth: "Grundning är avgörande för att färgen ska fästa ordentligt och för att undvika fläckar som slår igenom." 
    },
    { 
      myth: "Utomhusmålning kan göras när som helst", 
      truth: "Färg kräver +10°C och torrt väder för att härda korrekt. Målning i fel väder leder till flagning inom några år." 
    }
  ],
  "tradgard": [
    { 
      myth: "Gräsklipparen kan ställas på lägsta höjd för kortast gräs", 
      truth: "För kort gräs stressar gräsmattan och gör den mottaglig för ogräs och torka. 5-7 cm är optimal klipphöjd." 
    },
    { 
      myth: "Alla träd kan beskäras när som helst på året", 
      truth: "Fruktträd beskärs bäst på vintern, medan björk och lönn ska beskäras på högsommaren för att undvika 'blödning'." 
    },
    { 
      myth: "Mer gödsel ger alltid bättre resultat", 
      truth: "Övergödsling kan bränna växter och förorena grundvatten. Följ alltid rekommenderade doser." 
    }
  ],
  "stad": [
    { 
      myth: "Blekning är det bästa sättet att rengöra", 
      truth: "Blekmedel dödar bakterier men rengör inte smuts. Det kan också skada ytor och är dåligt för miljön." 
    },
    { 
      myth: "Dammsugning räcker för att hålla mattor rena", 
      truth: "Mattor bör djuprengöras 1-2 gånger per år för att ta bort kvalster, allergener och ingrodd smuts." 
    },
    { 
      myth: "Fönsterputs med tidningspapper ger bäst resultat", 
      truth: "Modern tryckfärg ger inte samma effekt som förr. Mikrofiberduk och rätt teknik ger strekfria fönster." 
    }
  ],
  "markarbeten": [
    { 
      myth: "Man kan schakta var som helst på tomten utan att kontrollera", 
      truth: "Alltid ring Ledningskollen (020-85 85 85) innan grävning – att gräva av en elkabel eller gasledning kan vara livsfarligt." 
    },
    { 
      myth: "Dränering behövs bara vid synliga fuktproblem", 
      truth: "Förebyggande dränering är mycket billigare än att åtgärda fuktskador i källare. Kontrollera dränering vart 30:e år." 
    },
    { 
      myth: "Plattsättning på gräsmatta fungerar bra", 
      truth: "Utan ordentlig bädd av makadam och sand kommer plattor att sjunka och bli sneda inom några år." 
    }
  ],
  "montering": [
    { 
      myth: "IKEA-möbler är enkla att montera själv", 
      truth: "Felmontering är vanligt och kan göra möbler instabila och farliga. Kök och garderober kräver ofta precision på millimetern." 
    },
    { 
      myth: "Alla väggar tål att hänga tunga saker", 
      truth: "Gipsväggar kräver speciella plugg och rätt teknik. Tunga föremål måste fästas i reglar för att sitta säkert." 
    },
    { 
      myth: "TV-fästen kan monteras var som helst på väggen", 
      truth: "Felmontering av TV kan leda till att den faller ner. Vikt, väggtyp och kabelhantering måste beaktas." 
    }
  ],
  "flytt": [
    { 
      myth: "Fler lådor gör flytten enklare", 
      truth: "Rätt packade, färre lådor gör flytten snabbare och billigare. Tunga saker i små lådor, lätta i stora." 
    },
    { 
      myth: "Man kan flytta tunga möbler själv för att spara pengar", 
      truth: "Ryggskador är vanliga vid flytt. Professionella flyttare har rätt teknik och utrustning för att undvika skador." 
    },
    { 
      myth: "Flyttstädning kan göras snabbt sista dagen", 
      truth: "Noggrann flyttstädning tar 4-8 timmar för en lägenhet. Planera tid eller anlita proffshjälp för att få tillbaka depositionen." 
    }
  ],
  "tekniska-installationer": [
    { 
      myth: "Smart hem-system är för komplicerade för vanliga användare", 
      truth: "Moderna system är designade för enkelhet. Efter installation styrs allt via mobilapp eller röstkommandon." 
    },
    { 
      myth: "Solceller lönar sig bara i södra Sverige", 
      truth: "Även i Mellansverige producerar solceller tillräckligt för att betala sig inom 8-12 år tack vare långa somrar." 
    },
    { 
      myth: "Övervakningskameror är bara för stora företag", 
      truth: "Moderna hemsystem kostar från några tusen kronor och ger trygghet dygnet runt med mobilnotiser." 
    }
  ]
};

// ============================================================
// CONTENT GENERATOR - Lärorikt innehåll med hög ortnamn-upprepning
// ============================================================

// PRISMAPPNING - Korrekta priser från servicesData
const SERVICE_PRICING: Record<LocalServiceSlug, { 
  base: string; 
  afterDeduction: string; 
  isQuoteOnly: boolean;
  rotRut: 'ROT' | 'RUT';
}> = {
  "snickare":    { base: "859 kr/h",  afterDeduction: "430 kr/h", isQuoteOnly: false, rotRut: "ROT" },
  "elektriker":  { base: "Begär offert", afterDeduction: "Begär offert", isQuoteOnly: true, rotRut: "ROT" },
  "vvs":         { base: "Begär offert", afterDeduction: "Begär offert", isQuoteOnly: true, rotRut: "ROT" },
  "malare":      { base: "859 kr/h",  afterDeduction: "430 kr/h", isQuoteOnly: false, rotRut: "ROT" },
  "tradgard":    { base: "659 kr/h",  afterDeduction: "330 kr/h", isQuoteOnly: false, rotRut: "ROT" },
  "stad":        { base: "459 kr/h",  afterDeduction: "230 kr/h", isQuoteOnly: false, rotRut: "RUT" },
  "markarbeten": { base: "959 kr/h",  afterDeduction: "480 kr/h", isQuoteOnly: false, rotRut: "ROT" },
  "montering":   { base: "759 kr/h",  afterDeduction: "380 kr/h", isQuoteOnly: false, rotRut: "ROT" },
  "flytt":       { base: "559 kr/h",  afterDeduction: "280 kr/h", isQuoteOnly: false, rotRut: "RUT" },
  "tekniska-installationer": { base: "Begär offert", afterDeduction: "Begär offert", isQuoteOnly: true, rotRut: "ROT" },
};

// Funktion för att hämta rolig fakta
export const getAreaFunFacts = (area: AreaKey): string[] => {
  const metadata = getAreaMetadata(area);
  return AREA_FUN_FACTS[area] || getDefaultFunFacts(area, metadata.region);
};

// Funktion för att hämta myter
export const getServiceMyths = (serviceSlug: LocalServiceSlug): Array<{ myth: string; truth: string }> => {
  return SERVICE_MYTHS[serviceSlug] || [];
};

export interface LocalServiceContent {
  h1: string;
  title: string;
  description: string;
  intro: string;
  localSection: {
    title: string;
    content: string;
  };
  ctaSection: {
    title: string;
    content: string;
  };
  servicesSection: {
    title: string;
    items: string[];
  };
  rotRutSection: {
    title: string;
    content: string;
  };
  faqs: Array<{ q: string; a: string }>;
  quickFacts: string[];
  funFacts: string[];
  myths: Array<{ myth: string; truth: string }>;
}

// English service name mapping
const SERVICE_NAME_EN: Record<LocalServiceSlug, string> = {
  "snickare": "Carpenter",
  "elektriker": "Electrician",
  "vvs": "Plumbing",
  "malare": "Painter",
  "tradgard": "Gardening",
  "stad": "Cleaning",
  "markarbeten": "Groundwork",
  "montering": "Assembly",
  "flytt": "Moving",
  "tekniska-installationer": "Technical Installation",
};

export const generateLocalContent = (serviceSlug: LocalServiceSlug, area: AreaKey, locale: 'sv' | 'en' = 'sv'): LocalServiceContent => {
  const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug)!;
  const isEn = locale === 'en';
  const serviceName = isEn ? SERVICE_NAME_EN[serviceSlug].toLowerCase() : service.name.toLowerCase();
  const serviceNameCapital = isEn ? SERVICE_NAME_EN[serviceSlug] : service.name;
  const rotRut = service.rotRut;
  const metadata = getAreaMetadata(area);
  
  // Import improved titles from localSeoData
  const titleTemplates: Record<LocalServiceSlug, string> = isEn ? {
    "snickare": `Carpenter ${area} ★ Kitchen, wardrobe & deck · ROT 30% · Free quote`,
    "vvs": `Plumbing ${area} ★ Repair & installation · ROT 30% · Response 24h`,
    "elektriker": `Electrician ${area} ★ Certified · EV charger & electrical · ROT 30%`,
    "malare": `Painter ${area} ★ Facade & interior · Fixed prices · ROT 30%`,
    "stad": `Cleaning ${area} ★ Move-out, home & construction · RUT 30% · Book today`,
    "flytt": `Moving help ${area} ★ Packing & carrying · RUT 30% · Quick booking`,
    "markarbeten": `Groundwork ${area} ★ Excavation, drainage & paving · ROT 30%`,
    "montering": `Assembly ${area} ★ IKEA, kitchen & furniture · ROT 30%`,
    "tradgard": `Gardening ${area} ★ Trees, hedges & landscaping · ROT 30%`,
    "tekniska-installationer": `Technical installation ${area} ★ EV charger & smart home · ROT 30%`
  } : {
    "snickare": `Snickare ${area} ★ Kök, garderob & altan · ROT 30% · Fri offert`,
    "vvs": `VVS ${area} ★ Byte & reparation · ROT 30% · Svar 24h`,
    "elektriker": `Elektriker ${area} ★ Certifierade · Laddbox & el · ROT 30%`,
    "malare": `Målare ${area} ★ Fasad & invändigt · Fasta priser · ROT 30%`,
    "stad": `Städfirma ${area} ★ Flytt, hem & byggstäd · RUT 30% · Boka idag`,
    "flytt": `Flytthjälp ${area} ★ Pack & bärhjälp · RUT 30% · Snabb bokning`,
    "markarbeten": `Markarbeten ${area} ★ Schakt, dränering & plattor · ROT 30%`,
    "montering": `Monteringshjälp ${area} ★ IKEA, kök & möbler · ROT 30%`,
    "tradgard": `Trädgårdshjälp ${area} ★ Träd, häck & anläggning · ROT 30%`,
    "tekniska-installationer": `Teknisk installation ${area} ★ Laddbox & smarta hem · ROT 30%`
  };

  const descriptionTemplates: Record<LocalServiceSlug, string> = isEn ? {
    "snickare": `Carpenter in ${area} ★ 5/5 rating ✓ Kitchen renovation, deck & flooring ✓ 30% ROT deduction ✓ Fixed price. Get quote within 24h!`,
    "elektriker": `Electrician ${area} ★ 5/5 rating ✓ Electrical installation & lighting ✓ Certified ✓ 30% ROT deduction. Book today!`,
    "vvs": `Plumber ${area} ★ 5/5 rating ✓ Bathroom, kitchen & heating ✓ Certified ✓ 30% ROT deduction. Get quote within 24h!`,
    "malare": `Painter ${area} ★ 5/5 rating ✓ Interior & exterior painting ✓ 30% ROT deduction ✓ Work guarantee. Book painter!`,
    "stad": `Cleaning ${area} ★ 5/5 rating ✓ Home, move-out & deep cleaning ✓ 30% RUT deduction ✓ Quality guarantee. Book today!`,
    "flytt": `Moving help ${area} ★ 5/5 rating ✓ Packing, transport & carrying ✓ 30% RUT deduction ✓ Insured moving. Free quote!`,
    "montering": `Assembly ${area} ★ 5/5 rating ✓ IKEA furniture, kitchen & wardrobes ✓ 30% RUT deduction. Often same-day start!`,
    "tradgard": `Gardening ${area} ★ 5/5 rating ✓ Tree felling, hedges & lawn ✓ 30% ROT deduction. Book gardener!`,
    "markarbeten": `Groundwork ${area} ★ 5/5 rating ✓ Drainage, paving & excavation ✓ 30% ROT deduction. Free quote within 24h!`,
    "tekniska-installationer": `Technical installation ${area} ★ 5/5 rating ✓ EV charger, smart home & AV ✓ 30% ROT deduction. Book certified installer!`
  } : {
    "snickare": `Snickare i ${area} ★ 5/5 betyg ✓ Köksrenovering, altanbygge & golv ✓ 30% ROT-avdrag ✓ Fast pris. Få offert inom 24h!`,
    "elektriker": `Elektriker ${area} ★ 5/5 betyg ✓ Elinstallation, uttag & belysning ✓ Auktoriserad ✓ 30% ROT-avdrag. Boka idag!`,
    "vvs": `VVS-montör ${area} ★ 5/5 betyg ✓ Badrum, kök & värmesystem ✓ Auktoriserad ✓ 30% ROT-avdrag. Få offert inom 24h!`,
    "malare": `Målare ${area} ★ 5/5 betyg ✓ Invändig & utvändig målning ✓ 30% ROT-avdrag ✓ Garanti på arbetet. Boka målare!`,
    "stad": `Städhjälp ${area} ★ 5/5 betyg ✓ Hemstäd, flyttstäd & storstäd ✓ 30% RUT-avdrag ✓ Kvalitetsgaranti. Boka idag!`,
    "flytt": `Flytthjälp ${area} ★ 5/5 betyg ✓ Packning, transport & bärhjälp ✓ 30% RUT-avdrag ✓ Försäkrad flytt. Få gratis offert!`,
    "montering": `Monteringshjälp ${area} ★ 5/5 betyg ✓ IKEA-möbler, kök & garderober ✓ 30% RUT-avdrag. Ofta start samma dag!`,
    "tradgard": `Trädgårdshjälp ${area} ★ 5/5 betyg ✓ Trädfällning, häck & gräsmatta ✓ 30% ROT-avdrag. Boka trädgårdsmästare!`,
    "markarbeten": `Markarbeten ${area} ★ 5/5 betyg ✓ Dränering, plattsättning & grävning ✓ 30% ROT-avdrag. Gratis offert inom 24h!`,
    "tekniska-installationer": `Teknisk installation ${area} ★ 5/5 betyg ✓ Laddbox, smarta hem & AV ✓ 30% ROT-avdrag. Boka certifierad montör!`
  };
  
  return {
    h1: `${serviceNameCapital} ${area}`,
    
    title: titleTemplates[serviceSlug] || `${serviceNameCapital} ${area} – ${isEn ? 'Professional contractors' : 'Professionella hantverkare'} | ${rotRut} 30%`,
    
    description: descriptionTemplates[serviceSlug] || `${serviceNameCapital} ${isEn ? 'in' : 'i'} ${area} ★ 5/5 ${isEn ? 'rating' : 'betyg'} ✓ 30% ${rotRut}-${isEn ? 'deduction' : 'avdrag'} ✓ ${isEn ? 'Fixed price' : 'Fast pris'} ✓ ${isEn ? 'Quality guarantee' : 'Kvalitetsgaranti'}. ${isEn ? 'Get quote within 24h!' : 'Få offert inom 24h!'}`,
    
    intro: isEn
      ? `**Need ${serviceName} in ${area}?** You've come to the right place!

**With Fixco you get:**
- ★ 5/5 rating – our customers love us
- Fixed price – no surprises on the invoice
- 30% ${rotRut} deduction – we handle the paperwork for you
- Response within 24 hours
- Quality guarantee on all work
- Local contractors who know ${area}

**Describe your project** and we'll get back to you with a fixed price within 24 hours!`
      : `**Behöver du ${serviceName} i ${area}?** Du har kommit rätt!

**Med Fixco får du:**
- ★ 5/5 betyg – våra kunder älskar oss
- Fast pris – inga överraskningar på fakturan
- 30% ${rotRut}-avdrag – vi sköter pappersarbetet åt dig
- Svar inom 24 timmar
- Kvalitetsgaranti på allt arbete
- Lokala hantverkare som känner ${area}

**Beskriv ditt projekt** så återkommer vi med fast pris inom 24 timmar!`,
    
    localSection: {
      title: isEn ? `Your local ${serviceName} in ${area}` : `Din lokala ${serviceName} i ${area} nära mig`,
      content: isEn
        ? `Our ${serviceName} professionals in ${area} have experience helping all kinds of customers. Whether you need help with a large or small project in ${area}, you can be sure to find the right ${serviceName} in ${area}.

**${serviceNameCapital} in ${area} with Fixco:**
- Performs work according to your wishes in ${area}
- Works with high-quality materials in ${area}
- Gives you a fixed price and ${rotRut} deduction in ${area}
- Has local knowledge of ${area} and surrounding areas
- Can often start within 1-3 business days in ${area}

We understand it can be difficult to find a good ${serviceName} in ${area}. That's why we make it easy – you describe your project, we match you with the right ${serviceName} in ${area}, and you get a fixed price with ${rotRut} deduction directly.`
        : `Våra ${serviceName} i ${area} har erfarenhet av att hjälpa alla sorters kunder. Oavsett om du behöver hjälp med ett stort eller litet projekt i ${area} kan du vara säker på att hitta rätt ${serviceName} i ${area}. 

**${serviceNameCapital} i ${area} hos Fixco:**
- Utför arbetet enligt dina önskemål i ${area}
- Jobbar med material av hög kvalitet i ${area}
- Ger dig fast pris och ${rotRut}-avdrag i ${area}
- Har lokalkännedom om ${area} och omgivande områden
- Kan ofta starta redan inom 1-3 arbetsdagar i ${area}

Vi förstår att det kan vara svårt att hitta en bra ${serviceName} i ${area}. Därför gör vi det enkelt för dig – du beskriver ditt projekt, vi matchar dig med rätt ${serviceName} i ${area}, och du får ett fast pris med ${rotRut}-avdrag direkt.`
    },
    
    ctaSection: {
      title: isEn ? `Contact our ${serviceName} in ${area} for a quote` : `Kontakta våra ${serviceName} i ${area} för offert`,
      content: isEn
        ? `Through Fixco you can get a quote for ${serviceName} in ${area} and many other locations in ${metadata.region} county. We prioritize that everyone should have the opportunity to improve their home in ${area}.

When you hire ${serviceName} in ${area} through Fixco, you can use the ${rotRut} deduction of 30% on labor costs. This means a job costing 20,000 SEK in labor only costs you 14,000 SEK after the deduction!

**Contact us to find ${serviceName} in ${area}!**`
        : `Genom Fixco kan du få offert på ${serviceName} i ${area} och många andra orter i ${metadata.region}s län. Vi prioriterar att alla ska ha möjligheten att förbättra sitt hem i ${area}. 

När du anlitar ${serviceName} i ${area} via Fixco kan du utnyttja ${rotRut}-avdraget på 30% av arbetskostnaden. Det betyder att ett jobb som kostar 20 000 kr i arbetskostnad bara kostar dig 14 000 kr efter avdrag!

**Kontakta oss för att hitta ${serviceName} i ${area}!**`
    },

    servicesSection: {
      title: isEn ? `${serviceNameCapital} in ${area} can help with` : `${serviceNameCapital} i ${area} kan hjälpa till med`,
      items: getServiceItems(serviceSlug, area, locale)
    },

    rotRutSection: {
      title: isEn ? `${serviceNameCapital} with ${rotRut} deduction in ${area}` : `${serviceNameCapital} med ${rotRut}-avdrag i ${area}`,
      content: isEn
        ? `When you hire ${serviceName} in ${area} through Fixco, you get a ${rotRut} deduction of 30% on labor costs. The ${rotRut} deduction applies to ${rotRut === 'ROT' ? 'repair, maintenance, conversion and extension' : 'household services'} in your home in ${area}.

**How ${rotRut} deduction works in ${area}:**
1. You order ${serviceName} in ${area} through Fixco
2. We perform the work in your home in ${area}
3. You only pay 70% of the labor cost (30% ${rotRut})
4. We apply for the deduction for you at the Swedish Tax Agency

**Example of ${rotRut} deduction for ${serviceName} in ${area}:**
- Labor cost: 30,000 SEK
- ${rotRut} deduction (30%): -9,000 SEK
- **You pay: 21,000 SEK**

The maximum ${rotRut} deduction is ${rotRut === 'ROT' ? '50,000 SEK' : '75,000 SEK'} per person per year. If you haven't used your ${rotRut} deduction this year, it's the perfect time to hire ${serviceName} in ${area}!`
        : `När du anlitar ${serviceName} i ${area} via Fixco kan du få ${rotRut}-avdrag på 30% av arbetskostnaden. ${rotRut}-avdraget gäller för ${rotRut === 'ROT' ? 'reparation, underhåll, om- och tillbyggnad' : 'hushållsnära tjänster'} i din bostad i ${area}.

**Så fungerar ${rotRut}-avdrag i ${area}:**
1. Du beställer ${serviceName} i ${area} via Fixco
2. Vi utför arbetet i din bostad i ${area}
3. Du betalar bara 70% av arbetskostnaden (30% ${rotRut})
4. Vi ansöker om avdraget åt dig hos Skatteverket

**Exempel på ${rotRut}-avdrag för ${serviceName} i ${area}:**
- Arbetskostnad: 30 000 kr
- ${rotRut}-avdrag (30%): -9 000 kr
- **Du betalar: 21 000 kr**

Maxtaket för ${rotRut}-avdrag är ${rotRut === 'ROT' ? '50 000 kr' : '75 000 kr'} per person och år. Har du inte utnyttjat ditt ${rotRut}-avdrag i år är det perfekt tillfälle att anlita ${serviceName} i ${area}!`
    },

    faqs: (() => {
      const pricing = SERVICE_PRICING[serviceSlug];
      const priceAnswer = isEn
        ? (pricing.isQuoteOnly 
          ? `The price for ${serviceName} in ${area} varies depending on the scope and complexity of the project. Contact us for a free quote on your project in ${area}. All prices include ${rotRut} deduction (30%) when you hire ${serviceName} through Fixco.`
          : `The hourly rate for ${serviceName} in ${area} is ${pricing.base} before ${rotRut} deduction. After ${rotRut} deduction (30%) you pay ${pricing.afterDeduction} for ${serviceName} in ${area}. Contact us for an exact price on your project in ${area}.`)
        : (pricing.isQuoteOnly 
          ? `Priset för ${serviceName} i ${area} varierar beroende på projektets omfattning och komplexitet. Kontakta oss för en kostnadsfri offert på ditt projekt i ${area}. Alla priser inkluderar ${rotRut}-avdrag (30%) när du anlitar ${serviceName} via Fixco.`
          : `Timpriset för ${serviceName} i ${area} är ${pricing.base} före ${rotRut}-avdrag. Efter ${rotRut}-avdrag (30%) betalar du ${pricing.afterDeduction} för ${serviceName} i ${area}. Kontakta oss för exakt pris på ditt projekt i ${area}.`);
      
      return isEn ? [
        { q: `What does ${serviceName} cost per hour in ${area}?`, a: priceAnswer },
        { q: `How quickly can ${serviceName} come to ${area}?`, a: `Our ${serviceName} in ${area} can often come within 24-48 hours for smaller tasks. For larger projects in ${area}, we schedule a start date that suits you, usually within 1-2 weeks.` },
        { q: `Do I get ${rotRut} deduction for ${serviceName} in ${area}?`, a: `Yes! You get 30% ${rotRut} deduction on labor costs when you hire ${serviceName} in ${area} for work in your home. We handle all administration with the Swedish Tax Agency for you.` },
        { q: `What areas in ${area} do you cover?`, a: `We cover all of ${area} and all nearby areas. Regardless of where in ${area} you live, we can help you with ${serviceName}.` },
        { q: `Are your ${serviceName} in ${area} certified?`, a: `Yes, all our ${serviceName} in ${area} are certified and have relevant training. ${getCertificationText(serviceSlug, locale)}` },
        { q: `How do I book ${serviceName} in ${area}?`, a: `It's easy to book ${serviceName} in ${area}! You can call us, fill in our quote form, or use our online booking guide. Describe your project and we'll contact you with a fixed price within 24 hours.` }
      ] : [
        { q: `Vad kostar ${serviceName} i timmen i ${area}?`, a: priceAnswer },
        { q: `Hur snabbt kan ${serviceName} komma till ${area}?`, a: `Våra ${serviceName} i ${area} kan ofta komma inom 24-48 timmar för mindre uppdrag. För större projekt i ${area} bokar vi in ett startdatum som passar dig, vanligtvis inom 1-2 veckor. Vid akuta ärenden i ${area} försöker vi alltid hitta en snabb lösning.` },
        { q: `Får jag ${rotRut}-avdrag för ${serviceName} i ${area}?`, a: `Ja! Du får 30% ${rotRut}-avdrag på arbetskostnaden när du anlitar ${serviceName} i ${area} för arbeten i din bostad i ${area}. Detta gäller för privatpersoner som äger eller hyr sin bostad i ${area}. Vi hanterar all administration med Skatteverket åt dig.` },
        { q: `Vilka områden i ${area} täcker ni?`, a: `Vi täcker hela ${area} ${metadata.type} och alla närliggande områden. Oavsett var i ${area} du bor kan vi hjälpa dig med ${serviceName}. Vi har lokalkännedom om ${area} och vet hur man tar sig fram snabbt och effektivt.` },
        { q: `Är era ${serviceName} i ${area} certifierade?`, a: `Ja, alla våra ${serviceName} i ${area} är certifierade och har relevant utbildning för sina arbetsuppgifter. ${getCertificationText(serviceSlug, locale)} Vi ställer höga krav på alla hantverkare som arbetar för Fixco i ${area}.` },
        { q: `Hur bokar jag ${serviceName} i ${area}?`, a: `Det är enkelt att boka ${serviceName} i ${area}! Du kan antingen ringa oss, fylla i vårt offertformulär eller använda vår bokningsguide online. Beskriv ditt projekt i ${area} så kontaktar vi dig med ett fast pris inom 24 timmar.` }
      ];
    })(),

    quickFacts: isEn ? [
      `★ 5/5 rating from our customers`,
      `Response within 24 hours`,
      `Fixed price before work starts`,
      `30% ${rotRut} deduction`,
      `Quality guarantee on all work`,
      `Local contractors in ${area}`
    ] : [
      `★ 5/5 betyg från våra kunder`,
      `Svar inom 24 timmar`,
      `Fast pris innan jobbet börjar`,
      `30% ${rotRut}-avdrag`,
      `Kvalitetsgaranti på allt arbete`,
      `Lokala hantverkare i ${area}`
    ],

    funFacts: getAreaFunFacts(area),
    
    myths: getServiceMyths(serviceSlug)
  };
};

// Hjälpfunktion för att hämta tjänster per kategori
function getServiceItems(serviceSlug: LocalServiceSlug, area: string, locale: 'sv' | 'en' = 'sv'): string[] {
  const isEn = locale === 'en';
  if (isEn) {
    const enItems: Record<LocalServiceSlug, string[]> = {
      "snickare": [`Kitchen renovation in ${area}`, `Build deck in ${area}`, `Interior carpentry in ${area}`, `Window & door replacement in ${area}`, `Flooring in ${area}`, `Bathroom renovation in ${area}`, `Attic/basement conversion in ${area}`, `Facade renovation in ${area}`, `Kitchen & wardrobe assembly in ${area}`, `Extensions in ${area}`],
      "elektriker": [`Electrical installation in ${area}`, `Electrical troubleshooting in ${area}`, `Panel upgrade in ${area}`, `Lighting installation in ${area}`, `Ground fault breaker in ${area}`, `EV charger in ${area}`, `Smart home installation in ${area}`, `Electrical inspection in ${area}`, `Outlet & switch replacement in ${area}`, `Outdoor lighting in ${area}`],
      "vvs": [`Plumbing installation in ${area}`, `Faucet replacement in ${area}`, `Heat pump installation in ${area}`, `Drain cleaning in ${area}`, `Bathroom plumbing in ${area}`, `Underfloor heating in ${area}`, `Emergency water leak in ${area}`, `Toilet replacement in ${area}`, `Radiator installation in ${area}`, `Water heater in ${area}`],
      "malare": [`Interior painting in ${area}`, `Facade painting in ${area}`, `Wallpapering in ${area}`, `Woodwork lacquering in ${area}`, `Ceiling painting in ${area}`, `Kitchen painting in ${area}`, `Wood facade renovation in ${area}`, `Plastering & sanding in ${area}`, `Color consultation in ${area}`, `Window & door painting in ${area}`],
      "tradgard": [`Lawn mowing in ${area}`, `Hedge trimming in ${area}`, `Tree felling in ${area}`, `Garden landscaping in ${area}`, `Paving in ${area}`, `Planting in ${area}`, `Weed removal in ${area}`, `Bush & tree pruning in ${area}`, `Garden design in ${area}`, `Snow removal in ${area}`],
      "stad": [`Home cleaning in ${area}`, `Office cleaning in ${area}`, `Move-out cleaning in ${area}`, `Window cleaning in ${area}`, `Deep cleaning in ${area}`, `Stairwell cleaning in ${area}`, `Construction cleaning in ${area}`, `Regular cleaning in ${area}`, `Deep sanitizing in ${area}`, `Post-renovation cleaning in ${area}`],
      "markarbeten": [`Excavation in ${area}`, `Drainage in ${area}`, `Driveway construction in ${area}`, `Foundation work in ${area}`, `Retaining walls in ${area}`, `Land planning in ${area}`, `Utility work in ${area}`, `Paving & tiling in ${area}`, `Digging work in ${area}`, `Pool construction in ${area}`],
      "montering": [`Furniture assembly in ${area}`, `IKEA assembly in ${area}`, `Kitchen assembly in ${area}`, `Wardrobe assembly in ${area}`, `TV mounting in ${area}`, `Light fixture mounting in ${area}`, `Bathroom furniture in ${area}`, `Office furniture in ${area}`, `Outdoor furniture in ${area}`, `Children's furniture in ${area}`],
      "flytt": [`Moving help in ${area}`, `Office moving in ${area}`, `Storage in ${area}`, `Packing help in ${area}`, `Piano moving in ${area}`, `Household moving in ${area}`, `Student moving in ${area}`, `Business moving in ${area}`, `Estate clearance in ${area}`, `Heavy item moving in ${area}`],
      "tekniska-installationer": [`Smart home installation in ${area}`, `Alarm installation in ${area}`, `Security cameras in ${area}`, `Motorized blinds in ${area}`, `Sound system in ${area}`, `Network installation in ${area}`, `Home automation in ${area}`, `Solar panel installation in ${area}`, `Ventilation installation in ${area}`, `Gate automation in ${area}`],
    };
    return enItems[serviceSlug] || [];
  }
  const serviceItems: Record<LocalServiceSlug, string[]> = {
    "snickare": [`Köksrenovering i ${area}`, `Bygga altan och trädäck i ${area}`, `Inredningssnickeri i ${area}`, `Fönster- och dörrbyte i ${area}`, `Golvläggning i ${area}`, `Badrumsrenovering i ${area}`, `Bygga om vind/källare i ${area}`, `Fasadrenovering i ${area}`, `Montering av kök och garderober i ${area}`, `Tillbyggnader och utbyggnader i ${area}`],
    "elektriker": [`Elinstallation i ${area}`, `Felsökning av el i ${area}`, `Byte av elcentral i ${area}`, `Installation av belysning i ${area}`, `Jordfelsbrytare installation i ${area}`, `Laddbox för elbil i ${area}`, `Smart hem installation i ${area}`, `Elbesiktning i ${area}`, `Byte av uttag och strömbrytare i ${area}`, `Utomhusbelysning i ${area}`],
    "vvs": [`VVS-installation i ${area}`, `Byte av blandare i ${area}`, `Värmepump installation i ${area}`, `Avloppsrensning i ${area}`, `Badrumsrenovering VVS i ${area}`, `Golvvärme installation i ${area}`, `Vattenläcka akut i ${area}`, `Byte av toalettstol i ${area}`, `Radiatorinstallation i ${area}`, `Varmvattenberedare i ${area}`],
    "malare": [`Invändig målning i ${area}`, `Fasadmålning i ${area}`, `Tapetsering i ${area}`, `Lackning av snickerier i ${area}`, `Målning av tak i ${area}`, `Målning av kök i ${area}`, `Renovering av träfasad i ${area}`, `Spackling och slipning i ${area}`, `Färgsättning och rådgivning i ${area}`, `Målning av fönster och dörrar i ${area}`],
    "tradgard": [`Gräsklippning i ${area}`, `Häckklippning i ${area}`, `Trädfällning i ${area}`, `Anlägga trädgård i ${area}`, `Stenläggning i ${area}`, `Plantering i ${area}`, `Ogräsrensning i ${area}`, `Beskärning av buskar och träd i ${area}`, `Trädgårdsdesign i ${area}`, `Snöröjning i ${area}`],
    "stad": [`Hemstädning i ${area}`, `Kontorsstädning i ${area}`, `Flyttstädning i ${area}`, `Fönsterputs i ${area}`, `Storstädning i ${area}`, `Trappstädning i ${area}`, `Byggstädning i ${area}`, `Regelbunden städning i ${area}`, `Djuprengöring i ${area}`, `Städning efter renovering i ${area}`],
    "markarbeten": [`Schaktning i ${area}`, `Dränering i ${area}`, `Anlägga uppfart i ${area}`, `Grundläggning i ${area}`, `Murar och stödmurar i ${area}`, `Planering av tomt i ${area}`, `VA-arbeten i ${area}`, `Stenläggning och plattsättning i ${area}`, `Grävarbeten i ${area}`, `Pool- och dammanläggning i ${area}`],
    "montering": [`Möbelmontering i ${area}`, `IKEA-montering i ${area}`, `Köksmontering i ${area}`, `Garderobsmontering i ${area}`, `TV-montering i ${area}`, `Lampmontering i ${area}`, `Badrumsmöbler i ${area}`, `Kontorsmöbler i ${area}`, `Utomhusmöbler i ${area}`, `Barnmöbler och leksaker i ${area}`],
    "flytt": [`Flytthjälp i ${area}`, `Kontorsflytt i ${area}`, `Magasinering i ${area}`, `Packhjälp i ${area}`, `Pianoflytt i ${area}`, `Bohagsflytt i ${area}`, `Studentflytt i ${area}`, `Företagsflytt i ${area}`, `Dödsbo och tömning i ${area}`, `Flytt av tunga saker i ${area}`],
    "tekniska-installationer": [`Smart hem installation i ${area}`, `Larminstallation i ${area}`, `Kameraövervakning i ${area}`, `Motoriserade persienner i ${area}`, `Ljudsystem i ${area}`, `Nätverksinstallation i ${area}`, `Hemautomation i ${area}`, `Solceller installation i ${area}`, `Ventilationsinstallation i ${area}`, `Portautomatik i ${area}`],
  };
  return serviceItems[serviceSlug] || [];
}

// Hjälpfunktion för certifieringstext
function getCertificationText(serviceSlug: LocalServiceSlug, locale: 'sv' | 'en' = 'sv'): string {
  const isEn = locale === 'en';
  const certTexts: Record<LocalServiceSlug, string> = isEn ? {
    "elektriker": "Electricians are authorized according to the Swedish Electrical Safety Authority and work according to current regulations.",
    "vvs": "Plumbers have Safe Water Installation certification and work according to industry standards.",
    "snickare": "Carpenters have professional certificates and extensive experience in all types of carpentry.",
    "malare": "Painters are trained professionals with experience in both interior and exterior painting.",
    "tradgard": "Gardeners have relevant training and certification for safe work.",
    "stad": "Cleaning staff are trained and follow high hygiene standards.",
    "markarbeten": "Groundwork contractors are licensed for excavation and carry liability insurance.",
    "montering": "Assemblers have experience with all types of furniture assembly and are meticulous.",
    "flytt": "Moving staff are trained in safe handling and have good physical fitness.",
    "tekniska-installationer": "Technicians are certified for their respective systems and products."
  } : {
    "elektriker": "Elektriker har behörighet enligt Elsäkerhetsverket och arbetar enligt gällande föreskrifter.",
    "vvs": "VVS-montörer har Säker Vatteninstallation-certifiering och arbetar enligt branschregler.",
    "snickare": "Snickare har yrkesbevis och lång erfarenhet av alla typer av snickeritjänster.",
    "malare": "Målare är utbildade yrkesmålare med erfarenhet av både invändig och utvändig målning.",
    "tradgard": "Trädgårdsarbetare har relevant utbildning och certifiering för säkert arbete.",
    "stad": "Städpersonal är utbildade och följer höga hygienrutiner.",
    "markarbeten": "Markentreprenörer har behörighet för grävmaskin och är ansvarsförsäkrade.",
    "montering": "Montörer har erfarenhet av alla typer av möbelmontering och är noggranna.",
    "flytt": "Flyttpersonal är utbildade i säker hantering och har god fysik.",
    "tekniska-installationer": "Tekniker har certifiering för respektive system och produkter."
  };
  return certTexts[serviceSlug];
}

// ============================================================
// VALIDERING - Kontrollera att slug-kombination finns
// ============================================================

export const isValidLocalServicePage = (serviceSlug: string, areaSlug: string): boolean => {
  const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug);
  if (!service) return false;
  
  const area = ALL_AREAS.find(a => generateAreaSlug(a) === areaSlug);
  return !!area;
};

export const getAreaFromSlug = (slug: string): AreaKey | undefined => {
  return ALL_AREAS.find(a => generateAreaSlug(a) === slug);
};

export const getServiceFromSlug = (slug: string) => {
  return LOCAL_SERVICES.find(s => s.slug === slug);
};

// ============================================================
// SITEMAP HELPERS - Generera alla URL:er
// ============================================================

export const generateAllLocalServiceUrls = (): string[] => {
  const urls: string[] = [];
  
  for (const service of LOCAL_SERVICES) {
    for (const area of ALL_AREAS) {
      const areaSlug = generateAreaSlug(area);
      urls.push(`/tjanster/${service.slug}/${areaSlug}`);
    }
  }
  
  return urls;
};

// Räknar totalt antal sidor
export const getTotalLocalPages = (): number => {
  return LOCAL_SERVICES.length * ALL_AREAS.length;
};
