import { z } from 'zod';

export const propertySchema = z.object({
  name: z.string().min(2, 'Ange ett namn på fastigheten'),
  address: z.string().min(3, 'Ange en adress'),
  postal_code: z.string().regex(/^\d{3}\s?\d{2}$/, 'Ange postnummer i format 123 45 eller 12345'),
  city: z.string().min(2, 'Ange ort'),
  type: z.enum(['villa', 'lägenhet', 'kontor', 'lokal', 'fastighet']),
  description: z.string().max(500).optional(),
  notes: z.string().max(500).optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;