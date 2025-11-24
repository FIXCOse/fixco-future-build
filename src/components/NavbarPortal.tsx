import { useEffect, useState, useMemo } from 'react';
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
  const shouldHideMenu = useMemo(() => {
    const path = location.pathname;
    const shouldHide = hideMenuRoutes.some(route => path.startsWith(route));
    console.log('🔍 [NavbarPortal] Path:', path, '| Should hide:', shouldHide);
    return shouldHide;
  }, [location.pathname]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 [NavbarPortal] useTopMenu:', useTopMenu, '| shouldHideMenu:', shouldHideMenu, '| mounted:', mounted);
  }, [useTopMenu, shouldHideMenu, mounted]);

  // Only render if bottom menu is enabled and we're in the browser
  if (useTopMenu !== false || !mounted || typeof document === 'undefined') {
    return null;
  }

  // Don't render at all on hidden routes
  if (shouldHideMenu) {
    return null;
  }

  // Render navbar directly as child of body (no wrapping div)
  return ReactDOM.createPortal(
    <Navbar2 />,
    document.body
  );
};
