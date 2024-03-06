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
exports.createBookingController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const booking_service_1 = require("./booking.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const bookingRoom = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const bookingData = req.body;
    //  console.log(req.user);
    const result = yield booking_service_1.bookingService.createBookingInDb(bookingData);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'OPPS Room not booked');
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Room booked successfully',
            data: result,
        });
    }
}));
const getAllBookingRooms = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    // const bookingData = req.body;
    //  console.log(req.user);
    const result = yield booking_service_1.bookingService.getAllBookings();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'OPPS No Room booked');
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Room booked found successfully',
            data: result,
        });
    }
}));
const getSingleBookedRoom = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.userEmail, 'asdjhh');
    const userEmail = req.params.userEmail;
    // const currentLanguage = req.headers['accept-language'];
    //  console.log(req.user);
    const languageParam = req.query.lang;
    const language = (typeof languageParam === 'string' && (languageParam === 'en' || languageParam === 'ar'))
        ? languageParam
        : 'en';
    const result = yield booking_service_1.bookingService.getBookingByEmail(userEmail, language);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'OPPS No Room found');
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Room booked found successfully',
            data: result,
        });
    }
}));
exports.createBookingController = {
    bookingRoom,
    getAllBookingRooms,
    getSingleBookedRoom
};
