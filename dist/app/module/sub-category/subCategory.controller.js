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
exports.SubCategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const subCategory_service_1 = require("./subCategory.service");
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// import { LanguageKey } from '../room/room.interface';
// Define the controller function
const createSubCategoryController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract category data from request body
    const categoryData = req.body;
    try {
        // Use the service to create a new subcategory
        const newSubCategory = yield subCategory_service_1.subCategoryService.createSubCategoryDb(categoryData);
        // Send back a success response with the newly created subcategory
        res.status(http_status_1.default.CREATED).json({
            message: 'Subcategory successfully created',
            data: newSubCategory,
        });
    }
    catch (error) {
        // Send back an error response
        if (error instanceof AppError_1.default) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            // Handle unexpected errors
            res
                .status(http_status_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: 'An unexpected error occurred' });
        }
    }
}));
const getSubCategoryController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract language preference from request query or default to 'en'
    const lang = req.query.lang || 'ar';
    try {
        // Use the service to get localized subcategories
        const subCategories = yield subCategory_service_1.subCategoryService.getSubCategories(lang);
        // Send back a success response with the fetched subcategories
        res.status(http_status_1.default.OK).json({
            message: 'Subcategories successfully fetched',
            data: subCategories,
        });
    }
    catch (error) {
        // Send back an error response
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred', error: error.message });
    }
}));
const getSubCategoryByCategoryIdController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract language preference from request query or default to 'en'
    const lang = req.query.lang || 'ar';
    const { categoryId } = req.params;
    try {
        // Use the service to get localized subcategories
        const subCategories = yield subCategory_service_1.subCategoryService.getSubCategoriesByCategoryId(lang, categoryId);
        // Send back a success response with the fetched subcategories
        res.status(http_status_1.default.OK).json({
            message: 'Subcategories successfully fetched',
            data: subCategories,
        });
    }
    catch (error) {
        // Send back an error response
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred', error: error.message });
    }
}));
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
exports.SubCategoryController = {
    createSubCategoryController,
    getSubCategoryController,
    getSubCategoryByCategoryIdController
    // deleteSubCategoryController,
    // editSubCategoryController
};
