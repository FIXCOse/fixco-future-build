/**
 * SHARED VALIDATION UTILITIES FOR EDGE FUNCTIONS
 * Use these to validate all incoming requests server-side
 */

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

export async function checkRateLimit(
  supabaseClient: any,
  identifier: string,
  action: string,
  maxAttempts = 5,
  windowMinutes = 15
): Promise<boolean> {
  try {
    const { data, error } = await supabaseClient.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_action: action,
      p_max_attempts: maxAttempts,
      p_window_minutes: windowMinutes
    });

    if (error) throw error;
    return data === true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open in case of error (but log it)
    return true;
  }
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const emailSchema = z
  .string()
  .trim()
  .email({ message: 'Invalid email address' })
  .min(5)
  .max(255)
  .toLowerCase()
  .refine(
    (email) => {
      const disposableDomains = [
        'tempmail.com',
        'guerrillamail.com',
        '10minutemail.com',
        'mailinator.com',
        'throwaway.email',
        'temp-mail.org',
      ];
      const domain = email.split('@')[1];
      return !disposableDomains.includes(domain);
    },
    { message: 'Disposable email addresses are not allowed' }
  );

export const phoneSchema = z
  .string()
  .trim()
  .min(8)
  .max(20)
  .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format');

export const postalCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{3}\s?\d{2}$/, 'Invalid postal code format');

export const nameSchema = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(/^[a-zA-ZåäöÅÄÖ\s\-]+$/, 'Name can only contain letters');

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return { success: false, error: messages.join(', ') };
    }
    return { success: false, error: 'Validation failed' };
  }
}

// ============================================
// SANITIZATION
// ============================================

export function sanitizeHtml(html: string): string {
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br'];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  
  return html.replace(tagRegex, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });
}

export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// ============================================
// IP & USER AGENT
// ============================================

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         req.headers.get('x-real-ip') ||
         'unknown';
}

export function getUserAgent(req: Request): string {
  return req.headers.get('user-agent') || 'unknown';
}

// ============================================
// CORS HEADERS
// ============================================

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ============================================
// ERROR RESPONSES
// ============================================

export function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

export function successResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}