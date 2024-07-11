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
exports.userService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { UserModel } from './user.model';
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const user_model_1 = __importDefault(require("./user.model"));
// import { LoginInput } from './user.validation';
const jwtHelper_1 = require("../../helper/jwtHelper");
const config_1 = __importDefault(require("../../config"));
// import AppError from "../../Error/errors/appError";
// const hashPassword = async (password: string) => {
//   return await bcrypt.hash(password, 10);
// };
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.findOne({
        'profile.email': userData.profile.email,
    });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Email already in use');
    }
    const user = new user_model_1.default(Object.assign(Object.assign({}, userData), { password: userData.password, profile: userData.profile }));
    try {
        const savedUser = yield user.save();
        return savedUser;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `User not created: ${error.message}`);
    }
});
const login = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ 'profile.email': loginData.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    if (user.isDelete === true) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user account has been deleted');
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(loginData.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    const token = jwtHelper_1.jwtHelpers.createToken({
        id: user._id,
        name: user.profile.firstName,
        phone: user.profile.phone,
        email: user.profile.email,
        role: user.role,
    }, config_1.default.jwt_access_token, // Use the imported configuration value
    { expiresIn: config_1.default.jwt_access_expires_in });
    return { token };
});
const singleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.default.findOne({ _id: userId, isDelete: false });
        return result;
    }
    catch (error) {
        console.error('Error finding user by ID:', error);
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
});
// const updateSingleUser = async (userId: string, updateData: Partial<User>) => {
//   try {
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }
//    // Update only the fields provided in the updateData
//    Object.keys(updateData).forEach((key) => {
//      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//      // @ts-ignore
//     if (updateData[key] !== undefined) {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       user[key] = updateData[key];
//     }
//   });
//     await user.save();
//     return user;
//   } catch (error:any) {
//     throw new AppError(httpStatus.BAD_REQUEST, `Unable to update user ${error.message}`);
//   }
// };
const updateSingleUser = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        // Update only the fields provided in the updateData
        for (const key of Object.keys(updateData)) {
            // Check if the updateData key is an object (like profile or shippingAddress)
            if (typeof updateData[key] === 'object' && !Array.isArray(updateData[key]) && updateData[key] !== null) {
                // Update nested fields
                for (const nestedKey of Object.keys(updateData[key])) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    user[key][nestedKey] = updateData[key][nestedKey];
                }
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                user[key] = updateData[key];
            }
        }
        yield user.save();
        return user;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Unable to update user ${error.message}`);
    }
});
// const createUser = async (userData: User, creatorRole: UserRole) => {
//   // Hash password
//   const hashedPassword = await hashPassword(userData.passwordHash);
//   // Check role validity
//   if (userData.role !== UserRole.User && creatorRole !== UserRole.Admin) {
//     throw new AppError(httpStatus.FORBIDDEN, "Only admins can assign elevated roles.");
//   }
//   const newUser = new UserModel({
//     ...userData,
//     passwordHash: hashedPassword
//   });
//   try {
//     const savedUser = await newUser.save();
//     return savedUser;
//   } catch (error: any) {
//     throw new AppError( httpStatus.BAD_REQUEST,`user is not create ${error.message}`)
//   }
// };
// <-------- end------>
// const createUser  = async (userData: User) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
// // Hash password
//     const hashedPassword = await bcrypt.hash(userData.passwordHash, 10);
//     // Prepare new user document
//     const userDocument = new UserModel({
//       ...userData,
//       passwordHash: hashedPassword
//     });
//     try {
//       const savedUser = await userDocument.save();
//     await session.commitTransaction();
//     await session.endSession();
//     return savedUser;
//   } catch (err: any) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError( httpStatus.BAD_REQUEST,`user is not create ${err.message}`)
//   }finally {
//     session.endSession();
//   }
// };
// //  retrieve all user with specific field
const getAllUserUserFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.aggregate([
        {
            $addFields: {
                fullName: { $concat: ['$firstName', ' ', '$lastName'] },
            },
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                email: 1,
                role: 1,
                isActive: 1,
            },
        },
    ]);
    return result;
});
// const getSingleUserById = async (userId: string) => {
//   const result = await UserModel.findById(userId); //finding by _id
//   return result;
// };
// const updateUserInformation = async (
//   userId: string,
//   updateInfo: Partial<User>,
// ) => {
//   const { ...updateUserInfoPayload } = updateInfo;
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...updateUserInfoPayload,
//   };
//   if (updateUserInformation && Object.keys(updateUserInformation).length) {
//     for (const [key, value] of Object.entries(updateUserInformation)) {
//       modifiedUpdatedData[`name.${key}`] = value;
//     }
//   }
//   const result = await UserModel.findOneAndUpdate(
//     { _id: userId },
//     modifiedUpdatedData,
//     { new: true, runValidators: true },
//   );
//   return result;
// };
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedUser = yield user_model_1.default.findByIdAndUpdate(userId, { isDeleted: true, isActive: false }, { new: true, session });
        if (!deletedUser) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete user');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedUser;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error('Failed to delete user');
    }
});
// // order
// // add order to the user
// const addOrderToUser = async (userId:number,orderData:object  )=>{
//     const user = await getSingleUserById(userId);
//     // Check if user is not null
//     if (!user) {
//         throw new Error('User not found');
//     }
//     if (!user.orders) {
//         user.orders = [];
//     }
//     user.orders.push(orderData);
//     // Save the updated user
//     await user.save();
//     return user;
// }
// const getSingleUserOrderFromDb =async (userId: number) => {
//     const user = await getSingleUserById(userId);
//     if (!user) {
//         return user
//     } else{
//         if (!user?.orders || user?.orders?.length === 0) {
//         // if the orders array is empty
//         return;
//     }
//     return user.orders;
//     }
// }
// const getSingleUserTotalPriceFromDb = async(userId:number)=>{
//     const userOrders = await getSingleUserOrderFromDb(userId);
//     // Check if userOrders is an array (which means there are orders) or an object with a 'message' key (no orders or user not found)
//     if (Array.isArray(userOrders)) {
//         const totalPrice = userOrders.reduce((sum, order) => sum + (order.price || 0), 0);
//         return { totalPrice };
//     } else {
//         // Return the message from getSingleUserOrderFromDb (no orders or user not found)
//         return userOrders;
//     }
// }
exports.userService = {
    // createUserInDb,
    register,
    login,
    getAllUserUserFromDb,
    singleUser,
    updateSingleUser,
    deleteUser,
    // addOrderToUser,
    // getSingleUserOrderFromDb,
    // getSingleUserTotalPriceFromDb
};
