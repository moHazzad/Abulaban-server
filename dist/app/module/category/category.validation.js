"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const localizedCategoryValidationSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, 'en category title is required'),
    ar: zod_1.z.string().min(1, 'Ar category title is required'),
});
const CategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        Name: localizedCategoryValidationSchema,
        image: zod_1.z.string().min(1, 'Image URL is required')
        // ParentCategory: z.null().optional(),
    }),
});
exports.default = CategoryValidationSchema;
