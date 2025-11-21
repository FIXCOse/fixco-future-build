import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ClipboardList, 
  FileText, 
  Users, 
  DollarSign,
  Settings,
  Calendar,
  MessageSquare,
  Trash2,
  UserCog,
  Shield,
  Database,
  Languages,
  Wrench,
  BarChart3,
  Activity,
  PlusCircle,
  Building2,
  UserPlus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const location = useLocation();
  
  // Fetch unanswered quote questions count
  const { data: unansweredCount = 0 } = useQuery({
    queryKey: ['unanswered-quote-questions'],
    queryFn: async () => {
      const { count } = await supabase
        .from('quote_questions')
        .select('*', { count: 'exact', head: true })
        .eq('answered', false);
      return count || 0;
    },
    refetchInterval: 30000,
  });

  // Fetch pending job applications count
  const { data: pendingApplicationsCount = 0 } = useQuery({
    queryKey: ['pending-applications-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true,
    },
    {
      category: 'Förfrågningar & Offerter',
      items: [
        { title: 'Alla Förfrågningar & Offerter', icon: FileText, path: '/admin/quotes' },
        { 
          title: 'Offertfrågor', 
          icon: MessageSquare, 
          path: '/admin/quote-questions',
          badge: unansweredCount > 0 ? unansweredCount : null 
        },
      ],
    },
    {
      category: 'Jobbhantering',
      items: [
        { title: 'Jobbhantering', icon: Briefcase, path: '/admin/jobs' },
        { title: 'Schemaläggning', icon: Calendar, path: '/admin/schedule' },
      ],
    },
    {
      category: 'Kunder & Personal',
      items: [
        { title: 'Kunder', icon: Users, path: '/admin/customers' },
        { title: 'Personalhantering', icon: UserCog, path: '/admin/staff' },
        { title: 'Lönehantering', icon: DollarSign, path: '/admin/payroll' },
        { title: 'Worker Analytics', icon: Activity, path: '/admin/worker-analytics' },
      ],
    },
    {
      category: 'Ekonomi',
      items: [
        { title: 'Fakturor', icon: FileText, path: '/admin/invoices' },
        { title: 'Rapporter', icon: BarChart3, path: '/admin/reports' },
      ],
    },
    {
      category: 'System',
      items: [
        { title: 'Tjänster', icon: Wrench, path: '/admin/services' },
        { title: 'Användare', icon: Users, path: '/admin/users' },
        { title: 'Feature Flags', icon: Settings, path: '/admin/feature-flags' },
        { title: 'Inställningar', icon: Settings, path: '/admin/settings' },
        { title: 'Säkerhet', icon: Shield, path: '/admin/security' },
        { title: 'Databas', icon: Database, path: '/admin/database' },
        { title: 'Översättningar', icon: Languages, path: '/admin/translations' },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Fixco Admin</span>
            <span className="text-xs text-muted-foreground">Kontrollpanel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard & Quick Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/admin'}>
                  <Link to="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/applications')}>
                  <Link to="/admin/applications" className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Jobbansökningar</span>
                    </div>
                    {pendingApplicationsCount > 0 && (
                      <Badge variant="destructive" className="ml-auto h-5 min-w-5 flex items-center justify-center px-1 text-xs">
                        {pendingApplicationsCount > 9 ? '9+' : pendingApplicationsCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categorized Menu Items */}
        {menuItems.slice(1).map((section, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupLabel>{section.category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items?.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="destructive" className="ml-auto h-5 min-w-5 flex items-center justify-center px-1 text-xs">
                            {item.badge > 9 ? '9+' : item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          <p>© 2025 Fixco</p>
          <p>Version 2.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
