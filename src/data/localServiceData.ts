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

export const generateLocalContent = (serviceSlug: LocalServiceSlug, area: AreaKey): LocalServiceContent => {
  const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug)!;
  const serviceName = service.name.toLowerCase();
  const serviceNameCapital = service.name;
  const rotRut = service.rotRut;
  const metadata = getAreaMetadata(area);
  
  return {
    h1: `${serviceNameCapital} ${area}`,
    
    title: `${serviceNameCapital} ${area} – Professionella hantverkare i ${area} | ${rotRut} 50%`,
    
    description: `Söker du ${serviceName} i ${area}? Fixco erbjuder erfarna ${serviceName} i ${area} för alla typer av jobb. Snabb start, bra priser och ${rotRut}-avdrag i ${area}. Ring oss idag!`,
    
    intro: `Letar du efter en pålitlig **${serviceName} i ${area}**? Hos Fixco hjälper vi dig att hitta den bästa ${serviceName} i ${area} för ditt projekt. Våra ${serviceName} i ${area} har lång erfarenhet och levererar alltid kvalitetsarbete. Vi täcker hela ${area} ${metadata.type} med omnejd och kan ofta starta inom 24-48 timmar.

${area} är en ${metadata.type} i ${metadata.region}s län med cirka ${metadata.population} invånare. Vi på Fixco har hjälpt hundratals kunder i ${area} med ${serviceName}-tjänster och vet exakt vilka utmaningar som finns i området. Oavsett om du bor i en villa, lägenhet eller radhus i ${area} kan vi hjälpa dig.`,
    
    localSection: {
      title: `Din lokala ${serviceName} i ${area} nära mig`,
      content: `Våra ${serviceName} i ${area} har erfarenhet av att hjälpa alla sorters kunder. Oavsett om du behöver hjälp med ett stort eller litet projekt i ${area} kan du vara säker på att hitta rätt ${serviceName} i ${area}. 

**${serviceNameCapital} i ${area} hos Fixco:**
- Utför arbetet enligt dina önskemål i ${area}
- Jobbar med material av hög kvalitet i ${area}
- Ger dig fast pris och ${rotRut}-avdrag i ${area}
- Har lokalkännedom om ${area} och omgivande områden
- Kan ofta starta redan inom 1-3 arbetsdagar i ${area}

Vi förstår att det kan vara svårt att hitta en bra ${serviceName} i ${area}. Därför gör vi det enkelt för dig – du beskriver ditt projekt, vi matchar dig med rätt ${serviceName} i ${area}, och du får ett fast pris med ${rotRut}-avdrag direkt.`
    },
    
    ctaSection: {
      title: `Kontakta våra ${serviceName} i ${area} för offert`,
      content: `Genom Fixco kan du få offert på ${serviceName} i ${area} och många andra orter i ${metadata.region}s län. Vi prioriterar att alla ska ha möjligheten att förbättra sitt hem i ${area}. 

När du anlitar ${serviceName} i ${area} via Fixco kan du utnyttja ${rotRut}-avdraget på 50% av arbetskostnaden. Det betyder att ett jobb som kostar 20 000 kr i arbetskostnad bara kostar dig 10 000 kr efter avdrag!

**Kontakta oss för att hitta ${serviceName} i ${area}!**`
    },

    servicesSection: {
      title: `${serviceNameCapital} i ${area} kan hjälpa till med`,
      items: getServiceItems(serviceSlug, area)
    },

    rotRutSection: {
      title: `${serviceNameCapital} med ${rotRut}-avdrag i ${area}`,
      content: `När du anlitar ${serviceName} i ${area} via Fixco kan du få ${rotRut}-avdrag på 50% av arbetskostnaden. ${rotRut}-avdraget gäller för ${rotRut === 'ROT' ? 'reparation, underhåll, om- och tillbyggnad' : 'hushållsnära tjänster'} i din bostad i ${area}.

**Så fungerar ${rotRut}-avdrag i ${area}:**
1. Du beställer ${serviceName} i ${area} via Fixco
2. Vi utför arbetet i din bostad i ${area}
3. Du betalar bara halva arbetskostnaden (50% ${rotRut})
4. Vi ansöker om avdraget åt dig hos Skatteverket

**Exempel på ${rotRut}-avdrag för ${serviceName} i ${area}:**
- Arbetskostnad: 30 000 kr
- ${rotRut}-avdrag (50%): -15 000 kr
- **Du betalar: 15 000 kr**

Maxtaket för ${rotRut}-avdrag är ${rotRut === 'ROT' ? '50 000 kr' : '75 000 kr'} per person och år. Har du inte utnyttjat ditt ${rotRut}-avdrag i år är det perfekt tillfälle att anlita ${serviceName} i ${area}!`
    },

    faqs: (() => {
      const pricing = SERVICE_PRICING[serviceSlug];
      const priceAnswer = pricing.isQuoteOnly 
        ? `Priset för ${serviceName} i ${area} varierar beroende på projektets omfattning och komplexitet. Kontakta oss för en kostnadsfri offert på ditt projekt i ${area}. Alla priser inkluderar ${rotRut}-avdrag (50%) när du anlitar ${serviceName} via Fixco.`
        : `Timpriset för ${serviceName} i ${area} är ${pricing.base} före ${rotRut}-avdrag. Efter ${rotRut}-avdrag (50%) betalar du ${pricing.afterDeduction} för ${serviceName} i ${area}. Kontakta oss för exakt pris på ditt projekt i ${area}.`;
      
      return [
        {
          q: `Vad kostar ${serviceName} i timmen i ${area}?`,
          a: priceAnswer
        },
        {
          q: `Hur snabbt kan ${serviceName} komma till ${area}?`,
          a: `Våra ${serviceName} i ${area} kan ofta komma inom 24-48 timmar för mindre uppdrag. För större projekt i ${area} bokar vi in ett startdatum som passar dig, vanligtvis inom 1-2 veckor. Vid akuta ärenden i ${area} försöker vi alltid hitta en snabb lösning.`
        },
        {
          q: `Får jag ${rotRut}-avdrag för ${serviceName} i ${area}?`,
          a: `Ja! Du får 50% ${rotRut}-avdrag på arbetskostnaden när du anlitar ${serviceName} i ${area} för arbeten i din bostad. Detta gäller för privatpersoner som äger eller hyr sin bostad i ${area}. Vi hanterar all administration med Skatteverket åt dig.`
        },
        {
          q: `Vilka områden i ${area} täcker ni?`,
          a: `Vi täcker hela ${area} ${metadata.type} och alla närliggande områden. Oavsett var i ${area} du bor kan vi hjälpa dig med ${serviceName}. Vi har lokalkännedom om ${area} och vet hur man tar sig fram snabbt och effektivt.`
        },
        {
          q: `Är era ${serviceName} i ${area} certifierade?`,
          a: `Ja, alla våra ${serviceName} i ${area} är certifierade och har relevant utbildning för sina arbetsuppgifter. ${getCertificationText(serviceSlug)} Vi ställer höga krav på alla hantverkare som arbetar för Fixco i ${area}.`
        },
        {
          q: `Hur bokar jag ${serviceName} i ${area}?`,
          a: `Det är enkelt att boka ${serviceName} i ${area}! Du kan antingen ringa oss, fylla i vårt offertformulär eller använda vår bokningsguide online. Beskriv ditt projekt i ${area} så kontaktar vi dig med ett fast pris inom 24 timmar.`
        }
      ];
    })(),

    quickFacts: [
      `${area} ligger i ${metadata.region}s län`,
      `Cirka ${metadata.population} invånare i ${area}`,
      `Fixco erbjuder ${serviceName} i hela ${area}`,
      `50% ${rotRut}-avdrag på ${serviceName} i ${area}`,
      `Start inom 24-48 timmar i ${area}`,
      `Fasta priser för ${serviceName} i ${area}`,
      `Lokala hantverkare med kännedom om ${area}`
    ],

    funFacts: getAreaFunFacts(area),
    
    myths: getServiceMyths(serviceSlug)
  };
};

