import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  Users, 
  Clock, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  Timer,
  Phone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WorkerLayout = () => {
  const { profile, loading } = useAuthProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Timer className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Laddar...</p>
        </div>
      </div>
    );
  }

  if (profile?.role !== 'worker') {
    navigate('/');
    return null;
  }

  const navItems = [
    { to: '/worker', icon: Home, label: 'Hem', color: 'text-blue-600' },
    { to: '/worker/pool', icon: Users, label: 'Jobb', color: 'text-green-600' },
    { to: '/worker/jobs', icon: FileText, label: 'Mina', color: 'text-orange-600' },
    { to: '/worker/timesheet', icon: Clock, label: 'Tid', color: 'text-purple-600' },
    { to: '/worker/settings', icon: Settings, label: 'Inst.', color: 'text-gray-600' }
  ];

  const MobileNavItem = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.to;
    
    return (
      <Link
        to={item.to}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex flex-col items-center p-3 rounded-lg transition-all ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-md transform scale-105' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
      >
        <Icon className={`w-6 h-6 mb-1 ${isActive ? '' : item.color}`} />
        <span className="text-xs font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Mobile Header */}
      <nav className="bg-card/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo and current page */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">F</span>
                </div>
                <span className="font-bold text-lg text-primary hidden sm:block">Fixco</span>
              </div>
              
              {/* Current page indicator */}
              <div className="hidden sm:block text-sm text-muted-foreground">
                {navItems.find(item => item.to === location.pathname)?.label || 'Arbetare'}
              </div>
            </div>

            {/* Mobile menu and profile */}
            <div className="flex items-center space-x-2">
              {/* Emergency contact button */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Phone className="w-4 h-4 mr-2" />
                SOS
              </Button>
              
              {/* Profile badge */}
              <Badge variant="outline" className="hidden sm:flex">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </Badge>
              
              {/* Mobile menu trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col space-y-6 pt-6">
                    {/* Profile section */}
                    <div className="text-center pb-4 border-b">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary-foreground font-bold text-xl">
                          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                        </span>
                      </div>
                      <h3 className="font-medium">{profile?.first_name} {profile?.last_name}</h3>
                      <Badge variant="secondary" className="mt-1">Arbetare</Badge>
                    </div>
                    
                    {/* Navigation */}
                    <div className="grid grid-cols-2 gap-3">
                      {navItems.map((item) => (
                        <MobileNavItem key={item.to} item={item} />
                      ))}
                    </div>
                    
                    {/* Quick actions */}
                    <div className="space-y-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Phone className="w-4 h-4 mr-2" />
                        Ring kontoret
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logga ut
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-6 h-12">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="flex-1" />
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logga ut
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 z-40">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground transform scale-110' 
                    : 'text-muted-foreground active:scale-95'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? '' : item.color}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default WorkerLayout;