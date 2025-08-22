import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button-premium";
import { ArrowRight, CheckCircle, Star, Clock } from "lucide-react";

const serviceData = {
  "snickeri": {
    title: "Snickeri",
    description: "Professionell snickeriservice för kök, badrum, inredning och skräddarsydda möbler",
    hero: "Vi är experter på alla typer av träarbeten och snickeriprojekt. Från kompletta köksrenovering till skräddarsydda förvaringslösningar.",
    services: [
      { name: "Platsbygga garderober", description: "Skräddarsydda garderobslösningar", price: "Offert", rotPrice: "Offert" },
      { name: "Bygga altan/trall", description: "Uteplatser och terrasslösningar", price: "Offert", rotPrice: "Offert" },
      { name: "Bygga innerväggar", description: "Nya väggar för rumsindelning", price: "Offert", rotPrice: "Offert" },
      { name: "Montera innerdörrar", description: "Installation av dörrar", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera köksluckor & skåp", description: "Köksinredning och installation", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Bygga köksö", description: "Centralt köksöar på mått", price: "Offert", rotPrice: "Offert" },
      { name: "Reparera dörrkarmar", description: "Åtgärd av dörrkarmar", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera lister, foder & socklar", description: "Finish-arbeten", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Trapprenovering", description: "Renovera befintliga trappor", price: "Offert", rotPrice: "Offert" },
      { name: "Golvläggning (parkett/laminat)", description: "Professionell golvläggning", price: "Offert", rotPrice: "Offert" },
      { name: "Väggpanel/spont", description: "Väggbeklädnader i trä", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Hyllsystem, bokhyllor", description: "Förvaringslösningar", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Skjutdörrsgarderob", description: "Moderna garderobslösningar", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Dörrjusteringar", description: "Justera och fixa dörrar", price: "959 kr/h", rotPrice: "480 kr/h" }
    ],
    basePrice: "959",
    rotPrice: "480",
    startTime: "24h",
    warranty: "5 år garanti"
  },
  "vvs": {
    title: "VVS",
    description: "Professionell VVS-service för badrum, kök och hela hemmet",
    hero: "Auktoriserade VVS-installatörer med mångårig erfarenhet av allt från enkla reparationer till kompletta badrumsrenoveringar.",
    services: [
      { name: "Byta toalettstol", description: "Komplett byte av toalettstol", price: "3 500 kr", rotPrice: "1 750 kr" },
      { name: "Byta handfat", description: "Installation av nytt handfat", price: "2 500 kr", rotPrice: "1 250 kr" },
      { name: "Installera blandare", description: "Montering av nya blandare", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Byta köksblandare", description: "Byte av köksblandare", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera duschkabin", description: "Installation av duschkabin", price: "Offert", rotPrice: "Offert" },
      { name: "Installera duschvägg", description: "Glasväggar för dusch", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Installera tvättmaskin/diskmaskin", description: "Vattenanslutning vitvaror", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Täta rörkopplingar", description: "Läckagetätning", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Byta vattenlås", description: "Reparation avlopp", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Renovera badrum", description: "Kompletta badrumsprojekt", price: "Offert", rotPrice: "Offert" }
    ],
    basePrice: "959",
    rotPrice: "480",
    startTime: "24h",
    warranty: "5 år garanti"
  },
  "montering": {
    title: "Montering",
    description: "Professionell montering av möbler, vitvaror och teknisk utrustning",
    hero: "Vi monterar allt från IKEA-möbler till avancerad teknisk utrustning. Snabbt, säkert och professionellt.",
    services: [
      { name: "Montering av möbler (IKEA/Jysk/Mio)", description: "Alla typer av möbler", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera TV-väggfäste", description: "Säker TV-montering", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera garderober", description: "Kompletta garderobssystem", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera kontorsmöbler", description: "Skrivbord, stolar, förvaring", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera hyllsystem", description: "Väggmonterade hyllor", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera köksutrustning", description: "Vitvaror och inredning", price: "Offert", rotPrice: "Offert" },
      { name: "Installera skjutdörrsgarderob", description: "Avancerade garderobssystem", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Montera gardinskenor", description: "Takmontage av skenor", price: "959 kr/h", rotPrice: "480 kr/h" }
    ],
    basePrice: "959",
    rotPrice: "480", 
    startTime: "24h",
    warranty: "2 år garanti"
  },
  "tradgard": {
    title: "Trädgård",
    description: "Professionell trädgårdsservice från anläggning till löpande skötsel",
    hero: "Vi skapar och sköter din trädgård året runt. Från gräsmattor och plantering till beskärning och underhåll.",
    services: [
      { name: "Anlägga rullgräs", description: "Snabb gräsmatteanläggning", price: "Offert", rotPrice: "Offert" },
      { name: "Så gräsmatta", description: "Traditionell gräsmatteläggning", price: "Offert", rotPrice: "Offert" },
      { name: "Plantera häckar & buskar", description: "Plantering och etablering", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Klippa häckar", description: "Professionell häckklippning", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Beskära träd", description: "Trädvård och beskärning", price: "Offert", rotPrice: "Offert" },
      { name: "Bygga staket", description: "Staketinstallation", price: "Offert", rotPrice: "Offert" },
      { name: "Bygga altan i trädgård", description: "Uteplatser och altaner", price: "Offert", rotPrice: "Offert" },
      { name: "Rabatter, kantsten", description: "Trädgårdsdesign och kantning", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Ogräsrensning", description: "Rensning av ogräs", price: "959 kr/h", rotPrice: "480 kr/h" }
    ],
    basePrice: "959",
    rotPrice: "480",
    startTime: "24-48h",
    warranty: "1 år garanti"
  },
  "stadning": {
    title: "Städning",
    description: "Professionell städservice för hem, kontor och byggen",
    hero: "Vi erbjuder allt från regelbunden hemstädning till specialstädning efter renoveringar.",
    services: [
      { name: "Flyttstäd", description: "Grundlig städning vid flytt", price: "60 kr/kvm", rotPrice: "60 kr/kvm" },
      { name: "Hemstädning", description: "Regelbunden hemstädning", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Byggstädning", description: "Städning efter byggjobb", price: "Offert", rotPrice: "Offert" },
      { name: "Kontorsstädning", description: "Städning av kontorslokaler", price: "Offert", rotPrice: "Offert" },
      { name: "Fönsterputs", description: "Fönsterputsning in och utvändigt", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Stor- och veckostäd", description: "Grundlig rengöring", price: "959 kr/h", rotPrice: "480 kr/h" }
    ],
    basePrice: "959",
    rotPrice: "480",
    startTime: "24h",
    warranty: "Kvalitetsgaranti"
  },
  "projektledning": {
    title: "Projektledning", 
    description: "Helhetslösningar från idé till färdigt resultat",
    hero: "Vi tar totalansvar för ditt byggprojekt. Från planering och bygglov till slutbesiktning och garantiservice.",
    services: [
      { name: "Byggledning", description: "Professionell byggledning", price: "Offert", rotPrice: "Offert" },
      { name: "Projektplanering", description: "Detaljplanering av projekt", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Konsultation bygg & mark", description: "Rådgivning och konsulttjänster", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Samordning med underentreprenörer", description: "Koordinering av alla aktörer", price: "Offert", rotPrice: "Offert" },
      { name: "Kvalitetskontroller", description: "Kontroll av arbeten", price: "959 kr/h", rotPrice: "480 kr/h" }
    ],
    basePrice: "1159",
    rotPrice: "580",
    startTime: "48h",
    warranty: "5 år garanti"
  },
  "markarbeten": {
    title: "Markarbeten",
    description: "Professionella markarbeten från schakt till färdig anläggning",
    hero: "Vi utför alla typer av markarbeten med modern utrustning. Från dränering till stora schaktningsprojekt.",
    services: [
      { name: "Dränering runt hus", description: "Dränering för fuktskydd", price: "Offert", rotPrice: "Offert" },
      { name: "Grävarbeten", description: "Schaktning och grävning", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Schakt & fyllning", description: "Markarbeten för byggnation", price: "Offert", rotPrice: "Offert" },
      { name: "Förberedelse för stensättning", description: "Markberedning för stenläggning", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Plintar till staket/altan", description: "Betongplintar och fundament", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Grusgångar & infarter", description: "Anläggning av grusytor", price: "Offert", rotPrice: "Offert" },
      { name: "Bortforsling av massor", description: "Transport av schaktmassor", price: "Offert", rotPrice: "Offert" }
    ],
    basePrice: "1259",
    rotPrice: "630",
    startTime: "48h",
    warranty: "3 år garanti"
  },
  "tekniska-installationer": {
    title: "Tekniska installationer",
    description: "Avancerade tekniska installationer och smarta hemlösningar", 
    hero: "Vi installerar och konfigurerar modern teknik för ditt hem. Från säkerhetssystem till smart home-automation.",
    services: [
      { name: "Montera vitvaror", description: "Installation av vitvaror", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Installera ventilation (mindre jobb)", description: "Mindre ventilationsarbeten", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Installera köksfläkt", description: "Montering av köksfläktar", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Större installationer", description: "Komplexa tekniska system", price: "Offert", rotPrice: "Offert" },
      { name: "Smarta hem-enheter (kameror, lås, belysning)", description: "Smart home-installation", price: "959 kr/h", rotPrice: "480 kr/h" }
    ],
    basePrice: "1159",
    rotPrice: "580",
    startTime: "24-48h",
    warranty: "3 år garanti"
  },
  "el": {
    title: "El",
    description: "Auktoriserade elinstallationer och reparationer",
    hero: "Våra behöriga elektriker utför säkra installationer enligt gällande elsäkerhetsverkets föreskrifter.",
    services: [
      { name: "Byta vägguttag", description: "Byte av eluttag", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Byta dimmer", description: "Installation av dimmers", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Byta strömbrytare", description: "Byte av strömbrytare", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Installera lampor", description: "Montering av belysning", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Installera spotlights", description: "Spotbelysning i tak", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Installera utebelysning", description: "Utomhusbelysning", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Dragning av ny el", description: "Nya elinstallationer", price: "Offert", rotPrice: "Offert" },
      { name: "El för renovering/nybygge", description: "Kompletta elsystem", price: "Offert", rotPrice: "Offert" }
    ],
    basePrice: "1059",
    rotPrice: "530",
    startTime: "24h",
    warranty: "5 år garanti"
  },
  "fastighetsskotsel": {
    title: "Fastighetsskötsel",
    description: "Löpande fastighetsskötsel och underhållsservice",
    hero: "Vi sköter din fastighet året runt med förebyggande underhåll och snabb service vid behov.",
    services: [
      { name: "Löpande fastighetsskötsel", description: "Regelbundet underhåll", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Snöskottning", description: "Vinterservice", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Mindre reparationer", description: "Akuta reparationer", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Underhåll av trapphus/källare", description: "Gemensamma utrymmen", price: "959 kr/h", rotPrice: "480 kr/h" },
      { name: "Större underhållsprojekt", description: "Omfattande underhållsarbeten", price: "Offert", rotPrice: "Offert" },
      { name: "Klottersanering", description: "Borttagning av klotter", price: "959 kr/h", rotPrice: "480 kr/h" }
    ],
    basePrice: "959",
    rotPrice: "480",
    startTime: "24h", 
    warranty: "1 år garanti"
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const [showROTPrice, setShowROTPrice] = useState(true);
  
  const service = servicesData.find(s => s.slug === slug);
  const service = serviceData[slug as keyof typeof serviceData];

  if (!service) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 text-center">
          <h1 className="text-4xl font-bold">Tjänst inte hittad</h1>
          <p className="text-muted-foreground mt-4">Den tjänst du letar efter finns inte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">{service.title}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {service.description}
            </p>
            <p className="text-lg mb-8">
              {service.hero}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="cta" size="xl">
                Begär offert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="ghost-premium" size="xl">
                Ring 08-123 456 78
              </Button>
            </div>

            {/* Key metrics */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="card-premium p-4">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Projektstart</div>
                <div className="font-bold">{service.startTime}</div>
              </div>
              <div className="card-premium p-4">
                <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Garanti</div>
                <div className="font-bold">{service.warranty}</div>
              </div>
              <div className="card-premium p-4">
                <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">ROT-avdrag</div>
                <div className="font-bold gradient-text">50% rabatt</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Våra <span className="gradient-text">{service.title.toLowerCase()}</span> tjänster
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {service.services.map((subService, index) => (
              <div 
                key={subService.name}
                className="card-premium p-6 animate-fade-in-up hover:shadow-glow transition-all duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <h3 className="text-xl font-bold mb-3">{subService.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{subService.description}</p>

                {/* Pricing */}
                <div className="border-t border-border pt-4 mb-4">
                  {subService.price === "Offert" ? (
                    <div className="text-center">
                      <span className="text-lg font-bold gradient-text">Offert</span>
                      <div className="text-xs text-muted-foreground mt-1">Pris efter besiktning</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">Ordinarie:</span>
                        <span className="font-semibold line-through text-muted-foreground text-sm">{subService.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-primary">Med ROT:</span>
                        <span className="text-lg font-bold gradient-text">{subService.rotPrice}</span>
                      </div>
                    </>
                  )}
                </div>

                <Button variant="premium" size="sm" className="w-full">
                  {subService.price === "Offert" ? "Begär offert" : "Boka nu"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-primary-subtle opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Redo att starta ditt <span className="gradient-text">{service.title.toLowerCase()}</span> projekt?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Få en kostnadsfri offert inom 24 timmar. Vi hjälper dig från idé till färdigt resultat.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4 gradient-text">Kostnadsfri offert</h3>
                <p className="text-muted-foreground mb-6">
                  Vi kommer hem till dig och gör en noggrann genomgång av ditt projekt. 
                  Offerten är alltid kostnadsfri och utan förpliktelser.
                </p>
                <Link to="/boka-hembesok">
                  <Button variant="cta" className="w-full">
                    Boka hembesök
                  </Button>
                </Link>
              </div>
              
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4 gradient-text">ROT-avdrag direkt</h3>
                <p className="text-muted-foreground mb-6">
                  Vi hjälper dig med alla ROT-papper och du betalar direkt det rabatterade priset. 
                  Spara 50% på arbetskostnaden.
                </p>
                <Link to="/rot-info">
                  <Button variant="premium" className="w-full">
                    Läs mer om ROT
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;