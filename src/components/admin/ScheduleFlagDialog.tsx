import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { useCreateScheduledChange } from '@/hooks/useScheduledFlagChanges';
import { toast } from 'sonner';

interface Props {
  flagKey: string;
  currentEnabled: boolean;
}

export function ScheduleFlagDialog({ flagKey, currentEnabled }: Props) {
  const [open, setOpen] = useState(false);
  const [targetEnabled, setTargetEnabled] = useState(!currentEnabled);
  const [scheduleAt, setScheduleAt] = useState('');
  const [reason, setReason] = useState('');
  
  const createScheduledChange = useCreateScheduledChange();

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduleAt) {
      toast.error('Please select a date and time');
      return;
    }

    const scheduledDate = new Date(scheduleAt);
    const now = new Date();

    if (scheduledDate <= now) {
      toast.error('Scheduled time must be in the future');
      return;
    }

    try {
      await createScheduledChange.mutateAsync({
        flag_key: flagKey,
        target_enabled: targetEnabled,
        scheduled_for: scheduledDate.toISOString(),
        reason: reason || undefined,
      });

      toast.success(
        `✅ Scheduled to ${targetEnabled ? 'enable' : 'disable'} "${flagKey}" at ${scheduledDate.toLocaleString('sv-SE')}`
      );
      
      setOpen(false);
      setScheduleAt('');
      setReason('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to schedule change');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSchedule}>
          <DialogHeader>
            <DialogTitle>Schedule Flag Change</DialogTitle>
            <DialogDescription>
              Schedule a future toggle for "{flagKey}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Current Status</Label>
                <p className="text-sm text-muted-foreground">
                  {currentEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="targetEnabled">Target Status</Label>
                <p className="text-xs text-muted-foreground">
                  What should the flag become?
                </p>
              </div>
              <Switch
                id="targetEnabled"
                checked={targetEnabled}
                onCheckedChange={setTargetEnabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scheduleAt">Schedule For</Label>
              <Input
                id="scheduleAt"
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                When should this change happen?
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Why schedule this change?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createScheduledChange.isPending}>
              {createScheduledChange.isPending ? 'Scheduling...' : 'Schedule Change'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