// Hjälpfunktion för att hämta tjänster per kategori
function getServiceItems(serviceSlug: LocalServiceSlug, area: string): string[] {
  const serviceItems: Record<LocalServiceSlug, string[]> = {
    "snickare": [
      `Köksrenovering i ${area}`,
      `Bygga altan och trädäck i ${area}`,
      `Inredningssnickeri i ${area}`,
      `Fönster- och dörrbyte i ${area}`,
      `Golvläggning i ${area}`,
      `Badrumsrenovering i ${area}`,
      `Bygga om vind/källare i ${area}`,
      `Fasadrenovering i ${area}`,
      `Montering av kök och garderober i ${area}`,
      `Tillbyggnader och utbyggnader i ${area}`
    ],
    "elektriker": [
      `Elinstallation i ${area}`,
      `Felsökning av el i ${area}`,
      `Byte av elcentral i ${area}`,
      `Installation av belysning i ${area}`,
      `Jordfelsbrytare installation i ${area}`,
      `Laddbox för elbil i ${area}`,
      `Smart hem installation i ${area}`,
      `Elbesiktning i ${area}`,
      `Byte av uttag och strömbrytare i ${area}`,
      `Utomhusbelysning i ${area}`
    ],
    "vvs": [
      `VVS-installation i ${area}`,
      `Byte av blandare i ${area}`,
      `Värmepump installation i ${area}`,
      `Avloppsrensning i ${area}`,
      `Badrumsrenovering VVS i ${area}`,
      `Golvvärme installation i ${area}`,
      `Vattenläcka akut i ${area}`,
      `Byte av toalettstol i ${area}`,
      `Radiatorinstallation i ${area}`,
      `Varmvattenberedare i ${area}`
    ],
    "malare": [
      `Invändig målning i ${area}`,
      `Fasadmålning i ${area}`,
      `Tapetsering i ${area}`,
      `Lackning av snickerier i ${area}`,
      `Målning av tak i ${area}`,
      `Målning av kök i ${area}`,
      `Renovering av träfasad i ${area}`,
      `Spackling och slipning i ${area}`,
      `Färgsättning och rådgivning i ${area}`,
      `Målning av fönster och dörrar i ${area}`
    ],
    "tradgard": [
      `Gräsklippning i ${area}`,
      `Häckklippning i ${area}`,
      `Trädfällning i ${area}`,
      `Anlägga trädgård i ${area}`,
      `Stenläggning i ${area}`,
      `Plantering i ${area}`,
      `Ogräsrensning i ${area}`,
      `Beskärning av buskar och träd i ${area}`,
      `Trädgårdsdesign i ${area}`,
      `Snöröjning i ${area}`
    ],
    "stad": [
      `Hemstädning i ${area}`,
      `Kontorsstädning i ${area}`,
      `Flyttstädning i ${area}`,
      `Fönsterputs i ${area}`,
      `Storstädning i ${area}`,
      `Trappstädning i ${area}`,
      `Byggstädning i ${area}`,
      `Regelbunden städning i ${area}`,
      `Djuprengöring i ${area}`,
      `Städning efter renovering i ${area}`
    ],
    "markarbeten": [
      `Schaktning i ${area}`,
      `Dränering i ${area}`,
      `Anlägga uppfart i ${area}`,
      `Grundläggning i ${area}`,
      `Murar och stödmurar i ${area}`,
      `Planering av tomt i ${area}`,
      `VA-arbeten i ${area}`,
      `Stenläggning och plattsättning i ${area}`,
      `Grävarbeten i ${area}`,
      `Pool- och dammanläggning i ${area}`
    ],
    "montering": [
      `Möbelmontering i ${area}`,
      `IKEA-montering i ${area}`,
      `Köksmontering i ${area}`,
      `Garderobsmontering i ${area}`,
      `TV-montering i ${area}`,
      `Lampmontering i ${area}`,
      `Badrumsmöbler i ${area}`,
      `Kontorsmöbler i ${area}`,
      `Utomhusmöbler i ${area}`,
      `Barnmöbler och leksaker i ${area}`
    ],
    "flytt": [
      `Flytthjälp i ${area}`,
      `Kontorsflytt i ${area}`,
      `Magasinering i ${area}`,
      `Packhjälp i ${area}`,
      `Pianoflytt i ${area}`,
      `Bohagsflytt i ${area}`,
      `Studentflytt i ${area}`,
      `Företagsflytt i ${area}`,
      `Dödsbo och tömning i ${area}`,
      `Flytt av tunga saker i ${area}`
    ],
    "tekniska-installationer": [
      `Smart hem installation i ${area}`,
      `Larminstallation i ${area}`,
      `Kameraövervakning i ${area}`,
      `Motoriserade persienner i ${area}`,
      `Ljudsystem i ${area}`,
      `Nätverksinstallation i ${area}`,
      `Hemautomation i ${area}`,
      `Solceller installation i ${area}`,
      `Ventilationsinstallation i ${area}`,
      `Portautomatik i ${area}`
    ]
  };

  return serviceItems[serviceSlug] || [];
}

// Hjälpfunktion för certifieringstext
function getCertificationText(serviceSlug: LocalServiceSlug): string {
  const certTexts: Record<LocalServiceSlug, string> = {
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
