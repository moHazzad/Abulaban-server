"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../midleware/validateRequest");
const subCategory_validation_1 = __importDefault(require("./subCategory.validation"));
const subCategory_controller_1 = require("./subCategory.controller");
// import isAdmin from '../../midleware/isAdmin'
// import { USER_ROLE } from '../../conestants/user.contents'
const router = express_1.default.Router();
router.get('/', subCategory_controller_1.SubCategoryController.getSubCategoryController);
router.get('/:categoryId', subCategory_controller_1.SubCategoryController.getSubCategoryByCategoryIdController);
router.post('/create', (0, validateRequest_1.validateRequest)(subCategory_validation_1.default), subCategory_controller_1.SubCategoryController.createSubCategoryController);
// router.put('/:categoryId', SubCategoryController.editSubCategoryController);
// router.delete('/:categoryId', SubCategoryController.deleteSubCategoryController )
exports.SubCategoryRoute = router;
