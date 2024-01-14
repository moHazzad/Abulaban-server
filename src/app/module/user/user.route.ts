import  express  from "express";
import { createUserController } from "./user.controller";
import { validateRequest } from "../../midleware/validateRequest";
import userValidationSchemaZod from "./user.validation";

const router = express.Router()

router.get('/', createUserController.allUsers)
router.get('/:userId', createUserController.singleUserById )
router.put('/:userId', createUserController.updateSingleUser )
router.post('/', validateRequest(userValidationSchemaZod), createUserController.createUser )
router.delete('/:userId', createUserController.deleteSingleUser)
// router.get('/users/:userId/orders/total-price', createUserController.getOrderTotalPrice)
// router.get('/users/:userId/orders', createUserController.getSingleUserOrder)
// router.put('/users/:userId/orders', createUserController.addOrderToUserController)
// router.delete('/users/:userId', createUserController.deleteSingleUser )

export const UserRoute = router