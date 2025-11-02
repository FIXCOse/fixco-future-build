import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';
import { WorkerPerformancePanel } from '@/components/admin/WorkerPerformancePanel';
import { WorkerStatisticsPanel } from '@/components/admin/WorkerStatisticsPanel';
import { WorkerKPICards } from '@/components/admin/statistics/WorkerKPICards';
import { PerformanceLeaderboard } from '@/components/admin/statistics/PerformanceLeaderboard';
import { TimeAnalysisPanel } from '@/components/admin/statistics/TimeAnalysisPanel';
import { ServiceSpecializationPanel } from '@/components/admin/statistics/ServiceSpecializationPanel';
import { WorkPatternAnalysis } from '@/components/admin/statistics/WorkPatternAnalysis';
import { TrendChartsPanel } from '@/components/admin/statistics/TrendChartsPanel';
import { fetchWorkerDetailedStatistics, fetchWorkerDailyStats, type WorkerDetailedStatistic, type WorkerDailyStat } from '@/lib/api/schedule';
import { toast } from 'sonner';

export default function AdminWorkerAnalytics() {
  const [detailedStats, setDetailedStats] = useState<WorkerDetailedStatistic[]>([]);
  const [dailyStats, setDailyStats] = useState<WorkerDailyStat[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [detailed, daily] = await Promise.all([
          fetchWorkerDetailedStatistics(),
          fetchWorkerDailyStats(timeRange)
        ]);
        setDetailedStats(detailed);
        setDailyStats(daily);
      } catch (error) {
        console.error('Failed to load worker analytics:', error);
        toast.error('Kunde inte ladda worker analytics');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timeRange]);

  const problemWorkers = detailedStats.filter(w => w.completion_rate_percent < 70);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Total Jobs', 'Completed', 'Completion Rate', 'Last 30d', 'Earnings 30d'];
    const rows = detailedStats.map(w => [
      `${w.first_name} ${w.last_name}`,
      w.email,
      w.total_jobs,
      w.completed_jobs,
      `${w.completion_rate_percent}%`,
      w.jobs_last_30_days,
      `${Math.round(w.earnings_last_30_days)} kr`
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worker-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exporterad!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Worker Analytics</h1>
          <p className="text-muted-foreground">Djupgående analys av worker prestanda och beteende</p>
        </div>
        <Button onClick={exportToCSV} disabled={loading || detailedStats.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Laddar worker analytics...</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <WorkerKPICards statistics={detailedStats} />

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-2">
              <TabsTrigger value="overview">📊 Overview</TabsTrigger>
              <TabsTrigger value="performance">⚡ Performance</TabsTrigger>
              <TabsTrigger value="trends">📈 Trends</TabsTrigger>
              <TabsTrigger value="time">⏰ Time</TabsTrigger>
              <TabsTrigger value="specialization">🎯 Services</TabsTrigger>
              <TabsTrigger value="leaderboard">🏆 Leaderboard</TabsTrigger>
              <TabsTrigger value="issues">⚠️ Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <WorkPatternAnalysis statistics={detailedStats} />
              <PerformanceLeaderboard statistics={detailedStats} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <WorkerPerformancePanel />
              <WorkerStatisticsPanel statistics={detailedStats.map(s => ({
                id: s.id,
                first_name: s.first_name,
                last_name: s.last_name,
                email: s.email,
                total_jobs: s.total_jobs,
                completed_jobs: s.completed_jobs,
                jobs_last_30_days: s.jobs_last_30_days,
                avg_job_duration_hours: s.avg_job_hours || 0
              }))} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <TrendChartsPanel 
                statistics={detailedStats}
                dailyStats={dailyStats}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </TabsContent>

            <TabsContent value="time" className="space-y-4">
              <TimeAnalysisPanel statistics={detailedStats} />
            </TabsContent>

            <TabsContent value="specialization" className="space-y-4">
              <ServiceSpecializationPanel 
                statistics={detailedStats}
                onServiceFilter={(workerId, serviceName) => {
                  console.log('Filter by service:', workerId, serviceName);
                  toast.info(`Filtrerar på ${serviceName} för worker ${workerId}`);
                }}
              />
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              <PerformanceLeaderboard statistics={detailedStats} />
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Workers som behöver uppföljning</CardTitle>
                  <CardDescription>
                    Workers med låg completion rate (&lt;70%) eller många returneringar
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
                            <Badge variant="destructive">{worker.completion_rate_percent}% completion</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Jobs</p>
                              <p className="font-semibold">{worker.total_jobs}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Completed</p>
                              <p className="font-semibold">{worker.completed_jobs}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Last 30d</p>
                              <p className="font-semibold">{worker.jobs_last_30_days}</p>
                            </div>
                          </div>
                          {worker.avg_job_hours && (
                            <div className="pt-2 border-t text-sm">
                              <p className="text-muted-foreground">Avg Job Duration: <span className="font-semibold">{worker.avg_job_hours.toFixed(1)}h</span></p>
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
        </>
      )}
    </div>
  );
}
