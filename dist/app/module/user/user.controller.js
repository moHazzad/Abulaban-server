"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// import { UserRole } from "./user.interface";
// import userValidationSchemaZod from "./user.validation";
const registerUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, 'register');
    try {
        const result = yield user_service_1.userService.register(req.body);
        res.status(200).json({
            success: true,
            message: 'User created successfully',
            data: result,
        });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `User not created: ${error.message}`);
    }
}));
const loginUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.userService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: result,
        });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Filed to login: ${error.message}`);
    }
}));
const singleUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (req.params.userId);
    const user = yield user_service_1.userService.singleUser(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user is not found');
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Single User found Successfully',
            data: user,
        });
    }
}));
// update user info 
const updateSingleUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // getting user id to find the exect user and the body of update info 
    const userId = (req.params.userId);
    const updateInfo = req.body;
    console.log(updateInfo, 'data ');
    console.log(userId, 'isss');
    const updateUser = yield user_service_1.userService.updateSingleUser(userId, updateInfo);
    if (!updateUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid user Id or Update Information");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Update Successful',
            data: updateUser
        });
    }
}));
// const createAdminController  = catchAsync(async(req: Request, res: Response) =>{
//     // const user = req.body
//     //saving to db
//     try {
//       const result = await userService.createUser(req.body, UserRole.Admin);
//       res.status(200).json({
//         success: true,
//         message: 'user is created successfully',
//         data: result,
//       });
//     } catch (error: any) {
//       throw new AppError( httpStatus.BAD_REQUEST,`user is not create ${error.message}`)
//     }
// })
// const allUsers = catchAsync(async(req: Request, res: Response)=>{
//         const users = await userService.getAllUserUserFromDb()
//         if (!users) {
//             return res
//               .status(404)
//               .json({ success: false, message: 'No users found' });
//           } else {
//             res.status(200).json({
//               success: true,
//               message: 'users data are retrieved',
//               data: users,
//             });
//           }
// })
// const deleteSingleUser = catchAsync(async (req: Request, res:Response) => {
//   const userId = req.params.userId
//   const result = await userService.deleteUser(userId)
//       if (!result) {
//         throw new AppError(
//           httpStatus.NOT_FOUND,
//           'No user with given ID was found.'
//         )
//       } else {
//           sendResponse(res,{
//             statusCode: httpStatus.OK,
//             success: true,
//             message:"Delete Successfull",
//             data: null
//           }
//           )
//       }
// })
// const addOrderToUserController = async(req: Request, res:Response)=>{
//     const userId = parseInt(req.params.userId)
//     const order = req.body;
//     //console.log('order',order)
//     try {
//         const  result=await userService.addOrderToUser(userId,order)
//         if (!result) {
//             return res
//               .status(404)
//               .json({ 
//                 success: false,
//                 message: 'No user found',
//                 error:{
//                     code: 404,
//                     details:"The user with the given id was not found."                    
//                 }
//              });
//           } else {
//             res.status(200).json({
//               success: true,
//               message: 'Order placed successfully',
//               data: null,
//             });
//           }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             success: false, 
//             message: 'Error in user or some other', 
//             error: err
//          });
//     }
// }
// const getSingleUserOrder = async(req:Request, res:Response)=>{
//     const userId = parseInt(req.params.userId)
//     try {
//         const users = await userService.getSingleUserOrderFromDb(userId)
//         if (!users) {
//             return res
//               .status(404)
//               .json({ success: false, message: 'No users found' });
//           } else {
//             res.status(200).json({
//               success: true,
//               message: 'users order data are retrieved',
//               data: users,
//             });
//           }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             success: false, 
//             message: 'Error in retrieving user order', 
//             error: err
//          });
//     }
// }
// const getOrderTotalPrice = async(req:Request, res:Response)=>{
//     const userId = parseInt(req.params.userId)
//     try {
//         const users = await userService.getSingleUserTotalPriceFromDb(userId)
//         if (!users) {
//             return res
//               .status(404)
//               .json({ success: false, message: 'No users found' });
//           } else {
//             res.status(200).json({
//               success: true,
//               message: 'users order data are retrieved',
//               data: users,
//             });
//           }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             success: false, 
//             message: 'Error in retrieving user order', 
//             error: err
//          });
//     }
// }
exports.userController = {
    // createUser,
    registerUserController,
    loginUserController,
    singleUserById,
    updateSingleUserController
    // allUsers,
    // updateSingleUser,
    // deleteSingleUser,
    // addOrderToUserController,
    // getSingleUserOrder,
    // getOrderTotalPrice
};
