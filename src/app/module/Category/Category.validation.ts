import { z } from 'zod';

const localizedCategoryValidationSchema = z.object({
  en: z.string().min(1, 'en category title is required'),
  ar: z.string().min(1, 'Ar category title is required'),
});

const CategoryValidationSchema = z.object({
  body: z.object({
    Name: localizedCategoryValidationSchema,
    image:z.string().min(1, 'Image URL is required')
    // ParentCategory: z.null().optional(),
  }),
});

export default CategoryValidationSchema;
