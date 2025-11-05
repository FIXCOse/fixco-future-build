import { useQuery } from '@tanstack/react-query';
import {
  fetchRevenueAnalytics,
  fetchBookingAnalytics,
  fetchCustomerSegmentation,
  fetchServicePerformance,
  fetchTrafficAnalytics,
  fetchConversionFunnel,
  fetchRevenueTimeline,
  fetchTopCustomers,
  type AnalyticsFilters,
} from '@/lib/api/analytics';

export function useAnalytics(filters: AnalyticsFilters) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', filters],
    queryFn: async () => {
      const [
        revenue,
        bookings,
        customers,
        services,
        traffic,
        funnel,
        revenueTimeline,
        topCustomers,
      ] = await Promise.all([
        fetchRevenueAnalytics(filters),
        fetchBookingAnalytics(filters),
        fetchCustomerSegmentation(filters),
        fetchServicePerformance(filters),
        fetchTrafficAnalytics(filters),
        fetchConversionFunnel(filters),
        fetchRevenueTimeline(filters),
        fetchTopCustomers(filters, 10),
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
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    analytics: data,
    loading: isLoading,
    error,
    refresh: refetch,
  };
}
