"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get('/users', user_controller_1.createUserController.allUsers);
router.get('/users/:userId', user_controller_1.createUserController.singleUserById);
router.put('/users/:userId', user_controller_1.createUserController.updateSingleUser);
router.get('/users/:userId/orders/total-price', user_controller_1.createUserController.getOrderTotalPrice);
router.get('/users/:userId/orders', user_controller_1.createUserController.getSingleUserOrder);
router.put('/users/:userId/orders', user_controller_1.createUserController.addOrderToUserController);
router.delete('/users/:userId', user_controller_1.createUserController.deleteSingleUser);
router.post('/users', user_controller_1.createUserController.createUser);
exports.UserRoute = router;
