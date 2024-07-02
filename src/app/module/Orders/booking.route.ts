import  express  from "express";
import { validateRequest } from "../../midleware/validateRequest";
import isAdmin from "../../midleware/isAdmin";
import { USER_ROLE } from "../../conestants/user.contents";
import { OrderSchema } from "./order.validation";
import { orderController } from "./order.controller";
// import { bookingValidationSchema } from "./order.validation";
// import { createBookingController } from "./order.controller";
// import { USER_ROLE } from "../../conestants/user.contents";
// import isAdmin from "../../midleware/isAdmin";


const router = express.Router()

// router.get('/',isAdmin( USER_ROLE.admin), createBookingController.getAllBookingRooms )
// router.get('/:userEmail',isAdmin(USER_ROLE.admin, USER_ROLE.user), createBookingController.getSingleBookedRoom )
router.get('/:userId', isAdmin(USER_ROLE.admin, USER_ROLE.user), orderController.getUserOrdersController )
router.get('/order/:orderId', orderController.getOrderById )
router.post('/', isAdmin(USER_ROLE.admin, USER_ROLE.super ,USER_ROLE.user), validateRequest(OrderSchema), orderController.placeOrder)
// router.put('/:userId', createUserController.updateSingleUser )
// router.post('/', validateRequest(userValidationSchemaZod), createUserController.createUser )
// router.delete('/:userId', createUserController.deleteSingleUser)
// router.get('/users/:userId/orders/total-price', createUserController.getOrderTotalPrice)
// router.get('/users/:userId/orders', createUserController.getSingleUserOrder)
// router.put('/users/:userId/orders', createUserController.addOrderToUserController)
// router.delete('/users/:userId', createUserController.deleteSingleUser )

export const orderRoute = router