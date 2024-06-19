"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const localizedBrandValidationSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, { message: 'English brand name is required' }),
    ar: zod_1.z.string().min(1, { message: 'Arabic brand name is required' }),
});
const brandValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        Name: localizedBrandValidationSchema,
        image: zod_1.z.string().optional(),
    }),
});
exports.default = brandValidationSchema;
