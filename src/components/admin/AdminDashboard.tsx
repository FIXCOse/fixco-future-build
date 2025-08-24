import { Link } from 'react-router-dom';
import { 
  Users, FileText, Receipt, BarChart3, 
  Plus, Calendar, Settings, Database, Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/hooks/useRole';
import { LiveActivityFeed } from './LiveActivityFeed';

const AdminDashboard = () => {
  const { isOwner } = useRole();

  const quickActions = [
    {
      title: 'Skapa offert',
      description: 'Skapa ny offert från bokning',
      href: '/admin/quotes/new',
      icon: Plus,
      variant: 'cta-primary' as const
    },
    {
      title: 'Fakturor',
      description: 'Hantera fakturor',
      href: '/admin/invoices',
      icon: Receipt,
      variant: 'outline' as const
    },
    {
      title: 'Bokningar',
      description: 'Se alla bokningar',
      href: '/admin/bookings',
      icon: Calendar,
      variant: 'outline' as const
    },
    {
      title: 'Kunder',
      description: 'Kundregister',
      href: '/admin/customers',
      icon: Users,
      variant: 'outline' as const
    },
    {
      title: 'Offertförfrågningar',
      description: 'Se alla offertförfrågningar', 
      href: '/admin/quote-requests',
      icon: FileText,
      variant: 'outline' as const
    }
  ];

  const adminSections = [
    {
      title: 'Offerter',
      description: 'Se alla skapade offerter',
      href: '/admin/quotes',
      icon: FileText,
      color: 'bg-yellow-500/10 text-yellow-600'
    },
    {
      title: 'Användare',
      description: 'Hantera användarkonton och roller',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      title: 'Inställningar',
      description: 'Systemkonfiguration',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-green-500/10 text-green-600'
    },
    {
      title: 'Rapporter',
      description: 'Analys och rapporter',
      href: '/admin/reports',
      icon: BarChart3,
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      title: 'Säkerhet',
      description: 'Säkerhetsövervakning',
      href: '/admin/security',
      icon: Shield,
      color: 'bg-red-500/10 text-red-600'
    },
    {
      title: 'Databas',
      description: 'Databashantering',
      href: '/admin/database',
      icon: Database,
      color: 'bg-indigo-500/10 text-indigo-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground">
            Hantera ditt företag och alla bokningar
          </p>
        </div>
        <Badge variant={isOwner ? 'default' : 'secondary'}>
          {isOwner ? 'Ägare' : 'Administrator'}
        </Badge>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snabbåtgärder</CardTitle>
          <CardDescription>
            Vanliga administrativa uppgifter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Sections */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Administrativa sektioner</CardTitle>
              <CardDescription>
                Avancerad systemhantering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminSections.map((section) => (
                  <Link key={section.href} to={section.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${section.color}`}>
                            <section.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{section.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-1">
          <LiveActivityFeed />
        </div>
      </div>

      {/* Analytics Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Detaljerad analys</h3>
              <p className="text-sm text-muted-foreground">
                Djupgående rapporter och KPI:er
              </p>
            </div>
            <Link to="/admin/analytics/detailed">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Visa analys
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;