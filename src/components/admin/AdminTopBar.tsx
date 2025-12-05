import { Link } from 'react-router-dom';
import { Bell, Search, Plus, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from '@/hooks/useRole';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuoteQuestionsNotification from './QuoteQuestionsNotification';
import BookingsNotification from './BookingsNotification';

export function AdminTopBar() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any>({ notifications: [] });
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('viewedNotifications');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const { isOwner } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await supabase.functions.invoke('get-admin-notifications');
        if (data) {
          const filteredNotifications = data.notifications.filter(
            (notif: any) => !viewedNotifications.has(notif.id)
          );
          setNotifications({
            ...data,
            notifications: filteredNotifications
          });
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [viewedNotifications]);

  const markAsViewed = (notificationId: string) => {
    const newViewed = new Set(viewedNotifications);
    newViewed.add(notificationId);
    setViewedNotifications(newViewed);
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewed)));
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const quickActions = [
    { title: 'Skapa offert', path: '/admin/quotes?new=true' },
    { title: 'Ny bokning', path: '/admin/bookings' },
    { title: 'Lägg till kund', path: '/admin/customers' },
    { title: 'Skapa jobb', path: '/admin/jobs' },
  ];

  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        
        <div className="flex-1">
          <Breadcrumbs />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Sök...</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Åtgärder</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {quickActions.map((action) => (
              <DropdownMenuItem key={action.path} asChild>
                <Link to={action.path}>{action.title}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <BookingsNotification />
        <QuoteQuestionsNotification />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Bell className="h-4 w-4" />
              {notifications.notifications.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                >
                  {notifications.notifications.length > 9 ? '9+' : notifications.notifications.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Notifikationer</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Inga notifikationer
                </div>
              ) : (
                notifications.notifications.map((notif: any, idx: number) => (
                  <Link 
                    key={idx} 
                    to={notif.link}
                    onClick={() => markAsViewed(notif.id)}
                    className="block p-4 hover:bg-muted border-b last:border-b-0"
                  >
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notif.number} • {new Date(notif.timestamp).toLocaleDateString('sv-SE')}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">AD</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">Admin</span>
              {isOwner && (
                <Badge variant="default" className="hidden md:inline text-[10px] px-1.5 py-0">
                  Ägare
                </Badge>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Min profil</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/mitt-fixco">
                <User className="mr-2 h-4 w-4" />
                Mitt konto
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Inställningar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logga ut
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Sök efter sidor, kunder, jobb..." />
        <CommandList>
          <CommandEmpty>Inga resultat hittades.</CommandEmpty>
          <CommandGroup heading="Sidor">
            <CommandItem onSelect={() => { navigate('/admin'); setOpen(false); }}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/admin/jobs'); setOpen(false); }}>
              Jobb
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/admin/customers'); setOpen(false); }}>
              Kunder
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/admin/reports'); setOpen(false); }}>
              Rapporter
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

// Import missing component
import { LayoutDashboard } from 'lucide-react';
