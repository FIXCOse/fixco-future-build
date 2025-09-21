import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';

const ServicesEn: React.FC = () => {
  const { content, isLoading, isEnglishMissing } = useContent('/en/services', 'en');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isEnglishMissing || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
          <p className="text-xl text-muted-foreground mb-6">
            The English version of this page is currently being prepared.
          </p>
          <p className="text-sm text-muted-foreground">
            Please check back soon or visit our Swedish site in the meantime.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>{content.title}</title>
        <meta name="description" content={content.meta_description} />
        <link rel="alternate" hrefLang="sv" href="https://fixco.se/tjanster" />
        <link rel="alternate" hrefLang="en" href="https://fixco.se/en/services" />
        <link rel="alternate" hrefLang="x-default" href="https://fixco.se/tjanster" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.h1}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          {/* Temporary services grid until services are properly translated */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Electrical', icon: '⚡', description: 'Professional electrical services' },
              { name: 'Plumbing', icon: '🔧', description: 'Complete plumbing solutions' },
              { name: 'Painting', icon: '🎨', description: 'Interior and exterior painting' },
              { name: 'Cleaning', icon: '🧽', description: 'Professional cleaning services' },
              { name: 'Handyman', icon: '🔨', description: 'General home repairs' },
              { name: 'Smart Home', icon: '🏠', description: 'Smart home installations' }
            ].map((service) => (
              <div key={service.name} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <button
                  data-wizard="quote"
                  data-service-name={service.name}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                >
                  Get Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesEn;