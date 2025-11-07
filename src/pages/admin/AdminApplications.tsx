import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Mail, Calendar, FileText, Loader2, Users, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";
import { ApplicationDetailModal } from "@/components/admin/ApplicationDetailModal";

const AdminApplications = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredApplications = applications?.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter(a => a.status === 'pending').length || 0,
    interview: applications?.filter(a => a.status === 'interview_scheduled').length || 0,
    accepted: applications?.filter(a => a.status === 'accepted').length || 0,
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus, reviewed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success("Status uppdaterad");
      refetch();
    } catch (error) {
      toast.error("Kunde inte uppdatera status");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { label: "Väntande", variant: "secondary" },
      reviewing: { label: "Granskas", variant: "default" },
      interview_scheduled: { label: "Intervju bokad", variant: "default" },
      accepted: { label: "Accepterad", variant: "default" },
      rejected: { label: "Avböjd", variant: "destructive" },
      converted: { label: "Konverterad", variant: "default" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Jobbansökningar</h1>
        <p className="text-muted-foreground">Hantera ansökningar från hantverkare</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Totalt</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Väntande</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Intervjuer</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Accepterade</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Sök efter namn eller e-post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-96"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla</SelectItem>
                <SelectItem value="pending">Väntande</SelectItem>
                <SelectItem value="reviewing">Granskas</SelectItem>
                <SelectItem value="interview_scheduled">Intervju bokad</SelectItem>
                <SelectItem value="accepted">Accepterade</SelectItem>
                <SelectItem value="rejected">Avböjda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Yrke</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Erfarenhet</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications?.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    {app.first_name} {app.last_name}
                  </TableCell>
                  <TableCell>{app.profession}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.experience_years} år</TableCell>
                  <TableCell>
                    {format(new Date(app.created_at), 'PPP', { locale: sv })}
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {app.cv_file_path && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const { data } = supabase.storage.from('job-applications').getPublicUrl(app.cv_file_path);
                            window.open(data.publicUrl, '_blank');
                          }}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                      <Select
                        value={app.status}
                        onValueChange={(val) => updateStatus(app.id, val)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Väntande</SelectItem>
                          <SelectItem value="reviewing">Granskas</SelectItem>
                          <SelectItem value="interview_scheduled">Intervju</SelectItem>
                          <SelectItem value="accepted">Acceptera</SelectItem>
                          <SelectItem value="rejected">Avböj</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onUpdate={refetch}
      />
    </div>
  );
};

export default AdminApplications;
