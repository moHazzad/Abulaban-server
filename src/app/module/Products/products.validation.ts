import { z } from 'zod';
import { Types } from 'mongoose';

// Custom Zod schema for ObjectId validation
const objectIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: "Invalid ObjectId",
});

const localizedStringSchema = z.object({
  en: z.string().min(1, 'English is required'),
  ar: z.string().min(1, 'Arabic is required'),
});

const techSpecificationSchema = z.object({
  key: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

// const reviewSchema = z.object({
//   userId: objectIdSchema,
//   rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
//   comment: z.string(),
//   createdAt: z.date(),
// });

const localizedHighlightsSchema = z.object({
  en: z.array(z.string()).min(1, 'At least one English highlight is required'),
  ar: z.array(z.string()).min(1, 'At least one Arabic highlight is required'),
});

const productStatusSchema = z.enum([
  'available',
  'out_of_stock',
  'discontinued',
]);

const ProductValidationSchema = z.object({
  body: z.object({
    modelNo: z.string().min(1, 'Model number is required'),
    sku: z.string().min(1, 'Model number is required'),
    name: localizedStringSchema,
    type: localizedStringSchema,
    brand: objectIdSchema,
    desc: localizedStringSchema,
    stockQty: z.number().min(0, 'Stock quantity must be a non-negative number'),
    soldQty: z.number().min(0, 'Sold quantity must be a non-negative number').default(0),
    price: z.number().min(0, 'Price must be a non-negative number'),
    previousPrice: z.number().min(0, 'Previous price must be a non-negative number').optional(),
    imageURLs: z.array(z.string().url('Must be a valid URL')).min(1, 'At least one image URL is required'),
    categoryId: objectIdSchema,
    subCategoryId: objectIdSchema,
    techSpecifications: z.array(techSpecificationSchema).optional(),
    status: productStatusSchema.default('available'),
    releaseDate: z.date().optional(),
    isDeleted: z.boolean().default(false).optional(),
    deletedAt: z.date().optional(),
    highlights: localizedHighlightsSchema,
    // reviews: z.array(reviewSchema).optional(),
  }),
});

export default ProductValidationSchema;
