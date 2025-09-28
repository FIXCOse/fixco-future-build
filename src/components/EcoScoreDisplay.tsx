import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Leaf, TreePine, Droplets } from 'lucide-react';

interface EcoScoreDisplayProps {
  score: number; // 0-100
  className?: string;
  showDetails?: boolean;
}

export const EcoScoreDisplay: React.FC<EcoScoreDisplayProps> = ({
  score,
  className = "",
  showDetails = false
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Utmärkt';
    if (score >= 60) return 'Bra';
    if (score >= 40) return 'Okej';
    return 'Dålig';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TreePine className="h-4 w-4" />;
    if (score >= 60) return <Leaf className="h-4 w-4" />;
    return <Droplets className="h-4 w-4" />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={`${getScoreColor(score)} text-primary-foreground border-0`}
        >
          {getScoreIcon(score)}
          <span className="ml-1 font-semibold">{score}/100</span>
        </Badge>
        <span className="text-sm font-medium">{getScoreLabel(score)}</span>
      </div>
      
      {showDetails && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Miljöpåverkan baserat på material och metoder</span>
          </div>
          
          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-green-600 font-medium">
                <Leaf className="h-3 w-3 mx-auto mb-1" />
                Material
              </div>
              <div className="text-muted-foreground">+{Math.floor(score * 0.4)}</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 font-medium">
                <Droplets className="h-3 w-3 mx-auto mb-1" />
                Energi
              </div>
              <div className="text-muted-foreground">+{Math.floor(score * 0.3)}</div>
            </div>
            <div className="text-center">
              <div className="text-amber-600 font-medium">
                <TreePine className="h-3 w-3 mx-auto mb-1" />
                Metod
              </div>
              <div className="text-muted-foreground">+{Math.floor(score * 0.3)}</div>
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getScoreColor(score)}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};