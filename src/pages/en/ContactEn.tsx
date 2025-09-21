import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from '@/hooks/useContent';
import { Loader2, Phone, Mail, MapPin } from 'lucide-react';

const ContactEn: React.FC = () => {
  const { content, isLoading, isEnglishMissing } = useContent('/en/contact', 'en');

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
        <link rel="alternate" hrefLang="sv" href="https://fixco.se/kontakt" />
        <link rel="alternate" hrefLang="en" href="https://fixco.se/en/contact" />
        <link rel="alternate" hrefLang="x-default" href="https://fixco.se/kontakt" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.h1}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">08-123 456 78</p>
                    <p className="text-sm text-muted-foreground">Available Monday-Friday 8:00-17:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@fixco.se</p>
                    <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Service Area</h3>
                    <p className="text-muted-foreground">Stockholm and surrounding areas</p>
                    <p className="text-sm text-muted-foreground">Serving the greater Stockholm region</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactEn;