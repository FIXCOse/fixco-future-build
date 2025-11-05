import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Customer {
  id: string;
  name: string;
  type: string;
  bookingCount: number;
  totalSpent: number;
  lastBooking: string;
}

interface TopCustomersTableProps {
  customers: Customer[];
}

const customerTypeLabels: Record<string, string> = {
  company: 'Företag',
  private: 'Privat',
  brf: 'BRF',
};

const customerTypeColors: Record<string, 'default' | 'secondary' | 'outline'> = {
  company: 'default',
  private: 'secondary',
  brf: 'outline',
};

export function TopCustomersTable({ customers }: TopCustomersTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Kunder</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kund</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead className="text-right">Bokningar</TableHead>
              <TableHead className="text-right">Totalt Spenderat</TableHead>
              <TableHead className="text-right">Senaste Bokning</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>
                  <Badge variant={customerTypeColors[customer.type] || 'default'}>
                    {customerTypeLabels[customer.type] || customer.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{customer.bookingCount}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(customer.totalSpent)}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {format(new Date(customer.lastBooking), 'PPP', { locale: sv })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
