/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Product, ProductStatus } from './product.interface';
import AppError from '../Error/errors/AppError';
import httpStatus from 'http-status';
import { ProductModel } from './products.model';
// import { LanguageKey } from "../utils/Common.interface";
import { TSubCategory } from '../module/sub-category/subCategory.interface';
import handleCastError from '../Error/errors/handleCastError';
import handlerDuplicateError from '../Error/errors/handlerDuplicateError';
import { ZodError } from 'zod';
import handlerZodError from '../Error/errors/handlerZodError';


// This is your type guard function
// const isCategoryPopulated = (category: any): category is TSubCategory => {
//   return category && typeof category === 'object' && 'categoryTitle' in category;
// };

const createProduct = async (productData: Product) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newProduct = new ProductModel(productData);
    await newProduct.save({ session });
    await session.commitTransaction();
    return newProduct;
  } catch (error: any) {
    await session.abortTransaction();

    if (error instanceof mongoose.Error.CastError) {
      const castError = handleCastError(error);
      throw new AppError(
        castError.statusCode,
        castError.message,
        JSON.stringify(castError.issues),
      );
    } else if (error.code === 11000) {
      const duplicateError = handlerDuplicateError(error);
      throw new AppError(
        duplicateError.statusCode,
        duplicateError.message,
        JSON.stringify(duplicateError.issues),
      );
    } else if (error instanceof ZodError) {
      const validationError = handlerZodError(error);
      throw new AppError(
        validationError.statusCode,
        validationError.message,
        JSON.stringify(validationError.issues),
      );
    }

    // Handle other types of errors
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to create product: ${error.message}`,
    );
  } finally {
    session.endSession(); // Make sure to end the session
  }
};

const getProducts = async (  lang: string) => {
  try {
    const products = await ProductModel.find().populate('CategoryId').lean();

    const translatedProducts = products.map((product: any) => {
      // Check and update the status based on StockQTY
      const updatedStatus = product.StockQTY === 0 ? ProductStatus.OutOfStock : product.Status;

      const isPopulatedCategory = (category: any): category is TSubCategory =>
        'categoryTitle' in category;

      return {
        ...product,
        Name: product.Name[lang] || product.Name.en,
        Desc: product.Desc[lang] || product.Desc.en,
        Category: isPopulatedCategory(product.CategoryId)
          ? product.CategoryId.categoryTitle[lang] ||
            product.CategoryId.categoryTitle.en
          : 'Unknown Category',
          Status: updatedStatus, // Apply the updated status
      };
    });

    return translatedProducts;
  } catch (error: any) {
    // Log the error or send it to an error reporting service
    // console.error('Failed to fetch products:', error);

    if (error instanceof mongoose.Error.CastError) {
      const castError = handleCastError(error);
      throw new AppError(
        castError.statusCode,
        castError.message,
        JSON.stringify(castError.issues),
      );
    } else if (error.code === 11000) {
      const duplicateError = handlerDuplicateError(error);
      throw new AppError(
        duplicateError.statusCode,
        duplicateError.message,
        JSON.stringify(duplicateError.issues),
      );
    } else if (error instanceof ZodError) {
      const validationError = handlerZodError(error);
      throw new AppError(
        validationError.statusCode,
        validationError.message,
        JSON.stringify(validationError.issues),
      );
    }

    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Error fetching products.${error.message}`,
    ); // Or return a custom error object depending on your API design
  }
};


const getSingleProduct = async (productId: string, lang: string) => {
  
  try {
    // Fetch the product by ID and check if it's active
    const product = await ProductModel.findOne({_id: productId})
                                      .populate({
                                        path: 'CategoryId',
                                        select: 'categoryTitle ParentCategory' // Ensure to adjust the fields as necessary
                                      })
                                      .lean();

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'product not found');
    }

    const updatedStatus = product.StockQTY === 0 ? ProductStatus.OutOfStock : product.Status;

    // // Check and ensure the category information is correctly populated
    // const isPopulatedCategory = (category: any): category is TSubCategory =>
    //   'categoryTitle' in category;

        // Check if the category information is populated and format it according to the language
        const formattedCategory = product.CategoryId && 'categoryTitle' in product.CategoryId 
        ? {
            ...product.CategoryId,
            categoryTitle: product.CategoryId.categoryTitle[lang] || product.CategoryId.categoryTitle.en
          }
        : 'Unknown Category';

    const translatedProduct = {
      ...product,
      Name: product.Name[lang] || product.Name.en,
      Desc: product.Desc[lang] || product.Desc.en,
      Category: formattedCategory,
      Status: updatedStatus, // Apply the updated status
    };

    return translatedProduct;
  } catch (error: any) {
    // Handle different types of errors
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(httpStatus.BAD_REQUEST, `Cast Error: ${error.message}`);
    } else if (error.name === 'AppError') {
      throw error;
    } else {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Internal Server Error: ${error.message}`);
    }
  }
};


const editProduct = async (
  productId: string,
  updates: Partial<Product>,
  session?: mongoose.ClientSession
): Promise<Product> => {
  const localSession = session || await mongoose.startSession();
  try {
    await localSession.startTransaction();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
    }

    const product = await ProductModel.findById(productId).session(localSession);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // if (product.Status !== ProductStatus.Active) {
    //   throw new AppError(httpStatus.FORBIDDEN, `Product is not in an active state, current status: ${product.Status}`);
    // }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true, session: localSession }
    );

    if (!updatedProduct) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Update failed, product returned null');
    }

    await localSession.commitTransaction();
    return updatedProduct;
  } catch (error: any) {
    await localSession.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Internal Server Error: ${error.message}`);
  } finally {
    if (!session) {
      localSession.endSession();
    }
  }
};

const deleteProduct = async (productId: string, session = null) => {
  const localSession = session || await mongoose.startSession();
  try {
    await localSession.startTransaction();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
    }

    const product = await ProductModel.findById(productId).session(localSession);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    if (product.Status === ProductStatus.INACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product is already inactive');
    }

    product.Status = ProductStatus.INACTIVE;
    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save({ session: localSession });

    await localSession.commitTransaction();
    return product;
  } catch (error) {
    await localSession.abortTransaction();
    throw error;
  } finally {
    if (!session) {
      localSession.endSession();
    }
  }
};




export const productService = {
  createProduct,
  getProducts,
  getSingleProduct,
  editProduct,
  deleteProduct
};
