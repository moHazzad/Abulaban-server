import express from 'express'
// import isAdmin from '../../midleware/isAdmin'
// import { USER_ROLE } from '../../conestants/user.contents'
import { validateRequest } from '../../midleware/validateRequest'
import mainCategoryValidationSchema from './mainCategory.validation'
import { createMainCategoryController } from './mainCategory.controller'

const router = express.Router()

router.get('/', createMainCategoryController.getMainCategoryController )
router.post('/create',  validateRequest(mainCategoryValidationSchema), createMainCategoryController.createMainCategory )
router.put('/:categoryId', createMainCategoryController.editCategoryController);
router.delete('/:categoryId', createMainCategoryController.deleteCategoryController )

export const MainCategoryRoute = router