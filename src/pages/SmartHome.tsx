import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCopy } from '@/copy/CopyProvider';
import { 
  CheckCircle,
  Home,
  Lightbulb,
  Thermometer,
  Shield,
  Bot,
  Leaf,
  Speaker,
  Settings,
  Phone,
  Brain,
  Target,
  Loader2,
  Star,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useSmartProducts, SortOption } from '@/hooks/useSmartProducts';
import { SmartProductSortFilter } from '@/components/SmartProductSortFilter';

interface CategoryFilter {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const getIconForCategory = (category: string) => {
  const iconMap = {
    security: Shield,
    lighting: Lightbulb,
    climate: Thermometer,
    cleaning: Bot,
    garden: Leaf,
    entertainment: Speaker,
  };
  return iconMap[category as keyof typeof iconMap] || Home;
};

export const SmartHome = () => {
  const { t } = useCopy();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  // Fetch products from database
  const { data: products = [], isLoading, error } = useSmartProducts({ 
    category: selectedCategory, 
    sortBy 
  });

  // Track product view when clicked - simplified without actual tracking for now
  const handleProductClick = (productId: string) => {
    // Just show success message without tracking
    toast.success('Kontakta oss för installation och mer information!');
  };

  const categories: CategoryFilter[] = [
    {
      id: 'all',
      name: t('categories.all'),
      icon: Home,
      color: 'bg-gradient-to-r from-blue-500 to-purple-500',
      description: t('categories.all_desc')
    },
    {
      id: 'security',
      name: t('categories.security'),
      icon: Shield,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      description: t('categories.security_desc')
    },
    {
      id: 'lighting',
      name: t('categories.lighting'),
      icon: Lightbulb,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      description: t('categories.lighting_desc')
    },
    {
      id: 'climate',
      name: t('categories.climate'),
      icon: Thermometer,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: t('categories.climate_desc')
    },
    {
      id: 'cleaning',
      name: t('categories.cleaning'),
      icon: Bot,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      description: t('categories.cleaning_desc')
    },
    {
      id: 'garden',
      name: t('categories.garden'),
      icon: Leaf,
      color: 'bg-gradient-to-r from-green-600 to-lime-500',
      description: t('categories.garden_desc')
    },
    {
      id: 'entertainment',
      name: t('categories.entertainment'),
      icon: Speaker,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      description: t('categories.entertainment_desc')
    }
  ];

  if (error) {
    console.error('Error loading smart products:', error);
  }

  return (
    <>
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
          
          {/* F Watermark Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
            <img 
              src="/assets/fixco-f-icon-new.png"
              alt="" 
              className="absolute top-16 right-16 w-24 h-24 object-contain rotate-12 opacity-30 animate-pulse"
              style={{ animationDuration: '5s' }}
            />
            <img 
              src="/assets/fixco-f-icon-new.png"
              alt="" 
              className="absolute bottom-16 left-16 w-20 h-20 object-contain -rotate-6 opacity-25 animate-pulse"
              style={{ animationDuration: '6s', animationDelay: '2s' }}
            />
          </div>

          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('smartHome.title')}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {t('smartHome.subtitle')}
              </p>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    -30%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('smartHome.energy_reduction')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    50+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('smartHome.connected_devices')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('smartHome.automation')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    50%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('smartHome.savings')}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="gradient-primary text-primary-foreground">
                  {t('cta.book_installation')}
                </Button>
                <Button size="lg" variant="outline">
                  {t('cta.free_consultation')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Hero */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('smartHome.products_title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                {t('smartHome.products_subtitle')}
              </p>
            </div>

            {/* Trust Features */}
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t('smartHome.market_leaders')}</h3>
                <p className="text-sm text-muted-foreground">
                  Endast #1 märken globalt
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t('smartHome.full_warranty')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('smartHome.years_warranty')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t('smartHome.professional_install')}</h3>
                <p className="text-sm text-muted-foreground">
                  Certifierade installatörer
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t('smartHome.ai_optimized')}</h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent automatisering
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Selection */}
        <section className="py-16 px-4 bg-gradient-primary-subtle">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {t('smartHome.choose_category')}
              </h2>
              <p className="text-muted-foreground">
                Klicka på en kategori för att se alla produkter inom det området
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Card
                    key={category.id}
                    className={`
                      cursor-pointer transition-all duration-300 hover:scale-105 
                      ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
                    `}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="p-6 text-center">
                      <div className={`
                        w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center
                        ${category.color}
                      `}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-sm mb-2">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {t('smartHome.all_products')}
              </h2>
              <SmartProductSortFilter 
                sortBy={sortBy} 
                onSortChange={setSortBy} 
                productCount={products.length}
              />
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">{t('smartHome.loading')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t('smartHome.no_products')}</p>
                <p className="text-sm text-muted-foreground">
                  Prova att välja en annan kategori eller sortering.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const CategoryIcon = getIconForCategory(product.category);
                  return (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="relative">
                        {/* Product Image */}
                        <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg relative">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <CategoryIcon className="h-16 w-16 text-primary/40" />
                            </div>
                          )}
                          
                          {/* Category Badge */}
                          <Badge 
                            variant="secondary" 
                            className="absolute top-3 left-3 bg-white/90"
                          >
                            {product.category}
                          </Badge>
                          
                          {/* Rating */}
                          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{product.average_rating?.toFixed(1) || '5.0'}</span>
                          </div>
                        </div>

                        <div className="p-4">
                          {/* Brand and Name */}
                          <div className="mb-3">
                            <Badge variant="outline" className="mb-2 text-xs">
                              {product.brand}
                            </Badge>
                            <h3 className="font-bold text-lg leading-tight mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          {/* Features */}
                          {product.features && Array.isArray(product.features) && (
                            <div className="mb-4">
                              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                                {t('smartHome.main_features')}
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {product.features.slice(0, 3).map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* AI Features */}
                          {product.ai_features && Array.isArray(product.ai_features) && product.ai_features.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                                <Brain className="h-3 w-3 mr-1" />
                                {t('smartHome.smart_features')}
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {product.ai_features.slice(0, 2).map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs border-primary/30">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pricing */}
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-end mb-3">
                              <div>
                                <div className="text-2xl font-bold">
                                  {product.product_price?.toLocaleString('sv-SE')} kr
                                </div>
                                {product.installation_price > 0 && (
                                  <div className="text-sm text-muted-foreground">
                                    + {product.installation_price?.toLocaleString('sv-SE')} kr installation
                                  </div>
                                )}
                              </div>
                              <Badge variant="secondary" className="text-primary">
                                {t('smartHome.installation_setup')}
                              </Badge>
                            </div>

                            {/* Installation Details */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                              {product.installation_time && (
                                <div>⏱️ {product.installation_time}</div>
                              )}
                              {product.installation_difficulty && (
                                <div>🔧 {product.installation_difficulty}</div>
                              )}
                              {product.warranty_years && (
                                <div>🛡️ {product.warranty_years} år garanti</div>
                              )}
                              <div>⭐ {product.average_rating?.toFixed(1) || '5.0'}/5</div>
                            </div>

                            {/* CTA */}
                            <Button 
                              className="w-full" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product.id);
                              }}
                            >
                              Kontakta för installation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Why These Brands */}
        <section className="py-16 px-4 bg-gradient-primary-subtle">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">
                Varför Vi Valt Dessa Märken
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Marknadsledare</h3>
                <p className="text-sm text-muted-foreground">
                  Alla märken är #1 eller #2 i sina kategorier globalt. Beprövad teknik med miljontals installationer.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Säker Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Alla produkter fungerar tillsammans och har säkra protokoll som Zigbee 3.0 och WiFi 6.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Enkel Support</h3>
                <p className="text-sm text-muted-foregrund">
                  Vi är certifierade installatörer för alla märken. En kontakt för alla dina smart hem-behov.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Framtidssäkert</h3>
                <p className="text-sm text-muted-foreground">
                  Alla produkter får regelbundna uppdateringar med nya funktioner. Din investering växer över tid.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="card-premium p-8 relative">
              {/* F Brand Badge */}
              <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                <img 
                  src="/assets/fixco-f-icon-new.png"
                  alt="Fixco" 
                  className="h-6 w-6 object-contain opacity-90"
                />
              </div>

              <h2 className="text-3xl font-bold mb-4">
                Redo för Professionell Smart Hem-Installation?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Boka en kostnadsfri hemkonsultation idag. Vi kommer hem till dig med produkterna, 
                visar hur de fungerar och ger dig en exakt offert på installationen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-primary text-primary-foreground">
                  Boka Installation
                </Button>
                <Button size="lg" variant="outline">
                  Boka Hemkonsultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SmartHome;