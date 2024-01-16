"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importStar(require("mongoose"));
// import { RoomModel } from '../room/room.model';
const formDataSchema = new mongoose_1.default.Schema({
    address: String,
    arrivalTime: String,
    city: String,
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    message: String,
    phone: { type: String, required: true }
});
const bookingSchema = new mongoose_1.default.Schema({
    userEmail: { type: String, required: true, ref: 'User' }, // Assuming a User model exists
    roomId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'Room' }, // Assuming a Room model exists
    formData: { type: formDataSchema, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    night: { type: Number, required: true },
    numberOfGuests: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalWithTax: { type: Number, required: true },
    bookingStatus: {
        type: String,
        required: true,
        enum: ['pending', 'Booked', 'cancelled'],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid'],
        default: "pending"
    }
}, { timestamps: true });
// const bookingSchema = new Schema({
//   userID: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//   },
//   roomId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Room',
//       required: true,
//   },
//   checkInDate: {
//       type: String,
//       required: true,
//   },
//   checkOutDate: {
//       type: String,
//       required: true,
//   },
//   numberOfNights: {
//       type: Number,
//       required: true,
//   },
//   totalCost: {
//       type: Number,
//       required: true,
//   },
//   bookingStatus: {
//     type: String,
//     enum: ['pending', 'Booked', 'cancelled'],
//     required: true,
//     default:"pending"
//   },
//   paymentStatus: {
//       type: String,
//       enum: ['pending', 'paid'],
//       required: true,
//       default:"pending"
//   },
//   bookRoomQTY: {
//       type: Number,
//       required: true,
//   },
//   isCancelled:{
//     type : Boolean ,
//     default : false
//   }
// }, { timestamps: true });
// bookingSchema.pre('save', async function(next) {
// 'this' refers to the booking document being saved
//     console.log('Room ID:', this.roomID);
// console.log('Check-in Date:', this.checkInDate);
// console.log('Check-out Date:', this.checkOutDate);
// console.log('Requested Room Quantity:', this.bookRoomQTY);
// try {
//     const overlappingBookings = await BookingModel.find({
//         roomID: this.roomID,
//         $or: [
//             { checkInDate: { $lte: this.checkOutDate }, checkOutDate: { $gt: this.checkInDate } }
//         ],
//         _id: { $ne: this._id } // Exclude the current booking if it's an update
//     });
//     // Calculate total booked rooms for the given room type within the date range
//     const totalBookedRooms = overlappingBookings.reduce((sum, booking) => sum + booking.bookRoomQTY, 0);
//     // console.log('Total Booked Rooms:', totalBookedRooms);
//     // Fetch the total room quantity from the room collection
//     const room = await RoomModel.findById(this.roomID);
//     if (!room) {
//         return next(new Error('Room not found'));
//     }
//     // Check if enough rooms are available
//     if (room.type - totalBookedRooms < this.bookRoomQTY) {
//         // console.log('Total Room Quantity:', room.RoomQTY);
//         return next(new Error(`rooms available ${room.type - totalBookedRooms}. Please reduce the quantity or choose another room or date.`));
//     }
//     // Proceed with the booking
//     next();
// } catch (error:any) {
//     // Handle any errors that occur during the booking process
//     next(error);
// }
// });
const BookingModel = (0, mongoose_1.model)('Booking', bookingSchema);
exports.default = BookingModel;
