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
import { type WorkerStatistic } from '@/lib/api/schedule';

interface WorkerStatisticsPanelProps {
  statistics: WorkerStatistic[];
}

export function WorkerStatisticsPanel({ statistics }: WorkerStatisticsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Worker Statistik</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead className="text-right">Jobb</TableHead>
              <TableHead className="text-right">Klara</TableHead>
              <TableHead className="text-right">30d</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Ingen data tillgänglig
                </TableCell>
              </TableRow>
            ) : (
              statistics.map((stat) => {
                const completionRate = stat.total_jobs > 0 
                  ? Math.round((stat.completed_jobs / stat.total_jobs) * 100)
                  : 0;
                
                return (
                  <TableRow key={stat.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">
                          {stat.first_name} {stat.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{stat.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{stat.total_jobs}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={completionRate >= 80 ? "default" : "secondary"}
                      >
                        {completionRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm">{stat.jobs_last_30_days}</span>
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
