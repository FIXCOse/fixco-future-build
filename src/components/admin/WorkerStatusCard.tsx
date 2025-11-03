import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Users, Star, X } from 'lucide-react';
import { useJobManagement } from '@/hooks/useJobManagement';
import { useState } from 'react';

interface WorkerStatusCardProps {
  workers: any[];
  totalHours: number;
  estimatedHours: number;
  jobId: string;
  onRefresh: () => void;
}

export function WorkerStatusCard({ 
  workers, 
  totalHours, 
  estimatedHours, 
  jobId,
  onRefresh 
}: WorkerStatusCardProps) {
  const { removeWorker } = useJobManagement();
  const [removingWorker, setRemovingWorker] = useState<string | null>(null);

  const progressPercent = estimatedHours > 0 
    ? Math.min(Math.round((totalHours / estimatedHours) * 100), 100)
    : 0;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      assigned: 'secondary',
      active: 'default',
      completed: 'outline',
    };
    const labels: Record<string, string> = {
      assigned: 'Tilldelad',
      active: 'Aktiv',
      completed: 'Klar',
    };
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
  };

  const handleRemoveWorker = async (workerId: string) => {
    setRemovingWorker(workerId);
    const success = await removeWorker(jobId, workerId);
    if (success) onRefresh();
    setRemovingWorker(null);
  };

  if (workers.length === 0) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Workers (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Inga workers tilldelade än
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Workers ({workers.length})
          </span>
          <span className="text-sm font-normal">
            {totalHours}h/{estimatedHours}h
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {workers
            .filter((w) => w.status !== 'removed')
            .map((worker) => (
              <div 
                key={worker.worker_id} 
                className="p-3 rounded-lg border bg-card space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {worker.is_lead && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {worker.worker_name || 'Okänd worker'}
                      </div>
                      {worker.is_lead && (
                        <div className="text-xs text-muted-foreground">Arbetsledare</div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveWorker(worker.worker_id)}
                    disabled={removingWorker === worker.worker_id}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge(worker.status)}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Timmar:</span>
                  <span className="font-medium">{worker.total_hours || 0}h</span>
                </div>
              </div>
            ))}
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total progress:</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
