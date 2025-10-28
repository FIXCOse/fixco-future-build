import { Link, useLocation } from 'react-router-dom';
import { Home, Wrench, Image, Bot, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguagePersistence } from '@/hooks/useLanguagePersistence';

export const BottomNavigation = () => {
  const location = useLocation();
  const { currentLanguage } = useLanguagePersistence();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/' || location.pathname === '/en';
    }
    const pathToCheck = currentLanguage === 'en' ? `/en${href}` : href;
    return location.pathname === pathToCheck || location.pathname.startsWith(pathToCheck + '/');
  };

  const getLocalizedPath = (path: string) => {
    if (currentLanguage === 'en') {
      return `/en${path}`;
    }
    return path;
  };

  const navItems = [
    { href: '/', icon: Home, label: currentLanguage === 'en' ? 'Home' : 'Hem' },
    { href: '/tjanster', icon: Wrench, label: currentLanguage === 'en' ? 'Services' : 'Tjänster' },
    { href: '/referenser', icon: Image, label: currentLanguage === 'en' ? 'References' : 'Referenser' },
    { href: '/ai', icon: Bot, label: 'AI', highlight: true },
    { href: '/kontakt', icon: Phone, label: currentLanguage === 'en' ? 'Contact' : 'Kontakt' },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border/50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)]"
    >
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const href = item.href === '/' ? (currentLanguage === 'en' ? '/en' : '/') : getLocalizedPath(item.href);

            return (
              <Link
                key={item.href}
                to={href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center py-2 px-3 transition-all duration-200 hover:scale-110 group"
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-b-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-6 h-6 mb-1 transition-colors duration-200 ${
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-primary'
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-primary'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
