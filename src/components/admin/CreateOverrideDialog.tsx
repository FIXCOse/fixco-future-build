import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus } from 'lucide-react';
import { useFeatureFlags, useCreateFeatureFlagOverride } from '@/hooks/useFeatureFlag';
import { toast } from 'sonner';

export function CreateOverrideDialog() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [flagKey, setFlagKey] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [reason, setReason] = useState('');
  
  const { data: flags = [] } = useFeatureFlags();
  const createOverride = useCreateFeatureFlagOverride();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !flagKey) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createOverride.mutateAsync({
        flag_key: flagKey,
        user_id: userId,
        enabled,
        expires_at: expiresAt || null,
        reason: reason || undefined,
      });
      
      toast.success('User override created');
      setOpen(false);
      
      // Reset form
      setUserId('');
      setFlagKey('');
      setEnabled(true);
      setExpiresAt('');
      setReason('');
    } catch (error) {
      toast.error('Failed to create override');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Create User Override
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create User Override</DialogTitle>
            <DialogDescription>
              Override a feature flag for a specific user
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="flag">Feature Flag</Label>
              <Select value={flagKey} onValueChange={setFlagKey} required>
                <SelectTrigger id="flag">
                  <SelectValue placeholder="Select a flag" />
                </SelectTrigger>
                <SelectContent>
                  {flags.map((flag) => (
                    <SelectItem key={flag.key} value={flag.key}>
                      {flag.key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="uuid-of-user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the UUID of the user (from profiles table)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Enable Feature</Label>
                <p className="text-xs text-muted-foreground">
                  Turn this feature on or off for this user
                </p>
              </div>
              <Switch
                id="enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiresAt">Expires At (Optional)</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for permanent override
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Why is this override needed?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createOverride.isPending}>
              Create Override
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
