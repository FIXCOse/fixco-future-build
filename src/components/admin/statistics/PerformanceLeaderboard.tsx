import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Zap } from 'lucide-react';
import { type WorkerDetailedStatistic } from '@/lib/api/schedule';

interface PerformanceLeaderboardProps {
  statistics: WorkerDetailedStatistic[];
}

export function PerformanceLeaderboard({ statistics }: PerformanceLeaderboardProps) {
  const sortedWorkers = [...statistics]
    .sort((a, b) => b.completed_jobs - a.completed_jobs)
    .slice(0, 10);

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getCompletionBadge = (rate: number) => {
    if (rate >= 90) return { variant: 'default' as const, label: 'Excellent' };
    if (rate >= 70) return { variant: 'secondary' as const, label: 'Good' };
    return { variant: 'destructive' as const, label: 'Needs Focus' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead className="text-right">Jobs</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Streak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWorkers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Ingen data tillgänglig
                </TableCell>
              </TableRow>
            ) : (
              sortedWorkers.map((worker, index) => {
                const badge = getCompletionBadge(worker.completion_rate_percent);
                return (
                  <TableRow key={worker.id}>
                    <TableCell className="font-bold text-lg">
                      {getMedal(index + 1)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={worker.avatar_url} />
                          <AvatarFallback>
                            {worker.first_name[0]}{worker.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {worker.first_name} {worker.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{worker.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{worker.completed_jobs}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={badge.variant}>
                        {worker.completion_rate_percent}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {worker.current_streak_days > 7 && (
                          <Zap className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm">{worker.current_streak_days}d</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
