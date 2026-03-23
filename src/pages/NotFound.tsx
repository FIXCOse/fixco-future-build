import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home, Phone, ArrowRight, Wrench, Zap, Droplets, Paintbrush, TreePine, SprayCan } from "lucide-react";
import GradientButton from "@/components/GradientButton";
import { openServiceRequestModal } from "@/features/requests/ServiceRequestModal";

const POPULAR_SERVICES = [
  { name: "Snickare", slug: "snickare", icon: Wrench },
  { name: "Elektriker", slug: "elektriker", icon: Zap },
  { name: "VVS", slug: "vvs", icon: Droplets },
  { name: "Målare", slug: "malare", icon: Paintbrush },
  { name: "Trädgård", slug: "tradgard", icon: TreePine },
  { name: "Städ", slug: "stad", icon: SprayCan },
];

const POPULAR_AREAS = [
  { name: "Stockholm", slug: "stockholm" },
  { name: "Uppsala", slug: "uppsala" },
  { name: "Solna", slug: "solna" },
  { name: "Nacka", slug: "nacka" },
  { name: "Täby", slug: "taby" },
  { name: "Sundbyberg", slug: "sundbyberg" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Seo
        title="Sidan hittades inte | Fixco"
        description="Sidan du söker finns inte. Utforska våra tjänster eller kontakta oss för hjälp."
        noindex={true}
      />
      <div className="min-h-screen bg-background">
        {/* Hero section with gradient */}
        <div
          className="relative py-16 md:py-24 px-4"
          style={{
            backgroundImage: 'linear-gradient(135deg, #592db5 0%, #3d1a7a 40%, #7d40ff 100%)',
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-7xl md:text-9xl font-heading font-bold text-white/20 mb-2">404</h1>
            <p className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Sidan hittades inte
            </p>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Sidan du letade efter finns tyvärr inte. Men vi hjälper dig gärna hitta rätt!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <GradientButton href="/">
                <Home className="w-4 h-4 mr-2" /> Till startsidan
              </GradientButton>
              <GradientButton onClick={() => openServiceRequestModal({ showCategories: true })}>
                <Phone className="w-4 h-4 mr-2" /> Begär offert
              </GradientButton>
            </div>
          </div>
        </div>

        {/* Services grid */}
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">
            Letar du efter en tjänst?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
            {POPULAR_SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.slug}
                  to={`/tjanster/${svc.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {svc.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>

          <h2 className="text-xl font-heading font-bold text-foreground mb-6">
            Populära områden
          </h2>
          <div className="flex flex-wrap gap-2 mb-12">
            {POPULAR_AREAS.map((area) => (
              <Link
                key={area.slug}
                to={`/tjanster/snickare/${area.slug}`}
                className="px-4 py-2 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium text-foreground"
              >
                {area.name}
              </Link>
            ))}
          </div>

          {/* Contact info */}
          <div className="text-center p-6 rounded-2xl border border-border bg-card">
            <p className="text-muted-foreground mb-2">Behöver du hjälp? Ring oss direkt:</p>
            <a
              href="tel:+46793350228"
              className="text-2xl font-heading font-bold text-primary hover:underline"
            >
              079-335 02 28
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
