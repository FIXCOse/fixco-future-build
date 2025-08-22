import { motion } from "framer-motion";
import { Clock, DollarSign, Star, MapPin, TrendingUp, Users } from "lucide-react";

interface Metric {
  id: string;
  icon: any;
  label: string;
  fixcoValue: number;
  competitorValue: number;
  unit: string;
  format: 'number' | 'currency' | 'percentage' | 'time';
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

interface ComparisonMetricsProps {
  case: 'el' | 'vvs' | 'snickeri';
  showROT: boolean;
  counters: Record<string, number>;
  animationStep: number;
}

const ComparisonMetrics = ({ case: selectedCase, showROT, counters, animationStep }: ComparisonMetricsProps) => {
  
  const caseData = {
    el: {
      pricing: { base: 1059, rot: 530, competitor: 1200 },
      satisfaction: { fixco: 98, competitor: 82 },
      startTime: { fixco: 24, competitor: 7 },
      title: "Elinstallationer"
    },
    vvs: {
      pricing: { base: 959, rot: 480, competitor: 1100 },
      satisfaction: { fixco: 97, competitor: 79 },
      startTime: { fixco: 24, competitor: 8 },
      title: "VVS-tjänster"
    },
    snickeri: {
      pricing: { base: 859, rot: 430, competitor: 950 },
      satisfaction: { fixco: 99, competitor: 81 },
      startTime: { fixco: 24, competitor: 6 },
      title: "Snickeriarbeten"
    }
  };

  const currentCase = caseData[selectedCase];
  
  const metrics: Metric[] = [
    {
      id: 'startTime',
      icon: Clock,
      label: 'Projektstart',
      fixcoValue: currentCase.startTime.fixco,
      competitorValue: currentCase.startTime.competitor,
      unit: showROT ? 'h' : 'dagar',
      format: 'time',
      trend: 'up',
      description: 'Tid från första kontakt till projektstart'
    },
    {
      id: 'pricing',
      icon: DollarSign,
      label: showROT ? 'Timpris (efter ROT)' : 'Timpris ordinarie',
      fixcoValue: showROT ? currentCase.pricing.rot : currentCase.pricing.base,
      competitorValue: currentCase.pricing.competitor,
      unit: 'kr/h',
      format: 'currency',
      trend: 'down',
      description: showROT ? 'Pris efter 50% ROT-avdrag' : 'Ordinarie timpris exkl. ROT'
    },
    {
      id: 'satisfaction',
      icon: Star,
      label: 'Kundnöjdhet',
      fixcoValue: currentCase.satisfaction.fixco,
      competitorValue: currentCase.satisfaction.competitor,
      unit: '%',
      format: 'percentage',
      trend: 'up',
      description: 'Baserat på kundrecensioner senaste 12 månaderna'
    }
  ];

  const formatValue = (value: number, metric: Metric) => {
    switch (metric.format) {
      case 'currency':
        return value.toLocaleString('sv-SE');
      case 'percentage':
        return value;
      case 'time':
        return metric.id === 'startTime' && metric.unit === 'h' ? value : value;
      default:
        return value;
    }
  };

  return (
    <div className="space-y-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        const isVisible = animationStep >= 3 + index;
        
        const fixcoAnimatedValue = counters[`${selectedCase}_${metric.id}_fixco`] || 0;
        const competitorAnimatedValue = counters[`${selectedCase}_${metric.id}_competitor`] || 0;
        
        return (
          <motion.div
            key={`${selectedCase}-${metric.id}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              x: isVisible ? 0 : -50 
            }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
            className="grid grid-cols-3 gap-4 group"
          >
            {/* Metric Label */}
            <motion.div 
              className="flex items-center p-6 card-service"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 gradient-primary-subtle rounded-xl flex items-center justify-center mr-4 group-hover:shadow-glow transition-all duration-300">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{metric.label}</h3>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </motion.div>

            {/* Fixco Value */}
            <motion.div 
              className="card-premium p-6 text-center relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(139, 69, 19, 0.15)" 
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <motion.div 
                  className="text-3xl font-bold text-green-400 mb-2"
                  animate={{ 
                    scale: fixcoAnimatedValue === metric.fixcoValue ? [1, 1.1, 1] : 1 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {formatValue(fixcoAnimatedValue, metric)}{metric.unit}
                </motion.div>
                <div className="text-sm font-medium text-green-300">Fixco</div>
                
                {/* ROT Badge */}
                {showROT && metric.id === 'pricing' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                  >
                    ROT
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Competitor Value */}
            <motion.div 
              className="card-premium p-6 text-center relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl font-bold text-red-400 mb-2">
                {formatValue(competitorAnimatedValue, metric)}{metric.unit}
              </div>
              <div className="text-sm font-medium text-red-300">Konkurrenter</div>
              
              {/* Disadvantage indicator */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-red-500/50 rounded-full animate-pulse" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ComparisonMetrics;