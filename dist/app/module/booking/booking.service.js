"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = __importDefault(require("./booking.model"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const room_model_1 = require("../room/room.model");
const sendEmail_1 = require("../../utils/sendEmail");
// Function to create a new booking
// const createBookingInDb = async (bookingData: Partial<TBooking>) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const result = await BookingModel.create([bookingData], { session });
//     if (!result) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'NO book');
//     }
//     await session.commitTransaction();
//     session.endSession();
//     return result;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };
const createBookingInDb = (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Retrieve the room information from the database
        const room = yield room_model_1.RoomModel.findById(bookingData.roomId).session(session);
        if (!room) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
        }
        if (typeof bookingData.checkIn !== 'string' ||
            typeof bookingData.checkOut !== 'string') {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid check-in or check-out date');
        }
        // Calculate the number of nights
        const checkInDate = new Date(bookingData.checkIn);
        const checkOutDate = new Date(bookingData.checkOut);
        const night = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
        // Calculate the total price and tax
        const roomPrice = room.priceOptions[0].price; // Assuming using the first price option
        const totalPrice = roomPrice * night;
        const taxRate = 0.15; // 15%
        const tax = totalPrice * taxRate;
        const totalWithTax = totalPrice + tax;
        // const formattedTotalPrice = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // const formattedTax = tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // const formattedTotalWithTax = totalWithTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // Set calculated values in booking data
        bookingData.night = night;
        bookingData.numberOfGuests = room.maxGuests;
        bookingData.tax = tax;
        bookingData.totalPrice = totalPrice;
        bookingData.totalWithTax = totalWithTax;
        // Create the booking
        const result = yield booking_model_1.default.create([bookingData], { session });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Booking creation failed');
        }
        // If booking creation is successful, send an email
        const bookingConfirmationHtml = `<p>Your booking for ${room.title} is pending.</p><p>Total Price: ${totalWithTax}</p>`;
        yield (0, sendEmail_1.sendEmail)(bookingData.userEmail, 'Booking Pending', bookingConfirmationHtml);
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        console.error('Error in createBookingInDb:', error);
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.bookingService = {
    createBookingInDb,
};
