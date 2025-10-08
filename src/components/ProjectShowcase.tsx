import { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Clock, Star, ExternalLink, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useReferenceProjects, useUpdateReferenceProject, useCreateReferenceProject, ReferenceProject } from '@/hooks/useReferenceProjects';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import ProjectEditModal from '@/components/admin/ProjectEditModal';
import ProjectDetailModal from '@/components/admin/ProjectDetailModal';
import { useCopy } from '@/copy/CopyProvider';

const ProjectShowcase = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<ReferenceProject | null>(null);
  const { t, locale } = useCopy();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ReferenceProject | null>(null);
  
  const { data: projects = [], isLoading } = useReferenceProjects();
  const { user } = useAuth();
  const { role } = useRole();
  const updateProject = useUpdateReferenceProject();
  const createProject = useCreateReferenceProject();

  const isAdmin = role === 'owner' || role === 'admin';
  
  // Show featured projects on home page (limit to 6)
  const displayedProjects = projects
    .filter(p => p.is_featured)
    .slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Laddar projekt...</p>
          </div>
        </div>
      </section>
    );
  }

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

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
              <Star className="w-10 h-10 text-primary" />
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nytt projekt
              </Button>
            )}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('projects.latest_title').split(' ').slice(0, 2).join(' ')}{' '}
            <span className="gradient-text">{t('projects.latest_title').split(' ').slice(2).join(' ')}</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('projects.latest_subtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="secondary" className="px-4 py-2">
              <Star className="w-4 h-4 mr-1" />
              {t('projects.satisfied_customers')}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="w-4 h-4 mr-1" />
              {t('projects.on_time_budget')}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <MapPin className="w-4 h-4 mr-1" />
              {t('projects.all_stockholm')}
            </Badge>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayedProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in bg-card/80 backdrop-blur-sm ${
                hoveredProject === project.id ? 'scale-105 z-10' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-lg">
                  {project.category}
                </Badge>

                {/* ROT/RUT Savings Badge */}
                <Badge className="absolute top-4 right-4 bg-green-600 text-white shadow-lg">
                  {project.rot_saving_amount > 0 && `ROT: -${project.rot_saving_amount.toLocaleString('sv-SE')} kr`}
                  {project.rut_saving_amount > 0 && `RUT: -${project.rut_saving_amount.toLocaleString('sv-SE')} kr`}
                  {project.rot_saving_amount === 0 && project.rut_saving_amount === 0 && 'Projekt'}
                </Badge>

                {/* Admin Edit Button */}
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setEditingProject(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}

                {/* View Details Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    size="sm" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg backdrop-blur-sm border-2 border-white/20"
                    onClick={() => setSelectedProject(project)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Se detaljer
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Project Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    {[...Array(project.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Location and Duration */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.duration}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {project.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.features.length - 2} mer
                    </Badge>
                  )}
                </div>

                {/* Price and Client */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Totalpris</p>
                    <p className="font-bold text-primary">{project.price_amount.toLocaleString('sv-SE')} kr</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Klient</p>
                    <p className="font-semibold">{project.client_initials}</p>
                  </div>
                </div>

                {/* Completion Date */}
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Färdigställt {new Date(project.completed_date).toLocaleDateString('sv-SE')}
                </div>
              </CardContent>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Vill du se ditt hem här?
            </h3>
            <p className="text-muted-foreground mb-6">
              Vi skapar drömhemmet du alltid velat ha. Från första skissen till färdigt resultat - 
              vi finns med dig hela vägen. Alla projekt inkluderar ROT-avdrag för maximal besparing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Begär kostnadsfri offert
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                <Link to={locale === 'en' ? '/en/references' : '/referenser'} className="flex items-center">
                  {locale === 'en' ? 'See more projects' : 'Se fler projekt'}
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Projekt 2024</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Nöjda kunder</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">48h</p>
                <p className="text-sm text-muted-foreground">Svarstid</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </section>
  );
};

export default ProjectShowcase;