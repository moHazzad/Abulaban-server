/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../Error/errors/AppError";
import { CategoryModel } from "./category.model";
import mongoose from "mongoose";
import { TRoomCategory } from "./category.interface";


const createCategoryDb = async (categoryData: TRoomCategory) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        
        const rooms = await CategoryModel.create([categoryData], { session });

        if (!rooms) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create category');
        }

        await session.commitTransaction();
        await session.endSession();

        return rooms;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
       
        if (err instanceof AppError) {
            throw err;
        }
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create category due to an unexpected error.');
    }
};

export const categoryService = {
    createCategoryDb
};