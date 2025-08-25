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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Välkommen tillbaka! Här ser du dina aktiva jobb och dagens statistik.
        </p>
      </div>

      {/* Stats Cards - Mobile optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-blue-700">Aktiva</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-900">{todayStats?.activeJobs || 0}</div>
            <p className="text-xs text-blue-600">pågående</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-700">Färdiga</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-900">{todayStats?.completedToday || 0}</div>
            <p className="text-xs text-green-600">idag</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-purple-700">Timmar</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-purple-900">{todayStats?.hoursToday || 0}h</div>
            <p className="text-xs text-purple-600">idag</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-orange-700">Intäkt</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-orange-900">{todayStats?.earnings || 0} kr</div>
            <p className="text-xs text-orange-600">idag</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs - Mobile optimized */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-lg md:text-xl">Mina aktiva jobb</span>
            <Link to="/worker/pool">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Users className="w-4 h-4 mr-2" />
                Se jobbpool
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!myJobs || myJobs.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Inga aktiva jobb</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Du har inga aktiva jobb just nu.
              </p>
              <Link to="/worker/pool">
                <Button className="w-full sm:w-auto">
                  <Users className="w-4 h-4 mr-2" />
                  Kolla jobbpoolen
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors active:scale-[0.98]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getStatusColor(job.status)}`} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm md:text-base truncate">{job.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-muted-foreground mt-1">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{job.address}, {job.city}</span>
                            </span>
                            <Badge variant="outline" className="w-fit">
                              {getStatusLabel(job.status)}
                            </Badge>
                            <span className="text-primary font-medium">
                              {job.pricing_mode === 'hourly' 
                                ? `${job.hourly_rate} kr/h` 
                                : `${job.fixed_price} kr (fast)`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {job.status === 'in_progress' ? (
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                          <Pause className="w-4 h-4 mr-2" />
                          Pausa
                        </Button>
                      ) : job.status === 'assigned' ? (
                        <Button size="sm" className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700">
                          <Play className="w-4 h-4 mr-2" />
                          Starta
                        </Button>
                      ) : null}
                      
                      <Link to={`/worker/jobs/${job.id}`} className="flex-1 sm:flex-none">
                        <Button size="sm" variant="ghost" className="w-full">
                          Öppna
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions - Mobile optimized with larger touch targets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/worker/pool" className="group">
          <Card className="hover:shadow-md transition-all group-active:scale-95 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-green-900">Jobbpool</h3>
              <p className="text-sm text-green-700 mt-1">Se tillgängliga jobb</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/worker/timesheet" className="group">
          <Card className="hover:shadow-md transition-all group-active:scale-95 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-purple-900">Tidrapport</h3>
              <p className="text-sm text-purple-700 mt-1">Se dina timmar</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/worker/jobs" className="group">
          <Card className="hover:shadow-md transition-all group-active:scale-95 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-orange-900">Alla jobb</h3>
              <p className="text-sm text-orange-700 mt-1">Historik och status</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default WorkerDashboard;