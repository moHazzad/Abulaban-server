import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for localized strings (similar to your Mongoose localized schema)
const localizedStringSchema = z.object({
  en: z.string().min(1, 'English category title is required'),
  ar: z.string().min(1, 'Arabic category title is required'),
});

// Zod schema for TSubCategory
const TSubCategorySchema = z.object({
  body: z.object({
    Name: localizedStringSchema,
    image: z.string().url('Must be a valid URL'),
    CategoryId: z.union([
      z.instanceof(mongoose.Types.ObjectId, { message: "Must be a valid MongoDB ObjectId" }),
      z.string().regex(/^[0-9a-fA-F]{24}$/, 'ParentCategory must be a valid MongoDB ObjectId')
    ])
  }),
});

export default TSubCategorySchema;
