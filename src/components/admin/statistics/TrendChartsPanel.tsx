import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type WorkerDetailedStatistic, type WorkerDailyStat } from '@/lib/api/schedule';

interface TrendChartsPanelProps {
  statistics: WorkerDetailedStatistic[];
  dailyStats: WorkerDailyStat[];
  timeRange: '7d' | '30d' | '90d';
  onTimeRangeChange: (range: '7d' | '30d' | '90d') => void;
}

export function TrendChartsPanel({ statistics, dailyStats, timeRange, onTimeRangeChange }: TrendChartsPanelProps) {
  // Prepare data for charts
  const topWorkers = statistics.slice(0, 5);
  
  // Group daily stats by date
  const dailyJobsData = dailyStats.reduce((acc, stat) => {
    const existing = acc.find(d => d.date === stat.date);
    const workerName = statistics.find(w => w.id === stat.worker_id)?.first_name || 'Unknown';
    
    if (existing) {
      existing[workerName] = stat.jobs_completed;
    } else {
      acc.push({
        date: new Date(stat.date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
        [workerName]: stat.jobs_completed,
      });
    }
    return acc;
  }, [] as any[]);

  // Prepare earnings data
  const earningsData = dailyStats.reduce((acc, stat) => {
    const existing = acc.find(d => d.date === stat.date);
    const workerName = statistics.find(w => w.id === stat.worker_id)?.first_name || 'Unknown';
    
    if (existing) {
      existing[workerName] = (existing[workerName] || 0) + stat.total_earnings;
    } else {
      acc.push({
        date: new Date(stat.date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
        [workerName]: stat.total_earnings,
      });
    }
    return acc;
  }, [] as any[]);

  // Last 7 days bar chart
  const last7DaysData = statistics.slice(0, 5).map(worker => ({
    name: worker.first_name,
    jobs: worker.jobs_last_7_days,
  }));

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a28dff'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trender & Prestationshistorik
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('7d')}
            >
              7d
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('30d')}
            >
              30d
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange('90d')}
            >
              90d
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Jobs Completed Over Time */}
        <div>
          <h3 className="text-sm font-medium mb-4">Jobb Slutförda (Top 5 Workers)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyJobsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {topWorkers.map((worker, idx) => (
                <Line
                  key={worker.id}
                  type="monotone"
                  dataKey={worker.first_name}
                  stroke={colors[idx]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Last 7 Days Bar Chart */}
        <div>
          <h3 className="text-sm font-medium mb-4">Jobb Senaste 7 Dagarna</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobs" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings Over Time */}
        <div>
          <h3 className="text-sm font-medium mb-4">Intjäning Över Tid (Top 5 Workers)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {topWorkers.map((worker, idx) => (
                <Area
                  key={worker.id}
                  type="monotone"
                  dataKey={worker.first_name}
                  stackId="1"
                  stroke={colors[idx]}
                  fill={colors[idx]}
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
