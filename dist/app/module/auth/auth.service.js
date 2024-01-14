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
exports.authUserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { TUser } from '../user/user.interface';
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("./auth.utils");
const sendEmail_1 = require("../../utils/sendEmail");
// import { createToken } from './auth.utils';
// import { json } from 'express';
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.create(Object.assign(Object.assign({}, user), { role: 'user' }));
    return result;
});
// const login = async (loginData: TLogin) => {
//   console.log(loginData);
//   const { email, password } = loginData;
//   // const user = await User.findOne({ email: payload.email }).select('+password') // we can use select if password field not in the db
//   const user = await UserModel.findOne({ email }).select('+password');
//   // console.log(user);
//   if (!user) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials');
//   }
//   // Compare provided password with the hashed password in the database
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials');
//   }
//   const isDeleted = user?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
//   }
//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//   };
//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_token as string,
//     config.jwt_access_expires_in as string,
//   );
//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_token as string,
//     config.jwt_refresh_expires_in as string,
//   );
//    return {
//     accessToken,
//     refreshToken
//    }
// };
const login = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData.body;
    const user = yield user_model_1.UserModel.findOne({ email }).select('+password');
    if (!user || user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid credentials');
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid credentials');
    }
    const jwtPayload = { email: user.email, role: user.role };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token, config_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_token);
    const { email } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // // checking if the user is blocked
    // const userStatus = user?.status;
    // if (userStatus === 'blocked') {
    //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    // }
    // if (
    //   user.passwordChangedAt &&
    //   User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
    // ) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    // }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const changePasswordService = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the user with the password field
    const user = yield user_model_1.UserModel.findOne({ _id: userData._id }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    // Compare provided old password with the hashed password in the database
    const isPasswordValid = yield bcrypt_1.default.compare(payload.oldPassword, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid old password');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted');
    }
    // Hash the new password
    const hashedNewPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    // Update the user document with the new password
    user.password = hashedNewPassword;
    user.passwordChangedAt = new Date();
    yield user.save();
    return { message: 'Password changed successfully' };
});
const forgetPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email);
    // checking if the user is exist
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    // const userStatus = user?.status;
    // if (userStatus === 'blocked') {
    //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    // }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token, '10m');
    const resetUILink = `${config_1.default.reset_pass_ui_link}?id=${user.email}&token=${resetToken} `;
    (0, sendEmail_1.sendEmail)(user.email, resetUILink);
    console.log(resetUILink);
});
const resetPasswordService = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = payload;
    console.log(email);
    // checking if the user is exist
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // // checking if the user is blocked
    // const userStatus = user?.status;
    // if (userStatus === 'blocked') {
    //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    // }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
    //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4
    if (email !== decoded.email) {
        console.log(email, decoded.email);
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are forbidden!');
    }
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.UserModel.findOneAndUpdate({
        email: decoded.email,
        role: decoded.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
});
exports.authUserService = {
    register,
    login,
    changePasswordService,
    refreshToken,
    forgetPasswordService,
    resetPasswordService
};
