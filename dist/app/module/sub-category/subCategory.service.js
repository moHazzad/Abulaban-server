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
exports.subCategoryService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const subCategory_model_1 = require("./subCategory.model");
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// import { PopulatedSubCategory } from '../Category/Category.interface';
// import { LanguageKey } from '../room/room.interface';
// import { Types } from "mongoose";
// const createSubCategoryDb = async (categoryData: TSubCategory) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const subCategory = await SubCategoryModel.create([categoryData], {
//       session,
//     });
//     if (!subCategory) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create category');
//     }
//     await session.commitTransaction();
//     return subCategory;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     await session.abortTransaction();
//     if (err instanceof AppError) {
//       throw err;
//     }
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Failed to create category due to an unexpected error.',
//     );
//   } finally {
//     await session.endSession();
//   }
// };
const createSubCategoryDb = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const subCategory = yield subCategory_model_1.SubCategoryModel.create([categoryData], { session });
        if (!subCategory) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create category: No document returned.');
        }
        yield session.commitTransaction();
        return subCategory;
    }
    catch (err) {
        yield session.abortTransaction();
        let errorMessage = 'Failed to create category due to an unexpected error.';
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            errorMessage = `Validation error: ${err.message}`;
        }
        else if (err instanceof mongoose_1.default.Error) {
            errorMessage = `Database error: ${err.message}`;
        }
        else if (err.code && err.code === 11000) {
            errorMessage = 'Database error: Duplicate key error, such an item already exists.';
        }
        if (err instanceof AppError_1.default) {
            throw err;
        }
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, errorMessage);
    }
    finally {
        yield session.endSession();
    }
});
// const getSubCategory = async (lang: LanguageKey): Promise<PopulatedSubCategory[]> => {
// const getSubCategory = async (lang: LanguageKey) => {
//   const subCategories = await SubCategoryModel.find()
//       .populate({
//           path: 'CategoryId',
//           select: `Name.${lang} Name.ar`,
//       })
//       .lean();
//   if (!subCategories.length) {
//       throw new AppError(httpStatus.NOT_FOUND, 'No subcategories found');
//   }
//   return subCategories.map(subCategory => {
//     // Asserting the type of ParentCategory post-population
//     const populatedCategory = subCategory.CategoryId
//     return localizedSubCategory;
//   });
// };
const getSubCategories = (lang) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch subcategories and populate CategoryId
    const subCategories = yield subCategory_model_1.SubCategoryModel.find()
        .populate({
        path: 'CategoryId',
        select: `Name.${lang} Name.ar image`,
    })
        .lean();
    if (!subCategories.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No subcategories found');
    }
    // Map over subcategories and return localized fields
    return subCategories.map(subCategory => {
        const populatedCategory = subCategory.CategoryId;
        return {
            _id: subCategory._id,
            Name: subCategory.Name[lang],
            image: subCategory.image,
            Category: {
                _id: populatedCategory._id,
                Name: populatedCategory.Name[lang],
                image: populatedCategory.image,
            }
        };
    });
});
const getSingleSubCategoryById = (subCategoryId, lang) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch subcategory and populate CategoryId
    const subCategory = yield subCategory_model_1.SubCategoryModel.findById(subCategoryId)
        .populate({
        path: 'CategoryId',
        select: `Name.${lang} Name.ar image`,
    })
        .lean();
    if (!subCategory) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No subcategory found');
    }
    // Map over subcategory and return localized fields
    const populatedCategory = subCategory.CategoryId;
    return {
        _id: subCategory._id,
        Name: subCategory.Name[lang],
        image: subCategory.image,
        Category: {
            _id: populatedCategory._id,
            Name: populatedCategory.Name[lang],
            image: populatedCategory.image,
        }
    };
});
// get subcategoris by category id 
const getSubCategoriesByCategoryId = (lang, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch subcategories and populate CategoryId
    const subCategories = yield subCategory_model_1.SubCategoryModel.find({ CategoryId: categoryId })
        .populate({
        path: 'CategoryId',
        select: `Name.${lang} Name.ar image`,
    })
        .lean();
    if (!subCategories.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No subcategories found');
    }
    // Map over subcategories and return localized fields
    return subCategories.map(subCategory => {
        const populatedCategory = subCategory.CategoryId;
        return {
            _id: subCategory._id,
            Name: subCategory.Name[lang],
            image: subCategory.image,
            Category: {
                _id: populatedCategory._id,
                Name: populatedCategory.Name[lang],
                image: populatedCategory.image,
            }
        };
    });
});
// const deleteSubCategory = async (categoryId: string): Promise<void> => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(
//       categoryId,
//       { session },
//     );
//     if (!deletedSubCategory) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
//     }
//     await session.commitTransaction();
//   } catch (err: any) {
//     await session.abortTransaction();
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `Failed to delete category due to an unexpected error: ${err.message}`,
//     );
//   } finally {
//     await session.endSession();
//   }
// };
// const editSubCategory = async  (id: string, categoryTitle: LocalizedString ) => {
//   // Validate input
//   if (!id || !categoryTitle || !categoryTitle.en || !categoryTitle.ar) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields.');
//   }
//   const existingSubCategory = await SubCategoryModel.findById(id);
//   if (!existingSubCategory) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Subcategory not found.');
//   }
//   // Check for duplicate category titles in English
//   const duplicate = await SubCategoryModel.findOne({
//     _id: { $ne: id }, // Exclude current subcategory from the search
//     'categoryTitle.en': categoryTitle.en,
//   });
//   if (duplicate) {
//     throw new AppError(httpStatus.BAD_REQUEST, `A category with the English title '${categoryTitle.en}' already exists.`);
//   }
//   // Check for duplicate category titles in Arabic
//   const duplicateAr = await SubCategoryModel.findOne({
//     _id: { $ne: id }, // Exclude current subcategory from the search
//     'categoryTitle.ar': categoryTitle.ar,
//   });
//   if (duplicateAr) {
//     throw new AppError(httpStatus.BAD_REQUEST, `A category with the Arabic title '${categoryTitle.ar}' already exists.`);
//   }
//   // Update subcategory
//   existingSubCategory.categoryTitle = categoryTitle;
//   await existingSubCategory.save();
//   return existingSubCategory;
// }
exports.subCategoryService = {
    createSubCategoryDb,
    getSubCategories,
    getSubCategoriesByCategoryId,
    getSingleSubCategoryById
    // deleteSubCategory,
    // editSubCategory
};
