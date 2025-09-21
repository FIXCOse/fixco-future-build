import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/hooks/useContent';
import { Loader2 } from 'lucide-react';

const HomeEn: React.FC = () => {
  console.log('HomeEn component rendering');
  const { content, isLoading, isEnglishMissing } = useContent('/en', 'en');
  console.log('HomeEn useContent result:', { content, isLoading, isEnglishMissing });

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
        <link rel="alternate" hrefLang="sv" href="https://fixco.se/" />
        <link rel="alternate" hrefLang="en" href="https://fixco.se/en" />
        <link rel="alternate" hrefLang="x-default" href="https://fixco.se/" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              {content.h1}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {content.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                data-wizard="quote"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                {content.cta_primary}
              </button>
              <a
                href="tel:+46812345678"
                className="border border-border hover:bg-muted px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                {content.cta_secondary}
              </a>
            </div>
          </div>
        </section>

        {/* Temporary content until other components are translated */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Professional Home Services</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Complete home services with ROT & RUT deductions, professional craftsmen, and over 15,000 satisfied customers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional Service</h3>
                <p className="text-muted-foreground">Certified craftsmen with years of experience</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">ROT & RUT Deductions</h3>
                <p className="text-muted-foreground">Save up to 50% with tax deductions</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">15,000+ Happy Customers</h3>
                <p className="text-muted-foreground">Trusted by thousands across Sweden</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeEn;