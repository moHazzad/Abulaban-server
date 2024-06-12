/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
// import { TMainCategory } from './Category.interface';
// import { MainCategoryModel } from './Category.model';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
import { LanguageKey } from '../../utils/Common.interface';
import { TCategory } from './Category.interface';
import { CategoryModel } from './Category.model';
// import { LanguageKey } from '../room/room.interface';

const validateCategoryData = (data: TCategory) => {
  // Validate that both 'en' and 'ar' fields are present and not empty
  if (!data.Name.en || !data.Name.ar) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Both English and Arabic names are required.',
    );
  }
  if (data.Name.en.trim().length === 0 || data.Name.ar.trim().length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Both English and Arabic names must be non-empty strings.',
    );
  }
};

// create category 
const createCategoryDb = async (categoryData: TCategory) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const Category = await CategoryModel.create([categoryData], {
      session,
    });

    if (!Category) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create category');
    }

    await session.commitTransaction();

    return Category;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();

    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create category due to an unexpected error.',
    );
  } finally {
    await session.endSession();
  }
};

/**
 * Get a main category by ID.
 */
const getCategoryFromDb = async (lang: LanguageKey) => {
  const categories = await CategoryModel.find().lean();
  if (!categories.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No categories found');
  }
  const localizedCategories = categories.map((category) => {
    // Return a new object for each category, with the Name field localized
    return {
      ...category, // Spread out all existing properties of the category
      Name: category.Name[lang] || category.Name.en, // Localize the name
    };
  });

  return localizedCategories;
};

/**
 * Edit a main category by ID.
 */
const editCategoryInDb = async (
  categoryId: string,
  updateData: TCategory,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Validate the update data before proceeding
    validateCategoryData(updateData);

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { $set: updateData }, // Use $set to update fields explicitly
      { new: true, session, runValidators: true },
    );
    if (!updatedCategory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }
    await session.commitTransaction();
    return updatedCategory;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to update category due to an unexpected error: ${err.message}`,
    );
  } finally {
    await session.endSession();
  }
};

/**
 * Delete a main category by ID.
 */
const deleteCategoryFromDb = async (categoryId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(
      categoryId,
      { session },
    );
    if (!deletedCategory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }
    await session.commitTransaction();
    return deletedCategory;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to delete category due to an unexpected error: ${err.message}`,
    );
  } finally {
    await session.endSession();
  }
};

export const categoryService = {
  createCategoryDb,
  getCategoryFromDb,
  editCategoryInDb,
  deleteCategoryFromDb,
};
