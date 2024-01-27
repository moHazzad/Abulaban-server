import { z } from 'zod';
// import { TReview } from './review.interface';

// Define a Zod schema for email validation
const emailValidation = z.string().email('Please fill a valid email address');

// Define a Zod schema for the Review
const ReviewValidationSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  roomId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID'),
  email: emailValidation,
  message: z.string().min(1, 'Message is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5')
  })
});


export default ReviewValidationSchema;
// Helper function to validate a review object
// export const validateReview = (review: TReview) => {
//   return ReviewValidationSchema.parse(review);
// };
