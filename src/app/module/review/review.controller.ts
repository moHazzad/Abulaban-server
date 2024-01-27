import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../Error/errors/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { reviewService } from "./review.service";



const createReview = catchAsync(async (req: Request, res: Response) => {

    //saving to db
    const result = await reviewService.createRoomReviewInDb(req.body);
  
    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Review is not Not posted Please Tray again');
      } else {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Your review Posted Successfully',
          data: result,
        });
      }
  });

const getSingleRoomReview = catchAsync(async (req: Request, res: Response) => {

  const roomId = (req.params.roomId);
    //saving to db
    const result = await reviewService.getReviewsFromDb(roomId);
  
    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Review is not Not posted Please Tray again');
      } else {
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Review retrieved Successfully',
          data: result,
        });
      }
  });




  export const createReviewController = {
    createReview,
    getSingleRoomReview,
  };