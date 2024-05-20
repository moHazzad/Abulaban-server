import express from 'express'
import { validateRequest } from '../../midleware/validateRequest'
import brandValidationSchema from './brand.validation'
import { BrandController } from './brand.controller'

const router = express.Router()

router.get('/', BrandController.getBrands )
router.get('/:id', BrandController.getSingleBrand )
router.post('/create',  validateRequest(brandValidationSchema), BrandController.createBrand )
// router.put('/:categoryId', createMainCategoryController.editCategoryController);
// router.delete('/:categoryId', createMainCategoryController.deleteCategoryController )

export const BrandRoute = router