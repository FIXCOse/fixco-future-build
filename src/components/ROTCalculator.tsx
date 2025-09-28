import { useState } from 'react';
import { Calculator, Percent, Building, Home, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ROTCalculator = () => {
  const [projectCost, setProjectCost] = useState(80000);
  const [householdSize, setHouseholdSize] = useState(2);

  const maxRotDeductionPerPerson = 50000;
  // Ensure correct calculation: 1 person = 50k, 2 = 100k, 3 = 150k, 4 = 200k
  const maxTotalRotDeduction = maxRotDeductionPerPerson * householdSize;
  const rotPercentage = 50;
  const actualDeduction = Math.min(projectCost * (rotPercentage / 100), maxTotalRotDeduction);
  const finalCost = projectCost - actualDeduction;

  const examples = [
    {
      title: "Köksrenovering",
      originalCost: 80000,
      description: "Komplett köksrenovering med nya skåp och vitvaror",
      icon: Home
    },
    {
      title: "Badrumsrenovering", 
      originalCost: 120000,
      description: "Totalrenovering med kakel, sanitär och golvvärme",
      icon: Building
    },
    {
      title: "Altan & Trädgård",
      originalCost: 60000,
      description: "Ny altan med plantering och belysning",
      icon: Wrench
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            ROT-avdrag beräknare
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beräkna din besparing med ROT-avdrag. 50% rabatt på arbetskostnaden, max 50 000 kr per person och år.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Calculator Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Input Section */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calculator className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-medium">Projektets totalkostnad</h4>
                    </div>

                    <div className="relative">
                      <input
                        type="range"
                        min="10000"
                        max="300000"
                        step="5000"
                        value={projectCost}
                        onChange={(e) => setProjectCost(Number(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(projectCost / 300000) * 100}%, hsl(var(--muted)) ${(projectCost / 300000) * 100}%, hsl(var(--muted)) 100%)`
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>10 000 kr</span>
                      <span className="font-semibold text-foreground text-lg">
                        {projectCost.toLocaleString('sv-SE')} kr
                      </span>
                      <span>300 000 kr</span>
                    </div>
                  </div>

                  {/* Household Size Selector */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-medium">Antal personer i hushållet</h4>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((size) => (
                        <button
                          key={size}
                          onClick={() => setHouseholdSize(size)}
                          className={`p-3 rounded-lg border transition-colors ${
                            householdSize === size
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background hover:bg-muted'
                          }`}
                        >
                          <div className="text-lg font-semibold">{size}</div>
                          <div className="text-xs opacity-80">
                            {size === 1 ? 'person' : 'personer'}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Max avdrag: {maxTotalRotDeduction.toLocaleString('sv-SE')} kr 
                      ({householdSize} × 50 000 kr)
                    </p>
                  </div>
                </div>

                {/* Right: Results Section */}
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Projektets kostnad:</span>
                      <span className="font-semibold">{projectCost.toLocaleString('sv-SE')} kr</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-primary">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        <span>ROT-avdrag (50%):</span>
                      </div>
                      <span className="font-semibold">
                        -{actualDeduction.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Du betalar:</span>
                        <span className="text-2xl font-bold text-primary">
                          {finalCost.toLocaleString('sv-SE')} kr
                        </span>
                      </div>
                    </div>
                    
                    {actualDeduction >= maxTotalRotDeduction && (
                      <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
                        <p className="text-sm text-primary font-medium">
                          Maximal ROT-besparing uppnådd ({maxTotalRotDeduction.toLocaleString('sv-SE')} kr för {householdSize} {householdSize === 1 ? 'person' : 'personer'})
                        </p>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" size="lg">
                    Begär offert med ROT-priser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples Grid */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Populära ROT-projekt</h3>
              <p className="text-muted-foreground">
                Se hur mycket våra kunder sparar på vanliga hemförbättringsprojekt
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {examples.map((example, index) => {
                const exampleDeduction = Math.min(example.originalCost * 0.5, maxTotalRotDeduction);
                const exampleFinalCost = example.originalCost - exampleDeduction;
                const IconComponent = example.icon;
                
                return (
                  <Card key={index} className="h-full">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-semibold text-lg">{example.title}</h4>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-6 flex-1">
                        {example.description}
                      </p>
                      
                      <div className="space-y-2 border-t border-border pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ursprungspris:</span>
                          <span className="line-through">
                            {example.originalCost.toLocaleString('sv-SE')} kr
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-primary">
                          <span>ROT-besparing:</span>
                          <span>-{exampleDeduction.toLocaleString('sv-SE')} kr</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Med ROT-avdrag:</span>
                          <span className="text-primary">
                            {exampleFinalCost.toLocaleString('sv-SE')} kr
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <Card className="mt-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Börja ditt ROT-projekt idag
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Vi hjälper dig med alla ROT-papper och ser till att du får maximal besparing på ditt hemförbättringsprojekt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Boka kostnadsfri konsultation
                </Button>
                <Button size="lg" variant="outline">
                  Läs mer om ROT-avdrag
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ROTCalculator;