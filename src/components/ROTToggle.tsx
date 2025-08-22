import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface ROTToggleProps {
  defaultEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
  className?: string;
}

const ROTToggle = ({ defaultEnabled = true, onChange, className = "" }: ROTToggleProps) => {
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    onChange?.(checked);
  };

  return (
    <div className={`flex items-center space-x-3 p-4 border border-primary/20 rounded-lg bg-primary/5 ${className}`}>
      <Switch 
        id="rot-toggle"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
      <div className="flex-1">
        <Label htmlFor="rot-toggle" className="flex items-center space-x-2 cursor-pointer">
          <span className="font-medium text-foreground">
            {isEnabled ? 'Visa priser med ROT-avdrag' : 'Visa ordinarie priser'}
          </span>
          <Info className="h-4 w-4 text-muted-foreground" />
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          {isEnabled 
            ? 'Spara 50% på arbetskostnaden med ROT-avdrag' 
            : 'Växla för att se priser med ROT-avdrag'
          }
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-primary">
          {isEnabled ? '50% RABATT' : 'ORDINARIE PRIS'}
        </div>
      </div>
    </div>
  );
};

export default ROTToggle;