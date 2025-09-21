import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: t('errors.fieldsRequired'),
        description: t('errors.fillAllFields'),
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: t('contact.thankYouTitle'),
        description: t('contact.thankYouDesc'),
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        address: ""
      });
    } catch (error) {
      toast({
        title: t('errors.somethingWentWrong'),
        description: t('errors.tryAgainOrCall'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const services = [
    t('servicesData.carpentry'), 
    t('servicesData.plumbing'), 
    t('servicesData.assembly'), 
    t('servicesData.garden'), 
    t('servicesData.cleaning'),
    t('servicesData.projectManagement'), 
    t('servicesData.groundwork'),
    t('servicesData.technicalInstallations'),
    t('servicesData.electrical'), 
    t('servicesData.propertyMaintenance'), 
    t('servicesData.other')
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 hero-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              {t('contact.title')} <span className="gradient-text">{t('contact.titleHighlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('contact.subtitle')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="card-premium p-6">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="font-bold">{t('contact.quickResponse')}</div>
                <div className="text-sm text-muted-foreground">{t('contact.responseTime')}</div>
              </div>
              <div className="card-premium p-6">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-4" />
                <div className="font-bold">{t('contact.freeQuote')}</div>
                <div className="text-sm text-muted-foreground">{t('contact.noHiddenCosts')}</div>
              </div>
              <div className="card-premium p-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="font-bold">{t('contact.localService')}</div>
                <div className="text-sm text-muted-foreground">{t('contact.serviceArea')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div className="card-premium p-8">
              <h2 className="text-3xl font-bold mb-6">
                {t('contact.formTitle')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('contact.formSubtitle')}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('forms.name')} <span className="text-red-400">*</span>
                    </label>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('forms.fullName')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('forms.phone')} <span className="text-red-400">*</span>
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('forms.phoneFormat')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('forms.email')} <span className="text-red-400">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('forms.emailFormat')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('forms.address')}
                  </label>
                  <Input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('forms.addressFormat')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('forms.service')}
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t('forms.selectService')}</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('forms.projectDescription')} <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder={t('forms.projectDescriptionPlaceholder')}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-primary text-primary-foreground font-bold text-lg py-3"
                >
                  {isSubmitting ? (
                    <>{t('forms.submitting')}</>
                  ) : (
                    <>
                      {t('forms.submitRequest')}
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  {t('forms.privacyConsent')}
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-6">{t('contact.contactInfo')}</h3>
                
                <div className="space-y-6">
                  <a href="tel:08-123456789" className="flex items-center space-x-4 hover:text-primary transition-colors">
                    <div className="p-3 rounded-lg bg-gradient-to-br gradient-primary-subtle">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{t('contact.phone')}</div>
                      <div className="text-muted-foreground">{t('common.phone')}</div>
                      <div className="text-sm text-green-400">{t('contact.callNow')}</div>
                    </div>
                  </a>

                  <a href="mailto:info@fixco.se" className="flex items-center space-x-4 hover:text-primary transition-colors">
                    <div className="p-3 rounded-lg bg-gradient-to-br gradient-primary-subtle">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{t('contact.email')}</div>
                      <div className="text-muted-foreground">info@fixco.se</div>
                      <div className="text-sm text-primary">{t('contact.responseWithin2Hours')}</div>
                    </div>
                  </a>

                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br gradient-primary-subtle">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{t('contact.businessArea')}</div>
                      <div className="text-muted-foreground">{t('contact.businessAreaLocation')}</div>
                      <div className="text-sm text-muted-foreground">{t('contact.nationalProjects')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold mb-4">
                  <span className="gradient-text">{t('contact.businessHours')}</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{t('contact.mondayFriday')}</span>
                    <span className="text-primary font-semibold">07:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.saturday')}</span>
                    <span className="text-primary font-semibold">08:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.sunday')}</span>
                    <span className="text-muted-foreground">{t('contact.closed')}</span>
                  </div>
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-sm">
                      <AlertCircle className="h-4 w-4 text-orange-400 inline mr-2" />
                      <strong>{t('contact.emergencyService')}:</strong> {t('contact.emergencyNote')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium p-8 gradient-primary-subtle border-primary/20">
                <h3 className="text-xl font-bold mb-4">{t('contact.whyChooseFixco')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span>{t('contact.startWithin24Hours')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span>{t('contact.rotDiscount')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span>{t('contact.guaranteedQuality')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span>{t('contact.freeQuotes')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;