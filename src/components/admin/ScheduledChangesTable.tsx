import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useScheduledFlagChanges, useCancelScheduledChange } from '@/hooks/useScheduledFlagChanges';
import { Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

export function ScheduledChangesTable() {
  const { data: scheduledChanges, isLoading } = useScheduledFlagChanges();
  const cancelChange = useCancelScheduledChange();

  const handleCancel = async (changeId: string) => {
    try {
      await cancelChange.mutateAsync(changeId);
      toast.success('Scheduled change cancelled');
    } catch (error) {
      console.error(error);
      toast.error('Failed to cancel scheduled change');
    }
  };

  if (isLoading) {
    return <div>Loading scheduled changes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Scheduled Changes
        </CardTitle>
        <CardDescription>
          Upcoming automatic feature flag changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!scheduledChanges || scheduledChanges.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No scheduled changes
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Target Status</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Time Until</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="font-mono text-sm">
                    {change.flag_key}
                  </TableCell>
                  <TableCell>
                    <Badge variant={change.target_enabled ? 'default' : 'secondary'}>
                      {change.target_enabled ? 'Enable' : 'Disable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(change.scheduled_for).toLocaleString('sv-SE')}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(change.scheduled_for), { 
                      addSuffix: true,
                      locale: sv 
                    })}
                  </TableCell>
                  <TableCell className="text-sm">
                    {change.reason || '-'}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Scheduled Change?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will cancel the scheduled {change.target_enabled ? 'enabling' : 'disabling'} of "{change.flag_key}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Schedule</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCancel(change.id)}>
                            Cancel Schedule
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
