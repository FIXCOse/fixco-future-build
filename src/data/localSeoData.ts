// ============================================================
// LOKAL SEO DATA - Baserat på Google Search Console data
// ============================================================
// Innehåller sökmönster, grannorter och unikt innehåll per ort

import type { LocalServiceSlug, AreaKey } from './localServiceData';
import { getAreaMetadata, LOCAL_SERVICES } from './localServiceData';

// ============================================================
// SEARCH ACTION PATTERNS - Baserat på faktisk GSC-data
// ============================================================
export const SEARCH_ACTION_PATTERNS: Record<LocalServiceSlug, {
  actions: string[];
  objects: string[];
  urgentTerms: string[];
  projectTypes: string[];
  synonyms: string[];
}> = {
  "snickare": {
    actions: ["bygga", "renovera", "montera", "boka", "hitta"],
    objects: ["kök", "altan", "garderob", "dörrar", "fönster", "trappa", "badrum", "vind", "fasad"],
    urgentTerms: ["snabb snickare", "akut snickare", "duktig snickare", "bra snickare", "professionell snickare"],
    projectTypes: ["köksrenovering", "köksmontering", "altanbygge", "finsnickeri", "möbelsnickeri", "platsbyggda kök", "totalrenovering", "snickerier", "golvläggning", "ombyggnation"],
    synonyms: ["hantverkare", "byggfirma", "byggföretag", "finsnickare", "möbelsnickare", "snickeri"]
  },
  "vvs": {
    actions: ["byta", "installera", "reparera", "montera", "felsöka", "lagning"],
    objects: ["toalettstol", "wc-stol", "toalett", "blandare", "kran", "handfat", "flottör", "duschblandare", "avhärdare", "golvvärme", "värmesystem"],
    urgentTerms: ["akuthjälp vvs", "vattenläcka", "droppande kran", "vvs jour"],
    projectTypes: ["vvs-installation", "badrumsrenovering", "vvs service", "golvvärme installation", "reparation av värmesystem"],
    synonyms: ["vvs firma", "rörmokare", "vvs-hantverkare", "vvs installatör"]
  },
  "elektriker": {
    actions: ["byta", "installera", "reparera", "felsöka", "montera"],
    objects: ["elcentral", "tryckströmbrytare", "laddbox", "uttag", "lampor", "säkringar", "jordfelsbrytare"],
    urgentTerms: ["eljour", "akut elektriker", "el reparation"],
    projectTypes: ["elinstallation", "byte av elcentral", "laddbox installation", "installation laddbox"],
    synonyms: ["elektriker firma", "elfirma", "elinstallatör"]
  },
  "malare": {
    actions: ["måla", "tapetsera", "spackling", "lackera"],
    objects: ["fasad", "tak", "väggar", "rum", "hus", "fönster", "dörrar", "snickerier"],
    urgentTerms: ["snabb målare"],
    projectTypes: ["fasadmålning", "invändig målning", "utvändig målning", "lägenhetsmålning", "våtrumsmålning", "inomhusmålning", "bättringsmålning", "reparationsmålning", "utvändig måleri", "invändig måleri", "golvmålning", "takmålning"],
    synonyms: ["måleri", "målare firma", "måleriföretag"]
  },
  "stad": {
    actions: ["boka", "beställa", "hitta"],
    objects: ["lägenhet", "hus", "kontor", "trappa", "butik", "fönster"],
    urgentTerms: ["snabb städ", "akut städhjälp", "bästa flyttstäd"],
    projectTypes: ["hemstädning", "flyttstädning", "byggstädning", "storstädning", "kontorsstädning", "trappstädning", "visningstädning", "butiksstäd", "abonnemangstädning", "garagestädning", "djuprengöring"],
    synonyms: ["städfirma", "städföretag", "hemstäd", "flyttstäd", "byggstäd", "kontorsstäd"]
  },
  "markarbeten": {
    actions: ["planera", "anlägga", "gräva", "utföra"],
    objects: ["tomt", "uppfart", "pool", "stödmur", "dränering"],
    urgentTerms: [],
    projectTypes: ["schaktning", "schaktarbeten", "dränering", "markanläggning", "tomtplanering", "stenläggning", "plattsättning", "markarbete", "schakt"],
    synonyms: ["markentreprenad", "grävfirma", "schaktfirma"]
  },
  "montering": {
    actions: ["montera", "installera", "sätta upp", "hjälp med"],
    objects: ["möbler", "ikea möbler", "garderob", "soffa", "kök", "kontorsmöbler", "dörrar", "badrum", "duschväggar", "tv", "panel"],
    urgentTerms: [],
    projectTypes: ["möbelmontering", "köksmontering", "garderobsmontering", "monteringshjälp", "IKEA-montering", "köksinstallation", "dörrmontering", "tv montering"],
    synonyms: ["monteringsfirma", "monteringshjälp", "fixare", "handyman"]
  },
  "flytt": {
    actions: ["boka", "beställa", "hitta"],
    objects: ["lägenhet", "villa", "kontor", "bohag", "piano"],
    urgentTerms: ["akut flytthjälp"],
    projectTypes: ["flytthjälp", "packhjälp", "bärhjälp", "transporthjälp", "bohagsflytt", "kontorsflytt", "flyttpackning", "studentflytt"],
    synonyms: ["flyttfirma", "flyttföretag", "bärhjälp"]
  },
  "tradgard": {
    actions: ["anlägga", "planera", "sköta", "beskära", "fälla", "klippa"],
    objects: ["trädgård", "häck", "träd", "buskar", "gräsmatta", "ogräs"],
    urgentTerms: ["akut trädfällning"],
    projectTypes: ["trädgårdsanläggning", "trädgårdsskötsel", "trädgårdsdesign", "trädgårdsplanering", "trädfällning", "ogräsrensning", "plantering", "trädgårdsentreprenad", "stenläggning"],
    synonyms: ["trädgårdsmästare", "trädgårdshjälp", "trädgårdsfirma", "trädgårdsentreprenör"]
  },
  "tekniska-installationer": {
    actions: ["installera", "montera", "sätta upp", "konfigurera"],
    objects: ["laddbox", "fiber", "larm", "nätverk", "kamera", "solceller", "värmepump"],
    urgentTerms: [],
    projectTypes: ["laddbox installation", "larm montering", "nätverksinstallation", "fiberinstallation", "smart hem installation", "tv installation service"],
    synonyms: ["installatör", "tekniker", "fiberinstallatör"]
  }
};

