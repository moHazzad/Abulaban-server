import express from 'express'
import { USER_ROLE } from "../../conestants/user.contents"
import isAdmin from "../../midleware/isAdmin"
import { validateRequest } from "../../midleware/validateRequest"
import { createCategoryController } from "./category.controller"
import TRoomCategoryValidationSchema from './category.validation'



const router = express.Router()

router.post('/create', isAdmin(USER_ROLE.admin), validateRequest(TRoomCategoryValidationSchema), createCategoryController.createCategory )


export const CategoryRoute = router