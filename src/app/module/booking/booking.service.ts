/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { TBooking } from './booking.interface';
import BookingModel from './booking.model';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';


// Function to create a new booking
const createBookingInDb = async (bookingData: TBooking) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await BookingModel.create([bookingData], { session });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'NO book');
    }

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const bookingService = {
  createBookingInDb,
};
