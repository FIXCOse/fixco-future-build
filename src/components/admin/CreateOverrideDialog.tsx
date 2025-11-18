import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserPlus, Check, ChevronsUpDown } from 'lucide-react';
import { useFeatureFlags, useCreateFeatureFlagOverride } from '@/hooks/useFeatureFlag';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function CreateOverrideDialog() {
  const [open, setOpen] = useState(false);
  const [flagKey, setFlagKey] = useState('');
  const [userId, setUserId] = useState('');
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [reason, setReason] = useState('');
  
  const { data: flags = [] } = useFeatureFlags();
  const createOverride = useCreateFeatureFlagOverride();

  const { data: searchResults } = useQuery({
    queryKey: ['search-users', userSearch],
    queryFn: async () => {
      if (!userSearch || userSearch.length < 2) return [];
      
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email')
        .or(`name.ilike.%${userSearch}%,email.ilike.%${userSearch}%`)
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: userSearch.length >= 2,
  });

  const selectedUser = searchResults?.find(u => u.id === userId);

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
      setUserSearch('');
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
              <Label htmlFor="userId">User</Label>
              <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={userSearchOpen}
                    className="w-full justify-between"
                  >
                    {selectedUser ? `${selectedUser.name} (${selectedUser.email})` : "Search for user..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search users by name or email..." 
                      value={userSearch}
                      onValueChange={setUserSearch}
                    />
                    <CommandEmpty>
                      {userSearch.length < 2 ? 'Type at least 2 characters to search' : 'No users found.'}
                    </CommandEmpty>
                    <CommandGroup>
                      {searchResults?.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={(currentValue) => {
                            setUserId(currentValue === userId ? "" : currentValue);
                            setUserSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              userId === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