// ============================================================
// NEARBY AREAS MAP - För intern länkning och lokalt innehåll
// ============================================================
export const NEARBY_AREAS_MAP: Record<string, string[]> = {
  // Uppsala-regionen
  "Uppsala": ["Storvreta", "Knivsta", "Björklinge", "Alsike", "Sävja", "Gamla Uppsala", "Eriksberg", "Gottsunda", "Sunnersta", "Bälinge"],
  "Knivsta": ["Uppsala", "Märsta", "Sigtuna", "Alsike", "Storvreta"],
  "Storvreta": ["Uppsala", "Björklinge", "Vattholma", "Bälinge"],
  "Björklinge": ["Uppsala", "Storvreta", "Tierp", "Bälinge"],
  "Alsike": ["Knivsta", "Uppsala", "Märsta"],
  "Sävja": ["Uppsala", "Gottsunda", "Sunnersta", "Eriksberg"],
  "Eriksberg": ["Uppsala", "Sävja", "Storvreta"],
  "Gottsunda": ["Uppsala", "Sävja", "Sunnersta"],
  "Sunnersta": ["Uppsala", "Gottsunda", "Sävja"],
  "Gamla Uppsala": ["Uppsala", "Storvreta", "Björklinge"],
  "Bälinge": ["Uppsala", "Storvreta", "Björklinge"],
  "Vattholma": ["Storvreta", "Uppsala", "Tierp"],
  "Gränby": ["Uppsala", "Storvreta", "Eriksberg"],
  "Ultuna": ["Uppsala", "Sunnersta", "Gottsunda"],
  "Tierp": ["Uppsala", "Östhammar", "Storvreta"],
  "Enköping": ["Uppsala", "Bålsta", "Västerås", "Håbo"],
  "Östhammar": ["Uppsala", "Tierp", "Norrtälje"],
  "Skyttorp": ["Storvreta", "Uppsala", "Tierp"],
  "Lövstalöt": ["Uppsala", "Storvreta", "Björklinge"],
  
  // Stockholm centrum
  "Stockholm": ["Södermalm", "Kungsholmen", "Vasastan", "Östermalm", "Bromma", "Hägersten", "Solna", "Sundbyberg"],
  "Södermalm": ["Stockholm", "Hägersten", "Nacka", "Kungsholmen"],
  "Kungsholmen": ["Stockholm", "Bromma", "Solna", "Vasastan", "Södermalm"],
  "Vasastan": ["Stockholm", "Kungsholmen", "Solna", "Östermalm"],
  "Östermalm": ["Stockholm", "Vasastan", "Lidingö", "Danderyd"],
  "Bromma": ["Stockholm", "Kungsholmen", "Sundbyberg", "Solna", "Ekerö"],
  "Hägersten": ["Stockholm", "Södermalm", "Huddinge", "Botkyrka"],
  
  // Norra förorter
  "Täby": ["Danderyd", "Vallentuna", "Åkersberga", "Sollentuna", "Lidingö"],
  "Danderyd": ["Täby", "Stockholm", "Lidingö", "Sollentuna", "Östermalm"],
  "Sollentuna": ["Täby", "Danderyd", "Solna", "Järfälla", "Sundbyberg"],
  "Solna": ["Stockholm", "Sundbyberg", "Sollentuna", "Danderyd", "Bromma"],
  "Sundbyberg": ["Solna", "Stockholm", "Bromma", "Sollentuna"],
  "Lidingö": ["Stockholm", "Danderyd", "Nacka", "Östermalm"],
  "Vallentuna": ["Täby", "Åkersberga", "Upplands Väsby", "Norrtälje"],
  "Upplands Väsby": ["Sollentuna", "Sigtuna", "Vallentuna", "Järfälla"],
  "Upplands-Bro": ["Järfälla", "Sigtuna", "Bålsta", "Ekerö"],
  "Järfälla": ["Sollentuna", "Sundbyberg", "Upplands-Bro", "Upplands Väsby", "Ekerö"],
  "Sigtuna": ["Märsta", "Upplands Väsby", "Knivsta", "Vallentuna", "Arlanda"],
  "Märsta": ["Sigtuna", "Upplands Väsby", "Knivsta", "Stockholm"],
  "Norrtälje": ["Vallentuna", "Åkersberga", "Rimbo", "Hallstavik"],
  "Åkersberga": ["Täby", "Vallentuna", "Norrtälje", "Vaxholm"],
  "Vaxholm": ["Åkersberga", "Lidingö", "Nacka"],
  
  // Södra förorter
  "Huddinge": ["Stockholm", "Botkyrka", "Haninge", "Södertälje", "Hägersten"],
  "Botkyrka": ["Huddinge", "Stockholm", "Salem", "Södertälje", "Hägersten"],
  "Nacka": ["Stockholm", "Värmdö", "Tyresö", "Haninge", "Lidingö"],
  "Haninge": ["Nacka", "Tyresö", "Huddinge", "Nynäshamn"],
  "Tyresö": ["Nacka", "Haninge", "Stockholm"],
  "Nynäshamn": ["Haninge", "Södertälje", "Huddinge"],
  "Salem": ["Botkyrka", "Södertälje", "Ekerö"],
  "Södertälje": ["Huddinge", "Botkyrka", "Salem", "Nykvarn", "Järna"],
  "Nykvarn": ["Södertälje", "Järna", "Salem"],
  "Järna": ["Södertälje", "Nykvarn", "Gnesta"],
  
  // Värmdö & Skärgård
  "Värmdö": ["Nacka", "Gustavsberg", "Stockholm"],
  
  // Ekerö
  "Ekerö": ["Bromma", "Upplands-Bro", "Stockholm"]
};

