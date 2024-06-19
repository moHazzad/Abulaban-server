"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
// import mongoose from 'mongoose';
const mongoose_1 = __importDefault(require("mongoose"));
// import AppError from '../Error/errors/AppError';
// import httpStatus from 'http-status';
const products_model_1 = require("./products.model");
// import { LanguageKey } from "../utils/Common.interface";
// import { TSubCategory } from '../module/sub-category/subCategory.interface';
// import handleCastError from '../Error/errors/handleCastError';
// import handlerDuplicateError from '../Error/errors/handlerDuplicateError';
// import { ZodError } from 'zod';
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// import { TBrand } from '../module/brand/brand.interface';
// import { TSubCategory } from '../module/sub-category/subCategory.interface';
// import { Language } from './product.controller';
// import handlerZodError from '../Error/errors/handlerZodError';
// This is your type guard function
// const isCategoryPopulated = (category: any): category is TSubCategory => {
//   return category && typeof category === 'object' && 'categoryTitle' in category;
// };
// const createProduct = async (productData: Product) => {
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const newProduct = new ProductModel(productData);
//     await newProduct.save({ session });
//     await session.commitTransaction();
//     return newProduct;
//   } catch (error: any) {
//     await session.abortTransaction();
//     if (error instanceof mongoose.Error.CastError) {
//       const castError = handleCastError(error);
//       throw new AppError(
//         castError.statusCode,
//         castError.message,
//         JSON.stringify(castError.issues),
//       );
//     } else if (error.code === 11000) {
//       const duplicateError = handlerDuplicateError(error);
//       throw new AppError(
//         duplicateError.statusCode,
//         duplicateError.message,
//         JSON.stringify(duplicateError.issues),
//       );
//     } else if (error instanceof ZodError) {
//       const validationError = handlerZodError(error);
//       throw new AppError(
//         validationError.statusCode,
//         validationError.message,
//         JSON.stringify(validationError.issues),
//       );
//     }
//     // Handle other types of errors
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `Failed to create product: ${error.message}`,
//     );
//   } finally {
//     session.endSession(); // Make sure to end the session
//   }
// };
// get all products
// const getProductsByLanguage = async (lang: Language) => {
//   try {
//     const products = await ProductModel.find({ isDeleted: { $ne: true } })
//       .populate({
//         path: 'brand',
//         select: `Name.${lang} Name.ar`,
//       })
//       .populate({
//         path: 'categoryId',
//         select: `categoryTitle.${lang} categoryTitle.ar`,
//       })
//       .lean();
//     if (!products || products.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, 'No products found');
//     }
//     const localizedProducts = products.map((product) => {
//       const brand = product.brand as TBrand;
//       const subCategory = product.subCategoryId as TSubCategory;
//       const category = product.categoryId  as TCategory;
//       return {
//         ...product,
//         Name: product.name[lang],
//         Desc: product.desc[lang],
//         type: product.type[lang],
//         highlights: product.highlights[lang],
//         Brand: {
//           ...brand,
//           Name: brand.Name[lang],
//         },
//         CategoryId: {
//           ...category,
//           categoryTitle: category.Name[lang],
//         },
//       };
//     });
//     return localizedProducts;
//   } catch (error: any) {
//     console.log(error);
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
//   }
// };
const getProductsByLanguage = (lang) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_model_1.ProductModel.find({ isDeleted: false })
            .populate({
            path: 'brand',
            select: `Name.${lang}`,
        })
            .populate({
            path: 'categoryId',
            select: `Name.${lang}`,
        })
            .populate({
            path: 'subCategoryId',
            select: `Name.${lang}`,
        })
            .lean();
        if (products.length === 0) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No products found');
        }
        return products.map((product) => {
            const brand = product.brand;
            const subCategory = product.subCategoryId;
            const category = product.categoryId;
            return {
                modelNo: product.modelNo,
                name: product.name[lang],
                type: product.type[lang],
                // brand: product.brand.Name[lang],
                desc: product.desc[lang],
                stockQty: product.stockQty,
                soldQty: product.soldQty,
                price: product.price,
                previousPrice: product.previousPrice,
                imageURLs: product.imageURLs,
                Brand: Object.assign(Object.assign({}, brand), { Name: brand.Name[lang] }),
                CategoryId: Object.assign(Object.assign({}, category), { Name: category.Name[lang] }),
                subCategory: Object.assign(Object.assign({}, subCategory), { Name: subCategory.Name[lang] }),
                techSpecifications: product.techSpecifications,
                status: product.status,
                highlights: product.highlights[lang],
            };
        });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
    }
});
// get products by category id 
const getProductsByCategory = (categoryId, lang) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_model_1.ProductModel.find({ isDeleted: false, categoryId: categoryId })
            .populate({
            path: 'brand',
            select: `Name.${lang}`,
        })
            .populate({
            path: 'categoryId',
            select: `Name.${lang}`,
        })
            .populate({
            path: 'subCategoryId',
            select: `Name.${lang}`,
        })
            .lean();
        if (products.length === 0) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No products found');
        }
        return products.map((product) => {
            const brand = product.brand;
            const subCategory = product.subCategoryId;
            const category = product.categoryId;
            return {
                modelNo: product.modelNo,
                name: product.name[lang],
                type: product.type[lang],
                // brand: product.brand.Name[lang],
                desc: product.desc[lang],
                stockQty: product.stockQty,
                soldQty: product.soldQty,
                price: product.price,
                previousPrice: product.previousPrice,
                imageURLs: product.imageURLs,
                Brand: Object.assign(Object.assign({}, brand), { Name: brand.Name[lang], image: brand.image }),
                CategoryId: Object.assign(Object.assign({}, category), { Name: category.Name[lang] }),
                subCategory: Object.assign(Object.assign({}, subCategory), { Name: subCategory.Name[lang] }),
                techSpecifications: product.techSpecifications,
                status: product.status,
                highlights: product.highlights[lang],
            };
        });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
    }
});
// get products by category id 
const getProductsBySubCategoryId = (subCategoryId, lang) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_model_1.ProductModel.find({ isDeleted: false, subCategoryId: subCategoryId })
            .populate({
            path: 'brand',
            select: `Name.${lang}`,
        })
            .populate({
            path: 'categoryId',
            select: `Name.${lang}`,
        })
            .populate({
            path: 'subCategoryId',
            select: `Name.${lang}`,
        })
            .lean();
        if (products.length === 0) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No  products found by sub category');
        }
        return products.map((product) => {
            const brand = product.brand;
            const subCategory = product.subCategoryId;
            const category = product.categoryId;
            return {
                modelNo: product.modelNo,
                name: product.name[lang],
                type: product.type[lang],
                // brand: product.brand.Name[lang],
                desc: product.desc[lang],
                stockQty: product.stockQty,
                soldQty: product.soldQty,
                price: product.price,
                previousPrice: product.previousPrice,
                imageURLs: product.imageURLs,
                Brand: Object.assign(Object.assign({}, brand), { Name: brand.Name[lang], image: brand.image }),
                CategoryId: Object.assign(Object.assign({}, category), { Name: category.Name[lang] }),
                subCategory: Object.assign(Object.assign({}, subCategory), { Name: subCategory.Name[lang] }),
                techSpecifications: product.techSpecifications,
                status: product.status,
                highlights: product.highlights[lang],
            };
        });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
    }
});
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Create new product
        const newProduct = new products_model_1.ProductModel(productData);
        yield newProduct.save({ session });
        if (!newProduct) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create product');
        }
        // Commit the transaction
        yield session.commitTransaction();
        return newProduct;
    }
    catch (err) {
        yield session.abortTransaction();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to create product: ${err.message}`);
    }
    finally {
        yield session.endSession();
    }
});
// get  products by id
// const getProductById = async (productId: string, lang: Language) => {
//   try {
//     const product = await ProductModel.findById(productId)
//       .populate({
//         path: 'Brand',
//         select: `Name.${lang} Name.ar`,
//       })
//       .populate({
//         path: 'CategoryId',
//         select: `categoryTitle.${lang} categoryTitle.ar`,
//       })
//       .lean();
//     if (!product) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
//     }
//     const brand = product.Brand as TBrand;
//     const category = product.CategoryId as unknown as TSubCategory;
//     // Extract and return the localized fields based on the requested language
//     const localizedProduct = {
//       ...product,
//       Name: product.Name[lang],
//       Desc: product.Desc[lang],
//       Brand: {
//         ...brand,
//         Name: brand.Name[lang],
//       },
//       CategoryId: {
//         ...category,
//         categoryTitle: category.categoryTitle[lang],
//       },
//     };
//     return localizedProduct;
//   } catch (error: any) {
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get product: ${error.message}`);
//   }
// };
// get products by brand id
// const getProductByBrandId = async (brandId: string, lang: Language) => {
//   try {
//     const products = await ProductModel.find({ Brand: brandId })
//       .populate({
//         path: 'Brand',
//         select: `Name.${lang} Name.ar`,
//       })
//       .populate({
//         path: 'CategoryId',
//         select: `categoryTitle.${lang} categoryTitle.ar`,
//       })
//       .lean();
//     if (!products || products.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, 'No products found for this brand');
//     }
//     // Extract and return the localized fields based on the requested language
//     const localizedProducts = products.map(product => {
//       const brand = product.Brand as TBrand;
//       const category = product.CategoryId as unknown as TSubCategory;
//       return {
//         ...product,
//         Name: product.Name[lang],
//         Desc: product.Desc[lang],
//         Brand: {
//           ...brand,
//           Name: brand.Name[lang],
//         },
//         CategoryId: {
//           ...category,
//           categoryTitle: category.categoryTitle[lang],
//         },
//       };
//     });
//     return localizedProducts;
//   } catch (error: any) {
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
//   }
// };
// const getProducts = async (  lang: string) => {
//   try {
//     const products = await ProductModel.find().populate('CategoryId').lean();
//     const translatedProducts = products.map((product: any) => {
//       // Check and update the status based on StockQTY
//       const updatedStatus = product.StockQTY === 0 ? ProductStatus.OutOfStock : product.Status;
//       const isPopulatedCategory = (category: any): category is TSubCategory =>
//         'categoryTitle' in category;
//       return {
//         ...product,
//         Name: product.Name[lang] || product.Name.en,
//         Desc: product.Desc[lang] || product.Desc.en,
//         Category: isPopulatedCategory(product.CategoryId)
//           ? product.CategoryId.categoryTitle[lang] ||
//             product.CategoryId.categoryTitle.en
//           : 'Unknown Category',
//           Status: updatedStatus, // Apply the updated status
//       };
//     });
//     return translatedProducts;
//   } catch (error: any) {
//     // Log the error or send it to an error reporting service
//     // console.error('Failed to fetch products:', error);
//     if (error instanceof mongoose.Error.CastError) {
//       const castError = handleCastError(error);
//       throw new AppError(
//         castError.statusCode,
//         castError.message,
//         JSON.stringify(castError.issues),
//       );
//     } else if (error.code === 11000) {
//       const duplicateError = handlerDuplicateError(error);
//       throw new AppError(
//         duplicateError.statusCode,
//         duplicateError.message,
//         JSON.stringify(duplicateError.issues),
//       );
//     } else if (error instanceof ZodError) {
//       const validationError = handlerZodError(error);
//       throw new AppError(
//         validationError.statusCode,
//         validationError.message,
//         JSON.stringify(validationError.issues),
//       );
//     }
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `Error fetching products.${error.message}`,
//     ); // Or return a custom error object depending on your API design
//   }
// };
// const getSingleProduct = async (productId: string, lang: string) => {
//   try {
//     // Fetch the product by ID and check if it's active
//     const product = await ProductModel.findOne({_id: productId})
//                                       .populate({
//                                         path: 'CategoryId',
//                                         select: 'categoryTitle ParentCategory' // Ensure to adjust the fields as necessary
//                                       })
//                                       .lean();
//     if (!product) {
//       throw new AppError(httpStatus.NOT_FOUND, 'product not found');
//     }
//     const updatedStatus = product.StockQTY === 0 ? ProductStatus.OutOfStock : product.Status;
//     // // Check and ensure the category information is correctly populated
//     // const isPopulatedCategory = (category: any): category is TSubCategory =>
//     //   'categoryTitle' in category;
//         // Check if the category information is populated and format it according to the language
//         const formattedCategory = product.CategoryId && 'categoryTitle' in product.CategoryId
//         ? {
//             ...product.CategoryId,
//             categoryTitle: product.CategoryId.categoryTitle[lang] || product.CategoryId.categoryTitle.en
//           }
//         : 'Unknown Category';
//     const translatedProduct = {
//       ...product,
//       Name: product.Name[lang] || product.Name.en,
//       Desc: product.Desc[lang] || product.Desc.en,
//       Category: formattedCategory,
//       Status: updatedStatus, // Apply the updated status
//     };
//     return translatedProduct;
//   } catch (error: any) {
//     // Handle different types of errors
//     if (error instanceof mongoose.Error.CastError) {
//       throw new AppError(httpStatus.BAD_REQUEST, `Cast Error: ${error.message}`);
//     } else if (error.name === 'AppError') {
//       throw error;
//     } else {
//       throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Internal Server Error: ${error.message}`);
//     }
//   }
// };
// const editProduct = async (
//   productId: string,
//   updates: Partial<Product>,
//   session?: mongoose.ClientSession
// ): Promise<Product> => {
//   const localSession = session || await mongoose.startSession();
//   try {
//     await localSession.startTransaction();
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
//     }
//     const product = await ProductModel.findById(productId).session(localSession);
//     if (!product) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
//     }
//     // if (product.Status !== ProductStatus.Active) {
//     //   throw new AppError(httpStatus.FORBIDDEN, `Product is not in an active state, current status: ${product.Status}`);
//     // }
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       productId,
//       { $set: updates },
//       { new: true, session: localSession }
//     );
//     if (!updatedProduct) {
//       throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Update failed, product returned null');
//     }
//     await localSession.commitTransaction();
//     return updatedProduct;
//   } catch (error: any) {
//     await localSession.abortTransaction();
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Internal Server Error: ${error.message}`);
//   } finally {
//     if (!session) {
//       localSession.endSession();
//     }
//   }
// };
// const deleteProduct = async (productId: string, session = null) => {
//   const localSession = session || await mongoose.startSession();
//   try {
//     await localSession.startTransaction();
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
//     }
//     const product = await ProductModel.findById(productId).session(localSession);
//     if (!product) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
//     }
//     if (product.Status === ProductStatus.INACTIVE) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Product is already inactive');
//     }
//     product.Status = ProductStatus.INACTIVE;
//     product.isDeleted = true;
//     product.deletedAt = new Date();
//     await product.save({ session: localSession });
//     await localSession.commitTransaction();
//     return product;
//   } catch (error) {
//     await localSession.abortTransaction();
//     throw error;
//   } finally {
//     if (!session) {
//       localSession.endSession();
//     }
//   }
// };
exports.productService = {
    getProductsByLanguage,
    createProduct,
    getProductsByCategory,
    getProductsBySubCategoryId
    // getProductById,
    // getProductByBrandId,
    // getProducts,
    // getSingleProduct,
    // editProduct,
    // deleteProduct
};
