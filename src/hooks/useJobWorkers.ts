import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JobWorker {
  job_id: string;
  worker_id: string;
  is_lead: boolean;
  status: 'assigned' | 'active' | 'completed' | 'removed';
  total_hours: number;
  time_entries: number;
  worker_name?: string;
  worker_email?: string;
}

export function useJobWorkers(jobId?: string) {
  const [workers, setWorkers] = useState<JobWorker[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadWorkers = async () => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch job with estimated_hours
      const { data: job } = await supabase
        .from('jobs')
        .select('estimated_hours')
        .eq('id', jobId)
        .single();
      
      setEstimatedHours(job?.estimated_hours || 0);

      // Fetch workers with their hours
      const { data: workerData } = await supabase
        .from('job_worker_hours')
        .select('*')
        .eq('job_id', jobId);

      // Fetch worker profiles
      if (workerData && workerData.length > 0) {
        const workerIds = workerData.map((w: any) => w.worker_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', workerIds);

        const enrichedWorkers = workerData.map((w: any) => {
          const profile = profiles?.find((p) => p.id === w.worker_id);
          return {
            ...w,
            worker_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Okänd',
            worker_email: profile?.email || '',
          };
        });

        setWorkers(enrichedWorkers);
        setTotalHours(enrichedWorkers.reduce((sum, w) => sum + (w.total_hours || 0), 0));
      } else {
        setWorkers([]);
        setTotalHours(0);
      }
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, [jobId]);

  return { workers, totalHours, estimatedHours, loading, refresh: loadWorkers };
}
