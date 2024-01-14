import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { bookingService } from './booking.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../Error/errors/AppError';

const bookingRoom = catchAsync(async (req: Request, res: Response) => {
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

export const createBookingController = {
  bookingRoom,
};
