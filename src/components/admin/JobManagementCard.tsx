import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useJobManagement } from '@/hooks/useJobManagement';
import { PlusCircle, MinusCircle, Users, Calendar, DollarSign, Edit, Send } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { JobEditDialog } from './JobEditDialog';

interface JobManagementCardProps {
  job: any;
  workers: any[];
  onRefresh: () => void;
}

export function JobManagementCard({ job, workers, onRefresh }: JobManagementCardProps) {
  const { addToPool, removeFromPool, assignWorker, requestWorkers } = useJobManagement();
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Mock workers list - replace with real data
  const availableWorkers = workers || [];

  const handleAddToPool = async () => {
    setIsLoading(true);
    const success = await addToPool(job.id);
    if (success) onRefresh();
    setIsLoading(false);
  };

  const handleRemoveFromPool = async () => {
    setIsLoading(true);
    const success = await removeFromPool(job.id);
    if (success) onRefresh();
    setIsLoading(false);
  };

  const handleAssignWorker = async () => {
    if (!selectedWorker) return;
    setIsLoading(true);
    const success = await assignWorker(job.id, selectedWorker, availableWorkers.length === 0);
    if (success) {
      onRefresh();
      setSelectedWorker('');
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pool: 'secondary',
      assigned: 'default',
      in_progress: 'default',
      completed: 'outline',
    };
    const labels: Record<string, string> = {
      pool: 'I pool',
      assigned: 'Tilldelad',
      in_progress: 'Pågående',
      completed: 'Klar',
    };
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Jobbhantering
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            {getStatusBadge(job.status)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Skapad:</span>
            <span className="text-sm">
              {format(new Date(job.created_at), 'PPP HH:mm', { locale: sv })}
            </span>
          </div>
          {job.estimated_hours && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimerad tid:</span>
              <span className="text-sm font-medium">{job.estimated_hours}h</span>
            </div>
          )}
          {job.bonus_amount && job.bonus_amount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Bonus:
              </span>
              <Badge variant="default" className="bg-green-600">
                +{job.bonus_amount} kr
              </Badge>
            </div>
          )}
          {job.description && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">{job.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t">
          {job.pool_enabled ? (
            <Button
              onClick={handleRemoveFromPool}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <MinusCircle className="mr-2 h-4 w-4" />
              Ta bort från pool
            </Button>
          ) : (
            <Button
              onClick={handleAddToPool}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Lägg till i pool
            </Button>
          )}

          <div className="space-y-2">
            <Select value={selectedWorker} onValueChange={setSelectedWorker}>
              <SelectTrigger>
                <SelectValue placeholder="Välj worker..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worker-1">Anna Svensson</SelectItem>
                <SelectItem value="worker-2">Erik Mattsson</SelectItem>
                <SelectItem value="worker-3">Lisa Andersson</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssignWorker}
              disabled={!selectedWorker || isLoading}
              className="w-full"
              variant="default"
            >
              <Users className="mr-2 h-4 w-4" />
              Tilldela manuellt
            </Button>
          </div>

          <Button
            onClick={() => setEditDialogOpen(true)}
            variant="outline"
            className="w-full"
          >
            <Edit className="mr-2 h-4 w-4" />
            Redigera jobb
          </Button>
        </div>
      </CardContent>

      <JobEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        job={job}
        workers={workers}
        onSuccess={onRefresh}
      />
    </Card>
  );
}
