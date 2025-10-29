-- Add service_id column to jobs table
ALTER TABLE public.jobs 
ADD COLUMN service_id TEXT;

-- Add foreign key constraint to services table
ALTER TABLE public.jobs 
ADD CONSTRAINT jobs_service_id_fkey 
FOREIGN KEY (service_id) 
REFERENCES public.services(id) 
ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_jobs_service_id ON public.jobs(service_id);

-- Add comment for documentation
COMMENT ON COLUMN public.jobs.service_id IS 'Links job to a specific service for skill-based filtering';