import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database, 
  UserCog,
  Activity,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboardContent = () => {
  // Hämta antal obesvarade offertfrågor
  const { data: unansweredCount = 0 } = useQuery({
    queryKey: ['unanswered-questions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('quote_questions')
        .select('*', { count: 'exact', head: true })
        .eq('answered', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const adminSections = [
    {
      title: 'Användarhantering',
      description: 'Hantera användare, roller och behörigheter',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Offertfrågor',
      description: 'Hantera kundfrågor om offerter',
      icon: MessageCircle,
      href: '/admin/quote-questions',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      badge: unansweredCount > 0 ? unansweredCount : undefined
    },
    {
      title: 'Inställningar',
      description: 'Systemkonfiguration och företagsinställningar',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Rapporter',
      description: 'Analytics, KPIer och affärsinsikter',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Säkerhet',
      description: 'Säkerhetsinställningar och audit logs',
      icon: Shield,
      href: '/admin/security',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Personal',
      description: 'Hantera personal och arbetsflöden',
      icon: UserCog,
      href: '/admin/staff',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Databas',
      description: 'Datahantering och export',
      icon: Database,
      href: '/admin/database',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const quickStats = [
    { label: 'Totala användare', value: '24', icon: Users },
    { label: 'Aktiva sessioner', value: '8', icon: Activity },
    { label: 'Systemstatus', value: 'Online', icon: Shield, isStatus: true }
  ];

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.isStatus && (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                    Aktiv
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin sections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminSections.map((section) => (
          <Card key={section.title} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${section.bgColor}`}>
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    {section.badge && (
                      <Badge variant="destructive" className="ml-2">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to={section.href} className="flex items-center justify-between">
                  Öppna
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste aktivitet</CardTitle>
          <CardDescription>
            Översikt över de senaste administratörshändelserna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Ny användare registrerad</span>
              <Badge variant="outline">2 min sedan</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Systeminställning uppdaterad</span>
              <Badge variant="outline">15 min sedan</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Säkerhetslogg granskad</span>
              <Badge variant="outline">1 tim sedan</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardContent;