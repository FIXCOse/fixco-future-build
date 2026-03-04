import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsFilters } from './analytics';

export interface DetailedFunnel {
  steps: Array<{
    label: string;
    eventType: string;
    count: number;
    dropoff: number;
    dropoffPercent: number;
  }>;
}

export interface BounceAnalytics {
  totalSessions: number;
  bouncedSessions: number;
  bounceRate: number;
  avgPagesPerSession: number;
  topConvertingSource: string;
  bestLandingPage: string;
}

const FUNNEL_STEPS = [
  { label: 'Sidbesök', eventType: 'page_view' },
  { label: 'CTA-klick', eventType: 'cta_click' },
  { label: 'Modal öppnad', eventType: 'funnel_modal_opened' },
  { label: 'Steg 1', eventType: 'funnel_step_1' },
  { label: 'Steg 2', eventType: 'funnel_step_2' },
  { label: 'Steg 3', eventType: 'funnel_step_3' },
  { label: 'Bokning slutförd', eventType: 'booking_completed' },
];

export async function fetchDetailedFunnel(filters: AnalyticsFilters): Promise<DetailedFunnel> {
  const { startDate, endDate } = filters;

  const { data: events, error } = await supabase
    .from('events')
    .select('event_type, session_id')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .in('event_type', FUNNEL_STEPS.map(s => s.eventType));

  if (error || !events?.length) {
    return {
      steps: FUNNEL_STEPS.map(s => ({
        ...s,
        count: 0,
        dropoff: 0,
        dropoffPercent: 0,
      })),
    };
  }

  // Count unique sessions per event type
  const sessionsByType = new Map<string, Set<string>>();
  events.forEach(e => {
    const type = e.event_type;
    if (!sessionsByType.has(type)) sessionsByType.set(type, new Set());
    if (e.session_id) sessionsByType.get(type)!.add(e.session_id);
  });

  const steps = FUNNEL_STEPS.map((step, i) => {
    const count = sessionsByType.get(step.eventType)?.size || 0;
    const prevCount = i > 0 ? (sessionsByType.get(FUNNEL_STEPS[i - 1].eventType)?.size || 0) : count;
    const dropoff = i > 0 ? prevCount - count : 0;
    const dropoffPercent = i > 0 && prevCount > 0 ? (dropoff / prevCount) * 100 : 0;

    return { ...step, count, dropoff, dropoffPercent };
  });

  return { steps };
}

export async function fetchBounceAnalytics(filters: AnalyticsFilters): Promise<BounceAnalytics> {
  const { startDate, endDate } = filters;

  const { data: events, error } = await supabase
    .from('events')
    .select('session_id, event_type, page_url, event_data')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error || !events?.length) {
    return {
      totalSessions: 0,
      bouncedSessions: 0,
      bounceRate: 0,
      avgPagesPerSession: 0,
      topConvertingSource: '-',
      bestLandingPage: '-',
    };
  }

  // Group by session
  const sessions = new Map<string, typeof events>();
  events.forEach(e => {
    const sid = e.session_id || 'unknown';
    if (!sessions.has(sid)) sessions.set(sid, []);
    sessions.get(sid)!.push(e);
  });

  const totalSessions = sessions.size;
  let bouncedSessions = 0;
  let totalPages = 0;

  const sourceConversions = new Map<string, { sessions: number; conversions: number }>();
  const landingConversions = new Map<string, { sessions: number; conversions: number }>();

  sessions.forEach(sessionEvents => {
    const pageViews = sessionEvents.filter(e => e.event_type === 'page_view');
    totalPages += pageViews.length;
    if (pageViews.length <= 1) bouncedSessions++;

    const firstEvent = sessionEvents[0];
    const eventData = (firstEvent.event_data as any) || {};
    const source = eventData.utm_source || 'direct';
    const landingPage = eventData.landing_page || pageViews[0]?.page_url || '/';
    const converted = sessionEvents.some(e => e.event_type === 'booking_completed');

    if (!sourceConversions.has(source)) sourceConversions.set(source, { sessions: 0, conversions: 0 });
    sourceConversions.get(source)!.sessions++;
    if (converted) sourceConversions.get(source)!.conversions++;

    if (!landingConversions.has(landingPage)) landingConversions.set(landingPage, { sessions: 0, conversions: 0 });
    landingConversions.get(landingPage)!.sessions++;
    if (converted) landingConversions.get(landingPage)!.conversions++;
  });

  // Find top converting source
  let topConvertingSource = '-';
  let topConvRate = 0;
  sourceConversions.forEach((data, source) => {
    if (data.sessions >= 5) {
      const rate = data.conversions / data.sessions;
      if (rate > topConvRate) {
        topConvRate = rate;
        topConvertingSource = source;
      }
    }
  });

  // Find best landing page (min 10 sessions)
  let bestLandingPage = '-';
  let bestLPRate = 0;
  landingConversions.forEach((data, page) => {
    if (data.sessions >= 10) {
      const rate = data.conversions / data.sessions;
      if (rate > bestLPRate) {
        bestLPRate = rate;
        bestLandingPage = page;
      }
    }
  });

  return {
    totalSessions,
    bouncedSessions,
    bounceRate: totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0,
    avgPagesPerSession: totalSessions > 0 ? totalPages / totalSessions : 0,
    topConvertingSource,
    bestLandingPage,
  };
}
