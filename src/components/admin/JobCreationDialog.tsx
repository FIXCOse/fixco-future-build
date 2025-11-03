import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createJobFromQuote } from '@/lib/api/jobs';
import { useJobManagement } from '@/hooks/useJobManagement';
import { Loader2, Briefcase, Users, DollarSign } from 'lucide-react';

type JobCreationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  quoteData?: any;
  onSuccess: () => void;
};

type Worker = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  skills: string[];
  active: boolean;
};

export function JobCreationDialog({
  open,
  onOpenChange,
  quoteId,
  quoteData,
  onSuccess,
}: JobCreationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  
  const [description, setDescription] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [assignmentType, setAssignmentType] = useState<'pool' | 'manual' | 'request'>('pool');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);

  const { assignWorker, requestWorkers } = useJobManagement();

  useEffect(() => {
    if (open) {
      // Reset form
      setDescription(quoteData?.title || '');
      setBonusAmount('');
      setEstimatedHours('4');
      setAssignmentType('pool');
      setSelectedWorkerId('');
      setSelectedWorkerIds([]);
      loadWorkers();
    }
  }, [open, quoteData]);

  const loadWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, user_id, name, email, skills, active')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error('Error loading workers:', error);
      toast.error('Kunde inte ladda workers');
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Skapa jobb från quote
      const jobId = await createJobFromQuote(quoteId);
      
      if (!jobId) {
        throw new Error('Kunde inte skapa jobb');
      }

      // 2. Uppdatera jobb med extra detaljer
      const updates: any = {
        pool_enabled: assignmentType === 'pool',
        status: assignmentType === 'pool' ? 'pool' : 
                assignmentType === 'request' ? 'pending_request' : 'assigned',
      };

      if (description) updates.description = description;
      if (bonusAmount) updates.bonus_amount = parseFloat(bonusAmount);
      if (estimatedHours) updates.estimated_hours = parseFloat(estimatedHours);

      const { error: updateError } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId);

      if (updateError) throw updateError;

      // 3. Hantera tilldelning baserat på strategi
      if (assignmentType === 'manual' && selectedWorkerId) {
        const success = await assignWorker(jobId, selectedWorkerId, true);
        if (!success) {
          toast.error('Jobbet skapades men kunde inte tilldelas worker');
        }
      } else if (assignmentType === 'request' && selectedWorkerIds.length > 0) {
        const success = await requestWorkers(jobId, selectedWorkerIds, description);
        if (!success) {
          toast.error('Jobbet skapades men förfrågningar kunde inte skickas');
        }
      }

      toast.success(
        assignmentType === 'pool'
          ? 'Jobb skapat och lagt i arbetspoolen'
          : assignmentType === 'request'
          ? `Jobb skapat och förfrågningar skickade till ${selectedWorkerIds.length} worker(s)`
          : 'Jobb skapat och tilldelat worker'
      );
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating job:', error);
      toast.error(error.message || 'Kunde inte skapa jobb');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Skapa jobb från offert
          </DialogTitle>
          <DialogDescription>
            Konfigurera jobbet och välj hur det ska tilldelas workers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Jobbeskrivning */}
          <div className="space-y-2">
            <Label htmlFor="description">Jobbeskrivning</Label>
            <Textarea
              id="description"
              placeholder="Beskriv jobbet i detalj..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Denna information kommer att vara synlig för workers
            </p>
          </div>

          {/* Estimated Hours & Bonus */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimerad tid (timmar)</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0"
                step="0.5"
                placeholder="4"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonus" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Bonus (kr)
              </Label>
              <Input
                id="bonus"
                type="number"
                min="0"
                placeholder="0"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Tilldelningsstrategi */}
          <div className="space-y-3">
            <Label>Hur ska jobbet tilldelas?</Label>
            <RadioGroup value={assignmentType} onValueChange={(v: any) => setAssignmentType(v)}>
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="pool" id="pool" className="mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="pool" className="font-semibold cursor-pointer">
                    🏊 Lägg i arbetspoolen
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Jobbet blir tillgängligt för alla kvalificerade workers att claima
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="request" id="request" className="mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="request" className="font-semibold cursor-pointer">
                    📬 Skicka jobbförfrågan
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Skicka förfrågan till specifika workers som kan acceptera eller avslå
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="manual" id="manual" className="mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="manual" className="font-semibold cursor-pointer flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Tilldela direkt (akut)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tilldela direkt till en worker utan att fråga (för akuta jobb)
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Worker Selection för Request */}
          {assignmentType === 'request' && (
            <div className="space-y-2">
              <Label>Välj workers att skicka förfrågan till</Label>
              {loadingWorkers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                  {workers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Inga aktiva workers hittades
                    </p>
                  ) : (
                    workers.map((worker) => (
                      <div key={worker.id} className="flex items-center space-x-2 hover:bg-accent/50 p-2 rounded">
                        <input
                          type="checkbox"
                          id={`worker-${worker.id}`}
                          checked={selectedWorkerIds.includes(worker.user_id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedWorkerIds([...selectedWorkerIds, worker.user_id]);
                            } else {
                              setSelectedWorkerIds(selectedWorkerIds.filter(id => id !== worker.user_id));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`worker-${worker.id}`} className="flex-1 cursor-pointer font-normal">
                          {worker.name || worker.email}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              )}
              {selectedWorkerIds.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedWorkerIds.length} worker(s) vald(a)
                </p>
              )}
            </div>
          )}

          {/* Worker Selection för Manual */}
          {assignmentType === 'manual' && (
            <div className="space-y-2">
              <Label htmlFor="worker">Välj worker</Label>
              {loadingWorkers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                  <SelectTrigger id="worker">
                    <SelectValue placeholder="Välj en worker..." />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Inga aktiva workers hittades
                      </div>
                    ) : (
                      workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.user_id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{worker.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({worker.email})
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              {assignmentType === 'manual' && !selectedWorkerId && (
                <p className="text-xs text-amber-600">
                  Du måste välja en worker för manuell tilldelning
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Avbryt
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading || 
              (assignmentType === 'manual' && !selectedWorkerId) ||
              (assignmentType === 'request' && selectedWorkerIds.length === 0)
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {assignmentType === 'request' ? 'Skickar förfrågningar...' : 'Skapar jobb...'}
              </>
            ) : (
              <>
                <Briefcase className="mr-2 h-4 w-4" />
                {assignmentType === 'request' ? 'Skicka förfrågningar' : 'Skapa jobb'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
