"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_interface_1 = require("./user.interface");
const AddressSchema = new mongoose_1.Schema({
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(user_interface_1.UserRole), default: user_interface_1.UserRole.user },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, unique: true, required: true },
    },
    shippingAddress: { type: AddressSchema, required: false, default: {} },
    // billingAddress: { type: AddressSchema, required: false, default: {} },
    status: { type: String, enum: Object.values(user_interface_1.UserStatus), default: user_interface_1.UserStatus.Active },
    isDelete: { type: Boolean, default: false },
    lastLoginDate: { type: Date },
}, { timestamps: true });
// Middleware for hashing password before saving
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const salt = yield bcrypt_1.default.genSalt(10);
            this.password = yield bcrypt_1.default.hash(this.password, salt);
        }
        next();
    });
});
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.default = UserModel;
// /* eslint-disable @typescript-eslint/no-this-alias */
// import mongoose, { Schema, model } from 'mongoose';
// import bcrypt from 'bcrypt';
// import { Address, Profile, User, UserRole, UserStatus } from './user.interface'; // Assuming this file is named user.interface.ts
// // import AppError from '../../Error/errors/AppError';
// // import httpStatus from 'http-status';
// const addressSchema = new Schema<Address>({
//   street: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   country: { type: String },
// }, { _id: false });
// const profileSchema = new Schema<Profile>({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   phone: { type: String },
// }, { _id: false });
// const userSchema = new mongoose.Schema<User>({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   passwordHash: { type: String, required: true },
//   role: { type: String, enum: Object.values(UserRole), default: UserRole.User },
//   profile: profileSchema,
//   address: addressSchema,
//   status: { type: String, enum: Object.values(UserStatus), default: UserStatus.Active },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });
// // // Example of middleware to handle status changes or checks
// // userSchema.pre<User>('save', async function (next) {
// //   if (this.isModified('status') && this.status === UserStatus.Deleted) {
// //     // Handle actions specific to when a user is marked as deleted, such as cleanup
// //     throw new AppError(httpStatus.UNAUTHORIZED, `You are not authorized to create  `);
// //   }
// //   next();
// // });
// // Pre-save middleware to handle email duplication and other validations
// userSchema.pre('save', async function (next) {
//   const user = this;
//   // Check for email duplication
//   if (user.isModified('email')) {
//     const existingUser = await mongoose.model('User').findOne({ email: user.email });
//     if (existingUser) {
//       return next(new Error('Email already exists'));
//     }
//   }
//   // Password hashing
//   if (user.isModified('passwordHash')) {
//     user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
//   }
//   next();
// });
// export const UserModel = model<User>('User', userSchema);
