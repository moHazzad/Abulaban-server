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
exports.BrandController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const brand_service_1 = require("./brand.service");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const zod_1 = require("zod");
const createBrand = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    //saving to db
    //   const result = await brandService.createBrandService(req.body);
    try {
        const result = yield brand_service_1.brandService.createBrandService(req.body);
        if (!result) {
            return next(new AppError_1.default(404, 'Brand not created'));
        }
        res.status(200).json({
            success: true,
            message: 'Brand is created successfully',
            data: result,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const validationErrors = error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return res.status(400).json({
                status: 'error',
                message: 'Validation error',
                errors: validationErrors,
            });
        }
        next(error); // Pass the error to the global error handler
    }
}));
const getBrands = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { lang } = req.query;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        // Use the service to update the category
        const brands = yield brand_service_1.brandService.getBrandNames(lang);
        // Send back a success response
        res.status(http_status_1.default.OK).json({
            message: 'brand successfully retrieve',
            data: brands,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        // Send back an error response
        if (error instanceof AppError_1.default) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            next(error);
        }
    }
});
// single brand name
const getSingleBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { lang } = req.query;
    // Set default language to 'ar' if not provided or invalid
    if (lang !== 'en' && lang !== 'ar') {
        lang = 'ar';
    }
    try {
        const brand = yield brand_service_1.brandService.getBrandById(id, lang);
        res.status(http_status_1.default.OK).json({
            message: 'Brand successfully retrieved',
            data: brand,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        next(error);
    }
});
exports.BrandController = {
    createBrand,
    getBrands,
    getSingleBrand,
};
