import { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { JobCalendar } from '@/components/schedule/JobCalendar';
import { WorkerStatisticsPanel } from '@/components/admin/WorkerStatisticsPanel';
import { JobLockDialog } from '@/components/schedule/JobLockDialog';
import { useJobsData } from '@/hooks/useJobsData';
import { useScheduleRealtime } from '@/hooks/useScheduleRealtime';
import { 
  updateJobSchedule, 
  lockJob, 
  unlockJob, 
  fetchWorkerStatistics,
  checkJobLocked,
  type WorkerStatistic 
} from '@/lib/api/schedule';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminSchedule() {
  const { jobs, loading } = useJobsData();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('all');
  const [statistics, setStatistics] = useState<WorkerStatistic[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [selectedJobLocked, setSelectedJobLocked] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const displayedJobs = selectedWorkerId === 'all'
    ? jobs
    : jobs.filter(j => j.assigned_worker_id === selectedWorkerId);

  const handleRefetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useScheduleRealtime(handleRefetch);

  useEffect(() => {
    fetchWorkerStatistics().then(setStatistics);
  }, []);

  const handleJobMove = async (jobId: string, newStart: Date, newEnd: Date) => {
    try {
      await updateJobSchedule(jobId, newStart, newEnd);
      toast.success('Jobb schemalagt!');
      handleRefetch();
    } catch (error: any) {
      if (error.message?.includes('already booked')) {
        toast.error('Workern har redan ett jobb vid denna tid');
      } else {
        toast.error('Kunde inte schemalägga jobb');
      }
      console.error('Failed to move job:', error);
    }
  };

  const handleJobClick = async (job: any) => {
    setSelectedJob(job);
    const locked = await checkJobLocked(job.id);
    setSelectedJobLocked(locked);
    setLockDialogOpen(true);
  };

  const handleLock = async (reason: string) => {
    if (!selectedJob) return;
    try {
      await lockJob(selectedJob.id, reason);
      toast.success('Jobb låst');
      handleRefetch();
    } catch (error) {
      toast.error('Kunde inte låsa jobb');
      console.error('Failed to lock job:', error);
    }
  };

  const handleUnlock = async () => {
    if (!selectedJob) return;
    try {
      await unlockJob(selectedJob.id);
      toast.success('Jobb upplåst');
      handleRefetch();
    } catch (error) {
      toast.error('Kunde inte låsa upp jobb');
      console.error('Failed to unlock job:', error);
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
          <h1 className="text-2xl font-bold">Schema - Alla Workers</h1>
        </div>
        <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filtrera worker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla workers</SelectItem>
            {statistics.map(w => (
              <SelectItem key={w.id} value={w.id}>
                {w.first_name} {w.last_name} ({w.total_jobs} jobb)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg border p-4">
          <JobCalendar 
            jobs={displayedJobs}
            onJobMove={handleJobMove}
            onJobClick={handleJobClick}
            isAdmin={true}
          />
        </div>
        <div>
          <WorkerStatisticsPanel statistics={statistics} />
        </div>
      </div>

      {selectedJob && (
        <JobLockDialog
          open={lockDialogOpen}
          onOpenChange={setLockDialogOpen}
          jobTitle={selectedJob.title}
          isLocked={selectedJobLocked}
          onLock={handleLock}
          onUnlock={handleUnlock}
        />
      )}
    </div>
  );
}
