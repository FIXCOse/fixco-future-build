import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ROTToggle from "@/components/ROTToggle";
import { Button } from "@/components/ui/button-premium";
import { servicesData, SubService } from "@/data/servicesData";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Phone,
  Calculator,
  Calendar,
  MapPin,
  Star
} from "lucide-react";

const ServiceDetail = () => {
  const { slug } = useParams();
  const [showROTPrice, setShowROTPrice] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const service = servicesData.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tjänsten hittades inte</h1>
            <Link to="/tjanster">
              <Button variant="premium">Tillbaka till tjänster</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = service.icon;

  // Pagination logic
  const totalPages = Math.ceil(service.subServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubServices = service.subServices.slice(startIndex, startIndex + itemsPerPage);

  // Related services (other services user might be interested in)
  const relatedServices = servicesData
    .filter(s => s.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 gradient-primary-subtle rounded-xl flex items-center justify-center mr-6">
                <IconComponent className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">{service.title}</h1>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              {service.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="cta" size="lg">
                <Calculator className="h-5 w-5 mr-2" />
                Begär offert
              </Button>
              <Button variant="ghost-premium" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Ring 08-123 456 78
              </Button>
            </div>

            {/* Service Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{service.subServices.length}</div>
                <div className="text-sm text-muted-foreground">Olika tjänster</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24h</div>
                <div className="text-sm text-muted-foreground">Projektstart</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50%</div>
                <div className="text-sm text-muted-foreground">ROT-rabatt</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Garanterat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>F-skatt & försäkring</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Start inom 5 dagar</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Uppsala & Stockholm</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-primary" />
              <span>98% kundnöjdhet</span>
            </div>
          </div>
        </div>
      </section>

      {/* ROT Price Toggle */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ROTToggle 
              defaultEnabled={showROTPrice}
              onChange={setShowROTPrice}
            />
          </div>
        </div>
      </section>

      {/* Sub-services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Alla våra {service.title.toLowerCase()}stjänster</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {service.subServices.length} specialiserade tjänster med transparent prissättning. 
              Alla priser inkluderar moms och kan kombineras med ROT-avdrag för 50% rabatt.
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Tillgängligt i Uppsala & Stockholm</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSubServices.map((subService, index) => (
              <div 
                key={subService.id}
                className="card-premium p-5 hover:shadow-glow transition-all duration-300 animate-fade-in-up hover-scale"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-foreground leading-tight">{subService.title}</h3>
                  <div className="flex flex-col space-y-1">
                    <Badge 
                      variant={subService.rotEligible ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {subService.rotEligible ? "ROT" : "EJ ROT"}
                    </Badge>
                     <Badge 
                       variant="outline"
                       className="text-xs capitalize"
                     >
                       {subService.location}
                     </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {subService.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kategori:</span>
                    <span className="font-medium">{subService.category}</span>
                  </div>
                  {subService.room && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rum:</span>
                      <span className="font-medium">{subService.room}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plats:</span>
                    <span className="font-medium capitalize">{subService.location}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-border pt-4 mb-4">
                  {showROTPrice && subService.rotEligible ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">Ordinarie pris:</span>
                        <span className="text-sm font-semibold line-through text-muted-foreground">
                          {subService.basePrice}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-primary">Med ROT-avdrag:</span>
                        <span className="text-lg font-bold gradient-text">
                          {subService.rotPrice}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">50% rabatt med ROT</div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Pris:</span>
                        <span className="text-lg font-bold">{subService.basePrice}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">inkl. moms</div>
                    </>
                  )}
                </div>

                {/* CTA */}
                <Button 
                  variant="premium" 
                  size="sm" 
                  className="w-full group"
                >
                  {subService.priceType === 'offert' ? (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Begär offert
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Boka nu
                    </>
                  )}
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Föregående
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "premium" : "ghost"}
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
              
              <Button 
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Nästa
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Kunder bokar även</h2>
            <p className="text-muted-foreground">
              Relaterade tjänster som ofta kombineras med {service.title.toLowerCase()}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((relatedService) => {
              const RelatedIcon = relatedService.icon;
              return (
                <div key={relatedService.slug} className="card-premium p-6 text-center hover-scale">
                  <div className="w-16 h-16 gradient-primary-subtle rounded-xl flex items-center justify-center mx-auto mb-4">
                    <RelatedIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{relatedService.title}</h3>
                  <p className="text-muted-foreground mb-4">{relatedService.description}</p>
                  <div className="text-sm mb-4">
                    <span className="font-semibold text-primary">Från {relatedService.rotPrice}</span>
                    <span className="text-muted-foreground"> med ROT</span>
                  </div>
                  <Link to={`/tjanster/${relatedService.slug}`}>
                    <Button variant="ghost-premium" size="sm" className="w-full">
                      Se tjänster
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-primary-subtle opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Redo att komma igång med ditt <span className="gradient-text">{service.title.toLowerCase()}</span>projekt?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Kontakta oss idag för en kostnadsfri konsultation. Vi hjälper dig från idé till färdigt resultat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="cta" size="xl">
                <Calculator className="h-5 w-5 mr-2" />
                Begär kostnadsfri offert
              </Button>
              <Button variant="ghost-premium" size="xl">
                <Phone className="h-5 w-5 mr-2" />
                Ring 08-123 456 78
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Snabb start</h3>
                <p className="text-sm text-muted-foreground">
                  Vi kan påbörja ditt projekt inom 24-48 timmar
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Trygg garanti</h3>
                <p className="text-sm text-muted-foreground">
                  Alla våra arbeten omfattas av branschens bästa garanti
                </p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Kvalitetsföretag</h3>
                <p className="text-sm text-muted-foreground">
                  F-skatt, försäkringar och 98% nöjda kunder
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;