import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, ArrowRight, FileText, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchJobs } from '@/lib/api/jobs';
import { useJobsRealtime } from '@/hooks/useJobsRealtime';
import { supabase } from '@/integrations/supabase/client';

const MyJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs({ assigned_to_me: true });
      setJobs(data);
      console.log('MyJobs - Loaded jobs:', data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadJobs();
    }
  }, [userId]);

  useJobsRealtime(() => {
    console.log('MyJobs - Realtime update');
    loadJobs();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      case 'approved': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Pågår';
      case 'assigned': return 'Tilldelad';
      case 'paused': return 'Pausad';
      case 'completed': return 'Färdig';
      case 'approved': return 'Godkänd';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar dina jobb...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <FileText className="w-8 h-8" />
          Mina jobb
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-2">
          Alla jobb som du har claimat eller blivit tilldelad
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="text-xl md:text-2xl font-bold text-blue-900">
              {jobs.filter(j => j.status === 'assigned').length}
            </div>
            <p className="text-xs text-blue-700">Tilldelade</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="text-xl md:text-2xl font-bold text-green-900">
              {jobs.filter(j => j.status === 'in_progress').length}
            </div>
            <p className="text-xs text-green-700">Pågående</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-4">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {jobs.filter(j => j.status === 'completed').length}
            </div>
            <p className="text-xs text-gray-700">Färdiga</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="text-xl md:text-2xl font-bold text-purple-900">
              {jobs.filter(j => j.status === 'approved').length}
            </div>
            <p className="text-xs text-purple-700">Godkända</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Inga jobb än</h3>
              <p className="text-muted-foreground mb-6">
                Du har inga tilldelade jobb än. Gå till jobbpoolen för att claima ditt första jobb!
              </p>
              <Link to="/worker/pool">
                <Button size="lg">
                  Gå till jobbpoolen
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`} />
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                    </div>
                    {job.description && (
                      <p className="text-sm text-muted-foreground">
                        {job.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">
                    {getStatusLabel(job.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* EXTRA BONUS DISPLAY */}
                  {job.bonus_amount && job.bonus_amount > 0 && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-3 border-yellow-500 rounded-lg p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Gift className="w-8 h-8 text-yellow-600 animate-pulse" />
                        <div>
                          <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">
                            EXTRA BONUS
                          </p>
                          <p className="text-2xl font-black text-yellow-900">
                            +{job.bonus_amount} kr
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Worker Compensation - Show as EXTRA BONUS */}
                  {job.admin_set_price && job.admin_set_price > 0 && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-3 border-yellow-500 rounded-lg p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Gift className="w-8 h-8 text-yellow-600 animate-pulse" />
                        <div>
                          <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">
                            EXTRA BONUS
                          </p>
                          <p className="text-2xl font-black text-yellow-900">
                            +{job.admin_set_price} kr
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Job Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {job.address && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{job.address}, {job.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link to={`/worker/jobs/${job.id}`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Visa detaljer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;