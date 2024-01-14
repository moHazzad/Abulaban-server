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
const router = express_1.default.Router();
router.get('/', user_controller_1.createUserController.allUsers);
router.get('/:userId', user_controller_1.createUserController.singleUserById);
router.put('/:userId', user_controller_1.createUserController.updateSingleUser);
router.post('/', (0, validateRequest_1.validateRequest)(user_validation_1.default), user_controller_1.createUserController.createUser);
router.delete('/:userId', user_controller_1.createUserController.deleteSingleUser);
// router.get('/users/:userId/orders/total-price', createUserController.getOrderTotalPrice)
// router.get('/users/:userId/orders', createUserController.getSingleUserOrder)
// router.put('/users/:userId/orders', createUserController.addOrderToUserController)
// router.delete('/users/:userId', createUserController.deleteSingleUser )
exports.UserRoute = router;
