"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["User"] = "user";
    UserRole["Admin"] = "admin";
    UserRole["Moderator"] = "moderator";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["Active"] = "Active";
    UserStatus["Suspended"] = "Suspended";
    UserStatus["Deleted"] = "Deleted"; // Optional, if you want to manage soft-deletes
})(UserStatus || (exports.UserStatus = UserStatus = {}));
// import { USER_ROLE } from "../../conestants/user.contents";
// export type UserAddress = {
//   street?: string;
//   city?: string;
//   country?: string;
// };
// export type TUser = {
//   firstName: string;
//   lastName: string;
//   // fullName?: string
//   password: string;
//   passwordChangedAt?: Date,
//   email: string;
//   phone: string;
//   role: 'user' | 'admin',
//   isActive?: boolean;
//   isDeleted?: boolean;
//   address?: UserAddress;
// };
// export type TUserRole = keyof typeof USER_ROLE 
