import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCopy } from '@/copy/CopyProvider';
import { useEditMode } from '@/contexts/EditModeContext';
import { EditableSection } from '@/components/EditableSection';
import { EditableText } from '@/components/EditableText';
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
import { FixcoFIcon } from '@/components/icons/FixcoFIcon';

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
  const { isEditMode } = useEditMode();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  // For now, use mock data since smart_products table doesn't exist yet
  const products: any[] = [];
  const isLoading = false;
  const error = null;

  // Track product view when clicked - simplified without actual tracking for now
  const handleProductClick = (productId: string) => {
    // Just show success message without tracking
    toast.success(t('smartHome.contact_for_info'));
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
    <main className="pt-16">
      {/* Hero Section */}
      <EditableSection id="smart-home-hero" title="Smart Hem Hero">
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
          
          {/* F Watermark Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
            <div className="absolute top-16 right-16 w-24 h-24 rotate-12 animate-pulse" style={{ animationDuration: '5s' }}>
              <FixcoFIcon className="w-full h-full opacity-30" />
            </div>
            <div className="absolute bottom-16 left-16 w-20 h-20 -rotate-6 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}>
              <FixcoFIcon className="w-full h-full opacity-25" />
            </div>
          </div>

          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center mb-16">
              <EditableText 
                id="smart-home-title"
                initialContent={t('smartHome.title')}
                type="heading"
                as="h1"
                className="text-4xl md:text-6xl font-bold mb-6"
              />
              <EditableText 
                id="smart-home-subtitle"
                initialContent={t('smartHome.subtitle')}
                as="p"
                className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
              />
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    -30%
                  </div>
                  <EditableText 
                    id="smart-home-energy-reduction"
                    initialContent={t('smartHome.energy_reduction')}
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    50+
                  </div>
                  <EditableText 
                    id="smart-home-connected-devices"
                    initialContent={t('smartHome.connected_devices')}
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    24/7
                  </div>
                  <EditableText 
                    id="smart-home-automation"
                    initialContent={t('smartHome.automation')}
                    className="text-sm text-muted-foreground"
                  />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    50%
                  </div>
                  <EditableText 
                    id="smart-home-savings"
                    initialContent={t('smartHome.savings')}
                    className="text-sm text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="gradient-primary text-primary-foreground">
                  <EditableText 
                    id="smart-home-cta-book"
                    initialContent={t('cta.book_installation')}
                  >
                    {t('cta.book_installation')}
                  </EditableText>
                </Button>
                <Button size="lg" variant="outline">
                  <EditableText 
                    id="smart-home-cta-consultation"
                    initialContent={t('cta.free_consultation')}
                  >
                    {t('cta.free_consultation')}
                  </EditableText>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

        {/* Detailed Hero */}
        <EditableSection id="smart-home-products" title="Produkter sektion">
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <EditableText 
                  id="smart-home-products-title"
                  initialContent={t('smartHome.products_title')}
                  type="heading"
                  as="h2"
                  className="text-3xl md:text-4xl font-bold mb-6"
                />
                <EditableText 
                  id="smart-home-products-subtitle"
                  initialContent={t('smartHome.products_subtitle')}
                  as="p"
                  className="text-xl text-muted-foreground max-w-4xl mx-auto"
                />
              </div>

            {/* Trust Features */}
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <EditableText 
                  id="smart-home-market-leaders"
                  initialContent={t('smartHome.market_leaders')}
                  type="heading"
                  as="h3"
                  className="font-bold mb-2"
                />
                <EditableText 
                  id="smart-home-market-leaders-desc"
                  initialContent={t('smartHome.market_leaders_desc')}
                  as="p"
                  className="text-sm text-muted-foreground"
                />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <EditableText 
                  id="smart-home-warranty"
                  initialContent={t('smartHome.full_warranty')}
                  type="heading"
                  as="h3"
                  className="font-bold mb-2"
                />
                <EditableText 
                  id="smart-home-warranty-desc"
                  initialContent={t('smartHome.years_warranty')}
                  as="p"
                  className="text-sm text-muted-foreground"
                />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <EditableText 
                  id="smart-home-professional"
                  initialContent={t('smartHome.professional_install')}
                  type="heading"
                  as="h3"
                  className="font-bold mb-2"
                />
                <EditableText 
                  id="smart-home-professional-desc"
                  initialContent={t('smartHome.professional_desc')}
                  as="p"
                  className="text-sm text-muted-foreground"
                />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <EditableText 
                  id="smart-home-ai-optimized"
                  initialContent={t('smartHome.ai_optimized')}
                  type="heading"
                  as="h3"
                  className="font-bold mb-2"
                />
                <EditableText 
                  id="smart-home-ai-desc"
                  initialContent={t('smartHome.ai_desc')}
                  as="p"
                  className="text-sm text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </section>
      </EditableSection>

        {/* Category Selection */}
        <EditableSection id="smart-home-categories" title="Kategorier val">
          <section className="py-16 px-4 bg-gradient-primary-subtle">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <EditableText 
                  id="smart-home-choose-category"
                  initialContent={t('smartHome.choose_category')}
                  type="heading"
                  as="h2"
                  className="text-3xl font-bold mb-4"
                />
                <EditableText 
                  id="smart-home-category-desc"
                  initialContent="Klicka på en kategori för att se alla produkter inom det området"
                  as="p"
                  className="text-muted-foreground"
                />
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
      </EditableSection>

        {/* Products Section */}
        <EditableSection id="smart-home-products-list" title="Produktlista">
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-center mb-8">
                <EditableText 
                  id="smart-home-all-products"
                  initialContent={t('smartHome.all_products')}
                  type="heading"
                  as="h2"
                  className="text-2xl font-bold"
                />
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
                {t('smartHome.why_these_brands')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t('smartHome.market_leaders_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('smartHome.market_leaders_long_desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t('smartHome.compatibility_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('smartHome.compatibility_desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t('smartHome.easy_support_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('smartHome.easy_support_desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{t('smartHome.future_proof_title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('smartHome.future_proof_desc')}
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
                {t('smartHome.ready_for_install_title')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('smartHome.ready_for_install_desc')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-primary text-primary-foreground">
                  {t('smartHome.book_installation')}
                </Button>
                <Button size="lg" variant="outline">
                  {t('cta.free_consultation')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </EditableSection>
    </main>
  );
};

export default SmartHome;