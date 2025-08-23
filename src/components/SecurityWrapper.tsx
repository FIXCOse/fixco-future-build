import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Security headers and protection
const SecurityWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Rate limiting for forms (simple client-side)
    const rateLimitMap = new Map();
    
    const checkRateLimit = (identifier: string, maxRequests = 5, windowMs = 60000) => {
      const now = Date.now();
      const requests = rateLimitMap.get(identifier) || [];
      const validRequests = requests.filter((time: number) => now - time < windowMs);
      
      if (validRequests.length >= maxRequests) {
        return false;
      }
      
      validRequests.push(now);
      rateLimitMap.set(identifier, validRequests);
      return true;
    };

    // Add to window for form usage
    (window as any).checkRateLimit = checkRateLimit;

    // Clean up old rate limit entries
    const cleanup = setInterval(() => {
      const now = Date.now();
      rateLimitMap.forEach((value, key) => {
        const validRequests = value.filter((time: number) => now - time < 60000);
        if (validRequests.length === 0) {
          rateLimitMap.delete(key);
        } else {
          rateLimitMap.set(key, validRequests);
        }
      });
    }, 60000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      <Helmet>
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* CSP - Basic implementation */}
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;" 
        />
      </Helmet>
      {children}
    </>
  );
};

export default SecurityWrapper;