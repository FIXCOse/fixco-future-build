import { Badge } from "@/components/ui/badge";
import { Shield, Award, Clock, CheckCircle2, Star, MapPin } from "lucide-react";

interface TrustCuesProps {
  variant?: 'inline' | 'grid' | 'minimal';
  className?: string;
}

const TrustCues = ({ variant = 'inline', className = "" }: TrustCuesProps) => {
  const cues = [
    {
      icon: Shield,
      label: "F-skatt",
      description: "Godkänd för ROT & RUT",
      color: "text-green-500"
    },
    {
      icon: Award,
      label: "Försäkrade",
      description: "Ansvarsförsäkring 10M kr",
      color: "text-blue-500"
    },
    {
      icon: Clock,
      label: "Start inom 5 dagar",
      description: "Oftast inom 24h",
      color: "text-primary"
    },
    {
      icon: CheckCircle2,
      label: "Fast pris",
      description: "Där det är möjligt",
      color: "text-primary"
    },
    {
      icon: Star,
      label: "4.9/5 betyg",
      description: "Över 500 recensioner",
      color: "text-yellow-500"
    },
    {
      icon: MapPin,
      label: "Uppsala & Stockholm",
      description: "Lokalt & nationellt",
      color: "text-primary"
    }
  ];

  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
        {cues.slice(0, 4).map((cue, index) => {
          const IconComponent = cue.icon;
          return (
            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
              <IconComponent className={`h-3 w-3 ${cue.color}`} />
              <span>{cue.label}</span>
            </Badge>
          );
        })}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        {cues.map((cue, index) => {
          const IconComponent = cue.icon;
          return (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
              <IconComponent className={`h-5 w-5 ${cue.color}`} />
              <div>
                <div className="font-medium text-sm">{cue.label}</div>
                <div className="text-xs text-muted-foreground">{cue.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // inline variant (default)
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      {cues.map((cue, index) => {
        const IconComponent = cue.icon;
        return (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <IconComponent className={`h-4 w-4 ${cue.color}`} />
            <span className="font-medium">{cue.label}</span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-muted-foreground text-xs hidden sm:inline">{cue.description}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustCues;