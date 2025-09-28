import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gift, 
  Star, 
  Trophy, 
  Coins,
  Calendar,
  Users,
  Zap,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'service' | 'product';
  value: string;
  available: boolean;
}

interface LoyaltyLevel {
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

export const RewardSystem = () => {
  const [currentPoints, setCurrentPoints] = useState(1250);
  const [totalSpent, setTotalSpent] = useState(78450);
  const [projectsCompleted, setProjectsCompleted] = useState(4);
  
  const loyaltyLevels: LoyaltyLevel[] = [
    {
      name: 'Brons',
      minPoints: 0,
      benefits: ['5% rabatt på återkommande service', 'Prioriterad kundtjänst'],
      color: 'from-amber-600 to-amber-800'
    },
    {
      name: 'Silver', 
      minPoints: 1000,
      benefits: ['10% rabatt', 'Gratis hembesök', 'Extended garanti'],
      color: 'from-gray-400 to-gray-600'
    },
    {
      name: 'Guld',
      minPoints: 2500,
      benefits: ['15% rabatt', 'Gratis underhåll 1 år', 'VIP-support'],
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      name: 'Platina',
      minPoints: 5000,
      benefits: ['20% rabatt', 'Livstids garanti', 'Personlig projektledare'],
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const rewards: Reward[] = [
    {
      id: '1',
      title: '500 kr rabatt',
      description: 'Rabatt på nästa projekt över 5000 kr',
      pointsCost: 500,
      type: 'discount',
      value: '500 kr',
      available: true
    },
    {
      id: '2',
      title: 'Gratis hembesök',
      description: 'Kostnadsfri konsultation och mätning',
      pointsCost: 300,
      type: 'service', 
      value: 'Värde 800 kr',
      available: true
    },
    {
      id: '3',
      title: '1000 kr rabatt',
      description: 'Rabatt på projekt över 10 000 kr',
      pointsCost: 1000,
      type: 'discount',
      value: '1000 kr',
      available: true
    },
    {
      id: '4',
      title: 'Smart hem starter kit',
      description: 'Grundpaket för hemautomation',
      pointsCost: 2000,
      type: 'product',
      value: 'Värde 3000 kr',
      available: false
    },
    {
      id: '5',
      title: 'Premium service paket',
      description: '1 års underhållsservice',
      pointsCost: 3000,
      type: 'service',
      value: 'Värde 5000 kr',
      available: false
    }
  ];

  const getCurrentLevel = () => {
    return loyaltyLevels
      .slice()
      .reverse()
      .find(level => currentPoints >= level.minPoints) || loyaltyLevels[0];
  };

  const getNextLevel = () => {
    return loyaltyLevels.find(level => currentPoints < level.minPoints);
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel 
    ? ((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const redeemReward = (reward: Reward) => {
    if (currentPoints >= reward.pointsCost && reward.available) {
      setCurrentPoints(prev => prev - reward.pointsCost);
      toast.success(`${reward.title} inlöst! Du har fått en rabattkod.`);
    } else if (!reward.available) {
      toast.error('Denna belöning är inte tillgänglig för ditt medlemsnivå');
    } else {
      toast.error('Du har inte tillräckligt med poäng');
    }
  };

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Ditt medlemskap
            </h2>
            <p className="text-muted-foreground">
              Tjäna poäng och få exklusiva belöningar
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {currentPoints.toLocaleString()} poäng
            </div>
            <div className="text-sm text-muted-foreground">
              Totalt spenderat: {totalSpent.toLocaleString()} kr
            </div>
          </div>
        </div>

        {/* Current Level */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Badge 
              variant="outline" 
              className={`bg-gradient-to-r ${currentLevel.color} text-primary-foreground border-0`}
            >
              {currentLevel.name} medlem
            </Badge>
            {nextLevel && (
              <span className="text-sm text-muted-foreground">
                {nextLevel.minPoints - currentPoints} poäng till {nextLevel.name}
              </span>
            )}
          </div>
          
          {nextLevel && (
            <Progress value={progressToNext} className="h-2 mb-2" />
          )}
          
          <div className="text-sm text-muted-foreground">
            <strong>Dina förmåner:</strong> {currentLevel.benefits.join(', ')}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{projectsCompleted}</div>
            <div className="text-sm text-muted-foreground">Projekt genomförda</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{Math.floor(totalSpent / 1000)}k</div>
            <div className="text-sm text-muted-foreground">Totalt spenderat</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.floor((Date.now() - new Date('2023-03-15').getTime()) / (1000 * 60 * 60 * 24 * 30))}
            </div>
            <div className="text-sm text-muted-foreground">Månader som medlem</div>
          </div>
        </div>
      </Card>

      {/* Available Rewards */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Tillgängliga belöningar
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div 
              key={reward.id} 
              className={`border rounded-lg p-4 transition-colors ${
                reward.available && currentPoints >= reward.pointsCost
                  ? 'border-primary/50 bg-primary/5'
                  : !reward.available
                  ? 'border-muted bg-muted/50 opacity-60'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{reward.title}</h4>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
                <Badge variant="outline">
                  <Coins className="h-3 w-3 mr-1" />
                  {reward.pointsCost}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary font-medium">
                  {reward.value}
                </span>
                <Button
                  size="sm"
                  variant={currentPoints >= reward.pointsCost && reward.available ? "default" : "secondary"}
                  disabled={currentPoints < reward.pointsCost || !reward.available}
                  onClick={() => redeemReward(reward)}
                >
                  {!reward.available 
                    ? `${loyaltyLevels.find(l => l.minPoints <= currentPoints * 2)?.name || 'Silver'}+ krävs`
                    : currentPoints >= reward.pointsCost 
                    ? 'Lös in' 
                    : 'Inte tillräckligt'
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* How to Earn Points */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Så tjänar du poäng
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Coins className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">1 poäng per 100 kr</div>
                <div className="text-sm text-muted-foreground">På alla projekt</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <Trophy className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <div className="font-medium">Bonus: +50 poäng</div>
                <div className="text-sm text-muted-foreground">Vid projektavslut</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="font-medium">+100 poäng</div>
                <div className="text-sm text-muted-foreground">Per framgångsrik rekommendation</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium">+25 poäng</div>
                <div className="text-sm text-muted-foreground">Per månad som aktiv medlem</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};