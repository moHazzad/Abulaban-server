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
exports.categoryService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
// import { TMainCategory } from './Category.interface';
// import { MainCategoryModel } from './Category.model';
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const Category_model_1 = require("./Category.model");
// import { LanguageKey } from '../room/room.interface';
const validateCategoryData = (data) => {
    // Validate that both 'en' and 'ar' fields are present and not empty
    if (!data.Name.en || !data.Name.ar) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Both English and Arabic names are required.');
    }
    if (data.Name.en.trim().length === 0 || data.Name.ar.trim().length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Both English and Arabic names must be non-empty strings.');
    }
};
// create category 
const createCategoryDb = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const Category = yield Category_model_1.CategoryModel.create([categoryData], {
            session,
        });
        if (!Category) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create category');
        }
        yield session.commitTransaction();
        return Category;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        if (err instanceof AppError_1.default) {
            throw err;
        }
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create category due to an unexpected error.');
    }
    finally {
        yield session.endSession();
    }
});
/**
 * Get a main category by ID.
 */
const getCategoryFromDb = (lang) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_model_1.CategoryModel.find().lean();
    if (!categories.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No categories found');
    }
    const localizedCategories = categories.map((category) => {
        // Return a new object for each category, with the Name field localized
        return Object.assign(Object.assign({}, category), { Name: category.Name[lang] || category.Name.en });
    });
    return localizedCategories;
});
/**
 * Edit a main category by ID.
 */
const editCategoryInDb = (categoryId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Validate the update data before proceeding
        validateCategoryData(updateData);
        const updatedCategory = yield Category_model_1.CategoryModel.findByIdAndUpdate(categoryId, { $set: updateData }, // Use $set to update fields explicitly
        { new: true, session, runValidators: true });
        if (!updatedCategory) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
        }
        yield session.commitTransaction();
        return updatedCategory;
    }
    catch (err) {
        yield session.abortTransaction();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Failed to update category due to an unexpected error: ${err.message}`);
    }
    finally {
        yield session.endSession();
    }
});
/**
 * Delete a main category by ID.
 */
const deleteCategoryFromDb = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const deletedCategory = yield Category_model_1.CategoryModel.findByIdAndDelete(categoryId, { session });
        if (!deletedCategory) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
        }
        yield session.commitTransaction();
        return deletedCategory;
    }
    catch (err) {
        yield session.abortTransaction();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Failed to delete category due to an unexpected error: ${err.message}`);
    }
    finally {
        yield session.endSession();
    }
});
exports.categoryService = {
    createCategoryDb,
    getCategoryFromDb,
    editCategoryInDb,
    deleteCategoryFromDb,
};
