/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { TBooking } from './booking.interface';
import BookingModel from './booking.model';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
import { RoomModel } from '../room/room.model';


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
const createBookingInDb = async (bookingData: Partial<TBooking>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Retrieve the room information from the database
    const room = await RoomModel.findById(bookingData.roomId).session(session);
    if (!room) {
      throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
    }
    if (typeof bookingData.checkIn !== 'string' || typeof bookingData.checkOut !== 'string') {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid check-in or check-out date');
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

    // Set calculated values in booking data
    bookingData.night = night;
    bookingData.numberOfGuests = room.maxGuests;
    bookingData.tax = tax;
    bookingData.totalPrice = totalPrice;
    bookingData.totalWithTax = totalWithTax;

    // Create the booking
    const result = await BookingModel.create([bookingData], { session });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Booking creation failed');
    }

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    console.error("Error in createBookingInDb:", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


export const bookingService = {
  createBookingInDb,
};
