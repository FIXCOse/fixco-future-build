import { useAuth } from "@/hooks/useAuth";
import { createBooking } from "@/lib/api/bookings";
import { createQuoteRequest } from "@/lib/api/quote-requests";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function TestBooking() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const testBooking = async () => {
    if (!user) {
      toast.error("Måste vara inloggad");
      return;
    }

    setLoading(true);
    try {
      console.log('Creating test booking...');
      const result = await createBooking({
        service_id: 'el-test',
        service_name: 'El Test',
        customer_id: user.id,
        price_type: 'hourly',
        hourly_rate: 1059,
        contact_name: 'Test Bokning',
        contact_email: user.email || '',
      });
      console.log('Booking created:', result);
      toast.success("Testbokning skapad!");
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Fel: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testQuoteRequest = async () => {
    if (!user) {
      toast.error("Måste vara inloggad");
      return;
    }

    setLoading(true);
    try {
      console.log('Creating test quote request...');
      const result = await createQuoteRequest({
        service_id: 'el-quote-test',
        customer_id: user.id,
        message: 'Test offertförfrågan',
        name: 'Test Offert',
        email: user.email || '',
      });
      console.log('Quote request created:', result);
      toast.success("Test-offertförfrågan skapad!");
    } catch (error) {
      console.error('Quote request error:', error);
      toast.error("Fel: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Test Bokning & Offert System</h1>
      
      {user ? (
        <div className="space-y-4">
          <p>Inloggad som: {user.email} (ID: {user.id})</p>
          
          <div className="flex gap-4">
            <Button onClick={testBooking} disabled={loading}>
              Testa Bokning
            </Button>
            <Button onClick={testQuoteRequest} disabled={loading} variant="outline">
              Testa Offertförfrågan
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Efter du testat, kolla /admin/bookings och /admin/quote-requests för att se om data visas.
          </p>
        </div>
      ) : (
        <p>Måste vara inloggad för att testa</p>
      )}
    </div>
  );
}