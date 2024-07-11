"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../midleware/validateRequest");
const isAdmin_1 = __importDefault(require("../../midleware/isAdmin"));
const user_contents_1 = require("../../conestants/user.contents");
const order_validation_1 = require("./order.validation");
const order_controller_1 = require("./order.controller");
// import { bookingValidationSchema } from "./order.validation";
// import { createBookingController } from "./order.controller";
// import { USER_ROLE } from "../../conestants/user.contents";
// import isAdmin from "../../midleware/isAdmin";
const router = express_1.default.Router();
// router.get('/',isAdmin( USER_ROLE.admin), createBookingController.getAllBookingRooms )
// router.get('/:userEmail',isAdmin(USER_ROLE.admin, USER_ROLE.user), createBookingController.getSingleBookedRoom )
router.get('/:userId', (0, isAdmin_1.default)(user_contents_1.USER_ROLE.admin, user_contents_1.USER_ROLE.user), order_controller_1.orderController.getUserOrdersController);
router.get('/order/:orderId', order_controller_1.orderController.getOrderById);
router.post('/', (0, isAdmin_1.default)(user_contents_1.USER_ROLE.admin, user_contents_1.USER_ROLE.super, user_contents_1.USER_ROLE.user), (0, validateRequest_1.validateRequest)(order_validation_1.OrderSchema), order_controller_1.orderController.placeOrder);
// router.put('/:userId', createUserController.updateSingleUser )
// router.post('/', validateRequest(userValidationSchemaZod), createUserController.createUser )
// router.delete('/:userId', createUserController.deleteSingleUser)
// router.get('/users/:userId/orders/total-price', createUserController.getOrderTotalPrice)
// router.get('/users/:userId/orders', createUserController.getSingleUserOrder)
// router.put('/users/:userId/orders', createUserController.addOrderToUserController)
// router.delete('/users/:userId', createUserController.deleteSingleUser )
exports.orderRoute = router;
