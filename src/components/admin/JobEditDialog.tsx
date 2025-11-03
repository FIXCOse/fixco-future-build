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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Edit, Calendar, DollarSign, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

type JobEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: any;
  workers: any[];
  onSuccess: () => void;
};

export function JobEditDialog({
  open,
  onOpenChange,
  job,
  workers,
  onSuccess,
}: JobEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [poolEnabled, setPoolEnabled] = useState(false);

  useEffect(() => {
    if (open && job) {
      setTitle(job.title || '');
      setDescription(job.description || '');
      setBonusAmount(job.bonus_amount?.toString() || '');
      setEstimatedHours(job.estimated_hours?.toString() || '');
      setDueDate(job.due_date ? format(new Date(job.due_date), 'yyyy-MM-dd') : '');
      setPoolEnabled(job.pool_enabled || false);
    }
  }, [open, job]);

  const handleRemoveWorker = async (workerId: string) => {
    try {
      const { error } = await supabase
        .from('job_workers')
        .update({ status: 'removed' })
        .eq('job_id', job.id)
        .eq('worker_id', workerId);

      if (error) throw error;

      toast.success('Worker borttagen från jobbet');
      onSuccess();
    } catch (error) {
      console.error('Error removing worker:', error);
      toast.error('Kunde inte ta bort worker');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updates: any = {
        pool_enabled: poolEnabled,
      };

      if (title) updates.title = title;
      if (description) updates.description = description;
      if (bonusAmount) updates.bonus_amount = parseFloat(bonusAmount);
      if (estimatedHours) updates.estimated_hours = parseFloat(estimatedHours);
      if (dueDate) updates.due_date = new Date(dueDate).toISOString();

      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', job.id);

      if (error) throw error;

      toast.success('Jobb uppdaterat!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating job:', error);
      toast.error(error.message || 'Kunde inte uppdatera jobb');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Redigera jobb
          </DialogTitle>
          <DialogDescription>
            Uppdatera jobbdetaljer och hantera workers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
          {/* Titel */}
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              placeholder="Jobbtitel..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Beskrivning */}
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              placeholder="Beskriv jobbet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Estimated Hours, Bonus, Due Date */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Est. timmar</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0"
                step="0.5"
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
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Deadline
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Pool Toggle */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="poolEnabled" className="font-semibold">
                Arbetspool
              </Label>
              <p className="text-sm text-muted-foreground">
                Tillgängligt för workers att claima
              </p>
            </div>
            <Switch
              id="poolEnabled"
              checked={poolEnabled}
              onCheckedChange={setPoolEnabled}
            />
          </div>

          {/* Assigned Workers */}
          {workers && workers.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Tilldelade workers</Label>
              <div className="space-y-2">
                {workers.map((worker) => (
                  <div
                    key={worker.worker_id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{worker.worker_name || 'Namnlös'}</p>
                      <p className="text-sm text-muted-foreground">
                        {worker.worker_email || 'Ingen email'}
                      </p>
                      {worker.total_hours !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {worker.total_hours}h loggade
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {worker.is_lead && <Badge variant="default">Lead</Badge>}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWorker(worker.worker_id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sparar...
              </>
            ) : (
              'Spara ändringar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
