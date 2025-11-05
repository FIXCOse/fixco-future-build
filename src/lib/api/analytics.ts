import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsFilters {
  startDate: string;
  endDate: string;
  customerTypes?: ('company' | 'private' | 'brf')[];
  services?: string[];
  priceRange?: { min: number; max: number };
  cities?: string[];
  workers?: string[];
}

export interface RevenueAnalytics {
  totalRevenue: number;
  byCustomerType: Record<string, number>;
  rotDeduction: number;
  rutDeduction: number;
  trend: number;
  avgOrderValue: number;
  invoiceCount: number;
  previousPeriodRevenue: number;
}

export interface BookingAnalytics {
  totalBookings: number;
  byCustomerType: Record<string, number>;
  byStatus: Record<string, number>;
  trend: number;
  conversionRate: number;
}

export interface CustomerSegmentation {
  totalCustomers: number;
  byType: {
    company: { count: number; revenue: number; avgOrderValue: number };
    private: { count: number; revenue: number; avgOrderValue: number };
    brf: { count: number; revenue: number; avgOrderValue: number };
  };
  newVsReturning: {
    new: number;
    returning: number;
  };
}

export interface ServicePerformance {
  services: Array<{
    id: string;
    title: string;
    bookingCount: number;
    revenue: number;
    avgPrice: number;
    rotEligible: boolean;
    rutEligible: boolean;
  }>;
}

export interface TrafficAnalytics {
  totalPageViews: number;
  uniqueVisitors: number;
  bySource: Array<{
    source: string;
    visits: number;
    conversions: number;
    conversionRate: number;
  }>;
  topPages: Array<{
    url: string;
    views: number;
    avgDuration: number;
  }>;
}

export interface ConversionFunnel {
  stages: Array<{
    stage: string;
    count: number;
    dropoffRate: number;
  }>;
}

export interface QuotePipeline {
  pending: {
    count: number;
    totalAmount: number;
  };
  accepted: {
    count: number;
    totalAmount: number;
  };
  awaitingInvoice: {
    count: number;
    totalAmount: number;
  };
  declined: {
    count: number;
    totalAmount: number;
  };
  conversionRate: number;
  pipelineTotal: number;
}

