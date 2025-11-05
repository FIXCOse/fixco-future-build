import { ServiceKey } from "./serviceCityData";
import { 
  Zap, 
  Lightbulb, 
  Cable, 
  Power,
  BatteryCharging,
  Home,
  Droplets,
  ShowerHead,
  WashingMachine,
  Wrench,
  Hammer,
  Ruler,
  PaintBucket,
  Brush,
  Package,
  Tv,
  Sofa,
  Trees,
  Leaf,
  Shovel,
  Sparkles,
  Network,
  Camera,
  type LucideIcon
} from "lucide-react";

interface ServiceContentItem {
  aboutTitle: string;
  aboutParagraphs: string[];
  authorizations?: string[];
  localAspects: string;
  commonTasks: string[];
  popularServices: Array<{
    icon: LucideIcon;
    label: string;
  }>;
  seasonalTips?: Array<{
    title: string;
    description: string;
  }>;
}

export const serviceCityContent: Record<ServiceKey, Record<"Uppsala" | "Stockholm", ServiceContentItem>> = {
  "Elmontör": {
    "Uppsala": {
      aboutTitle: "Om elektriker i Uppsala",
      aboutParagraphs: [
        "En elektriker (även kallad elmontör eller elinstallatör) ansvarar för installation, service och felsökning av elektriska anläggningar. För att arbeta som elektriker krävs auktorisation från Elsäkerhetsverket och att arbetet följer gällande standard (SS 436 40 00).",
        "I Uppsala möter vi ofta en mix av äldre villaområden i Svartbäcken och Luthagen samt nybyggda lägenheter i Gottsunda och Ultuna. Vi är vana vid både moderna installationer och uppdateringar av äldre elsystem från 60- och 70-talet.",
        "Laddbox-installation för elbilar är mycket vanligt i Uppsala, där vi installerar 11 kW laddboxar enligt Elsäkerhetsverkets krav med effektvakt och dokumentation."
      ],
      authorizations: [
        "Auktoriserad av Elsäkerhetsverket",
        "Följer SS 436 40 00",
        "F-skattsedel och fullständig försäkring"
      ],
      localAspects: "Uppsala har en blandning av äldre villaområden och nybyggda lägenheter. Vi är vana vid att arbeta i både moderna och äldre installationer.",
      commonTasks: [
        "Laddbox-installation (11 kW standard för villor)",
        "LED-belysning i kök och vardagsrum",
        "Felsökning jordfel och utlösta säkringar",
        "Uttag för nya vitvaror och diskmaskin",
        "Elcentralsuppdatering i äldre villor"
      ],
      popularServices: [
        { icon: BatteryCharging, label: "Laddbox-installation" },
        { icon: Lightbulb, label: "LED-belysning" },
        { icon: Zap, label: "Felsökning jordfel" },
        { icon: Power, label: "Nya eluttag" },
        { icon: Cable, label: "Elcentralsbyte" },
        { icon: Home, label: "Utomhusbelysning" },
        { icon: Wrench, label: "Elbesiktning" },
        { icon: Network, label: "Nätverksuttag" }
      ],
      seasonalTips: [
        {
          title: "Ökad belastning på elnätet",
          description: "Vintermånader med el-värmare och elbilsladdning ökar risken för utlösta säkringar. Överväg uppgradering till 3-fas om du har problem med för låg effekt."
        },
        {
          title: "Utomhusbelysning & säkerhet",
          description: "Kontrollera att utomhusarmaturer har korrekt IP-klass (minst IP44) för vinter. Vi hjälper till med installation av vinter-belysning och markspotlights."
        },
        {
          title: "Motorvärmare & timer",
          description: "Installera motorvärmare med timer för att spara energi. ROT-avdrag gäller för installation. Vi monterar och kopplar enligt gällande standard."
        }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om elektriker i Stockholm",
      aboutParagraphs: [
        "En elektriker (även kallad elmontör eller elinstallatör) ansvarar för installation, service och felsökning av elektriska anläggningar. För att arbeta som elektriker krävs auktorisation från Elsäkerhetsverket och att arbetet följer gällande standard (SS 436 40 00).",
        "I Stockholm möter vi ofta äldre installationer i sekelskifteslägenheter på Östermalm, Vasastan och Södermalm där modernisering krävs. Vi är vana vid trånga utrymmen, porttelefoner och krav på skydd av originaldetaljer.",
        "Vi planerar alltid parkering/lastzon i förväg och tar med skyddsmaterial för att skydda trappor och golv i lägenheter."
      ],
      authorizations: [
        "Auktoriserad av Elsäkerhetsverket",
        "Följer SS 436 40 00",
        "F-skattsedel och fullständig försäkring"
      ],
      localAspects: "Stockholm har många sekelskifteslägenheter med äldre elinstallationer. Vi är vana vid trånga utrymmen och skydd av originaldetaljer.",
      commonTasks: [
        "Laddbox-installation (11 kW är standard för villor)",
        "Belysningsuppdrag i kontorslokaler",
        "Felsökning i äldre lägenheter",
        "Uttag för nyinstallation av vitvaror",
        "Elcentralsmodernisering"
      ],
      popularServices: [
        { icon: BatteryCharging, label: "Laddbox-installation" },
        { icon: Lightbulb, label: "Kontorsbelysning" },
        { icon: Zap, label: "Elfelsökning" },
        { icon: Power, label: "Nya eluttag" },
        { icon: Cable, label: "Modernisering" },
        { icon: Home, label: "Porttelefon" },
        { icon: Wrench, label: "Elbesiktning" },
        { icon: Network, label: "Smarta hem-system" }
      ],
      seasonalTips: [
        {
          title: "Ökad belastning på elnätet",
          description: "Vintermånader med el-värmare och elbilsladdning ökar risken för utlösta säkringar i äldre lägenheter. Vi hjälper till med uppgradering av elcentral."
        },
        {
          title: "Porttelefoner vid kyla",
          description: "Gamla porttelefonsystem kan krångla vid minusgrader. Vi uppgraderar till moderna system som fungerar stabilt året runt."
        },
        {
          title: "Eluppvärmning i BRF",
          description: "Många sekelskifteslägenheter har direktverkande el-element. Överväg byte till modern, energisnål lösning för att minska elkostnaderna."
        }
      ]
    }
  },
  "VVS": {
    "Uppsala": {
      aboutTitle: "Om VVS-montör i Uppsala",
      aboutParagraphs: [
        "En VVS-montör (rörmokare) arbetar med installation, service och reparation av vatten, värme och sanitära system. Vi hanterar allt från akuta läckor till kompletta badrumsrenoveringar.",
        "I Uppsala arbetar vi ofta med både äldre och nyare fastigheter. Många villor i Sunnersta och Valsätra har system från 70-talet som behöver uppdateras, medan nybyggda områden kräver moderna lösningar med golvvärme och smarta termostatventiler.",
        "Vi dokumenterar alla vattenrelaterade skador och kan skriva intyg enligt försäkringsbolagens krav vid akuta läckor."
      ],
      authorizations: [
        "Certifierad VVS-installatör",
        "Följer Svensk Byggnorm",
        "F-skattsedel och försäkring"
      ],
      localAspects: "Uppsala har en mix av äldre villor och nybyggen. Vi är vana vid både uppdateringar och moderna installationer.",
      commonTasks: [
        "Byte av blandare i kök och badrum",
        "WC-installation och reparation",
        "Akuta läckor och vattenrörsskador",
        "Badrumsrenoveringar med golvvärme",
        "Installation av diskmaskin och tvättmaskin"
      ],
      popularServices: [
        { icon: Droplets, label: "Akuta läckor" },
        { icon: ShowerHead, label: "Blandare" },
        { icon: WashingMachine, label: "WC-byte" },
        { icon: Home, label: "Badrumsrenovering" },
        { icon: Wrench, label: "Golvvärme" },
        { icon: Ruler, label: "Vattenmätare" },
        { icon: Cable, label: "Avloppsstopp" },
        { icon: Droplets, label: "Läckage-kontroll" }
      ],
      seasonalTips: [
        {
          title: "Frostskydd för utomhuskranar",
          description: "Stäng av och tappa utomhuskranar före vintern för att undvika frostrisk. Vi hjälper till med installation av självdränerande kranar."
        },
        {
          title: "Golvvärmekontroll",
          description: "Testa golvvärmen tidigt på hösten för att upptäcka eventuella problem innan kylan kommer. Vi utför trycktester och åtgärdar läckor."
        },
        {
          title: "Vattenrörsisolering",
          description: "Isolera vattenrör i kallförråd och garage för att förhindra frysning. Vi hjälper till med rätt isolermaterial och montering."
        }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om VVS-montör i Stockholm",
      aboutParagraphs: [
        "En VVS-montör (rörmokare) arbetar med installation, service och reparation av vatten, värme och sanitära system. Vi hanterar allt från akuta läckor till kompletta badrumsrenoveringar.",
        "I Stockholm arbetar vi ofta i BRF:er och har stor erfarenhet av att följa husets rutiner för bokning, tillträde och städning. Vi dokumenterar allt noggrant för styrelse och förvaltare.",
        "Många lägenheter på Östermalm och Södermalm har äldre VVS-system som behöver uppdateras. Vi är vana vid att arbeta i sekelskifteslägenheter med hänsyn till originala kakelplattor och detaljer."
      ],
      authorizations: [
        "Certifierad VVS-installatör",
        "Följer Svensk Byggnorm",
        "F-skattsedel och försäkring"
      ],
      localAspects: "Stockholm har många BRF:er och sekelskifteslägenheter med äldre VVS-system. Vi arbetar ofta med hänsyn till originala detaljer.",
      commonTasks: [
        "Byte av termostatblandare",
        "WC-installation och reparation",
        "Akuta läckor i BRF:er",
        "Badrumsrenoveringar",
        "Läckagedokumentation för försäkring"
      ],
      popularServices: [
        { icon: Droplets, label: "Akuta läckor" },
        { icon: ShowerHead, label: "Termostatblandare" },
        { icon: WashingMachine, label: "WC-byte" },
        { icon: Home, label: "Badrumsrenovering" },
        { icon: Wrench, label: "Golvvärme" },
        { icon: Ruler, label: "BRF-arbete" },
        { icon: Cable, label: "Avloppsstopp" },
        { icon: Droplets, label: "Försäkringsintyg" }
      ],
      seasonalTips: [
        {
          title: "Läckor i BRF:er",
          description: "Vintern ökar risken för läckor i äldre BRF-system på grund av temperaturvariationer. Vi erbjuder akut jourtjänst dygnet runt."
        },
        {
          title: "Avloppsstopp vid kyla",
          description: "Köldknappar och fet mat ökar risken för tilltäppningar i avlopp. Vi installerar fettavskiljare och utför regelbunden spolning."
        },
        {
          title: "Trycktester enligt standard",
          description: "Alla badrumsrenoveringar i BRF kräver trycktester. Vi dokumenterar och utfärdar intyg enligt försäkringsbolagens krav."
        }
      ]
    }
  },
  "Snickare": {
    "Uppsala": {
      aboutTitle: "Om snickare i Uppsala",
      aboutParagraphs: [
        "En snickare arbetar med träarbeten och inredning, från köksmontering till platsbyggda garderober och renoveringar. Vi hanterar både fina avslutningsarbeten och större ombyggnationer.",
        "I Uppsala arbetar vi ofta med köksrenoveringar, där IKEA-kök är populära. Vi monterar skåp, bänkskivor och hanterar alla anslutningar för el och vatten i samarbete med våra elektriker och VVS-montörer.",
        "Platsbyggda förvaringslösningar som bokhyllor och walk-in closets är också vanliga uppdrag i Uppsala, där vi skräddarsyr lösningar efter kundens behov och utrymme."
      ],
      authorizations: [
        "Erfaren snickare med mångårig erfarenhet",
        "F-skattsedel och försäkring"
      ],
      localAspects: "Uppsala har många villor med behov av köksrenoveringar och platsbyggda lösningar.",
      commonTasks: [
        "IKEA-köksmontering",
        "Platsbyggda garderober och bokhyllor",
        "Lister och golvlister",
        "Dörrbyten och dörrkarmar",
        "Trädäck och altan"
      ],
      popularServices: [
        { icon: Home, label: "Köksmontering" },
        { icon: Package, label: "Garderober" },
        { icon: Ruler, label: "Platsbyggda lösningar" },
        { icon: Hammer, label: "Lister" },
        { icon: Wrench, label: "Dörrbyten" },
        { icon: Trees, label: "Trädäck" },
        { icon: Sofa, label: "Inredning" },
        { icon: Home, label: "Renoveringar" }
      ],
      seasonalTips: [
        {
          title: "Trädäck före vintern",
          description: "Behandla träytor med olja eller lasyr före hösten för att skydda mot fukt och mögel under vintern. Vi erbjuder träskydd och underhåll."
        },
        {
          title: "Lister och dörrar",
          description: "Vinterfukt kan göra att träkarmar sväller. Kontrollera att fönster och dörrar stänger tätt för att undvika drag och kyla."
        },
        {
          title: "Inomhusprojekt på vintern",
          description: "Vinter är perfekt tid för köksrenoveringar och platsbyggda garderober när man inte kan arbeta utomhus lika mycket."
        }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om snickare i Stockholm",
      aboutParagraphs: [
        "En snickare arbetar med träarbeten och inredning, från köksmontering till platsbyggda garderober och renoveringar. Vi hanterar både fina avslutningsarbeten och större ombyggnationer.",
        "I Stockholm arbetar vi ofta i sekelskifteslägenheter där vi tar hänsyn till originaldetaljer som lister, dörrar och fönsterkarmar. Vi är vana vid trånga utrymmen och att skydda golv och trappor under transport.",
        "Walk-in closets och platsbyggda förvaringslösningar är mycket populära i Stockholm, där vi skapar skräddarsydda lösningar som maximerar utrymmet i lägenheter."
      ],
      authorizations: [
        "Erfaren snickare med mångårig erfarenhet",
        "F-skattsedel och försäkring"
      ],
      localAspects: "Stockholm har många sekelskifteslägenheter där vi tar hänsyn till originaldetaljer och arbetar i trånga utrymmen.",
      commonTasks: [
        "Köksmontering i BRF:er",
        "Walk-in closets och garderober",
        "Ljudisolerade väggar",
        "Inredning och förvaring",
        "Dörrbyten med originaldetaljer"
      ],
      popularServices: [
        { icon: Home, label: "Köksmontage" },
        { icon: Package, label: "Walk-in closet" },
        { icon: Ruler, label: "Platsbyggt" },
        { icon: Hammer, label: "Originaldetaljer" },
        { icon: Wrench, label: "Ljudisolering" },
        { icon: Trees, label: "Trägolv" },
        { icon: Sofa, label: "Inredning" },
        { icon: Home, label: "BRF-renoveringar" }
      ],
      seasonalTips: [
        {
          title: "Originaldetaljer vid renovering",
          description: "Sekelskifteslägenheter kräver särskild hänsyn till lister, dörrar och fönsterkarmar. Vi har erfarenhet av att bevara originaldetaljer."
        },
        {
          title: "Ljudisolering i BRF",
          description: "Träbjälklag i äldre hus kan behöva ljudisolering. Vi bygger ljudisolerade väggar och golv enligt Boverkets rekommendationer."
        },
        {
          title: "Fuktskydd vid renovering",
          description: "Kontrollera fuktskydd i badrum och kök vid renovering i äldre hus. Vi installerar nya membran enligt gällande standard."
        }
      ]
    }
  },
  "Måleri": {
    "Uppsala": {
      aboutTitle: "Om måleri i Uppsala",
      aboutParagraphs: [
        "Måleriarbeten inkluderar målning av väggar, tak, lister, dörrar och fasader. Vi hanterar allt från mindre uppdrag som ett rum till kompletta renoveringar av hela hus.",
        "I Uppsala arbetar vi ofta med både invändiga och utvändiga målningsarbeten. Många villor i området behöver regelbundet underhåll av fasader, fönster och altaner."
      ],
      localAspects: "Uppsala har många villor som behöver fasadmålning och inomhusrenovering.",
      commonTasks: [
        "Invändig målning av vardagsrum och sovrum",
        "Fasadmålning",
        "Målning av lister och dörrar",
        "Tapetsering"
      ],
      popularServices: [
        { icon: PaintBucket, label: "Invändig målning" },
        { icon: Brush, label: "Fasadmålning" },
        { icon: Home, label: "Lister & dörrar" },
        { icon: Ruler, label: "Tapetsering" }
      ],
      seasonalTips: [
        {
          title: "Fasadmålning på sommaren",
          description: "Planera fasadmålning till sommarhalvåret när temperaturen är över 10 grader. Torktiden är kortare och resultatet blir bättre."
        },
        {
          title: "Invändig målning på vintern",
          description: "Vinter är perfekt för invändiga målningsprojekt när man inte vistas utomhus lika mycket. Vi hjälper till med färgval och utförande."
        },
        {
          title: "Träskydd och lasyr",
          description: "Behandla träfasader, fönster och dörrar vart tredje år för optimalt skydd. Vi använder miljövänliga produkter från ledande leverantörer."
        }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om måleri i Stockholm",
      aboutParagraphs: [
        "Måleriarbeten inkluderar målning av väggar, tak, lister, dörrar och fasader. Vi hanterar allt från mindre uppdrag som ett rum till kompletta renoveringar av hela lägenheter.",
        "I Stockholm arbetar vi ofta i BRF:er och lägenheter där vi tar hänsyn till originaldetaljer och använder rätt färgkulörer för sekelskiftesmiljöer."
      ],
      localAspects: "Stockholm har många sekelskifteslägenheter där vi tar hänsyn till originaldetaljer och färgval.",
      commonTasks: [
        "Lägenhetsmålning",
        "Originaldetaljer i sekelskifteslägenheter",
        "BRF-gemensamma utrymmen",
        "Trapphus och fasader"
      ],
      popularServices: [
        { icon: PaintBucket, label: "Lägenhetsmålning" },
        { icon: Brush, label: "Originaldetaljer" },
        { icon: Home, label: "BRF-målning" },
        { icon: Ruler, label: "Trapphus" }
      ],
      seasonalTips: [
        {
          title: "BRF-trapphus på sommaren",
          description: "Planera trapphus- och fasadmålning till sommaren när fönster kan stå öppna för ventilation. Vi koordinerar med BRF-styrelsen."
        },
        {
          title: "Färgval för sekelskifteshus",
          description: "Använd autentiska NCS-kulörer för att bevara husets karaktär. Vi har erfarenhet av historiska miljöer och originalfärger."
        },
        {
          title: "Invändig renovering vinter",
          description: "Vintern är idealisk för lägenhetsmålning och uppdatering av lister och dörrar. Vi skyddar golv och inredning under arbetet."
        }
      ]
    }
  },
  "Städ": {
    "Uppsala": {
      aboutTitle: "Om städtjänster i Uppsala",
      aboutParagraphs: [
        "Professionell städning inkluderar hemstäd, flyttstäd, byggstäd och kontorsstäd. Vi använder miljövänliga produkter och professionell utrustning för bästa resultat.",
        "I Uppsala gör vi mycket flyttstäd med besiktningsgaranti enligt Svensk Fastighetsförmedlings checklista. Vi ser till att lägenheter blir godkända vid slutbesiktning."
      ],
      localAspects: "Uppsala har många studenter som behöver flyttstäd och professionell hjälp vid flytt.",
      commonTasks: [
        "Flyttstäd med besiktningsgaranti",
        "Hemstäd varje vecka eller varannan vecka",
        "Byggstäd efter renovering",
        "Fönsterputs"
      ],
      popularServices: [
        { icon: Sparkles, label: "Flyttstäd" },
        { icon: Home, label: "Hemstäd" },
        { icon: Brush, label: "Byggstäd" },
        { icon: Wrench, label: "Fönsterputs" }
      ],
      seasonalTips: [
        {
          title: "Flyttstäd vid terminsslut",
          description: "Boka flyttstäd i god tid inför terminsslut då efterfrågan är hög. Vi garanterar godkänt resultat vid besiktning."
        },
        {
          title: "Vårens storstädning",
          description: "Våren är perfekt för hemstäd och fönsterputs efter den mörka vintern. Vi erbjuder extrastäd med fönsterputs inkluderat."
        },
        {
          title: "Byggstäd efter renovering",
          description: "Efter renovering krävs noggrann byggstäd med damsugning av finpartiklar. Vi använder HEPA-filter för bästa resultat."
        }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om städtjänster i Stockholm",
      aboutParagraphs: [
        "Professionell städning inkluderar hemstäd, flyttstäd, kontorsstäd och BRF-städning. Vi använder miljövänliga produkter och arbetar ofta efter kontorstid för minimal störning.",
        "I Stockholm städar vi många kontorslokaler och BRF-gemensamma utrymmen. Vi har avtal med flera företag och BRF:er för regelbunden städning."
      ],
      localAspects: "Stockholm har många kontorslokaler och BRF:er som behöver professionell städning.",
      commonTasks: [
        "Kontorsstäd",
        "BRF-gemensamma utrymmen",
        "Flyttstäd med besiktning",
        "Trappstädning"
      ],
      popularServices: [
        { icon: Sparkles, label: "Kontorsstäd" },
        { icon: Home, label: "BRF-städning" },
        { icon: Brush, label: "Flyttstäd" },
        { icon: Wrench, label: "Trapphus" }
      ],
      seasonalTips: [
        {
          title: "BRF-trappstädning vinter",
          description: "Ökad smuts från snö och salt kräver extra noggrann trappstädning vintertid. Vi erbjuder ökad frekvens vid behov."
        },
        {
          title: "Kontorsstäd efter storhelger",
          description: "Boka extra städning efter storhelger och semester för att hålla kontoret fräscht. Vi arbetar efter kontorstid."
        },
        {
          title: "Flyttstäd i Stockholm",
          description: "Boka flyttstäd minst 1 vecka före besiktning. Vi följer Svensk Fastighetsförmedlings checklista för godkänt resultat."
        }
      ]
    }
  },
  "Markarbeten": {
    "Uppsala": {
      aboutTitle: "Om markarbeten i Uppsala",
      aboutParagraphs: [
        "Markarbeten inkluderar dränering, schaktning, planering, plattläggning och grundläggning. Vi hanterar både mindre projekt som uteplatser och större arbeten som dränering runt fastigheter.",
        "I Uppsala arbetar vi ofta med dränering för att förhindra fuktproblem i äldre villor. Många fastigheter behöver uppdaterade dräneringssystem."
      ],
      localAspects: "Uppsala har många äldre villor som behöver dränering och markarbeten.",
      commonTasks: [
        "Dränering runt hus",
        "Plattläggning av uppfarter",
        "Schaktning för altan",
        "Markplanering"
      ],
      popularServices: [
        { icon: Shovel, label: "Dränering" },
        { icon: Ruler, label: "Plattläggning" },
        { icon: Wrench, label: "Schaktning" },
        { icon: Home, label: "Markplanering" }
      ],
      seasonalTips: [
        {
          title: "Dränering på hösten",
          description: "Hösten är bästa tiden för dräneringsarbeten innan marken fryser. Vi utför dränering enligt moderna standards med filtersand."
        },
        {
          title: "Plattläggning på våren",
          description: "Vänta till marken töat på våren för att börja plattläggning. Vi planerar projektet för optimal torkning och stabilitet."
        },
        {
          title: "Markarbeten vintertid",
          description: "Undvik schaktning vid minusgrader då marken är fruset. Boka projektet till vår eller sommar för bästa resultat."
        }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om markarbeten i Stockholm",
      aboutParagraphs: [
        "Markarbeten inkluderar dränering, schaktning, plattläggning och arbete i innergårdar. Vi är vana vid begränsat utrymme och tar hänsyn till grannar och tillgänglighet.",
        "I Stockholm arbetar vi ofta i innergårdar och BRF-gemensamma ytor där vi lägger plattor, natursten och skapar uteplatser."
      ],
      localAspects: "Stockholm har många innergårdar med begränsat utrymme där vi arbetar.",
      commonTasks: [
        "Innergårdsplattläggning",
        "Dränering i BRF:er",
        "Uteplatser med natursten",
        "Pool-förberedning"
      ],
      popularServices: [
        { icon: Shovel, label: "Innergårdar" },
        { icon: Ruler, label: "Natursten" },
        { icon: Wrench, label: "Dränering" },
        { icon: Home, label: "BRF-arbete" }
      ],
      seasonalTips: [
        {
          title: "Innergårdar på sommaren",
          description: "Sommaren är perfekt för innergårdsprojekt i Stockholm. Vi koordinerar med grannar och BRF-styrelser för smidig genomgång."
        },
        {
          title: "Dränering i BRF",
          description: "Äldre BRF:er kan behöva uppdaterad dränering. Vi utför undersökning och åtgärdar fuktproblem enligt moderna standards."
        },
        {
          title: "Parkering och lastzon",
          description: "I Stockholm planerar vi parkering och lastzon i förväg för att säkerställa smidig leverans av material till innergårdar."
        }
      ]
    }
  },
  "Flytt": {
    "Uppsala": {
      aboutTitle: "Om flytthjälp i Uppsala",
      aboutParagraphs: [
        "Flytthjälp inkluderar packning, transport, bärhjälp och magasinering. Vi hanterar allt från mindre lägenhetsflyttar till stora villaflytt.",
        "I Uppsala hjälper vi ofta studenter och familjer med flyttar inom staden eller till andra städer."
      ],
      localAspects: "Uppsala har många studenter som behöver flytthjälp vid terminsstart.",
      commonTasks: [
        "Lägenhetsflytt",
        "Villaflytt",
        "Bärhjälp",
        "Packning"
      ],
      popularServices: [
        { icon: Package, label: "Lägenhetsflytt" },
        { icon: Home, label: "Villaflytt" },
        { icon: Wrench, label: "Bärhjälp" },
        { icon: Sofa, label: "Packning" }
      ],
      seasonalTips: [
        {
          title: "Flytt vid terminsstart",
          description: "Boka flytt i god tid inför terminsstart när efterfrågan är hög bland studenter i Uppsala. Vi erbjurar flexibla tider."
        },
        {
          title: "Vinterflyttar",
          description: "Vid flytt på vintern använder vi skyddsmaterial för golv och trappor för att undvika skador från snö och väta."
        },
        {
          title: "Packning och förvaring",
          description: "Vi erbjuder packtjänst och magasinering mellan flytt för smidigare övergång. Boka i förväg för garanterat utrymme."
        }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om flytthjälp i Stockholm",
      aboutParagraphs: [
        "Flytthjälp inkluderar packning, transport, bärhjälp och magasinering. Vi är vana vid trappor utan hiss och smala trapphus i Stockholms innerstad.",
        "Vi planerar parkering och lastzon i förväg och tar med skyddsmaterial för trappor och golv."
      ],
      localAspects: "Stockholm har många trappor utan hiss där vi är vana vid att bära tunga möbler.",
      commonTasks: [
        "Lägenhetsflytt i innerstan",
        "Trappor utan hiss",
        "Magasinering",
        "Kontorstransporter"
      ],
      popularServices: [
        { icon: Package, label: "Innerstadsflytt" },
        { icon: Home, label: "Trapparbete" },
        { icon: Wrench, label: "Magasinering" },
        { icon: Sofa, label: "Kontorsflytt" }
      ],
      seasonalTips: [
        {
          title: "Flytt i Stockholm innerstad",
          description: "Boka lastzon minst 1 vecka i förväg för flytt i Stockholm innerstad. Vi hanterar all dokumentation och tillstånd."
        },
        {
          title: "Skydd i trapphus",
          description: "I Stockholms äldre trapphus använder vi extra skyddsmaterial för väggar, trappräcken och golv för att undvika skador."
        },
        {
          title: "Effektivitet vid flytt",
          description: "Vi planerar flyttrutt och packning för maximal effektivitet i trånga stockholmsmiljöer. Inga extra kostnader för trappor utan hiss."
        }
      ]
    }
  },
  "Montering": {
    "Uppsala": {
      aboutTitle: "Om monteringstjänster i Uppsala",
      aboutParagraphs: [
        "Monteringstjänster inkluderar IKEA-möbler, vitvaror, TV-fästen och montering av alla typer av möbler och utrustning. Vi tar med all nödvändig verktyg och hanterar emballage.",
        "I Uppsala monterar vi ofta IKEA-kök, PAX-garderober och vitvaror. Vi kan även hämta möbler från IKEA och leverera direkt till dig."
      ],
      localAspects: "Uppsala har många som behöver monteringshjälp med IKEA-möbler och kök.",
      commonTasks: [
        "PAX-garderober",
        "IKEA-kök",
        "TV-fästen",
        "Vitvaror"
      ],
      popularServices: [
        { icon: Package, label: "IKEA-montering" },
        { icon: Home, label: "Kök" },
        { icon: Tv, label: "TV-fästen" },
        { icon: Wrench, label: "Vitvaror" }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om monteringstjänster i Stockholm",
      aboutParagraphs: [
        "Monteringstjänster inkluderar IKEA-möbler, vitvaror, TV-fästen och kontorsmöbler. Vi arbetar ofta på kvällar för de som behöver montering efter kontorstid.",
        "Vi kan hämta möbler från IKEA Kungens Kurva eller Barkarby och leverera direkt till dig för montering."
      ],
      localAspects: "Stockholm har många som behöver monteringshjälp i lägenheter och kontor.",
      commonTasks: [
        "IKEA-montering",
        "TV-vägg med dold kabelföring",
        "Kontorsmöbler",
        "Hemmakontor"
      ],
      popularServices: [
        { icon: Package, label: "IKEA-montering" },
        { icon: Tv, label: "TV-vägg" },
        { icon: Sofa, label: "Kontorsmöbler" },
        { icon: Home, label: "Hemmakontor" }
      ]
    }
  },
  "Trädgård": {
    "Uppsala": {
      aboutTitle: "Om trädgårdstjänster i Uppsala",
      aboutParagraphs: [
        "Trädgårdstjänster inkluderar gräsklippning, häckklippning, ogräsrensning, plantering och trädgårdsdesign. Vi tar med all utrustning och hanterar bortforsling av gräsklipp och grenar.",
        "I Uppsala erbjuder vi regelbunden trädgårdsskötsel där vi kommer var 7-10:e dag för gräsklippning och underhåll."
      ],
      localAspects: "Uppsala har många villor med trädgårdar som behöver regelbunden skötsel.",
      commonTasks: [
        "Gräsklippning",
        "Häckklippning",
        "Ogräsrensning",
        "Snöskottning"
      ],
      popularServices: [
        { icon: Leaf, label: "Gräsklippning" },
        { icon: Trees, label: "Häckklippning" },
        { icon: Shovel, label: "Ogräsrensning" },
        { icon: Home, label: "Snöskottning" }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om trädgårdstjänster i Stockholm",
      aboutParagraphs: [
        "Trädgårdstjänster inkluderar gräsklippning, häckklippning, BRF-trädgårdar och takträdgårdar. Vi har avtal med flera BRF:er för regelbunden skötsel av gemensamma ytor.",
        "Vi har erfarenhet av takträdgårdar och terrasser inklusive bevattning, plantering och underhåll."
      ],
      localAspects: "Stockholm har många BRF-trädgårdar och takträdgårdar som behöver professionell skötsel.",
      commonTasks: [
        "BRF-trädgårdar",
        "Takträdgårdar",
        "Innergårdar",
        "Automatisk bevattning"
      ],
      popularServices: [
        { icon: Leaf, label: "BRF-skötsel" },
        { icon: Trees, label: "Takträdgård" },
        { icon: Shovel, label: "Innergårdar" },
        { icon: Droplets, label: "Bevattning" }
      ]
    }
  },
  "Tekniska installationer": {
    "Uppsala": {
      aboutTitle: "Om tekniska installationer i Uppsala",
      aboutParagraphs: [
        "Tekniska installationer inkluderar nätverksinstallation, larmsystem, kamerasystem och IT-support. Vi drar nätverkskablar, installerar routrar, wifi-accesspunkter och programmerar larmsystem.",
        "I Uppsala installerar vi ofta nätverk för hemmakontor och små företag samt larmsystem för villor."
      ],
      localAspects: "Uppsala har många hemmakontor som behöver professionell nätverksinstallation.",
      commonTasks: [
        "Nätverkskablar Cat6",
        "Wifi-accesspunkter",
        "Larmsystem",
        "IT-support"
      ],
      popularServices: [
        { icon: Network, label: "Nätverksinstallation" },
        { icon: Camera, label: "Larmsystem" },
        { icon: Wrench, label: "IT-support" },
        { icon: Home, label: "Smart hem" }
      ]
    },
    "Stockholm": {
      aboutTitle: "Om tekniska installationer i Stockholm",
      aboutParagraphs: [
        "Tekniska installationer inkluderar nätverksinstallation, larmsystem, kamerasystem och företagsinstallationer. Vi har stor erfarenhet av företagsinstallationer med nätverk, larm och kamerasystem.",
        "Vi installerar kamerasystem för övervakning av fastigheter och företag med molnlagring."
      ],
      localAspects: "Stockholm har många företag som behöver professionella tekniska installationer.",
      commonTasks: [
        "Företagsnätverk",
        "Kamerasystem",
        "Larmsystem för BRF:er",
        "Molnlagring"
      ],
      popularServices: [
        { icon: Network, label: "Företagsnätverk" },
        { icon: Camera, label: "Kamerasystem" },
        { icon: Wrench, label: "BRF-larm" },
        { icon: Home, label: "Molnlagring" }
      ]
    }
  }
};
