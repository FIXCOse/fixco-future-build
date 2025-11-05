import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

function getSessionId(): string {
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

function getUTMFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    source: urlParams.get('utm_source'),
    medium: urlParams.get('utm_medium'),
    campaign: urlParams.get('utm_campaign'),
  };
}

export function useEventTracking() {
  const trackPageView = useCallback((page_url: string, metadata?: any) => {
    const sessionId = getSessionId();
    const utmParams = getUTMFromURL();

    supabase.from('events').insert({
      event_type: 'page_view',
      page_url,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      event_data: {
        ...metadata,
        utm_source: utmParams.source,
        utm_medium: utmParams.medium,
        utm_campaign: utmParams.campaign,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
    }).then();
  }, []);

  const trackClick = useCallback((element: string, metadata?: any) => {
    const sessionId = getSessionId();

    supabase.from('events').insert({
      event_type: 'button_click',
      page_url: window.location.pathname,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      event_data: {
        element,
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    }).then();
  }, []);

  return { trackPageView, trackClick };
}
