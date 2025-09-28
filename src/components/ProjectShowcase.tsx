import { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Clock, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProjectShowcase = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: "Moderna Köksrenovering",
      location: "Östermalm, Stockholm",
      category: "Kök & Badrum",
      duration: "3 veckor",
      completedDate: "2024-01-15",
      price: "185 000 kr",
      rotSaving: "92 500 kr",
      rating: 5,
      description: "Komplett renovering med marmorbänkskivor och integrerade vitvaror",
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556909185-4d3f0e82b799?w=800&h=600&fit=crop"
      ],
      features: ["Marmorbänkskivor", "Integrerade vitvaror", "LED-belysning", "Mjuka stängningar"],
      clientInitials: "M.L"
    },
    {
      id: 2,
      title: "Lyxigt Spa-badrum",
      location: "Södermalm, Stockholm", 
      category: "Badrum",
      duration: "4 veckor",
      completedDate: "2024-02-10",
      price: "220 000 kr",
      rotSaving: "110 000 kr",
      rating: 5,
      description: "Spa-känsla med natursten, golvvärme och regnduschhuvud",
      images: [
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&h=600&fit=crop"
      ],
      features: ["Natursten", "Golvvärme", "Regnduschhuvud", "Handdukstork"],
      clientInitials: "A.S"
    },
    {
      id: 3,
      title: "Skandinavisk Vardagsrum",
      location: "Vasastan, Stockholm",
      category: "Vardagsrum", 
      duration: "2 veckor",
      completedDate: "2024-03-05",
      price: "95 000 kr",
      rotSaving: "47 500 kr",
      rating: 5,
      description: "Minimalistisk design med naturliga material och smarta förvaringslösningar",
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop"
      ],
      features: ["Inbyggd förvaring", "Parkettgolv", "Smart belysning", "Eldstad"],
      clientInitials: "L.E"
    },
    {
      id: 4,
      title: "Trädgårdsaltan Premium",
      location: "Djursholm, Danderyd",
      category: "Trädgård & Utomhus",
      duration: "3 veckor", 
      completedDate: "2024-03-20",
      price: "150 000 kr",
      rotSaving: "75 000 kr",
      rating: 5,
      description: "Lyxig altan med integrerad utomhuskök och lounge-område",
      images: [
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop"
      ],
      features: ["Utomhuskök", "Pergola", "LED-streifen", "Väderskydd"],
      clientInitials: "K.H"
    },
    {
      id: 5,
      title: "Smart Hemkontor",
      location: "Gamla Stan, Stockholm",
      category: "Kontor & Arbetsrum",
      duration: "1 vecka",
      completedDate: "2024-04-02",
      price: "75 000 kr", 
      rotSaving: "37 500 kr",
      rating: 5,
      description: "Ergonomiskt hemkontor med smarta lösningar och perfekt belysning",
      images: [
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
      ],
      features: ["Höj/sänkbart skrivbord", "Akustikpaneler", "Smart belysning", "Kabelhantering"],
      clientInitials: "J.P"
    },
    {
      id: 6,
      title: "Barnrums Äventyr",
      location: "Lidingö, Stockholm",
      category: "Barnrum", 
      duration: "2 veckor",
      completedDate: "2024-04-15",
      price: "65 000 kr",
      rotSaving: "32 500 kr", 
      rating: 5,
      description: "Kreativt och säkert barnrum med lekfulla element och smarta förvaringslösningar",
      images: [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
      ],
      features: ["Klättervägg", "Inbyggd säng", "Leksaksförvaring", "Säker design"],
      clientInitials: "H.W"
    }
  ];

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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Star className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Se våra <span className="gradient-text">senaste projekt</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Från drömkök till lyxiga badrum - våra senaste projekt visar kvaliteten och kreativiteten 
            som våra kunder får. Alla med garanterat ROT-avdrag.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="secondary" className="px-4 py-2">
              <Star className="w-4 h-4 mr-1" />
              100% nöjda kunder
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="w-4 h-4 mr-1" />
              I tid & budget
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <MapPin className="w-4 h-4 mr-1" />
              Hela Stockholm
            </Badge>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
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
                  src={project.images[0]}
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

                {/* ROT Savings Badge */}
                <Badge className="absolute top-4 right-4 bg-green-600 text-white shadow-lg">
                  ROT: -{project.rotSaving}
                </Badge>

                {/* View Details Button - appears on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    size="sm" 
                    className="bg-white/90 text-primary hover:bg-white/100 shadow-lg backdrop-blur-sm"
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
                    <p className="font-bold text-primary">{project.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Klient</p>
                    <p className="font-semibold">{project.clientInitials}</p>
                  </div>
                </div>

                {/* Completion Date */}
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Färdigställt {new Date(project.completedDate).toLocaleDateString('sv-SE')}
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
                Se fler projekt
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">50+</p>
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
    </section>
  );
};

export default ProjectShowcase;