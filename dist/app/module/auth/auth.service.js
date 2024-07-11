"use strict";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import bcrypt from 'bcrypt';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// // import { TUser } from '../user/user.interface';
// import httpStatus from 'http-status';
// import AppError from '../../Error/errors/AppError';
// import { UserModel } from '../user/user.model';
// import { TLogin, TResister } from './auth.interface';
// import config from '../../config';
// import { createToken, verifyToken } from './auth.utils';
// import { sendEmail } from '../../utils/sendEmail';
// // import { createToken } from './auth.utils';
// // import { json } from 'express';
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserService = void 0;
// // const register = async (user: TResister) => {
// //   const result = await UserModel.create({
// //     ...user,
// //     role: 'user',
// //   });
// //   return result;
// // };
// const register = async (user: TResister) => {
//   const result = await UserModel.create({
//     ...user,
//     role: 'user',
//   });
//   // Define the welcome email subject
//   const subject = "Welcome to AWalive Hotel!";
//   // Define the welcome email HTML content
//   const html = `
//     <h1>Welcome to AWalive Hotel!</h1>
//     <p>Dear ${user.email},</p>
//     <p>Thank you for registering at AWalive Hotel. We are delighted to have you with us.</p>
//     <p>We look forward to providing you with a memorable experience.</p>
//     <p>Best regards,</p>
//     <p>The AWalive Hotel Team</p>
//   `;
//   // Send the welcome email
//   await sendEmail(user.email, subject, html);
//   return result;
// };
// // const login = async (loginData: TLogin) => {
// //   console.log(loginData);
// //   const { email, password } = loginData;
// //   // const user = await User.findOne({ email: payload.email }).select('+password') // we can use select if password field not in the db
// //   const user = await UserModel.findOne({ email }).select('+password');
// //   // console.log(user);
// //   if (!user) {
// //     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials');
// //   }
// //   // Compare provided password with the hashed password in the database
// //   const isPasswordValid = await bcrypt.compare(password, user.password);
// //   if (!isPasswordValid) {
// //     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials');
// //   }
// //   const isDeleted = user?.isDeleted;
// //   if (isDeleted) {
// //     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
// //   }
// //   const jwtPayload = {
// //     email: user.email,
// //     role: user.role,
// //   };
// //   const accessToken = createToken(
// //     jwtPayload,
// //     config.jwt_access_token as string,
// //     config.jwt_access_expires_in as string,
// //   );
// //   const refreshToken = createToken(
// //     jwtPayload,
// //     config.jwt_refresh_token as string,
// //     config.jwt_refresh_expires_in as string,
// //   );
// //    return {
// //     accessToken,
// //     refreshToken
// //    }
// // };
// const login = async (loginData: TLogin) => {
//   const { email, password } = loginData;
//   const user = await UserModel.findOne({ email }).select('+password');
//   if (!user || user.isDeleted) { 
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials');
//   }
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials');
//   }
//   const jwtPayload = { email: user.email, role: user.role };
//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_token as string,
//     config.jwt_access_expires_in as string
//   );
//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_token as string,
//     config.jwt_refresh_expires_in as string
//   );
//   // Include additional user information in the response
//   const userInfo = {
//     id: user._id,
//     fullName: `${user.firstName} ${user.lastName}`,
//     phone: user.phone,
//     email: user.email,
//     role: user.role
//   };
//   return { accessToken, refreshToken, user: userInfo };
// };
// const refreshToken = async (token: string) => {
//   // checking if the given token is valid
//   const decoded = verifyToken(token, config.jwt_refresh_token as string);
//   const { email } = decoded;
//   // checking if the user is exist
//   const user = await UserModel.findOne({email});
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//   }
//   // checking if the user is already deleted
//   const isDeleted = user?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
//   }
//   // // checking if the user is blocked
//   // const userStatus = user?.status;
//   // if (userStatus === 'blocked') {
//   //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
//   // }
//   // if (
//   //   user.passwordChangedAt &&
//   //   User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
//   // ) {
//   //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
//   // }
//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//   };
//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_token as string,
//     config.jwt_access_expires_in as string,
//   );
//   return {
//     accessToken,
//   };
// };
// const changePasswordService = async (userData: JwtPayload,  payload: { oldPassword: string; newPassword: string } ) => {
//   // Fetch the user with the password field
//   const user = await UserModel.findOne({ _id: userData._id }).select('+password');
//   if (!user) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
//   }
//   // Compare provided old password with the hashed password in the database
//   const isPasswordValid = await bcrypt.compare(payload.oldPassword, user.password);
//   if (!isPasswordValid) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid old password');
//   }
//   if (user.isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
//   }
//   // Hash the new password
//   const hashedNewPassword = await bcrypt.hash(payload.newPassword, 12);
//   // Update the user document with the new password
//   user.password = hashedNewPassword;
//   user.passwordChangedAt = new Date();
//   await user.save();
//   return { message: 'Password changed successfully' };
// };
// const forgetPasswordService = async (email: string) => {
//   // checking if the user is exist
//   const user = await UserModel.findOne({email});
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//   }
//   // checking if the user is already deleted
//   const isDeleted = user?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
//   }
//   // checking if the user is blocked
//   // const userStatus = user?.status;
//   // if (userStatus === 'blocked') {
//   //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
//   // }
//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//   };
//   const resetToken = createToken(
//     jwtPayload,
//     config.jwt_access_token as string,
//     '10m',
//   );
//   const resetUILink = `${config.reset_pass_ui_link}?id=${user.email}&token=${resetToken} `;
//   // sendEmail(user.email, resetUILink);
//   console.log(resetUILink);
// };
// const resetPasswordService = async (payload: { email: string; newPassword: string },token: string,) => {
//   const {email,newPassword } = payload
//   console.log(email);
//   // checking if the user is exist
//   const user = await UserModel.findOne({email});
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//   }
//   // checking if the user is already deleted
//   const isDeleted = user?.isDeleted;
//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
//   }
//   // // checking if the user is blocked
//   // const userStatus = user?.status;
//   // if (userStatus === 'blocked') {
//   //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
//   // }
//   const decoded = jwt.verify(
//     token,
//     config.jwt_access_token as string,
//   ) as JwtPayload;
//   //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4
//   if (email !== decoded.email) {
//     console.log(email, decoded.email);
//     throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
//   }
//   //hash new password
//   const newHashedPassword = await bcrypt.hash(
//     newPassword,
//     Number(config.bcrypt_salt_rounds),
//   );
//   await UserModel.findOneAndUpdate(
//     {
//       email: decoded.email,
//       role: decoded.role,
//     },
//     {
//       password: newHashedPassword,
//       passwordChangedAt: new Date(),
//     },
//   );
// };
exports.authUserService = {
// register,
// login,
// changePasswordService,
// refreshToken,
// forgetPasswordService,
// resetPasswordService
};
