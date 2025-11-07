import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { 
  Download, 
  ExternalLink, 
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  FileText,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationDetailModalProps {
  application: any | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function ApplicationDetailModal({ application, isOpen, onClose, onUpdate }: ApplicationDetailModalProps) {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState(application?.admin_notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(
    application?.interview_date ? new Date(application.interview_date) : undefined
  );

  if (!application) return null;

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ admin_notes: adminNotes })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: 'Anteckningar sparade',
        description: 'Admin-anteckningarna har uppdaterats.',
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte spara anteckningarna.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: 'Status uppdaterad',
        description: `Ansökan är nu markerad som "${newStatus}".`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera status.',
        variant: 'destructive',
      });
    }
  };

  const handleInterviewDateChange = async (date: Date | undefined) => {
    setInterviewDate(date);
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ interview_date: date?.toISOString() })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: 'Intervjudatum uppdaterat',
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating interview date:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera intervjudatum.',
        variant: 'destructive',
      });
    }
  };

  const downloadCV = () => {
    if (application.cv_file_path) {
      const { data } = supabase.storage
        .from('job-applications')
        .getPublicUrl(application.cv_file_path);
      
      window.open(data.publicUrl, '_blank');
    }
  };

  const skills = Array.isArray(application.skills) ? application.skills : [];
  const certificates = Array.isArray(application.certificates) ? application.certificates : [];
  const references = Array.isArray(application.work_references) ? application.work_references : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5" />
            {application.first_name} {application.last_name} - {application.profession}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <User className="w-4 h-4 mr-2" />
              Översikt
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Briefcase className="w-4 h-4 mr-2" />
              Kompetenser
            </TabsTrigger>
            <TabsTrigger value="motivation">
              <FileText className="w-4 h-4 mr-2" />
              Motivation
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personuppgifter
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <Label className="text-muted-foreground">Namn</Label>
                    <p className="font-medium">{application.first_name} {application.last_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">E-post</Label>
                    <p className="font-medium">{application.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefon</Label>
                    <p className="font-medium">{application.phone || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Födelsedatum</Label>
                    <p className="font-medium">
                      {application.birth_date ? format(new Date(application.birth_date), 'yyyy-MM-dd') : '-'}
                    </p>
                  </div>
                  {application.address && (
                    <>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Adress</Label>
                        <p className="font-medium">
                          {application.address}
                          {application.postal_code && `, ${application.postal_code}`}
                          {application.city && ` ${application.city}`}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Yrkesuppgifter
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <Label className="text-muted-foreground">Profession</Label>
                    <p className="font-medium">{application.profession}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Erfarenhet</Label>
                    <p className="font-medium">{application.years_experience} år</p>
                  </div>
                </div>
              </div>

              {application.cv_file_path && (
                <div>
                  <Button onClick={downloadCV} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Ladda ner CV
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">🔧 Kompetenser</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Inga kompetenser angivna</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">📜 Certifikat & Behörigheter</h3>
                <div className="space-y-2">
                  {certificates.length > 0 ? (
                    certificates.map((cert: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{cert}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Inga certifikat angivna</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">🚗 Arbetssituation</h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <Label className="text-muted-foreground">Körkort</Label>
                    <p className="font-medium flex items-center gap-2">
                      {application.has_drivers_license ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Ja
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          Nej
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Egna verktyg</Label>
                    <p className="font-medium flex items-center gap-2">
                      {application.has_own_tools ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Ja
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          Nej
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Eget företag</Label>
                    <p className="font-medium flex items-center gap-2">
                      {application.has_company ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Ja
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          Nej
                        </>
                      )}
                    </p>
                  </div>
                  {application.has_company && (
                    <>
                      <div>
                        <Label className="text-muted-foreground">Företagsnamn</Label>
                        <p className="font-medium">{application.company_name || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Organisationsnummer</Label>
                        <p className="font-medium">{application.org_number || '-'}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Tillgänglighet</Label>
                    <p className="font-medium">{application.availability || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Önskat startdatum</Label>
                    <p className="font-medium">
                      {application.preferred_start_date 
                        ? format(new Date(application.preferred_start_date), 'yyyy-MM-dd')
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Motivation Tab */}
          <TabsContent value="motivation" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">💭 Motivation</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{application.motivation || 'Ingen motivation angiven'}</p>
                </div>
              </div>

              {references.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">👥 Referenser</h3>
                  <div className="grid gap-3">
                    {references.map((ref: any, index: number) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg">
                        <p className="font-medium">{ref.name}</p>
                        <p className="text-sm text-muted-foreground">{ref.company}</p>
                        <p className="text-sm">{ref.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-3">🔗 Länkar</h3>
                <div className="space-y-2">
                  {application.linkedin_url && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        LinkedIn-profil
                      </a>
                    </Button>
                  )}
                  {application.portfolio_url && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Portfolio
                      </a>
                    </Button>
                  )}
                  {!application.linkedin_url && !application.portfolio_url && (
                    <p className="text-muted-foreground">Inga länkar angivna</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">📝 Admin-anteckningar</h3>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Skriv anteckningar om ansökan..."
                  className="min-h-[150px]"
                />
                <Button 
                  onClick={handleSaveNotes} 
                  disabled={isSaving}
                  className="mt-2"
                >
                  {isSaving ? 'Sparar...' : 'Spara anteckningar'}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">⚙️ Status & Granskning</h3>
                <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={application.status} 
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Väntande</SelectItem>
                        <SelectItem value="interview">Intervju</SelectItem>
                        <SelectItem value="accepted">Godkänd</SelectItem>
                        <SelectItem value="rejected">Avvisad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Intervjudatum</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !interviewDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {interviewDate ? format(interviewDate, 'PPP', { locale: sv }) : "Välj datum"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={interviewDate}
                          onSelect={handleInterviewDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {application.reviewed_by && (
                    <div>
                      <Label className="text-muted-foreground">Granskad av</Label>
                      <p className="font-medium">
                        {application.reviewed_by}
                        {application.reviewed_at && 
                          ` - ${format(new Date(application.reviewed_at), 'PPP', { locale: sv })}`
                        }
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-muted-foreground">Ansökan skapad</Label>
                    <p className="font-medium">
                      {format(new Date(application.created_at), 'PPP pp', { locale: sv })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">✅ GDPR & Samtycken</h3>
                <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    {application.gdpr_consent ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span>GDPR-samtycke: {application.gdpr_consent ? 'Ja' : 'Nej'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {application.marketing_consent ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span>Marknadsföring: {application.marketing_consent ? 'Ja' : 'Nej'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
