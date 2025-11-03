import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useJobManagement() {
  const addToPool = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'pool', pool_enabled: true })
        .eq('id', jobId);

      if (error) throw error;
      toast.success('Jobbet har lagts till i arbetspoolen');
      return true;
    } catch (error) {
      console.error('Error adding to pool:', error);
      toast.error('Kunde inte lägga till i pool');
      return false;
    }
  };

  const removeFromPool = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ pool_enabled: false, status: 'assigned' })
        .eq('id', jobId);

      if (error) throw error;
      toast.success('Jobbet har tagits bort från poolen');
      return true;
    } catch (error) {
      console.error('Error removing from pool:', error);
      toast.error('Kunde inte ta bort från pool');
      return false;
    }
  };

  const assignWorker = async (jobId: string, workerId: string, isLead: boolean = false) => {
    try {
      const { error } = await supabase
        .from('job_workers')
        .insert({ 
          job_id: jobId, 
          worker_id: workerId, 
          is_lead: isLead,
          status: 'assigned'
        });

      if (error) throw error;
      toast.success('Worker tilldelad');
      return true;
    } catch (error: any) {
      if (error?.code === '23505') {
        toast.error('Worker är redan tilldelad detta jobb');
      } else {
        console.error('Error assigning worker:', error);
        toast.error('Kunde inte tilldela worker');
      }
      return false;
    }
  };

  const removeWorker = async (jobId: string, workerId: string) => {
    try {
      const { error } = await supabase
        .from('job_workers')
        .update({ status: 'removed' })
        .eq('job_id', jobId)
        .eq('worker_id', workerId);

      if (error) throw error;
      toast.success('Worker borttagen');
      return true;
    } catch (error) {
      console.error('Error removing worker:', error);
      toast.error('Kunde inte ta bort worker');
      return false;
    }
  };

  const requestWorkers = async (jobId: string, workerIds: string[], message?: string) => {
    try {
      const { error } = await supabase.functions.invoke('request-workers-for-job', {
        body: { jobId, workerIds, message }
      });

      if (error) throw error;
      toast.success('Förfrågningar skickade');
      return true;
    } catch (error) {
      console.error('Error requesting workers:', error);
      toast.error('Kunde inte skicka förfrågningar');
      return false;
    }
  };

  const updateJobDetails = async (jobId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId);

      if (error) throw error;
      toast.success('Jobb uppdaterat');
      return true;
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Kunde inte uppdatera jobb');
      return false;
    }
  };

  const addWorkerToJob = async (jobId: string, workerId: string, isLead: boolean = false) => {
    return await assignWorker(jobId, workerId, isLead);
  };

  const removeWorkerFromJob = async (jobId: string, workerId: string) => {
    return await removeWorker(jobId, workerId);
  };

  const setJobBonus = async (jobId: string, bonusAmount: number) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ bonus_amount: bonusAmount })
        .eq('id', jobId);

      if (error) throw error;
      toast.success('Bonus uppdaterad');
      return true;
    } catch (error) {
      console.error('Error setting bonus:', error);
      toast.error('Kunde inte sätta bonus');
      return false;
    }
  };

  return { 
    addToPool, 
    removeFromPool, 
    assignWorker, 
    removeWorker,
    requestWorkers,
    updateJobDetails,
    addWorkerToJob,
    removeWorkerFromJob,
    setJobBonus,
  };
}
