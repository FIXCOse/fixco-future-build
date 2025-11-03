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
  invoice?: InvoiceRow;
};

export type InvoiceRow = {
  id: string;
  invoice_number: string;
  status: string;
  total_amount: number;
  due_date: string;
  created_at: string;
};

export function useRequestsQuotes(statusFilter: string[] = []) {
  const [data, setData] = useState<RequestWithQuote[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch all quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes_new')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      // Fetch invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      // Fetch customers from profiles
      const customerIds = [...new Set(bookings?.map((b: any) => b.customer_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone')
        .in('id', customerIds);

      // Map profiles to customer format
      const customers = profiles?.map(p => ({
        id: p.id,
        name: [p.first_name, p.last_name].filter(Boolean).join(' ') || p.email || 'Okänd',
        email: p.email || '',
        phone: p.phone || ''
      }));

      // Combine data
      const combined: RequestWithQuote[] = (bookings || []).map((booking: any) => {
        const quote = quotes?.find((q: any) => q.source_booking_id === booking.id) as QuoteType | undefined;
        const customer = customers?.find((c: any) => c.id === booking.customer_id);
        const invoice = quote ? invoices?.find((inv: any) => inv.quote_id === quote.id) : undefined;

        return {
          booking,
          quote,
          customer,
          invoice,
        };
      });

      // Apply filters
      let filtered = combined;
      if (statusFilter.length > 0) {
        const filterType = statusFilter[0];
        
        if (filterType === 'requests') {
          // Visa alla med status "new" OCH som inte har offert
          filtered = combined.filter(item => 
            item.booking.status === 'new' && !item.quote
          );
        } else if (filterType === 'quotes') {
          // Visa ALLA som har en offert, oavsett booking status
          filtered = combined.filter(item => !!item.quote);
        } else if (filterType === 'archived') {
          // Visa arkiverade
          filtered = combined.filter(item => 
            ['completed', 'cancelled'].includes(item.booking.status)
          );
        }
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
