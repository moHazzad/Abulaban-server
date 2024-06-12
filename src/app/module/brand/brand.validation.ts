import { z } from 'zod';

const localizedBrandValidationSchema = z.object({
    en: z.string().min(1, { message: 'English brand name is required' }),
    ar: z.string().min(1, { message: 'Arabic brand name is required' }),
});

const brandValidationSchema = z.object({
  body: z.object({
    Name: localizedBrandValidationSchema,
    image: z.string().optional(),
  }),
});

export default brandValidationSchema;
