import express from 'express'
import { validateRequest } from '../../midleware/validateRequest'
import TSubCategorySchema from './subCategory.validation'
import { SubCategoryController } from './subCategory.controller'
// import isAdmin from '../../midleware/isAdmin'
// import { USER_ROLE } from '../../conestants/user.contents'


const router = express.Router()

router.get('/', SubCategoryController.getSubCategoryController )
router.post('/create',  validateRequest(TSubCategorySchema), SubCategoryController.createSubCategoryController )
// router.put('/:categoryId', SubCategoryController.editSubCategoryController);
// router.delete('/:categoryId', SubCategoryController.deleteSubCategoryController )

export const SubCategoryRoute = router