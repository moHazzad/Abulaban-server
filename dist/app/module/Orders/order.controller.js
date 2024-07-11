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
exports.orderController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const order_service_1 = require("./order.service");
// import sendResponse from '../../utils/sendResponse';
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const placeOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    // const orderData = req.body;
    try {
        const result = yield order_service_1.orderService.createOrder(req.body);
        res.status(200).json({
            success: true,
            message: 'User created successfully',
            data: result,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `User not created: ${error.message}`);
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
}));
const getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { lang } = req.query;
    const { orderId } = req.params;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        const products = yield order_service_1.orderService.singleOrderById(orderId, lang);
        return res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        next(error);
    }
});
const getUserOrdersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { lang } = req.query;
    const { userId } = req.params;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        const orders = yield order_service_1.orderService.getUserOrders(userId, lang);
        return res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        next(error);
    }
});
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
exports.orderController = {
    placeOrder,
    getOrderById,
    getUserOrdersController
    // bookingRoom,
    // getAllBookingRooms,
    // getSingleBookedRoom
};
