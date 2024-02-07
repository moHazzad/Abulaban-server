"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidationSchema = void 0;
const zod_1 = require("zod");
const formDataSchema = zod_1.z.object({
    address: zod_1.z.string().optional(),
    arrivalTime: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    message: zod_1.z.string().optional(),
    phone: zod_1.z.string(),
});
exports.bookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userEmail: zod_1.z.string().email(),
        roomId: zod_1.z.string(), // Assuming the ObjectId is represented as a string
        formData: formDataSchema,
        checkIn: zod_1.z.string(),
        checkOut: zod_1.z.string(),
        bookingStatus: zod_1.z.enum(['Booked', 'cancelled', 'completed']).optional(),
        paymentStatus: zod_1.z.enum(['pending', 'paid']).optional(),
    }),
});
