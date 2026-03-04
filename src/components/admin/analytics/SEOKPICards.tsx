import { Card, CardContent } from '@/components/ui/card';
import { Globe, MousePointerClick, TrendingUp, MapPin } from 'lucide-react';
import type { BounceAnalytics } from '@/lib/api/analyticsDetailed';

interface SEOKPICardsProps {
  data: BounceAnalytics | undefined;
  loading: boolean;
}

export default function SEOKPICards({ data, loading }: SEOKPICardsProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Bounce Rate',
      value: `${data.bounceRate.toFixed(1)}%`,
      sub: `${data.bouncedSessions} av ${data.totalSessions} sessioner`,
      icon: Globe,
      color: data.bounceRate > 70 ? 'text-destructive' : data.bounceRate > 40 ? 'text-yellow-500' : 'text-green-500',
    },
    {
      label: 'Sidor / session',
      value: data.avgPagesPerSession.toFixed(1),
      sub: `${data.totalSessions} totala sessioner`,
      icon: MousePointerClick,
      color: 'text-primary',
    },
    {
      label: 'Top konv. källa',
      value: data.topConvertingSource,
      sub: 'Högst konverteringsgrad',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Bästa landing page',
      value: data.bestLandingPage.length > 30 ? data.bestLandingPage.slice(0, 30) + '…' : data.bestLandingPage,
      sub: 'Min 10 sessioner',
      icon: MapPin,
      color: 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <p className={`text-xl font-bold truncate ${card.color}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
              </div>
              <card.icon className="h-8 w-8 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
