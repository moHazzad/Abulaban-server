"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const LocalizedStringSchema = zod_1.z.object({
    en: zod_1.z.string({ required_error: 'English text is required' }),
    ar: zod_1.z.string({ required_error: 'Arabic text is required' })
});
const BedroomInfoSchema = zod_1.z.object({
    bedroomNumber: zod_1.z.number().min(1, { message: "Bedroom number must be 1 or greater" }),
    beds: LocalizedStringSchema // Updated to use LocalizedStringSchema
});
// Zod schema for TRoomCategory
const TRoomCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        categoryTitle: LocalizedStringSchema, // Updated to use LocalizedStringSchema
        bedrooms: zod_1.z.array(BedroomInfoSchema).optional()
    })
});
exports.default = TRoomCategoryValidationSchema;
