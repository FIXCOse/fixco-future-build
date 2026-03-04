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

/** Persist landing page + UTM on first page load of the session */
function ensureSessionOrigin() {
  if (!sessionStorage.getItem('landing_page')) {
    sessionStorage.setItem('landing_page', window.location.pathname + window.location.search);
    const utm = getUTMFromURL();
    if (utm.source) sessionStorage.setItem('utm_source', utm.source);
    if (utm.medium) sessionStorage.setItem('utm_medium', utm.medium);
    if (utm.campaign) sessionStorage.setItem('utm_campaign', utm.campaign);
    sessionStorage.setItem('referrer', document.referrer || '');
  }
}

function getSessionOrigin() {
  return {
    landing_page: sessionStorage.getItem('landing_page') || window.location.pathname,
    utm_source: sessionStorage.getItem('utm_source') || null,
    utm_medium: sessionStorage.getItem('utm_medium') || null,
    utm_campaign: sessionStorage.getItem('utm_campaign') || null,
    referrer: sessionStorage.getItem('referrer') || document.referrer || '',
  };
}

export function useEventTracking() {
  const trackPageView = useCallback((page_url: string, metadata?: any) => {
    ensureSessionOrigin();
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
      event_type: 'cta_click',
      page_url: window.location.pathname,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      event_data: {
        element,
        ...metadata,
        ...getSessionOrigin(),
        timestamp: new Date().toISOString(),
      },
    }).then();
  }, []);

  const trackFunnelStep = useCallback((step: string, metadata?: any) => {
    const sessionId = getSessionId();

    supabase.from('events').insert({
      event_type: `funnel_${step}`,
      page_url: window.location.pathname,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      event_data: {
        step,
        ...metadata,
        ...getSessionOrigin(),
        timestamp: new Date().toISOString(),
      },
    }).then();
  }, []);

  const trackConversion = useCallback((bookingId: string, metadata?: any) => {
    const sessionId = getSessionId();

    supabase.from('events').insert({
      event_type: 'booking_completed',
      page_url: window.location.pathname,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      event_data: {
        booking_id: bookingId,
        ...metadata,
        ...getSessionOrigin(),
        timestamp: new Date().toISOString(),
      },
    }).then();
  }, []);

  return { trackPageView, trackClick, trackFunnelStep, trackConversion };
}
