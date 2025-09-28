-- Create content management table
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  value JSONB,
  styles JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Everyone can read content (for displaying on the website)
CREATE POLICY "Anyone can view site content" 
ON public.site_content 
FOR SELECT 
USING (true);

-- Only admins can insert/update/delete content
CREATE POLICY "Only admins can create content" 
ON public.site_content 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE role IN ('admin', 'owner')
  )
);

CREATE POLICY "Only admins can update content" 
ON public.site_content 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE role IN ('admin', 'owner')
  )
);

CREATE POLICY "Only admins can delete content" 
ON public.site_content 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE role IN ('admin', 'owner')
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_site_content_updated_at();

-- Create index for faster content lookups
CREATE INDEX idx_site_content_content_id ON public.site_content(content_id);
CREATE INDEX idx_site_content_type ON public.site_content(content_type);