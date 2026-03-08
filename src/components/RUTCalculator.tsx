import { useState } from 'react';
import { Calculator, Percent, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/copy/CopyProvider';
import { motion } from 'framer-motion';
import { viewportConfig, itemVariants, containerVariants } from '@/utils/scrollAnimations';
import { openServiceRequestModal } from '@/features/requests/ServiceRequestModal';

const RUTCalculator = () => {
  const { t } = useCopy();
  const [projectCost, setProjectCost] = useState(25000);
  const [householdSize, setHouseholdSize] = useState(2);

  const maxRutDeductionPerPerson = 25000;
  const maxTotalRutDeduction = householdSize * maxRutDeductionPerPerson;
  const rutPercentage = 30;
  const calculatedDeduction = (projectCost * rutPercentage) / 100;
  const actualDeduction = Math.min(calculatedDeduction, maxTotalRutDeduction);
  const finalCost = projectCost - actualDeduction;

  return (
    <section className="py-20 gradient-primary-subtle">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            {t('rot_calc.title').replace('ROT', 'RUT')}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Beräkna din besparing med RUT-avdrag. 30% rabatt på arbetskostnaden, max 25 000 kr per person och år.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="grid md:grid-cols-2">
            {/* Input side */}
            <motion.div variants={itemVariants} className="p-8 space-y-8">
              {/* Project cost slider */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Projektets totalkostnad</span>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={projectCost}
                  onChange={(e) => setProjectCost(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-muted"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(projectCost / 100000) * 100}%, hsl(var(--muted)) ${(projectCost / 100000) * 100}%, hsl(var(--muted)) 100%)`,
                  }}
                />

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">5 000 kr</span>
                  <span className="text-lg font-bold text-foreground">
                    {projectCost.toLocaleString('sv-SE')} kr
                  </span>
                  <span className="text-xs text-muted-foreground">100 000 kr</span>
                </div>
              </div>

              {/* Household size */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Antal personer i hushållet</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((size) => (
                    <button
                      key={size}
                      onClick={() => setHouseholdSize(size)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        householdSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="text-lg font-semibold">{size}</div>
                      <div className="text-xs opacity-80">
                        {size === 1 ? 'person' : 'personer'}
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  Max avdrag: {maxTotalRutDeduction.toLocaleString('sv-SE')} kr
                </p>
              </div>
            </motion.div>

            {/* Result side */}
            <motion.div variants={itemVariants} className="bg-muted/30 p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Projektets kostnad:</span>
                  <span className="font-medium text-foreground">{projectCost.toLocaleString('sv-SE')} kr</span>
                </div>

                <div className="flex justify-between items-center text-sm text-primary">
                  <div className="flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5" />
                    <span>RUT-avdrag (30%):</span>
                  </div>
                  <span className="font-semibold">-{actualDeduction.toLocaleString('sv-SE')} kr</span>
                </div>

                {actualDeduction >= maxTotalRutDeduction && (
                  <p className="text-xs text-primary bg-primary/10 rounded-md px-3 py-2">
                    Maximal RUT-besparing uppnådd ({maxTotalRutDeduction.toLocaleString('sv-SE')} kr)
                  </p>
                )}

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Du betalar:</span>
                    <span className="text-3xl font-bold text-primary">
                      {finalCost.toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                </div>

                <Button className="w-full mt-2" size="lg" onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}>
                  Begär offert med RUT-priser
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RUTCalculator;
