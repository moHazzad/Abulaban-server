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
exports.productController = exports.searchProductsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
// import AppError from "../Error/errors/AppError";
const products_service_1 = require("./products.service");
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
// get all products
const getProductsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { lang } = req.query;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        const products = yield products_service_1.productService.getProductsByLanguage(lang);
        return res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        next(error);
    }
});
// const getProductsByParamsController =  async (req: Request, res: Response, next: NextFunction) => {
//   const { lang = 'en', page = '1', limit = '10', category, brands } = req.query;
//   const brandArray = brands ? (brands as string).split(',') : [];
//   console.log(req.query,'hit the search ');
//   try {
//     const products = await productService.getProductsByParams({
//       lang: lang as Language,
//       page: parseInt(page as string, 10),
//       limit: parseInt(limit as string, 10),
//       category: category as string,
//       brands: brandArray,
//     });
//     res.status(200).json(products);
//   } catch (error: any) {
//     next(new AppError(error.statusCode || 500, error.message));
//   }
// };
const getProductsByParamsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { lang = 'en', page = '1', limit = '20', category, brands } = req.query;
    const brandArray = brands ? brands.split(',') : [];
    console.log(req.query, 'hit the search ');
    try {
        const products = yield products_service_1.productService.getProductsByParams({
            lang: lang,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            category: category,
            brands: brandArray,
        });
        res.status(200).json(products);
    }
    catch (error) {
        next(new AppError_1.default(error.statusCode || 500, error.message));
    }
});
const getProductsByCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { lang } = req.query;
    const { categoryId } = req.params;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        const products = yield products_service_1.productService.getProductsByCategory(categoryId, lang);
        return res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        next(error);
    }
});
const getProductsBySubCategoryIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { lang } = req.query;
    const { subCategoryId } = req.params;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        const products = yield products_service_1.productService.getProductsBySubCategoryId(subCategoryId, lang);
        return res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        next(error);
    }
});
const getProductsByBrandIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { lang } = req.query;
    const { brandId } = req.params;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        const products = yield products_service_1.productService.getProductsByBrandId(brandId, lang);
        return res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        next(error);
    }
});
const createProductController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract category data from request body
    const productData = req.body;
    try {
        // Use the service to create a new subcategory
        const product = yield products_service_1.productService.createProduct(productData);
        // Send back a success response with the newly created subcategory
        res.status(http_status_1.default.CREATED).json({
            message: 'product successfully created',
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
}));
const getSingleProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    let { lang } = req.query;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        const product = yield products_service_1.productService.getProductById(productId, lang);
        return res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        next(error);
    }
});
// search products
const searchProductsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, lang } = req.query;
    // Set default language to 'ar' if not provided or invalid
    // if (lang !== 'en' && lang !== 'ar') {
    //   lang = 'ar';
    // }
    console.log(query, lang, 'search');
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    try {
        const result = yield products_service_1.productService.searchProducts(query, lang);
        return res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.searchProductsController = searchProductsController;
//  const getProductsByBrandIdController = async (req: Request, res: Response, next: NextFunction) => {
//   const { brandId } = req.params;
//   const lang = req.query.lang as Language;
//   try {
//     const products = await productService.getProductByBrandId(brandId, lang);
//     res.status(httpStatus.OK).json({
//       success: true,
//       data: products,
//     });
//   } catch (error: any) {
//     next(error);
//   }
// };
//   const getProductController = catchAsync(async (req: Request, res: Response, next: NextFunction ) => {
//     // Extract language preference from request query or default to 'en'
//     const lang = req.query.lang as LanguageKey || 'en';
//     try {
//         // Use the service to get localized subcategories
//         const subCategories = await productService.getProducts(lang);
//         res.status(httpStatus.OK).json({
//             message: 'Product successfully fetched',
//             data: subCategories,
//         });
//     } catch (error: any) {
//       next(error)
//     }
// });
//   const singleProductController = catchAsync(async (req: Request, res: Response, next: NextFunction ) => {
//     // Extract language preference from request query or default to 'en'
//    const { id: productId } = req.params;
//     const lang = req.query.lang as LanguageKey || 'en';
//     try {
//         // Use the service to get localized subcategories
//         const subCategories = await productService.getSingleProduct(productId, lang);
//         res.status(httpStatus.OK).json({
//             message: 'Product successfully fetched',
//             data: subCategories,
//         });
//     } catch (error: any) {
//       next(error)
//     }
// });
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
//  const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
//   const { id: productId } = req.params;
//   const updates = req.body;
//   try {
//     const updatedProduct = await productService.editProduct(productId, updates);
//     res.status(httpStatus.OK).json({
//       message: 'Product updated successfully',
//       product: updatedProduct,
//     });
//   } catch (error) {
//     if (!(error instanceof AppError)) {
//       const unexpectedError = new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//       next(unexpectedError);
//     } else {
//       next(error);
//     }
//   }
// };
//  const DeleteProductController = async (req: Request, res: Response, next: NextFunction) => {
//   const { id: productId } = req.params;
//   try {
//     const updatedProduct = await productService.deleteProduct(productId);
//     res.status(httpStatus.OK).json({
//       message: 'Product Delete successfully',
//       product: updatedProduct,
//     });
//   } catch (error: any ) {
//     if (!(error instanceof AppError)) {
//       const unexpectedError = new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Internal Server Error ${error.message} `);
//       next(unexpectedError);
//     } else {
//       next(error);
//     }
//   }
// };
exports.productController = {
    getProductsController,
    createProductController,
    getProductsByCategoryController,
    getProductsBySubCategoryIdController,
    getSingleProductController,
    getProductsByBrandIdController,
    getProductsByParamsController,
    searchProductsController: exports.searchProductsController
    // getProductHandler,
    // getProductsByBrandIdController
    // getProductController,
    // singleProductController,
    // updateProductController,
    // DeleteProductController
};
