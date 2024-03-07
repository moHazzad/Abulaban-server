import { z } from 'zod';

const localizedMainCategoryValidationSchema = z.object({
  en: z.string().min(1, 'en category title is required'),
  ar: z.string().min(1, 'Ar category title is required'),
});

const mainCategoryValidationSchema = z.object({
  body: z.object({
    Name: localizedMainCategoryValidationSchema,
    ParentCategory: z.null().optional(),
  }),
});

export default mainCategoryValidationSchema;
