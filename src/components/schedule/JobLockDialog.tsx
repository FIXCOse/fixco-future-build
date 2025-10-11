import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface JobLockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  isLocked: boolean;
  onLock: (reason: string) => Promise<void>;
  onUnlock: () => Promise<void>;
}

export function JobLockDialog({
  open,
  onOpenChange,
  jobTitle,
  isLocked,
  onLock,
  onUnlock
}: JobLockDialogProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      if (isLocked) {
        await onUnlock();
      } else {
        await onLock(reason);
      }
      onOpenChange(false);
      setReason('');
    } catch (error) {
      console.error('Failed to toggle lock:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLocked ? (
              <>
                <Unlock className="h-5 w-5" />
                Lås upp jobb
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Lås jobb
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isLocked 
              ? `Låsa upp "${jobTitle}" så att workern kan flytta det?`
              : `Lås "${jobTitle}" för att förhindra att workern flyttar det.`
            }
          </DialogDescription>
        </DialogHeader>

        {!isLocked && (
          <div className="space-y-2">
            <Label htmlFor="reason">Anledning till låsning</Label>
            <Textarea
              id="reason"
              placeholder="T.ex. Kunden har specifikt bokat denna tid"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button 
            onClick={handleAction}
            disabled={loading || (!isLocked && !reason.trim())}
          >
            {loading ? 'Sparar...' : isLocked ? 'Lås upp' : 'Lås'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
