import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchWorkerPayrollDetails } from '@/lib/api/payroll';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Clock, Briefcase, TrendingUp, Mail, Phone } from 'lucide-react';

interface PayrollDetailModalProps {
  workerId: string | null;
  startDate: Date;
  endDate: Date;
  onClose: () => void;
}

export function PayrollDetailModal({
  workerId,
  startDate,
  endDate,
  onClose,
}: PayrollDetailModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['worker-payroll-details', workerId, startDate, endDate],
    queryFn: () => fetchWorkerPayrollDetails(workerId!, startDate, endDate),
    enabled: !!workerId,
  });

  if (!workerId) return null;

  const worker = data?.worker;
  const timeLogs = data?.timeLogs || [];
  const staff = worker?.staff?.[0];

  const totalHours = timeLogs.reduce(
    (sum, log: any) => sum + (log.hours || log.manual_hours || 0),
    0
  );
  const grossSalary = totalHours * (staff?.hourly_rate || 0);

  return (
    <Dialog open={!!workerId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lönedetaljer</DialogTitle>
          <DialogDescription>
            Period: {format(startDate, 'PPP', { locale: sv })} -{' '}
            {format(endDate, 'PPP', { locale: sv })}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Worker Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personuppgifter</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Namn</p>
                  <p className="font-medium">
                    {worker?.first_name} {worker?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roll</p>
                  <Badge>{worker?.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {worker?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timlön</p>
                  <p className="font-semibold">{staff?.hourly_rate?.toLocaleString()} kr</p>
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Totalt timmar</p>
                      <p className="text-2xl font-bold">{totalHours.toFixed(1)} h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Antal jobb</p>
                      <p className="text-2xl font-bold">
                        {new Set(timeLogs.map((l: any) => l.job_id)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Beräknad lön</p>
                      <p className="text-2xl font-bold">{grossSalary.toLocaleString()} kr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tidsloggning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {timeLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Inga tidloggar för denna period
                    </p>
                  ) : (
                    timeLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{log.jobs?.title || 'Jobb'}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), 'PPP', { locale: sv })}
                          </p>
                          {log.note && (
                            <p className="text-xs text-muted-foreground mt-1">{log.note}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            {(log.hours || log.manual_hours || 0).toFixed(1)} h
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {((log.hours || log.manual_hours || 0) * (staff?.hourly_rate || 0)).toLocaleString()}{' '}
                            kr
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
