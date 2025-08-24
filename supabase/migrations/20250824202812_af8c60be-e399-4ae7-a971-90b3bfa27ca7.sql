-- Add project status tracking to quotes table
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS project_status text DEFAULT 'pending';
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS project_started_at timestamp with time zone;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS project_completed_at timestamp with time zone;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS project_notes text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS project_images jsonb DEFAULT '[]';
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS publish_as_reference boolean DEFAULT false;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS reference_data jsonb;

-- Add invoice statistics tracking
CREATE OR REPLACE FUNCTION get_invoice_statistics()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_invoices', COUNT(*),
    'draft_count', COUNT(*) FILTER (WHERE status = 'draft'),
    'sent_count', COUNT(*) FILTER (WHERE status = 'sent'), 
    'paid_count', COUNT(*) FILTER (WHERE status = 'paid'),
    'overdue_count', COUNT(*) FILTER (WHERE status = 'overdue'),
    'total_amount', COALESCE(SUM(total_amount), 0),
    'paid_amount', COALESCE(SUM(total_amount) FILTER (WHERE status = 'paid'), 0),
    'pending_amount', COALESCE(SUM(total_amount) FILTER (WHERE status IN ('sent', 'overdue')), 0),
    'overdue_amount', COALESCE(SUM(total_amount) FILTER (WHERE status = 'overdue'), 0)
  ) INTO result
  FROM invoices;
  
  RETURN result;
END;
$$;