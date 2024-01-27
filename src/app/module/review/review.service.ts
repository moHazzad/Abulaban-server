import mongoose, { Types } from 'mongoose';
import { ReviewModel } from './review.model';
import { TReview } from './review.interface';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';

const createRoomReviewInDb = async (reviewData: TReview) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Create the room
    const review = await ReviewModel.create([reviewData], { session });

    if (!review) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to post your review');
    }

    await session.commitTransaction();
    await session.endSession();

    return review;
  } catch (err: unknown) {
    await session.abortTransaction();
    await session.endSession();
  }
};

const getReviewsFromDb = async (roomId: string) => {
  try {
    const reviews = await ReviewModel.find({ roomId: roomId })
      .populate('userId') // Populate user details you want to show, e.g., name
      .exec();
    // Calculating the average rating using the aggregation pipeline
    const averageRatingResult = await ReviewModel.aggregate([
      { $match: { roomId: new Types.ObjectId(roomId) } }, // Match the roomId
      {
        $group: {
          _id: null, // Group all reviews for the roomId
          averageRating: { $avg: '$rating' }, // Calculate the average rating
        },
      },
    ]);

    // Extract the average rating or set to null if no reviews are found
    const averageRating =
      averageRatingResult.length > 0
        ? averageRatingResult[0].averageRating
        : 0;

    // Combine the reviews and average rating in the result object
    return {
      reviews,
      averageRating,
    };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching reviews',
    );
  }
};


export const reviewService = {
  createRoomReviewInDb,
  getReviewsFromDb,
};
