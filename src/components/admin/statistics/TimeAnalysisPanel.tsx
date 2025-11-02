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
import { Clock, Zap, TrendingUp } from 'lucide-react';
import { type WorkerDetailedStatistic } from '@/lib/api/schedule';

interface TimeAnalysisPanelProps {
  statistics: WorkerDetailedStatistic[];
}

export function TimeAnalysisPanel({ statistics }: TimeAnalysisPanelProps) {
  const workersWithTime = statistics.filter(w => w.avg_job_hours !== null);

  const getSpeedBadge = (avgHours: number | null) => {
    if (!avgHours) return { variant: 'secondary' as const, label: 'N/A' };
    if (avgHours < 3) return { variant: 'default' as const, label: 'Fast' };
    if (avgHours < 6) return { variant: 'secondary' as const, label: 'Normal' };
    return { variant: 'outline' as const, label: 'Slow' };
  };

  const fastestWorker = workersWithTime.reduce((fastest, worker) => {
    if (!fastest || (worker.avg_job_hours && worker.avg_job_hours < (fastest.avg_job_hours || Infinity))) {
      return worker;
    }
    return fastest;
  }, null as WorkerDetailedStatistic | null);

  const mostOvertime = [...statistics].sort((a, b) => b.overtime_jobs - a.overtime_jobs)[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Tidsanalys
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead className="text-right">Snitt (h)</TableHead>
              <TableHead className="text-right">Snabbast (h)</TableHead>
              <TableHead className="text-right">Längst (h)</TableHead>
              <TableHead className="text-right">Övertid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workersWithTime.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Ingen tidsdata tillgänglig
                </TableCell>
              </TableRow>
            ) : (
              workersWithTime.map((worker) => {
                const speedBadge = getSpeedBadge(worker.avg_job_hours);
                const isFastest = fastestWorker?.id === worker.id;
                const hasMostOvertime = mostOvertime?.id === worker.id && worker.overtime_jobs > 0;

                return (
                  <TableRow key={worker.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isFastest && <Zap className="h-4 w-4 text-yellow-500" />}
                        {hasMostOvertime && <TrendingUp className="h-4 w-4 text-orange-500" />}
                        <span className="font-medium">
                          {worker.first_name} {worker.last_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={speedBadge.variant}>
                        {worker.avg_job_hours?.toFixed(1) || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {worker.fastest_job_hours?.toFixed(1) || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {worker.longest_job_hours?.toFixed(1) || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={worker.overtime_jobs > 5 ? 'destructive' : 'secondary'}>
                        {worker.overtime_jobs}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
