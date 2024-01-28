"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.reviewService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const review_model_1 = require("./review.model");
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createRoomReviewInDb = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Create the room
        const review = yield review_model_1.ReviewModel.create([reviewData], { session });
        if (!review) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to post your review');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return review;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
    }
});
const getReviewsFromDb = (roomId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;
        // Fetch the paginated reviews
        const reviews = yield review_model_1.ReviewModel.find({ roomId: roomId })
            .populate('userId') // Populate user details you want to show
            .skip(skip)
            .limit(limit)
            .exec();
        // Count the total number of reviews for this room
        const totalReviews = yield review_model_1.ReviewModel.countDocuments({ roomId: roomId });
        // Calculating the average rating using the aggregation pipeline
        const averageRatingResult = yield review_model_1.ReviewModel.aggregate([
            { $match: { roomId: new mongoose_1.Types.ObjectId(roomId) } },
            {
                $group: {
                    _id: null, // Group all reviews for the roomId
                    averageRating: { $avg: '$rating' }, // Calculate the average rating
                },
            },
        ]);
        // Extract the average rating or set to 0 if no reviews are found
        const averageRating = averageRatingResult.length > 0
            ? parseFloat(averageRatingResult[0].averageRating.toFixed(1))
            : 0;
        // Combine the reviews, average rating, and total number of reviews in the result object
        return {
            reviews,
            averageRating,
            totalReviews, // Total number of reviews for pagination
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Error fetching reviews');
    }
});
// const getReviewsFromDb = async (roomId: string) => {
//   try {
//     const reviews = await ReviewModel.find({ roomId: roomId })
//       .populate('userId') // Populate user details you want to show, e.g., name
//       .exec();
//     // Calculating the average rating using the aggregation pipeline
//     const averageRatingResult = await ReviewModel.aggregate([
//       { $match: { roomId: new Types.ObjectId(roomId) } }, // Match the roomId
//       {
//         $group: {
//           _id: null, // Group all reviews for the roomId
//           averageRating: { $avg: '$rating' }, // Calculate the average rating
//         },
//       },
//     ]);
//     // Extract the average rating or set to null if no reviews are found
//     const averageRating =
//     averageRatingResult.length > 0
//       ? parseFloat(averageRatingResult[0].averageRating.toFixed(1))
//       : 0;
//     // Combine the reviews and average rating in the result object
//     return {
//       reviews,
//       averageRating,
//     };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       'Error fetching reviews',
//     );
//   }
// };
exports.reviewService = {
    createRoomReviewInDb,
    getReviewsFromDb,
};
