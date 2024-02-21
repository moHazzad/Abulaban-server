/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { TBooking, TPopulatedRoom,   } from './booking.interface';
import BookingModel from './booking.model';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
import { RoomModel } from '../room/room.model';
import { sendEmail } from '../../utils/sendEmail';
import { LanguageKey,  } from '../room/room.interface';


const createBookingInDb = async (bookingData: Partial<TBooking>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Retrieve the room information from the database
    const room = await RoomModel.findById(bookingData.roomId).session(session);
    if (!room) {
      throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
    }
    if (
      typeof bookingData.checkIn !== 'string' ||
      typeof bookingData.checkOut !== 'string'
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid check-in or check-out date',
      );
    }
    // Calculate the number of nights
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const night =
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

    // Calculate the total price and tax
    const roomPrice = room.priceOptions[0].price; // Assuming using the first price option
    const totalPrice = roomPrice * night;
    const taxRate = 0.15; // 15%
    const tax = totalPrice * taxRate;
    const totalWithTax = totalPrice + tax;

    // const formattedTotalPrice = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // const formattedTax = tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // const formattedTotalWithTax = totalWithTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Format the prices to have 2 decimal places
    const formattedTotalPrice = parseFloat(totalPrice.toFixed(2));
    const formattedTax = parseFloat(tax.toFixed(2));
    const formattedTotalWithTax = parseFloat(totalWithTax.toFixed(2));

    // Set calculated values in booking data
    bookingData.night = night;
    bookingData.numberOfGuests = room.maxGuests;
    bookingData.tax = formattedTax;
    bookingData.totalPrice = formattedTotalPrice;
    bookingData.totalWithTax = formattedTotalWithTax;

    // Create the booking
    const result = await BookingModel.create([bookingData], { session });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Booking creation failed');
    }

    // If booking creation is successful, send an email
    const bookingConfirmationHtml = `<p>Your booking for ${room.title} is pending.</p><p>Total Price: ${totalWithTax}</p>`;
    await sendEmail(bookingData.userEmail as string, 'You have booked', bookingConfirmationHtml);


    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    console.error('Error in createBookingInDb:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllBookings = async () => {
  try {
    const bookings = await BookingModel.find();
    return bookings;
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving bookings');
  }
};

const getBookingByEmail = async (email: string, language: LanguageKey) => {
  try {
    // Cast the result of populate to TBookingsRoom
    const bookings = await BookingModel.find({ userEmail: email })
    .populate<{ roomId: TPopulatedRoom }>('roomId')
    .sort({ createdAt: -1 }) 
    .lean();
    
    
    if (!bookings || bookings.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, 'No bookings found for this email');
    }
      for (const booking of bookings) {
        if (new Date(booking.checkOut).getTime() < Date.now() && booking.bookingStatus !== 'completed') {
          booking.bookingStatus = 'completed';
          // Update the booking in the database
          await BookingModel.updateOne({ _id: booking._id }, { $set: { bookingStatus: 'completed' } });
          // Note: If working within a session or transaction, make sure to pass those as options to the updateOne call
        }
      }


    const localizedBookings = bookings.map(booking => {
      const localizedRoom = booking.roomId ? {
        id: booking.roomId._id,
        title: booking.roomId.title[language],
        size: booking.roomId.size[language],
        images: booking.roomId.images,
        subTitle: booking.roomId.subTitle ? {
          roomOne: booking.roomId.subTitle.roomOne[language],
          roomTwo: booking.roomId.subTitle.roomTwo && booking.roomId.subTitle.roomTwo[language],
        } : undefined,

        // ... localize other fields as needed
      } : null;

      return {
        ...booking,
        roomId: localizedRoom
      };
    });

    return localizedBookings;
  } catch (error) {
    if (error instanceof AppError) {
      // Rethrow the error if it's an AppError
      throw error;
    }
    
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Unexpected error in getBookingByEmail');
  }
};






// const getBookingByEmail = async (email: string, language: LanguageKey) => {
//   const titleField = 'title[language]';
//   const descriptionField = `description.${language}`;
//   const sizeField = `size.${language}`;
//   try {
//     // const bookings = await BookingModel.find({ userEmail: email });
//     const bookings = await BookingModel.find({ userEmail: email }).populate({
//       path: 'roomId',
//       select: `${titleField} ${descriptionField} ${sizeField} maxGuests  images priceOptions isActive type`,
//     }); // Add the fields of the Room model you want to include

//     if (!bookings || bookings.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, 'No bookings found for this email');
//     }
//     return bookings;
//   } catch (error) {
//     console.error('Error in getBookingByEmail:', error);
//     // throw error; // Re-throw the error to handle it in the calling function
//     throw new AppError(httpStatus.NOT_FOUND, 'Error in getBookingByEmail:')
//   }
// };

export const bookingService = {
  createBookingInDb,
  getAllBookings,
  getBookingByEmail,
  


};
