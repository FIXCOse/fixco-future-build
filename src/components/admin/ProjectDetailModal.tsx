import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  MapPin, 
  Calendar, 
  Euro, 
  Clock, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  User,
  Award
} from 'lucide-react';
import { ReferenceProject } from '@/hooks/useReferenceProjects';

interface ProjectDetailModalProps {
  project: ReferenceProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ 
  project, 
  isOpen, 
  onClose 
}: ProjectDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/100"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Image Gallery */}
          <div className="relative h-96 bg-muted">
            {project.images && project.images.length > 0 ? (
              <>
                <img
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} - Bild ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
                  }}
                />
                
                {project.images.length > 1 && (
                  <>
                    {/* Navigation Arrows */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/100"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/100"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Thumbnails */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                      {project.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? 'border-white scale-110' 
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Miniatyr ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop';
                            }}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Image Counter */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                      {currentImageIndex + 1} / {project.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Project Category Badge */}
            <Badge className="absolute top-4 right-16 bg-primary text-primary-foreground shadow-lg">
              {project.category}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(project.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-muted-foreground ml-2">({project.rating}.0)</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-primary mb-1">
                  {project.price_amount.toLocaleString('sv-SE')} kr
                </div>
                <div className="text-sm text-muted-foreground">Totalpris</div>
              </div>
            </div>

            {/* Project Info Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Plats</div>
                      <div className="font-medium">{project.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Projekttid</div>
                      <div className="font-medium">{project.duration}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Färdigställt</div>
                      <div className="font-medium">
                        {new Date(project.completed_date).toLocaleDateString('sv-SE')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Klient</div>
                      <div className="font-medium">{project.client_initials}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Projektbeskrivning</h3>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Funktioner & Detaljer</h3>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* ROT/RUT Savings */}
            {(project.rot_saving_amount > 0 || project.rut_saving_amount > 0) && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Skattebesparingar</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.rot_saving_amount > 0 && (
                    <Card className="border-green-200 bg-green-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Award className="w-6 h-6 text-green-600" />
                          <div>
                            <div className="font-semibold text-green-800">ROT-avdrag</div>
                            <div className="text-xl font-bold text-green-600">
                              -{project.rot_saving_amount.toLocaleString('sv-SE')} kr
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {project.rut_saving_amount > 0 && (
                    <Card className="border-blue-200 bg-blue-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Award className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="font-semibold text-blue-800">RUT-avdrag</div>
                            <div className="text-xl font-bold text-blue-600">
                              -{project.rut_saving_amount.toLocaleString('sv-SE')} kr
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t">
              <Button size="lg" className="group">
                Begär liknande projekt
                <Euro className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Kontakta oss
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}