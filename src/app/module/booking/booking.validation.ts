import { z } from 'zod';

export const bookingValidationSchema = z.object({
  userID: z.string(), // You may adjust the type based on your actual user ID type
  roomID: z.string(), // You may adjust the type based on your actual room ID type
  checkInDate: z.string(),
  checkOutDate: z.string(),
  numberOfNights: z.number(),
  totalCost: z.number(),
  bookingStatus: z.enum(['pending', 'booked', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid']).optional(),
  bookRoomQTY: z.number(),
  isCancelled: z.boolean().optional()
});