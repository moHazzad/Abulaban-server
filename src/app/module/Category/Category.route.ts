import express from 'express'
// import isAdmin from '../../midleware/isAdmin'
// import { USER_ROLE } from '../../conestants/user.contents'
import { validateRequest } from '../../midleware/validateRequest'
// import mainCategoryValidationSchema from './Category.validation'
import { categoryController } from './Category.controller'
import CategoryValidationSchema from './Category.validation'

const router = express.Router()

router.get('/', categoryController.getCategoriesController )
router.post('/create',  validateRequest(CategoryValidationSchema), categoryController.createCategoryController )
router.put('/:categoryId', categoryController.editCategoryController);
router.delete('/:categoryId', categoryController.deleteCategoryController )

export const categoryRoute = router