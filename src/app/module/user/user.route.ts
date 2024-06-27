import  express  from "express";
import {  userController } from "./user.controller";
import { validateRequest } from "../../midleware/validateRequest";
// import userValidationSchemaZod from "./user.validation";
import isAdmin from "../../midleware/isAdmin";
import { USER_ROLE } from "../../conestants/user.contents";
import  { LoginSchema, RegisterSchema } from "./user.validation";

const router = express.Router()

// router.get('/', isAdmin(USER_ROLE.admin), createUserController.allUsers)
// router.get('/:userId', createUserController.singleUserById )
// router.put('/:userId', createUserController.updateSingleUser )
router.post('/register', validateRequest(RegisterSchema), userController.registerUserController)
router.post('/login', validateRequest(LoginSchema), userController.loginUserController)
// router.post('/admins', validateRequest(userSchemaZod), userController.createAdminController )
// router.post('/moderators', isAdmin(USER_ROLE.admin), validateRequest(userSchemaZod), userController.createUserController )
// router.delete('/:userId', isAdmin(USER_ROLE.admin), createUserController.deleteSingleUser)
// router.get('/users/:userId/orders/total-price', createUserController.getOrderTotalPrice)
// router.get('/users/:userId/orders', createUserController.getSingleUserOrder)
// router.put('/users/:userId/orders', createUserController.addOrderToUserController)
// router.delete('/users/:userId', createUserController.deleteSingleUser )

export const UserRoute = router