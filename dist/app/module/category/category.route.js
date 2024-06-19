"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoute = void 0;
const express_1 = __importDefault(require("express"));
// import isAdmin from '../../midleware/isAdmin'
// import { USER_ROLE } from '../../conestants/user.contents'
const validateRequest_1 = require("../../midleware/validateRequest");
// import mainCategoryValidationSchema from './Category.validation'
const Category_controller_1 = require("./Category.controller");
const Category_validation_1 = __importDefault(require("./Category.validation"));
const router = express_1.default.Router();
router.get('/', Category_controller_1.categoryController.getCategoriesController);
router.post('/create', (0, validateRequest_1.validateRequest)(Category_validation_1.default), Category_controller_1.categoryController.createCategoryController);
router.put('/:categoryId', Category_controller_1.categoryController.editCategoryController);
router.delete('/:categoryId', Category_controller_1.categoryController.deleteCategoryController);
exports.categoryRoute = router;
