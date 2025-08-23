import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

const WhatsAppButton = ({ 
  message = "Hej! Jag är intresserad av era tjänster.", 
  className = "",
  variant = "outline",
  size = "default"
}: WhatsAppButtonProps) => {
  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "46701234567"; // Swedish format without +
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: 'whatsapp_button'
      });
    }
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleWhatsApp}
      variant={variant}
      size={size}
      className={`${className} border-green-500 text-green-500 hover:bg-green-500/10 hover:border-green-600`}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;