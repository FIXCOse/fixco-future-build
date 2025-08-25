import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  MapPin,
  Play,
  Pause,
  Users,
  FileText
} from 'lucide-react';
import { fetchJobs } from '@/lib/api/jobs';
import { useJobsRealtime } from '@/hooks/useJobsRealtime';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const WorkerDashboard = () => {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);

  const { data: myJobs, refetch: refetchMyJobs } = useQuery({
    queryKey: ['worker-my-jobs'],
    queryFn: () => fetchJobs({ assigned_to_me: true, status: ['assigned', 'in_progress'] }),
  });

  const { data: todayStats } = useQuery({
    queryKey: ['worker-today-stats'],
    queryFn: async () => {
      // This would be a more specific query for today's stats
      const jobs = await fetchJobs({ assigned_to_me: true });
      return {
        activeJobs: jobs.filter(j => j.status === 'in_progress').length,
        completedToday: jobs.filter(j => j.status === 'completed').length,
        hoursToday: 0, // Would calculate from time logs
        earnings: 0 // Would calculate from completed work
      };
    },
  });

  // Real-time updates
  useJobsRealtime(() => {
    refetchMyJobs();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Pågår';
      case 'assigned': return 'Tilldelad';
      case 'paused': return 'Pausad';
      case 'completed': return 'Färdig';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Välkommen tillbaka! Här ser du dina aktiva jobb och dagens statistik.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva jobb</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.activeJobs || 0}</div>
            <p className="text-xs text-muted-foreground">pågående uppdrag</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Färdiga idag</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.completedToday || 0}</div>
            <p className="text-xs text-muted-foreground">avklarade jobb</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timmar idag</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.hoursToday || 0}h</div>
            <p className="text-xs text-muted-foreground">arbetade timmar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dagens intäkt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats?.earnings || 0} kr</div>
            <p className="text-xs text-muted-foreground">baserat på färdiga jobb</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Mina aktiva jobb
            <Link to="/worker/pool">
              <Button variant="outline" size="sm">
                Se jobbpool
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!myJobs || myJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Du har inga aktiva jobb just nu.
              <br />
              <Link to="/worker/pool" className="text-primary hover:underline">
                Kolla jobbpoolen för nya uppdrag
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`} />
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {job.address}, {job.city}
                          </span>
                          <Badge variant="outline">
                            {getStatusLabel(job.status)}
                          </Badge>
                          <span>
                            {job.pricing_mode === 'hourly' 
                              ? `${job.hourly_rate} kr/h` 
                              : `${job.fixed_price} kr (fast)`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {job.status === 'in_progress' ? (
                      <Button size="sm" variant="outline">
                        <Pause className="w-4 h-4 mr-2" />
                        Pausa
                      </Button>
                    ) : job.status === 'assigned' ? (
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Starta
                      </Button>
                    ) : null}
                    
                    <Link to={`/worker/jobs/${job.id}`}>
                      <Button size="sm" variant="ghost">
                        Öppna
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/worker/pool">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Jobbpool</h3>
              <p className="text-sm text-muted-foreground">Se tillgängliga jobb</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/worker/timesheet">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Tidrapport</h3>
              <p className="text-sm text-muted-foreground">Se dina timmar</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/worker/jobs">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Alla jobb</h3>
              <p className="text-sm text-muted-foreground">Historik och status</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default WorkerDashboard;