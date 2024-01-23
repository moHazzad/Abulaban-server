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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const category_model_1 = require("./category.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createCategoryDb = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const rooms = yield category_model_1.CategoryModel.create([categoryData], { session });
        if (!rooms) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create category');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return rooms;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        if (err instanceof AppError_1.default) {
            throw err;
        }
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create category due to an unexpected error.');
    }
});
const getCategoryFromDb = (language) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const category = yield category_model_1.CategoryModel.find().lean();
        // Map over each room and construct a new object with the desired structure
        const categoryLocalizedRooms = category.map((singleCategory) => ({
            id: singleCategory._id,
            title: singleCategory.categoryTitle[language],
        }));
        yield session.commitTransaction();
        yield session.endSession();
        return categoryLocalizedRooms;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        if (err instanceof AppError_1.default) {
            throw err;
        }
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to find category due to an unexpected error.');
    }
});
exports.categoryService = {
    createCategoryDb,
    getCategoryFromDb,
};
