import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsFilters } from './analytics';

export interface SessionJourney {
  sessionId: string;
  landingPage: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  pagesVisited: string[];
  ctaClicks: string[];
  funnelSteps: string[];
  converted: boolean;
  bookingId: string | null;
  startedAt: string;
  endedAt: string;
  totalEvents: number;
}

export interface JourneyAnalytics {
  totalSessions: number;
  convertedSessions: number;
  conversionRate: number;
  bySource: Array<{
    source: string;
    sessions: number;
    conversions: number;
    conversionRate: number;
  }>;
  byLandingPage: Array<{
    page: string;
    sessions: number;
    conversions: number;
    conversionRate: number;
  }>;
  topJourneys: SessionJourney[];
}

export async function fetchSessionJourneys(filters: AnalyticsFilters): Promise<JourneyAnalytics> {
  const { startDate, endDate } = filters;

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  if (error || !events?.length) {
    console.error('fetchSessionJourneys error:', error);
    return {
      totalSessions: 0,
      convertedSessions: 0,
      conversionRate: 0,
      bySource: [],
      byLandingPage: [],
      topJourneys: [],
    };
  }

  // Group by session_id
  const sessionMap = new Map<string, typeof events>();
  events.forEach((event) => {
    const sid = event.session_id || 'unknown';
    if (!sessionMap.has(sid)) sessionMap.set(sid, []);
    sessionMap.get(sid)!.push(event);
  });

  const journeys: SessionJourney[] = [];

  sessionMap.forEach((sessionEvents, sessionId) => {
    const firstEvent = sessionEvents[0];
    const lastEvent = sessionEvents[sessionEvents.length - 1];
    const eventData = (firstEvent.event_data as any) || {};

    const pagesVisited = [...new Set(
      sessionEvents
        .filter(e => e.event_type === 'page_view')
        .map(e => e.page_url || '')
        .filter(Boolean)
    )];

    const ctaClicks = sessionEvents
      .filter(e => e.event_type === 'cta_click')
      .map(e => (e.event_data as any)?.element || 'unknown');

    const funnelSteps = sessionEvents
      .filter(e => e.event_type.startsWith('funnel_'))
      .map(e => e.event_type);

    const conversionEvent = sessionEvents.find(e => e.event_type === 'booking_completed');

    journeys.push({
      sessionId,
      landingPage: eventData.landing_page || pagesVisited[0] || '',
      utmSource: eventData.utm_source || null,
      utmMedium: eventData.utm_medium || null,
      utmCampaign: eventData.utm_campaign || null,
      referrer: eventData.referrer || null,
      pagesVisited,
      ctaClicks,
      funnelSteps,
      converted: !!conversionEvent,
      bookingId: conversionEvent ? (conversionEvent.event_data as any)?.booking_id || null : null,
      startedAt: firstEvent.created_at!,
      endedAt: lastEvent.created_at!,
      totalEvents: sessionEvents.length,
    });
  });

  // Aggregate by source
  const sourceMap = new Map<string, { sessions: number; conversions: number }>();
  const landingMap = new Map<string, { sessions: number; conversions: number }>();

  journeys.forEach((j) => {
    const source = j.utmSource || 'direct';
    if (!sourceMap.has(source)) sourceMap.set(source, { sessions: 0, conversions: 0 });
    sourceMap.get(source)!.sessions += 1;
    if (j.converted) sourceMap.get(source)!.conversions += 1;

    const page = j.landingPage || '/';
    if (!landingMap.has(page)) landingMap.set(page, { sessions: 0, conversions: 0 });
    landingMap.get(page)!.sessions += 1;
    if (j.converted) landingMap.get(page)!.conversions += 1;
  });

  const bySource = Array.from(sourceMap.entries())
    .map(([source, data]) => ({
      source,
      ...data,
      conversionRate: data.sessions > 0 ? (data.conversions / data.sessions) * 100 : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions);

  const byLandingPage = Array.from(landingMap.entries())
    .map(([page, data]) => ({
      page,
      ...data,
      conversionRate: data.sessions > 0 ? (data.conversions / data.sessions) * 100 : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 20);

  const convertedSessions = journeys.filter(j => j.converted).length;

  return {
    totalSessions: journeys.length,
    convertedSessions,
    conversionRate: journeys.length > 0 ? (convertedSessions / journeys.length) * 100 : 0,
    bySource,
    byLandingPage,
    topJourneys: journeys
      .sort((a, b) => b.totalEvents - a.totalEvents)
      .slice(0, 50),
  };
}
