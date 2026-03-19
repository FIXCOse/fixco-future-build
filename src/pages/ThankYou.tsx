import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fireConfetti } from "@/lib/confetti";
import { CheckCircle2, ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const service = searchParams.get("service");

  useEffect(() => {
    const timer = setTimeout(() => fireConfetti(), 500);
    return () => clearTimeout(timer);
  }, []);

  // Google Ads conversion placeholder — activate when Conversion ID is set
  // useEffect(() => {
  //   if (typeof window.gtag === 'function') {
  //     window.gtag('event', 'conversion', {
  //       send_to: 'AW-XXXXXXXXX/CONVERSION_LABEL',
  //       value: 1.0,
  //       currency: 'SEK',
  //       transaction_id: bookingId,
  //     });
  //   }
  // }, [bookingId]);

  return (
    <>
      <Helmet>
        <title>Tack för din förfrågan | Fixco</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-lg text-center space-y-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Tack för din förfrågan!
            </h1>
            <p className="text-lg text-muted-foreground">
              Vi har mottagit din bokning{service ? ` för ${service}` : ""} och
              återkommer till dig inom kort.
            </p>
            {bookingId && (
              <p className="text-sm text-muted-foreground">
                Referens: <span className="font-mono font-semibold text-foreground">{bookingId.slice(0, 8)}</span>
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-left space-y-3">
            <h2 className="font-semibold text-foreground">Vad händer nu?</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
              <li>Vi granskar din förfrågan och kontaktar dig inom 24 timmar</li>
              <li>Du får en offert med fast pris — inga dolda kostnader</li>
              <li>Vi bokar in jobbet när det passar dig</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Tillbaka till startsidan
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:+46101234567">
                <Phone className="h-4 w-4" />
                Ring oss direkt
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
