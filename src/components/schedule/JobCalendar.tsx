import { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, addHours, isSameDay, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobEventCard } from './JobEventCard';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  start_scheduled_at: string | null;
  due_date: string | null;
  assigned_worker_id: string;
  status: string;
  address?: string;
  city?: string;
  locked?: boolean;
}

interface JobCalendarProps {
  jobs: Job[];
  workerId?: string;
  onJobMove: (jobId: string, newStart: Date, newEnd: Date) => Promise<void>;
  onJobClick?: (job: Job) => void;
  isAdmin?: boolean;
}

export function JobCalendar({ jobs, workerId, onJobMove, onJobClick, isAdmin }: JobCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const timeSlots = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => addHours(new Date().setHours(8, 0, 0, 0), i)),
    []
  );

  const scheduledJobs = useMemo(() => 
    jobs.filter(j => j.start_scheduled_at && j.due_date),
    [jobs]
  );

  const unscheduledJobs = useMemo(() => 
    jobs.filter(j => !j.start_scheduled_at || !j.due_date),
    [jobs]
  );

  const handleDragStart = (job: Job) => (e: React.DragEvent) => {
    if (job.locked && !isAdmin) {
      e.preventDefault();
      return;
    }
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (day: Date, hour: number) => {
    if (!draggedJob) return;

    const startTime = new Date(day);
    startTime.setHours(hour, 0, 0, 0);
    
    const duration = draggedJob.start_scheduled_at && draggedJob.due_date
      ? (new Date(draggedJob.due_date).getTime() - new Date(draggedJob.start_scheduled_at).getTime()) / (1000 * 60 * 60)
      : 2;
    
    const endTime = addHours(startTime, duration);

    try {
      await onJobMove(draggedJob.id, startTime, endTime);
    } catch (error) {
      console.error('Failed to move job:', error);
    } finally {
      setDraggedJob(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const getJobsForSlot = (day: Date, hour: number) => {
    return scheduledJobs.filter(job => {
      if (!job.start_scheduled_at) return false;
      const jobStart = parseISO(job.start_scheduled_at);
      return isSameDay(jobStart, day) && jobStart.getHours() === hour;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold">
          {format(weekStart, 'MMMM yyyy', { locale: sv })}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Unscheduled Jobs */}
      {unscheduledJobs.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-sm">Oschemalagda jobb</h3>
          <div className="flex flex-wrap gap-2">
            {unscheduledJobs.map(job => (
              <JobEventCard
                key={job.id}
                job={job}
                onDragStart={handleDragStart(job)}
                onClick={() => onJobClick?.(job)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 bg-muted">
          <div className="p-2 border-r font-medium text-sm">Tid</div>
          {weekDays.map((day, i) => (
            <div key={i} className="p-2 border-r last:border-r-0 text-center">
              <div className="font-medium">{format(day, 'EEE', { locale: sv })}</div>
              <div className="text-sm text-muted-foreground">{format(day, 'd MMM', { locale: sv })}</div>
            </div>
          ))}
        </div>

        {timeSlots.map((time, hourIdx) => (
          <div key={hourIdx} className="grid grid-cols-8 border-t">
            <div className="p-2 border-r bg-muted/30 text-sm font-medium">
              {format(time, 'HH:mm')}
            </div>
            {weekDays.map((day, dayIdx) => {
              const jobsInSlot = getJobsForSlot(day, time.getHours());
              return (
                <div
                  key={dayIdx}
                  className={cn(
                    "p-1 border-r last:border-r-0 min-h-[60px] transition-colors",
                    draggedJob && "hover:bg-primary/5"
                  )}
                  onDrop={() => handleDrop(day, time.getHours())}
                  onDragOver={handleDragOver}
                >
                  {jobsInSlot.map(job => (
                    <JobEventCard
                      key={job.id}
                      job={job}
                      onDragStart={handleDragStart(job)}
                      onClick={() => onJobClick?.(job)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
