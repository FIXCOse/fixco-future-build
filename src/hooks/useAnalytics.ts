import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchRevenueAnalytics,
  fetchBookingAnalytics,
  fetchCustomerSegmentation,
  fetchServicePerformance,
  fetchTrafficAnalytics,
  fetchConversionFunnel,
  fetchRevenueTimeline,
  fetchTopCustomers,
  fetchQuotePipeline,
  type AnalyticsFilters,
} from '@/lib/api/analytics';
import { fetchSessionJourneys } from '@/lib/api/analyticsJourneys';
import { fetchDetailedFunnel, fetchBounceAnalytics } from '@/lib/api/analyticsDetailed';
import { supabase } from '@/integrations/supabase/client';

export function useAnalytics(filters: AnalyticsFilters) {
  const queryClient = useQueryClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Supabase Realtime subscription — invalidate cache on new events
  useEffect(() => {
    const channel = supabase
      .channel('analytics-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        () => {
          // Debounce 2s to avoid spamming during burst
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
          }, 2000);
        }
      )
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', filters],
    queryFn: async () => {
      try {
        const [
          revenue,
          bookings,
          customers,
          services,
          traffic,
          funnel,
          revenueTimeline,
          topCustomers,
          quotePipeline,
          journeys,
          detailedFunnel,
          bounceAnalytics,
        ] = await Promise.all([
          fetchRevenueAnalytics(filters),
          fetchBookingAnalytics(filters),
          fetchCustomerSegmentation(filters),
          fetchServicePerformance(filters),
          fetchTrafficAnalytics(filters),
          fetchConversionFunnel(filters),
          fetchRevenueTimeline(filters),
          fetchTopCustomers(filters, 10),
          fetchQuotePipeline(filters),
          fetchSessionJourneys(filters),
          fetchDetailedFunnel(filters),
          fetchBounceAnalytics(filters),
        ]);

        return {
          revenue,
          bookings,
          customers,
          services,
          traffic,
          funnel,
          revenueTimeline,
          topCustomers,
          quotePipeline,
          journeys,
          detailedFunnel,
          bounceAnalytics,
        };
      } catch (err) {
        console.error('Analytics query error:', err);
        toast.error('Kunde inte ladda analytics data');
        throw err;
      }
    },
    staleTime: 30_000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30_000,
    retry: 1,
  });

  return {
    analytics: data,
    loading: isLoading,
    error,
    refresh: refetch,
  };
}
