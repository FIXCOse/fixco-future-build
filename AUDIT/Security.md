# SÄKERHETS-AUDIT

## Executive Summary

Projektet har en god säkerhetsgrund med:
- ✅ Supabase RLS (Row Level Security) aktiverad på de flesta tabeller
- ✅ JWT-baserad autentisering via Supabase Auth
- ✅ HTTPS enforced (antas för production)
- ✅ Input validation med Zod i många forms
- ✅ SecurityWrapper med vissa headers

**Kritiska säkerhetsproblem:**
1. **CORS wildcard (`*`)** i alla edge functions - tillåter requests från vilken origin som helst
2. **PII-loggar** - personnummer, email, telefon loggas i klartext
3. **Ingen CSP (Content Security Policy)**
4. **Ingen rate limiting** på publika endpoints
5. **File upload validation** saknas för MIME types
6. **Email från onboarding@resend.dev** kan trigger spam-filter
7. **Secrets i logs** - risk för att logga känslig data

**GDPR-compliance:** ⚠️ RISK - PII loggas i flera edge functions

**Severity Distribution:**
- CRITICAL: 3 issues
- HIGH: 6 issues
- MEDIUM: 8 issues
- LOW: 5 issues

---

## 1. KRITISKA SÅRBARHETER

### CRIT-SEC-001: CORS Wildcard i Edge Functions

**Location:** Alla edge functions
```typescript
// supabase/functions/*/index.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // ⚠️ TILLÅTER ALLA ORIGINS
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

**Risk:**
- CSRF-attacker från godtyckliga domäner
- Data scraping från tredje part
- Reputation damage om API missbrukas

**Attack Scenario:**
```html
<!-- Attacker's website: evil.com -->
<script>
fetch('https://fnzjgohubvaxwpmnvwdq.supabase.co/functions/v1/create-booking-with-quote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'victim@example.com',
    service_slug: 'spam',
    // ... spam data
  })
});
</script>
```

Detta går igenom p.g.a. `Access-Control-Allow-Origin: *`.

**Lösning:**
```typescript
const ALLOWED_ORIGINS = [
  'https://fixco.se',
  'https://www.fixco.se',
  'https://app.fixco.se',
  ...(Deno.env.get('ENVIRONMENT') === 'development' ? ['http://localhost:5173'] : [])
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
    
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // ... rest of function
});
```

**Files affected:**
- supabase/functions/create-booking-with-quote/index.ts
- supabase/functions/send-quote-email-new/index.ts
- supabase/functions/ai-chat/index.ts
- supabase/functions/request-change-quote-public/index.ts
- supabase/functions/accept-quote-public/index.ts
- supabase/functions/reject-quote-public/index.ts
- supabase/functions/ask-question-quote/index.ts
- supabase/functions/set-reminder-quote/index.ts
- supabase/functions/get-quote-public/index.ts
- supabase/functions/cleanup-deleted-quotes/index.ts
- Alla andra publika edge functions

**Priority:** IMMEDIATE

---

### CRIT-SEC-002: PII Logging (GDPR-brott)

**Location:** Flera edge functions och frontend komponenter
```typescript
// supabase/functions/create-booking-with-quote/index.ts:50
console.error("customers.upsert", custErr);  // Loggar email, phone i error

// supabase/functions/send-quote-email-new/index.ts:21
console.log("Sending quote email for:", { quoteId, customerEmail, customerName });

// src/components/ActionWizard.tsx:80-125
console.log("[WIZARD] Prepared payload:", base);  // Kan innehålla personnummer
```

**Risk:**
- **GDPR Article 5(1)(f)**: Brott mot integritet och konfidentialitet
- **GDPR Article 32**: Brott mot säkerhet vid behandling
- **Böter**: Upp till 4% av årlig omsättning eller 20M EUR

**Data som loggas:**
- Email-adresser
- Telefonnummer
- Personnummer (via org_no eller personnummer-fält)
- Namn
- Adresser

**Lösning:**

1. **Skapa säker logger-utility:**
```typescript
// src/lib/logger.ts
import { createHash } from 'crypto';

function hashPII(value: string): string {
  return createHash('sha256').update(value).digest('hex').substring(0, 8);
}

function sanitize(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  
  const sanitized = { ...obj };
  const piiFields = ['email', 'phone', 'org_no', 'personnummer', 'ssn', 'address'];
  
  for (const key in sanitized) {
    if (piiFields.some(field => key.toLowerCase().includes(field))) {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = `[REDACTED-${hashPII(sanitized[key])}]`;
      }
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitize(sanitized[key]);
    }
  }
  
  return sanitized;
}

export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args.map(sanitize));
    }
  },
  error: (...args: any[]) => {
    console.error(...args.map(sanitize));
  },
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args.map(sanitize));
    }
  }
};
```

2. **Använd i edge functions:**
```typescript
// supabase/functions/lib/logger.ts (Deno version)
function sanitize(obj: any): any {
  // Same logic as above
}

export const logger = {
  log: (...args: any[]) => {
    if (Deno.env.get('ENVIRONMENT') !== 'production') {
      console.log(...args.map(sanitize));
    }
  },
  error: (...args: any[]) => {
    console.error(...args.map(sanitize));
  }
};
```

3. **Audit all logs:**
```bash
# Find all console.log/error/warn
grep -rn "console\.\(log\|error\|warn\)" supabase/functions/ src/

# Review each and sanitize
```

**Priority:** IMMEDIATE (GDPR compliance required)

---

### CRIT-SEC-003: Ingen Rate Limiting

**Location:** Alla publika edge functions, särskilt:
- create-booking-with-quote
- accept-quote-public
- reject-quote-public
- ask-question-quote
- ai-chat

**Risk:**
- DoS (Denial of Service) attacker
- API abuse / spam
- Cost escalation (Supabase Functions kostar per invocation)
- Database overload

**Attack Scenario:**
```javascript
// Attacker script
for (let i = 0; i < 100000; i++) {
  fetch('https://.../create-booking-with-quote', {
    method: 'POST',
    body: JSON.stringify({ email: 'spam@spam.com', ... })
  });
}
```

Utan rate limiting kan detta:
- Skapa 100k bookings på minuter
- Överbelasta databasen
- Kosta tusentals kronor i function invocations

**Lösning:**

**Option 1: Upstash Redis (Recommended)**
```bash
# Install
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// supabase/functions/lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv(); // UPSTASH_REDIS_REST_URL and TOKEN

export const ratelimit = {
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
  }),
  authenticated: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 per minute
    analytics: true,
  }),
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 AI calls per hour
    analytics: true,
  })
};

export async function checkRateLimit(
  identifier: string, 
  type: 'public' | 'authenticated' | 'ai' = 'public'
): Promise<{ success: boolean; reset?: number }> {
  const { success, limit, reset, remaining } = await ratelimit[type].limit(identifier);
  
  if (!success) {
    return { 
      success: false, 
      reset: reset 
    };
  }
  
  return { success: true };
}
```

**Usage:**
```typescript
// In edge function
import { checkRateLimit } from './lib/ratelimit.ts';

serve(async (req) => {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success, reset } = await checkRateLimit(ip, 'public');
  
  if (!success) {
    return new Response(
      JSON.stringify({ 
        error: 'Too many requests', 
        retryAfter: reset 
      }),
      { 
        status: 429,
        headers: {
          ...corsHeaders,
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000))
        }
      }
    );
  }
  
  // ... rest of function
});
```

**Option 2: Supabase Edge Functions Rate Limiting (Simpler)**
Supabase has built-in rate limiting on the platform level, but det är ofta för generöst. Implementera egen för bättre kontroll.

**Priority:** HIGH (before production)

---

## 2. HÖGRISK-SÅRBARHETER

### HIGH-SEC-001: Ingen CSP (Content Security Policy)

**Location:** src/components/SecurityWrapper.tsx

**Current:**
```tsx
<Helmet>
  <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
  <meta httpEquiv="X-Frame-Options" content="DENY" />
  <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
  {/* ... other headers but NO CSP */}
</Helmet>
```

**Risk:**
- XSS (Cross-Site Scripting) attacker
- Data exfiltration
- Malicious script injection

**Lösning:**
```tsx
<Helmet>
  <meta 
    httpEquiv="Content-Security-Policy" 
    content={`
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ai.gateway.lovable.dev;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://*.supabase.co https://ai.gateway.lovable.dev;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim()}
  />
</Helmet>
```

**Note:** `'unsafe-inline'` och `'unsafe-eval'` behövs troligen för Vite dev + vissa libraries. I production, försök ta bort dem genom att:
1. Externalize inline scripts
2. Use nonces for dynamic scripts
3. Hash static inline scripts

**Better approach för production:**
```typescript
// Generate nonce server-side (or in edge function for SSR)
const nonce = crypto.randomUUID();

<meta 
  httpEquiv="Content-Security-Policy" 
  content={`
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://ai.gateway.lovable.dev;
    style-src 'self' 'nonce-${nonce}';
    ...
  `}
/>

<script nonce={nonce}>
  // Inline scripts
</script>
```

**Priority:** HIGH

---

### HIGH-SEC-002: Input Validation Saknas i Edge Functions

**Location:** 
- supabase/functions/ai-chat/index.ts
- supabase/functions/create-booking-with-quote/index.ts (partial)

**Current:**
```typescript
// ai-chat/index.ts:15
const { messages, tools } = await req.json();
// No validation! ⚠️
```

**Risk:**
- Injection attacks
- Malformed data causing crashes
- Type confusion bugs

**Lösning:**
```bash
# Install Zod for Deno
# No npm install needed, use ESM import
```

```typescript
// lib/schemas.ts
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const aiChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'tool']),
    content: z.string().max(10000)
  })).max(50), // Max 50 messages per request
  tools: z.array(z.any()).optional()
});

export const bookingSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  service_slug: z.string().max(100),
  mode: z.enum(['quote', 'book']),
  fields: z.record(z.any()).optional(),
  fileUrls: z.array(z.string().url()).max(10).optional()
});
```

**Usage:**
```typescript
// ai-chat/index.ts
import { aiChatSchema } from './lib/schemas.ts';

serve(async (req) => {
  try {
    const body = await req.json();
    const validated = aiChatSchema.parse(body);
    
    // Use validated.messages, validated.tools
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input', 
          details: error.errors 
        }),
        { status: 400, headers: corsHeaders }
      );
    }
    throw error;
  }
});
```

**Priority:** HIGH

---

### HIGH-SEC-003: File Upload Validation Saknas

**Location:** supabase/functions/create-booking-with-quote/index.ts

**Current:**
```typescript
const {
  fileUrls = [],  // No validation! ⚠️
} = body ?? {};
```

**Risk:**
- Upload av exekverbara filer (.exe, .sh, .bat)
- XXE (XML External Entity) via SVG
- Zip bombs
- Malware distribution

**Lösning:**
```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function validateFile(fileUrl: string): Promise<boolean> {
  try {
    const response = await fetch(fileUrl, { method: 'HEAD' });
    
    const contentType = response.headers.get('content-type');
    const contentLength = parseInt(response.headers.get('content-length') || '0');
    
    if (!contentType || !ALLOWED_MIME_TYPES.includes(contentType)) {
      throw new Error(`Invalid file type: ${contentType}`);
    }
    
    if (contentLength > MAX_FILE_SIZE) {
      throw new Error(`File too large: ${contentLength} bytes`);
    }
    
    return true;
  } catch (error) {
    console.error('File validation error:', error);
    return false;
  }
}

// Usage
if (fileUrls && fileUrls.length > 0) {
  for (const fileUrl of fileUrls) {
    const valid = await validateFile(fileUrl);
    if (!valid) {
      return json({ error: 'Invalid file' }, 400);
    }
  }
}
```

**Priority:** HIGH

---

### HIGH-SEC-004: Exposed Service Role Key i Logs Risk

**Location:** Edge functions använder SERVICE_ROLE_KEY

**Risk:**
Om SERVICE_ROLE_KEY någonsin loggas eller läcker kan angripare:
- Bypassa ALL RLS
- Radera eller modifiera vilken data som helst
- Skapa nya admin-användare

**Mitigation:**
1. **Aldrig logga env vars:**
```typescript
// ❌ NEVER
console.log('Env:', Deno.env.toObject());

// ✅ OK
console.log('Function started');
```

2. **Rotate keys regelbundet:**
```bash
# Via Supabase dashboard
# Project Settings > API > Service Role Key > Regenerate
```

3. **Use least privilege:**
Istället för SERVICE_ROLE_KEY överallt, skapa custom roles med begränsade permissions där möjligt.

4. **Audit logs:**
Implementera audit log för alla SERVICE_ROLE_KEY användningar:
```typescript
await supabase.from('audit_log').insert({
  action: 'service_role_query',
  actor: 'SYSTEM',
  target: 'customers',
  meta: { function: 'create-booking-with-quote' }
});
```

**Priority:** MEDIUM (ongoing monitoring)

---

### HIGH-SEC-005: Ingen Session Timeout

**Location:** src/integrations/supabase/client.ts

**Current:**
```typescript
auth: {
  storage: localStorage,
  persistSession: true,
  autoRefreshToken: true,
  // No explicit session timeout ⚠️
}
```

**Risk:**
- Sessions kan leva för evigt på shared computers
- Stolen session tokens remain valid

**Lösning:**
```typescript
// src/lib/sessionManager.ts
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function initSessionManager() {
  let lastActivity = Date.now();
  
  // Check on page load
  const lastActivityStored = localStorage.getItem('lastActivity');
  if (lastActivityStored) {
    const timeSinceActivity = Date.now() - parseInt(lastActivityStored);
    if (timeSinceActivity > ACTIVITY_TIMEOUT) {
      // Force logout
      supabase.auth.signOut();
      return;
    }
  }
  
  // Update last activity
  function updateActivity() {
    lastActivity = Date.now();
    localStorage.setItem('lastActivity', String(lastActivity));
  }
  
  // Listen for user activity
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, updateActivity, true);
  });
  
  // Check periodically
  setInterval(() => {
    const timeSinceActivity = Date.now() - lastActivity;
    if (timeSinceActivity > ACTIVITY_TIMEOUT) {
      supabase.auth.signOut();
      window.location.href = '/auth';
    }
  }, 60000); // Check every minute
}
```

**Usage:**
```tsx
// src/main.tsx or App.tsx
import { initSessionManager } from './lib/sessionManager';

useEffect(() => {
  initSessionManager();
}, []);
```

**Priority:** MEDIUM

---

### HIGH-SEC-006: Email Spoofing Risk

**Location:** supabase/functions/send-quote-email-new/index.ts:100

**Current:**
```typescript
from: "Fixco <onboarding@resend.dev>"
```

**Risk:**
- Emails can be marked as spam
- Phishing attacks kan använda samma "from"
- Domain reputation damage

**Lösning:**
```typescript
from: "Fixco <offert@fixco.se>",  // eller noreply@fixco.se
replyTo: ["info@fixco.se"],

// CRITICAL: Verify domain in Resend dashboard first!
// 1. Add DNS records (SPF, DKIM, DMARC)
// 2. Verify domain ownership
// 3. Test with mail-tester.com
```

**DNS Records needed:**
```dns
; SPF (Sender Policy Framework)
@ IN TXT "v=spf1 include:_spf.resend.com ~all"

; DKIM (Domain Keys Identified Mail)
resend._domainkey IN CNAME resend.example.com.

; DMARC (Domain-based Message Authentication, Reporting & Conformance)
_dmarc IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@fixco.se"
```

**Priority:** MEDIUM (before production)

---

## 3. MEDEL-RISK SÅRBARHETER

### MED-SEC-001: Broad RLS Policies

**Location:** Database - services table

**Current:**
```sql
-- Anyone can view active services
CREATE POLICY "services_select_public" 
ON public.services 
FOR SELECT 
USING (is_active = true);
```

**Risk:**
Låg för `services` tabellen, men verifiera att inga känsliga data finns där (som interna priser, marginaler, etc).

**Recommendation:**
Audit all SELECT policies för publika tabeller och verifiera att no sensitive data is exposed.

---

### MED-SEC-002: Realtime Subscriptions Utan Filter

**Location:** useQuotesRealtime, useJobsRealtime hooks

**Current:**
```typescript
supabase
  .channel('schema-db-changes')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quotes_new' }, ...)
```

**Risk:**
Användare får notiser om ALL quotes/jobs, inte bara sina egna. Kan exponera metadata om andra användares aktivitet.

**Lösning:**
```typescript
const userId = await supabase.auth.getUser();

supabase
  .channel('user-quotes')
  .on(
    'postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'quotes_new',
      filter: `customer_id=eq.${userId}` // Only user's own quotes
    },
    handler
  )
```

**Priority:** MEDIUM

---

### MED-SEC-003: localStorage Sensitive Data

**Location:** Multiple places

**Current:**
```typescript
// src/components/AIChat/ConversationManager.ts:512
sessionStorage.setItem('fixco_chat_state', JSON.stringify({ state: this.state }));

// EditableServiceFilter.tsx:237
sessionStorage.setItem('fixco-filter-subCategories', JSON.stringify(newSubCats));
```

**Risk:**
- SessionStorage accessible via XSS
- Data survives session (for localStorage)
- No encryption

**Recommendation:**
1. Don't store sensitive data (no PII)
2. Encrypt if necessary:
```typescript
import { encrypt, decrypt } from './lib/crypto';

sessionStorage.setItem('key', encrypt(data, userSecret));
```

3. Clear on logout:
```typescript
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    localStorage.clear();
    sessionStorage.clear();
  }
});
```

**Priority:** LOW (if no PII stored) / MEDIUM (if PII stored)

---

### MED-SEC-004: Supabase Anon Key Exposed

**Location:** 
- .env:2
- src/integrations/supabase/client.ts:6

**Current:**
```typescript
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

**Risk:**
Dette er INTENDED behavior (anon key skal vara public), men det betyder:
- Anyone can call your Supabase API
- RLS is your ONLY defense

**Mitigation:**
1. **Verify RLS on ALL tables:**
```bash
# Check for tables without RLS
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT IN (
  SELECT tablename FROM pg_policies
);
```

2. **Monitor API usage:**
Set up alerts for:
- Unusual spike in requests
- Many failed RLS checks
- Requests from unexpected IPs

3. **Consider API Gateway:**
For extra protection, put Cloudflare or AWS API Gateway in front med:
- Rate limiting
- IP whitelisting
- DDoS protection

**Priority:** LOW (expected behavior, mitigated by RLS)

---

### MED-SEC-005: Error Messages Leak Information

**Location:** Flera edge functions

**Current:**
```typescript
// create-booking-with-quote/index.ts:51
return json({ error: `customers.upsert: ${custErr.message}` }, 400);
```

**Risk:**
Error messages kan avslöja:
- Database schema
- Internal logic
- SQL query structure

**Lösning:**
```typescript
// Production-safe errors
if (custErr) {
  console.error('Customer upsert failed:', custErr); // Log internally
  
  return json({ 
    error: 'Failed to process customer information',
    code: 'CUSTOMER_ERROR' // Generic error code
  }, 400);
}
```

**Priority:** LOW

---

## 4. LÅGRISK REKOMMENDATIONER

### LOW-SEC-001: Add Security Headers via Edge Function

**Current:** Headers via React Helmet (client-side)

**Better:** Set headers server-side via Supabase Edge Function middleware

```typescript
// supabase/functions/_middleware.ts
export async function handler(req: Request) {
  const response = await next(req);
  
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}
```

---

### LOW-SEC-002: Implement Audit Logging

**Current:** Partial audit logging exists (`audit_log` table)

**Recommendation:** Log alla kritiska operationer:
- User login/logout
- Quote accept/reject
- Booking creation
- Admin actions
- Data exports

```typescript
// lib/auditLog.ts
export async function logAudit({
  action,
  actor,
  target,
  meta
}: {
  action: string;
  actor: string | null;
  target?: string;
  meta?: any;
}) {
  await supabase.from('audit_log').insert({
    action,
    actor: actor || 'SYSTEM',
    target,
    meta,
    created_at: new Date().toISOString()
  });
}
```

---

### LOW-SEC-003: Add CAPTCHA för Publika Forms

**Location:** Contact form, booking form

**Recommendation:**
```bash
npm install @hcaptcha/react-hcaptcha
```

```tsx
import HCaptcha from '@hcaptcha/react-hcaptcha';

function ContactForm() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA');
      return;
    }
    
    // Submit with token
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... fields */}
      <HCaptcha
        sitekey="YOUR_SITE_KEY"
        onVerify={(token) => setCaptchaToken(token)}
      />
    </form>
  );
}
```

**Priority:** LOW (but recommended for production)

---

### LOW-SEC-004: Implementera Brute-force Protection

**Location:** Auth login

**Current:** Supabase Auth har inbyggd rate limiting, men lägg till extra:

```typescript
// lib/loginAttempts.ts
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function checkLoginAttempts(email: string): boolean {
  const attempts = JSON.parse(
    localStorage.getItem(`login_attempts_${email}`) || '[]'
  );
  
  const recentAttempts = attempts.filter(
    (timestamp: number) => Date.now() - timestamp < LOCKOUT_DURATION
  );
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false; // Locked out
  }
  
  return true;
}

export function recordLoginAttempt(email: string) {
  const attempts = JSON.parse(
    localStorage.getItem(`login_attempts_${email}`) || '[]'
  );
  
  attempts.push(Date.now());
  localStorage.setItem(`login_attempts_${email}`, JSON.stringify(attempts));
}
```

---

### LOW-SEC-005: SQL Injection Prevention

**Status:** ✅ Already protected via Supabase Client

Supabase client använder prepared statements automatically, så SQL injection är redan prevented.

**Verify:** Never use raw SQL strings:
```typescript
// ❌ NEVER
supabase.rpc('execute_sql', { query: `SELECT * FROM users WHERE email = '${userInput}'` });

// ✅ ALWAYS use parameterized queries
supabase.from('users').select().eq('email', userInput);
```

---

## Sammanfattande Prioritering

### OMEDELBART (innan production):
1. ✅ Fix CORS wildcard → origin whitelist (CRIT-SEC-001)
2. ✅ Remove/sanitize PII logs (CRIT-SEC-002)
3. ✅ Implement rate limiting (CRIT-SEC-003)
4. ✅ Fix email URL från /quote/ till /q/ (HIGH-SEC relaterat)

### INOM 1 VECKA:
1. ✅ Add CSP headers (HIGH-SEC-001)
2. ✅ Input validation i edge functions (HIGH-SEC-002)
3. ✅ File upload validation (HIGH-SEC-003)
4. ✅ Fix email från onboarding@resend.dev (HIGH-SEC-006)

### INOM 1 MÅNAD:
1. ✅ Session timeout implementation (HIGH-SEC-005)
2. ✅ Audit RLS policies (MED-SEC-001)
3. ✅ Filter realtime subscriptions (MED-SEC-002)
4. ✅ Sanitize error messages (MED-SEC-005)

### ONGOING:
1. ✅ Monitor for exposed secrets (HIGH-SEC-004)
2. ✅ Regular security audits
3. ✅ Dependency updates (`npm audit`)
4. ✅ Penetration testing

---

## Säkerhets-checklist för Production

- [ ] CORS whitelist implementerad
- [ ] Rate limiting aktiverad
- [ ] CSP header konfigurerad
- [ ] All PII saniterad från logs
- [ ] Input validation på alla endpoints
- [ ] File upload validation
- [ ] Email domain verifierad
- [ ] Session timeout implementerad
- [ ] RLS policies auditerade
- [ ] Audit logging aktiverad
- [ ] Penetration test genomförd
- [ ] GDPR compliance verifierad
- [ ] Incident response plan dokumenterad

---

## Kontaktinformation för Security Issues

**Rapportera säkerhetsproblem till:**
- Email: security@fixco.se
- Response time: < 24h för critical issues

**Bug Bounty Program:**
Överväg att starta bug bounty på t.ex. HackerOne för att incentivize responsible disclosure.
