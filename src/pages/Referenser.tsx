import Breadcrumbs from "@/components/Breadcrumbs";
import TrustChips from "@/components/TrustChips";
import { Button } from "@/components/ui/button-premium";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ArrowRight, MapPin, Calendar, Euro, Plus, Edit, Trash2, Eye } from "lucide-react";
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
import { useState } from 'react';

const Referenser = () => {
  const { t } = useCopy();
  const { isEditMode } = useEditMode();
  const [editingProject, setEditingProject] = useState<ReferenceProject | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ReferenceProject | null>(null);
  
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
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('pages.references.newProject')}
                  </Button>
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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('pages.references.loading')}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Admin Controls */}
                    {isAdmin && (
                      <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        size="sm" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg backdrop-blur-sm border-2 border-white/20"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t('pages.references.viewAllImages')}
                      </Button>
                    </div>
                    
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg">
                      {project.category}
                    </Badge>
                    
                    {(project.rot_saving_amount > 0 || project.rut_saving_amount > 0) && (
                      <Badge className="absolute bottom-4 right-4 bg-green-600 text-white shadow-lg">
                        {project.rot_saving_amount > 0 && `ROT: -${project.rot_saving_amount.toLocaleString('sv-SE')} kr`}
                        {project.rut_saving_amount > 0 && `RUT: -${project.rut_saving_amount.toLocaleString('sv-SE')} kr`}
                      </Badge>
                    )}
                    
                    <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="text-xs font-medium">{project.rating}.0</span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Project Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(project.completed_date).toLocaleDateString('sv-SE')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Euro className="h-4 w-4" />
                          <span>{project.price_amount.toLocaleString('sv-SE')} kr</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4">{project.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.map(feature => (
                        <Badge key={feature} variant="secondary">{feature}</Badge>
                      ))}
                    </div>

                    {/* ROT/RUT Savings */}
                    {(project.rot_saving_amount > 0 || project.rut_saving_amount > 0) && (
                      <div className="p-3 bg-primary/10 rounded-lg mb-4">
                        <div className="text-sm">
                          {project.rot_saving_amount > 0 && (
                            <div>
                              <span className="text-muted-foreground">{t('pages.references.rotSaving')}</span>
                              <span className="font-bold text-primary">{project.rot_saving_amount.toLocaleString('sv-SE')} kr</span>
                            </div>
                          )}
                          {project.rut_saving_amount > 0 && (
                            <div>
                              <span className="text-muted-foreground">{t('pages.references.rutSaving')}</span>
                              <span className="font-bold text-primary">{project.rut_saving_amount.toLocaleString('sv-SE')} kr</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                      <div>
                        <span className="text-muted-foreground">{t('pages.references.duration')}</span>
                        <div className="font-medium">{project.duration}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('pages.references.client')}</span>
                        <div className="font-medium">{project.client_initials}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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