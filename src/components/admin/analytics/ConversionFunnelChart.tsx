import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ConversionFunnel } from '@/lib/api/analytics';

interface ConversionFunnelChartProps {
  data: ConversionFunnel;
}

export function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  const maxCount = Math.max(...data.stages.map((s) => s.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.stages.map((stage, index) => {
            const widthPercentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
            const prevStage = index > 0 ? data.stages[index - 1] : null;
            const conversionRate = prevStage && prevStage.count > 0
              ? ((stage.count / prevStage.count) * 100).toFixed(1)
              : null;

            return (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{stage.stage}</p>
                      <p className="text-sm text-muted-foreground">
                        {stage.count.toLocaleString('sv-SE')} st
                        {conversionRate && (
                          <span className="ml-2 text-xs">
                            ({conversionRate}% från förra steget)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {stage.dropoffRate > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-destructive font-medium">
                        -{stage.dropoffRate.toFixed(1)}% dropoff
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-medium transition-all duration-500"
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {widthPercentage > 10 && (
                      <span className="text-sm">{stage.count.toLocaleString('sv-SE')}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Conversion Rate</p>
              <p className="text-2xl font-bold">
                {data.stages.length > 0 && data.stages[0].count > 0
                  ? ((data.stages[data.stages.length - 1].count / data.stages[0].count) * 100).toFixed(2)
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Största Dropoff</p>
              <p className="text-2xl font-bold text-destructive">
                {Math.max(...data.stages.map((s) => s.dropoffRate)).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
