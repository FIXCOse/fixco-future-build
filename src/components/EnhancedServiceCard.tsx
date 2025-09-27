import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCopy } from '@/copy/CopyProvider';
import { 
  Eye, 
  Sparkles, 
  Leaf, 
  Zap, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import { EcoScoreDisplay } from '@/components/EcoScoreDisplay';
import { Project3DVisualizer } from '@/components/Project3DVisualizer';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  rotPrice?: number;
  rutPrice?: number;
  category: string;
  ecoScore: number;
  projectType: 'bathroom' | 'kitchen' | 'livingroom' | 'exterior';
}

interface EnhancedServiceCardProps {
  service: Service;
  onBooking?: (serviceId: string) => void;
  onQuote?: (serviceId: string) => void;
}

export const EnhancedServiceCard: React.FC<EnhancedServiceCardProps> = ({
  service,
  onBooking,
  onQuote
}) => {
  const { t } = useCopy();
  const [activeTab, setActiveTab] = useState<'3d' | 'beforeafter'>('3d');

  const calculateROTSavings = () => {
    const laborCost = service.basePrice * 0.7; // 70% labor typically
    return Math.round(laborCost * 0.5); // 50% ROT deduction
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Enhanced visual preview */}
        <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Quick preview buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="bg-white/90">
                  <Eye className="h-4 w-4 mr-1" />
                  {t('services.show_3d')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Project3DVisualizer projectType={service.projectType} />
                  <BeforeAfterSlider projectType={service.projectType} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Eco score badge */}
          <div className="absolute top-3 left-3">
            <EcoScoreDisplay score={service.ecoScore} />
          </div>
          
          {/* Service category */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90">
              {service.category}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {service.description}
              </p>
            </div>
          </div>

          {/* Enhanced pricing display */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('services.ordinary_price')}</span>
              <span className="font-medium">{service.basePrice.toLocaleString()} kr</span>
            </div>
            
            {service.rotPrice && (
              <div className="flex items-center justify-between text-primary">
                <span className="text-sm font-medium">{t('services.with_rot')}</span>
                <div className="text-right">
                  <div className="font-bold">{service.rotPrice.toLocaleString()} kr</div>
                  <div className="text-xs">
                    {t('services.savings')} {calculateROTSavings().toLocaleString()} kr
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>{t('services.energy_efficient')}</span>
              <Leaf className="h-3 w-3" />
              <span>{t('services.eco_materials')}</span>
            </div>
          </div>

          {/* Enhanced features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t('services.ai_optimized')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calculator className="h-4 w-4 text-green-500" />
              <span>{t('services.rot_eligible')}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onQuote?.(service.id)}
            >
              {t('cta.request_quote')}
            </Button>
            <Button 
              variant="cta-primary" 
              className="flex-1"
              onClick={() => onBooking?.(service.id)}
            >
              {t('cta.book_direct')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Quick stats */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-primary">
                  {service.ecoScore}
                </div>
                <div className="text-xs text-muted-foreground">{t('services.eco_score')}</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {calculateROTSavings().toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">kr {t('services.savings').toLowerCase()}</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  3D
                </div>
                <div className="text-xs text-muted-foreground">{t('services.preview')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};