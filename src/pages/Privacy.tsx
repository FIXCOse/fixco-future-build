import Navigation from "@/components/Navigation";
import { Helmet } from "react-helmet-async";

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Integritetspolicy – Fixco</title>
        <meta name="description" content="Läs hur Fixco hanterar personuppgifter och integritet." />
        <link rel="canonical" href="/privacy" />
      </Helmet>
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Integritetspolicy</h1>
        <p className="text-muted-foreground max-w-3xl">Vi värnar om din integritet. Denna sida är en placeholder och kommer att uppdateras med komplett policytext.</p>
      </main>
    </div>
  );
}
