/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { LocalizedString, TSubCategory } from './subCategory.interface';
import { SubCategoryModel } from './subCategory.model';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
import { LanguageKey } from '../../utils/Common.interface';
import { PopulatedSubCategory } from '../mainCategory/mainCategory.interface';
// import { LanguageKey } from '../room/room.interface';
// import { Types } from "mongoose";

// const createSubCategoryDb = async (categoryData: TSubCategory) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const subCategory = await SubCategoryModel.create([categoryData], {
//       session,
//     });

//     if (!subCategory) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create category');
//     }

//     await session.commitTransaction();

//     return subCategory;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     await session.abortTransaction();

//     if (err instanceof AppError) {
//       throw err;
//     }
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Failed to create category due to an unexpected error.',
//     );
//   } finally {
//     await session.endSession();
//   }
// };

const createSubCategoryDb = async (categoryData: TSubCategory) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const subCategory = await SubCategoryModel.create([categoryData], { session });

    if (!subCategory) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create category: No document returned.');
    }

    await session.commitTransaction();
    return subCategory;
  } catch (err: any) {
    await session.abortTransaction();

    let errorMessage = 'Failed to create category due to an unexpected error.';
    if (err instanceof mongoose.Error.ValidationError) {
      errorMessage = `Validation error: ${err.message}`;
    } else if (err instanceof mongoose.Error) {
      errorMessage = `Database error: ${err.message}`;
    } else if (err.code && err.code === 11000) {
      errorMessage = 'Database error: Duplicate key error, such an item already exists.';
    }

    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(httpStatus.BAD_REQUEST, errorMessage);
  } finally {
    await session.endSession();
  }
};


const getSubCategory = async (lang: LanguageKey): Promise<PopulatedSubCategory[]> => {
  const subCategories = await SubCategoryModel.find()
      .populate({
          path: 'ParentCategory',
           // Selecting only the Name from the main category
      })
      .lean();

  if (!subCategories.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'No subcategories found');
  }

  return subCategories.map(subCategory => {
    // Asserting the type of ParentCategory post-population
    const populatedParentCategory = subCategory.ParentCategory as unknown as PopulatedSubCategory | null;

    const localizedSubCategory: PopulatedSubCategory = {
      id: subCategory._id.toString(),
      categoryTitle: subCategory.categoryTitle[lang],
      ParentCategory: populatedParentCategory ? populatedParentCategory.Name[lang] : null,
      Name: undefined 
    };

    return localizedSubCategory;
  });
};

const deleteSubCategory = async (categoryId: string): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(
      categoryId,
      { session },
    );
    if (!deletedSubCategory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }
    await session.commitTransaction();
    
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

const editSubCategory = async  (id: string, categoryTitle: LocalizedString ) => {
  
  // Validate input
  if (!id || !categoryTitle || !categoryTitle.en || !categoryTitle.ar) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields.');
  }

  const existingSubCategory = await SubCategoryModel.findById(id);
  if (!existingSubCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found.');
  }

  // Check for duplicate category titles in English
  const duplicate = await SubCategoryModel.findOne({
    _id: { $ne: id }, // Exclude current subcategory from the search
    'categoryTitle.en': categoryTitle.en,
  });
  if (duplicate) {
    throw new AppError(httpStatus.BAD_REQUEST, `A category with the English title '${categoryTitle.en}' already exists.`);
  }

  // Check for duplicate category titles in Arabic
  const duplicateAr = await SubCategoryModel.findOne({
    _id: { $ne: id }, // Exclude current subcategory from the search
    'categoryTitle.ar': categoryTitle.ar,
  });
  if (duplicateAr) {
    throw new AppError(httpStatus.BAD_REQUEST, `A category with the Arabic title '${categoryTitle.ar}' already exists.`);
  }

  // Update subcategory
  existingSubCategory.categoryTitle = categoryTitle;
  await existingSubCategory.save();

  return existingSubCategory;
}



export const subCategoryService = {
  createSubCategoryDb,
  getSubCategory,
  deleteSubCategory,
  editSubCategory
};
