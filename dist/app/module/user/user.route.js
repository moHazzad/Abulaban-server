"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../midleware/validateRequest");
const user_validation_1 = __importDefault(require("./user.validation"));
const isAdmin_1 = __importDefault(require("../../midleware/isAdmin"));
const user_contents_1 = require("../../conestants/user.contents");
const router = express_1.default.Router();
router.get('/', (0, isAdmin_1.default)(user_contents_1.USER_ROLE.admin), user_controller_1.createUserController.allUsers);
router.get('/:userId', user_controller_1.createUserController.singleUserById);
router.put('/:userId', user_controller_1.createUserController.updateSingleUser);
router.post('/', (0, validateRequest_1.validateRequest)(user_validation_1.default), user_controller_1.createUserController.createUser);
router.delete('/:userId', (0, isAdmin_1.default)(user_contents_1.USER_ROLE.admin), user_controller_1.createUserController.deleteSingleUser);
// router.get('/users/:userId/orders/total-price', createUserController.getOrderTotalPrice)
// router.get('/users/:userId/orders', createUserController.getSingleUserOrder)
// router.put('/users/:userId/orders', createUserController.addOrderToUserController)
// router.delete('/users/:userId', createUserController.deleteSingleUser )
exports.UserRoute = router;
