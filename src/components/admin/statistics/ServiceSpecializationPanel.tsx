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
import { Target, Star } from 'lucide-react';
import { type WorkerDetailedStatistic } from '@/lib/api/schedule';

interface ServiceSpecializationPanelProps {
  statistics: WorkerDetailedStatistic[];
  onServiceFilter?: (workerId: string, serviceName: string) => void;
}

export function ServiceSpecializationPanel({ statistics, onServiceFilter }: ServiceSpecializationPanelProps) {
  const getServiceColor = (index: number) => {
    const colors = ['bg-blue-500/10 text-blue-700', 'bg-green-500/10 text-green-700', 'bg-purple-500/10 text-purple-700'];
    return colors[index] || 'bg-gray-500/10 text-gray-700';
  };

  const isSpecialist = (worker: WorkerDetailedStatistic) => {
    if (!worker.top_services || worker.top_services.length === 0) return false;
    const topService = worker.top_services[0];
    return topService.count >= 10; // Specialist if 10+ jobs in top service
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Specialisering & Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Top Services</TableHead>
              <TableHead className="text-right">Completion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Ingen data tillgänglig
                </TableCell>
              </TableRow>
            ) : (
              statistics.map((worker) => {
                const specialist = isSpecialist(worker);
                
                return (
                  <TableRow key={worker.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {specialist && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        <div>
                          <p className="font-medium">
                            {worker.first_name} {worker.last_name}
                          </p>
                          {specialist && (
                            <p className="text-xs text-muted-foreground">Specialist</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {worker.top_services && worker.top_services.length > 0 ? (
                          worker.top_services.map((service, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className={`${getServiceColor(idx)} cursor-pointer hover:opacity-80`}
                              onClick={() => onServiceFilter?.(worker.id, service.service_name)}
                            >
                              {service.service_name} ({service.count})
                              <span className="ml-1 text-xs">
                                {service.success_rate}%
                              </span>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Ingen data</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          worker.completion_rate_percent >= 90 ? 'default' :
                          worker.completion_rate_percent >= 70 ? 'secondary' :
                          'destructive'
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
