import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { categoryService } from './Category.service';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../Error/errors/AppError';

// create category 
const createCategoryController = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body);
  //saving to db
  const result = await categoryService.createCategoryDb(req.body);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'category not created',
      data: res,
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'category is created successfully',
      data: result,
    });
  }
});

// get categories
const getCategoriesController = catchAsync(
  async (req: Request, res: Response) => {
    const languageParam = req.query.lang;
    const language =
      typeof languageParam === 'string' &&
      (languageParam === 'en' || languageParam === 'ar')
        ? languageParam
        : 'en';
    const result = await categoryService.getCategoryFromDb(language);

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, 'No category found.');
    } else {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: ' Successful',
        data: result,
      });
    }
  },
);

 const editCategoryController = async (req: Request, res: Response) => {
    const { categoryId } = req.params; // Assuming the category ID is passed in the URL parameters
    const updateData = req.body; // Assuming the new category data is passed in the request body

    try {
        // Use the service to update the category
        const updatedCategory = await categoryService.editCategoryInDb(categoryId, updateData);

        // Send back a success response
        res.status(httpStatus.OK).json({
            message: 'Category successfully updated',
            data: updatedCategory,
        });
    } catch (error) {
        // Send back an error response
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            // Handle unexpected errors
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
};


 const deleteCategoryController = async (req: Request, res: Response) => {
    const { categoryId } = req.params; // Assuming the category ID is passed in the URL parameters

    try {
        // Use the service to delete the category
        const deletedCategory = await categoryService.deleteCategoryFromDb(categoryId);

        // Send back a success response
        res.status(httpStatus.OK).json({
            message: 'Category successfully deleted',
            data: deletedCategory, // Optional: return deleted category details
        });
    } catch (error) {
        // Send back an error response
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            // Handle unexpected errors
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
};



export const categoryController = {
  createCategoryController,
  getCategoriesController,
  editCategoryController,
  deleteCategoryController,
  // getCategoryController
};