// ============================================================
// AREA UNIQUE CONTENT - Unikt innehåll per ort
// ============================================================
export const AREA_UNIQUE_CONTENT: Record<string, {
  buildingTypes: string[];
  commonChallenges: string[];
  popularDistricts: string[];
  avgProjectValue: string;
  localContext: string;
}> = {
  // Uppsala-regionen
  "Uppsala": {
    buildingTypes: ["sekelskifteshus i centrum", "1970-tals villor i Sävja", "nyproduktion i Rosendal", "studentlägenheter nära universitetet"],
    commonChallenges: ["äldre VVS i centrala fastigheter", "fuktproblem i källare", "energieffektivisering i äldre hus", "renovering av kulturhistoriska byggnader"],
    popularDistricts: ["Luthagen", "Fålhagen", "Eriksberg", "Centrum", "Rosendal", "Kungsängen"],
    avgProjectValue: "25 000 - 75 000 kr",
    localContext: "Uppsala är en universitetsstad med blandad bebyggelse från medeltiden till nutid. Många fastigheter kräver specialistkunskap vid renovering."
  },
  "Stockholm": {
    buildingTypes: ["bostadsrätter i innerstan", "sekelskifteslägenheter", "moderna kontorsbyggnader", "townhouses i förorten"],
    commonChallenges: ["begränsad tillgång i innerstaden", "historiska fastigheter med krav", "koordinering med brf-styrelser", "parkeringsbegränsningar"],
    popularDistricts: ["Södermalm", "Vasastan", "Östermalm", "Kungsholmen", "Gamla Stan"],
    avgProjectValue: "40 000 - 150 000 kr",
    localContext: "Stockholm är huvudstaden med höga krav på kvalitet och ofta komplexa bostadsrättsregler. Många projekt kräver tillstånd."
  },
  "Knivsta": {
    buildingTypes: ["nya villor i expanderande områden", "radhus", "äldre gårdar", "bostadsrätter i centrum"],
    commonChallenges: ["nybyggnation kräver besiktning", "dränering i lerig mark", "snabb expansion ger hög efterfrågan"],
    popularDistricts: ["Alsike", "Knivsta centrum", "Särsta", "Ängby"],
    avgProjectValue: "30 000 - 100 000 kr",
    localContext: "Knivsta är en av Sveriges snabbast växande kommuner med perfekt pendlingsläge mellan Stockholm och Uppsala."
  },
  "Täby": {
    buildingTypes: ["exklusiva villor", "moderna bostadsrätter", "radhusområden från 70-talet"],
    commonChallenges: ["höga kundförväntningar", "renovering av 70-tals villor", "energieffektivisering"],
    popularDistricts: ["Täby centrum", "Arninge", "Näsby Park", "Viggbyholm", "Tibble"],
    avgProjectValue: "50 000 - 200 000 kr",
    localContext: "Täby är en välbärgad förort med hög andel villaägare och fokus på kvalitet."
  },
  "Huddinge": {
    buildingTypes: ["miljonprogramsområden", "villor i Stuvsta", "radhus", "nyproduktion vid Flemingsberg"],
    commonChallenges: ["stambyte i äldre fastigheter", "renovering av 60-70-tals bostäder", "fuktproblem"],
    popularDistricts: ["Flemingsberg", "Huddinge centrum", "Stuvsta", "Segeltorp", "Trångsund"],
    avgProjectValue: "25 000 - 80 000 kr",
    localContext: "Huddinge är Stockholms läns näst största kommun med stor variation i bostadstyper."
  },
  "Danderyd": {
    buildingTypes: ["exklusiva villor", "arkitektritade hus", "sekelskifteshus", "moderna townhouses"],
    commonChallenges: ["höga förväntningar på finish", "kulturhistoriska byggnader", "detaljkrav från kommunen"],
    popularDistricts: ["Djursholm", "Stocksund", "Danderyd centrum", "Enebyberg"],
    avgProjectValue: "80 000 - 300 000 kr",
    localContext: "Danderyd har Sveriges högsta medianinkomst och kunderna förväntar sig premium-kvalitet."
  },
  "Södertälje": {
    buildingTypes: ["industrifastigheter", "miljonprogram", "äldre villor", "radhus"],
    commonChallenges: ["äldre fastigheter med underhållsbehov", "industriområden nära bostäder", "variation i betalningsförmåga"],
    popularDistricts: ["Södertälje centrum", "Hovsjö", "Geneta", "Järna"],
    avgProjectValue: "20 000 - 60 000 kr",
    localContext: "Södertälje är en mångkulturell industristad med stor variation i projekt."
  },
  "Nacka": {
    buildingTypes: ["sjönära villor", "moderna lägenheter i Nacka Strand", "sekelskiftesvillor", "radhus"],
    commonChallenges: ["kuperad terräng komplicerar markarbeten", "höga krav på utsikt", "fukt från Saltsjön"],
    popularDistricts: ["Nacka Strand", "Saltsjöbaden", "Boo", "Fisksätra", "Orminge"],
    avgProjectValue: "40 000 - 120 000 kr",
    localContext: "Nacka har fantastiskt läge vid Saltsjön och attraherar kvalitetsmedvetna kunder."
  },
  "Sollentuna": {
    buildingTypes: ["villor från 50-70-talet", "radhus", "moderna bostadsrätter vid Sollentuna centrum"],
    commonChallenges: ["renovering av efterkrigstidsvillor", "energieffektivisering", "stambyte"],
    popularDistricts: ["Sollentuna centrum", "Rotebro", "Edsberg", "Häggvik", "Tureberg"],
    avgProjectValue: "35 000 - 100 000 kr",
    localContext: "Sollentuna är en populär familjeförort med god kollektivtrafik till Stockholm."
  },
  "Lidingö": {
    buildingTypes: ["exklusiva villor", "sekelskifteshus", "moderna lägenheter", "arkitektritade hus"],
    commonChallenges: ["öläge kräver god planering", "höga kvalitetskrav", "kulturhistoriska restriktioner"],
    popularDistricts: ["Lidingö centrum", "Brevik", "Herserud", "Elfvik", "Gåshaga"],
    avgProjectValue: "60 000 - 200 000 kr",
    localContext: "Lidingö kallas 'den gröna ön' och har höga förväntningar på kvalitet och miljöhänsyn."
  },
  "Järfälla": {
    buildingTypes: ["villor i Viksjö", "bostadsrätter i Jakobsberg", "nyproduktion i Barkarby"],
    commonChallenges: ["stor variation i hustyper", "expansion i Barkarby", "renovering av 70-tals hus"],
    popularDistricts: ["Jakobsberg", "Barkarby", "Viksjö", "Kallhäll", "Skälby"],
    avgProjectValue: "30 000 - 90 000 kr",
    localContext: "Järfälla genomgår stor expansion med nya tunnelbanan och Barkarby stad."
  },
  "Botkyrka": {
    buildingTypes: ["miljonprogram i Alby och Fittja", "villor i Tumba", "radhus", "äldre gårdar"],
    commonChallenges: ["stambyte i äldre fastigheter", "variation i budget", "flerspråkig kommunikation"],
    popularDistricts: ["Tumba", "Alby", "Fittja", "Hallunda", "Tullinge"],
    avgProjectValue: "20 000 - 60 000 kr",
    localContext: "Botkyrka är mångkulturellt med stor variation i projekttyper och budgetar."
  },
  "Haninge": {
    buildingTypes: ["villor nära naturen", "bostadsrätter i Handen", "fritidshus", "radhus"],
    commonChallenges: ["långa avstånd inom kommunen", "renovering av fritidshus", "dränering i skogsterräng"],
    popularDistricts: ["Handen", "Vendelsö", "Brandbergen", "Jordbro", "Dalarö"],
    avgProjectValue: "25 000 - 70 000 kr",
    localContext: "Haninge sträcker sig från skärgård till inland och erbjuder naturnära boende."
  },
  "Tyresö": {
    buildingTypes: ["sjönära villor", "radhus", "bostadsrätter i centrum", "fritidshus som permanentats"],
    commonChallenges: ["konvertering av fritidshus", "fukt nära vatten", "energieffektivisering"],
    popularDistricts: ["Tyresö centrum", "Tyresö strand", "Brevik", "Trollbäcken", "Öringe"],
    avgProjectValue: "35 000 - 100 000 kr",
    localContext: "Tyresö är populärt för naturnära boende med närhet till nationalpark."
  },
  "Vallentuna": {
    buildingTypes: ["villor", "radhus", "hästgårdar", "äldre torp"],
    commonChallenges: ["landsbygdsfastigheter med speciella behov", "avstånd till Stockholm", "äldre infrastruktur"],
    popularDistricts: ["Vallentuna centrum", "Bällsta", "Kårsta", "Lindholmen"],
    avgProjectValue: "30 000 - 90 000 kr",
    localContext: "Vallentuna kombinerar landsbygdskänsla med god pendlingstid till Stockholm."
  },
  "Värmdö": {
    buildingTypes: ["skärgårdshus", "villor i Gustavsberg", "fritidshus", "moderna bostadsrätter"],
    commonChallenges: ["öläge komplicerar logistik", "säsongsvariation i efterfrågan", "äldre fritidshus"],
    popularDistricts: ["Gustavsberg", "Stavsnäs", "Hemmesta", "Djurö", "Ingarö"],
    avgProjectValue: "40 000 - 120 000 kr",
    localContext: "Värmdö omfattar stora delar av Stockholms skärgård med unika logistikbehov."
  },
  "Sigtuna": {
    buildingTypes: ["historiska byggnader i gamla stan", "moderna villor", "nyproduktion nära Arlanda"],
    commonChallenges: ["kulturhistoriska restriktioner", "närheten till flygplatsen", "variation i fastighetstyper"],
    popularDistricts: ["Sigtuna stad", "Märsta", "Rosersberg", "Steninge"],
    avgProjectValue: "35 000 - 100 000 kr",
    localContext: "Sigtuna är Sveriges äldsta stad med unika kulturhistoriska krav."
  },
  "Märsta": {
    buildingTypes: ["moderna lägenheter", "radhus", "villor", "nyproduktion"],
    commonChallenges: ["snabb expansion", "närhet till Arlanda påverkar", "ny infrastruktur"],
    popularDistricts: ["Märsta centrum", "Valsta", "Ekilla", "Steningehöjden"],
    avgProjectValue: "25 000 - 70 000 kr",
    localContext: "Märsta växer snabbt med närheten till Arlanda och Stockholm."
  },
  "Norrtälje": {
    buildingTypes: ["skärgårdshus", "villor", "fritidshus", "äldre stadshus"],
    commonChallenges: ["säsongsvariation", "långa avstånd", "äldre fastigheter"],
    popularDistricts: ["Norrtälje stad", "Rimbo", "Hallstavik", "Bergshamra"],
    avgProjectValue: "25 000 - 80 000 kr",
    localContext: "Norrtälje är porten till Roslagen med stark sommarsäsong."
  },
  "Enköping": {
    buildingTypes: ["äldre villor", "bostadsrätter i centrum", "lantgårdar", "radhus"],
    commonChallenges: ["äldre fastigheter", "avstånd till större städer", "variation i budget"],
    popularDistricts: ["Enköping centrum", "Bredsand", "Lillkyrka", "Skolsta"],
    avgProjectValue: "20 000 - 60 000 kr",
    localContext: "Enköping kallas 'Parkernas stad' och erbjuder lugnt boende nära Mälaren."
  },
  "Storvreta": {
    buildingTypes: ["villor", "radhus", "äldre gårdar", "nyproduktion"],
    commonChallenges: ["pendlingssamhälle", "variation i fastighetsålder", "avloppsanläggningar"],
    popularDistricts: ["Storvreta centrum", "Vattholma", "Läby"],
    avgProjectValue: "25 000 - 70 000 kr",
    localContext: "Storvreta är populärt för barnfamiljer som vill bo nära Uppsala men mer lantligt."
  },
  "Åkersberga": {
    buildingTypes: ["sjönära villor", "radhus", "bostadsrätter", "fritidshus"],
    commonChallenges: ["kustnära fuktproblem", "pendlingssamhälle", "renovering av 70-tals hus"],
    popularDistricts: ["Åkersberga centrum", "Österskär", "Åkersberga strand", "Margretelund"],
    avgProjectValue: "35 000 - 100 000 kr",
    localContext: "Åkersberga erbjuder skärgårdsliv med pendlingsavstånd till Stockholm."
  },
  // Stockholms stadsdelar
  "Södermalm": {
    buildingTypes: ["sekelskifteslägenheter", "funkishus", "moderna bostadsrätter", "ateljélägenheter"],
    commonChallenges: ["äldre fastigheter", "brf-regler", "trångt för leveranser", "bullerkrav"],
    popularDistricts: ["Hornstull", "Medborgarplatsen", "Mariatorget", "Nytorget", "SoFo"],
    avgProjectValue: "40 000 - 120 000 kr",
    localContext: "Södermalm är Stockholms hippa stadsdel med höga krav på stil och kvalitet."
  },
  "Kungsholmen": {
    buildingTypes: ["sekelskifteslägenheter", "moderna lägenheter", "kontorslokaler", "stadsvillor"],
    commonChallenges: ["brf-regler", "äldre infrastruktur", "parkeringsbrist", "strandnära fukt"],
    popularDistricts: ["Fridhemsplan", "Stadshagen", "Kristineberg", "Rålambshov", "Fredhäll"],
    avgProjectValue: "45 000 - 130 000 kr",
    localContext: "Kungsholmen är populärt för barnfamiljer med parker och strandpromenad."
  },
  "Vasastan": {
    buildingTypes: ["jugendlägenheter", "sekelskifteshus", "kontorslokaler", "vindsutbyggnader"],
    commonChallenges: ["kulturhistoriska krav", "äldre rördragningar", "vindsprojekt", "brf-godkännanden"],
    popularDistricts: ["Odenplan", "St Eriksplan", "Birkastan", "Rörstrand", "Sabbatsberg"],
    avgProjectValue: "50 000 - 150 000 kr",
    localContext: "Vasastan är känd för vacker jugendarkitektur och höga kvalitetskrav."
  },
  "Östermalm": {
    buildingTypes: ["paradlägenheter", "sekelskifteshus", "moderna lyxlägenheter", "ambassadfastigheter"],
    commonChallenges: ["extremt höga krav", "kulturhistoriska restriktioner", "diskret leverans", "VIP-kunder"],
    popularDistricts: ["Strandvägen", "Humlegården", "Gärdet", "Karlaplan", "Tessinparken"],
    avgProjectValue: "80 000 - 400 000 kr",
    localContext: "Östermalm är Stockholms mest exklusiva stadsdel med extremt höga förväntningar."
  },
  "Bromma": {
    buildingTypes: ["villor", "radhus", "sekelskiftesvillor", "moderna kedjehus"],
    commonChallenges: ["äldre villor behöver modernisering", "flygplatsbuller", "stora tomter"],
    popularDistricts: ["Äppelviken", "Abrahamsberg", "Alvik", "Nockeby", "Traneberg"],
    avgProjectValue: "60 000 - 200 000 kr",
    localContext: "Bromma är Stockholms villastad med hög andel välbärgade familjer."
  },
  "Hägersten": {
    buildingTypes: ["funkislägenheter", "villor", "radhus", "nyproduktion"],
    commonChallenges: ["variation i fastighetstyper", "äldre rördragningar", "mälarfukt"],
    popularDistricts: ["Telefonplan", "Midsommarkransen", "Aspudden", "Liljeholmen", "Gröndal"],
    avgProjectValue: "35 000 - 90 000 kr",
    localContext: "Hägersten är populärt för unga familjer med mix av lägenheter och villor."
  },
  // Övriga orter med defaults
  "Nynäshamn": {
    buildingTypes: ["skärgårdshus", "villor", "fritidshus", "lägenheter i centrum"],
    commonChallenges: ["kustnära fukt", "säsongsvariation", "äldre fastigheter"],
    popularDistricts: ["Nynäshamn centrum", "Ösmo", "Sorunda"],
    avgProjectValue: "25 000 - 70 000 kr",
    localContext: "Nynäshamn är porten till södra skärgården med stark sommarsäsong."
  },
  "Ekerö": {
    buildingTypes: ["villor", "gårdar", "nyproduktion", "radhus"],
    commonChallenges: ["ö-läge", "begränsat med hantverkare", "äldre gårdar"],
    popularDistricts: ["Ekerö centrum", "Mälaröarna", "Drottningholm", "Färentuna"],
    avgProjectValue: "40 000 - 120 000 kr",
    localContext: "Ekerö erbjuder lantligt boende nära Stockholm med UNESCO-kulturarv."
  },
  "Sundbyberg": {
    buildingTypes: ["moderna lägenheter", "funkis", "nyproduktion", "kontorskonverteringar"],
    commonChallenges: ["tät bebyggelse", "brf-regler", "snabb utveckling"],
    popularDistricts: ["Sundbyberg centrum", "Lilla Alby", "Hallonbergen", "Rissne"],
    avgProjectValue: "35 000 - 100 000 kr",
    localContext: "Sundbyberg är Sveriges minsta kommun till ytan men tätast befolkad."
  },
  "Solna": {
    buildingTypes: ["moderna kontorsbyggnader", "bostadsrätter", "villor i Råsunda"],
    commonChallenges: ["stor variation", "företagskunder", "höga krav vid arenor"],
    popularDistricts: ["Solna centrum", "Råsunda", "Hagalund", "Bergshamra", "Ulriksdal"],
    avgProjectValue: "40 000 - 120 000 kr",
    localContext: "Solna är hem för Mall of Scandinavia och Friends Arena."
  },
  "Vaxholm": {
    buildingTypes: ["skärgårdshus", "sekelskiftesvillor", "fritidshus"],
    commonChallenges: ["ö-logistik", "säsongsvariation", "kulturhistoriska hus"],
    popularDistricts: ["Vaxholm stad", "Rindö", "Resarö"],
    avgProjectValue: "40 000 - 100 000 kr",
    localContext: "Vaxholm är skärgårdens huvudort med charmig småstadskänsla."
  },
  "Nykvarn": {
    buildingTypes: ["villor", "lantgårdar", "radhus", "nyproduktion"],
    commonChallenges: ["landsbygdslogistik", "äldre fastigheter", "enskilda avlopp"],
    popularDistricts: ["Nykvarn centrum", "Turinge"],
    avgProjectValue: "25 000 - 70 000 kr",
    localContext: "Nykvarn erbjuder lantligt boende med pendlingsavstånd."
  },
  "Salem": {
    buildingTypes: ["villor", "radhus", "bostadsrätter"],
    commonChallenges: ["pendlingssamhälle", "variation i fastighetsålder"],
    popularDistricts: ["Rönninge", "Salem centrum"],
    avgProjectValue: "30 000 - 80 000 kr",
    localContext: "Salem är populärt för barnfamiljer som vill bo nära naturen."
  },
  "Järna": {
    buildingTypes: ["ekologiska byggnader", "lantgårdar", "villor", "kollektivboenden"],
    commonChallenges: ["antroposofisk arkitektur", "ekologiska krav", "landsbygd"],
    popularDistricts: ["Järna centrum", "Ytterjärna"],
    avgProjectValue: "25 000 - 70 000 kr",
    localContext: "Järna är känt för antroposofisk kultur och ekologiskt fokus."
  }
};

