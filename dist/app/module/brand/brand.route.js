"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../midleware/validateRequest");
const brand_validation_1 = __importDefault(require("./brand.validation"));
const brand_controller_1 = require("./brand.controller");
const router = express_1.default.Router();
router.get('/', brand_controller_1.BrandController.getBrands);
router.get('/:id', brand_controller_1.BrandController.getSingleBrand);
router.post('/create', (0, validateRequest_1.validateRequest)(brand_validation_1.default), brand_controller_1.BrandController.createBrand);
// router.put('/:categoryId', createMainCategoryController.editCategoryController);
// router.delete('/:categoryId', createMainCategoryController.deleteCategoryController )
exports.BrandRoute = router;
