import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Building, 
  TrendingUp, 
  Users, 
  FileText,
  Search,
  Calendar,
  Award,
  Home,
  BarChart3
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BuildingPermit {
  id: string;
  address: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  description: string;
}

interface NeighborProject {
  id: string;
  address: string;
  service: string;
  rating: number;
  date: string;
  savings: number;
}

interface AreaStatistic {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

export const Neighborhood = () => {
  const { t } = useTranslation();
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState('Södermalm, Stockholm');

  const [permits, setPermits] = useState<BuildingPermit[]>([
    {
      id: '1',
      address: 'Götgatan 45',
      type: 'Balkongrenover­ing',
      status: 'approved',
      date: '2024-08-15',
      description: 'ROT-berättigad balkongrenove­ring och tätning'
    },
    {
      id: '2', 
      address: 'Hornsgatan 23',
      type: 'Fasadrenover­ing',
      status: 'pending',
      date: '2024-08-20',
      description: 'Komplett fasadrenove­ring inkl. fönsterbyte'
    },
    {
      id: '3',
      address: 'Folkungagatan 67',
      type: 'Takrenover­ing',
      status: 'approved', 
      date: '2024-08-10',
      description: 'Takpannebyte och takstols­förstärkning'
    }
  ]);

  const [neighborProjects, setNeighborProjects] = useState<NeighborProject[]>([
    {
      id: '1',
      address: 'Götgatan 12',
      service: 'Badrums­renovering',
      rating: 5,
      date: '2024-07-15',
      savings: 45000
    },
    {
      id: '2',
      address: 'Bondegatan 34',
      service: 'Kök renovering',
      rating: 5,
      date: '2024-07-22', 
      savings: 78000
    },
    {
      id: '3',
      address: 'Skånegatan 56',
      service: 'Balkong­renovering',
      rating: 4,
      date: '2024-08-01',
      savings: 28000
    }
  ]);

  const statistics: AreaStatistic[] = [
    {
      label: 'Genomsnittspris/kvm',
      value: '89 500 kr',
      change: 3.2,
      icon: Home
    },
    {
      label: 'ROT-projekt senaste året',
      value: '248 st',
      change: 18.5,
      icon: Building
    },
    {
      label: 'Energieffektiviser­ing',
      value: '15%',
      change: 8.3,
      icon: TrendingUp
    },
    {
      label: 'Nöjdhet med Fixco',
      value: '4.8/5',
      change: 2.1,
      icon: Award
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Godkänt';
      case 'pending': return 'Väntar';
      case 'rejected': return 'Nekat';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <MapPin className="h-10 w-10 text-primary" />
            {t('neighborhood.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('neighborhood.subtitle')}
          </p>
        </div>

        {/* Area Search */}
        <Card className="mb-6 p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Ange adress eller område..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button size="lg">
              <Search className="h-4 w-4 mr-2" />
              Sök
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 inline mr-1" />
              Visar data för: <span className="font-medium">{selectedArea}</span>
            </p>
          </div>
        </Card>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statistics.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <Badge 
                  variant={stat.change > 0 ? "default" : "secondary"}
                  className={stat.change > 0 ? "bg-green-500" : ""}
                >
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="permits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="permits" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('neighborhood.permits')}
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('neighborhood.neighbors')}
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('neighborhood.statistics')}
            </TabsTrigger>
          </TabsList>

          {/* Building Permits */}
          <TabsContent value="permits">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Aktiva bygglov i området
              </h2>
              
              <div className="space-y-4">
                {permits.map((permit) => (
                  <div key={permit.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{permit.address}</h3>
                        <p className="text-sm text-muted-foreground">{permit.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={`${getStatusColor(permit.status)} text-white border-0`}
                        >
                          {getStatusText(permit.status)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {permit.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">{permit.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Neighbor Projects */}
          <TabsContent value="projects">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Grannar som använt Fixco
              </h2>
              
              <div className="space-y-4">
                {neighborProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{project.address}</h3>
                        <p className="text-sm text-muted-foreground">{project.service}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < project.rating ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">{project.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        ROT-besparing: 
                      </span>
                      <span className="font-medium text-green-600">
                        {project.savings.toLocaleString()} kr
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">
                  Visa fler projekt
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Detailed Statistics */}
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {t('neighborhood.priceHistory')}
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>2024</span>
                    <span className="font-medium">89 500 kr/kvm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2023</span>
                    <span className="font-medium">86 700 kr/kvm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2022</span>
                    <span className="font-medium">84 200 kr/kvm</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Populära tjänster
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Badrums­renovering</span>
                    <Badge variant="secondary">45 projekt</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Kök renovering</span>
                    <Badge variant="secondary">32 projekt</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fasad­renovering</span>
                    <Badge variant="secondary">28 projekt</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Balkong­renovation</span>
                    <Badge variant="secondary">23 projekt</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Vill du också förbättra ditt hem?
            </h3>
            <p className="text-muted-foreground mb-6">
              Gör som dina grannar och få professionell hjälp med ROT-avdrag.
            </p>
            <Button size="lg" variant="cta-primary">
              Begär offert för ditt projekt
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};