// ============================================================
// DYNAMISK CONTENT GENERATOR
// ============================================================
export interface UniqueLocalContent {
  popularSearches: string[];
  urgentServices: string[];
  projectExamples: string[];
  localTip: string;
  uniqueIntro: string;
  nearbyAreas: string[];
  relatedSearches: string[];
  areaContext: string;
}

export const generateUniqueLocalContent = (
  serviceSlug: LocalServiceSlug, 
  area: AreaKey
): UniqueLocalContent => {
  const patterns = SEARCH_ACTION_PATTERNS[serviceSlug];
  const nearbyAreas = NEARBY_AREAS_MAP[area] || [];
  const areaContent = AREA_UNIQUE_CONTENT[area];
  const metadata = getAreaMetadata(area);
  const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug);
  const serviceName = service?.name.toLowerCase() || serviceSlug;
  
  // Generera populära sökningar baserat på GSC-data
  const popularSearches = patterns.objects.slice(0, 4).map(obj => 
    `${patterns.actions[0]} ${obj}`
  );
  
  // Lägg till projekttyper
  const projectExamples = patterns.projectTypes.slice(0, 5);
  
  // Akuta tjänster om det finns
  const urgentServices = patterns.urgentTerms.slice(0, 3);
  
  // Generera unik intro baserad på ortens kontext
  const uniqueIntro = areaContent 
    ? `${area} är känt för ${areaContent.buildingTypes[0]}${areaContent.buildingTypes[1] ? ` och ${areaContent.buildingTypes[1]}` : ''}. ${areaContent.localContext} Våra ${serviceName} i ${area} har erfarenhet av de vanligaste utmaningarna i området, som ${areaContent.commonChallenges.slice(0, 2).join(' och ')}.`
    : `${area} ligger i ${metadata.region}s län och vi erbjuder professionella ${serviceName}-tjänster i hela området. Våra hantverkare har god lokalkännedom och kan snabbt ta sig till dig i ${area}.`;
  
  // Lokal tip
  const localTip = areaContent
    ? `I ${area} ser vi ofta projekt inom ${areaContent.popularDistricts.slice(0, 3).join(', ')}. Typiskt projektvärde ligger på ${areaContent.avgProjectValue} efter ${service?.rotRut}-avdrag.`
    : `Vi täcker hela ${area} och kan ofta starta inom 24-48 timmar. Glöm inte att du får 50% ${service?.rotRut}-avdrag på arbetskostnaden!`;
  
  // Relaterade sökningar för "Folk söker också"
  const relatedSearches = [
    ...patterns.synonyms.slice(0, 2).map(s => `${s} ${area.toLowerCase()}`),
    `${patterns.projectTypes[0]} pris`,
    `bästa ${serviceName} ${area.toLowerCase()}`,
    `${serviceName} med ${service?.rotRut}-avdrag`
  ];
  
  // Area kontext för unikt innehåll
  const areaContext = areaContent?.localContext || 
    `${area} ligger i vackra ${metadata.region}s län och vi erbjuder ${serviceName}-tjänster till alla områden.`;
  
  return {
    popularSearches,
    urgentServices,
    projectExamples,
    localTip,
    uniqueIntro,
    nearbyAreas: nearbyAreas.slice(0, 6),
    relatedSearches,
    areaContext
  };
};

