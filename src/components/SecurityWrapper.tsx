import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SECURITY WRAPPER - Enhanced
 * Applies security headers and client-side rate limiting
 */
const SecurityWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Enhanced rate limiting with action-based throttling
    const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};
    
    const checkRateLimit = (action: string, maxAttempts = 5, windowMs = 900000) => {
      const now = Date.now();
      const key = action;
      
      if (!rateLimitStore[key]) {
        rateLimitStore[key] = { count: 0, resetTime: now + windowMs };
      }
      
      const limit = rateLimitStore[key];
      
      // Reset if window has passed
      if (now > limit.resetTime) {
        limit.count = 0;
        limit.resetTime = now + windowMs;
      }
      
      limit.count++;
      
      // Block if exceeded
      if (limit.count > maxAttempts) {
        const waitTime = Math.ceil((limit.resetTime - now) / 60000);
        throw new Error(`För många försök. Försök igen om ${waitTime} minuter.`);
      }
      
      return true;
    };

    // Make available globally for forms
    (window as any).checkRateLimit = checkRateLimit;

    // Cleanup old entries every 5 minutes
    const cleanup = setInterval(() => {
      const now = Date.now();
      Object.keys(rateLimitStore).forEach(key => {
        if (now > rateLimitStore[key].resetTime + 300000) {
          delete rateLimitStore[key];
        }
      });
    }, 300000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      <Helmet>
        {/* Enhanced Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta 
          httpEquiv="Permissions-Policy" 
          content="camera=(), microphone=(), geolocation=(self), interest-cohort=()" 
        />
        
        {/* Improved CSP with Supabase support */}
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fnzjgohubvaxwpmnvwdq.supabase.co https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://fnzjgohubvaxwpmnvwdq.supabase.co wss://fnzjgohubvaxwpmnvwdq.supabase.co https://www.google-analytics.com; frame-ancestors 'self';" 
        />
      </Helmet>
      {children}
    </>
  );
};

export default SecurityWrapper;