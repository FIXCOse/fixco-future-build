import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Trash2 } from 'lucide-react';
import { FeatureFlagOverride, useDeleteFeatureFlagOverride } from '@/hooks/useFeatureFlag';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
  overrides: FeatureFlagOverride[];
}

export function FeatureFlagOverridesTable({ overrides }: Props) {
  const deleteOverride = useDeleteFeatureFlagOverride();

  const handleDelete = async (id: string) => {
    try {
      await deleteOverride.mutateAsync(id);
      toast.success('Override removed');
    } catch (error) {
      toast.error('Failed to remove override');
      console.error(error);
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Overrides
        </CardTitle>
        <CardDescription>
          Per-user feature flag overrides that take precedence over global settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {overrides.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No user overrides configured
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overrides.map((override) => (
                <TableRow key={override.id} className={isExpired(override.expires_at) ? 'opacity-50' : ''}>
                  <TableCell>
                    <span className="font-mono text-sm">{override.flag_key}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {override.user_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant={override.enabled ? 'default' : 'secondary'}>
                      {override.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {override.expires_at ? (
                      <>
                        {new Date(override.expires_at).toLocaleString('sv-SE')}
                        {isExpired(override.expires_at) && (
                          <Badge variant="destructive" className="ml-2">Expired</Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline">Never</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {override.reason || 'No reason provided'}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Override?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the user-specific override for "{override.flag_key}". 
                            The user will fall back to the global flag setting.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(override.id)}>
                            Remove
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
