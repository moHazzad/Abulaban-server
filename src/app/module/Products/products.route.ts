import  express  from "express";
import { validateRequest } from "../../midleware/validateRequest";
import ProductValidationSchema from "./products.validation";
import { productController } from "./product.controller";

// import isAdmin from "../../midleware/isAdmin";
// import { USER_ROLE } from "../../conestants/user.contents";


const router = express.Router()

// router.get('/available',  createRoomController.availableRoomController)
// router.get('/search',  createRoomController.searchRoomController)
router.get('/:productId',  productController.getSingleProductController)
router.get('/',  productController.getProductsController )
router.get('/category/:categoryId', productController.getProductsByCategoryController);
router.get('/subCategory/:subCategoryId', productController.getProductsBySubCategoryIdController);
router.get('/brand/:brandId', productController.getProductsByBrandIdController);
router.post('/create',  validateRequest(ProductValidationSchema), productController.createProductController )
// router.put('/:id',  productController.updateProductController)
// router.delete('/delete/:id',  productController.DeleteProductController)
// router.delete('/:id', isAdmin(USER_ROLE.admin), createRoomController.deleteSingleRoom)


export const productRoute = router