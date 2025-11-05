import { z } from 'zod';

// Svenska telefonnummer: +46701234567, 070-123 45 67, 0701234567
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Telefonnummer krävs')
  .regex(
    /^(\+46|0)[-\s]?7[0-9][-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2}$/,
    'Ogiltigt svenskt telefonnummer (ex: 070-123 45 67)'
  )
  .transform((val) => val.replace(/[-\s]/g, '')); // Normalisera till endast siffror

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'E-post krävs')
  .email('Ogiltig e-postadress')
  .max(255, 'E-post för lång');

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Namn måste vara minst 2 bokstäver')
  .max(100, 'Namn för långt')
  .regex(/^[a-zA-ZåäöÅÄÖ\s\-]+$/, 'Namn får endast innehålla bokstäver');

export const personnummerSchema = z
  .string()
  .trim()
  .regex(
    /^(19|20)\d{6}[-\s]?\d{4}$/,
    'Ogiltigt personnummer (format: YYYYMMDD-XXXX)'
  )
  .optional()
  .or(z.literal(''));

export const orgNumberSchema = z
  .string()
  .trim()
  .regex(
    /^\d{6}[-\s]?\d{4}$/,
    'Ogiltigt organisationsnummer (format: XXXXXX-XXXX)'
  )
  .transform((val) => val.replace(/[-\s]/g, ''));

export const companyNameSchema = z
  .string()
  .trim()
  .min(2, 'Företagsnamn måste vara minst 2 bokstäver')
  .max(200, 'Företagsnamn för långt');

export const brfNameSchema = z
  .string()
  .trim()
  .min(2, 'BRF-namn måste vara minst 2 bokstäver')
  .max(200, 'BRF-namn för långt');

export const postalCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{3}\s?\d{2}$/, 'Ogiltigt postnummer (format: 123 45)')
  .transform((val) => val.replace(/\s/g, ''));

export const citySchema = z
  .string()
  .trim()
  .min(2, 'Ort måste vara minst 2 bokstäver')
  .regex(/^[a-zA-ZåäöÅÄÖ\s\-]+$/, 'Ort får endast innehålla bokstäver');

export const addressSchema = z
  .string()
  .trim()
  .min(5, 'Adress måste vara minst 5 tecken');

// Huvudschema för bokningsformuläret
export const serviceRequestSchema = z.object({
  customer_type: z.enum(['private', 'company', 'brf']).default('private'),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  personnummer: personnummerSchema,
  company_name: companyNameSchema.optional().or(z.literal('')),
  brf_name: brfNameSchema.optional().or(z.literal('')),
  org_number: orgNumberSchema.optional().or(z.literal('')),
  address: addressSchema.optional().or(z.literal('')),
  postal_code: postalCodeSchema.optional().or(z.literal('')),
  city: citySchema.optional().or(z.literal('')),
}).refine(
  (data) => {
    // Om company: company_name och org_number krävs
    if (data.customer_type === 'company') {
      return !!(data.company_name && data.org_number);
    }
    // Om brf: brf_name och org_number krävs
    if (data.customer_type === 'brf') {
      return !!(data.brf_name && data.org_number);
    }
    return true;
  },
  {
    message: 'Företagsnamn/BRF-namn och organisationsnummer krävs',
    path: ['customer_type'],
  }
);

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;
