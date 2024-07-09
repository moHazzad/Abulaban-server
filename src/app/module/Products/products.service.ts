/* eslint-disable @typescript-eslint/no-explicit-any */
// import mongoose from 'mongoose';
import mongoose from 'mongoose';
import { CreateProductInput, GetProductsParams, Product, } from './product.interface';
// import AppError from '../Error/errors/AppError';
// import httpStatus from 'http-status';
import { ProductModel } from './products.model';
// import { LanguageKey } from "../utils/Common.interface";
// import { TSubCategory } from '../module/sub-category/subCategory.interface';
// import handleCastError from '../Error/errors/handleCastError';
// import handlerDuplicateError from '../Error/errors/handlerDuplicateError';
// import { ZodError } from 'zod';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';
import { Language } from './product.controller';
import { TBrand } from '../brand/brand.interface';
import { TSubCategory } from '../sub-category/subCategory.interface';
import { TCategory } from '../Category/Category.interface';
// import { TBrand } from '../brand/brand.interface';
// import { TSubCategory } from '../sub-category/subCategory.interface';
// import { TCategory } from '../Category/Category.interface';
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

const getProductById = async (productId: string, lang: Language) => {

  try {
    const product = await ProductModel.findById({ isDeleted: false, _id:productId })
    .populate({
      path: 'brand',
      // select: `Name.${lang}`,
    })
    .populate({
      path: 'categoryId',
      // select: `Name.${lang}`,
    })
    .populate({
      path: 'subCategoryId',
      select: `Name.${lang}`,
    }).lean() ;

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    const brand = product.brand as TBrand;
    const category = product.categoryId as unknown as TCategory;
    const subCategory = product.subCategoryId as unknown as TSubCategory;

    // Extract and return the localized fields based on the requested language
    const localizedProduct = {
      ...product,
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
        Brand: {
          ...brand,
          Name: brand.Name[lang],
          image: brand.image
        },
        CategoryId: {
          ...category,
          Name: category.Name[lang],
        },
        SubCategory: {
          ...subCategory,
          Name: subCategory.Name[lang],
        },
        
        techSpecifications: product.techSpecifications,
        status: product.status,
        highlights: product.highlights[lang],
    };

    return localizedProduct;
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get product: ${error}`);
  }
};

const getProductsByLanguage = async (lang: Language) => {
  try {
    const products = await ProductModel.find({ isDeleted: false })
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
      throw new AppError(httpStatus.NOT_FOUND, 'No products found');
    }

    return products.map((product) => {
      const brand = product.brand as TBrand;
      const subCategory = product.subCategoryId as unknown as TSubCategory;
      const category = product.categoryId as unknown as TCategory;

      return {
        ...product,
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
        Brand: {
          ...brand,
          Name: brand.Name[lang],
        },
        CategoryId: {
          ...category,
          Name: category.Name[lang],
        },
        SubCategory: {
          ...subCategory,
          Name: subCategory.Name[lang],
        },
        
        techSpecifications: product.techSpecifications,
        status: product.status,
        highlights: product.highlights[lang],
      };
    });
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
  }
};

// const getProductsByParams = async ({ lang, page = 1, limit = 30, category, brands }: GetProductsParams) => {
//   try {
//     const query: any = { isDeleted: false };
//     if (category) {
//       query.$or = [
//         { categoryId: category },
//         { subCategoryId: category }
//       ];
//     }
//     if (brands && brands.length > 0) {
//       query.brand = { $in: brands };
//     }

//     const skip = (page - 1) * limit;

//     const products = await ProductModel.find(query)
//       .populate({
//         path: 'brand',
//         select: `Name.${lang}`,
//       })
//       .populate({
//         path: 'categoryId',
//         select: `Name.${lang}`,
//       })
//       .populate({
//         path: 'subCategoryId',
//         select: `Name.${lang}`,
//       })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     if (products.length === 0) {
//       throw new AppError(httpStatus.NOT_FOUND, 'No products found');
//     }

//     const totalProducts = await ProductModel.countDocuments(query);

//     const mappedProducts = products.map((product) => {
//       const brand = product.brand as TBrand;
//       const subCategory = product.subCategoryId as unknown as TSubCategory;
//       const category = product.categoryId as unknown as TCategory;

//       return {
//         ...product,
//         modelNo: product.modelNo,
//         name: product.name[lang],
//         type: product.type[lang],
//         desc: product.desc[lang],
//         stockQty: product.stockQty,
//         soldQty: product.soldQty,
//         price: product.price,
//         previousPrice: product.previousPrice,
//         imageURLs: product.imageURLs,
//         Brand: {
//           ...brand,
//           Name: brand.Name[lang],
//         },
//         CategoryId: {
//           ...category,
//           Name: category.Name[lang],
//         },
//         SubCategory: {
//           ...subCategory,
//           Name: subCategory.Name[lang],
//         },
//         techSpecifications: product.techSpecifications,
//         status: product.status,
//         highlights: product.highlights[lang],
//       };
//     });

//     return {
//       products: mappedProducts,
//       totalProducts,
//       totalPages: Math.ceil(totalProducts / limit),
//       currentPage: page
//     };
//   } catch (error: any) {
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
//   }
// };


// get products by category id 

const getProductsByParams = async ({ lang, page = 1, limit = 30, category, brands }: GetProductsParams) => {
  try {
    const query: any = { isDeleted: false };
    if (category) {
      query.$or = [
        { categoryId: category },
        { subCategoryId: category }
      ];
    }
    if (brands && brands.length > 0) {
      query.brand = { $in: brands };
    }

    const skip = (page - 1) * limit;

    const products = await ProductModel.find(query)
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
      .skip(skip)
      .limit(limit)
      .lean();

    if (products.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, 'No products found');
    }

    const totalProducts = await ProductModel.countDocuments(query);

    const mappedProducts = products.map((product) => {
      const brand = product.brand as TBrand;
      const subCategory = product.subCategoryId as unknown as TSubCategory;
      const category = product.categoryId as unknown as TCategory;

      return {
        ...product,
        modelNo: product.modelNo,
        name: product.name[lang],
        type: product.type[lang],
        desc: product.desc[lang],
        stockQty: product.stockQty,
        soldQty: product.soldQty,
        price: product.price,
        previousPrice: product.previousPrice,
        imageURLs: product.imageURLs,
        Brand: {
          ...brand,
          Name: brand.Name[lang],
        },
        CategoryId: {
          ...category,
          Name: category.Name[lang],
        },
        SubCategory: {
          ...subCategory,
          Name: subCategory.Name[lang],
        },
        techSpecifications: product.techSpecifications,
        status: product.status,
        highlights: product.highlights[lang],
      };
    });

    return {
      products: mappedProducts,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    };
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
  }
};


const getProductsByCategory = async (categoryId:string,lang: Language) => {
  try {
    const products = await ProductModel.find({ isDeleted: false, categoryId:categoryId })
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
      throw new AppError(httpStatus.NOT_FOUND, 'No products found');
    }

    return products.map((product) => {
      const brand = product.brand as TBrand;
      const subCategory = product.subCategoryId as unknown as TSubCategory;
      const category = product.categoryId as unknown as TCategory;

      return {
        ...product,
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
        Brand: {
          ...brand,
          Name: brand.Name[lang],
          image: brand.image
        },
        CategoryId: {
          ...category,
          Name: category.Name[lang],
        },
        SubCategory: {
          ...subCategory,
          Name: subCategory.Name[lang],
        },
        
        techSpecifications: product.techSpecifications,
        status: product.status,
        highlights: product.highlights[lang],
      };
    });
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
  }
};

// get products by category id 
const getProductsBySubCategoryId = async (subCategoryId:string,lang: Language) => {
  try {
    const products = await ProductModel.find({ isDeleted: false, subCategoryId:subCategoryId })
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
      throw new AppError(httpStatus.NOT_FOUND, 'No  products found by sub category');
    }

    return products.map((product) => {
      const brand = product.brand as TBrand;
      const subCategory = product.subCategoryId as unknown as TSubCategory;
      const category = product.categoryId as unknown as TCategory;

      return {
        ...product,
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
        Brand: {
          ...brand,
          Name: brand.Name[lang],
          image: brand.image
        },
        CategoryId: {
          ...category,
          Name: category.Name[lang],
        },
        SubCategory: {
          ...subCategory,
          Name: subCategory.Name[lang],
        },
        
        techSpecifications: product.techSpecifications,
        status: product.status,
        highlights: product.highlights[lang],
      };
    });
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
  }
};

// get products but brnad 
const getProductsByBrandId = async (brandId:string,lang: Language) => {
  try {
    const products = await ProductModel.find({ isDeleted: false, brand:brandId })
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
      throw new AppError(httpStatus.NOT_FOUND, 'No products found');
    }

    return products.map((product) => {
      const brand = product.brand as TBrand;
      const subCategory = product.subCategoryId as unknown as TSubCategory;
      const category = product.categoryId as unknown as TCategory;

      return {
        ...product,
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
        Brand: {
          ...brand,
          Name: brand.Name[lang],
          image: brand.image
        },
        CategoryId: {
          ...category,
          Name: category.Name[lang],
        },
        SubCategory: {
          ...subCategory,
          Name: subCategory.Name[lang],
        },
        
        techSpecifications: product.techSpecifications,
        status: product.status,
        highlights: product.highlights[lang],
      };
    });
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get products: ${error.message}`);
  }
};

