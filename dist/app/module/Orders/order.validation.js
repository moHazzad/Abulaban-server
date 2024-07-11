"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const zod_1 = require("zod");
const OrderItemSchema = zod_1.z.object({
    product: zod_1.z.string().min(1, 'Product ID is required'),
    quantity: zod_1.z.number().min(1, 'Quantity must be at least 1'),
});
exports.OrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'User ID is required'),
        paymentMethod: zod_1.z.string().min(1, 'Payment method is required'),
        cartItems: zod_1.z.array(OrderItemSchema).min(1, 'At least one cart item is required'),
    })
});
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
