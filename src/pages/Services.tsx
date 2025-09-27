import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryGrid from '@/components/CategoryGrid';
import { useServices } from '@/hooks/useServices';
import { Search, ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const [searchParams] = useSearchParams();
  const servicesQuery = useServices();
  const services = servicesQuery.data || [];
  const loading = servicesQuery.isLoading;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    services.forEach(service => {
      if (service.category) {
        categorySet.add(service.category);
      }
    });
    return Array.from(categorySet);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.title_sv?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description_sv?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      return matchesSearch && matchesCategory && service.is_active;
    });
  }, [services, searchTerm, selectedCategory]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Tjänster - FIXCO</title>
        <meta name="description" content="Upptäck alla våra professionella hemtjänster. ROT & RUT-berättigade tjänster för hem och företag." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
              Våra Tjänster
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professionella lösningar för hem och företag
            </p>
          </div>
        </section>

        {/* Category Selection */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Välj kategori</h2>
              <p className="text-lg text-muted-foreground">
                Bläddra genom våra tjänstekategorier
              </p>
            </div>
            <CategoryGrid />
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Sök tjänster..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={selectedCategory === null ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                >
                  Alla
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-20 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <Badge variant={service.rot_eligible ? "default" : "secondary"}>
                          {service.rot_eligible ? 'ROT' : service.rut_eligible ? 'RUT' : 'Ej avdrag'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">
                          {service.category}
                        </Badge>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {service.base_price.toLocaleString()} kr
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {service.price_type === 'hourly' ? 'per timme' : 
                             service.price_type === 'fixed' ? 'fast pris' : 'enligt offert'}
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">
                        Begär offert
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredServices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Inga tjänster hittades med de valda filtren.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;