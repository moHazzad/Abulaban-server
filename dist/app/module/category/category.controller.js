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
exports.categoryController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Category_service_1 = require("./Category.service");
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
// create category 
const createCategoryController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    //saving to db
    const result = yield Category_service_1.categoryService.createCategoryDb(req.body);
    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'category not created',
            data: res,
        });
    }
    else {
        res.status(200).json({
            success: true,
            message: 'category is created successfully',
            data: result,
        });
    }
}));
// get categories
const getCategoriesController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const languageParam = req.query.lang;
    const language = typeof languageParam === 'string' &&
        (languageParam === 'en' || languageParam === 'ar')
        ? languageParam
        : 'en';
    const result = yield Category_service_1.categoryService.getCategoryFromDb(language);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No category found.');
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: ' Successful',
            data: result,
        });
    }
}));
const editCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params; // Assuming the category ID is passed in the URL parameters
    const updateData = req.body; // Assuming the new category data is passed in the request body
    try {
        // Use the service to update the category
        const updatedCategory = yield Category_service_1.categoryService.editCategoryInDb(categoryId, updateData);
        // Send back a success response
        res.status(http_status_1.default.OK).json({
            message: 'Category successfully updated',
            data: updatedCategory,
        });
    }
    catch (error) {
        // Send back an error response
        if (error instanceof AppError_1.default) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            // Handle unexpected errors
            res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
const deleteCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params; // Assuming the category ID is passed in the URL parameters
    try {
        // Use the service to delete the category
        const deletedCategory = yield Category_service_1.categoryService.deleteCategoryFromDb(categoryId);
        // Send back a success response
        res.status(http_status_1.default.OK).json({
            message: 'Category successfully deleted',
            data: deletedCategory, // Optional: return deleted category details
        });
    }
    catch (error) {
        // Send back an error response
        if (error instanceof AppError_1.default) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            // Handle unexpected errors
            res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.categoryController = {
    createCategoryController,
    getCategoriesController,
    editCategoryController,
    deleteCategoryController,
    // getCategoryController
};
