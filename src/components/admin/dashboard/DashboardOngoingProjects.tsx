import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function DashboardOngoingProjects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['dashboard-ongoing-projects'],
    queryFn: async () => {
      const { data } = await supabase
        .from('quotes')
        .select(`
          id,
          quote_number,
          title,
          project_status,
          project_started_at,
          created_at
        `)
        .eq('status', 'accepted')
        .in('project_status', ['in_progress', 'started'])
        .is('deleted_at', null)
        .order('project_started_at', { ascending: false })
        .limit(5);

      return data;
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Pågående projekt</CardTitle>
          <CardDescription>Senaste aktiva projekt</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/ongoing-projects">
            Visa alla
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!projects || projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Inga pågående projekt
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projekt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Påbörjad</TableHead>
                <TableHead className="text-right">Åtgärd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{project.quote_number}</span>
                      <span className="text-sm text-muted-foreground">{project.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.project_status === 'in_progress' ? 'default' : 'secondary'}>
                      {project.project_status === 'in_progress' ? 'Pågående' : 'Påbörjad'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project.project_started_at 
                      ? format(new Date(project.project_started_at), 'd MMM yyyy', { locale: sv })
                      : format(new Date(project.created_at), 'd MMM yyyy', { locale: sv })
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/ongoing-projects`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
