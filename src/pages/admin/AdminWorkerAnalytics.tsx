import { WorkerPerformancePanel } from '@/components/admin/WorkerPerformancePanel';
import { WorkerStatisticsPanel } from '@/components/admin/WorkerStatisticsPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { fetchWorkerPerformanceStats } from '@/lib/api/schedule';
import { BarChart, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminWorkerAnalytics() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkerPerformanceStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const topPerformers = stats.slice(0, 3);
  const problemWorkers = stats.filter(w => w.completion_rate < 70);
  const avgCompletionRate = stats.length > 0 
    ? stats.reduce((sum, w) => sum + w.completion_rate, 0) / stats.length 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Worker Analytics</h1>
        <p className="text-muted-foreground">Djupgående analys av worker prestanda och beteende</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Totalt Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Genomsnittlig Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers.length}</div>
            <p className="text-xs text-muted-foreground">≥85% completion rate</p>
          </CardContent>
        </Card>

        <Card className={problemWorkers.length > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Problem Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{problemWorkers.length}</div>
            <p className="text-xs text-muted-foreground">&lt;70% completion rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Overview</TabsTrigger>
          <TabsTrigger value="statistics">Job Statistics</TabsTrigger>
          <TabsTrigger value="issues">Problem Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <WorkerPerformancePanel />
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <WorkerStatisticsPanel statistics={stats.map(s => ({
            id: s.id,
            first_name: s.first_name,
            last_name: s.last_name,
            email: s.email,
            total_jobs: s.total_claimed,
            completed_jobs: s.total_completed,
            jobs_last_30_days: s.total_claimed,
            avg_job_duration_hours: 0
          }))} />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workers som behöver uppföljning</CardTitle>
              <CardDescription>
                Workers med låg completion rate eller många returneringar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {problemWorkers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Inga problem upptäckta! Alla workers presterar bra. 🎉
                </div>
              ) : (
                <div className="space-y-4">
                  {problemWorkers.map(worker => (
                    <div key={worker.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{worker.first_name} {worker.last_name}</p>
                          <p className="text-sm text-muted-foreground">{worker.email}</p>
                        </div>
                        <Badge variant="destructive">{worker.completion_rate}% completion</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Claimed</p>
                          <p className="font-semibold">{worker.total_claimed}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completed</p>
                          <p className="font-semibold">{worker.total_completed}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Returned</p>
                          <p className="font-semibold text-red-600">{worker.total_returned}</p>
                        </div>
                      </div>
                      {worker.return_reasons && worker.return_reasons.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium mb-1">Vanligaste returneringsorsaker:</p>
                          <div className="flex flex-wrap gap-1">
                            {worker.return_reasons.filter((r: string) => r).map((reason: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">{reason}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
