import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PayrollWorkerTable } from '@/components/admin/payroll/PayrollWorkerTable';
import { PayrollDetailModal } from '@/components/admin/payroll/PayrollDetailModal';
import { fetchPayrollSummary } from '@/lib/api/payroll';
import { startOfMonth, endOfMonth, subMonths, addMonths, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import {
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPayroll() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  const { data: workers, isLoading } = useQuery({
    queryKey: ['payroll-summary', startDate, endDate],
    queryFn: () => fetchPayrollSummary(startDate, endDate),
  });

  const totalCost = workers?.reduce((sum, w) => sum + w.gross_salary, 0) || 0;
  const totalHours = workers?.reduce((sum, w) => sum + w.total_hours, 0) || 0;
  const activeWorkers = workers?.length || 0;
  const avgSalary = activeWorkers > 0 ? totalCost / activeWorkers : 0;

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleExport = () => {
    if (!workers) return;

    // Simple CSV export
    const headers = ['Namn', 'Email', 'Timlön', 'Timmar', 'Lön', 'Jobb', 'Lönsamhet %'];
    const rows = workers.map((w) => [
      w.name,
      w.email,
      w.hourly_rate,
      w.total_hours.toFixed(1),
      w.gross_salary,
      w.jobs_count,
      w.profit_margin.toFixed(1),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${format(startDate, 'yyyy-MM')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lönehantering</h1>
            <p className="text-muted-foreground">
              Hantera löner, timmar och lönsamhetsanalys
            </p>
          </div>
          <Button onClick={handleExport} disabled={!workers || workers.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportera CSV
          </Button>
        </div>

        {/* Period Selector */}
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Period</p>
              <p className="text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale: sv })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              disabled={currentDate >= new Date()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total lönekostnad</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCost.toLocaleString()} kr</div>
                <p className="text-xs text-muted-foreground">
                  {format(startDate, 'PPP', { locale: sv })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Timmar denna månad</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHours.toFixed(1)} h</div>
                <p className="text-xs text-muted-foreground">
                  Ø {activeWorkers > 0 ? (totalHours / activeWorkers).toFixed(1) : 0} h/anställd
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Antal aktiva</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeWorkers}</div>
                <p className="text-xs text-muted-foreground">Anställda med timmar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Snitt per anställd</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSalary.toLocaleString()} kr</div>
                <p className="text-xs text-muted-foreground">Månadslön genomsnitt</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Worker Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lönesammanställning</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <PayrollWorkerTable
                workers={workers || []}
                onViewDetails={setSelectedWorkerId}
              />
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <PayrollDetailModal
          workerId={selectedWorkerId}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setSelectedWorkerId(null)}
        />
      </div>
  );
}
