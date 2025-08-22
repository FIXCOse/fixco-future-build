import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustChips from "@/components/TrustChips";
import { Button } from "@/components/ui/button-premium";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ArrowRight, MapPin, Calendar, Euro } from "lucide-react";

const references = [
  {
    id: 1,
    title: "Köksrenovering Villa Täby",
    category: "Snickeri & VVS",
    location: "Täby, Stockholm",
    date: "December 2024",
    duration: "2 veckor",
    budget: "180 000 kr",
    rotSaving: "35 000 kr",
    image: "/api/placeholder/400/300",
    description: "Komplett köksrenovering med nya skåp, bänkskivor och vitvaror. Inklusive VVS-arbeten för diskmaskin och kylskåp.",
    services: ["Snickeri", "VVS", "El"],
    quote: "Fantastisk service från start till mål. Fixco höll alla tidsramar och budgeten. Köket blev ännu vackrare än vi föreställt oss.",
    client: "Maria och Lars Andersson",
    rating: 5,
    beforeAfter: {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150"
    }
  },
  {
    id: 2,
    title: "Badrumstotalrenovering",
    category: "VVS & Snickeri",
    location: "Uppsala Centrum",
    date: "November 2024",
    duration: "10 dagar",
    budget: "95 000 kr",
    rotSaving: "22 000 kr",
    image: "/api/placeholder/400/300",
    description: "Totalrenovering av badrum med ny duschkabin, kakel och golvvärme. Modern design med smarta förvaringslösningar.",
    services: ["VVS", "Snickeri", "El"],
    quote: "Professionellt utfört från A till Ö. Tack vare ROT-avdraget blev det mycket mer överkomligt än vi trott.",
    client: "Anna Petersson",
    rating: 5,
    beforeAfter: {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150"
    }
  },
  {
    id: 3,
    title: "Altan & Trädgårdsanläggning",
    category: "Snickeri & Trädgård",
    location: "Sigtuna",
    date: "Oktober 2024",
    duration: "1 vecka",
    budget: "65 000 kr",
    rotSaving: "18 000 kr",
    image: "/api/placeholder/400/300",
    description: "Ny altan i mahogny med integrerad belysning plus komplett trädgårdsanläggning med planteringar och automatisk bevattning.",
    services: ["Snickeri", "Trädgård", "El"],
    quote: "Vi har fått vår drömträdgård! Fixco förstod precis vad vi ville ha och levererade över förväntan.",
    client: "Henrik och Sara Lindström",
    rating: 5,
    beforeAfter: {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150"
    }
  },
  {
    id: 4,
    title: "Kontorsrenovering",
    category: "Projektledning",
    location: "Stockholm City",
    date: "September 2024",
    duration: "3 veckor",
    budget: "320 000 kr",
    rotSaving: "0 kr",
    image: "/api/placeholder/400/300",
    description: "Totalrenovering av kontorslokaler för IT-företag. Moderna mötesrum, öppen kontorslandskap och dedicated serverrum.",
    services: ["Projektledning", "Snickeri", "El"],
    quote: "Fixco hanterade hela projektet smidigt medan vi kunde fokusera på vår verksamhet. Noll driftsstörningar.",
    client: "TechStart AB",
    rating: 5,
    beforeAfter: {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150"
    }
  },
  {
    id: 5,
    title: "IKEA-montering & Homestyling",
    category: "Montering",
    location: "Uppsala Luthagen",
    date: "Januari 2025",
    duration: "2 dagar",
    budget: "8 500 kr",
    rotSaving: "2 200 kr",
    image: "/api/placeholder/400/300",
    description: "Komplett möbleringspaket för nyinflyttade. IKEA PAX-system, kök, vardagsrum och sovrumsmöbler plus homestyling.",
    services: ["Montering"],
    quote: "Snabbt, smidigt och professionellt. På två dagar förvandlades lägenheten från tom till hemkänsla!",
    client: "Julia Nilsson",
    rating: 5,
    beforeAfter: {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150"
    }
  },
  {
    id: 6,
    title: "Markdränering & Grundförstärkning",
    category: "Markarbeten",
    location: "Enköping",
    date: "Augusti 2024",
    duration: "1 vecka",
    budget: "120 000 kr",
    rotSaving: "28 000 kr",
    image: "/api/placeholder/400/300",
    description: "Fuktproblem löstes med professionell dränering runt huset och förstärkning av grundmur. Inga mer fuktproblem!",
    services: ["Markarbeten"],
    quote: "Efter år av fuktproblem är de äntligen lösta. Fixco levererade expertis och kvalitet som andra inte kunde.",
    client: "Gunnar Eriksson",
    rating: 5,
    beforeAfter: {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150"
    }
  }
];