const createProduct = async (
  productData: CreateProductInput,
): Promise<Product> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Create new product
    const newProduct = new ProductModel(productData);
    await newProduct.save({ session });

    if (!newProduct) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create product');
    }

    // Commit the transaction
    await session.commitTransaction();
    return newProduct;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to create product: ${err.message}`,
    );
  } finally {
    await session.endSession();
  }
};



// search products 
// const searchProducts = async ({ query, lang, limit = 10, page = 1 }: SearchParams) => {
//   try {
//     const skip = (page - 1) * limit;
//     const searchQuery = {
//       $text: { $search: query },
//       isDeleted: false
//     };

//     const products = await ProductModel.find(searchQuery, {
//       score: { $meta: 'textScore' },
//       [`name.${lang}`]: 1,
//       [`desc.${lang}`]: 1,
//       price: 1,
//       imageURLs: 1,
//     })
//       .sort({ score: { $meta: 'textScore' } })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     const totalProducts = await ProductModel.countDocuments(searchQuery);

//     return {
//       products,
//       totalProducts,
//       totalPages: Math.ceil(totalProducts / limit),
//       currentPage: page,
//     };
//   } catch (error: any) {
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to search products: ${error.message}`);
//   }
// };

const searchProducts = async (query: string, lang: string): Promise<Product[]> => {
  try {
    const products = await ProductModel.find({
      $or: [
        { [`name.${lang}`]: { $regex: query, $options: 'i' } },
        { [`desc.${lang}`]: { $regex: query, $options: 'i' } },
        { modelNo: { $regex: query, $options: 'i' } }
      ],
      isDeleted: false,
    }).lean().exec();

    return products.map((product: any) => ({
      ...product,
      name: product.name[lang],
      desc: product.desc[lang],
      type: product.type[lang],
      highlights: product.highlights[lang],
    }));
  } catch (error: any) {
    throw new Error(`Failed to search products: ${error.message}`);
  }
};
// const searchProducts = async (query: string, lang: string):Promise<Product[]> => {
//   try {
//     const products = await ProductModel.find({
//       $or: [
//         { [`name.${lang}`]: { $regex: query, $options: 'i' } },
//         { [`desc.${lang}`]: { $regex: query, $options: 'i' } },
//         { modelNo: { $regex: query, $options: 'i' } }
//       ],
//       isDeleted: false,
//     }).lean() as Product ;
    

//     return products.map((product: any) => ({
//       ...product,
//       name: product.name[lang],
//       desc: product.desc[lang],
//       type: product.type[lang],
//       highlights: product.highlights[lang],
//     }));
//   } catch (error:any) {
//     throw new Error(`Failed to search products: ${error.message}`);
//   }
// };



// get  products by id


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

export const productService = {
  getProductsByLanguage,
  createProduct,
  getProductsByCategory,
  getProductsBySubCategoryId,
  getProductById,
  getProductsByBrandId,
  getProductsByParams,
  searchProducts
  
  // getProductById,
  // getProductByBrandId,
  // getProducts,
  // getSingleProduct,
  // editProduct,
  // deleteProduct
};
