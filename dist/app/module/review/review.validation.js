"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// import { TReview } from './review.interface';
// Define a Zod schema for email validation
const emailValidation = zod_1.z.string().email('Please fill a valid email address');
// Define a Zod schema for the Review
const ReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
        roomId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID'),
        email: emailValidation,
        message: zod_1.z.string().min(1, 'Message is required'),
        rating: zod_1.z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5')
    })
});
exports.default = ReviewValidationSchema;
// Helper function to validate a review object
// export const validateReview = (review: TReview) => {
//   return ReviewValidationSchema.parse(review);
// };
