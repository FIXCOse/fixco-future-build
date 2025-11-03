import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBookingsRealtime } from './useBookingsRealtime';
import { useQuotesRealtime } from './useQuotesRealtime';
import type { QuoteNewRow as QuoteType } from '@/lib/api/quotes-new';

export type BookingRow = {
  id: string;
  customer_id: string;
  service_slug: string;
  mode: string;
  status: string;
  payload: any;
  file_urls: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type RequestWithQuote = {
  booking: BookingRow;
  quote?: QuoteType;
  customer?: CustomerRow;
};

export function useRequestsQuotes(statusFilter: string[] = []) {
  const [data, setData] = useState<RequestWithQuote[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .rpc('admin_get_bookings');

      if (bookingsError) throw bookingsError;

      // Fetch all quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes_new')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      // Fetch customers
      const customerIds = [...new Set(bookings?.map((b: any) => b.customer_id).filter(Boolean))];
      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .in('id', customerIds);

      // Combine data
      const combined: RequestWithQuote[] = (bookings || []).map((booking: any) => {
        const quote = quotes?.find((q: any) => q.request_id === booking.id) as QuoteType | undefined;
        const customer = customers?.find((c: any) => c.id === booking.customer_id);

        return {
          booking,
          quote,
          customer,
        };
      });

      // Apply filters
      let filtered = combined;
      if (statusFilter.length > 0) {
        filtered = combined.filter(item => {
          if (statusFilter.includes('new')) {
            return !item.quote && item.booking.status === 'new';
          }
          if (statusFilter.includes('with_quote')) {
            return !!item.quote;
          }
          if (statusFilter.includes('archived')) {
            return ['completed', 'cancelled'].includes(item.booking.status);
          }
          return true;
        });
      }

      setData(filtered);
    } catch (error) {
      console.error('Error loading requests and quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter.join(',')]);

  // Realtime updates
  useBookingsRealtime(() => loadData());
  useQuotesRealtime(() => loadData());

  return { data, loading, refresh: loadData };
}
