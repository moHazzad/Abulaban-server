"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PAID"] = "paid";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["DELIVERED"] = "delivered";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
// import mongoose from 'mongoose';
// export type TPopulatedRoom = {
//   _id: mongoose.Types.ObjectId;
//   title: { en: string; ar: string };
//   description: { en: string; ar: string };
//   size: { en: string; ar: string };
//   images: [];
//   subTitle:{
//     roomOne:{en: string; ar: string };
//     roomTwo?:{en: string; ar: string };
//   }
//   // Add other fields as necessary
// }
// type formData = {
//   address?: string;
//   arrivalTime?: string;
//   city?: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   message?: string;
//   phone: string;
// };
// export type TBooking = {
//   userEmail: string; // Foreign key referencing the user
//   roomId: mongoose.Schema.Types.ObjectId;
//   formData: formData;
//   checkIn: string;
//   checkOut: string;
//   night: number;
//   numberOfGuests: number;
//   tax: number;
//   totalPrice: number;
//   totalWithTax: number;
//   bookingStatus:  'Booked' | 'cancelled' | 'completed';
//   paymentStatus: 'pending' | 'paid';
// };
// export type TBooking = {
//     userID: mongoose.Schema.Types.ObjectId; // Foreign key referencing the user
//     roomId: mongoose.Schema.Types.ObjectId; // Foreign key referencing the room
//     checkInDate: string;
//     checkOutDate: string;
//     numberOfNights: number;
//     totalCost: number;
//     bookingStatus: 'pending' | 'Booked' | 'cancelled';
//     paymentStatus: 'pending' | 'paid';
//     bookRoomQTY: number;
//     isCancelled: boolean
//   };
