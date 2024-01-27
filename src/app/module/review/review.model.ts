import mongoose, { Schema } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  }
}, { timestamps: true });

export const ReviewModel = mongoose.model<TReview>('Review', reviewSchema);

