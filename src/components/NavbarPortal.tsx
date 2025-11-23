import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Navbar2 from './Navbar2';
import { usePersistedFeatureFlag } from '@/hooks/usePersistedFeatureFlag';

/**
 * Portal component for Navbar2 that renders outside ScrollSmoother's transform context
 * This ensures position: fixed works correctly by rendering directly to document.body
 */
export const NavbarPortal = () => {
  const { data: useTopMenu } = usePersistedFeatureFlag('use_top_menu', false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Only render if bottom menu is enabled and we're in the browser
  if (useTopMenu !== false || !mounted || typeof document === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <Navbar2 />,
    document.body
  );
};