const testimonials = [
  {
    quote: "Fixco levererade exakt det vi lovats. Professionellt, i tid och till rätt pris. Rekommenderas varmt!",
    author: "Emma Johansson",
    service: "Köksrenovering",
    rating: 5,
    location: "Stockholm"
  },
  {
    quote: "Fantastisk service! De löste våra VVS-problem på nolltid och hjälpte oss spara pengar med ROT-avdraget.",
    author: "Michael Berg",
    service: "VVS-reparationer",
    rating: 5,
    location: "Uppsala"
  },
  {
    quote: "Bästa beslutet vi gjorde var att anlita Fixco. Från offert till färdigt projekt - allt flöt på perfekt.",
    author: "Sofia Lindgren",
    service: "Badrumssanering",
    rating: 5,
    location: "Täby"
  }
];

const Referenser = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-background opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Våra <span className="gradient-text">referenser</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Se resultat från riktiga projekt. Från mindre reparationer till stora renoveringar – 
              vi levererar kvalitet som våra kunder är nöjda med.
            </p>
            
            <TrustChips variant="minimal" maxVisible={4} className="mb-8" />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">500+</div>
              <div className="text-muted-foreground">Nöjda kunder</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">4.9★</div>
              <div className="text-muted-foreground">Genomsnittligt betyg</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">15M kr</div>
              <div className="text-muted-foreground">ROT-besparingar</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">98%</div>
              <div className="text-muted-foreground">Skulle rekommendera</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Utvalda projekt</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Varje projekt är unikt, men kvaliteten är alltid densamma. 
              Se hur vi hjälpt våra kunder förverkliga sina drömmar.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {references.map((ref, index) => (
              <Card key={ref.id} className="overflow-hidden hover:shadow-premium transition-all duration-300">
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-r from-primary/20 to-accent/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <div className="text-4xl mb-2">🏠</div>
                      <div className="text-sm">{ref.title}</div>
                    </div>
                  </div>
                  <Badge className="absolute top-4 left-4">{ref.category}</Badge>
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span className="text-xs font-medium">{ref.rating}.0</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Project Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{ref.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{ref.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{ref.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Euro className="h-4 w-4" />
                        <span>{ref.budget}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4">{ref.description}</p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ref.services.map(service => (
                      <Badge key={service} variant="secondary">{service}</Badge>
                    ))}
                  </div>

                  {/* ROT Saving */}
                  {ref.rotSaving !== "0 kr" && (
                    <div className="p-3 bg-primary/10 rounded-lg mb-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">ROT-besparing: </span>
                        <span className="font-bold text-primary">{ref.rotSaving}</span>
                      </div>
                    </div>
                  )}

                  {/* Quote */}
                  <div className="relative p-4 bg-muted/20 rounded-lg mb-4">
                    <Quote className="h-6 w-6 text-primary mb-2" />
                    <p className="text-sm italic mb-2">"{ref.quote}"</p>
                    <p className="text-xs text-muted-foreground font-medium">– {ref.client}</p>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Projekttid:</span>
                      <div className="font-medium">{ref.duration}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total investering:</span>
                      <div className="font-medium">{ref.budget}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vad våra kunder säger</h2>
            <p className="text-muted-foreground">Äkta recensioner från nöjda kunder</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-500" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-primary mx-auto mb-4" />
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.service}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 gradient-primary-subtle opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Redo att bli nästa <span className="gradient-text">nöjda kund</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Låt oss hjälpa dig förverkliga ditt projekt. Begär en kostnadsfri offert idag 
              och se vad vi kan göra för dig.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg" className="animate-glow">
                Begär kostnadsfri offert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="ghost-premium" size="lg">
                Se våra tjänster
              </Button>
            </div>

            <TrustChips variant="minimal" maxVisible={4} className="mt-8" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Referenser;