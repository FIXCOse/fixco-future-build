import { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCalendar } from '@/components/schedule/JobCalendar';
import { JobLockDialog } from '@/components/schedule/JobLockDialog';
import { WorkerKPICards } from '@/components/admin/statistics/WorkerKPICards';
import { PerformanceLeaderboard } from '@/components/admin/statistics/PerformanceLeaderboard';
import { TimeAnalysisPanel } from '@/components/admin/statistics/TimeAnalysisPanel';
import { TrendChartsPanel } from '@/components/admin/statistics/TrendChartsPanel';
import { WorkPatternAnalysis } from '@/components/admin/statistics/WorkPatternAnalysis';
import { ServiceSpecializationPanel } from '@/components/admin/statistics/ServiceSpecializationPanel';
import { useJobsData } from '@/hooks/useJobsData';
import { useScheduleRealtime } from '@/hooks/useScheduleRealtime';
import { 
  updateJobSchedule, 
  lockJob, 
  unlockJob, 
  fetchWorkerStatistics,
  fetchWorkerDetailedStatistics,
  fetchWorkerDailyStats,
  checkJobLocked,
  type WorkerStatistic,
  type WorkerDetailedStatistic,
  type WorkerDailyStat 
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
  const [detailedStats, setDetailedStats] = useState<WorkerDetailedStatistic[]>([]);
  const [dailyStats, setDailyStats] = useState<WorkerDailyStat[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
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
    fetchWorkerDetailedStatistics().then(setDetailedStats);
  }, [refreshKey]);

  useEffect(() => {
    fetchWorkerDailyStats(timeRange).then(setDailyStats);
  }, [timeRange, refreshKey]);

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

      <WorkerKPICards statistics={detailedStats} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📊 Översikt</TabsTrigger>
          <TabsTrigger value="trends">📈 Trender</TabsTrigger>
          <TabsTrigger value="patterns">🗓️ Mönster</TabsTrigger>
          <TabsTrigger value="services">🔧 Tjänster</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <PerformanceLeaderboard statistics={detailedStats} />
            <TimeAnalysisPanel statistics={detailedStats} />
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <TrendChartsPanel
            statistics={detailedStats}
            dailyStats={dailyStats}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </TabsContent>

        <TabsContent value="patterns">
          <WorkPatternAnalysis statistics={detailedStats} />
        </TabsContent>

        <TabsContent value="services">
          <ServiceSpecializationPanel
            statistics={detailedStats}
            onServiceFilter={(workerId) => {
              setSelectedWorkerId(workerId);
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="bg-card rounded-lg border p-4">
        <h2 className="text-xl font-bold mb-4">Kalender</h2>
        <JobCalendar 
          jobs={displayedJobs}
          onJobMove={handleJobMove}
          onJobClick={handleJobClick}
          isAdmin={true}
        />
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
