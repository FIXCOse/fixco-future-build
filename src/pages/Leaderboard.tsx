import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  Leaf, 
  Zap, 
  Users,
  TrendingUp,
  Award,
  Target,
  Crown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LeaderboardEntry {
  id: string;
  name: string;
  energySaved: number; // kWh
  co2Reduced: number; // kg
  projects: number;
  badge: 'eco-master' | 'energy-saver' | 'green-pioneer' | 'climate-hero';
  rank: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  reward: string;
  timeLeft: string;
}

export const Leaderboard = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'alltime'>('monthly');

  const monthlyLeaders: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Anna L.',
      energySaved: 450,
      co2Reduced: 89,
      projects: 2,
      badge: 'eco-master',
      rank: 1
    },
    {
      id: '2', 
      name: 'Lars K.',
      energySaved: 380,
      co2Reduced: 76,
      projects: 3,
      badge: 'energy-saver',
      rank: 2
    },
    {
      id: '3',
      name: 'Maria S.',
      energySaved: 325,
      co2Reduced: 64,
      projects: 1,
      badge: 'green-pioneer',
      rank: 3
    },
    {
      id: '4',
      name: 'Erik B.',
      energySaved: 290,
      co2Reduced: 58,
      projects: 2,
      badge: 'climate-hero',
      rank: 4
    },
    {
      id: '5',
      name: 'Du',
      energySaved: 185,
      co2Reduced: 37,
      projects: 1,
      badge: 'energy-saver',
      rank: 8
    }
  ];

  const alltimeLeaders: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Stefan M.',
      energySaved: 2450,
      co2Reduced: 489,
      projects: 8,
      badge: 'eco-master',
      rank: 1
    },
    {
      id: '2',
      name: 'Christina A.',
      energySaved: 2180,
      co2Reduced: 436,
      projects: 6,
      badge: 'eco-master', 
      rank: 2
    },
    {
      id: '3',
      name: 'Johan P.',
      energySaved: 1925,
      co2Reduced: 385,
      projects: 7,
      badge: 'climate-hero',
      rank: 3
    }
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Energispar­champion',
      description: 'Spara 500 kWh under augusti',
      target: 500,
      current: 185,
      unit: 'kWh',
      reward: '500 kr rabatt på nästa projekt',
      timeLeft: '12 dagar kvar'
    },
    {
      id: '2',
      title: 'CO₂ krigare',
      description: 'Minska 100 kg CO₂ denna månad',
      target: 100,
      current: 37,
      unit: 'kg CO₂',
      reward: 'Gratis energirapport',
      timeLeft: '12 dagar kvar'
    },
    {
      id: '3',
      title: 'Renoverings­guru',
      description: 'Genomför 3 miljövänliga projekt',
      target: 3,
      current: 1,
      unit: 'projekt',
      reward: '1000 kr bonus',
      timeLeft: '2 månader kvar'
    }
  ];

  const getBadgeInfo = (badge: string) => {
    switch (badge) {
      case 'eco-master':
        return { icon: Crown, color: 'text-yellow-500', name: 'Eko Mästare' };
      case 'energy-saver':
        return { icon: Zap, color: 'text-blue-500', name: 'Energi­sparare' };
      case 'green-pioneer':
        return { icon: Leaf, color: 'text-green-500', name: 'Grön Pionjär' };
      case 'climate-hero':
        return { icon: Award, color: 'text-purple-500', name: 'Klimat­hjälte' };
      default:
        return { icon: Medal, color: 'text-gray-500', name: 'Medlem' };
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const currentLeaders = selectedPeriod === 'monthly' ? monthlyLeaders : alltimeLeaders;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Trophy className="h-10 w-10 text-primary" />
            {t('leaderboard.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('leaderboard.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Topplista</h2>
                <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
                  <TabsList>
                    <TabsTrigger value="monthly">{t('leaderboard.monthly')}</TabsTrigger>
                    <TabsTrigger value="alltime">{t('leaderboard.allTime')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-4">
                {currentLeaders.map((leader) => {
                  const badgeInfo = getBadgeInfo(leader.badge);
                  const isCurrentUser = leader.name === 'Du';

                  return (
                    <div 
                      key={leader.id} 
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                        isCurrentUser ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-shrink-0 w-12 flex justify-center">
                        {getRankIcon(leader.rank)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${isCurrentUser ? 'text-primary' : ''}`}>
                            {leader.name}
                          </h3>
                          <Badge variant="outline" className={badgeInfo.color}>
                            <badgeInfo.icon className="h-3 w-3 mr-1" />
                            {badgeInfo.name}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Energi sparad:</span>
                            <div className="font-medium">{leader.energySaved} kWh</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CO₂ minskat:</span>
                            <div className="font-medium">{leader.co2Reduced} kg</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Projekt:</span>
                            <div className="font-medium">{leader.projects} st</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedPeriod === 'monthly' && (
                <div className="mt-6 p-4 bg-accent/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('leaderboard.yourRank')}: #8</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Du behöver spara 105 kWh till för att nå plats 7. Fortsätt så!
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Challenges */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Aktuella utmaningar
              </h2>
              
              <div className="space-y-6">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="space-y-3">
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{challenge.current} / {challenge.target} {challenge.unit}</span>
                        <span>{Math.round((challenge.current / challenge.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(challenge.current / challenge.target) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <div>🏆 {challenge.reward}</div>
                      <div>⏰ {challenge.timeLeft}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card className="mt-6 p-6">
              <h2 className="text-xl font-semibold mb-4">Dina prestationer</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Total energi­besparing</span>
                  </div>
                  <span className="font-medium">1,247 kWh</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Total CO₂ minskning</span>
                  </div>
                  <span className="font-medium">249 kg</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Avklarade projekt</span>
                  </div>
                  <span className="font-medium">4 st</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Ranking denna månad</span>
                  </div>
                  <span className="font-medium">#8 av 1,247</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Klättra högre på topplistan!
            </h3>
            <p className="text-muted-foreground mb-6">
              Starta ett nytt miljövänligt projekt och tjäna energipoäng.
            </p>
            <Button size="lg" variant="cta-primary">
              Begär offert för eco-projekt
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};