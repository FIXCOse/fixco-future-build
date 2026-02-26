import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { MapPin, Calculator, Info } from "lucide-react";
import { useState } from "react";

interface InteractiveToggleProps {
  showROT: boolean;
  onROTChange: (value: boolean) => void;
  region: 'uppsala' | 'stockholm' | 'both';
  onRegionChange: (value: 'uppsala' | 'stockholm' | 'both') => void;
  disabled?: boolean;
}

const InteractiveToggle = ({ showROT, onROTChange, region, onRegionChange, disabled }: InteractiveToggleProps) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const regions = [
    { id: 'uppsala', label: 'Uppsala', color: 'from-purple-500 to-purple-600' },
    { id: 'stockholm', label: 'Stockholm', color: 'from-blue-500 to-blue-600' },  
    { id: 'both', label: 'Båda', color: 'from-gradient-start to-gradient-end' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-8 p-6 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl mb-8"
    >
      {/* ROT Toggle */}
      <div className="flex items-center space-x-4 relative">
        <div className="flex items-center space-x-3">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="font-medium">ROT-priser</span>
          
          <button
            onMouseEnter={() => setShowTooltip('rot')}
            onMouseLeave={() => setShowTooltip(null)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Switch
            checked={showROT}
            onCheckedChange={onROTChange}
            disabled={disabled}
          />
          
          {/* ROT Indicator */}
          <motion.div
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              showROT ? 'bg-green-400' : 'bg-muted'
            }`}
            animate={{ scale: showROT ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* ROT Tooltip */}
        {showTooltip === 'rot' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-full mt-2 p-3 bg-card border border-border rounded-lg shadow-lg z-10 w-64"
          >
            <p className="text-sm text-muted-foreground">
              ROT-avdrag ger 30% rabatt på arbetskostnaden. Fixco hanterar hela processen åt dig.
            </p>
          </motion.div>
        )}
      </div>

      {/* Region Selector */}
      <div className="flex items-center space-x-4 relative">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-medium">Område</span>
          
          <button
            onMouseEnter={() => setShowTooltip('region')}
            onMouseLeave={() => setShowTooltip(null)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        <div className="flex bg-muted/50 rounded-lg p-1 relative overflow-hidden">
          {/* Sliding background indicator */}
          <motion.div
            layoutId="region-bg"
            className="absolute inset-y-1 bg-primary rounded-md"
            style={{
              width: `${100/3}%`,
              left: `${regions.findIndex(r => r.id === region) * (100/3)}%`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => !disabled && onRegionChange(reg.id as any)}
              disabled={disabled}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-md transition-colors z-10
                ${region === reg.id 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Region Tooltip */}
        {showTooltip === 'region' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-full mt-2 p-3 bg-card border border-border rounded-lg shadow-lg z-10 w-64"
          >
            <p className="text-sm text-muted-foreground">
              Vi täcker Uppsala & Stockholms län fullt ut. För större projekt arbetar vi även nationellt.
            </p>
          </motion.div>
        )}
      </div>

      {/* Status Indicator */}
      <motion.div
        className="flex items-center space-x-2 text-sm"
        animate={{ opacity: disabled ? 0.5 : 1 }}
      >
        <div className={`w-2 h-2 rounded-full ${showROT ? 'bg-green-400' : 'bg-muted'}`} />
        <span className="text-muted-foreground">
          {showROT ? 'ROT-priser visas' : 'Standardpriser'}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveToggle;