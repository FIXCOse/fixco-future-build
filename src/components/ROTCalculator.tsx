import { useState } from 'react';
import { Calculator, TrendingDown, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ROTCalculator = () => {
  const [projectCost, setProjectCost] = useState(50000);
  const [isCalculating, setIsCalculating] = useState(false);

  const maxRotDeduction = 50000;
  const rotPercentage = 50;
  const actualDeduction = Math.min(projectCost * (rotPercentage / 100), maxRotDeduction);
  const finalCost = projectCost - actualDeduction;

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 1000);
  };

  const examples = [
    {
      title: "Köksrenovering",
      originalCost: 80000,
      description: "Komplett köksrenovering med nya skåp, bänkskivor och vitvaror",
      beforeImage: "🍳",
      afterImage: "✨"
    },
    {
      title: "Badrumsrenovering", 
      originalCost: 120000,
      description: "Totalrenovering med kakel, sanitär och golvvärme",
      beforeImage: "🚿",
      afterImage: "🛁"
    },
    {
      title: "Altan & Trädgård",
      originalCost: 60000,
      description: "Ny altan i trä med plantering och belysning",
      beforeImage: "🌱",
      afterImage: "🌺"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* F Watermark Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <img 
          src="/assets/fixco-f-icon-new.png"
          alt="" 
          className="absolute top-32 left-32 w-24 h-24 object-contain rotate-12 opacity-30 animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <img 
          src="/assets/fixco-f-icon-new.png"
          alt="" 
          className="absolute bottom-24 right-24 w-20 h-20 object-contain -rotate-6 opacity-25 animate-pulse"
          style={{ animationDuration: '4.5s', animationDelay: '1s' }}
        />
        <img 
          src="/assets/fixco-f-icon-new.png"
          alt="" 
          className="absolute top-1/2 right-1/3 w-16 h-16 object-contain rotate-45 opacity-20 animate-pulse"
          style={{ animationDuration: '5.5s', animationDelay: '2.5s' }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">ROT-avdrag</span> – Din besparing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Få 50% rabatt på arbetskostnaden (max 50,000 kr per person och år). 
            Räkna ut din besparing direkt här.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Calculator */}
          <div className="card-premium p-8 relative">
            {/* F Brand Badge */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
              <img 
                src="/assets/fixco-f-icon-new.png"
                alt="Fixco" 
                className="h-4 w-4 object-contain opacity-90"
              />
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <Calculator className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">Beräkna din ROT-besparing</h3>
            </div>

            <div className="space-y-6">
              {/* Project Cost Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Projektets totalkostnad (kr)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="5000"
                    value={projectCost}
                    onChange={(e) => setProjectCost(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div 
                    className="absolute top-0 left-0 h-2 bg-gradient-primary rounded-lg transition-all duration-300"
                    style={{ width: `${(projectCost / 200000) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>10,000 kr</span>
                  <span className="font-bold text-primary text-lg">
                    {projectCost.toLocaleString('sv-SE')} kr
                  </span>
                  <span>200,000 kr</span>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-primary-subtle rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Projektets kostnad:</span>
                  <span className="font-bold">{projectCost.toLocaleString('sv-SE')} kr</span>
                </div>
                
                <div className="flex items-center justify-between text-primary">
                  <span className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5" />
                    <span>ROT-avdrag (50%):</span>
                  </span>
                  <span className="font-bold text-xl">
                    -{actualDeduction.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                
                <hr className="border-border/50" />
                
                <div className="flex items-center justify-between text-2xl font-bold">
                  <span>Du betalar endast:</span>
                  <span className="gradient-text">
                    {finalCost.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                
                {actualDeduction >= maxRotDeduction && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                    <p className="text-sm text-accent">
                      💡 Maximal ROT-besparing uppnådd (50,000 kr per person)
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Button 
                onClick={handleCalculate}
                className="w-full gradient-primary text-primary-foreground text-lg py-6"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Beräknar...</span>
                  </div>
                ) : (
                  <>
                    Begär offert med ROT-priser
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Populära projekt med ROT</h3>
              <p className="text-muted-foreground mb-8">
                Se hur mycket våra kunder sparar på vanliga hemförbättringsprojekt
              </p>
            </div>

            {examples.map((example, index) => {
              const exampleDeduction = Math.min(example.originalCost * 0.5, maxRotDeduction);
              const exampleFinalCost = example.originalCost - exampleDeduction;
              
              return (
                <div key={index} className="card-premium p-6 hover:shadow-glow transition-all duration-300 relative">
                  {/* F Brand Badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition-all duration-300 z-10">
                    <img 
                      src="/assets/fixco-f-icon-new.png"
                      alt="Fixco" 
                      className="h-6 w-6 object-contain opacity-90"
                    />
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">
                      {example.beforeImage} → {example.afterImage}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{example.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {example.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pris:</span>
                          <span className="line-through">
                            {example.originalCost.toLocaleString('sv-SE')} kr
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-primary">
                          <span>ROT-besparing:</span>
                          <span>-{exampleDeduction.toLocaleString('sv-SE')} kr</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Med ROT-avdrag:</span>
                          <span className="gradient-text">
                            {exampleFinalCost.toLocaleString('sv-SE')} kr
                          </span>
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="card-premium p-8 max-w-2xl mx-auto relative">
            {/* F Brand Badge */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
              <img 
                src="/assets/fixco-f-icon-new.png" 
                alt="Fixco" 
                className="h-4 w-4 object-contain opacity-90"
              />
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Börja ditt <span className="gradient-text">ROT-projekt</span> idag
            </h3>
            <p className="text-muted-foreground mb-6">
              Vi hjälper dig med alla ROT-papper och ser till att du får maximal besparing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary text-primary-foreground">
                Boka kostnadsfri konsultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                Läs mer om ROT-avdrag
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROTCalculator;