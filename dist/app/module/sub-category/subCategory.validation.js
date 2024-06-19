"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
// Zod schema for localized strings (similar to your Mongoose localized schema)
const localizedStringSchema = zod_1.z.object({
    en: zod_1.z.string().min(1, 'English category title is required'),
    ar: zod_1.z.string().min(1, 'Arabic category title is required'),
});
// Zod schema for TSubCategory
const TSubCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        Name: localizedStringSchema,
        image: zod_1.z.string().url('Must be a valid URL'),
        CategoryId: zod_1.z.union([
            zod_1.z.instanceof(mongoose_1.default.Types.ObjectId, { message: "Must be a valid MongoDB ObjectId" }),
            zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ParentCategory must be a valid MongoDB ObjectId')
        ])
    }),
});
exports.default = TSubCategorySchema;
