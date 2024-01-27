import mongoose from "mongoose";

export type TReview = {
    userId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    email: string;
    message: string;
    rating: number;
  }
  
 