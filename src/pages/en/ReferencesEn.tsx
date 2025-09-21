import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/hooks/useContent';
import { Loader2, Star } from 'lucide-react';

const ReferencesEn: React.FC = () => {
  const { content, isLoading, isEnglishMissing } = useContent('/en/references', 'en');

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
        <link rel="alternate" hrefLang="sv" href="https://fixco.se/referenser" />
        <link rel="alternate" hrefLang="en" href="https://fixco.se/en/references" />
        <link rel="alternate" hrefLang="x-default" href="https://fixco.se/referenser" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.h1}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          {/* Customer Reviews */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Anna Johansson",
                  location: "Stockholm",
                  rating: 5,
                  text: "Excellent service! The electrician was professional and completed the work perfectly. Highly recommended!"
                },
                {
                  name: "Erik Nilsson",
                  location: "Gothenburg",
                  rating: 5,
                  text: "Fast response and great quality. The plumbing issue was fixed quickly and the price was fair."
                },
                {
                  name: "Maria Lindberg",
                  location: "Malmö",
                  rating: 5,
                  text: "Very satisfied with the painting service. Clean work and attention to detail. Will use again!"
                }
              ].map((review, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{review.text}"</p>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Gallery */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Modern Kitchen Renovation",
                  category: "Electrical & Plumbing",
                  description: "Complete kitchen renovation with new electrical installations and plumbing."
                },
                {
                  title: "Smart Home Installation",
                  category: "Smart Home",
                  description: "Full smart home setup with automated lighting and security systems."
                },
                {
                  title: "Bathroom Upgrade",
                  category: "Plumbing & Painting",
                  description: "Modern bathroom renovation with new fixtures and waterproof painting."
                },
                {
                  title: "Office Electrical Work",
                  category: "Electrical",
                  description: "Commercial electrical installation for a modern office space."
                },
                {
                  title: "Exterior House Painting",
                  category: "Painting",
                  description: "Complete exterior house painting with high-quality weather-resistant paint."
                },
                {
                  title: "Emergency Plumbing Repair",
                  category: "Emergency Service",
                  description: "24/7 emergency response for critical plumbing issues."
                }
              ].map((project, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <div className="bg-muted h-48 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Project Image</span>
                  </div>
                  <div className="mb-2">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center mt-16 bg-muted/50 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Join thousands of satisfied customers who trust FIXCO with their home services.
            </p>
            <button
              data-wizard="quote"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Get Your Free Quote
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default ReferencesEn;