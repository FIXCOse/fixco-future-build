import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Send, User, Clock, MapPin } from 'lucide-react';

interface JobRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: any;
}

export function JobRequestModal({ open, onOpenChange, job }: JobRequestModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available staff with their skills
  const { data: staff = [] } = useQuery({
    queryKey: ['staff-with-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          staff_skills (
            skill_id,
            level,
            skills (name, category)
          )
        `)
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: open
  });

  // Get required skills for the job (based on service_id if available)
  const { data: requiredSkills = [] } = useQuery({
    queryKey: ['job-required-skills', job?.source_id],
    queryFn: async () => {
      if (!job?.source_id) return [];
      
      // First try to get from bookings service_id
      const { data: booking } = await supabase
        .from('bookings')
        .select('service_id')
        .eq('id', job.source_id)
        .single();

      if (booking?.service_id) {
        const { data, error } = await supabase
          .from('service_skills')
          .select(`
            skill_id,
            required,
            skills (name, category)
          `)
          .eq('service_id', booking.service_id);
        
        if (error) throw error;
        return data || [];
      }
      
      return [];
    },
    enabled: open && !!job
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStaff) {
      toast({
        title: "Fel",
        description: "Välj en personal att skicka förfrågan till",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('job_requests')
        .insert([{
          job_id: job.id,
          staff_id: selectedStaff,
          requested_by: (await supabase.auth.getUser()).data.user?.id,
          message: message.trim(),
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Förfrågan skickad",
        description: "Jobbförfrågan har skickats till den valda personalen"
      });

      queryClient.invalidateQueries({ queryKey: ['job-requests'] });
      onOpenChange(false);
      setSelectedStaff('');
      setMessage('');

    } catch (error) {
      console.error('Error sending job request:', error);
      toast({
        title: "Fel",
        description: "Kunde inte skicka förfrågan",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStaffSkillMatch = (staffMember: any) => {
    if (!requiredSkills.length) return { hasRequired: true, matchingSkills: [], missingSkills: [] };
    
    const staffSkillIds = staffMember.staff_skills?.map((ss: any) => ss.skill_id) || [];
    const requiredSkillIds = requiredSkills.filter(rs => rs.required).map(rs => rs.skill_id);
    
    const matchingSkills = requiredSkills.filter(rs => staffSkillIds.includes(rs.skill_id));
    const missingSkills = requiredSkills.filter(rs => rs.required && !staffSkillIds.includes(rs.skill_id));
    
    return {
      hasRequired: missingSkills.length === 0,
      matchingSkills,
      missingSkills
    };
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Skicka Jobbförfrågan</DialogTitle>
        </DialogHeader>

        {/* Job Information */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <h3 className="font-semibold">{job.title}</h3>
          {job.description && (
            <p className="text-sm text-muted-foreground">{job.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.address}, {job.city}
            </div>
            {job.pricing_mode === 'hourly' && job.hourly_rate && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.hourly_rate} SEK/tim
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Välj Personal</Label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Välj personal att skicka förfrågan till" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member: any) => {
                  const skillMatch = getStaffSkillMatch(member);
                  return (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{member.name}</span>
                          <Badge variant="outline">#{member.staff_id}</Badge>
                        </div>
                        <div className="flex gap-1">
                          {skillMatch.hasRequired ? (
                            <Badge variant="default" className="text-xs">Kvalificerad</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">Saknar kompetens</Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Show skill requirements for selected staff */}
          {selectedStaff && (
            <div className="space-y-2">
              <Label>Kompetensmatchning</Label>
              {(() => {
                const member = staff.find(s => s.id === selectedStaff);
                if (!member) return null;
                
                const skillMatch = getStaffSkillMatch(member);
                
                return (
                  <div className="space-y-2">
                    {skillMatch.matchingSkills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-green-600">Matchande kompetenser:</p>
                        <div className="flex flex-wrap gap-1">
                          {skillMatch.matchingSkills.map((skill: any) => (
                            <Badge key={skill.skill_id} variant="default" className="text-xs">
                              {skill.skills.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {skillMatch.missingSkills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-600">Saknade kompetenser:</p>
                        <div className="flex flex-wrap gap-1">
                          {skillMatch.missingSkills.map((skill: any) => (
                            <Badge key={skill.skill_id} variant="destructive" className="text-xs">
                              {skill.skills.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Meddelande (valfritt)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Lägg till eventuella instruktioner eller information om jobbet..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedStaff}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Skickar...' : 'Skicka Förfrågan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}