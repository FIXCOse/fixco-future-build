import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import Navbar2 from './Navbar2';
import { usePersistedFeatureFlag } from '@/hooks/usePersistedFeatureFlag';

/**
 * Portal component for Navbar2 that renders outside ScrollSmoother's transform context
 * This ensures position: fixed works correctly by rendering directly to document.body
 */
export const NavbarPortal = () => {
  const { data: useTopMenu } = usePersistedFeatureFlag('use_top_menu', false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lista över routes där menyn INTE ska visas
  const hideMenuRoutes = [
    '/q/',           // Offert-sidor
    '/invoice/',     // Faktura-sidor
    '/auth',         // Auth-sidor
  ];

  // Kontrollera om current route börjar med någon av de dolda routes
  const shouldHideMenu = hideMenuRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Only render if bottom menu is enabled, we're in the browser, and NOT on a hidden route
  if (useTopMenu !== false || !mounted || typeof document === 'undefined' || shouldHideMenu) {
    return null;
  }

  return ReactDOM.createPortal(
    <Navbar2 />,
    document.body
  );
};
