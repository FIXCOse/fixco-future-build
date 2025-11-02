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

export type WorkerDetailedStatistic = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  total_jobs: number;
  completed_jobs: number;
  jobs_last_30_days: number;
  jobs_last_7_days: number;
  completion_rate_percent: number;
  avg_job_hours: number | null;
  fastest_job_hours: number | null;
  longest_job_hours: number | null;
  jobs_monday: number;
  jobs_tuesday: number;
  jobs_wednesday: number;
  jobs_thursday: number;
  jobs_friday: number;
  jobs_saturday: number;
  jobs_sunday: number;
  current_streak_days: number;
  last_job_at: string | null;
  top_services: Array<{
    service_id: string;
    service_name: string;
    count: number;
    success_rate: number;
  }> | null;
  earnings_last_30_days: number;
  overtime_jobs: number;
};

export type WorkerDailyStat = {
  worker_id: string;
  date: string;
  jobs_completed: number;
  total_hours: number;
  total_earnings: number;
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

export interface WorkerPerformance {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  total_claimed: number;
  total_completed: number;
  total_returned: number;
  completion_rate: number;
  return_reasons: string[];
  avg_time_held_minutes: number;
}

export async function fetchWorkerPerformanceStats(): Promise<WorkerPerformance[]> {
  // Refresh stats first
  await supabase.rpc('refresh_worker_stats');
  
  const { data, error } = await supabase
    .from('worker_performance_stats')
    .select('*')
    .order('completion_rate', { ascending: false });
    
  if (error) throw error;
  return data;
}

export interface JobClaimEvent {
  id: string;
  job_id: string;
  actor: string;
  event: string;
  meta: any;
  created_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export async function fetchWorkerDetailedStatistics(): Promise<WorkerDetailedStatistic[]> {
  const { data, error } = await supabase
    .from('worker_detailed_statistics')
    .select('*')
    .order('completed_jobs', { ascending: false });

  if (error) {
    console.error('Error fetching detailed worker statistics:', error);
    throw error;
  }

  return (data as any) || [];
}

export async function fetchWorkerDailyStats(timeRange: '7d' | '30d' | '90d'): Promise<WorkerDailyStat[]> {
  const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
  const days = daysMap[timeRange];
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('worker_daily_stats')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching worker daily stats:', error);
    throw error;
  }

  return (data as any) || [];
}

export async function updateDailyStats(): Promise<void> {
  const { error } = await supabase.rpc('update_worker_daily_stats');
  
  if (error) {
    console.error('Error updating daily stats:', error);
    throw error;
  }
}

export async function fetchJobClaimHistory(jobId: string): Promise<JobClaimEvent[]> {
  const { data, error } = await supabase
    .from('job_events')
    .select(`
      *,
      profiles!job_events_actor_fkey (
        first_name,
        last_name,
        email
      )
    `)
    .eq('job_id', jobId)
    .in('event', ['job.claimed', 'job.returned_to_pool', 'job.completed', 'job.assigned'])
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return (data as unknown) as JobClaimEvent[];
}
