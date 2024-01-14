"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_contents_1 = require("../../conestants/user.contents");
const isAdmin_1 = __importDefault(require("../../midleware/isAdmin"));
const validateRequest_1 = require("../../midleware/validateRequest");
const category_controller_1 = require("./category.controller");
const category_validation_1 = __importDefault(require("./category.validation"));
const router = express_1.default.Router();
router.post('/create', (0, isAdmin_1.default)(user_contents_1.USER_ROLE.admin), (0, validateRequest_1.validateRequest)(category_validation_1.default), category_controller_1.createCategoryController.createCategory);
exports.CategoryRoute = router;
