import { motion } from "framer-motion";
import { Zap, Wrench, Hammer } from "lucide-react";

type CaseType = 'el' | 'vvs' | 'snickeri';

interface CaseSwitcherProps {
  selectedCase: CaseType;
  onCaseChange: (caseType: CaseType) => void;
  disabled?: boolean;
}

const CaseSwitcher = ({ selectedCase, onCaseChange, disabled }: CaseSwitcherProps) => {
  const cases = [
    {
      id: 'el' as CaseType,
      label: 'El',
      icon: Zap,
      description: 'Elinstallationer',
      color: 'from-yellow-500 to-amber-600',
      examples: 'Uttag, belysning, laddbox'
    },
    {
      id: 'vvs' as CaseType,
      label: 'VVS', 
      icon: Wrench,
      description: 'Rör & Värme',
      color: 'from-blue-500 to-cyan-600',
      examples: 'Badrum, kök, värme'
    },
    {
      id: 'snickeri' as CaseType,
      label: 'Snickeri',
      icon: Hammer,
      description: 'Inredning & Bygg',
      color: 'from-amber-600 to-orange-600',
      examples: 'Kök, garderober, dörrar'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h3 className="text-xl font-bold mb-2">Välj tjänstekategori</h3>
        <p className="text-muted-foreground text-sm">
          Se hur Fixco presterar inom olika områden
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cases.map((caseItem, index) => {
          const IconComponent = caseItem.icon;
          const isSelected = selectedCase === caseItem.id;
          
          return (
            <motion.button
              key={caseItem.id}
              onClick={() => !disabled && onCaseChange(caseItem.id)}
              disabled={disabled}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-glow' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="case-indicator"
                  className="absolute inset-0 border-2 border-primary rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Icon with gradient background */}
              <div className={`
                w-14 h-14 rounded-xl mb-4 flex items-center justify-center
                bg-gradient-to-br ${caseItem.color} ${isSelected ? 'shadow-lg' : ''}
              `}>
                <IconComponent className="h-7 w-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <div>
                <h4 className={`font-bold text-lg mb-1 transition-colors ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}>
                  {caseItem.label}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {caseItem.description}  
                </p>
                <p className="text-xs text-muted-foreground">
                  {caseItem.examples}
                </p>
              </div>

              {/* Active state glow */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-primary/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Additional info for selected case */}
      <motion.div
        key={selectedCase}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 p-4 bg-muted/50 rounded-lg border border-primary/20"
      >
        <div className="flex items-center space-x-3">
          {(() => {
            const selectedCaseData = cases.find(c => c.id === selectedCase);
            if (!selectedCaseData) return null;
            const IconComponent = selectedCaseData.icon;
            return (
              <>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedCaseData.color} flex items-center justify-center`}>
                  <IconComponent className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Visar data för: {selectedCaseData.description}</div>
                  <div className="text-xs text-muted-foreground">
                    Inkluderar: {selectedCaseData.examples}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </motion.div>
    </div>
  );
};

export default CaseSwitcher;