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
import { Clock, Zap, Moon } from 'lucide-react';
import { type WorkerDetailedStatistic } from '@/lib/api/schedule';

interface TimeAnalysisPanelProps {
  statistics: WorkerDetailedStatistic[];
}

export function TimeAnalysisPanel({ statistics }: TimeAnalysisPanelProps) {
  const getSpeedBadge = (avgHours: number) => {
    if (avgHours === 0) return { variant: 'secondary' as const, label: 'N/A', color: '' };
    if (avgHours < 4) return { variant: 'default' as const, label: 'Snabb', color: 'text-green-600' };
    if (avgHours < 8) return { variant: 'secondary' as const, label: 'Normal', color: 'text-yellow-600' };
    return { variant: 'destructive' as const, label: 'Långsam', color: 'text-red-600' };
  };

  const fastestWorker = statistics.length > 0
    ? statistics.reduce((fastest, w) => 
        (w.avg_job_hours > 0 && w.avg_job_hours < fastest.avg_job_hours) ? w : fastest
      )
    : null;

  const mostOvertime = statistics.length > 0
    ? statistics.reduce((max, w) => w.overtime_jobs > max.overtime_jobs ? w : max)
    : null;

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
              <TableHead className="text-right">Snitt</TableHead>
              <TableHead className="text-right">Snabbast</TableHead>
              <TableHead className="text-right">Längst</TableHead>
              <TableHead className="text-right">Övertid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Ingen data tillgänglig
                </TableCell>
              </TableRow>
            ) : (
              statistics.map((worker) => {
                const badge = getSpeedBadge(worker.avg_job_hours);
                return (
                  <TableRow key={worker.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {worker.first_name} {worker.last_name}
                        </p>
                        {fastestWorker?.id === worker.id && worker.avg_job_hours > 0 && (
                          <div title="Snabbaste worker">
                            <Zap className="h-4 w-4 text-yellow-500" />
                          </div>
                        )}
                        {mostOvertime?.id === worker.id && worker.overtime_jobs > 0 && (
                          <div title="Mest övertid">
                            <Moon className="h-4 w-4 text-blue-500" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={badge.variant} className={badge.color}>
                        {worker.avg_job_hours > 0 ? `${worker.avg_job_hours.toFixed(1)}h` : 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-green-600">
                      {worker.fastest_job_hours > 0 ? `${worker.fastest_job_hours.toFixed(1)}h` : '-'}
                    </TableCell>
                    <TableCell className="text-right text-sm text-red-600">
                      {worker.longest_job_hours > 0 ? `${worker.longest_job_hours.toFixed(1)}h` : '-'}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {worker.overtime_jobs} jobb
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