// ============================================================
// IMPROVED TITLE TEMPLATES - Baserat på GSC-analys
// ============================================================
export const getImprovedTitle = (serviceSlug: LocalServiceSlug, area: string): string => {
  const titles: Record<LocalServiceSlug, string> = {
    "snickare": `Snickare ${area} ★ Kök, garderob & altan · ROT 50% · Fri offert`,
    "vvs": `VVS ${area} ★ Byte & reparation · Jour dygnet runt · ROT 50%`,
    "elektriker": `Elektriker ${area} ★ Certifierade · Eljour & laddbox · ROT 50%`,
    "malare": `Målare ${area} ★ Fasad & invändigt · Fasta priser · ROT 50%`,
    "stad": `Städfirma ${area} ★ Flytt, hem & byggstäd · RUT 50% · Boka idag`,
    "flytt": `Flytthjälp ${area} ★ Pack & bärhjälp · RUT 50% · Snabb bokning`,
    "markarbeten": `Markarbeten ${area} ★ Schakt, dränering & plattor · ROT 50%`,
    "montering": `Monteringshjälp ${area} ★ IKEA, kök & möbler · ROT 50%`,
    "tradgard": `Trädgårdshjälp ${area} ★ Träd, häck & anläggning · ROT 50%`,
    "tekniska-installationer": `Teknisk installation ${area} ★ Laddbox & smarta hem · ROT 50%`
  };
  return titles[serviceSlug] || `${serviceSlug} ${area} | Fixco`;
};

