import { Link } from 'react-router-dom';
import { Bell, Search, Plus, User, LogOut, Settings, ChevronDown, LayoutDashboard, Briefcase, FileText, Users } from 'lucide-react';
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
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from '@/hooks/useRole';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuoteQuestionsNotification from './QuoteQuestionsNotification';
import BookingsNotification from './BookingsNotification';

interface SearchResults {
  customers: Array<{ id: string; name: string; email: string; phone: string | null }>;
  jobs: Array<{ id: string; title: string | null; status: string }>;
  quotes: Array<{ id: string; number: string; title: string | null; status: string | null }>;
  bookings: Array<{ id: string; service_slug: string | null; payload: any }>;
}

const staticPages = [
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { title: 'Jobb', path: '/admin/jobs', icon: Briefcase },
  { title: 'Kunder', path: '/admin/customers', icon: Users },
  { title: 'Offerter', path: '/admin/quotes', icon: FileText },
  { title: 'Rapporter', path: '/admin/reports', icon: FileText },
  { title: 'Inställningar', path: '/admin/settings', icon: Settings },
];

export function AdminTopBar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    customers: [],
    jobs: [],
    quotes: [],
    bookings: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState<any>({ notifications: [] });
  const [viewedNotifications, setViewedNotifications] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('viewedNotifications');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const { isOwner } = useRole();
  const navigate = useNavigate();

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults({ customers: [], jobs: [], quotes: [], bookings: [] });
      return;
    }

    setIsSearching(true);
    const searchTerm = `%${query}%`;

    try {
      const [customersRes, jobsRes, quotesRes, bookingsRes] = await Promise.all([
        supabase
          .from('customers')
          .select('id, name, email, phone')
          .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`)
          .limit(5),
        supabase
          .from('jobs')
          .select('id, title, status')
          .is('deleted_at', null)
          .ilike('title', searchTerm)
          .limit(5),
        supabase
          .from('quotes_new')
          .select('id, number, title, status')
          .is('deleted_at', null)
          .or(`number.ilike.${searchTerm},title.ilike.${searchTerm}`)
          .limit(5),
        supabase
          .from('bookings')
          .select('id, service_slug, payload')
          .is('deleted_at', null)
          .ilike('service_slug', searchTerm)
          .limit(5)
      ]);

      setSearchResults({
        customers: customersRes.data || [],
        jobs: jobsRes.data || [],
        quotes: quotesRes.data || [],
        bookings: bookingsRes.data || []
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setSearchResults({ customers: [], jobs: [], quotes: [], bookings: [] });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Reset search when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery('');
      setSearchResults({ customers: [], jobs: [], quotes: [], bookings: [] });
    }
  };

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

  // Filter static pages based on search query
  const filteredPages = searchQuery.length >= 2
    ? staticPages.filter(page => page.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : staticPages;

  const hasResults = searchResults.customers.length > 0 || 
                     searchResults.jobs.length > 0 || 
                     searchResults.quotes.length > 0 ||
                     searchResults.bookings.length > 0;

  const getBookingName = (booking: any) => {
    const payload = booking.payload || {};
    return payload.name || payload.contact_name || payload.customerName || booking.service_slug || 'Bokning';
  };

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

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput 
          placeholder="Sök efter sidor, kunder, jobb, offerter..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? 'Söker...' : 'Inga resultat hittades.'}
          </CommandEmpty>
          
          {/* Static pages */}
          {filteredPages.length > 0 && (
            <CommandGroup heading="Sidor">
              {filteredPages.map((page) => (
                <CommandItem 
                  key={page.path} 
                  onSelect={() => { navigate(page.path); handleOpenChange(false); }}
                >
                  <page.icon className="mr-2 h-4 w-4" />
                  {page.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Customers */}
          {searchResults.customers.length > 0 && (
            <CommandGroup heading="Kunder">
              {searchResults.customers.map((customer) => (
                <CommandItem 
                  key={customer.id} 
                  onSelect={() => { navigate(`/admin/customers?id=${customer.id}`); handleOpenChange(false); }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{customer.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{customer.email}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Jobs */}
          {searchResults.jobs.length > 0 && (
            <CommandGroup heading="Jobb">
              {searchResults.jobs.map((job) => (
                <CommandItem 
                  key={job.id} 
                  onSelect={() => { navigate(`/admin/jobs/${job.id}`); handleOpenChange(false); }}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>{job.title || 'Utan titel'}</span>
                  <Badge variant="outline" className="ml-auto text-xs">{job.status}</Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Quotes */}
          {searchResults.quotes.length > 0 && (
            <CommandGroup heading="Offerter">
              {searchResults.quotes.map((quote) => (
                <CommandItem 
                  key={quote.id} 
                  onSelect={() => { navigate(`/admin/quotes/${quote.id}`); handleOpenChange(false); }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{quote.number}</span>
                  <span className="ml-2 text-xs text-muted-foreground truncate max-w-32">{quote.title}</span>
                  <Badge variant="outline" className="ml-auto text-xs">{quote.status}</Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Bookings */}
          {searchResults.bookings.length > 0 && (
            <CommandGroup heading="Bokningar">
              {searchResults.bookings.map((booking) => (
                <CommandItem 
                  key={booking.id} 
                  onSelect={() => { navigate(`/admin/quotes?tab=requests&id=${booking.id}`); handleOpenChange(false); }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{getBookingName(booking)}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{booking.service_slug}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
