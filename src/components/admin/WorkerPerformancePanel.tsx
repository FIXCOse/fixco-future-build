import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fetchWorkerPerformanceStats, type WorkerPerformance } from '@/lib/api/schedule';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export function WorkerPerformancePanel() {
  const [stats, setStats] = useState<WorkerPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchWorkerPerformanceStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  
  const getReliabilityStars = (completionRate: number) => {
    if (completionRate >= 95) return '⭐⭐⭐⭐⭐';
    if (completionRate >= 85) return '⭐⭐⭐⭐';
    if (completionRate >= 70) return '⭐⭐⭐';
    if (completionRate >= 50) return '⭐⭐';
    return '⭐';
  };

  const getReliabilityColor = (completionRate: number) => {
    if (completionRate >= 85) return 'text-green-600';
    if (completionRate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Worker Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Worker Performance Analytics
          <Badge variant="outline">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead className="text-right">Claimed</TableHead>
              <TableHead className="text-right">Completed</TableHead>
              <TableHead className="text-right">Returned</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead>Reliability</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Ingen data tillgänglig
                </TableCell>
              </TableRow>
            ) : (
              stats.map((worker) => {
                const hasIssues = worker.completion_rate < 70 || worker.total_returned > 3;
                
                return (
                  <TableRow key={worker.id} className={hasIssues ? 'bg-destructive/5 hover:bg-destructive/10' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {hasIssues && <AlertCircle className="w-4 h-4 text-red-500" />}
                        <div>
                          <p className="font-medium">{worker.first_name} {worker.last_name}</p>
                          <p className="text-xs text-muted-foreground">{worker.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{worker.total_claimed}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default" className="bg-green-600">{worker.total_completed}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {worker.total_returned > 0 && (
                        <HoverCard>
                          <HoverCardTrigger>
                            <Badge variant="destructive">{worker.total_returned}</Badge>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Returneringsorsaker:</h4>
                              <ul className="text-xs space-y-1">
                                {worker.return_reasons?.filter(r => r).map((reason, i) => (
                                  <li key={i} className="list-disc list-inside">{reason}</li>
                                ))}
                              </ul>
                              {worker.avg_time_held_minutes && (
                                <p className="text-xs text-muted-foreground pt-2">
                                  Genomsnittlig tid innan retur: {Math.round(worker.avg_time_held_minutes)} min
                                </p>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={worker.completion_rate >= 80 ? "default" : "secondary"}>
                        {worker.completion_rate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xl ${getReliabilityColor(worker.completion_rate)}`}>
                        {getReliabilityStars(worker.completion_rate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {worker.completion_rate >= 85 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : worker.completion_rate < 70 ? (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
