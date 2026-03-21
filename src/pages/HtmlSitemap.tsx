import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BASE_SERVICES, STOCKHOLM_AREAS, UPPSALA_AREAS, generateAreaSlug } from "@/data/localServiceData";
import { useMemo } from "react";

const HtmlSitemap = () => {
  const mainPages = useMemo(() => [
    { label: 'Hem', href: '/' },
    { label: 'Tjänster', href: '/tjanster' },
    { label: 'Kontakt', href: '/kontakt' },
    { label: 'Om oss', href: '/om-oss' },
    { label: 'Referenser', href: '/referenser' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Blogg', href: '/blogg' },
    { label: 'Boka hembesök', href: '/boka-hembesok' },
    { label: 'ROT-avdrag', href: '/rot' },
    { label: 'RUT-avdrag', href: '/rut' },
    { label: 'Karriär', href: '/karriar' },
  ], []);

  const coreServices = useMemo(() =>
    BASE_SERVICES.filter(s => !['koksmontering', 'mobelmontering', 'badrumsrenovering', 'koksrenovering', 'altanbygge', 'fasadmalning', 'inomhusmalning', 'golvlaggning', 'elinstallation', 'rivning'].includes(s.slug)),
    []
  );

  const nicheServices = useMemo(() =>
    BASE_SERVICES.filter(s => ['koksmontering', 'mobelmontering', 'badrumsrenovering', 'koksrenovering', 'altanbygge', 'fasadmalning', 'inomhusmalning', 'golvlaggning', 'elinstallation', 'rivning'].includes(s.slug)),
    []
  );

  return (
    <>
      <Helmet>
        <title>Webbkarta | Fixco</title>
        <meta name="description" content="Komplett webbkarta för Fixco — alla tjänster, områden och sidor." />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Webbkarta</h1>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">Huvudsidor</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {mainPages.map(p => (
                <li key={p.href}>
                  <Link to={p.href} className="text-primary hover:underline text-sm">{p.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">Tjänster</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {coreServices.map(s => (
                <li key={s.slug}>
                  <Link to={`/tjanster/${s.slug}`} className="text-primary hover:underline text-sm font-medium">{s.name}</Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-medium text-foreground mb-3">Specialtjänster</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {nicheServices.map(s => (
                <li key={s.slug}>
                  <Link to={`/tjanster/${s.slug}`} className="text-primary hover:underline text-sm">{s.name}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">Stockholmsområdet</h2>
            {coreServices.map(service => (
              <details key={service.slug} className="mb-3 group">
                <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {service.name} — Stockholm
                </summary>
                <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 pl-4">
                  {STOCKHOLM_AREAS.map(area => {
                    const areaSlug = generateAreaSlug(area);
                    return (
                      <li key={areaSlug}>
                        <Link
                          to={`/tjanster/${service.slug}/${areaSlug}`}
                          className="text-muted-foreground hover:text-primary text-xs hover:underline"
                        >
                          {service.name} {area}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">Uppsalaområdet</h2>
            {coreServices.map(service => (
              <details key={service.slug} className="mb-3">
                <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {service.name} — Uppsala
                </summary>
                <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 pl-4">
                  {UPPSALA_AREAS.map(area => {
                    const areaSlug = generateAreaSlug(area);
                    return (
                      <li key={areaSlug}>
                        <Link
                          to={`/tjanster/${service.slug}/${areaSlug}`}
                          className="text-muted-foreground hover:text-primary text-xs hover:underline"
                        >
                          {service.name} {area}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default HtmlSitemap;
