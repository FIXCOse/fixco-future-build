import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export interface JobRequest {
  id: string;
  job_id: string;
  worker_id: string; // Changed from staff_id - now uses user_id (auth.uid())
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  expires_at: string;
  requested_at: string;
  responded_at?: string;
  jobs: {
    id: string;
    title: string;
    description?: string;
    address?: string;
    city?: string;
    bonus_amount?: number;
    estimated_hours?: number;
  };
}

export function useJobRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchMyRequests = async (): Promise<JobRequest[]> => {
    try {
      // Get current user - using auth.uid() directly (standardized worker_id)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch job requests for this worker using user_id directly
      const { data, error } = await supabase
        .from('job_requests')
        .select(`
          *,
          jobs (
            id, title, description, address, city,
            bonus_amount, estimated_hours
          )
        `)
        .eq('worker_id', user.id) // Now uses user_id directly
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Error fetching job requests:', error);
        return [];
      }

      return data as JobRequest[];
    } catch (error) {
      console.error('Error in fetchMyRequests:', error);
      return [];
    }
  };

  const acceptRequest = async (requestId: string, jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update request status to accepted
      const { error: updateError } = await supabase
        .from('job_requests')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Assign the job to this worker
      const { error: assignError } = await supabase
        .from('job_workers')
        .insert({
          job_id: jobId,
          worker_id: user.id,
          is_lead: true,
          assigned_at: new Date().toISOString()
        });

      if (assignError) throw assignError;

      // Update job status to assigned
      const { error: jobError } = await supabase
        .from('jobs')
        .update({
          status: 'assigned',
          assigned_worker_id: user.id,
          assigned_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (jobError) throw jobError;

      // Expire other pending requests for this job
      await supabase
        .from('job_requests')
        .update({ status: 'expired' })
        .eq('job_id', jobId)
        .eq('status', 'pending')
        .neq('id', requestId);

      toast({
        title: "Jobbförfrågan accepterad!",
        description: "Jobbet har tilldelats till dig. Du kan se det under 'Mina jobb'."
      });

      queryClient.invalidateQueries({ queryKey: ['job-requests'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });

      return true;
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Fel",
        description: "Kunde inte acceptera jobbförfrågan",
        variant: "destructive"
      });
      return false;
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('job_requests')
        .update({
          status: 'rejected',
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Jobbförfrågan avslagen",
        description: "Du har tackat nej till denna jobbförfrågan."
      });

      queryClient.invalidateQueries({ queryKey: ['job-requests'] });

      return true;
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Fel",
        description: "Kunde inte avslå jobbförfrågan",
        variant: "destructive"
      });
      return false;
    }
  };

  return { fetchMyRequests, acceptRequest, rejectRequest };
}
