import { Button } from "@/components/ui/button-premium";
import { CheckCircle, Calculator, DollarSign, FileText, ArrowRight, Percent } from "lucide-react";
import { Link } from "react-router-dom";

const ROTInfo = () => {
  const examples = [
    {
      service: "Köksblandare byte",
      work: "2 timmar arbete",
      normalPrice: "1 918 kr",
      rotPrice: "960 kr",
      savings: "958 kr"
    },
    {
      service: "Toalettstol byte", 
      work: "Fast pris",
      normalPrice: "3 500 kr",
      rotPrice: "1 750 kr", 
      savings: "1 750 kr"
    },
    {
      service: "Köksrenovering",
      work: "40 timmar arbete",
      normalPrice: "38 360 kr",
      rotPrice: "19 200 kr",
      savings: "19 160 kr"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="gradient-text">ROT-avdrag</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Spara 50% på arbetskostnaden med ROT-avdraget. Vi hjälper dig genom hela processen 
              så du får maximal avdrag utan krångel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/boka-hembesok">
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  Boka hembesök
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                Ring: 08-123 456 78
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is ROT */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Vad är <span className="gradient-text">ROT-avdrag</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                ROT-avdrag är ett skatteavdrag som ger dig 50% rabatt på arbetskostnaden för 
                <strong> reparation, om- och tillbyggnad</strong> samt underhållsarbeten i din bostad.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Avdraget görs direkt från din skatt och du kan få maximalt 50 000 kr per person och år. 
                För sambor blir det totalt 100 000 kr per hushåll.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>50% rabatt på arbetskostnaden</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Max 50 000 kr per person och år</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Gäller för permanentbostäder</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Vi sköter alla ansökningar</span>
                </div>
              </div>
            </div>
            
            <div className="card-premium p-8">
              <Percent className="h-12 w-12 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-center mb-4 gradient-text">50% Rabatt</h3>
              <p className="text-center text-muted-foreground mb-6">
                Du betalar bara hälften av arbetskostnaden när du använder ROT-avdraget
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Exempel: Pris</div>
                  <div className="text-2xl font-bold line-through text-muted-foreground mb-2">959 kr/h</div>
                  <div className="text-sm text-primary mb-2">Med ROT-avdrag</div>
                  <div className="text-3xl font-bold gradient-text">480 kr/h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            Exempel på <span className="gradient-text">besparingar</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <div key={example.service} className="card-premium p-6 animate-fade-in-up"
                   style={{ animationDelay: `${index * 0.2}s` }}>
                <h3 className="text-xl font-bold mb-4">{example.service}</h3>
                <p className="text-sm text-muted-foreground mb-4">{example.work}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pris:</span>
                    <span className="font-semibold line-through text-muted-foreground">{example.normalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-primary">Med ROT-avdrag:</span>
                    <span className="font-bold text-primary">{example.rotPrice}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Du sparar:</span>
                      <span className="text-xl font-bold gradient-text">{example.savings}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            Så <span className="gradient-text">enkelt</span> fungerar det
          </h2>
          
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Vi gör jobbet",
                description: "Du bokar tjänsten och vi utför arbetet professionellt enligt offert.",
                icon: CheckCircle
              },
              {
                step: "2", 
                title: "Vi skickar in ansökan",
                description: "Vi fyller i och skickar ROT-ansökan till Skatteverket åt dig. Inget krångel för dig.",
                icon: FileText
              },
              {
                step: "3",
                title: "Du betalar rabatterat pris",
                description: "Du betalar bara 50% av arbetskostnaden direkt till oss. Resten får du tillbaka via skatten.",
                icon: DollarSign
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="flex items-center space-x-6 card-premium p-6 animate-fade-in-up"
                     style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  <IconComponent className="h-8 w-8 text-primary flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What qualifies */}
      <section className="py-20 gradient-primary-subtle">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            Vad <span className="gradient-text">kvalificerar</span> för ROT?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">✅ Kvalificerar för ROT</h3>
              <div className="space-y-3">
                {[
                  "Snickeriarbeten (kök, badrum, inredning)",
                  "VVS-installationer och reparationer", 
                  "Elinstallationer och belysning",
                  "Målning och tapetsering",
                  "Golvläggning och kakelarbeten",
                  "Trädgårdsarbeten och anläggning",
                  "Fasadarbeten och takarbeten",
                  "Montering av möbler och utrustning",
                  "Markarbeten och dränering"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-premium p-8">
              <h3 className="text-2xl font-bold mb-6 text-muted-foreground">❌ Kvalificerar INTE för ROT</h3>
              <div className="space-y-3">
                {[
                  "Enbart städning (utan byggarbete)",
                  "Nybyggnation av hela hus",
                  "Arbete på fritidshus som inte är permanentbostad", 
                  "Arbete utomhus som inte hör till bostaden",
                  "Rena konsulttjänster utan fysiskt arbete",
                  "Material (endast arbetskostnaden berättigar)",
                  "Flyttkostnader",
                  "Försäkringsärenden",
                  "Arbete på kommersiella fastigheter"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-muted-foreground flex items-center justify-center flex-shrink-0">
                      <span className="text-background text-xs">✕</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Redo att <span className="gradient-text">spara 50%</span> på ditt projekt?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Boka en kostnadsfri konsultation så hjälper vi dig få maximal ROT-avdrag.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/boka-hembesok">
                <Button size="lg" className="gradient-primary text-primary-foreground font-bold">
                  Boka hembesök nu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/kontakt">
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 font-bold">
                  Begär offert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ROTInfo;