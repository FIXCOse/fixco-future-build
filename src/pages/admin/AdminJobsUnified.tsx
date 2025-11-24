import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2, Briefcase, Send, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminBack from '@/components/admin/AdminBack';
import { LogoUploadButton } from '@/components/admin/quotes/LogoUploadButton';

// Import the existing components' content
import { AllJobsTab } from '@/components/admin/jobs/AllJobsTab';
import { SendRequestsTab } from '@/components/admin/jobs/SendRequestsTab';
import { ActiveRequestsTab } from '@/components/admin/jobs/ActiveRequestsTab';

const AdminJobsUnified = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobbhantering</h1>
          <p className="text-muted-foreground">Hantera alla jobb, skicka förfrågningar och följ status</p>
        </div>
        <div className="flex items-center gap-3">
          <LogoUploadButton />
          <Link to="/admin/job-requests-trash">
            <Button variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Papperskorg
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Alla Jobb
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Skicka Förfrågningar
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Aktiva Förfrågningar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AllJobsTab />
        </TabsContent>

        <TabsContent value="send">
          <SendRequestsTab />
        </TabsContent>

        <TabsContent value="requests">
          <ActiveRequestsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminJobsUnified;
