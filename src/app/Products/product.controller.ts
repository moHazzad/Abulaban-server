/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import AppError from "../Error/errors/AppError";
import { productService } from "./products.service";
import { LanguageKey } from "../utils/Common.interface";
// import { LanguageKey } from "../utils/Common.interface";





const createProductController = catchAsync( async (req: Request, res: Response, next: NextFunction ) => {
      // Extract category data from request body
      const productData = req.body;
  
      try {
        // Use the service to create a new subcategory
        const product = await productService.createProduct(productData);
  
        // Send back a success response with the newly created subcategory
        res.status(httpStatus.CREATED).json({
          message: 'Subcategory successfully created',
          data: product,
        });
      } catch (error) {
        // // Send back an error response
        // if (error instanceof AppError) {
        //   res.status(error.statusCode).json({ message: error.message });
        // } else {
        //   // Handle unexpected errors
        //   res
        //     .status(httpStatus.INTERNAL_SERVER_ERROR)
        //     .json({ message: 'An unexpected error occurred' });
        // }
        next(error)
      }
    },
  );

  const getProductController = catchAsync(async (req: Request, res: Response, next: NextFunction ) => {
    // Extract language preference from request query or default to 'en'
    const lang = req.query.lang as LanguageKey || 'en';

    try {
        // Use the service to get localized subcategories
        const subCategories = await productService.getProducts(lang);

        
        res.status(httpStatus.OK).json({
            message: 'Product successfully fetched',
            data: subCategories,
        });
    } catch (error: any) {
      next(error)
    }
});

  const singleProductController = catchAsync(async (req: Request, res: Response, next: NextFunction ) => {
    // Extract language preference from request query or default to 'en'
   const { id: productId } = req.params;
    const lang = req.query.lang as LanguageKey || 'en';

    try {
        // Use the service to get localized subcategories
        const subCategories = await productService.getSingleProduct(productId, lang);

        
        res.status(httpStatus.OK).json({
            message: 'Product successfully fetched',
            data: subCategories,
        });
    } catch (error: any) {
      next(error)
    }
});

// const editProductController = async (req: Request, res: Response) => {
//   const { productId } = req.params; // Assuming the ID is passed in the URL
//   const updates = req.body; // Assuming updates are passed in the request body
//   const lang = req.headers['accept-language'] || 'en'; // Or however you choose to determine language

//   try {
//       // Use the service to update the category
//       const updatedCategory = await productService.editProduct(productId, updates, lang);

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
 const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { id: productId } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await productService.editProduct(productId, updates);
    res.status(httpStatus.OK).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    if (!(error instanceof AppError)) {
      const unexpectedError = new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      next(unexpectedError);
    } else {
      next(error);
    }
  }
};

 const DeleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  const { id: productId } = req.params;

  try {
    const updatedProduct = await productService.deleteProduct(productId);
    res.status(httpStatus.OK).json({
      message: 'Product Delete successfully',
      product: updatedProduct,
    });
  } catch (error: any ) {
    if (!(error instanceof AppError)) {
      const unexpectedError = new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Internal Server Error ${error.message} `);
      next(unexpectedError);
    } else {
      next(error);
    }
  }
};

  export const productController = {
    createProductController,
    getProductController,
    singleProductController,
    updateProductController,
    DeleteProductController
  };