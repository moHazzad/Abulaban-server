import { z } from 'zod';

const OrderItemSchema = z.object({
  product: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const OrderSchema = z.object({
  body:z.object({
    userId: z.string().min(1, 'User ID is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  cartItems: z.array(OrderItemSchema).min(1, 'At least one cart item is required'),
  })
});

export type OrderInput = z.infer<typeof OrderSchema>;

// import { z } from 'zod';

// const formDataSchema = z.object({
//   address: z.string().optional(),
//   arrivalTime: z.string().optional(),
//   city: z.string().optional(),
//   email: z.string().email(),
//   firstName: z.string(),
//   lastName: z.string(),
//   message: z.string().optional(),
//   phone: z.string(),
// });

// export const bookingValidationSchema = z.object({
//   body: z.object({
//     userEmail: z.string().email(),
//     roomId: z.string(), // Assuming the ObjectId is represented as a string
//     formData: formDataSchema,
//     checkIn: z.string(),
//     checkOut: z.string(),
//     bookingStatus: z.enum([ 'Booked', 'cancelled','completed' ]).optional(),
//     paymentStatus: z.enum(['pending', 'paid']).optional(),
//   }),
// });
