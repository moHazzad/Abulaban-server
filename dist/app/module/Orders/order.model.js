"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const OrderItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
});
const OrderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: { type: [OrderItemSchema], required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: Object.values(order_interface_1.OrderStatus), default: order_interface_1.OrderStatus.PENDING },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
const OrderModel = (0, mongoose_1.model)('Order', OrderSchema);
exports.default = OrderModel;
/* eslint-disable @typescript-eslint/no-explicit-any */
// import mongoose, { model } from 'mongoose';
// import { TBooking } from './booking.interface';
// import { RoomModel } from '../room/room.model';
// const formDataSchema = new mongoose.Schema({
//     address: String,
//     arrivalTime: String,
//     city: String,
//     email: { type: String, required: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     message: String,
//     phone: { type: String, required: true }
//   });
//   const bookingSchema = new mongoose.Schema({
//     userEmail: { type: String, required: true, ref: 'User' }, // Assuming a User model exists
//     roomId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' }, // Assuming a Room model exists
//     formData: { type: formDataSchema, required: true },
//     checkIn: { type: String, required: true },
//     checkOut: { type: String, required: true },
//     night: { type: Number, required: true },
//     numberOfGuests: { type: Number, required: true },
//     tax: { type: Number, required: true },
//     totalPrice: { type: Number, required: true },
//     totalWithTax: { type: Number, required: true },
//     bookingStatus: { 
//       type: String, 
//       required: true, 
//       enum: [ 'Booked', 'cancelled','completed'],
//       default:"Booked"
//     },
//     paymentStatus: { 
//       type: String, 
//       required: true, 
//       enum: ['pending', 'paid'],
//       default:"pending"
//     }
//   },{timestamps:true});
// const BookingModel = model<TBooking>('Booking', bookingSchema);
// export default BookingModel;
