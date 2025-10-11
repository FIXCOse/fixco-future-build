import { z } from 'zod';

/**
 * COMPREHENSIVE ZOD VALIDATION SCHEMAS
 * Security: All user input MUST be validated with these schemas
 */

// ============================================
// COMMON VALIDATORS
// ============================================

export const emailSchema = z
  .string()
  .trim()
  .email({ message: 'Ogiltig e-postadress' })
  .min(5, 'E-postadressen är för kort')
  .max(255, 'E-postadressen är för lång')
  .toLowerCase()
  .refine(
    (email) => {
      // Prevent disposable emails
      const disposableDomains = [
        'tempmail.com',
        'guerrillamail.com',
        '10minutemail.com',
        'mailinator.com',
        'throwaway.email',
        'temp-mail.org',
        'fakeinbox.com',
        'trashmail.com',
        'yopmail.com',
      ];
      const domain = email.split('@')[1];
      return !disposableDomains.includes(domain);
    },
    { message: 'Engångs-e-postadresser är inte tillåtna' }
  );

export const phoneSchema = z
  .string()
  .trim()
  .min(8, 'Telefonnummer måste vara minst 8 siffror')
  .max(20, 'Telefonnummer får max vara 20 tecken')
  .regex(/^[\d\s\-\+\(\)]+$/, 'Ogiltigt telefonnummer format');

export const postalCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{3}\s?\d{2}$/, 'Ogiltigt postnummer (format: 123 45)')
  .transform((val) => val.replace(/\s/g, ''));

export const citySchema = z
  .string()
  .trim()
  .min(2, 'Stad måste vara minst 2 tecken')
  .max(100, 'Stad får max vara 100 tecken')
  .regex(/^[a-zA-ZåäöÅÄÖ\s\-]+$/, 'Stad får endast innehålla bokstäver');

export const addressSchema = z
  .string()
  .trim()
  .min(5, 'Adress måste vara minst 5 tecken')
  .max(200, 'Adress får max vara 200 tecken');

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Namn måste vara minst 2 tecken')
  .max(100, 'Namn får max vara 100 tecken')
  .regex(/^[a-zA-ZåäöÅÄÖ\s\-]+$/, 'Namn får endast innehålla bokstäver');

export const personnummerSchema = z
  .string()
  .trim()
  .regex(
    /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])-?\d{4}$/,
    'Ogiltigt personnummer (format: YYYYMMDD-XXXX)'
  );

export const orgNumberSchema = z
  .string()
  .trim()
  .regex(/^\d{6}-?\d{4}$/, 'Ogiltigt organisationsnummer (format: 123456-7890)');

// ============================================
// BOOKING FORM SCHEMAS
// ============================================

export const bookingFormSchema = z.object({
  service_slug: z.string().min(1, 'Tjänst måste väljas'),
  mode: z.enum(['quote', 'booking', 'consultation']).default('quote'),
  
  // Contact info
  contact_name: nameSchema,
  contact_email: emailSchema,
  contact_phone: phoneSchema.optional(),
  
  // Address
  address: addressSchema.optional(),
  postal_code: postalCodeSchema.optional(),
  city: citySchema.optional(),
  
  // Service details
  description: z.string().max(5000, 'Beskrivning får max vara 5000 tecken').optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  
  // ROT/RUT
  rot_rut_type: z.enum(['rot', 'rut', 'none']).optional(),
  
  // Files
  file_urls: z.array(z.string().url()).max(10, 'Max 10 filer').optional(),
  
  // Additional fields
  property_type: z.string().max(100).optional(),
  area_size: z.number().positive().max(10000).optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// ============================================
// QUOTE REQUEST SCHEMA
// ============================================

export const quoteRequestSchema = z.object({
  service_id: z.string().min(1, 'Tjänst måste väljas'),
  service_name: z.string().min(1).max(200),
  
  // Contact
  contact_name: nameSchema,
  contact_email: emailSchema,
  contact_phone: phoneSchema,
  
  // Address
  address: addressSchema,
  postal_code: postalCodeSchema,
  city: citySchema,
  
  // Details
  description: z.string().min(10, 'Beskriv ditt behov (minst 10 tecken)').max(5000),
  
  // Pricing
  price_type: z.enum(['hourly', 'fixed']).default('hourly'),
  estimated_hours: z.number().positive().max(1000).optional(),
  hourly_rate: z.number().positive().max(10000).optional(),
  
  // ROT/RUT
  rot_rut_type: z.enum(['rot', 'rut', 'none']).optional(),
});

export type QuoteRequestData = z.infer<typeof quoteRequestSchema>;

// ============================================
// CONTACT FORM SCHEMA
// ============================================

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(3, 'Ämne måste vara minst 3 tecken').max(200),
  message: z.string().min(10, 'Meddelande måste vara minst 10 tecken').max(5000),
  
  // Honeypot field (should be empty)
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ============================================
// CUSTOMER PROFILE SCHEMA
// ============================================

export const customerProfileSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  
  // Address
  address: addressSchema.optional(),
  postal_code: postalCodeSchema.optional(),
  city: citySchema.optional(),
  
  // Company info (optional)
  company_name: z.string().max(200).optional(),
  org_number: orgNumberSchema.optional(),
  
  // BRF info (optional)
  brf_name: z.string().max(200).optional(),
  
  // Preferences
  language: z.enum(['sv', 'en']).default('sv'),
  marketing_consent: z.boolean().default(false),
});

export type CustomerProfileData = z.infer<typeof customerProfileSchema>;

// ============================================
// ADMIN SCHEMAS
// ============================================

export const createCustomerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  address: addressSchema.optional(),
  postal_code: postalCodeSchema.optional(),
  city: citySchema.optional(),
  personnummer: personnummerSchema.optional(),
  notes: z.string().max(5000).optional(),
});

export type CreateCustomerData = z.infer<typeof createCustomerSchema>;

export const updateServiceSchema = z.object({
  id: z.string().min(1),
  title_sv: z.string().min(1).max(200).optional(),
  title_en: z.string().min(1).max(200).optional(),
  description_sv: z.string().min(10).max(5000).optional(),
  description_en: z.string().min(10).max(5000).optional(),
  base_price: z.number().positive().max(1000000).optional(),
  price_type: z.enum(['hourly', 'fixed']).optional(),
  rot_eligible: z.boolean().optional(),
  rut_eligible: z.boolean().optional(),
  is_active: z.boolean().optional(),
  category: z.string().max(100).optional(),
  sub_category: z.string().max(100).optional(),
});

export type UpdateServiceData = z.infer<typeof updateServiceSchema>;

// ============================================
// PROPERTY SCHEMA
// ============================================

export const propertySchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(['house', 'apartment', 'villa', 'office', 'other']),
  address: addressSchema,
  postal_code: postalCodeSchema,
  city: citySchema,
  description: z.string().max(5000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  notes: z.string().max(5000).optional(),
});

export type PropertyData = z.infer<typeof propertySchema>;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Safely parse and validate data
 * Returns { success: boolean, data?: T, errors?: ZodError }
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Format Zod errors for user display
 */
export function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((err) => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Remove all HTML tags except safe ones
  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br'];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  
  return html.replace(tagRegex, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });
}

/**
 * Rate limit key generator
 */
export function getRateLimitKey(identifier: string, action: string): string {
  return `${identifier}:${action}`;
}