import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Moon } from 'lucide-react';
import { type WorkerDetailedStatistic } from '@/lib/api/schedule';

interface WorkPatternAnalysisProps {
  statistics: WorkerDetailedStatistic[];
}

export function WorkPatternAnalysis({ statistics }: WorkPatternAnalysisProps) {
  const weekdays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];

  const getIntensityColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-muted';
    const intensity = count / maxCount;
    if (intensity > 0.7) return 'bg-primary';
    if (intensity > 0.4) return 'bg-primary/60';
    return 'bg-primary/30';
  };

  const totals = weekdays.map((_, dayIndex) => {
    return statistics.reduce((sum, w) => sum + (w.jobs_by_weekday[dayIndex.toString()] || 0), 0);
  });

  const maxCount = Math.max(...statistics.flatMap(w => 
    Object.values(w.jobs_by_weekday).map(v => Number(v) || 0)
  ));

  const getMostActiveDay = (worker: WorkerDetailedStatistic) => {
    let maxDay = 0;
    let maxJobs = 0;
    Object.entries(worker.jobs_by_weekday).forEach(([day, count]) => {
      if (Number(count) > maxJobs) {
        maxJobs = Number(count);
        maxDay = Number(day);
      }
    });
    return { day: weekdays[maxDay], jobs: maxJobs };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Arbetsmönster per veckodag
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              {weekdays.map((day, index) => (
                <TableHead key={index} className="text-center">{day}</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {worker.first_name} {worker.last_name}
                          </span>
                          {mostActive.jobs > 0 && (
                            <Badge variant="outline" className="text-xs">
                              📅 {mostActive.day}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      {weekdays.map((_, dayIndex) => {
                        const count = worker.jobs_by_weekday[dayIndex.toString()] || 0;
                        return (
                          <TableCell key={dayIndex} className="text-center">
                            <div
                              className={`inline-block px-3 py-1 rounded ${getIntensityColor(Number(count), maxCount)}`}
                            >
                              <span className="text-xs font-medium">{count}</span>
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {worker.overtime_jobs > 5 && (
                            <Moon className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="text-sm">{worker.overtime_jobs}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {/* Totals row */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>Total</TableCell>
                  {totals.map((total, index) => (
                    <TableCell key={index} className="text-center">
                      {total}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    {statistics.reduce((sum, w) => sum + w.overtime_jobs, 0)}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
