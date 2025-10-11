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
import { Wrench, Award } from 'lucide-react';
import { type WorkerDetailedStatistic } from '@/lib/api/schedule';

interface ServiceSpecializationPanelProps {
  statistics: WorkerDetailedStatistic[];
  onServiceFilter?: (workerId: string, serviceName: string) => void;
}

export function ServiceSpecializationPanel({ statistics, onServiceFilter }: ServiceSpecializationPanelProps) {
  const getServiceColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
    return colors[index] || 'bg-gray-500';
  };

  const isSpecialist = (worker: WorkerDetailedStatistic) => {
    if (!worker.top_services || worker.top_services.length === 0) return false;
    const topService = worker.top_services[0];
    return (topService.count / worker.total_jobs) > 0.5;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Tjänste-specialiseringar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Tjänst #1</TableHead>
              <TableHead>Tjänst #2</TableHead>
              <TableHead>Tjänst #3</TableHead>
              <TableHead className="text-right">Success Rate</TableHead>
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
                const specialist = isSpecialist(worker);
                const services = worker.top_services || [];
                
                return (
                  <TableRow key={worker.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {worker.first_name} {worker.last_name}
                        </span>
                        {specialist && (
                          <div title="Specialist">
                            <Award className="h-4 w-4 text-yellow-500" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    {[0, 1, 2].map((index) => {
                      const service = services[index];
                      return (
                        <TableCell key={index}>
                          {service ? (
                            <button
                              onClick={() => onServiceFilter?.(worker.id, service.service_name)}
                              className="text-left hover:underline"
                            >
                              <div className="flex flex-col gap-1">
                                <Badge 
                                  variant="outline" 
                                  className={`${getServiceColor(index)} text-white border-0 text-xs`}
                                >
                                  {service.service_name}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {service.count} jobb ({service.success_rate}%)
                                </span>
                              </div>
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          worker.completion_rate_percent >= 90
                            ? 'default'
                            : worker.completion_rate_percent >= 70
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {worker.completion_rate_percent}%
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
