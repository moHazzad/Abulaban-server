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
exports.brandService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const brand_model_1 = require("./brand.model");
const createBrandService = (brandData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const result = yield brand_model_1.BrandModel.create([brandData], {
            session,
        });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Brand');
        }
        yield session.commitTransaction();
        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        let errorMessage = 'Failed to create Brand due to an unexpected error.';
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            errorMessage = `Validation error: ${err.message}`;
        }
        else if (err instanceof mongoose_1.default.Error) {
            errorMessage = `Database error: ${err.message}`;
        }
        else if (err.code && err.code === 11000) {
            errorMessage =
                'Database error: Duplicate key error, such an brand already exists.';
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
//   get all brans
const getBrandNames = (lang) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield brand_model_1.BrandModel.find().lean();
    if (!brands.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No brands found');
    }
    // Extract the names in the specified language
    // Extract the _id and names in the specified language
    const brandNames = brands.map((brand) => ({
        _id: brand._id,
        Name: brand.Name[lang],
        image: brand.image
    }));
    return brandNames;
});
// single brand get 
const getBrandById = (id, lang) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield brand_model_1.BrandModel.findById(id).lean();
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand not found');
    }
    return {
        _id: brand._id,
        Name: brand.Name[lang]
    };
});
exports.brandService = {
    createBrandService,
    getBrandNames,
    getBrandById
};
