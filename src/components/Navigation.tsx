import { useState } from "react";
import { Menu, X, User, LogOut, Phone, ChevronDown, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTheme } from "@/theme/useTheme";
import { useCopy } from '@/copy/CopyProvider';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';
import QuoteQuestionsNotification from './admin/QuoteQuestionsNotification';
import React from 'react';
import { openServiceRequestModal } from '@/features/requests/ServiceRequestModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { isAdmin, isOwner, isWorker } = useRole();
  const { t } = useCopy();
  const { currentLanguage } = useLanguagePersistence();
  const { theme } = useTheme();

  const adminMenuItems = [
    { href: "/admin", label: "Översikt" },
    { href: "/admin/services", label: "Tjänster" },
    { href: "/admin/quotes", label: "Offerter" },
    { href: "/admin/quote-questions", label: "Offertfrågor" },
    { href: "/admin/bookings", label: "Bokningar" },
    { href: "/admin/jobs", label: "Arbetsordrar" },
    { href: "/admin/job-requests", label: "Jobbförfrågningar" },
    { href: "/admin/ongoing-projects", label: "Pågående projekt" },
    { href: "/admin/invoices", label: "Fakturor" },
    { href: "/admin/customers", label: "Kunder" },
    { href: "/admin/users", label: "Användare" },
    { href: "/admin/staff", label: "Personal" },
    { href: "/admin/worker-analytics", label: "Worker Analytics" },
    { href: "/admin/leads", label: "AI Leads" },
    { href: "/admin/translations", label: "Översättningar" },
    { href: "/admin/reports", label: "Rapporter" },
    { href: "/admin/database", label: "Databas" },
    { href: "/admin/security", label: "Säkerhet" },
    { href: "/admin/settings", label: "Inställningar" },
  ];

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.clear();
      navigate(currentLanguage === 'en' ? '/en' : '/');
      toast.success(currentLanguage === 'en' ? 'You have been logged out' : 'Du har loggats ut');
    } catch (error) {
      toast.error(currentLanguage === 'en' ? 'Could not log out' : 'Kunde inte logga ut');
    }
  };

  const getNavItems = () => {
    // Language-specific paths
    const paths = currentLanguage === 'en' ? {
      services: '/en/services',
      smartHome: '/en/smart-home', 
      references: '/en/references',
      about: '/en/about',
      contact: '/en/contact',
      ai: '/en/ai',
      careers: '/en/careers'
    } : {
      services: '/tjanster',
      smartHome: '/smart-hem',
      references: '/referenser', 
      about: '/om-oss',
      contact: '/kontakt',
      ai: '/ai',
      careers: '/karriar'
    };
    
    const primaryNavItems = [
      { href: currentLanguage === 'en' ? "/en" : "/", label: t('nav.home') },
      { href: paths.services, label: t('nav.services') },
      { href: paths.contact, label: t('nav.contact') },
    ];

    const secondaryNavItems = [
      { href: paths.ai, label: currentLanguage === 'en' ? 'AI Lab' : 'AI Lab', icon: <Bot className="h-4 w-4" /> },
      { href: paths.smartHome, label: t('nav.smartHome'), icon: null },
      { href: paths.references, label: t('nav.references'), icon: null },
      { href: paths.about, label: t('nav.about'), icon: null },
      { href: paths.careers, label: currentLanguage === 'en' ? 'Careers' : 'Karriär', icon: null },
    ];

    return { primaryNavItems, secondaryNavItems };
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border" style={{ "--header-h": "64px" } as any}>
      <nav className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo with Proper Spacing */}
          <div className="flex items-center">
            <Link 
              to={currentLanguage === 'en' ? "/en" : "/"} 
              className="inline-flex items-center py-2 group flex-shrink-0 relative"
            >
              <img 
                src="/assets/fixco-logo-black.png"
                alt={currentLanguage === 'en' ? "FIXCO - Your Complete Solution" : "FIXCO - Din Helhetslösning"} 
                className="h-9 w-auto object-contain group-hover:scale-105 transition-all duration-300"
                style={{ 
                  minWidth: '80px', 
                  maxWidth: '140px',
                  filter: theme === 'light' ? 'none' : 'brightness(0) invert(1)'
                }}
                width={140}
                height={36}
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-rainbow opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg blur-xl" />
            </Link>
          </div>

          {/* Center: Navigation - Desktop Only */}
          <div className="hidden laptop:flex items-center justify-center flex-1 max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-2 lg:mx-4 xl:mx-12">
            <nav className="flex items-center gap-x-2 lg:gap-x-3 xl:gap-x-4 2xl:gap-x-5">
              {/* Primary navigation items */}
              {navItems.primaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center px-1.5 lg:px-2.5 xl:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200",
                    "text-foreground hover:text-primary hover:bg-primary/10",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive(item.href) && "text-primary bg-primary/10 font-semibold"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Secondary navigation items in dropdown - Only on laptop/lg screens */}
              <div className="2xl:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 lg:h-9 px-2 lg:px-3 text-xs lg:text-sm font-medium inline-flex items-center gap-1 hover:bg-primary/10 hover:text-primary"
                    >
                      {currentLanguage === 'en' ? 'More' : 'Mer'}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="center"
                    className="w-48 bg-background/95 backdrop-blur-sm border border-border shadow-lg z-[9999]"
                  >
                    {navItems.secondaryNavItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full",
                            isActive(item.href) && "bg-primary/10 text-primary font-semibold"
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Secondary navigation items directly - Only on XL+ screens */}
              <div className="hidden 2xl:flex items-center gap-x-2 xl:gap-x-3 2xl:gap-x-4">
                {navItems.secondaryNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-medium whitespace-nowrap rounded-md transition-all duration-200",
                      "text-foreground hover:text-primary hover:bg-primary/10",
                      "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive(item.href) && "text-primary bg-primary/10 font-semibold"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Right: Actions with Proper Spacing */}
          <div className="flex items-center gap-x-1.5 lg:gap-x-3 xl:gap-x-5">
            
            {/* Language & Theme Switchers */}
            <div className="flex items-center gap-x-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
            
            {/* Contact - Desktop Only */}
            <a 
              href="tel:+46793350228" 
              className="hidden xl:inline-flex items-center gap-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted whitespace-nowrap"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline font-medium">+46 79 335 02 28</span>
            </a>
            
            {/* User Actions - Desktop */}
            {user ? (
              <div className="hidden xl:flex items-center space-x-2">
                {/* Notifikation för offertfrågor (endast för admin) */}
                {(isAdmin || isOwner) && <QuoteQuestionsNotification />}
                
                {(isAdmin || isOwner) ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 xl:h-9 px-2 xl:px-3 text-xs xl:text-sm inline-flex items-center space-x-1 xl:space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden xl:inline">Admin Panel</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-card z-50">
                      <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {adminMenuItems.slice(0, 6).map((adminItem) => (
                        <DropdownMenuItem key={adminItem.href} asChild>
                          <Link
                            to={adminItem.href}
                            className={cn(
                              "w-full cursor-pointer",
                              location.pathname === adminItem.href && "bg-accent text-accent-foreground"
                            )}
                          >
                            {adminItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Hantering</DropdownMenuLabel>
                      {adminMenuItems.slice(6, 12).map((adminItem) => (
                        <DropdownMenuItem key={adminItem.href} asChild>
                          <Link
                            to={adminItem.href}
                            className={cn(
                              "w-full cursor-pointer",
                              location.pathname === adminItem.href && "bg-accent text-accent-foreground"
                            )}
                          >
                            {adminItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>System</DropdownMenuLabel>
                      {adminMenuItems.slice(12).map((adminItem) => (
                        <DropdownMenuItem key={adminItem.href} asChild>
                          <Link
                            to={adminItem.href}
                            className={cn(
                              "w-full cursor-pointer",
                              location.pathname === adminItem.href && "bg-accent text-accent-foreground"
                            )}
                          >
                            {adminItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : isWorker ? (
                  <Link to="/worker">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 xl:h-9 px-2 xl:px-3 text-xs xl:text-sm inline-flex items-center space-x-1 xl:space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden xl:inline">Arbetare</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to={currentLanguage === 'en' ? "/en/admin" : "/mitt-fixco"}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 xl:h-9 px-2 xl:px-3 text-xs xl:text-sm inline-flex items-center space-x-1 xl:space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden xl:inline">{t('nav.myFixco')}</span>
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="h-8 xl:h-9 px-2 xl:px-3 text-xs xl:text-sm inline-flex items-center space-x-1 xl:space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xl:inline">{currentLanguage === 'en' ? 'Log out' : 'Logga ut'}</span>
                </Button>
              </div>
            ) : (
              <div className="hidden xl:flex items-center space-x-2">
                    <Link to={currentLanguage === 'en' ? '/en/auth' : '/auth'}>
                      <Button 
                        size="sm"
                        className="h-8 xl:h-9 px-2 xl:px-3 text-xs xl:text-sm bg-gradient-rainbow text-white hover:opacity-90 transition-opacity border-0"
                      >
                        <span className="hidden xl:inline">{t('cta.login')}</span>
                        <span className="xl:hidden">Login</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="h-8 xl:h-9 px-3 xl:px-4 text-xs xl:text-sm bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                      onClick={() => openServiceRequestModal({ mode: 'home_visit', showCategories: true })}
                    >
                      <span className="hidden xl:inline">{t('cta.request_quote')}</span>
                      <span className="xl:hidden">{t('cta.get_quote')}</span>
                    </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="laptop:hidden inline-flex items-center h-10 px-4 hover:bg-muted rounded-md transition-colors ml-2"
              aria-label={currentLanguage === 'en' ? 'Open menu' : 'Öppna meny'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="laptop:hidden border-t border-border bg-background">
            <div className="py-4 space-y-2">
              {/* Primary Navigation Links */}
              <nav className="space-y-1">
                {navItems.primaryNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center py-3 px-4 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors",
                      isActive(item.href) && "text-primary font-medium bg-muted"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Separator */}
              <div className="border-t border-border my-2" />

              {/* Secondary Navigation Links */}
              <nav className="space-y-1">
                {navItems.secondaryNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 py-3 px-4 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors",
                      isActive(item.href) && "text-primary font-medium bg-muted"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="pt-4 space-y-3 border-t border-border">
                <a 
                  href="tel:+46793350228" 
                  className="flex items-center gap-x-2 px-4 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>+46 79 335 02 28</span>
                </a>

                {/* Mobile Language & Theme Switchers */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>

                {user ? (
                  <div className="space-y-2 px-4">
                    {(isAdmin || isOwner) ? (
                      <>
                        <div className="text-sm font-medium text-muted-foreground">Admin Panel</div>
                        {adminMenuItems.map((item) => (
                          <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={cn(
                                "w-full justify-start gap-x-2",
                                location.pathname === item.href && "bg-accent text-accent-foreground"
                              )}
                            >
                              {item.label}
                            </Button>
                          </Link>
                        ))}
                      </>
                    ) : isWorker ? (
                      <Link to="/worker" onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start gap-x-2"
                        >
                          <User className="h-4 w-4" />
                          <span>Arbetare</span>
                        </Button>
                      </Link>
                    ) : (
                      <Link to={currentLanguage === 'en' ? "/en/admin" : "/mitt-fixco"} onClick={() => setIsMenuOpen(false)}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start gap-x-2"
                        >
                          <User className="h-4 w-4" />
                          <span>{t('nav.myFixco')}</span>
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-x-2" 
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{currentLanguage === 'en' ? 'Log out' : 'Logga ut'}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <Link to={currentLanguage === 'en' ? '/en/auth' : '/auth'} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        <span>{t('cta.login')}</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => { openServiceRequestModal({ mode: 'home_visit', showCategories: true }); setIsMenuOpen(false); }}
                    >
                      {t('cta.request_quote')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// Memoize Navigation to prevent unnecessary re-renders
export default React.memo(Navigation);