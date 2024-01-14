"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidationSchema = void 0;
const zod_1 = require("zod");
exports.bookingValidationSchema = zod_1.z.object({
    userID: zod_1.z.string(), // You may adjust the type based on your actual user ID type
    roomID: zod_1.z.string(), // You may adjust the type based on your actual room ID type
    checkInDate: zod_1.z.string(),
    checkOutDate: zod_1.z.string(),
    numberOfNights: zod_1.z.number(),
    totalCost: zod_1.z.number(),
    bookingStatus: zod_1.z.enum(['pending', 'booked', 'cancelled']).optional(),
    paymentStatus: zod_1.z.enum(['pending', 'paid']).optional(),
    bookRoomQTY: zod_1.z.number(),
    isCancelled: zod_1.z.boolean().optional()
});
