import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';

const AboutEn: React.FC = () => {
  const { content, isLoading, isEnglishMissing } = useContent('/en/about', 'en');

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
        <link rel="alternate" hrefLang="sv" href="https://fixco.se/om-oss" />
        <link rel="alternate" hrefLang="en" href="https://fixco.se/en/about" />
        <link rel="alternate" hrefLang="x-default" href="https://fixco.se/om-oss" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.h1}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Our Story */}
            <section className="text-center">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                FIXCO was founded with a simple mission: to make professional home services 
                accessible, transparent, and reliable for everyone in Sweden. We believe that 
                your home should be a place of comfort and safety, and we're here to help 
                make that happen.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With over 15,000 satisfied customers and a team of certified professionals, 
                we've become Sweden's leading home service provider, specializing in 
                everything from electrical work to smart home installations.
              </p>
            </section>

            {/* Our Values */}
            <section>
              <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                  <p className="text-muted-foreground">
                    We never compromise on quality. Every job is done right the first time.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Trust & Transparency</h3>
                  <p className="text-muted-foreground">
                    Clear pricing, honest communication, and reliable service you can count on.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We stay ahead of the curve with the latest technology and methods.
                  </p>
                </div>
              </div>
            </section>

            {/* Statistics */}
            <section className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-8 text-center">By the Numbers</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
                  <p className="text-muted-foreground">Happy Customers</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">5 Years</div>
                  <p className="text-muted-foreground">In Business</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <p className="text-muted-foreground">Certified Professionals</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-muted-foreground">Emergency Service</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutEn;