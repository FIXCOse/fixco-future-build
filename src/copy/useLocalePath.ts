import { useLocation } from 'react-router-dom';
import { useCopy } from './CopyProvider';
import { convertPath } from '@/utils/routeMapping';

export function useLocalePath() {
  const { locale } = useCopy();
  const location = useLocation();

  const toEN = () => {
    return convertPath(location.pathname + location.search + location.hash, 'en');
  };

  const toSV = () => {
    return convertPath(location.pathname + location.search + location.hash, 'sv');
  };

  return { toEN, toSV };
}