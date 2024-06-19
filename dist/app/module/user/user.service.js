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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const user_interface_1 = require("./user.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
// import AppError from "../../Error/errors/appError";
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 10);
});
const createUser = (userData, creatorRole) => __awaiter(void 0, void 0, void 0, function* () {
    // Hash password
    const hashedPassword = yield hashPassword(userData.passwordHash);
    // Check role validity
    if (userData.role !== user_interface_1.UserRole.User && creatorRole !== user_interface_1.UserRole.Admin) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only admins can assign elevated roles.");
    }
    const newUser = new user_model_1.UserModel(Object.assign(Object.assign({}, userData), { passwordHash: hashedPassword }));
    try {
        const savedUser = yield newUser.save();
        return savedUser;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `user is not create ${error.message}`);
    }
});
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
    const result = yield user_model_1.UserModel.aggregate([
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
const getSingleUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findById(userId); //finding by _id
    return result;
});
const updateUserInformation = (userId, updateInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const updateUserInfoPayload = __rest(updateInfo, []);
    const modifiedUpdatedData = Object.assign({}, updateUserInfoPayload);
    if (updateUserInformation && Object.keys(updateUserInformation).length) {
        for (const [key, value] of Object.entries(updateUserInformation)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    const result = yield user_model_1.UserModel.findOneAndUpdate({ _id: userId }, modifiedUpdatedData, { new: true, runValidators: true });
    return result;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedUser = yield user_model_1.UserModel.findByIdAndUpdate(userId, { isDeleted: true, isActive: false }, { new: true, session });
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
    createUser,
    getAllUserUserFromDb,
    getSingleUserById,
    updateUserInformation,
    deleteUser,
    // addOrderToUser,
    // getSingleUserOrderFromDb,
    // getSingleUserTotalPriceFromDb
};
