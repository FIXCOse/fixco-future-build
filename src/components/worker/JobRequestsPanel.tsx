import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobRequests, type JobRequest } from '@/hooks/useJobRequests';
import { useJobRequestsRealtime } from '@/hooks/useJobRequestsRealtime';
import { CheckCircle, XCircle, Clock, MapPin, DollarSign, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

export function JobRequestsPanel() {
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { fetchMyRequests, acceptRequest, rejectRequest } = useJobRequests();

  const loadRequests = async () => {
    setLoading(true);
    const data = await fetchMyRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  useJobRequestsRealtime(loadRequests);

  const handleAccept = async (requestId: string, jobId: string) => {
    setProcessingId(requestId);
    const success = await acceptRequest(requestId, jobId);
    if (success) {
      await loadRequests();
    }
    setProcessingId(null);
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    const success = await rejectRequest(requestId);
    if (success) {
      await loadRequests();
    }
    setProcessingId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Laddar jobbförfrågningar...</p>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Nya jobbförfrågningar</h2>
        <Badge variant="default" className="text-lg">
          {requests.length} {requests.length === 1 ? 'förfrågan' : 'förfrågningar'}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => {
          const job = request.jobs;
          const expiresIn = formatDistanceToNow(new Date(request.expires_at), {
            locale: sv,
            addSuffix: true
          });

          return (
            <Card key={request.id} className="border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">Svarstid: {expiresIn}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Ny
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.description && (
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                )}

                <div className="space-y-2">
                  {job.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.address}, {job.city}</span>
                    </div>
                  )}

                  {job.estimated_hours && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Uppskattad tid: {job.estimated_hours} timmar</span>
                    </div>
                  )}

                  {job.bonus_amount && job.bonus_amount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        Bonus: {job.bonus_amount} kr
                      </span>
                    </div>
                  )}
                </div>

                {request.message && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm italic">"{request.message}"</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleAccept(request.id, job.id)}
                    disabled={processingId === request.id}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Acceptera
                  </Button>
                  <Button
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                    variant="outline"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Avslå
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
