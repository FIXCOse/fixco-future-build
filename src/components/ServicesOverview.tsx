import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button-premium";
import { useCopy } from "@/copy/CopyProvider";
import { 
  Hammer, 
  Wrench, 
  Package, 
  TreePine, 
  Sparkles, 
  ClipboardList, 
  Mountain, 
  Cpu, 
  Zap, 
  Building 
} from "lucide-react";
const services = [
  {
    title: "Snickeri",
    description: "Kök, badrum, inredning och möbler",
    icon: Hammer,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "VVS",
    description: "Rör, värme och sanitär installation",
    icon: Wrench,
    color: "from-cyan-500 to-cyan-600"
  },
  {
    title: "Montering",
    description: "Möbler, maskiner och teknisk utrustning", 
    icon: Package,
    color: "from-green-500 to-green-600"
  },
  {
    title: "Trädgård",
    description: "Anläggning, skötsel och underhåll",
    icon: TreePine,
    color: "from-emerald-500 to-emerald-600"
  },
  {
    title: "Städning",
    description: "Byggstäd, flyttstäd och regelbunden städning",
    icon: Sparkles,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Projektledning",
    description: "Helhetslösningar från start till mål",
    icon: ClipboardList,
    color: "from-orange-500 to-orange-600"
  },
  {
    title: "Markarbeten",
    description: "Grävning, dränering och anläggning",
    icon: Mountain,
    color: "from-amber-500 to-amber-600"
  },
  {
    title: "Tekniska installationer",
    description: "Automation, säkerhet och smarta lösningar",
    icon: Cpu,
    color: "from-indigo-500 to-indigo-600"
  },
  {
    title: "El",
    description: "Installation, reparation och underhåll",
    icon: Zap,
    color: "from-yellow-500 to-yellow-600"
  },
  {
    title: "Fastighetsskötsel",
    description: "Löpande underhåll och service",
    icon: Building,
    color: "from-red-500 to-red-600"
  }
];

const ServicesOverview = () => {
  const { t, locale } = useCopy();
  const servicesPath = locale === 'en' ? '/en/services' : '/tjanster';
  
  const services = [
    {
      title: t('serviceCategories.snickeri'),
      description: locale === 'en' ? 'Kitchens, bathrooms, interiors and furniture' : 'Kök, badrum, inredning och möbler',
      icon: Hammer,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: t('serviceCategories.vvs'),
      description: locale === 'en' ? 'Pipes, heating and sanitary installation' : 'Rör, värme och sanitär installation',
      icon: Wrench,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      title: t('serviceCategories.montering'),
      description: locale === 'en' ? 'Furniture, machinery and technical equipment' : 'Möbler, maskiner och teknisk utrustning', 
      icon: Package,
      color: "from-green-500 to-green-600"
    },
    {
      title: t('serviceCategories.tradgard'),
      description: locale === 'en' ? 'Construction, maintenance and care' : 'Anläggning, skötsel och underhåll',
      icon: TreePine,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: t('serviceCategories.stadning'),
      description: locale === 'en' ? 'Construction cleaning, moving cleaning and regular cleaning' : 'Byggstäd, flyttstäd och regelbunden städning',
      icon: Sparkles,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: locale === 'en' ? 'Project Management' : 'Projektledning',
      description: locale === 'en' ? 'Complete solutions from start to finish' : 'Helhetslösningar från start till mål',
      icon: ClipboardList,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: t('serviceCategories.markarbeten'),
      description: locale === 'en' ? 'Excavation, drainage and construction' : 'Grävning, dränering och anläggning',
      icon: Mountain,
      color: "from-amber-500 to-amber-600"
    },
    {
      title: t('serviceCategories.tekniska-installationer'),
      description: locale === 'en' ? 'Automation, security and smart solutions' : 'Automation, säkerhet och smarta lösningar',
      icon: Cpu,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: t('serviceCategories.el'),
      description: locale === 'en' ? 'Installation, repair and maintenance' : 'Installation, reparation och underhåll',
      icon: Zap,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: locale === 'en' ? 'Property Maintenance' : 'Fastighetsskötsel',
      description: locale === 'en' ? 'Ongoing maintenance and service' : 'Löpande underhåll och service',
      icon: Building,
      color: "from-red-500 to-red-600"
    }
  ];
  
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 gradient-primary-subtle opacity-30" />
      
      {/* F Watermark Background Elements - CSS-based for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <div 
          className="absolute top-20 left-20 w-20 h-20 bg-primary/30 rotate-12 animate-pulse rounded-sm"
          style={{ animationDuration: '4s' }}
          aria-hidden="true"
        />
        <div 
          className="absolute bottom-20 right-20 w-16 h-16 bg-primary/25 -rotate-6 animate-pulse rounded-sm"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
          aria-hidden="true"
        />
        <div 
          className="absolute top-1/2 left-1/2 w-12 h-12 bg-primary/20 rotate-45 animate-pulse rounded-sm"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
          aria-hidden="true"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('pages.servicesOverview.title')} <span className="gradient-text">{t('pages.servicesOverview.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('pages.servicesOverview.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Link
                key={service.title}
                to={`/tjanster/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div 
                  className="card-service h-full animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* F Brand Badge - Bottom Right, Larger & More Visible */}
                  <div className="absolute bottom-4 right-4 w-9 h-9 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10">
                    <img 
                      src="/assets/fixco-f-icon-new.png" 
                      alt="Fixco" 
                      className="h-6 w-6 object-contain opacity-90"
                    />
                  </div>

                  <div className="flex flex-col items-center text-center h-full">
                    {/* Icon with gradient background */}
                    <div className="w-16 h-16 rounded-xl gradient-primary-subtle flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                      <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm flex-grow">
                      {service.description}
                    </p>
                    
                    {/* Hover indicator */}
                    <div className="mt-4 text-primary text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                      {t('pages.servicesOverview.seeMore')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            {t('pages.servicesOverview.cantFind')}
          </p>
          <Link to={servicesPath}>
            <Button variant="premium" size="lg">
              {t('pages.servicesOverview.seeAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;