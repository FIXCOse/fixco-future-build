import { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { JobCalendar } from '@/components/schedule/JobCalendar';
import { ScheduleNotifications } from '@/components/schedule/ScheduleNotifications';
import { useJobsData } from '@/hooks/useJobsData';
import { useAuth } from '@/hooks/useAuth';
import { useScheduleRealtime } from '@/hooks/useScheduleRealtime';
import { updateJobSchedule } from '@/lib/api/schedule';
import { toast } from 'sonner';

export default function WorkerSchedule() {
  const { user } = useAuth();
  const { jobs, loading } = useJobsData();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const myJobs = jobs.filter(j => j.assigned_worker_id === user?.id);

  const handleRefetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useScheduleRealtime(handleRefetch);

  const handleJobMove = async (jobId: string, newStart: Date, newEnd: Date) => {
    try {
      await updateJobSchedule(jobId, newStart, newEnd);
      toast.success('Jobb flyttat!');
      handleRefetch();
    } catch (error: any) {
      if (error.message?.includes('locked')) {
        toast.error('Jobbet är låst av admin och kan inte flyttas');
      } else if (error.message?.includes('already booked')) {
        toast.error('Du har redan ett jobb bokat vid denna tid');
      } else {
        toast.error('Kunde inte flytta jobb');
      }
      console.error('Failed to move job:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Laddar schema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Min Schema</h1>
        </div>
        <ScheduleNotifications />
      </div>

      <div className="bg-card rounded-lg border p-4">
        <JobCalendar 
          jobs={myJobs}
          workerId={user?.id}
          onJobMove={handleJobMove}
          onJobClick={setSelectedJob}
        />
      </div>

      {myJobs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Du har inga jobb tilldelade än.</p>
          <p className="text-sm">Gå till jobbpoolen för att plocka jobb.</p>
        </div>
      )}
    </div>
  );
}
