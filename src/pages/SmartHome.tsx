import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      name: t('smartHome.allProducts'),
      icon: Home,
      color: 'bg-gradient-to-r from-blue-500 to-purple-500',
      description: t('smartHome.completeSmartHome')
    },
    {
      id: 'security',
      name: t('smartHome.securityLocks'),
      icon: Shield,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      description: t('smartHome.protectYourHome')
    },
    {
      id: 'lighting',
      name: t('smartHome.smartLighting'),
      icon: Lightbulb,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      description: t('smartHome.energyEfficientLighting')
    },
    {
      id: 'climate',
      name: t('smartHome.climateHeating'),
      icon: Thermometer,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: t('smartHome.temperatureControl')
    },
    {
      id: 'cleaning',
      name: t('smartHome.robots'),
      icon: Bot,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      description: t('smartHome.automaticCleaning')
    },
    {
      id: 'garden',
      name: t('smartHome.garden'),
      icon: Leaf,
      color: 'bg-gradient-to-r from-green-400 to-lime-500',
      description: t('smartHome.smartGardening')
    },
    {
      id: 'entertainment',
      name: t('smartHome.entertainment'),
      icon: Speaker,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      description: t('smartHome.speakersHomeTheater')
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Ett fel uppstod</h2>
          <p className="text-gray-300">Kunde inte ladda produkter. Försök igen senare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-[calc(64px+5rem)] pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
            {t('smartHome.heroTitle')}
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto font-medium">
            {t('smartHome.heroSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              {t('smartHome.marketLeadingBrands')}
            </Badge>
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
              <Shield className="h-5 w-5 mr-2" />
              {t('smartHome.fullWarranty')}
            </Badge>
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
              <Settings className="h-5 w-5 mr-2" />
              {t('smartHome.professionalInstallation')}
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">{t('smartHome.chooseCategory')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`p-0 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-110 border-0 bg-gradient-to-br from-gray-800 to-gray-900 ${
                  selectedCategory === category.id 
                    ? 'ring-4 ring-cyan-400 shadow-2xl transform scale-110 shadow-cyan-400/50' 
                    : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`${category.color} text-white p-6 rounded-t-lg mb-0 text-center shadow-2xl`}>
                  <category.icon className="h-10 w-10 mx-auto mb-3 drop-shadow-lg" />
                  <h3 className="font-bold text-sm drop-shadow-lg">{category.name}</h3>
                </div>
                <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-b-lg">
                  <p className="text-xs text-gray-300 text-center font-medium">
                    {category.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <SmartProductSortFilter 
          sortBy={sortBy}
          onSortChange={setSortBy}
          productCount={products.length}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mr-3" />
            <span className="text-lg text-gray-300">{t('smartHome.loadingProducts')}</span>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              {selectedCategory === 'all' ? t('smartHome.allSmartHomeProducts') : `${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const IconComponent = getIconForCategory(product.category);
                return (
                  <Card 
                    key={product.id} 
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer border-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 text-white"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {/* Product Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <IconComponent className="h-12 w-12 text-white drop-shadow-lg" />
                          <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 border-0 font-bold shadow-lg">
                            {product.brand}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{product.name}</h3>
                        <p className="text-white/90 text-sm mb-4 font-medium">{product.model}</p>

                        <div className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
                          {product.total_price.toLocaleString()} kr
                        </div>
                        <div className="text-xs text-white/80 font-medium">
                          {t('smartHome.inclInstallationSetup')}
                        </div>
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-6">
                      {/* Real Features */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-3 text-gray-100 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          {t('smartHome.mainFeatures')}
                        </h4>
                        <ul className="space-y-2">
                          {product.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AI Features */}
                      <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-400/30 backdrop-blur-sm">
                        <h4 className="font-semibold mb-3 text-purple-300 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          {t('smartHome.smartFeatures')}
                        </h4>
                        <ul className="space-y-2">
                          {product.ai_features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Target className="h-3 w-3 text-purple-400 mt-0.5 flex-shrink-0" />
                              <span className="text-purple-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="p-6 pt-0">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white border-0 shadow-xl font-bold py-3 text-lg">
                        {t('smartHome.bookInstallation')}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* No Products Message */}
            {products.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-400 mb-4">{t('smartHome.noProductsFound')}</h3>
                <p className="text-gray-500">{t('smartHome.tryDifferentCategory')}</p>
              </div>
            )}
          </div>
        )}

        {/* Why These Brands */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 border-0 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            {t('smartHome.whyTheseBrands')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Star className="h-8 w-8 drop-shadow-lg" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">{t('smartHome.marketLeader')}</h3>
              <p className="text-sm text-gray-300">
                {t('smartHome.marketLeaderDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Shield className="h-8 w-8 drop-shadow-lg" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">{t('smartHome.secureIntegration')}</h3>
              <p className="text-sm text-gray-300">
                {t('smartHome.secureIntegrationDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Settings className="h-8 w-8 drop-shadow-lg" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">{t('smartHome.easySupport')}</h3>
              <p className="text-sm text-gray-300">
                {t('smartHome.easySupportDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <TrendingUp className="h-8 w-8 drop-shadow-lg" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">{t('smartHome.futureProof')}</h3>
              <p className="text-sm text-gray-300">
                {t('smartHome.futureProofDesc')}
              </p>
            </div>
          </div>
        </Card>

        {/* Final CTA */}
        <Card className="p-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center border-0 shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">
            {t('smartHome.readyForInstallation')}
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            {t('smartHome.readyForInstallationDesc')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg border-0 shadow-lg">
              <Phone className="h-6 w-6 mr-3" />
              {t('common.callUs')}: {t('common.phone')}
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
              <Home className="h-6 w-6 mr-3" />
              {t('smartHome.bookHomeConsultation')}
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('smartHome.freeConsultation')}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('smartHome.certifiedInstallers')}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('smartHome.twoYearWarranty')}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};