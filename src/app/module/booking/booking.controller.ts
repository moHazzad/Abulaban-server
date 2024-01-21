import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { bookingService } from './booking.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../Error/errors/AppError';

const bookingRoom = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  const bookingData = req.body;
  //  console.log(req.user);
  const result = await bookingService.createBookingInDb(bookingData);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'OPPS Room not booked');
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Room booked successfully',
      data: result,
    });
  }
});

const getAllBookingRooms = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  // const bookingData = req.body;
  //  console.log(req.user);
  const result = await bookingService.getAllBookings();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'OPPS No Room booked');
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Room booked found successfully',
      data: result,
    });
  }
});

const getSingleBookedRoom = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  const userEmail = req.params.userEmail;
  // const currentLanguage = req.headers['accept-language'];
  //  console.log(req.user);
  const languageParam = req.query.lang;
    const language = (typeof languageParam === 'string' && (languageParam === 'en' || languageParam === 'ar')) 
                     ? languageParam 
                     : 'en';
  const result = await bookingService.getBookingByEmail(userEmail, language );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'OPPS No Room found');
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Room booked found successfully',
      data: result,
    });
  }
});

export const createBookingController = {
  bookingRoom,
  getAllBookingRooms,
  getSingleBookedRoom

};
