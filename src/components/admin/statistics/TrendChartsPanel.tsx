import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { type WorkerDetailedStatistic, type WorkerDailyStat } from '@/lib/api/schedule';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface TrendChartsPanelProps {
  statistics: WorkerDetailedStatistic[];
  dailyStats: WorkerDailyStat[];
  timeRange: '7d' | '30d' | '90d';
  onTimeRangeChange: (range: '7d' | '30d' | '90d') => void;
}

export function TrendChartsPanel({ statistics, dailyStats, timeRange, onTimeRangeChange }: TrendChartsPanelProps) {
  const top5Workers = [...statistics]
    .sort((a, b) => b.total_jobs - a.total_jobs)
    .slice(0, 5);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Process daily stats for line chart
  const dailyJobsData = dailyStats.reduce((acc, stat) => {
    const date = format(new Date(stat.date), 'MMM dd', { locale: sv });
    const existing = acc.find(d => d.date === date);
    const worker = statistics.find(w => w.id === stat.worker_id);
    const workerName = worker ? `${worker.first_name} ${worker.last_name}` : 'Unknown';
    
    if (existing) {
      existing[workerName] = (existing[workerName] || 0) + stat.jobs_completed;
    } else {
      acc.push({ date, [workerName]: stat.jobs_completed });
    }
    return acc;
  }, [] as any[]);

  // Process earnings data for area chart
  const earningsData = dailyStats.reduce((acc, stat) => {
    const date = format(new Date(stat.date), 'MMM dd', { locale: sv });
    const existing = acc.find(d => d.date === date);
    const worker = statistics.find(w => w.id === stat.worker_id);
    const workerName = worker ? `${worker.first_name} ${worker.last_name}` : 'Unknown';
    
    if (existing) {
      existing[workerName] = (existing[workerName] || 0) + stat.total_earnings;
    } else {
      acc.push({ date, [workerName]: stat.total_earnings });
    }
    return acc;
  }, [] as any[]);

  // Last 7 days bar chart
  const last7DaysData = statistics.map(w => ({
    name: `${w.first_name} ${w.last_name}`,
    jobb: w.jobs_last_7_days,
    completion: w.completion_rate_percent,
  })).sort((a, b) => b.jobb - a.jobb).slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trender över tid
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('7d')}
            >
              7 dagar
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('30d')}
            >
              30 dagar
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('90d')}
            >
              3 månader
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Jobs over time line chart */}
        <div>
          <h3 className="text-sm font-medium mb-4">Jobb över tid (Top 5 workers)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyJobsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {top5Workers.map((worker, index) => (
                <Line
                  key={worker.id}
                  type="monotone"
                  dataKey={`${worker.first_name} ${worker.last_name}`}
                  stroke={colors[index]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Last 7 days bar chart */}
        <div>
          <h3 className="text-sm font-medium mb-4">Jobb senaste veckan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobb" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings area chart */}
        <div>
          <h3 className="text-sm font-medium mb-4">Total intjäning över tid</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${Math.round(Number(value)).toLocaleString('sv-SE')} kr`} />
              <Legend />
              {top5Workers.map((worker, index) => (
                <Area
                  key={worker.id}
                  type="monotone"
                  dataKey={`${worker.first_name} ${worker.last_name}`}
                  stackId="1"
                  stroke={colors[index]}
                  fill={colors[index]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
