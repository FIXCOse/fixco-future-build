-- Add properties table for address management
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'private' CHECK (type IN ('private', 'organization')),
  label TEXT,
  street TEXT NOT NULL,
  postcode CHAR(5) NOT NULL,
  city TEXT NOT NULL,
  unit TEXT,
  notes TEXT,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Ensure property ownership is clear
  CONSTRAINT property_owner_check CHECK (
    (type = 'private' AND owner_id IS NOT NULL AND organization_id IS NULL) OR 
    (type = 'organization' AND owner_id IS NULL AND organization_id IS NOT NULL)
  )
);

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Add default_property_id to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS default_property_id UUID REFERENCES public.properties(id);

-- Add settings jsonb column to organizations if it doesn't exist
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Update bookings table to include property and address snapshots
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id),
ADD COLUMN IF NOT EXISTS contact_snapshot JSONB,
ADD COLUMN IF NOT EXISTS address_snapshot JSONB;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_organization_id ON public.properties(organization_id);
CREATE INDEX IF NOT EXISTS idx_properties_postcode ON public.properties(postcode);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings(property_id);

-- RLS policies for properties
CREATE POLICY "properties_select_own_or_org_member" 
ON public.properties 
FOR SELECT 
USING (
  (type = 'private' AND owner_id = auth.uid()) OR
  (type = 'organization' AND organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "properties_insert_own_or_org_admin" 
ON public.properties 
FOR INSERT 
WITH CHECK (
  (type = 'private' AND owner_id = auth.uid()) OR
  (type = 'organization' AND organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'beställare')
  ))
);

CREATE POLICY "properties_update_own_or_org_admin" 
ON public.properties 
FOR UPDATE 
USING (
  (type = 'private' AND owner_id = auth.uid()) OR
  (type = 'organization' AND organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'beställare')
  ))
);

CREATE POLICY "properties_delete_own_or_org_admin" 
ON public.properties 
FOR DELETE 
USING (
  (type = 'private' AND owner_id = auth.uid()) OR
  (type = 'organization' AND organization_id IN (
    SELECT organization_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'beställare')
  ))
);

-- Add trigger for updated_at
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();