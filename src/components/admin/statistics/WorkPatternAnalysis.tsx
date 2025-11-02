import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from 'lucide-react';
import { type WorkerDetailedStatistic } from '@/lib/api/schedule';

interface WorkPatternAnalysisProps {
  statistics: WorkerDetailedStatistic[];
}

export function WorkPatternAnalysis({ statistics }: WorkPatternAnalysisProps) {
  const weekdays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count < 3) return 'bg-green-200 dark:bg-green-900/30';
    if (count < 6) return 'bg-green-400 dark:bg-green-700/50';
    if (count < 10) return 'bg-green-600 dark:bg-green-600/70';
    return 'bg-green-800 dark:bg-green-500';
  };

  const getMostActiveDay = (worker: WorkerDetailedStatistic) => {
    const days = [
      worker.jobs_monday,
      worker.jobs_tuesday,
      worker.jobs_wednesday,
      worker.jobs_thursday,
      worker.jobs_friday,
      worker.jobs_saturday,
      worker.jobs_sunday,
    ];
    const maxJobs = Math.max(...days);
    const dayIndex = days.indexOf(maxJobs);
    return { day: weekdays[dayIndex], count: maxJobs };
  };

  // Calculate totals per day
  const totals = statistics.reduce(
    (acc, worker) => ({
      monday: acc.monday + worker.jobs_monday,
      tuesday: acc.tuesday + worker.jobs_tuesday,
      wednesday: acc.wednesday + worker.jobs_wednesday,
      thursday: acc.thursday + worker.jobs_thursday,
      friday: acc.friday + worker.jobs_friday,
      saturday: acc.saturday + worker.jobs_saturday,
      sunday: acc.sunday + worker.jobs_sunday,
      overtime: acc.overtime + worker.overtime_jobs,
    }),
    { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0, overtime: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Arbetsmönster per Veckodag
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              {weekdays.map((day) => (
                <TableHead key={day} className="text-center">
                  {day}
                </TableHead>
              ))}
              <TableHead className="text-right">Övertid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  Ingen data tillgänglig
                </TableCell>
              </TableRow>
            ) : (
              <>
                {statistics.map((worker) => {
                  const mostActive = getMostActiveDay(worker);
                  
                  return (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{worker.first_name} {worker.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Mest: {mostActive.day} ({mostActive.count})
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getIntensityColor(worker.jobs_monday)}`}>
                          {worker.jobs_monday || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getIntensityColor(worker.jobs_tuesday)}`}>
                          {worker.jobs_tuesday || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getIntensityColor(worker.jobs_wednesday)}`}>
                          {worker.jobs_wednesday || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getIntensityColor(worker.jobs_thursday)}`}>
                          {worker.jobs_thursday || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getIntensityColor(worker.jobs_friday)}`}>
                          {worker.jobs_friday || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getIntensityColor(worker.jobs_saturday)}`}>
                          {worker.jobs_saturday || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${getIntensityColor(worker.jobs_sunday)}`}>
                          {worker.jobs_sunday || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {worker.overtime_jobs}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-center">{totals.monday}</TableCell>
                  <TableCell className="text-center">{totals.tuesday}</TableCell>
                  <TableCell className="text-center">{totals.wednesday}</TableCell>
                  <TableCell className="text-center">{totals.thursday}</TableCell>
                  <TableCell className="text-center">{totals.friday}</TableCell>
                  <TableCell className="text-center">{totals.saturday}</TableCell>
                  <TableCell className="text-center">{totals.sunday}</TableCell>
                  <TableCell className="text-right">{totals.overtime}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
