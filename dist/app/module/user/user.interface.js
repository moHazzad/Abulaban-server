"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UserRole = void 0;
/* eslint-disable no-unused-vars */
var UserRole;
(function (UserRole) {
    UserRole["super"] = "super";
    UserRole["admin"] = "admin";
    UserRole["user"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["Active"] = "Active";
    UserStatus["Suspended"] = "Suspended";
    UserStatus["Deleted"] = "Deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
// import mongoose from 'mongoose';
// export type Address = {
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   Province: string;
//   country: string;
// };
// export type Profile = {
//   firstName: string;
//   lastName: string;
//   phone: string;
// };
// export enum UserRole {
//   SuperAdmin = 'superAdmin',
//   Admin = 'admin',
//   User = 'user',
// }
// export enum UserStatus {
//   Active = 'Active',
//   Suspended = 'Suspended',
//   Deleted = 'Deleted'
// }
// export interface User extends mongoose.Document {
//   email: string;
//   passwordHash: string;
//   role: UserRole;
//   profile: Profile;
//   status: UserStatus;
//   shippingAddress: Address;
//   billingAddress: Address;
//   lastLoginDate: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }
// import mongoose from 'mongoose';
// export type Address = {
//   address: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   Province:string;
//   country: string;
// };
// export type Profile = {
//   firstName: string;
//   lastName: string;
//   phone: string;
// };
// export enum UserRole {
//   superAdmin = 'superAdmin',
//   admin = 'admin',
//   user = 'user',
// }
// export enum UserStatus {
//   Active = 'Active',
//   Suspended = 'Suspended',
//   Deleted = 'Deleted'
// }
// export interface User extends mongoose.Document {
//   username: string;
//   email: string;
//   passwordHash: string;
//   role: UserRole;
//   profile: Profile;
//   status: UserStatus;
//   shippingAddress: Address;
//   billingAddress: Address;
//   lastloginDate: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }
