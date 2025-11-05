import { useQuery } from '@tanstack/react-query';
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

export function useAnalytics(filters: AnalyticsFilters) {
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
        };
      } catch (err) {
        console.error('Analytics query error:', err);
        toast.error('Kunde inte ladda analytics data');
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  return {
    analytics: data,
    loading: isLoading,
    error,
    refresh: refetch,
  };
}
