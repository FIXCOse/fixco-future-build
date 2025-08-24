import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Calendar, FileText, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'private' | 'company' | 'brf';
  loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyalty_points: number;
  total_spent: number;
  company_name?: string;
  brf_name?: string;
}

interface DashboardHeaderProps {
  profile: UserProfile;
  stats?: {
    upcomingBookings: number;
    pendingQuotes: number;
    unpaidInvoices: number;
    rotRutSavings: number;
  };
}

const DashboardHeader = ({ profile, stats }: DashboardHeaderProps) => {
  const location = useLocation();
  const { isAdmin } = useAdmin();
  
  const navigation = [
    { name: 'Översikt', href: '/mitt-fixco', icon: TrendingUp },
    { name: 'Fastigheter', href: '/mitt-fixco/properties', icon: Calendar },
    { name: 'Fakturor', href: '/mitt-fixco/invoices', icon: FileText },
    { name: 'ROT/RUT', href: '/mitt-fixco/rot-rut', icon: Award },
    { name: 'Aktivitet', href: '/mitt-fixco/activity', icon: Calendar },
    { name: 'Historik', href: '/mitt-fixco/history', icon: FileText },
    ...(isAdmin ? [{ name: 'Administration', href: '/mitt-fixco/admin', icon: Shield }] : [])
  ];

  const getLoyaltyProgress = (tier: string, points: number) => {
    const tiers = {
      'bronze': { min: 0, max: 1000, next: 'silver' },
      'silver': { min: 1000, max: 5000, next: 'gold' },
      'gold': { min: 5000, max: 10000, next: 'platinum' },
      'platinum': { min: 10000, max: 10000, next: 'platinum' }
    };
    
    const tierInfo = tiers[tier as keyof typeof tiers];
    const progress = tierInfo.max > tierInfo.min 
      ? ((points - tierInfo.min) / (tierInfo.max - tierInfo.min)) * 100
      : 100;
    
    return Math.min(100, Math.max(0, progress));
  };

  const displayName = profile.user_type === 'company' ? profile.company_name :
                     profile.user_type === 'brf' ? profile.brf_name :
                     `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Mitt Fixco</h1>
        <p className="text-lg text-muted-foreground">
          Välkommen tillbaka, {displayName}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Kommande bokningar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Väntande offerter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Obetalda fakturor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unpaidInvoices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ROT/RUT sparat i år</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rotRutSavings.toLocaleString('sv-SE')} kr</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loyalty Program */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lojalitetsprogram</span>
            <Badge variant="secondary" className="capitalize">
              {profile.loyalty_tier}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>{profile.loyalty_points} poäng</span>
            <span className="text-muted-foreground">
              {profile.loyalty_tier === 'platinum' ? 'Max nivå' : `Nästa: ${profile.loyalty_tier === 'bronze' ? 'silver' : profile.loyalty_tier === 'silver' ? 'gold' : 'platinum'}`}
            </span>
          </div>
          <Progress value={getLoyaltyProgress(profile.loyalty_tier, profile.loyalty_points)} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;