import { useState } from 'react';
import { Calculator, Percent, Users, Home, Wrench, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const RUTCalculator = () => {
  const [projectCost, setProjectCost] = useState(25000);
  const [householdSize, setHouseholdSize] = useState(2);

  // RUT calculations - different rules than ROT
  const maxRutDeductionPerPerson = 25000; // RUT is 25k per person vs ROT's 50k
  const maxTotalRutDeduction = householdSize * maxRutDeductionPerPerson; // 1=25k, 2=50k, 3=75k, 4=100k
  const rutPercentage = 50; // Same 50% as ROT
  const calculatedDeduction = (projectCost * rutPercentage) / 100;
  const actualDeduction = Math.min(calculatedDeduction, maxTotalRutDeduction);
  const finalCost = projectCost - actualDeduction;

  // Debug log to verify calculations
  console.log('Debug RUT Calculator:', {
    householdSize,
    maxTotalRutDeduction,
    projectCost,
    calculatedDeduction,
    actualDeduction,
    finalCost
  });

  const examples = [
    {
      title: "Städning",
      originalCost: 15000,
      description: "Regelbunden hemstädning under hela året",
      icon: Home
    },
    {
      title: "Trädgårdsskötsel", 
      originalCost: 30000,
      description: "Beskärning, plantering och gräsklippning",
      icon: Leaf
    },
    {
      title: "Reparationer",
      originalCost: 20000,
      description: "Mindre reparationer och underhållsarbeten",
      icon: Wrench
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Calculator className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">RUT-avdrag</span> Kalkylator
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Beräkna exakt hur mycket du kan spara på hushållsnära tjänster med RUT-avdrag. 
            Få 50% rabatt direkt vid betalning, upp till 25 000 kr per person och år.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Calculator */}
          <div className="space-y-8">
            <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Project Cost Slider */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-lg font-semibold text-foreground">
                        Projektets totalkostnad
                      </label>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {projectCost.toLocaleString('sv-SE')} kr
                        </div>
                        <div className="text-sm text-muted-foreground">inklusive material & arbete</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="5000"
                        max="150000"
                        step="2500"
                        value={projectCost}
                        onChange={(e) => setProjectCost(Number(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(projectCost / 150000) * 100}%, hsl(var(--muted)) ${(projectCost / 150000) * 100}%, hsl(var(--muted)) 100%)`
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>5 000 kr</span>
                      <span className="font-semibold text-foreground text-lg">
                        {projectCost.toLocaleString('sv-SE')} kr
                      </span>
                      <span>150 000 kr</span>
                    </div>
                  </div>

                  {/* Household Size */}
                  <div className="space-y-4">
                    <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Antal personer i hushållet
                    </label>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((size) => (
                        <button
                          key={size}
                          onClick={() => setHouseholdSize(size)}
                          className={`p-4 text-center rounded-lg border-2 font-semibold transition-all ${
                            householdSize === size
                              ? 'border-primary bg-primary text-primary-foreground shadow-md'
                              : 'border-border bg-background text-foreground hover:border-primary/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
                      Max avdrag: {maxTotalRutDeduction.toLocaleString('sv-SE')} kr 
                      ({householdSize} × 25 000 kr = {(householdSize * 25000).toLocaleString('sv-SE')} kr)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      💡 För att få fullt avdrag ({maxTotalRutDeduction.toLocaleString('sv-SE')} kr) behöver projektet kosta minst {(maxTotalRutDeduction * 2).toLocaleString('sv-SE')} kr
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="overflow-hidden border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                    <Percent className="h-6 w-6" />
                    <span className="text-lg font-semibold">Ditt RUT-avdrag</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-muted-foreground">Projektets kostnad:</span>
                      <span className="font-semibold">
                        {projectCost.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg border-t border-green-200 pt-4">
                      <span className="text-green-700 dark:text-green-400 font-semibold">RUT-avdrag (50%):</span>
                      <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                        -{actualDeduction.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                    
                    {actualDeduction < maxTotalRutDeduction && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-700">
                          Du kan få upp till {(maxTotalRutDeduction - actualDeduction).toLocaleString('sv-SE')} kr mer i avdrag med större tjänster!
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t border-green-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-foreground">Du betalar endast:</span>
                        <span className="text-3xl font-bold text-green-700 dark:text-green-400">
                          {finalCost.toLocaleString('sv-SE')} kr
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Rabatten dras av direkt vid fakturering
                      </p>
                    </div>
                  </div>
                  
                  <Button size="lg" className="w-full gradient-primary text-primary-foreground font-bold">
                    <Calculator className="h-5 w-5 mr-2" />
                    Begär offert med RUT-avdrag
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Examples & Info */}
          <div className="space-y-8">
            {/* Example Projects */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Exempel på RUT-berättigade tjänster</h3>
              
              <div className="space-y-4">
                {examples.map((example, index) => {
                  const exampleDeduction = Math.min((example.originalCost * 50) / 100, maxTotalRutDeduction);
                  const exampleFinalCost = example.originalCost - exampleDeduction;
                  
                  return (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <example.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{example.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{example.description}</p>
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                <span className="line-through text-muted-foreground">{example.originalCost.toLocaleString('sv-SE')} kr</span>
                                <span className="ml-2 font-bold text-green-600">
                                  {exampleFinalCost.toLocaleString('sv-SE')} kr
                                </span>
                              </div>
                              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                -{exampleDeduction.toLocaleString('sv-SE')} kr besparing
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Key Benefits */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 text-primary">Fördelar med RUT-avdrag</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm"><strong>Direkt rabatt:</strong> Du får rabatten vid betalning, inte som återbäring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm"><strong>Ingen ansökan:</strong> Vi sköter alla RUT-formaliteter automatiskt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm"><strong>Årligt:</strong> 25 000 kr avdrag per person per år</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm"><strong>Flexibelt:</strong> Kan användas för många olika hushållstjänster</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RUTCalculator;