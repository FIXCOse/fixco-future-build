import { useState, useEffect } from 'react';
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
  FileText,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { useJobsData } from '@/hooks/useJobsData';
import { useJobsRealtime } from '@/hooks/useJobsRealtime';
import { supabase } from '@/integrations/supabase/client';

const WorkerDashboard = () => {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const { jobs, loading } = useJobsData();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      console.log('Worker Dashboard - User ID:', user?.id);
      console.log('Worker Dashboard - All jobs:', jobs);
    };
    getUser();
  }, [jobs]);

  // Filter jobs assigned to current user
  const myJobs = jobs.filter(job => job.assigned_worker_id === userId);
  const activeJobs = myJobs.filter(job => 
    job.status === 'assigned' || job.status === 'in_progress' || job.status === 'paused'
  );
  
  console.log('Worker Dashboard - My jobs:', myJobs);
  console.log('Worker Dashboard - Active jobs:', activeJobs);
  console.log('Worker Dashboard - Total jobs from DB:', jobs.length);

  // Calculate stats
  const today = new Date().toDateString();
  const completedToday = myJobs.filter(job => 
    job.status === 'completed' && 
    new Date(job.created_at).toDateString() === today
  ).length;

  const stats = {
    activeJobs: activeJobs.length,
    completedToday,
    hoursToday: 0, // Would need time_logs data
    earnings: 0 // Would need time_logs data
  };

  useJobsRealtime(() => {
    console.log('Worker Dashboard - Realtime update triggered');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Laddar dashboard...</p>
      </div>
    );
  }

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
            <div className="text-xl md:text-2xl font-bold text-blue-900">{stats.activeJobs}</div>
            <p className="text-xs text-blue-600">pågående</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-700">Färdiga</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-900">{stats.completedToday}</div>
            <p className="text-xs text-green-600">idag</p>
          </CardContent>
        </Card>

        {stats.hoursToday > 0 && (
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-purple-700">Timmar</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-purple-900">{stats.hoursToday}h</div>
              <p className="text-xs text-purple-600">idag</p>
            </CardContent>
          </Card>
        )}

        {stats.earnings > 0 && (
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-orange-700">Intäkt</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-orange-900">{stats.earnings.toLocaleString('sv-SE')} kr</div>
              <p className="text-xs text-orange-600">idag</p>
            </CardContent>
          </Card>
        )}
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
          <div className="space-y-3">
            {activeJobs.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium mb-2">Inga aktiva jobb</p>
                <p className="text-muted-foreground mb-6">
                  Du har inga tilldelade jobb för tillfället. Kolla jobbpoolen för att hitta lediga jobb!
                </p>
                <Link to="/worker/pool">
                  <Button size="lg">
                    <Users className="w-4 h-4 mr-2" />
                    Gå till jobbpoolen
                  </Button>
                </Link>
              </div>
            ) : (
              activeJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors active:scale-[0.98]"
              >
                <div className="flex flex-col gap-4">
                  {/* EXTRA BONUS - Highest priority */}
                  {job.bonus_amount && job.bonus_amount > 0 && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-3 border-yellow-500 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-6 h-6 text-yellow-600 animate-pulse flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-yellow-800 uppercase">
                            EXTRA BONUS
                          </p>
                          <p className="text-xl font-black text-yellow-900">
                            +{job.bonus_amount} kr
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Worker Compensation - Show as EXTRA BONUS */}
                  {job.admin_set_price && job.admin_set_price > 0 && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-3 border-yellow-500 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-6 h-6 text-yellow-600 animate-pulse flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-yellow-800 uppercase">EXTRA BONUS</p>
                          <p className="text-xl font-black text-yellow-900">+{job.admin_set_price} kr</p>
                        </div>
                      </div>
                    </div>
                  )}

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
                            {job.pricing_mode === 'hourly' && job.hourly_rate && job.hourly_rate > 0 && (
                              <span className="text-primary font-medium">
                                {job.hourly_rate} kr/h
                              </span>
                            )}
                            {job.pricing_mode === 'fixed' && job.fixed_price && job.fixed_price > 0 && (
                              <span className="text-primary font-medium">
                                {job.fixed_price} kr (fast)
                              </span>
                            )}
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
              </div>
              ))
            )}
          </div>
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