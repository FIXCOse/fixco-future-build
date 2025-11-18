import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';
import { FeatureFlagHistory } from '@/hooks/useFeatureFlag';

interface Props {
  history: FeatureFlagHistory[];
}

export function FeatureFlagHistoryTable({ history }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Change History
        </CardTitle>
        <CardDescription>
          Complete audit log of all feature flag changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No changes recorded yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Flag</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-sm">
                    {new Date(entry.changed_at).toLocaleString('sv-SE')}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{entry.flag_key}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.old_enabled ? 'default' : 'secondary'} className="text-xs">
                        {entry.old_enabled ? 'ON' : 'OFF'}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant={entry.new_enabled ? 'default' : 'secondary'} className="text-xs">
                        {entry.new_enabled ? 'ON' : 'OFF'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                    {entry.reason || 'No reason provided'}
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
