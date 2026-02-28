import { useState } from 'react';
import { Calculator, Percent, Building, Home, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCopy } from '@/copy/CopyProvider';

const ROTCalculator = () => {
  const { t } = useCopy();
  const [projectCost, setProjectCost] = useState(80000);
  const [householdSize, setHouseholdSize] = useState(2);

  const maxRotDeductionPerPerson = 50000;
  const maxTotalRotDeduction = householdSize * maxRotDeductionPerPerson;
  const rotPercentage = 30;
  const calculatedDeduction = (projectCost * rotPercentage) / 100;
  const actualDeduction = Math.min(calculatedDeduction, maxTotalRotDeduction);
  const finalCost = projectCost - actualDeduction;

  const examples = [
    { title: t('rot_calc.kitchen'), originalCost: 80000, description: t('rot_calc.kitchenDesc'), icon: Home },
    { title: t('rot_calc.bathroom'), originalCost: 120000, description: t('rot_calc.bathroomDesc'), icon: Building },
    { title: t('rot_calc.deckGarden'), originalCost: 60000, description: t('rot_calc.deckGardenDesc'), icon: Wrench },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t('rot_calc.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('rot_calc.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calculator className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-medium">{t('rot_calc.projectCost')}</h4>
                    </div>

                    <div className="relative">
                      <input
                        type="range" min="10000" max="500000" step="5000"
                        value={projectCost}
                        onChange={(e) => setProjectCost(Number(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(projectCost / 500000) * 100}%, hsl(var(--muted)) ${(projectCost / 500000) * 100}%, hsl(var(--muted)) 100%)`
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>10 000 kr</span>
                      <span className="font-semibold text-foreground text-lg">
                        {projectCost.toLocaleString('sv-SE')} kr
                      </span>
                      <span>500 000 kr</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-medium">{t('rot_calc.householdSize')}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((size) => (
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
                            {size === 1 ? t('rot_calc.person') : t('rot_calc.persons')}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {t('rot_calc.maxDeduction')}: {maxTotalRotDeduction.toLocaleString('sv-SE')} kr 
                      ({householdSize} × 50 000 kr = {(householdSize * 50000).toLocaleString('sv-SE')} kr)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('rot_calc.fullDeductionTip')} {Math.ceil(maxTotalRotDeduction / 0.30).toLocaleString('sv-SE')} kr
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t('rot_calc.costLabel')}</span>
                      <span className="font-semibold">{projectCost.toLocaleString('sv-SE')} kr</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-primary">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        <span>{t('rot_calc.rotDeduction30')}</span>
                      </div>
                      <span className="font-semibold">
                        -{actualDeduction.toLocaleString('sv-SE')} kr
                      </span>
                    </div>
                    
                    {actualDeduction < maxTotalRotDeduction && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-700">
                          {t('rot_calc.moreDeduction')}
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{t('rot_calc.youPay')}</span>
                        <span className="text-2xl font-bold text-primary">
                          {finalCost.toLocaleString('sv-SE')} kr
                        </span>
                      </div>
                    </div>
                    
                    {actualDeduction >= maxTotalRotDeduction && (
                      <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
                        <p className="text-sm text-primary font-medium">
                          {t('rot_calc.maxSavingsReached')} ({maxTotalRotDeduction.toLocaleString('sv-SE')} kr)
                        </p>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" size="lg">
                    {t('rot_calc.requestQuoteRot')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{t('rot_calc.popularProjects')}</h3>
              <p className="text-muted-foreground">{t('rot_calc.popularSubtitle')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {examples.map((example, index) => {
                const exampleDeduction = Math.min(example.originalCost * 0.3, maxTotalRotDeduction);
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
                      
                      <p className="text-sm text-muted-foreground mb-6 flex-1">{example.description}</p>
                      
                      <div className="space-y-2 border-t border-border pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('rot_calc.originalPrice')}</span>
                          <span className="line-through">{example.originalCost.toLocaleString('sv-SE')} kr</span>
                        </div>
                        <div className="flex justify-between text-sm text-primary">
                          <span>{t('rot_calc.rotSaving')}</span>
                          <span>-{exampleDeduction.toLocaleString('sv-SE')} kr</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>{t('rot_calc.withRot')}</span>
                          <span className="text-primary">{exampleFinalCost.toLocaleString('sv-SE')} kr</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="mt-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{t('rot_calc.startToday')}</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{t('rot_calc.startTodayDesc')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">{t('rot_calc.bookConsultation')}</Button>
                <Button size="lg" variant="outline">{t('rot_calc.readMoreRot')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ROTCalculator;