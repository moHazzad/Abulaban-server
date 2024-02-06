import { z } from 'zod';

const formDataSchema = z.object({
  address: z.string().optional(),
  arrivalTime: z.string().optional(),
  city: z.string().optional(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  message: z.string().optional(),
  phone: z.string(),
});

export const bookingValidationSchema = z.object({
  body: z.object({
    userEmail: z.string().email(),
    roomId: z.string(), // Assuming the ObjectId is represented as a string
    formData: formDataSchema,
    checkIn: z.string(),
    checkOut: z.string(),
    bookingStatus: z.enum([ 'Booked', 'cancelled','completed' ]).optional(),
    paymentStatus: z.enum(['pending', 'paid']).optional(),
  }),
});
