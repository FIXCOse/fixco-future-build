import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, DollarSign } from 'lucide-react';
import { type WorkerDetailedStatistic } from '@/lib/api/schedule';

interface WorkerKPICardsProps {
  statistics: WorkerDetailedStatistic[];
}

export function WorkerKPICards({ statistics }: WorkerKPICardsProps) {
  const totalWorkers = statistics.length;
  const totalJobsThisMonth = statistics.reduce((sum, w) => sum + w.jobs_last_30_days, 0);
  const avgCompletionRate = statistics.length > 0
    ? Math.round(statistics.reduce((sum, w) => sum + w.completion_rate_percent, 0) / statistics.length)
    : 0;
  const totalEarnings = statistics.reduce((sum, w) => sum + w.earnings_last_30_days, 0);

  const cards = [
    {
      title: 'Aktiva Workers',
      value: totalWorkers,
      icon: Users,
      trend: 'up',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
    },
    {
      title: 'Jobb (30d)',
      value: totalJobsThisMonth,
      icon: Briefcase,
      trend: 'up',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
    },
    {
      title: 'Genomsnittlig Completion',
      value: `${avgCompletionRate}%`,
      icon: TrendingUp,
      trend: avgCompletionRate >= 80 ? 'up' : 'down',
      bgColor: avgCompletionRate >= 80 ? 'bg-green-500/10' : 'bg-yellow-500/10',
      textColor: avgCompletionRate >= 80 ? 'text-green-600' : 'text-yellow-600',
    },
    {
      title: 'Intjäning (30d)',
      value: `${Math.round(totalEarnings).toLocaleString('sv-SE')} kr`,
      icon: DollarSign,
      trend: 'up',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className={card.bgColor}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-5 w-5 ${card.textColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${card.textColor}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