// Revenue Analytics
export async function fetchRevenueAnalytics(filters: AnalyticsFilters): Promise<RevenueAnalytics> {
  const { startDate, endDate, customerTypes } = filters;

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customers:customer_id(customer_type, name, company_name, brf_name)
    `)
    .eq('status', 'paid')
    .gte('created_at', startDate)
    .lte('created_at', endDate);
  if (error) {
    console.error('fetchRevenueAnalytics error:', error);
    return {
      totalRevenue: 0,
      byCustomerType: {},
      rotDeduction: 0,
      rutDeduction: 0,
      trend: 0,
      avgOrderValue: 0,
      invoiceCount: 0,
      previousPeriodRevenue: 0,
    };
  }

  console.log('Revenue Analytics - Raw data:', data?.length, 'invoices');
  
  // Apply customer type filter in JavaScript (after fetch)
  const filteredData = customerTypes?.length 
    ? data?.filter(inv => {
        const type = (inv.customers as any)?.customer_type || 'private';
        return customerTypes.includes(type as any);
      })
    : data;

  console.log('Revenue Analytics - Filtered data:', filteredData?.length, 'invoices');

  if (!filteredData || filteredData.length === 0) {
    console.log('Revenue Analytics - No data after filtering');
    return {
      totalRevenue: 0,
      byCustomerType: {},
      rotDeduction: 0,
      rutDeduction: 0,
      trend: 0,
      avgOrderValue: 0,
      invoiceCount: 0,
      previousPeriodRevenue: 0,
    };
  }

  const totalRevenue = filteredData.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
  const byCustomerType = filteredData.reduce((acc: Record<string, number>, inv) => {
    const type = (inv.customers as any)?.customer_type || 'private';
    acc[type] = (acc[type] || 0) + Number(inv.total_amount || 0);
    return acc;
  }, {} as Record<string, number>);
  
  console.log('Revenue Analytics - Total Revenue:', totalRevenue, 'By Type:', byCustomerType);

  const rotDeduction = filteredData.reduce((sum, inv) => sum + Number(inv.rot_amount || 0), 0);
  const rutDeduction = filteredData.reduce((sum, inv) => sum + Number(inv.rut_amount || 0), 0);

  // Previous period comparison
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const periodLength = endDateObj.getTime() - startDateObj.getTime();
  const prevStartDate = new Date(startDateObj.getTime() - periodLength).toISOString();
  const prevEndDate = startDate;

  const { data: prevData } = await supabase
    .from('invoices')
    .select('total_amount')
    .eq('status', 'paid')
    .gte('created_at', prevStartDate)
    .lt('created_at', prevEndDate);

  const prevRevenue = prevData?.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0) || 0;
  const trend = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  return {
    totalRevenue,
    byCustomerType,
    rotDeduction,
    rutDeduction,
    trend,
    avgOrderValue: filteredData.length ? totalRevenue / filteredData.length : 0,
    invoiceCount: filteredData.length,
    previousPeriodRevenue: prevRevenue,
  };
}

// Booking Analytics
export async function fetchBookingAnalytics(filters: AnalyticsFilters): Promise<BookingAnalytics> {
  const { startDate, endDate } = filters;

  const { data, error } = await supabase
    .from('quotes_new')
    .select(`
      *,
      customers:customer_id(customer_type)
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .is('deleted_at', null);

  if (error) {
    console.error('fetchBookingAnalytics error:', error);
    return {
      totalBookings: 0,
      byCustomerType: {},
      byStatus: {},
      trend: 0,
      conversionRate: 0,
    };
  }

  const totalBookings = data?.length || 0;
  
  const byCustomerType = data?.reduce((acc: Record<string, number>, quote) => {
    const type = (quote.customers as any)?.customer_type || 'private';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {
    company: 0,
    private: 0,
    brf: 0,
  }) || { company: 0, private: 0, brf: 0 };

  const byStatus = data?.reduce((acc: Record<string, number>, quote) => {
    const status = quote.status || 'draft';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get previous period for trend
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const periodLength = endDateObj.getTime() - startDateObj.getTime();
  const prevStartDate = new Date(startDateObj.getTime() - periodLength).toISOString();

  const { data: prevData } = await supabase
    .from('quotes')
    .select('id')
    .gte('created_at', prevStartDate)
    .lt('created_at', startDate)
    .is('deleted_at', null);

  const prevBookings = prevData?.length || 0;
  const trend = prevBookings > 0 ? ((totalBookings - prevBookings) / prevBookings) * 100 : 0;

  // Conversion rate (quotes that became invoices)
  const { data: invoiceData } = await supabase
    .from('invoices')
    .select('quote_id')
    .not('quote_id', 'is', null)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const conversionRate = totalBookings > 0 ? ((invoiceData?.length || 0) / totalBookings) * 100 : 0;

  return {
    totalBookings,
    byCustomerType,
    byStatus,
    trend,
    conversionRate,
  };
}

// Customer Segmentation
export async function fetchCustomerSegmentation(filters: AnalyticsFilters): Promise<CustomerSegmentation> {
  const { startDate, endDate } = filters;

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customers:customer_id(customer_type, name, company_name, brf_name)
    `)
    .eq('status', 'paid')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    console.error('fetchCustomerSegmentation error:', error);
    return {
      totalCustomers: 0,
      byType: {
        company: { count: 0, revenue: 0, avgOrderValue: 0 },
        private: { count: 0, revenue: 0, avgOrderValue: 0 },
        brf: { count: 0, revenue: 0, avgOrderValue: 0 },
      },
      newVsReturning: { new: 0, returning: 0 },
    };
  }

  const byType = {
    company: { count: 0, revenue: 0, avgOrderValue: 0 },
    private: { count: 0, revenue: 0, avgOrderValue: 0 },
    brf: { count: 0, revenue: 0, avgOrderValue: 0 },
  };

  const customerIds = new Set();
  
  invoices?.forEach((inv) => {
    const type = ((inv.customers as any)?.customer_type || 'private') as 'company' | 'private' | 'brf';
    byType[type].count += 1;
    byType[type].revenue += Number(inv.total_amount || 0);
    customerIds.add(inv.customer_id);
  });

  Object.keys(byType).forEach((type) => {
    const typeKey = type as 'company' | 'private' | 'brf';
    byType[typeKey].avgOrderValue = byType[typeKey].count > 0 
      ? byType[typeKey].revenue / byType[typeKey].count 
      : 0;
  });

  // New vs Returning customers
  const { data: allCustomerInvoices } = await supabase
    .from('invoices')
    .select('customer_id, created_at')
    .eq('status', 'paid')
    .order('created_at', { ascending: true });

  const firstInvoiceMap = new Map();
  allCustomerInvoices?.forEach((inv) => {
    if (!firstInvoiceMap.has(inv.customer_id)) {
      firstInvoiceMap.set(inv.customer_id, inv.created_at);
    }
  });

  let newCustomers = 0;
  let returningCustomers = 0;

  invoices?.forEach((inv) => {
    const firstInvoice = firstInvoiceMap.get(inv.customer_id);
    if (firstInvoice && firstInvoice >= startDate && firstInvoice <= endDate) {
      newCustomers += 1;
    } else {
      returningCustomers += 1;
    }
  });

  return {
    totalCustomers: customerIds.size,
    byType,
    newVsReturning: {
      new: newCustomers,
      returning: returningCustomers,
    },
  };
}

// Service Performance
export async function fetchServicePerformance(filters: AnalyticsFilters): Promise<ServicePerformance> {
  const { startDate, endDate } = filters;

  // Get all services first
  const { data: allServices } = await supabase
    .from('services')
    .select('id, title_sv, rot_eligible, rut_eligible')
    .eq('is_active', true);

  // Get invoices with line items
  const { data: invoices } = await supabase
    .from('invoices')
    .select('line_items, total_amount')
    .eq('status', 'paid')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const serviceMap = new Map();

  // Initialize services
  allServices?.forEach((service) => {
    serviceMap.set(service.id, {
      id: service.id,
      title: service.title_sv || service.id,
      bookingCount: 0,
      revenue: 0,
      rotEligible: service.rot_eligible || false,
      rutEligible: service.rut_eligible || false,
    });
  });

  // Aggregate from invoices
  invoices?.forEach((invoice) => {
    const lineItems = invoice.line_items as any[];
    if (!Array.isArray(lineItems)) return;

    lineItems.forEach((item: any) => {
      const serviceId = item.service_id || 'other';
      if (serviceMap.has(serviceId)) {
        const data = serviceMap.get(serviceId);
        data.bookingCount += item.quantity || 1;
        data.revenue += Number(item.total || 0);
      }
    });
  });

  const services = Array.from(serviceMap.values()).map((s) => ({
    ...s,
    avgPrice: s.bookingCount > 0 ? s.revenue / s.bookingCount : 0,
  }));

  services.sort((a, b) => b.revenue - a.revenue);

  return { services };
}

// Traffic Analytics
export async function fetchTrafficAnalytics(filters: AnalyticsFilters): Promise<TrafficAnalytics> {
  const { startDate, endDate } = filters;

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'page_view')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    console.error('fetchTrafficAnalytics error:', error);
    return {
      totalPageViews: 0,
      uniqueVisitors: 0,
      bySource: [],
      topPages: [],
    };
  }

  const totalPageViews = events?.length || 0;
  const uniqueVisitors = new Set(events?.map((e) => e.session_id)).size;

  const sourceMap = new Map();
  const pageMap = new Map();

  events?.forEach((event) => {
    const data = event.event_data as any;
    const source = data?.utm_source || 'direct';

    if (!sourceMap.has(source)) {
      sourceMap.set(source, { source, visits: 0, conversions: 0 });
    }
    sourceMap.get(source).visits += 1;

    const url = event.page_url || '';
    if (!pageMap.has(url)) {
      pageMap.set(url, { url, views: 0, totalDuration: 0 });
    }
    pageMap.get(url).views += 1;
    pageMap.get(url).totalDuration += data?.duration || 0;
  });

  // Get conversions per source
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  leads?.forEach((lead) => {
    const source = (lead as any).utm_source || 'direct';
    if (sourceMap.has(source)) {
      sourceMap.get(source).conversions += 1;
    }
  });

  const bySource = Array.from(sourceMap.values()).map((s) => ({
    ...s,
    conversionRate: s.visits > 0 ? (s.conversions / s.visits) * 100 : 0,
  }));

  const topPages = Array.from(pageMap.values())
    .map((p) => ({
      url: p.url,
      views: p.views,
      avgDuration: p.views > 0 ? p.totalDuration / p.views : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    totalPageViews,
    uniqueVisitors,
    bySource,
    topPages,
  };
}

// Conversion Funnel
export async function fetchConversionFunnel(filters: AnalyticsFilters): Promise<ConversionFunnel> {
  const { startDate, endDate } = filters;

  const { data: pageViews, error: pvError } = await supabase
    .from('events')
    .select('id')
    .eq('event_type', 'page_view')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (pvError) {
    console.error('fetchConversionFunnel error:', pvError);
    return {
      stages: [
        { stage: 'Sidbesök', count: 0, dropoffRate: 0 },
        { stage: 'Lead', count: 0, dropoffRate: 0 },
        { stage: 'Bokning', count: 0, dropoffRate: 0 },
        { stage: 'Faktura', count: 0, dropoffRate: 0 },
        { stage: 'Betald', count: 0, dropoffRate: 0 },
      ],
    };
  }

  const { data: leads } = await supabase
    .from('leads')
    .select('id')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const { data: quotes } = await supabase
    .from('quotes')
    .select('id')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .is('deleted_at', null);

  const { data: invoices } = await supabase
    .from('invoices')
    .select('id')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const { data: paidInvoices } = await supabase
    .from('invoices')
    .select('id')
    .eq('status', 'paid')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const pvCount = pageViews?.length || 0;
  const leadCount = leads?.length || 0;
  const quoteCount = quotes?.length || 0;
  const invoiceCount = invoices?.length || 0;
  const paidCount = paidInvoices?.length || 0;

  return {
    stages: [
      {
        stage: 'Sidbesök',
        count: pvCount,
        dropoffRate: 0,
      },
      {
        stage: 'Lead',
        count: leadCount,
        dropoffRate: pvCount > 0 ? ((pvCount - leadCount) / pvCount) * 100 : 0,
      },
      {
        stage: 'Offert',
        count: quoteCount,
        dropoffRate: leadCount > 0 ? ((leadCount - quoteCount) / leadCount) * 100 : 0,
      },
      {
        stage: 'Faktura',
        count: invoiceCount,
        dropoffRate: quoteCount > 0 ? ((quoteCount - invoiceCount) / quoteCount) * 100 : 0,
      },
      {
        stage: 'Betald',
        count: paidCount,
        dropoffRate: invoiceCount > 0 ? ((invoiceCount - paidCount) / invoiceCount) * 100 : 0,
      },
    ],
  };
}

// Timeline data for charts
export async function fetchRevenueTimeline(filters: AnalyticsFilters) {
  const { startDate, endDate } = filters;

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      created_at,
      total_amount,
      customers:customer_id(customer_type)
    `)
    .eq('status', 'paid')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at');

  if (error) {
    console.error('fetchRevenueTimeline error:', error);
    return [];
  }

  const timelineMap = new Map();

  data?.forEach((inv) => {
    const date = inv.created_at.split('T')[0];
    const type = (inv.customers as any)?.customer_type || 'private';

    if (!timelineMap.has(date)) {
      timelineMap.set(date, {
        date,
        total: 0,
        company: 0,
        private: 0,
        brf: 0,
      });
    }

    const entry = timelineMap.get(date);
    entry.total += Number(inv.total_amount || 0);
    entry[type] += Number(inv.total_amount || 0);
  });

  return Array.from(timelineMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

// Top Customers
export async function fetchTopCustomers(filters: AnalyticsFilters, limit = 10) {
  const { startDate, endDate } = filters;

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      customer_id,
      total_amount,
      created_at,
      customers:customer_id(customer_type, name, company_name, brf_name, email)
    `)
    .eq('status', 'paid')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('total_amount', { ascending: false })
    .limit(limit * 3);

  if (error) {
    console.error('fetchTopCustomers error:', error);
    return [];
  }

  const customerMap = new Map();

  data?.forEach((inv) => {
    const customer = inv.customers as any;
    // Skip if no customer_id
    if (!inv.customer_id) return;

    if (!customerMap.has(inv.customer_id)) {
      customerMap.set(inv.customer_id, {
        id: inv.customer_id,
        name: customer?.company_name || customer?.brf_name || customer?.name || customer?.email || 'Okänd kund',
        type: customer?.customer_type || 'private',
        bookingCount: 0,
        totalSpent: 0,
        lastBooking: inv.created_at,
      });
    }

    const entry = customerMap.get(inv.customer_id);
    entry.bookingCount += 1;
    entry.totalSpent += Number(inv.total_amount || 0);
    if (inv.created_at > entry.lastBooking) {
      entry.lastBooking = inv.created_at;
    }
  });

  return Array.from(customerMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}

// Fetch quote pipeline data
export async function fetchQuotePipeline(filters: AnalyticsFilters): Promise<QuotePipeline> {
  console.log('fetchQuotePipeline called with filters:', filters);

  const query = supabase
    .from('quotes_new')
    .select(`
      *,
      invoices!left(id, status)
    `)
    .is('deleted_at', null);

  // Apply date filters
  if (filters.startDate) {
    query.gte('created_at', filters.startDate);
  }
  if (filters.endDate) {
    query.lte('created_at', filters.endDate);
  }

  const { data: quotes, error } = await query;

  if (error) {
    console.error('Error fetching quote pipeline:', error);
    throw error;
  }

  console.log('Raw quotes data:', quotes);

  // Categorize quotes
  const pending = quotes?.filter(q => ['draft', 'sent'].includes(q.status || '')) || [];
  const accepted = quotes?.filter(q => q.status === 'accepted') || [];
  const declined = quotes?.filter(q => q.status === 'declined') || [];
  
  // Accepted quotes without invoices
  const awaitingInvoice = accepted.filter(q => {
    const invoices = Array.isArray(q.invoices) ? q.invoices : (q.invoices ? [q.invoices] : []);
    return invoices.length === 0;
  });

  // Calculate totals
  const pendingTotal = pending.reduce((sum, q) => sum + (Number(q.total_sek) || 0), 0);
  const acceptedTotal = accepted.reduce((sum, q) => sum + (Number(q.total_sek) || 0), 0);
  const awaitingInvoiceTotal = awaitingInvoice.reduce((sum, q) => sum + (Number(q.total_sek) || 0), 0);
  const declinedTotal = declined.reduce((sum, q) => sum + (Number(q.total_sek) || 0), 0);

  // Calculate conversion rate (accepted / total non-pending)
  const totalQuotes = quotes?.length || 0;
  const conversionRate = totalQuotes > 0 ? (accepted.length / totalQuotes) * 100 : 0;

  // Pipeline total = pending + awaiting invoice
  const pipelineTotal = pendingTotal + awaitingInvoiceTotal;

  const result = {
    pending: {
      count: pending.length,
      totalAmount: pendingTotal,
    },
    accepted: {
      count: accepted.length,
      totalAmount: acceptedTotal,
    },
    awaitingInvoice: {
      count: awaitingInvoice.length,
      totalAmount: awaitingInvoiceTotal,
    },
    declined: {
      count: declined.length,
      totalAmount: declinedTotal,
    },
    conversionRate,
    pipelineTotal,
  };

  console.log('Quote pipeline result:', result);
  return result;
}

// Export CSV
export function exportAnalyticsCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    ),
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}
