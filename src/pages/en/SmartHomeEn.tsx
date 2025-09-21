import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';

const SmartHomeEn: React.FC = () => {
  const { content, isLoading, isEnglishMissing } = useContent('/en/smart-home', 'en');

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
        <link rel="alternate" hrefLang="sv" href="https://fixco.se/smart-hem" />
        <link rel="alternate" hrefLang="en" href="https://fixco.se/en/smart-home" />
        <link rel="alternate" hrefLang="x-default" href="https://fixco.se/smart-hem" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.h1}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          {/* Smart Home Services */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Smart Home Solutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '💡',
                  title: 'Smart Lighting',
                  description: 'Automated lighting systems that adapt to your lifestyle and save energy.'
                },
                {
                  icon: '🏠',
                  title: 'Home Automation',
                  description: 'Complete home automation systems for ultimate convenience and control.'
                },
                {
                  icon: '🔒',
                  title: 'Security Systems',
                  description: 'Advanced security systems with smart locks, cameras, and monitoring.'
                },
                {
                  icon: '🌡️',
                  title: 'Climate Control',
                  description: 'Smart thermostats and climate control for optimal comfort and efficiency.'
                },
                {
                  icon: '📱',
                  title: 'Smart Integration',
                  description: 'Seamless integration with your smartphones and voice assistants.'
                },
                {
                  icon: '⚡',
                  title: 'Energy Management',
                  description: 'Smart energy monitoring and management systems to reduce costs.'
                }
              ].map((service, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <button
                    data-wizard="quote"
                    data-service-name={service.title}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                  >
                    Get Quote
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="bg-muted/50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Smart Home?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Save Money</h3>
                <p className="text-sm text-muted-foreground">Reduce energy costs by up to 30%</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Enhanced Security</h3>
                <p className="text-sm text-muted-foreground">Advanced security features</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Convenience</h3>
                <p className="text-sm text-muted-foreground">Control everything remotely</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Increase Value</h3>
                <p className="text-sm text-muted-foreground">Boost your home's value</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make Your Home Smart?</h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our certified technicians will help you transform your home into a smart, 
              efficient, and secure living space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                data-wizard="quote"
                data-service-name="Smart Home"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Get Free Consultation
              </button>
              <a
                href="tel:+46812345678"
                className="border border-border hover:bg-muted px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Call Us Now
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SmartHomeEn;