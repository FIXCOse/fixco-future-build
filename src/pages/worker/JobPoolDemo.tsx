import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Euro, Search, Hand } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JobPoolDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock jobs for demo
  const mockJobs = [
    {
      id: '1',
      title: 'Elinstallation villa',
      description: 'Installation av ny elcentral och uttag i villa på 120 kvm',
      address: 'Storgatan 12',
      city: 'Stockholm',
      postal_code: '11122',
      pricing_mode: 'hourly',
      hourly_rate: 650,
      estimated_hours: 8,
      created_at: '2024-01-15T10:00:00Z',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Lampinstallation kontor',
      description: 'Byte av taklampor i kontorslokal, 15 st LED-armaturer',
      address: 'Kungsgatan 45',
      city: 'Stockholm', 
      postal_code: '11143',
      pricing_mode: 'fixed',
      fixed_price: 4500,
      created_at: '2024-01-14T14:30:00Z',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Elfel felsökning',
      description: 'Felsökning av elfel i kök, troligen kortslutning',
      address: 'Vasagatan 8',
      city: 'Stockholm',
      postal_code: '11120',
      pricing_mode: 'hourly',
      hourly_rate: 750,
      estimated_hours: 3,
      created_at: '2024-01-13T09:15:00Z',
      priority: 'urgent'
    },
    {
      id: '4', 
      title: 'Värmepump installation',
      description: 'Installation av bergvärmepump för villa, inkl. elarbete',
      address: 'Östermalms torg 1',
      city: 'Stockholm',
      postal_code: '11442',
      pricing_mode: 'fixed',
      fixed_price: 12000,
      created_at: '2024-01-12T16:20:00Z',
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Brådskande';
      case 'high': return 'Hög';
      case 'medium': return 'Medium';
      default: return 'Låg';
    }
  };

  const handleClaimJob = (jobId: string, jobTitle: string) => {
    toast({
      title: "Jobb claimat!",
      description: `Du har framgångsrikt claimat jobbet "${jobTitle}". Det finns nu under "Mina jobb".`
    });
  };

  const filteredJobs = mockJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobbpool</h1>
          <p className="text-muted-foreground">
            Claima tillgängliga jobb som passar dina färdigheter.
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {filteredJobs.length} tillgängliga jobb
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök jobb efter titel, beskrivning eller adress..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.address}, {job.city}
                  </div>
                </div>
                <Badge className={getPriorityColor(job.priority)}>
                  {getPriorityLabel(job.priority)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{job.description}</p>
              
              {/* Job Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Prissättning:</span>
                  <div className="flex items-center text-green-600 font-semibold">
                    <Euro className="h-4 w-4 mr-1" />
                    {job.pricing_mode === 'hourly' 
                      ? `${job.hourly_rate} kr/h`
                      : `${job.fixed_price} kr (fast)`
                    }
                  </div>
                </div>
                
                {job.pricing_mode === 'hourly' && job.estimated_hours && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Uppskattad tid:</span>
                    <div className="flex items-center text-blue-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.estimated_hours}h
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Upplagd:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(job.created_at).toLocaleDateString('sv-SE')}
                  </span>
                </div>

                {job.pricing_mode === 'hourly' && job.estimated_hours && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">Uppskattad intäkt:</span>
                    <span className="text-lg font-bold text-green-600">
                      ~{(job.hourly_rate * job.estimated_hours).toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleClaimJob(job.id, job.title)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Hand className="h-4 w-4 mr-2" />
                Claima detta jobb
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Inga jobb hittades</h3>
            <p className="text-muted-foreground">
              Försök med andra sökord eller kolla igen senare.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobPoolDemo;