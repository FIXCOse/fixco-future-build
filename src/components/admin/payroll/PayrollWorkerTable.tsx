import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WorkerPayrollSummary } from '@/lib/api/payroll';

interface PayrollWorkerTableProps {
  workers: WorkerPayrollSummary[];
  onViewDetails: (workerId: string) => void;
}

export function PayrollWorkerTable({ workers, onViewDetails }: PayrollWorkerTableProps) {
  const [sortBy, setSortBy] = useState<keyof WorkerPayrollSummary>('total_hours');
  const [sortDesc, setSortDesc] = useState(true);

  const sortedWorkers = [...workers].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc ? bVal - aVal : aVal - bVal;
    }
    return 0;
  });

  const handleSort = (key: keyof WorkerPayrollSummary) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(true);
    }
  };

  const getProfitBadge = (profitMargin: number) => {
    if (profitMargin >= 30) {
      return (
        <Badge variant="default" className="bg-green-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          {profitMargin.toFixed(1)}%
        </Badge>
      );
    } else if (profitMargin >= 10) {
      return (
        <Badge variant="secondary">
          <Minus className="h-3 w-3 mr-1" />
          {profitMargin.toFixed(1)}%
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <TrendingDown className="h-3 w-3 mr-1" />
          {profitMargin.toFixed(1)}%
        </Badge>
      );
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('hourly_rate')}
            >
              Timlön
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 text-right"
              onClick={() => handleSort('total_hours')}
            >
              Timmar
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 text-right"
              onClick={() => handleSort('gross_salary')}
            >
              Beräknad lön
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 text-right"
              onClick={() => handleSort('jobs_count')}
            >
              Jobb
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 text-right"
              onClick={() => handleSort('profit_margin')}
            >
              Lönsamhet
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedWorkers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Ingen data för vald period
              </TableCell>
            </TableRow>
          ) : (
            sortedWorkers.map((worker) => (
              <TableRow key={worker.worker_id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-xs text-muted-foreground">{worker.email}</p>
                  </div>
                </TableCell>
                <TableCell>{worker.hourly_rate.toLocaleString()} kr</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{worker.total_hours.toFixed(1)} h</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {worker.gross_salary.toLocaleString()} kr
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{worker.jobs_count}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {getProfitBadge(worker.profit_margin)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(worker.worker_id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detaljer
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
