"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../midleware/validateRequest");
const products_validation_1 = __importDefault(require("./products.validation"));
const product_controller_1 = require("./product.controller");
// import isAdmin from "../../midleware/isAdmin";
// import { USER_ROLE } from "../../conestants/user.contents";
const router = express_1.default.Router();
router.get('/', product_controller_1.productController.getProductsByParamsController);
router.get('/items', product_controller_1.productController.getProductsController);
router.get('/search', product_controller_1.productController.searchProductsController);
// router.get('/available',  createRoomController.availableRoomController)
router.get('/:productId', product_controller_1.productController.getSingleProductController);
router.get('/category/:categoryId', product_controller_1.productController.getProductsByCategoryController);
router.get('/subCategory/:subCategoryId', product_controller_1.productController.getProductsBySubCategoryIdController);
router.get('/brand/:brandId', product_controller_1.productController.getProductsByBrandIdController);
router.post('/create', (0, validateRequest_1.validateRequest)(products_validation_1.default), product_controller_1.productController.createProductController);
// router.put('/:id',  productController.updateProductController)
// router.delete('/delete/:id',  productController.DeleteProductController)
// router.delete('/:id', isAdmin(USER_ROLE.admin), createRoomController.deleteSingleRoom)
exports.productRoute = router;
