/* eslint-disable @typescript-eslint/no-explicit-any */
// Import necessary modules and services
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { subCategoryService } from './subCategory.service';
import AppError from '../../Error/errors/AppError';
import catchAsync from '../../utils/catchAsync';
import { LanguageKey } from '../../utils/Common.interface';
// import { LanguageKey } from '../room/room.interface';

// Define the controller function
const createSubCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    // Extract category data from request body
    const categoryData = req.body;


    try {
      // Use the service to create a new subcategory
      const newSubCategory =
        await subCategoryService.createSubCategoryDb(categoryData);

      // Send back a success response with the newly created subcategory
      res.status(httpStatus.CREATED).json({
        message: 'Subcategory successfully created',
        data: newSubCategory,
      });
    } catch (error) {
      // Send back an error response
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        // Handle unexpected errors
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'An unexpected error occurred' });
      }
    }
  },
);

const getSubCategoryController = catchAsync(async (req: Request, res: Response) => {
    // Extract language preference from request query or default to 'en'
    const lang: LanguageKey = req.query.lang as LanguageKey || 'ar';

    try {
        // Use the service to get localized subcategories
        const subCategories = await subCategoryService.getSubCategories(lang);

        // Send back a success response with the fetched subcategories
        res.status(httpStatus.OK).json({
            message: 'Subcategories successfully fetched',
            data: subCategories,
        });
    } catch (error: any) {
        // Send back an error response
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred', error: error.message });
    }
});

// const deleteSubCategoryController = catchAsync(async (req: Request, res: Response) => {
//   const { categoryId } = req.params;

//     try {
//         // Use the service to get localized subcategories
//         const subCategories = await subCategoryService.deleteSubCategory(categoryId);

//         // Send back a success response with the fetched subcategories
//         res.status(httpStatus.OK).json({
//             message: 'Subcategories successfully Deleted',
//             data: subCategories,
//         });
//     } catch (error: any) {
//         // Send back an error response
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred', error: error.message });
//     }
// });

// const editSubCategoryController = async (req: Request, res: Response) => {
//   const { categoryId } = req.params; // Assuming the category ID is passed in the URL parameters
//   const {categoryTitle} = req.body; // Assuming the new category data is passed in the request body

//   try {
//       // Use the service to update the category
//       const updatedCategory = await subCategoryService.editSubCategory(categoryId, categoryTitle);

//       // Send back a success response
//       res.status(httpStatus.OK).json({
//           message: 'Category successfully updated',
//           data: updatedCategory,
//       });
//   } catch (error) {
//       // Send back an error response
//       if (error instanceof AppError) {
//           res.status(error.statusCode).json({ message: error.message });
//       } else {
//           // Handle unexpected errors
//           res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
//       }
//   }
// };

export const SubCategoryController = {
  createSubCategoryController,
  getSubCategoryController,
  // deleteSubCategoryController,
  // editSubCategoryController
};
