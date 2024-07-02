import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { orderService } from './order.service';
// import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../Error/errors/AppError';
import { LanguageKey } from '../../utils/Common.interface';

const placeOrder = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  // const orderData = req.body;
  try {
    const result = await orderService.createOrder(req.body);
    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `User not created: ${error.message}`);
  }
  
  //  console.log(req.user);
  // const result = await orderService.createOrder(orderData);

  // if (!result) {
  //   throw new AppError(httpStatus.NOT_FOUND, 'Failed to place order', result );
  // } else {
  //   sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'order successfully',
  //     data: result,
  //   });
  // }
});


const getOrderById  = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { lang } = req.query;
  const { orderId } = req.params;

  // Set default language to 'ar' if not provided or invalid
  if (lang !== 'en' && lang !== 'ar') {
    lang = 'ar';
  }

  try {
    const products = await orderService.singleOrderById( orderId, lang as LanguageKey, );
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
  }

const getUserOrdersController   = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { lang } = req.query;
  const { userId  } = req.params;

  // Set default language to 'ar' if not provided or invalid
  if (lang !== 'en' && lang !== 'ar') {
    lang = 'ar';
  }

  try {
    const orders = await orderService.getUserOrders( userId , lang as LanguageKey, );
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
  }


// const bookingRoom = catchAsync(async (req: Request, res: Response) => {
//   // console.log(req.body);
//   const bookingData = req.body;
//   //  console.log(req.user);
//   const result = await bookingService.createBookingInDb(bookingData);

//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, 'OPPS Room not booked');
//   } else {
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Room booked successfully',
//       data: result,
//     });
//   }
// });

// const getAllBookingRooms = catchAsync(async (req: Request, res: Response) => {
//   // console.log(req.body);
//   // const bookingData = req.body;
//   //  console.log(req.user);
//   const result = await bookingService.getAllBookings();

//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, 'OPPS No Room booked');
//   } else {
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Room booked found successfully',
//       data: result,
//     });
//   }
// });

// const getSingleBookedRoom = catchAsync(async (req: Request, res: Response) => {
//   console.log(req.params.userEmail,'asdjhh');
//   const userEmail = req.params.userEmail;
//   // const currentLanguage = req.headers['accept-language'];
//   //  console.log(req.user);
//   const languageParam = req.query.lang;
//     const language = (typeof languageParam === 'string' && (languageParam === 'en' || languageParam === 'ar')) 
//                      ? languageParam 
//                      : 'en';
//   const result = await bookingService.getBookingByEmail(userEmail, language );

//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, 'OPPS No Room found');
//   } else {
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Room booked found successfully',
//       data: result,
//     });
//   }
// });

export const orderController = {
  placeOrder,
  getOrderById,
  getUserOrdersController
  // bookingRoom,
  // getAllBookingRooms,
  // getSingleBookedRoom

};
