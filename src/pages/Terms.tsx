import { Helmet } from "react-helmet-async";

export default function Terms() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Villkor – Fixco</title>
        <meta name="description" content="Läs Fixcos användarvillkor." />
        <link rel="canonical" href="/terms" />
      </Helmet>
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Användarvillkor</h1>
        <p className="text-muted-foreground max-w-3xl">Här beskriver vi de villkor som gäller för användning av våra tjänster. Denna sida är en placeholder och kan uppdateras med fullständigt juridiskt innehåll senare.</p>
      </main>
    </div>
  );
}