// ============================================================
// IMPROVED META DESCRIPTIONS
// ============================================================
export const getImprovedDescription = (
  serviceSlug: LocalServiceSlug, 
  area: string
): string => {
  const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug);
  const serviceName = service?.name.toLowerCase() || serviceSlug;
  const patterns = SEARCH_ACTION_PATTERNS[serviceSlug];
  const nearbyAreas = NEARBY_AREAS_MAP[area]?.slice(0, 2) || [];
  const areaContent = AREA_UNIQUE_CONTENT[area];
  
  const nearbyText = nearbyAreas.length > 0 
    ? ` Vi täcker även ${nearbyAreas.join(' och ')}.` 
    : '';
  
  const specialtyText = areaContent?.buildingTypes[0] 
    ? ` Specialister på ${areaContent.buildingTypes[0]}.` 
    : '';
  
  return `Behöver du ${serviceName} i ${area}? ★ Erfarna hantverkare ★ 50% ${service?.rotRut}-avdrag ★ ${patterns.projectTypes.slice(0, 2).join(', ')}.${specialtyText}${nearbyText} Fri offert!`;
};

// ============================================================
// GET NEARBY AREAS HELPER
// ============================================================
export const getNearbyAreas = (area: string): string[] => {
  return NEARBY_AREAS_MAP[area] || [];
};

// ============================================================
// GET AREA SEARCH INSIGHTS
// ============================================================
export const getAreaSearchInsights = (area: AreaKey) => {
  return {
    areaContent: AREA_UNIQUE_CONTENT[area],
    nearbyAreas: NEARBY_AREAS_MAP[area] || []
  };
};
