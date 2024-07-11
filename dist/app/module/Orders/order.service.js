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
exports.orderService = void 0;
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
// import { TBooking, TPopulatedRoom,   } from './order.interface';
// import BookingModel from './order.model';
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// import { RoomModel } from '../room/room.model';
// import { sendEmail } from '../../utils/sendEmail';
// import { LanguageKey,  } from '../room/room.interface';
// import { OrderInput } from './order.validation';
const products_model_1 = require("../Products/products.model");
const order_model_1 = __importDefault(require("./order.model"));
const createOrder = (orderInput) => __awaiter(void 0, void 0, void 0, function* () {
    if (!orderInput.cartItems || orderInput.cartItems.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Cart items are required');
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { userId, cartItems, paymentMethod } = orderInput;
        // Calculate total
        let total = 0;
        for (const item of cartItems) {
            const product = yield products_model_1.ProductModel.findById(item.product)
                .session(session)
                .exec();
            if (!product) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product with ID ${item.product} not found`);
            }
            total += product.price * item.quantity;
        }
        // Create order
        const order = new order_model_1.default({
            userId,
            cartItems,
            paymentMethod,
            status: 'pending',
            total,
        });
        yield order.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create order', error.message);
    }
});
const singleOrderById = (orderId, lang) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.default.findById(orderId)
            .populate('userId')
            .populate({
            path: 'cartItems.product',
            select: 'name desc price imageURLs',
            model: products_model_1.ProductModel,
        })
            .lean();
        if (!order) {
            throw new Error('Order not found');
        }
        // Calculate total
        let total = 0;
        order.cartItems.forEach((item) => {
            const product = item.product;
            total += product.price * item.quantity;
        });
        // Add shipping cost
        total += 20;
        // Populate product names based on the language
        const updatedCartItems = order.cartItems.map((item) => {
            const product = item.product;
            return Object.assign(Object.assign({}, item), { product: Object.assign(Object.assign({}, product), { name: product.name[lang], desc: product.desc[lang] }) });
        });
        return Object.assign(Object.assign({}, order), { cartItems: updatedCartItems, total });
    }
    catch (error) {
        throw new Error(`Failed to get order: ${error.message}`);
    }
});
const getUserOrders = (userId, lang) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find({ userId })
            .populate('userId')
            .populate({
            path: 'cartItems.product',
            select: 'name desc price imageURLs',
            model: products_model_1.ProductModel,
        })
            .sort({ createdAt: -1 }) // Sort by most recent
            .lean();
        if (!orders || orders.length === 0) {
            throw new Error('No orders found for this user');
        }
        // Calculate totals and populate product names based on the language
        const updatedOrders = orders.map((order) => {
            let total = 0;
            const updatedCartItems = order.cartItems.map((item) => {
                const product = item.product;
                total += product.price * item.quantity;
                return Object.assign(Object.assign({}, item), { product: Object.assign(Object.assign({}, product), { name: product.name[lang], desc: product.desc[lang] }) });
            });
            total += 20; // Add shipping cost
            return Object.assign(Object.assign({}, order), { cartItems: updatedCartItems, total });
        });
        return updatedOrders;
    }
    catch (error) {
        throw new Error(`Failed to get user orders: ${error.message}`);
    }
});
//  const createOrder = async (orderInput: Partial<IOrder>) => {
//   console.log(orderInput, 'orderInput');
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { userId, cartItems, paymentMethod } = orderInput;
//     // Calculate total
//     let total = 0;
//     for (const item of cartItems) {
//       const product = await ProductModel.findById(item.product).session(session).exec();
//       if (!product) {
//         throw new AppError(httpStatus.NOT_FOUND, `Product with ID ${item.product} not found`);
//       }
//       total += product.price * item.quantity;
//     }
//     // Create order
//     const order = new OrderModel({
//       user: userId,
//       cartItems,
//       paymentMethod,
//       status: 'pending',
//       total,
//     });
//     await order.save({ session });
//     await session.commitTransaction();
//     session.endSession();
//     return order;
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create order', error);
//   }
// };
// const createBookingInDb = async (bookingData: Partial<TBooking>) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     // Retrieve the room information from the database
//     const room = await RoomModel.findById(bookingData.roomId).session(session);
//     if (!room) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
//     }
//     if (
//       typeof bookingData.checkIn !== 'string' ||
//       typeof bookingData.checkOut !== 'string'
//     ) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         'Invalid check-in or check-out date',
//       );
//     }
//     // Calculate the number of nights
//     const checkInDate = new Date(bookingData.checkIn);
//     const checkOutDate = new Date(bookingData.checkOut);
//     const night =
//       (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
//     // Calculate the total price and tax
//     const roomPrice = room.priceOptions[0].price; // Assuming using the first price option
//     const totalPrice = roomPrice * night;
//     const taxRate = 0.15; // 15%
//     const tax = totalPrice * taxRate;
//     const totalWithTax = totalPrice + tax;
//     // const formattedTotalPrice = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     // const formattedTax = tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     // const formattedTotalWithTax = totalWithTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     // Format the prices to have 2 decimal places
//     const formattedTotalPrice = parseFloat(totalPrice.toFixed(2));
//     const formattedTax = parseFloat(tax.toFixed(2));
//     const formattedTotalWithTax = parseFloat(totalWithTax.toFixed(2));
//     // Set calculated values in booking data
//     bookingData.night = night;
//     bookingData.numberOfGuests = room.maxGuests;
//     bookingData.tax = formattedTax;
//     bookingData.totalPrice = formattedTotalPrice;
//     bookingData.totalWithTax = formattedTotalWithTax;
//     // Create the booking
//     const result = await BookingModel.create([bookingData], { session });
//     if (!result) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Booking creation failed');
//     }
//     // If booking creation is successful, send an email
//     const bookingConfirmationHtml = `<p>Your booking for ${room.title} is pending.</p><p>Total Price: ${totalWithTax}</p>`;
//     await sendEmail(bookingData.userEmail as string, 'You have booked', bookingConfirmationHtml);
//     await session.commitTransaction();
//     session.endSession();
//     return result;
//   } catch (error) {
//     console.error('Error in createBookingInDb:', error);
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };
// const getAllBookings = async () => {
//   try {
//     const bookings = await BookingModel.find();
//     return bookings;
//   } catch (error) {
//     console.error('Error in getAllBookings:', error);
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving bookings');
//   }
// };
// const getBookingByEmail = async (email: string, language: LanguageKey) => {
//   try {
//     // Cast the result of populate to TBookingsRoom
//     const bookings = await BookingModel.find({ userEmail: email })
//     .populate<{ roomId: TPopulatedRoom }>('roomId')
//     .sort({ createdAt: -1 })
//     .lean();
//     if (!bookings || bookings.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, 'No bookings found for this email');
//     }
//       for (const booking of bookings) {
//         if (new Date(booking.checkOut).getTime() < Date.now() && booking.bookingStatus !== 'completed') {
//           booking.bookingStatus = 'completed';
//           // Update the booking in the database
//           await BookingModel.updateOne({ _id: booking._id }, { $set: { bookingStatus: 'completed' } });
//           // Note: If working within a session or transaction, make sure to pass those as options to the updateOne call
//         }
//       }
//     const localizedBookings = bookings.map(booking => {
//       const localizedRoom = booking.roomId ? {
//         id: booking.roomId._id,
//         title: booking.roomId.title[language],
//         size: booking.roomId.size[language],
//         images: booking.roomId.images,
//         subTitle: booking.roomId.subTitle ? {
//           roomOne: booking.roomId.subTitle.roomOne[language],
//           roomTwo: booking.roomId.subTitle.roomTwo && booking.roomId.subTitle.roomTwo[language],
//         } : undefined,
//         // ... localize other fields as needed
//       } : null;
//       return {
//         ...booking,
//         roomId: localizedRoom
//       };
//     });
//     return localizedBookings;
//   } catch (error) {
//     if (error instanceof AppError) {
//       // Rethrow the error if it's an AppError
//       throw error;
//     }
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Unexpected error in getBookingByEmail');
//   }
// };
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
exports.orderService = {
    createOrder,
    singleOrderById,
    getUserOrders
    // createBookingInDb,
    // getAllBookings,
    // getBookingByEmail,
};
