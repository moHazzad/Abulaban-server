import express  from "express";
// import { authUserController } from "./auth.controller";
// import { validateRequest } from "../../midleware/validateRequest";
// // import userValidationSchemaZod from "../user/user.validation";
// import { AuthValidation } from "./auth.validation";
// import isAdmin from "../../midleware/isAdmin";
// import { USER_ROLE } from "../../conestants/user.contents";

const router = express.Router()

// router.post('/resister',validateRequest(AuthValidation.registerValidationSchema), authUserController.resister )
// router.post('/login',validateRequest(AuthValidation.loginValidationSchema), authUserController.login)
// router.post('/refresh-token', validateRequest(AuthValidation.refreshTokenValidationSchema), authUserController.refreshToken );
// router.post('/forget-password', validateRequest(AuthValidation.forgetPasswordValidationSchema), authUserController.forgetPassword );
// router.post('/reset-password', validateRequest(AuthValidation.resetPasswordValidationSchema), authUserController.resetPassword );
// router.patch('/changePassword', isAdmin(USER_ROLE.admin, USER_ROLE.user) ,validateRequest(AuthValidation.changePasswordValidationSchema), authUserController.login)

export const authRoutes = router