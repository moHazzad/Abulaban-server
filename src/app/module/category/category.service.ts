/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../Error/errors/AppError';
import { CategoryModel } from './category.model';
import mongoose from 'mongoose';
import { TRoomCategory } from './category.interface';
import { LanguageKey } from '../room/room.interface';

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
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create category due to an unexpected error.',
    );
  }
};

const getCategoryFromDb = async (language: LanguageKey) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const category = await CategoryModel.find().lean();

    // Map over each room and construct a new object with the desired structure
    const categoryLocalizedRooms = category.map((singleCategory) => ({
      id: singleCategory._id,
      title: singleCategory.categoryTitle[language],
    }));

    await session.commitTransaction();
    await session.endSession();
    return categoryLocalizedRooms;
    
    
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to find category due to an unexpected error.',
    );
  }
};

export const categoryService = {
  createCategoryDb,
  getCategoryFromDb,
};
