import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalPricingToggle from "@/components/GlobalPricingToggle";
import { usePriceStore } from "@/stores/priceStore";
import { calcDisplayPrice, isEligibleForMode } from "@/utils/priceCalculation";
import { Button } from "@/components/ui/button-premium";
import { servicesDataNew, SubService } from "@/data/servicesDataNew";
import PriceSummary from '@/components/PriceSummary';
import ServiceCardV3 from '@/components/ServiceCardV3';
import { Badge } from '@/components/ui/badge';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const mode = usePriceStore((state) => state.mode);

  const service = servicesDataNew.find(s => s.slug === slug);

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

  // Filter and paginate services based on eligibility
  const { shouldShowService } = usePriceStore();
  const filteredSubServices = service.subServices.filter(subService => 
    shouldShowService(subService.eligible)
  );
  
  const totalPages = Math.ceil(filteredSubServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubServices = filteredSubServices.slice(startIndex, startIndex + itemsPerPage);

  // Related services (other services user might be interested in)
  const relatedServices = servicesDataNew
    .filter(s => s.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Breadcrumbs />
      
        {/* Hero Section */}
        <section className="pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-background opacity-50" />
          
          {/* F Watermark Background Elements - More Visible */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <img 
              src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
              alt="" 
              className="absolute top-20 right-20 w-16 h-16 object-contain rotate-12 opacity-35 animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <img 
              src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
              alt="" 
              className="absolute bottom-10 left-20 w-12 h-12 object-contain -rotate-12 opacity-25 animate-pulse"
              style={{ animationDuration: '5s', animationDelay: '1s' }}
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 gradient-primary-subtle rounded-xl flex items-center justify-center mr-6 relative">
                {/* F Brand Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center opacity-70 hover:opacity-90 transition-opacity">
                  <img 
                    src="/lovable-uploads/cd4b4a33-e533-437c-9014-624e6c7e6e27.png" 
                    alt="Fixco" 
                    className="h-3 w-3 object-contain"
                  />
                </div>
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
                <div className="text-2xl font-bold text-primary">{'< 5 dagar'}</div>
                <div className="text-sm text-muted-foreground">Projektstart</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50%</div>
                <div className="text-sm text-muted-foreground">{mode === 'rut' ? 'RUT-rabatt' : 'ROT-rabatt'}</div>
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
              <span>Start inom {'< 5 dagar'}</span>
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

      {/* Pricing Toggle */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <GlobalPricingToggle size="md" />
          </div>
        </div>
      </section>

      {/* Sub-services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Alla våra {service.title.toLowerCase()}stjänster</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {filteredSubServices.length} specialiserade tjänster med transparent prissättning. 
              Alla priser inkluderar moms och kan kombineras med ROT/RUT-avdrag för 50% rabatt.
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Tillgängligt i Uppsala & Stockholm</span>
            </div>
          </div>
          
          {/* Empty state */}
          {filteredSubServices.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4">
                  Inga tjänster är berättigade till {mode === 'rot' ? 'ROT' : 'RUT'} i denna kategori.
                </h3>
                <p className="text-muted-foreground mb-6">
                  Visa alla tjänster för att se fler alternativ.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => usePriceStore.getState().setMode('all')}
                >
                  Visa alla tjänster
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedSubServices.map((subService, index) => {
              // Create a ServicePricing object for calculation
              const serviceForPricing = {
                id: subService.id,
                title: subService.title,
                basePrice: subService.basePrice,
                priceUnit: subService.priceUnit as 'kr/h' | 'kr' | 'från',
                eligible: { 
                  rot: subService.eligible.rot, 
                  rut: subService.eligible.rut 
                },
                laborShare: 1.0,
                fixedPrice: subService.priceType === 'quote'
              };

              const pricing = calcDisplayPrice(serviceForPricing, mode);
              const eligible = isEligibleForMode(serviceForPricing, mode);

              return (
                <ServiceCardV3
                  key={subService.id}
                  title={subService.title}
                  category={subService.category}
                  description={subService.description}
                  pricingType={subService.priceType === 'quote' ? 'quote' : 
                               subService.priceUnit.includes('/h') ? 'hourly' : 'fixed'}
                  priceIncl={subService.basePrice}
                  eligible={subService.eligible}
                  onBook={() => {
                    // Handle booking
                  }}
                  onQuote={() => {
                    // Handle quote request
                  }}
                />
              );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && filteredSubServices.length > 0 && (
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
              
              // Create ServicePricing object for related service
              const relatedServiceForPricing = {
                id: relatedService.slug,
                title: relatedService.title,
                basePrice: parseInt(String(relatedService.basePrice).replace(/[^\d]/g, '')) || 0,
                priceUnit: 'kr/h' as 'kr/h' | 'kr' | 'från',
                eligible: { 
                  rot: relatedService.eligible.rot, 
                  rut: relatedService.eligible.rut 
                },
                laborShare: 1.0
              };
              
              const relatedPricing = calcDisplayPrice(relatedServiceForPricing, mode);
              
              return (
                <ServiceCardV3
                  key={relatedService.slug}
                  title={relatedService.title}
                  category="Relaterad tjänst"
                  description={relatedService.description}
                  pricingType="hourly"
                  priceIncl={parseInt(String(relatedService.basePrice).replace(/[^\d]/g, '')) || 0}
                  eligible={relatedService.eligible}
                  onBook={() => {
                    // Handle booking
                  }}
                  onQuote={() => {
                    // Handle quote request
                  }}
                />
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
                  2 års garanti på alla utförda arbeten
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">ROT/RUT-hantering</h3>
                <p className="text-sm text-muted-foreground">
                  Vi sköter alla avdrag och administration
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