import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Play, Square, Upload, FileText, User, MapPin, Calendar, Euro, Camera, CheckCircle, Globe, Eye } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toast } from 'sonner';

const AdminOngoingProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [completionData, setCompletionData] = useState({
    publishAsReference: false,
    referenceTitle: '',
    referenceDescription: '',
    referenceCategory: ''
  });

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['ongoing-projects', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          customer:profiles!quotes_customer_id_fkey(first_name, last_name, email, phone),
          property:properties(name, address, city, postal_code)
        `)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`quote_number.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('project_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const startProject = async (project: any) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          project_status: 'started',
          project_started_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;
      toast.success('Projekt startat!');
      refetch();
    } catch (error: any) {
      console.error('Error starting project:', error);
      toast.error(error.message || 'Kunde inte starta projekt');
    }
  };

  const completeProject = async () => {
    if (!selectedProject) return;

    try {
      const updateData: any = {
        project_status: 'completed',
        project_completed_at: new Date().toISOString(),
        publish_as_reference: completionData.publishAsReference
      };

      if (completionData.publishAsReference) {
        updateData.reference_data = {
          title: completionData.referenceTitle,
          description: completionData.referenceDescription,
          category: completionData.referenceCategory,
          location: selectedProject.property?.city || 'Okänd plats',
          budget: selectedProject.total_amount,
          images: [] // TODO: Handle uploaded images
        };
      }

      const { error } = await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', selectedProject.id);

      if (error) throw error;
      
      toast.success('Projekt slutfört!');
      setShowCompleteDialog(false);
      setSelectedProject(null);
      refetch();
    } catch (error: any) {
      console.error('Error completing project:', error);
      toast.error(error.message || 'Kunde inte slutföra projekt');
    }
  };

  const addNote = async () => {
    if (!selectedProject || !newNote.trim()) return;

    try {
      const currentNotes = selectedProject.project_notes || '';
      const timestamp = new Date().toLocaleString('sv-SE');
      const updatedNotes = currentNotes + `\n[${timestamp}] ${newNote}`;

      const { error } = await supabase
        .from('quotes')
        .update({ project_notes: updatedNotes })
        .eq('id', selectedProject.id);

      if (error) throw error;
      
      toast.success('Anteckning tillagd');
      setNewNote('');
      refetch();
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error(error.message || 'Kunde inte lägga till anteckning');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'started': return 'default' as const;
      case 'completed': return 'secondary' as const;
      case 'pending': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'pending': return 'Väntar på start';
      case 'started': return 'Pågående';
      case 'completed': return 'Slutfört';
      default: return status;
    }
  };

  const statusCounts = projects?.reduce((acc, project) => {
    const status = project.project_status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pågående uppdrag</h1>
          <p className="text-muted-foreground">Hantera alla accepterade projekt</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button 
          variant={statusFilter === 'all' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('all')}
        >
          Alla ({projects?.length || 0})
        </Button>
        <Button 
          variant={statusFilter === 'pending' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('pending')}
        >
          Väntar ({statusCounts.pending || 0})
        </Button>
        <Button 
          variant={statusFilter === 'started' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('started')}
        >
          Pågående ({statusCounts.started || 0})
        </Button>
        <Button 
          variant={statusFilter === 'completed' ? 'default' : 'outline'} 
          onClick={() => setStatusFilter('completed')}
        >
          Slutförda ({statusCounts.completed || 0})
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Projekt
            </CardTitle>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Sök projektnummer eller titel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{project.title}</h3>
                      <Badge variant={getStatusBadgeVariant(project.project_status || 'pending')}>
                        {getStatusDisplayName(project.project_status || 'pending')}
                      </Badge>
                    </div>
                    
                    {/* Project Info Row 1 */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {project.quote_number}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {project.customer ? 
                          `${project.customer.first_name} ${project.customer.last_name}` : 
                          'Okänd kund'
                        }
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        {project.total_amount?.toLocaleString()} SEK
                      </div>
                      {project.project_started_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Startad {formatDistanceToNow(new Date(project.project_started_at), { 
                            addSuffix: true, 
                            locale: sv 
                          })}
                        </div>
                      )}
                    </div>

                    {/* Project Info Row 2 - Address & Contact */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      {project.property && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.property.address ? 
                            `${project.property.address}, ${project.property.city}` :
                            project.property.city
                          }
                        </div>
                      )}
                      {project.customer?.email && (
                        <div className="flex items-center gap-1 text-xs">
                          <span>📧</span>
                          {project.customer.email}
                        </div>
                      )}
                      {project.customer?.phone && (
                        <div className="flex items-center gap-1 text-xs">
                          <span>📱</span>
                          {project.customer.phone}
                        </div>
                      )}
                    </div>

                    {/* Description if available */}
                    {project.description && (
                      <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded text-xs line-clamp-2">
                        {project.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {(!project.project_status || project.project_status === 'pending') && (
                      <Button size="sm" onClick={() => startProject(project)}>
                        <Play className="h-4 w-4" />
                        Starta
                      </Button>
                    )}
                    {project.project_status === 'started' && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedProject(project);
                          setShowCompleteDialog(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Slutför
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{project.title}</DialogTitle>
                          <DialogDescription>
                            Projektdetaljer och anteckningar
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          {/* Project Info */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Offertnummer:</span>
                              <div className="font-medium">{project.quote_number}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <div>
                                <Badge variant={getStatusBadgeVariant(project.project_status || 'pending')}>
                                  {getStatusDisplayName(project.project_status || 'pending')}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Kund:</span>
                              <div className="font-medium">
                                {project.customer ? 
                                  `${project.customer.first_name} ${project.customer.last_name}` : 
                                  'Okänd kund'
                                }
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Värde:</span>
                              <div className="font-medium">{project.total_amount?.toLocaleString()} SEK</div>
                            </div>
                          </div>

                          {/* Description */}
                          {project.description && (
                            <div>
                              <span className="text-muted-foreground text-sm">Beskrivning:</span>
                              <p className="mt-1">{project.description}</p>
                            </div>
                          )}

                          {/* Project Notes */}
                          <div className="space-y-2">
                            <span className="text-muted-foreground text-sm">Projektanteckningar:</span>
                            {project.project_notes ? (
                              <div className="bg-muted p-3 rounded-lg">
                                <pre className="text-sm whitespace-pre-wrap">{project.project_notes}</pre>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">Inga anteckningar än</p>
                            )}
                          </div>

                          {/* Add Note */}
                          <div className="space-y-2">
                            <span className="text-muted-foreground text-sm">Lägg till anteckning:</span>
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Skriv en anteckning..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="flex-1"
                              />
                              <Button onClick={addNote} disabled={!newNote.trim()}>
                                Lägg till
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Inga projekt hittades' : 'Inga projekt att visa'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Project Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Slutför projekt</DialogTitle>
            <DialogDescription>
              Markera projektet som slutfört och välj om det ska publiceras som referens.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="publishReference"
                checked={completionData.publishAsReference}
                onChange={(e) => setCompletionData(prev => ({
                  ...prev,
                  publishAsReference: e.target.checked
                }))}
              />
              <label htmlFor="publishReference" className="text-sm">
                Publicera som referens på hemsidan
              </label>
            </div>

            {completionData.publishAsReference && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Referenstitel</label>
                  <Input
                    value={completionData.referenceTitle}
                    onChange={(e) => setCompletionData(prev => ({
                      ...prev,
                      referenceTitle: e.target.value
                    }))}
                    placeholder="T.ex. Köksrenovering Villa Täby"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Kategori</label>
                  <Input
                    value={completionData.referenceCategory}
                    onChange={(e) => setCompletionData(prev => ({
                      ...prev,
                      referenceCategory: e.target.value
                    }))}
                    placeholder="T.ex. VVS & Snickeri"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Beskrivning för referens</label>
                  <Textarea
                    value={completionData.referenceDescription}
                    onChange={(e) => setCompletionData(prev => ({
                      ...prev,
                      referenceDescription: e.target.value
                    }))}
                    placeholder="Beskriv projektet för potentiella kunder..."
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={completeProject} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Slutför projekt
              </Button>
              <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                Avbryt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOngoingProjects;