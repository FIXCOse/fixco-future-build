import React from 'react';
import { useContentList } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Eye, CheckCircle } from 'lucide-react';

const AdminTranslations: React.FC = () => {
  const { data: content, isLoading, refetch } = useContentList();

  const handleApproveAndPublish = async (id: string, enDraftJson: any) => {
    try {
      // First get current version
      const { data: currentContent } = await supabase
        .from('content')
        .select('version')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('content')
        .update({
          en_live_json: enDraftJson,
          en_status: 'approved',
          en_last_reviewed_at: new Date().toISOString(),
          version: (currentContent?.version || 0) + 1
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Content approved and published live!');
      refetch();
    } catch (error) {
      toast.error('Failed to approve content');
      console.error(error);
    }
  };

  const handleTranslate = async (id: string, svJson: any, type: string) => {
    try {
      const { error } = await supabase.functions.invoke('translate-content', {
        body: { id, sv_json: svJson, type }
      });

      if (error) throw error;

      toast.success('Translation initiated');
      refetch();
    } catch (error) {
      toast.error('Translation failed');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pendingItems = content?.filter(item => 
    item.en_status === 'needs_review' || item.en_status === 'missing'
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Translations</h1>
        <p className="text-muted-foreground">Manage English translations and publishing</p>
      </div>

      <div className="space-y-4">
        {pendingItems.map((item) => (
          <div key={item.id} className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{item.sv_path}</h3>
                <p className="text-sm text-muted-foreground">→ {item.en_path}</p>
              </div>
              <Badge variant={item.en_status === 'missing' ? 'destructive' : 'secondary'}>
                {item.en_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Swedish Content</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p><strong>Title:</strong> {item.sv_json?.title}</p>
                  <p><strong>H1:</strong> {item.sv_json?.h1}</p>
                </div>
              </div>
              
              {item.en_draft_json && (
                <div>
                  <h4 className="font-medium mb-2">English Draft</h4>
                  <div className="bg-muted p-3 rounded text-sm">
                    <p><strong>Title:</strong> {item.en_draft_json?.title}</p>
                    <p><strong>H1:</strong> {item.en_draft_json?.h1}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {item.en_status === 'missing' && (
                <Button
                  onClick={() => handleTranslate(item.id, item.sv_json, item.type)}
                  variant="outline"
                >
                  Generate Translation
                </Button>
              )}
              
              {item.en_status === 'needs_review' && item.en_draft_json && (
                <Button
                  onClick={() => handleApproveAndPublish(item.id, item.en_draft_json)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Publish LIVE
                </Button>
              )}
            </div>
          </div>
        ))}

        {pendingItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">All content is up to date!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTranslations;