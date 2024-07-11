"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../midleware/validateRequest");
// import userValidationSchemaZod from "./user.validation";
const isAdmin_1 = __importDefault(require("../../midleware/isAdmin"));
const user_contents_1 = require("../../conestants/user.contents");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
// router.get('/', isAdmin(USER_ROLE.admin), createUserController.allUsers)
// router.get('/:userId', createUserController.singleUserById )
// router.put('/:userId', createUserController.updateSingleUser )
router.put('/update/:userId', (0, isAdmin_1.default)(user_contents_1.USER_ROLE.user, user_contents_1.USER_ROLE.admin, user_contents_1.USER_ROLE.super), user_controller_1.userController.updateSingleUserController);
router.get('/:userId', user_controller_1.userController.singleUserById);
router.post('/register', (0, validateRequest_1.validateRequest)(user_validation_1.RegisterSchema), user_controller_1.userController.registerUserController);
router.post('/login', (0, validateRequest_1.validateRequest)(user_validation_1.LoginSchema), user_controller_1.userController.loginUserController);
// router.post('/admins', validateRequest(userSchemaZod), userController.createAdminController )
// router.post('/moderators', isAdmin(USER_ROLE.admin), validateRequest(userSchemaZod), userController.createUserController )
// router.delete('/:userId', isAdmin(USER_ROLE.admin), createUserController.deleteSingleUser)
// router.get('/users/:userId/orders/total-price', createUserController.getOrderTotalPrice)
// router.get('/users/:userId/orders', createUserController.getSingleUserOrder)
// router.put('/users/:userId/orders', createUserController.addOrderToUserController)
// router.delete('/users/:userId', createUserController.deleteSingleUser )
exports.UserRoute = router;
