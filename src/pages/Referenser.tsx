import Breadcrumbs from "@/components/Breadcrumbs";
import TrustChips from "@/components/TrustChips";
import { Button } from "@/components/ui/button-premium";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ArrowRight, MapPin, Calendar, Euro, Plus, Edit, Trash2, Eye, Languages, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCopy } from '@/copy/CopyProvider';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAllReferenceProjects, useUpdateReferenceProject, useCreateReferenceProject, useDeleteReferenceProject, ReferenceProject } from '@/hooks/useReferenceProjects';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import ProjectEditModal from '@/components/admin/ProjectEditModal';
import ProjectDetailModal from '@/components/admin/ProjectDetailModal';
import { EditableSection } from '@/components/EditableSection';
import { EditableText } from '@/components/EditableText';
import { GradientText } from '@/components/v2/GradientText';
import { ProjectsComingSoon } from '@/components/ProjectsComingSoon';
import { ReferenceProjectCard } from '@/components/ReferenceProjectCard';
import { useState } from 'react';

// Helper function to get localized field
const getLocalizedField = (
  project: ReferenceProject, 
  field: 'title' | 'description' | 'location' | 'category' | 'features',
  locale: string
): string | string[] => {
  const svField = `${field}_sv` as keyof ReferenceProject;
  const enField = `${field}_en` as keyof ReferenceProject;
  
  if (locale === 'en' && project[enField]) {
    return project[enField] as string | string[];
  }
  
  return project[svField] as string | string[];
};

const Referenser = () => {
  const { t, locale } = useCopy();
  const { isEditMode } = useEditMode();
  const [editingProject, setEditingProject] = useState<ReferenceProject | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ReferenceProject | null>(null);
  const [isBulkTranslating, setIsBulkTranslating] = useState(false);
  
  const { data: projects = [], isLoading } = useAllReferenceProjects();
  const { user } = useAuth();
  const { role } = useRole();
  const updateProject = useUpdateReferenceProject();
  const createProject = useCreateReferenceProject();
  const deleteProject = useDeleteReferenceProject();

  const isAdmin = role === 'owner' || role === 'admin';

  const handleSaveProject = (projectData: Partial<ReferenceProject>) => {
    if (editingProject) {
      updateProject.mutate({ 
        id: editingProject.id, 
        updates: projectData 
      });
    } else {
      createProject.mutate(projectData as any);
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm(t('pages.references.deleteConfirm'))) {
      deleteProject.mutate(projectId);
    }
  };

  const handleBulkTranslate = async () => {
    if (!window.confirm('Translate all projects without English translations? This may take a few minutes.')) return;

    setIsBulkTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-reference-project', {
        body: { project_ids: [] } // Empty array means translate all missing
      });

      if (error) throw error;

      const result = data as { total: number; successful: number; failed: number };
      toast.success(`Bulk translation complete: ${result.successful}/${result.total} projects translated`);
      
      // Refresh projects list
      window.location.reload();
    } catch (error) {
      console.error('Bulk translation error:', error);
      toast.error('Failed to bulk translate projects');
    } finally {
      setIsBulkTranslating(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      {/* Hero Section */}
      <EditableSection id="references-hero" title="Referenser Hero">
        <section className="pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-background opacity-30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-bold">
                  <GradientText gradient="rainbow">
                    {t('pages.references.title')}
                  </GradientText>
                </h1>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleBulkTranslate}
                      disabled={isBulkTranslating}
                      variant="secondary"
                      className="border-2 border-primary/20"
                    >
                      {isBulkTranslating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Translating...
                        </>
                      ) : (
                        <>
                          <Languages className="mr-2 h-4 w-4" />
                          Bulk Translate All
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('pages.references.newProject')}
                    </Button>
                  </div>
                )}
              </div>
              <EditableText 
                id="references-description"
                initialContent={t('pages.references.description')}
                as="p"
                className="text-xl text-muted-foreground mb-8"
              />
              
              <TrustChips variant="minimal" showAll={true} className="mb-8" />
            </div>
          </div>
        </section>
      </EditableSection>

      {/* Statistics */}
      {projects.length > 0 && (
        <EditableSection id="references-stats" title="Statistik sektion">
          <section className="py-12 bg-muted/10">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">{projects.length}+</div>
                  <EditableText 
                    id="stat-projects-label"
                    initialContent={t('pages.references.stats.completed')}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">4.9★</div>
                  <EditableText 
                    id="stat-rating-label"
                    initialContent={t('pages.references.stats.avgRating')}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {projects.reduce((sum, p) => sum + (p.rot_saving_amount + p.rut_saving_amount), 0).toLocaleString('sv-SE')} kr
                  </div>
                  <EditableText 
                    id="stat-savings-label"
                    initialContent={t('pages.references.stats.savings')}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                  <EditableText 
                    id="stat-satisfaction-label"
                    initialContent={t('pages.references.stats.satisfaction')}
                    className="text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </section>
        </EditableSection>
      )}

      {/* Projects Grid */}
      <EditableSection id="references-grid" title="Projekt grid">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <GradientText gradient="rainbow">
                  {t('pages.references.heading')}
                </GradientText>
              </h2>
              <EditableText 
                id="grid-description"
                initialContent={t('pages.references.gridDescription')}
                as="p"
                className="text-muted-foreground max-w-2xl mx-auto"
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : projects.length === 0 ? (
              <ProjectsComingSoon />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ReferenceProjectCard
                    key={project.id}
                    project={project}
                    locale={locale}
                    isAdmin={isAdmin}
                    isEditMode={isEditMode}
                    onEdit={() => setEditingProject(project)}
                    onDelete={() => handleDeleteProject(project.id)}
                    onView={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            )}
        </div>
      </section>
      </EditableSection>

      {/* Edit Modal */}
      <ProjectEditModal
        project={editingProject}
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveProject}
      />

      {/* Create Modal */}
      <ProjectEditModal
        project={null}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveProject}
        isCreating={true}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Referenser;