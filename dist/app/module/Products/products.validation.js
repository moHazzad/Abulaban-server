"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
// Custom Zod schema for ObjectId validation
const objectIdSchema = zod_1.z.string().refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
});
const localizedStringSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, 'English is required'),
    ar: zod_1.z.string().min(1, 'Arabic is required'),
});
const techSpecificationSchema = zod_1.z.object({
    key: zod_1.z.string(),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()]),
});
// const reviewSchema = z.object({
//   userId: objectIdSchema,
//   rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
//   comment: z.string(),
//   createdAt: z.date(),
// });
const localizedHighlightsSchema = zod_1.z.object({
    en: zod_1.z.array(zod_1.z.string()).min(1, 'At least one English highlight is required'),
    ar: zod_1.z.array(zod_1.z.string()).min(1, 'At least one Arabic highlight is required'),
});
const productStatusSchema = zod_1.z.enum([
    'available',
    'out_of_stock',
    'discontinued',
]);
const ProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        modelNo: zod_1.z.string().min(1, 'Model number is required'),
        name: localizedStringSchema,
        type: localizedStringSchema,
        brand: objectIdSchema,
        desc: localizedStringSchema,
        stockQty: zod_1.z.number().min(0, 'Stock quantity must be a non-negative number'),
        soldQty: zod_1.z.number().min(0, 'Sold quantity must be a non-negative number').default(0),
        price: zod_1.z.number().min(0, 'Price must be a non-negative number'),
        previousPrice: zod_1.z.number().min(0, 'Previous price must be a non-negative number').optional(),
        imageURLs: zod_1.z.array(zod_1.z.string().url('Must be a valid URL')).min(1, 'At least one image URL is required'),
        categoryId: objectIdSchema,
        subCategoryId: objectIdSchema,
        techSpecifications: zod_1.z.array(techSpecificationSchema).optional(),
        status: productStatusSchema.default('available'),
        releaseDate: zod_1.z.date().optional(),
        isDeleted: zod_1.z.boolean().default(false).optional(),
        deletedAt: zod_1.z.date().optional(),
        highlights: localizedHighlightsSchema,
        // reviews: z.array(reviewSchema).optional(),
    }),
});
exports.default = ProductValidationSchema;
