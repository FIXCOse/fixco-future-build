-- Add org_no column to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS org_no text;

-- Create unique index on normalized org number (removing non-digits)
CREATE UNIQUE INDEX IF NOT EXISTS organizations_org_no_unique
ON public.organizations ((regexp_replace(org_no, '\D', '', 'g')))
WHERE org_no IS NOT NULL;

-- Function to require org_no for companies and BRF
CREATE OR REPLACE FUNCTION public.require_org_no_for_org()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.type IN ('company','brf') AND COALESCE(NEW.org_no, '') = '' THEN
    RAISE EXCEPTION 'org_no is required for organization type %', NEW.type;
  END IF;
  RETURN NEW;
END;
$$;

-- Drop and create trigger for org_no requirement
DROP TRIGGER IF EXISTS trg_require_org_no_for_org ON public.organizations;
CREATE TRIGGER trg_require_org_no_for_org
  BEFORE INSERT OR UPDATE ON public.organizations
  FOR EACH ROW 
  EXECUTE FUNCTION public.require_org_no_for_org();