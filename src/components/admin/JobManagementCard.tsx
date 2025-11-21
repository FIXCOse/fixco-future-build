import { useState, useEffect } from 'react';
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
import { PlusCircle, MinusCircle, Users, Calendar, DollarSign, Edit, Send, CheckCircle, XCircle, AlertCircle, Eye, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { JobEditDialog } from './JobEditDialog';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { updateJobStatus } from '@/lib/api/jobs';
import { toast } from 'sonner';

interface JobManagementCardProps {
  job: any;
  workers: any[];
  onRefresh: () => void;
}

export function JobManagementCard({ job, workers, onRefresh }: JobManagementCardProps) {
  const navigate = useNavigate();
  const { addToPool, removeFromPool, assignWorker, requestWorkers } = useJobManagement();
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [jobRequests, setJobRequests] = useState<any[]>([]);

  // Load job requests if job is in pending_request status
  useEffect(() => {
    if (job.status === 'pending_request') {
      loadJobRequests();
    }
  }, [job.status, job.id]);

  const loadJobRequests = async () => {
    const { data, error } = await supabase
      .from('job_requests')
      .select(`
        *,
        worker:worker_id (
          full_name,
          email
        )
      `)
      .eq('job_id', job.id)
      .order('requested_at', { ascending: false });

    if (!error && data) {
      setJobRequests(data);
    }
  };

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

  const handleStatusUpdate = async (newStatus: string) => {
    setIsLoading(true);
    try {
      await updateJobStatus(job.id, newStatus);
      toast.success(`Status uppdaterad till ${newStatus}`);
      onRefresh();
    } catch (error) {
      toast.error('Kunde inte uppdatera status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pool: 'secondary',
      pending_request: 'outline',
      assigned: 'default',
      in_progress: 'default',
      completed: 'outline',
    };
    const labels: Record<string, string> = {
      pool: 'I pool',
      pending_request: 'Väntar på svar',
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

        {/* Job Requests Status */}
        {job.status === 'pending_request' && jobRequests.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Förfrågningar skickade till:</span>
            </div>
            <div className="space-y-1 pl-6">
              {jobRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between text-sm">
                  <span>{request.worker?.full_name || request.worker?.email || 'Okänd'}</span>
                  <Badge variant={
                    request.status === 'accepted' ? 'default' :
                    request.status === 'rejected' ? 'destructive' :
                    request.status === 'expired' ? 'secondary' :
                    'outline'
                  }>
                    {request.status === 'accepted' && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                    {request.status === 'rejected' && <XCircle className="h-3 w-3 mr-1 inline" />}
                    {request.status === 'pending' ? 'Väntar' :
                     request.status === 'accepted' ? 'Accepterad' :
                     request.status === 'rejected' ? 'Avslagen' :
                     'Utgången'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t">
          {job.status === 'pool' && (
            <Button
              onClick={handleRemoveFromPool}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <MinusCircle className="mr-2 h-4 w-4" />
              Ta bort från pool
            </Button>
          )}

          {job.status === 'pending_request' && (
            <Button
              onClick={handleAddToPool}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Konvertera till pool
            </Button>
          )}

          {job.status !== 'pool' && job.status !== 'pending_request' && !job.pool_enabled && (
            <Button
              onClick={handleAddToPool}
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
                {availableWorkers.length > 0 ? (
                  availableWorkers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.full_name || `${worker.first_name || ''} ${worker.last_name || ''}`.trim() || worker.email}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-workers" disabled>
                    Inga workers tillgängliga
                  </SelectItem>
                )}
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

        {/* Completed job actions */}
        {job.status === 'completed' && (
          <div className="space-y-2 pt-2 border-t">
            <Button
              onClick={() => navigate(`/admin/jobs/${job.id}`)}
              variant="default"
              className="w-full"
              disabled={isLoading}
            >
              <Eye className="mr-2 h-4 w-4" />
              Visa detaljer & Skapa faktura
            </Button>
            
            <Button
              onClick={() => handleStatusUpdate('in_progress')}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Återställ till pågående
            </Button>
          </div>
        )}
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
