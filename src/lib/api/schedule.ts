import { supabase } from '@/integrations/supabase/client';

export type ScheduledJob = {
  id: string;
  title: string;
  start_scheduled_at: string;
  due_date: string;
  assigned_worker_id: string;
  status: string;
  address?: string;
  city?: string;
  locked?: boolean;
};

export type ScheduleNotification = {
  id: string;
  job_id: string;
  worker_id: string;
  scheduled_by: string;
  scheduled_at: string;
  read: boolean;
  created_at: string;
  jobs?: {
    title: string;
    address?: string;
    start_scheduled_at: string;
  };
};

export type WorkerStatistic = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  total_jobs: number;
  completed_jobs: number;
  jobs_last_30_days: number;
  avg_job_duration_hours: number;
};

export async function updateJobSchedule(
  jobId: string, 
  startTime: Date, 
  endTime: Date
): Promise<void> {
  const { error } = await supabase.rpc('update_job_schedule', {
    p_job_id: jobId,
    p_start_time: startTime.toISOString(),
    p_end_time: endTime.toISOString()
  });
  
  if (error) throw error;
}

export async function lockJob(jobId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from('job_locks')
    .insert({ 
      job_id: jobId, 
      locked_by: (await supabase.auth.getUser()).data.user?.id as string,
      reason 
    });
  
  if (error) throw error;
}

export async function unlockJob(jobId: string): Promise<void> {
  const { error } = await supabase
    .from('job_locks')
    .delete()
    .eq('job_id', jobId);
  
  if (error) throw error;
}

export async function fetchScheduleNotifications(): Promise<ScheduleNotification[]> {
  const { data, error } = await supabase
    .from('job_schedule_notifications')
    .select('*, jobs(title, address, start_scheduled_at)')
    .eq('read', false)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('job_schedule_notifications')
    .update({ read: true })
    .eq('id', notificationId);
  
  if (error) throw error;
}

export async function fetchWorkerStatistics(): Promise<WorkerStatistic[]> {
  const { data, error } = await supabase
    .from('worker_statistics')
    .select('*')
    .order('total_jobs', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function checkJobLocked(jobId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('job_locks')
    .select('id')
    .eq('job_id', jobId)
    .maybeSingle();
  
  if (error) throw error;
  return !!data;
}
